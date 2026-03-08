import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ebisacqpllyljnyjjhek.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// ─── Upload image vers Supabase Storage ───
async function fetchAndStoreImage(imageUrl, bucket, storagePath) {
  if (!imageUrl || !SUPABASE_SERVICE_KEY) return null;
  try {
    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const imgRes = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer':    'https://www.transfermarkt.fr/',
        'Accept':     'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9',
      }
    });

    if (!imgRes.ok) {
      console.log(`Image fetch failed ${imgRes.status} for ${imageUrl}`);
      return null;
    }

    const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
    if (contentType.includes('text/html')) {
      console.log('Got HTML instead of image, skipping');
      return null;
    }

    const buffer = await imgRes.arrayBuffer();
    if (buffer.byteLength < 1000) {
      console.log('Image too small, probably placeholder');
      return null;
    }

    const { error } = await sb.storage.from(bucket).upload(storagePath, buffer, {
      contentType,
      upsert: true,
    });

    if (error) {
      console.error('Storage upload error:', error.message);
      return null;
    }

    const { data: { publicUrl } } = sb.storage.from(bucket).getPublicUrl(storagePath);
    return publicUrl + '?v=' + Date.now();
  } catch (e) {
    console.error('fetchAndStoreImage error:', e.message);
    return null;
  }
}

// ─── Extraire URL logo club depuis le HTML de TM ───
function extractClubLogo(html) {
  const patterns = [
    /tmssl\.akamaized\.net\/images\/wappen\/normquad\/(\d+)\.[a-z]+/,
    /tmssl\.akamaized\.net\/images\/wappen\/[^"'\s<>]+/,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) {
      const url = m[0].startsWith('http') ? m[0] : 'https://' + m[0];
      return url.split('?')[0];
    }
  }
  return null;
}

