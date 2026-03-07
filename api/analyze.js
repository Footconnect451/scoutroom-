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

  const prompt = `Tu es le directeur sportif d'un club professionnel qui monte en D2 en Andorre (été 2026).
URL Transfermarkt du joueur : ${tmUrl}

Utilise la recherche web pour récupérer TOUTES les infos disponibles :
IDENTITÉ : nom complet, nationalité(s), date de naissance (format JJ/MM/AAAA), âge, taille (cm), pied fort, poste principal, postes secondaires, rôle exact (GK/DEF/MIL/ATT uniquement)
CONTRAT : club actuel, ligue + niveau (ex: France N2 (D4)), valeur marchande TM en €, date début contrat, date fin contrat, agent connu
STATS saison en cours : matchs joués, minutes, buts, passes décisives, xG, xA, note SofaScore moyenne, duels gagnés %, % passes réussies, cartons J/R
CRITÈRES ANDORRE : passeport UE (Oui/Non), parle espagnol ou catalan (Oui/Non/Basique)
ÉVALUATION : 2-3 points forts clés, 1-2 points faibles, commentaire factuel 2 phrases max.

Réponds UNIQUEMENT avec un objet JSON valide sans markdown :
{"nom":"","nationalite":"","ddn":"","age":"","taille":"","pied":"","poste":"","role":"","postesSec":"","club":"","ligue":"","valeur":"","debutContrat":"","finContrat":"","salaire":"","agent":"","matchs":"","minutes":"","buts":"","passes":"","xG":"","xA":"","noteSS":"","duels":"","passePct":"","cartons":"","passeportUE":"","espCatalan":"","pointsForts":"","pointsFaibles":"","commentaires":"","statut":"Identifié","priorite":"★★","categorie":"CIBLE"}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1200,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
    const match = text.match(/\{[\s\S]*\}/);
    let player = null;
    if (match) { try { player = JSON.parse(match[0]); } catch(e) {} }
    
    if (!player) {
      const slug = tmUrl.match(/transfermarkt\.[a-z]+\/([^\/]+)\//)?.[1] || 'joueur';
      const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      player = { nom: name, commentaires: 'Données partielles — compléter manuellement.', statut: 'Identifié', priorite: '★★', categorie: 'CIBLE' };
    }

    res.status(200).json({ player });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