/* ══════════════════════════════════════════════════════════
   FIX — Normaliser la valeur marchande
   Gère : "9 M€", "9M", "9.000.000 €", "9000000", "900K", "900 k€", etc.
══════════════════════════════════════════════════════════ */
function normalizeValeur(raw) {
  if (!raw) return '';
  let s = String(raw).trim();
  
  // Retirer symboles monétaires et espaces
  s = s.replace(/[€$£\s]/g, '');
  
  // Gestion "M" (millions) : "9M" → "9000000", "1.5M" → "1500000", "1,5M" → "1500000"
  const mMatch = s.match(/^([0-9]+[.,]?[0-9]*)M$/i);
  if (mMatch) {
    const num = parseFloat(mMatch[1].replace(',', '.'));
    return String(Math.round(num * 1000000));
  }
  
  // Gestion "K" (milliers) : "900K" → "900000", "1.5K" → "1500"
  const kMatch = s.match(/^([0-9]+[.,]?[0-9]*)K$/i);
  if (kMatch) {
    const num = parseFloat(kMatch[1].replace(',', '.'));
    return String(Math.round(num * 1000));
  }
  
  // Gestion "Mio" ou "mio." : "9 Mio." → "9000000"
  const mioMatch = s.match(/^([0-9]+[.,]?[0-9]*)mio\.?$/i);
  if (mioMatch) {
    const num = parseFloat(mioMatch[1].replace(',', '.'));
    return String(Math.round(num * 1000000));
  }

  // Gestion nombres avec séparateurs : "9.000.000" → "9000000", "9,000,000" → "9000000"
  // Si le nombre contient des points/virgules comme séparateurs de milliers
  const cleaned = s.replace(/\./g, '').replace(/,/g, '');
  const parsed = parseInt(cleaned, 10);
  if (!isNaN(parsed) && parsed > 0) {
    return String(parsed);
  }
  
  // Fallback : retourner tel quel
  return raw;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { tmUrl } = req.body;
  if (!tmUrl) return res.status(400).json({ error: 'Missing tmUrl' });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const playerId = tmUrl.match(/spieler\/(\d+)/)?.[1];

  const playerPhotoUrl = playerId
    ? `https://img.transfermarkt.com/portrait/big/${playerId}.jpg`
    : null;

  let clubLogoTmUrl = null;
  try {
    const pageRes = await fetch(tmUrl.replace('http://', 'https://'), {
      headers: {
        'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        'Referer':         'https://www.transfermarkt.fr/',
        'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cache-Control':   'no-cache',
      }
    });
    if (pageRes.ok) {
      const html = await pageRes.text();
      clubLogoTmUrl = extractClubLogo(html);
      console.log('Club logo URL found:', clubLogoTmUrl);
    } else {
      console.log('TM page fetch status:', pageRes.status);
    }
  } catch(e) {
    console.log('TM page fetch failed:', e.message);
  }

  // ─── FIX: Prompt amélioré pour la valeur ───
  const prompt = `Tu es le directeur sportif d'un club professionnel qui monte en D2 en Andorre (été 2026).
URL Transfermarkt du joueur : ${tmUrl}

Utilise la recherche web pour récupérer TOUTES les infos disponibles :
IDENTITÉ : nom complet, nationalité(s), date de naissance (format JJ/MM/AAAA), âge, taille (cm), pied fort, poste principal, postes secondaires, rôle exact (GK/DEF/MIL/ATT uniquement)
CONTRAT : club actuel, ligue + niveau (ex: France N2 (D4)), valeur marchande TM, date début contrat, date fin contrat, agent connu
STATS saison en cours : matchs joués, minutes, buts, passes décisives, xG, xA, note SofaScore moyenne, duels gagnés %, % passes réussies, cartons J/R
CRITÈRES ANDORRE : passeport UE (Oui/Non), parle espagnol ou catalan (Oui/Non/Basique)
ÉVALUATION : 2-3 points forts clés, 1-2 points faibles, commentaire factuel 2 phrases max.

⚠️ RÈGLES STRICTES POUR LE JSON :
- "valeur" : NOMBRE ENTIER EN EUROS sans espace, sans M, sans €, sans K. Exemples : si TM affiche 9 M€ tu écris "9000000", si 500 K€ tu écris "500000", si 100 000 tu écris "100000".
- "salaire" : NOMBRE ENTIER en €/mois si connu, sinon vide.
- Tous les champs texte en français.

Réponds UNIQUEMENT avec un objet JSON valide sans markdown ni backticks :
{"nom":"","nationalite":"","ddn":"","age":"","taille":"","pied":"","poste":"","role":"","postesSec":"","club":"","ligue":"","valeur":"","debutContrat":"","finContrat":"","salaire":"","agent":"","matchs":"","minutes":"","buts":"","passes":"","xG":"","xA":"","noteSS":"","duels":"","passePct":"","cartons":"","passeportUE":"","espCatalan":"","pointsForts":"","pointsFaibles":"","commentaires":"","statut":"Identifié","priorite":"★★","categorie":"CIBLE"}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1200,
        tools:      [{ type: 'web_search_20250305', name: 'web_search' }],
        messages:   [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data    = await response.json();
    const rawText = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
    const text    = rawText
      .replace(/<cite[^>]*>/gi, '').replace(/<\/cite>/gi, '')
      .replace(/```json/gi, '').replace(/```/g, '').trim();
    const match   = text.match(/\{[\s\S]*\}/);
    let player    = null;
    if (match) {
      try { player = JSON.parse(match[0]); } catch(e) {
        const cleaned = match[0].replace(/[\x00-\x1F\x7F]/g, ' ');
        try { player = JSON.parse(cleaned); } catch(e2) {}
      }
    }
    if (!player) {
      const slug = tmUrl.match(/transfermarkt\.[a-z]+\/([^\/]+)\//)?.[1] || 'joueur';
      const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      player = { nom: name, commentaires: 'Données partielles — compléter manuellement.', statut: 'Identifié', priorite: '★★', categorie: 'CIBLE' };
    }

    // ─── FIX: Normaliser la valeur côté serveur ───
    if (player.valeur) {
      player.valeur = normalizeValeur(player.valeur);
    }

    const clubSlug = playerId
      ? playerId
      : (player.club || 'club').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    const [storedPhotoUrl, storedLogoUrl] = await Promise.all([
      playerPhotoUrl
        ? fetchAndStoreImage(playerPhotoUrl, 'player-photos', `players/${playerId || Date.now()}.jpg`)
        : Promise.resolve(null),
      clubLogoTmUrl
        ? fetchAndStoreImage(clubLogoTmUrl, 'player-photos', `clubs/${clubSlug}-logo.png`)
        : Promise.resolve(null),
    ]);

    if (storedPhotoUrl) player.photoUrl    = storedPhotoUrl;
    if (storedLogoUrl)  player.clubLogoUrl = storedLogoUrl;

    console.log('Photo stored:', storedPhotoUrl ? '✅' : '❌');
    console.log('Logo stored:', storedLogoUrl ? '✅' : '❌');
    console.log('Valeur brute → normalisée:', player.valeur);

    res.status(200).json({ player });
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ error: err.message });
  }
}
