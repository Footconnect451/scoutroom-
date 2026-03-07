import { useState, useEffect, useCallback } from "react";

/* ══════════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#07101f;--card:#0d1d33;--card2:#101f36;--border:#1c2e47;--border2:#243a57;
  --gold:#f5a623;--gold2:#ffc55a;--white:#eef2f8;--muted:#5a7a9a;--dim:#3a5570;
  --green:#22c55e;--red:#ef4444;--blue:#3b82f6;--orange:#f97316;--purple:#a855f7;--cyan:#06b6d4;
  --gk:#1e3a5f;--gkc:#60a5fa;--def:#14532d;--defc:#4ade80;--mil:#1e3a6e;--milc:#93c5fd;--att:#7f1d1d;--attc:#fca5a5;
}
html,body{background:var(--bg);color:var(--white);font-family:'Inter',sans-serif;min-height:100vh;font-size:14px}

/* ── TOPBAR ── */
.topbar{background:#060e1c;border-bottom:1px solid var(--border);padding:0 24px;height:58px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200}
.logo{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:2px;color:var(--gold);display:flex;align-items:center;gap:8px}
.logo-sub{color:var(--muted);font-size:11px;font-family:'Inter',sans-serif;font-weight:500;letter-spacing:.5px}
.tabs{display:flex;gap:2px}
.tab{padding:6px 14px;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;border:none;background:transparent;color:var(--muted);transition:all .18s;letter-spacing:.2px;white-space:nowrap}
.tab:hover{color:var(--white);background:var(--border)}
.tab.active{color:var(--bg);background:var(--gold);font-weight:700}
.tab-badge{display:inline-block;background:rgba(255,255,255,.15);border-radius:10px;padding:1px 6px;font-size:10px;margin-left:4px;font-weight:700}
.tab.active .tab-badge{background:rgba(0,0,0,.2)}

/* ── LAYOUT ── */
.main{padding:24px;max-width:1400px;margin:0 auto}
.page-title{font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:2px;margin-bottom:4px}
.page-sub{font-size:12px;color:var(--muted);margin-bottom:20px}

/* ── BUTTONS ── */
.btn{padding:8px 18px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;border:none;transition:all .18s;display:inline-flex;align-items:center;gap:6px;font-family:'Inter',sans-serif;white-space:nowrap}
.btn-gold{background:var(--gold);color:var(--bg)}
.btn-gold:hover:not(:disabled){background:var(--gold2)}
.btn-gold:disabled{opacity:.4;cursor:not-allowed}
.btn-ghost{background:transparent;color:var(--muted);border:1px solid var(--border)}
.btn-ghost:hover{color:var(--white);border-color:var(--dim)}
.btn-sm{padding:5px 11px;font-size:11px;border-radius:6px}
.btn-red{background:rgba(239,68,68,.12);color:var(--red);border:1px solid rgba(239,68,68,.25)}
.btn-red:hover{background:rgba(239,68,68,.22)}
.btn-blue{background:rgba(59,130,246,.12);color:var(--blue);border:1px solid rgba(59,130,246,.25)}

/* ── CARDS ── */
.card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px}
.card-sm{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px}

/* ── KPI ROW ── */
.kpi-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:24px}
.kpi{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px 16px}
.kpi-n{font-family:'Bebas Neue',sans-serif;font-size:34px;line-height:1}
.kpi-l{font-size:11px;color:var(--muted);margin-top:3px}

/* ── TABLE ── */
.tbl-wrap{overflow-x:auto;border-radius:10px;border:1px solid var(--border)}
table{width:100%;border-collapse:collapse;font-size:12px}
thead tr{background:#0a1828}
th{padding:10px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);white-space:nowrap;border-bottom:1px solid var(--border)}
td{padding:9px 12px;border-bottom:1px solid rgba(28,46,71,.5);vertical-align:middle;white-space:nowrap}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(255,255,255,.02)}
.tbl-row-eff td{background:rgba(34,197,94,.03)}
.tbl-row-cib td{background:rgba(168,85,247,.03)}

/* ── TAGS ── */
.tag{display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:12px;letter-spacing:.4px;text-transform:uppercase}
.tag-gk{background:var(--gk);color:var(--gkc)}
.tag-def{background:var(--def);color:var(--defc)}
.tag-mil{background:var(--mil);color:var(--milc)}
.tag-att{background:var(--att);color:var(--attc)}
.tag-staff{background:#2d1f5e;color:#c4b5fd}
.tag-gold{background:rgba(245,166,35,.15);color:var(--gold);border:1px solid rgba(245,166,35,.25)}
.tag-green{background:rgba(34,197,94,.12);color:var(--green)}
.tag-red{background:rgba(239,68,68,.12);color:var(--red)}
.tag-orange{background:rgba(249,115,22,.12);color:var(--orange)}
.tag-blue{background:rgba(59,130,246,.12);color:var(--blue)}
.tag-purple{background:rgba(168,85,247,.12);color:var(--purple)}
.tag-gray{background:rgba(90,122,154,.12);color:var(--muted)}

/* STATUS */
.status{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:600;padding:3px 9px;border-radius:12px;letter-spacing:.5px;text-transform:uppercase}
.status-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.st-id{background:rgba(90,122,154,.12);color:#7a9aba}
.st-co{background:rgba(59,130,246,.12);color:var(--blue)}
.st-ob{background:rgba(168,85,247,.12);color:var(--purple)}
.st-ne{background:rgba(249,115,22,.12);color:var(--orange)}
.st-si{background:rgba(34,197,94,.12);color:var(--green)}
.st-re{background:rgba(239,68,68,.12);color:var(--red)}
.st-sc{background:rgba(34,197,94,.12);color:var(--green)}

/* PRIO */
.prio-3{color:var(--red);font-size:13px}
.prio-2{color:var(--orange);font-size:13px}
.prio-1{color:var(--muted);font-size:13px}

/* CONTRACT ALERT */
.ct-red{color:var(--red);font-weight:600}
.ct-orange{color:var(--orange);font-weight:600}

/* ── DASHBOARD ── */
.dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
.postes-table{width:100%;border-collapse:collapse;font-size:12px}
.postes-table th{padding:8px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted)}
.postes-table td{padding:8px 12px;border-top:1px solid var(--border)}
.urg-urgent{background:rgba(239,68,68,.12);color:var(--red);border:1px solid rgba(239,68,68,.25);border-radius:6px;padding:2px 8px;font-size:10px;font-weight:700}
.urg-important{background:rgba(249,115,22,.12);color:var(--orange);border:1px solid rgba(249,115,22,.25);border-radius:6px;padding:2px 8px;font-size:10px;font-weight:700}
.urg-souhaitable{background:rgba(34,197,94,.12);color:var(--green);border:1px solid rgba(34,197,94,.25);border-radius:6px;padding:2px 8px;font-size:10px;font-weight:700}

/* KANBAN */
.kanban{display:flex;gap:10px;overflow-x:auto;padding-bottom:6px}
.kol{min-width:150px;background:var(--card2);border:1px solid var(--border);border-radius:10px;padding:12px}
.kol-hdr{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between}
.kol-count{background:rgba(255,255,255,.08);border-radius:8px;padding:1px 7px;font-size:11px}
.kcard{background:var(--card);border:1px solid var(--border);border-radius:7px;padding:8px 10px;margin-bottom:7px;font-size:11px}
.kcard-name{font-weight:600;margin-bottom:3px}
.kcard-pos{color:var(--muted);font-size:10px}

/* ── FICHE JOUEUR ── */
.fiche-header{background:linear-gradient(135deg,#0b1e38,#091528);border:1px solid var(--border);border-radius:14px;padding:24px 28px;margin-bottom:16px;display:flex;gap:20px;align-items:flex-start}
.fiche-avatar{width:72px;height:72px;border-radius:12px;background:linear-gradient(135deg,var(--border),var(--bg));display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;border:1px solid var(--border2)}
.fiche-name{font-family:'Bebas Neue',sans-serif;font-size:32px;letter-spacing:1px;line-height:1;margin-bottom:8px}
.fiche-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.fiche-actions{display:flex;flex-direction:column;gap:6px;align-items:flex-end;margin-left:auto;flex-shrink:0}

.fiche-section{background:var(--card);border:1px solid var(--border);border-radius:10px;margin-bottom:12px;overflow:hidden}
.fiche-section-hdr{padding:10px 16px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px}
.fiche-body{padding:14px 16px}
.fiche-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.fiche-grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.fiche-field{display:flex;flex-direction:column;gap:4px}
.fiche-label{font-size:10px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;color:var(--muted)}
.fiche-val{font-size:13px;font-weight:500}
.fiche-val-empty{color:var(--dim);font-style:italic;font-size:12px}

.stat-boxes{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:0}
.stat-box{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px;text-align:center}
.stat-n{font-family:'Bebas Neue',sans-serif;font-size:26px;color:var(--gold);line-height:1}
.stat-l{font-size:10px;color:var(--muted);margin-top:3px}

.notes-area{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:12px 14px;font-size:12px;color:#7a9aba;line-height:1.7;font-style:italic}

/* ── URL INPUT PAGE ── */
.url-page{max-width:680px;margin:40px auto}
.url-hero{text-align:center;margin-bottom:32px}
.url-hero h1{font-family:'Bebas Neue',sans-serif;font-size:44px;letter-spacing:3px;background:linear-gradient(135deg,var(--white) 40%,var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;margin-bottom:8px}
.url-hero p{color:var(--muted);font-size:13px}
.url-box{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:20px;transition:border-color .2s}
.url-box:focus-within{border-color:var(--gold)}
.url-lbl{font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--gold);text-transform:uppercase;margin-bottom:8px}
.url-row{display:flex;gap:8px}
.url-input{flex:1;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:11px 14px;color:var(--white);font-family:'JetBrains Mono',monospace;font-size:12px;outline:none;transition:border-color .2s}
.url-input::placeholder{color:var(--dim)}
.url-input:focus{border-color:var(--gold)}

/* LOADING */
.loading{text-align:center;padding:60px 20px}
.spinner{width:36px;height:36px;border:2.5px solid var(--border);border-top-color:var(--gold);border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 16px}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-title{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:2px;margin-bottom:8px}
.loading-step{font-size:13px;color:var(--muted)}

/* MODAL */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px)}
.modal{background:var(--card);border:1px solid var(--border);border-radius:16px;width:100%;max-width:640px;max-height:90vh;overflow-y:auto;padding:24px;animation:fadeUp .25s ease}
.modal-lg{max-width:900px}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.modal-title{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:1.5px;margin-bottom:18px;display:flex;align-items:center;gap:10px;justify-content:space-between}
.modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px;padding-top:16px;border-top:1px solid var(--border)}

/* FORM */
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.form-field{display:flex;flex-direction:column;gap:5px}
.form-field.full{grid-column:span 2}
.form-lbl{font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--muted)}
.form-input,.form-select,.form-textarea{background:var(--bg);border:1px solid var(--border);border-radius:7px;padding:9px 11px;color:var(--white);font-family:'Inter',sans-serif;font-size:12px;outline:none;transition:border-color .2s;width:100%}
.form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--gold)}
.form-select option{background:var(--card)}
.form-textarea{resize:vertical;min-height:72px}

/* BUDGET */
.budget-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px}
.budget-kpi{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px 16px}
.budget-kpi-n{font-family:'Bebas Neue',sans-serif;font-size:28px;color:var(--gold)}
.budget-kpi-l{font-size:11px;color:var(--muted);margin-top:2px}
.budget-input-n{background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:6px 10px;color:var(--gold);font-family:'Bebas Neue',sans-serif;font-size:20px;outline:none;width:100%;text-align:center}

/* GUIDE */
.guide-section{background:var(--card);border:1px solid var(--border);border-radius:10px;margin-bottom:12px;overflow:hidden}
.guide-hdr{padding:12px 16px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid var(--border);cursor:pointer;display:flex;align-items:center;justify-content:space-between;user-select:none}
.guide-hdr:hover{background:rgba(255,255,255,.02)}
.guide-body{padding:0}
.guide-row{display:grid;grid-template-columns:220px 1fr;border-top:1px solid rgba(28,46,71,.5)}
.guide-row:first-child{border-top:none}
.guide-key{padding:10px 14px;font-size:11px;font-weight:600;color:var(--white);background:rgba(255,255,255,.02);border-right:1px solid rgba(28,46,71,.5)}
.guide-val{padding:10px 14px;font-size:12px;color:#7a9aba;line-height:1.6}

/* FILTER BAR */
.filter-bar{display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap;align-items:center}
.filter-btn{padding:5px 12px;border-radius:16px;font-size:11px;font-weight:500;cursor:pointer;border:1px solid var(--border);background:transparent;color:var(--muted);transition:all .15s;font-family:'Inter',sans-serif}
.filter-btn:hover{color:var(--white);border-color:var(--dim)}
.filter-btn.active{background:var(--gold);color:var(--bg);border-color:var(--gold);font-weight:700}
.search{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:6px 12px;color:var(--white);font-size:12px;outline:none;transition:border-color .2s;font-family:'Inter',sans-serif}
.search::placeholder{color:var(--dim)}
.search:focus{border-color:var(--gold)}

/* QUICK LINKS */
.quick-grid{display:flex;flex-wrap:wrap;gap:6px;margin-top:16px}

/* SYNC STATUS */
.sync-bar{display:flex;gap:12px;align-items:center}
.sync-pill{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--muted)}
.sync-dot{width:7px;height:7px;border-radius:50%}

/* INFO BOX */
.info{background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);border-radius:8px;padding:10px 14px;font-size:12px;color:#93c5fd;line-height:1.6;display:flex;gap:8px}
.warn{background:rgba(245,166,35,.08);border:1px solid rgba(245,166,35,.2);border-radius:8px;padding:10px 14px;font-size:12px;color:var(--gold);line-height:1.6;display:flex;gap:8px}
.err{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:8px;padding:10px 14px;font-size:12px;color:var(--red);line-height:1.6;display:flex;gap:8px;margin-bottom:12px}

/* EXPORT BTN ROW */
.tbl-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.tbl-title{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:1.5px}

/* SCROLLBAR */
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}

@media(max-width:768px){
  .kpi-grid{grid-template-columns:repeat(3,1fr)}
  .dash-grid{grid-template-columns:1fr}
  .fiche-grid{grid-template-columns:repeat(2,1fr)}
  .stat-boxes{grid-template-columns:repeat(3,1fr)}
  .form-grid{grid-template-columns:1fr}
  .form-field.full{grid-column:span 1}
  .tabs{display:none}
  .main{padding:14px}
}
`;

/* ══════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════ */
const STATUTS = ["Identifié","Contacté","Observé","En négociation","Signé","Refusé","Sous contrat"];
const PRIOS   = ["★★★","★★","★"];
const ROLES   = ["GK","DEF","MIL","ATT","STAFF"];
const POSTES  = ["Gardien","Défenseur central","Latéral droit","Latéral gauche","Milieu défensif","Milieu central","Milieu offensif","Ailier droit","Ailier gauche","Avant-centre","Second attaquant","Polyvalent","Entraîneur","Staff"];
const LIGUES  = ["Andorre D1","Andorre D2","France N (D3)","France N2 (D4)","France N3 (D5)","Espagne D4","Espagne D5","Autre Europe","Hors Europe","Sans club"];
const ROLE_E  = {GK:"🧤",DEF:"🛡️",MIL:"⚙️",ATT:"⚡",STAFF:"📋"};

const ST_CLS = {
  "Identifié":"st-id","Contacté":"st-co","Observé":"st-ob",
  "En négociation":"st-ne","Signé":"st-si","Refusé":"st-re","Sous contrat":"st-sc"
};

function ctAlert(fin){
  if(!fin||fin==="—") return null;
  const y = parseInt(fin.slice(-4));
  if(isNaN(y)) return null;
  if(y<=2025) return "red";
  if(y<=2026) return "orange";
  return null;
}

const emptyPlayer = () => ({
  id:Date.now(),
  nom:"",nationalite:"",ddn:"",age:"",taille:"",pied:"",
  poste:"",role:"ATT",postesSec:"",
  club:"",ligue:"",valeur:"",debutContrat:"",finContrat:"",
  salaire:"",agent:"",contactAgent:"",statutContrat:"",indemnite:"",
  competition:"",matchs:"",minutes:"",buts:"",passes:"",xG:"",xA:"",
  noteSS:"",duels:"",passePct:"",cartons:"",blessures:"",
  passeportUE:"",permis:"",espCatalan:"",altitude:"",dispo:"",
  pointsForts:"",pointsFaibles:"",fit:"",compatSal:"",recommande:"",
  dateContact:"",retourJoueur:"",decision:"",commentaires:"",
  statut:"Identifié",priorite:"★★",categorie:"CIBLE",
  tmUrl:"",ssUrl:"",videoUrl:"",
});

/* ══════════════════════════════════════════════════════════
   DEMO DATA
══════════════════════════════════════════════════════════ */
const DEMO_EFF = [
  {id:101,nom:"Armando Leon",nationalite:"Mexique",ddn:"18/01/2000",age:"25",taille:"189",pied:"Droit",poste:"Avant-centre",role:"ATT",club:"FC Santa Coloma",ligue:"Andorre D1",valeur:"300000",finContrat:"30/06/2026",matchs:"",buts:"",passes:"",statut:"Sous contrat",priorite:"★★★",categorie:"EFFECTIF",tmUrl:"https://www.transfermarkt.fr/armando-leon/profil/spieler/760988",commentaires:"⚠️ Vérif club: aussi cité Rànger's"},
  {id:102,nom:"Karim Diagne",nationalite:"France",ddn:"30/12/1999",age:"25",taille:"180",pied:"Droit",poste:"Milieu défensif",role:"MIL",club:"FC Pas de la Casa",ligue:"Andorre D1",valeur:"100000",finContrat:"30/06/2026",matchs:"49",buts:"",passes:"",statut:"Sous contrat",priorite:"★★★",categorie:"EFFECTIF",tmUrl:"https://www.transfermarkt.fr/karim-diagne/profil/spieler/733820",commentaires:"Postes 2: Latéral droit"},
  {id:103,nom:"Javi Lopez",nationalite:"Espagne",ddn:"21/04/1990",age:"35",taille:"180",pied:"Gauche",poste:"Latéral gauche",role:"DEF",club:"FC Pas de la Casa",ligue:"Andorre D1",valeur:"50000",finContrat:"12/08/2027",matchs:"90",buts:"1",passes:"2",statut:"Sous contrat",priorite:"★★★",categorie:"EFFECTIF",tmUrl:"https://www.transfermarkt.fr/javi-lopez/leistungsdatendetails/spieler/388511",commentaires:"Option 2 ans bilatérale. Postes 2: DC"},
  {id:104,nom:"Iker Alvarez",nationalite:"Andorre",ddn:"16/09/2003",age:"21",taille:"",pied:"",poste:"Latéral gauche",role:"DEF",club:"FS La Massana",ligue:"Andorre D2",valeur:"50000",finContrat:"30/06/2026",matchs:"",buts:"",passes:"",statut:"Sous contrat",priorite:"★★★",categorie:"EFFECTIF",tmUrl:"https://www.transfermarkt.fr/iker-alvarez/profil/spieler/724631",commentaires:"Ex-Andorra U21 (8 caps)"},
  {id:105,nom:"Marti Riverola",nationalite:"Espagne",ddn:"26/01/1991",age:"34",taille:"177",pied:"Droit",poste:"Milieu central",role:"MIL",club:"FS La Massana",ligue:"Andorre D2",valeur:"",finContrat:"30/06/2026",matchs:"329",buts:"26",passes:"28",statut:"Sous contrat",priorite:"★★★",categorie:"EFFECTIF",tmUrl:"https://www.transfermarkt.fr/marti-riverola/profil/spieler/143863",commentaires:"Manager du club aussi. Postes 2: MO"},
  {id:106,nom:"Nathan Deville",nationalite:"France",ddn:"17/04/2003",age:"22",taille:"180",pied:"",poste:"Gardien",role:"GK",club:"FC Pas de la Casa",ligue:"Andorre D1",valeur:"50000",finContrat:"30/06/2026",matchs:"",buts:"",passes:"",statut:"Sous contrat",priorite:"★★",categorie:"EFFECTIF",tmUrl:"https://www.transfermarkt.com/nathan-deville/profil/spieler/1381338",commentaires:"Dernière prolong. 30/08/2025"},
];
const DEMO_CIB = [
  {id:201,nom:"Victor Poisson",nationalite:"France",ddn:"05/06/2000",age:"25",taille:"198",pied:"Droit",poste:"Gardien",role:"GK",club:"Sans club",ligue:"—",valeur:"",finContrat:"—",matchs:"",buts:"",passes:"",statut:"Contacté",priorite:"★★★",categorie:"CIBLE",agent:"Goalactic",passeportUE:"Oui",tmUrl:"https://www.transfermarkt.fr/victor-poisson/profil/spieler/981785",commentaires:"Libre depuis 01/07/2025. Dernier: Dijon. 198cm."},
  {id:202,nom:"Albertin",nationalite:"Espagne",ddn:"06/04/1995",age:"30",taille:"",pied:"Droit",poste:"Milieu central",role:"MIL",club:"Atlético Astorga",ligue:"Espagne D4",valeur:"",finContrat:"30/06/2026",matchs:"",buts:"",passes:"",statut:"Contacté",priorite:"★★★",categorie:"CIBLE",agent:"No agent",passeportUE:"Oui",tmUrl:"https://www.transfermarkt.fr/albertin/profil/spieler/809519",commentaires:"Sans agent — contact direct. Postes 2: DC"},
  {id:203,nom:"Ludovic Faucher",nationalite:"France",ddn:"10/03/1998",age:"27",taille:"174",pied:"Les deux",poste:"Milieu central",role:"MIL",club:"Stade Poitevin FC",ligue:"France N2 (D4)",valeur:"",finContrat:"",matchs:"",buts:"",passes:"",statut:"Contacté",priorite:"★★★",categorie:"CIBLE",agent:"Talent Sport",passeportUE:"Oui",tmUrl:"https://www.transfermarkt.fr/ludovic-faucher/profil/spieler/820386",commentaires:"Postes 2: MO"},
  {id:204,nom:"Dylan Okyere",nationalite:"France/Ghana",ddn:"18/07/2001",age:"24",taille:"170",pied:"Gauche",poste:"Ailier droit",role:"ATT",club:"Nîmes Olympique",ligue:"France N2 (D4)",valeur:"",finContrat:"",matchs:"",buts:"",passes:"",statut:"Contacté",priorite:"★★★",categorie:"CIBLE",agent:"Talent Sport",passeportUE:"Oui",tmUrl:"https://www.transfermarkt.fr/dylan-okyere/profil/spieler/983288",commentaires:"Postes 2: AG, 2e ATT"},
  {id:205,nom:"Thomas Carbonero",nationalite:"France/Espagne",ddn:"18/09/2001",age:"24",taille:"175",pied:"Droit",poste:"Latéral droit",role:"DEF",club:"Aubagne FC",ligue:"France N (D3)",valeur:"100000",finContrat:"30/06/2025",matchs:"",buts:"",passes:"",statut:"Observé",priorite:"★★★",categorie:"CIBLE",passeportUE:"Oui",tmUrl:"https://www.transfermarkt.fr/thomas-carbonero/leistungsdatendetails/spieler/626589",commentaires:"Contrat expiré. Postes 2: LG"},
  {id:206,nom:"Juanda Terradez",nationalite:"Espagne/France",ddn:"17/05/2005",age:"20",taille:"",pied:"",poste:"Gardien",role:"GK",club:"FC Rànger's",ligue:"Andorre D1",valeur:"200000",finContrat:"30/06/2026",matchs:"",buts:"",passes:"",statut:"Observé",priorite:"★★★",categorie:"CIBLE",passeportUE:"Oui",tmUrl:"https://www.transfermarkt.fr/juanda-terradez/leistungsdaten/spieler/1319364",commentaires:"Parents esp, grand-mères fra/écu"},
];

/* ══════════════════════════════════════════════════════════
   EXPORT
══════════════════════════════════════════════════════════ */
const COLS = ["Name","Nationalité","Date naissance","Âge","Taille cm","Pied","Poste","Rôle","Poste secondaires","Club","Ligue","Valeur €","Début contrat","Fin contrat","Salaire €/mois","Matchs","Buts","Passes D.","xG","xA","Note SS","Statut","Priorité","Catégorie","Agent","Passeport UE","Esp-Catalan","TM URL","SofaScore URL","Points forts","Commentaires"];
function toRow(p){ return [p.nom,p.nationalite,p.ddn,p.age,p.taille,p.pied,p.poste,p.role,p.postesSec||"",p.club,p.ligue,p.valeur,p.debutContrat||"",p.finContrat,p.salaire||"",p.matchs,p.buts,p.passes,p.xG||"",p.xA||"",p.noteSS||"",p.statut,p.priorite,p.categorie,p.agent||"",p.passeportUE||"",p.espCatalan||"",p.tmUrl,p.ssUrl||"",p.pointsForts||"",p.commentaires].map(v=>`"${(v||"").toString().replace(/"/g,'""')}"`); }
function exportCSV(players){
  const rows=[COLS.map(h=>`"${h}"`).join(","),...players.map(p=>toRow(p).join(","))];
  const blob=new Blob(["\uFEFF"+rows.join("\n")],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download=`ScoutRoom_${new Date().toISOString().slice(0,10)}.csv`; a.click();
  URL.revokeObjectURL(url);
}

/* ══════════════════════════════════════════════════════════
   AI ANALYZE
══════════════════════════════════════════════════════════ */
async function aiAnalyze(tmUrl, onStep){
  onStep("🔍 Lecture de l'URL Transfermarkt...");
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

  onStep("⚽ Recherche des données joueur...");
  const res = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:1200,
      tools:[{type:"web_search_20250305",name:"web_search"}],
      messages:[{role:"user",content:prompt}]
    })
  });
  if(!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  onStep("📊 Traitement de la fiche...");
  const text=(data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("\n");
  const match=text.match(/\{[\s\S]*\}/);
  let d=null;
  if(match){try{d=JSON.parse(match[0]);}catch(e){}}
  if(!d){
    const slug=tmUrl.match(/transfermarkt\.[a-z]+\/([^\/]+)\//)?.[1]||"joueur";
    const name=slug.split("-").map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(" ");
    d={nom:name,commentaires:"Données partielles — compléter manuellement.",statut:"Identifié",priorite:"★★",categorie:"CIBLE"};
  }
  onStep("✅ Fiche complète !");
  return {...emptyPlayer(),...d,tmUrl,id:Date.now()};
}

/* ══════════════════════════════════════════════════════════
   SMALL COMPONENTS
══════════════════════════════════════════════════════════ */
function RoleTag({role}){
  const cls={GK:"tag-gk",DEF:"tag-def",MIL:"tag-mil",ATT:"tag-att",STAFF:"tag-staff"}[role]||"tag-gray";
  return <span className={`tag ${cls}`}>{role}</span>;
}
function StatusTag({statut}){
  return <span className={`status ${ST_CLS[statut]||"st-id"}`}><span className="status-dot" style={{background:"currentColor"}}/>{statut}</span>;
}
function PrioTag({prio}){
  const cls=prio==="★★★"?"prio-3":prio==="★★"?"prio-2":"prio-1";
  return <span className={cls}>{prio}</span>;
}
function CtCell({val}){
  const a=ctAlert(val);
  return <span className={a?`ct-${a}`:""}>{val||"—"}</span>;
}
function FVal({v,fallback="—"}){
  if(!v||v==="—") return <span className="fiche-val-empty">{fallback}</span>;
  return <span className="fiche-val">{v}</span>;
}

/* ══════════════════════════════════════════════════════════
   FICHE JOUEUR VIEW
══════════════════════════════════════════════════════════ */
function FicheView({player:p, onEdit, onSave, onDiscard, isSaved}){
  const al=ctAlert(p.finContrat);
  return (
    <div>
      {/* Header */}
      <div className="fiche-header">
        <div className="fiche-avatar">{ROLE_E[p.role]||"⚽"}</div>
        <div style={{flex:1}}>
          <div className="fiche-name">{p.nom||"Joueur"}</div>
          <div className="fiche-tags">
            {p.role&&<RoleTag role={p.role}/>}
            {p.poste&&<span className="tag tag-gray">{p.poste}</span>}
            {p.nationalite&&<span className="tag tag-gold">🌍 {p.nationalite}</span>}
            {p.passeportUE==="Oui"&&<span className="tag tag-green">🇪🇺 UE</span>}
            {p.categorie&&<span className={`tag ${p.categorie==="EFFECTIF"?"tag-blue":"tag-purple"}`}>{p.categorie}</span>}
          </div>
          <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
            <StatusTag statut={p.statut}/>
            <PrioTag prio={p.priorite}/>
          </div>
        </div>
        <div className="fiche-actions">
          {!isSaved&&<button className="btn btn-gold btn-sm" onClick={onSave}>💾 Sauvegarder</button>}
          <button className="btn btn-ghost btn-sm" onClick={onEdit}>✏️ Modifier</button>
          {!isSaved&&<button className="btn btn-red btn-sm" onClick={onDiscard}>✕ Annuler</button>}
        </div>
      </div>

      {al&&<div className={`warn`} style={{marginBottom:"12px"}}>⚠️ Contrat expirant le <strong>{p.finContrat}</strong> — À contacter en priorité</div>}

      {/* Section 1 */}
      <div className="fiche-section">
        <div className="fiche-section-hdr" style={{background:"rgba(59,130,246,.06)",color:"#93c5fd"}}>🔵 1. IDENTITÉ & PROFIL</div>
        <div className="fiche-body">
          <div className="fiche-grid">
            {[["Nom complet",p.nom],["Nationalité(s)",p.nationalite],["Date de naissance",p.ddn],["Âge",p.age?p.age+" ans":""],["Taille / Poids",p.taille?p.taille+" cm":""],["Pied fort",p.pied],["Poste principal",p.poste],["Postes secondaires",p.postesSec],["Rôle",p.role]].map(([l,v])=>(
              <div className="fiche-field" key={l}><div className="fiche-label">{l}</div><FVal v={v}/></div>
            ))}
          </div>
          {p.tmUrl&&<div style={{marginTop:"12px",display:"flex",gap:"14px",flexWrap:"wrap"}}>
            <a href={p.tmUrl} target="_blank" rel="noreferrer" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--gold)",textDecoration:"none",opacity:.8}}>🔗 Transfermarkt ↗</a>
            {p.ssUrl&&<a href={p.ssUrl} target="_blank" rel="noreferrer" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--gold)",textDecoration:"none",opacity:.8}}>🔗 SofaScore ↗</a>}
          </div>}
        </div>
      </div>

      {/* Section 2 */}
      <div className="fiche-section">
        <div className="fiche-section-hdr" style={{background:"rgba(245,166,35,.06)",color:"var(--gold)"}}>🟡 2. SITUATION CONTRACTUELLE</div>
        <div className="fiche-body">
          <div className="fiche-grid">
            {[["Club actuel",p.club],["Ligue / Niveau",p.ligue],["Valeur marché (TM)",p.valeur?parseInt(p.valeur).toLocaleString("fr")+" €":""],["Début contrat",p.debutContrat],["Fin contrat",p.finContrat],["Salaire est. (€/mois)",p.salaire],["Agent",p.agent],["Contact agent",p.contactAgent],["Statut",p.statutContrat]].map(([l,v])=>(
              <div className="fiche-field" key={l}><div className="fiche-label">{l}</div>{l==="Fin contrat"?<span className={`fiche-val ${al?`ct-${al}`:""}`}>{v||"—"}</span>:<FVal v={v}/>}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3 */}
      <div className="fiche-section">
        <div className="fiche-section-hdr" style={{background:"rgba(34,197,94,.06)",color:"var(--green)"}}>📊 3. STATISTIQUES — SAISON EN COURS</div>
        <div className="fiche-body">
          <div className="stat-boxes" style={{marginBottom:"12px"}}>
            {[["Matchs",p.matchs],["Minutes",p.minutes],["Buts",p.buts],["Passes D.",p.passes],["xG",p.xG],["xA",p.xA]].map(([l,v])=>(
              <div className="stat-box" key={l}><div className="stat-n">{v||"—"}</div><div className="stat-l">{l}</div></div>
            ))}
          </div>
          <div className="fiche-grid">
            {[["Note SofaScore",p.noteSS],["Duels gagnés %",p.duels],["% passes réussies",p.passePct],["Cartons J/R",p.cartons],["Blessures (j.)",p.blessures],["Compétition",p.competition]].map(([l,v])=>(
              <div className="fiche-field" key={l}><div className="fiche-label">{l}</div><FVal v={v}/></div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4 */}
      <div className="fiche-section">
        <div className="fiche-section-hdr" style={{background:"rgba(168,85,247,.06)",color:"var(--purple)"}}>🏔️ 4. CRITÈRES SPÉCIFIQUES — ANDORRE D2</div>
        <div className="fiche-body">
          <div className="fiche-grid">
            {[["Passeport UE",p.passeportUE],["Permis travail Andorre",p.permis],["Espagnol / Catalan",p.espCatalan],["Expérience altitude/synthétique",p.altitude],["Dispo déménagement",p.dispo],["Date disponibilité",p.dateContact]].map(([l,v])=>(
              <div className="fiche-field" key={l}>
                <div className="fiche-label">{l}</div>
                <span className="fiche-val" style={v==="Oui"?{color:"var(--green)"}:v==="Non"?{color:"var(--red)"}:{}}>{v||<span className="fiche-val-empty">—</span>}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 5 */}
      <div className="fiche-section">
        <div className="fiche-section-hdr" style={{background:"rgba(239,68,68,.06)",color:"var(--red)"}}>⭐ 5. ÉVALUATION DS</div>
        <div className="fiche-body">
          <div className="fiche-grid" style={{marginBottom:"12px"}}>
            {[["Priorité",p.priorite],["Statut scouting",p.statut],["Fit tactique",p.fit],["Compat. salariale",p.compatSal],["Recommandé par",p.recommande],["Retour joueur",p.retourJoueur]].map(([l,v])=>(
              <div className="fiche-field" key={l}><div className="fiche-label">{l}</div><FVal v={v}/></div>
            ))}
          </div>
          {p.pointsForts&&<div style={{marginBottom:"8px"}}><div className="fiche-label" style={{marginBottom:"4px"}}>Points forts</div><div style={{fontSize:"12px",color:"var(--green)",lineHeight:1.6}}>{p.pointsForts}</div></div>}
          {p.pointsFaibles&&<div style={{marginBottom:"8px"}}><div className="fiche-label" style={{marginBottom:"4px"}}>Points faibles</div><div style={{fontSize:"12px",color:"var(--red)",lineHeight:1.6}}>{p.pointsFaibles}</div></div>}
          {p.commentaires&&<div><div className="fiche-label" style={{marginBottom:"4px"}}>Commentaires DS</div><div className="notes-area">{p.commentaires}</div></div>}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   EDIT MODAL
══════════════════════════════════════════════════════════ */
function EditModal({player, onSave, onClose}){
  const [f,setF]=useState({...player});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const fi=(k,lbl,type="text",opts=null)=>(
    <div className="form-field" key={k}>
      <div className="form-lbl">{lbl}</div>
      {opts
        ? <select className="form-select" value={f[k]||""} onChange={e=>s(k,e.target.value)}>{opts.map(o=><option key={o} value={o}>{o||"—"}</option>)}</select>
        : <input className="form-input" type={type} value={f[k]||""} onChange={e=>s(k,e.target.value)}/>
      }
    </div>
  );
  const ft=(k,lbl)=>(
    <div className="form-field full" key={k}>
      <div className="form-lbl">{lbl}</div>
      <textarea className="form-textarea" value={f[k]||""} onChange={e=>s(k,e.target.value)}/>
    </div>
  );
  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-title">✏️ MODIFIER LA FICHE <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button></div>
        <div style={{fontWeight:700,fontSize:11,letterSpacing:1,textTransform:"uppercase",color:"var(--muted)",marginBottom:10,paddingBottom:6,borderBottom:"1px solid var(--border)"}}>🔵 IDENTITÉ</div>
        <div className="form-grid" style={{marginBottom:16}}>
          {fi("nom","Nom complet")} {fi("nationalite","Nationalité")}
          {fi("ddn","Date naiss. (JJ/MM/AAAA)")} {fi("age","Âge")}
          {fi("taille","Taille (cm)")} {fi("pied","Pied",undefined,["","Droit","Gauche","Les deux"])}
          {fi("poste","Poste",undefined,[""].concat(POSTES))} {fi("role","Rôle",undefined,ROLES)}
          {fi("postesSec","Postes secondaires")} {fi("categorie","Catégorie",undefined,["CIBLE","EFFECTIF"])}
        </div>
        <div style={{fontWeight:700,fontSize:11,letterSpacing:1,textTransform:"uppercase",color:"var(--muted)",marginBottom:10,paddingBottom:6,borderBottom:"1px solid var(--border)"}}>🟡 CONTRAT</div>
        <div className="form-grid" style={{marginBottom:16}}>
          {fi("club","Club actuel")} {fi("ligue","Ligue")}
          {fi("valeur","Valeur TM (€)")} {fi("finContrat","Fin contrat")}
          {fi("salaire","Salaire est. (€/mois)")} {fi("agent","Agent")}
          {fi("contactAgent","Contact agent")}
        </div>
        <div style={{fontWeight:700,fontSize:11,letterSpacing:1,textTransform:"uppercase",color:"var(--muted)",marginBottom:10,paddingBottom:6,borderBottom:"1px solid var(--border)"}}>📊 STATS</div>
        <div className="form-grid" style={{marginBottom:16}}>
          {fi("matchs","Matchs")} {fi("minutes","Minutes")}
          {fi("buts","Buts")} {fi("passes","Passes D.")}
          {fi("xG","xG")} {fi("xA","xA")}
          {fi("noteSS","Note SofaScore")} {fi("cartons","Cartons J/R")}
        </div>
        <div style={{fontWeight:700,fontSize:11,letterSpacing:1,textTransform:"uppercase",color:"var(--muted)",marginBottom:10,paddingBottom:6,borderBottom:"1px solid var(--border)"}}>⭐ ÉVALUATION</div>
        <div className="form-grid" style={{marginBottom:16}}>
          {fi("statut","Statut",undefined,STATUTS)} {fi("priorite","Priorité",undefined,PRIOS)}
          {fi("passeportUE","Passeport UE",undefined,["","Oui","Non","À vérifier"])} {fi("espCatalan","Esp./Catalan",undefined,["","Oui","Non","Basique"])}
          {ft("pointsForts","Points forts")} {ft("pointsFaibles","Points faibles")}
          {ft("commentaires","Commentaires DS")}
        </div>
        <div style={{fontWeight:700,fontSize:11,letterSpacing:1,textTransform:"uppercase",color:"var(--muted)",marginBottom:10,paddingBottom:6,borderBottom:"1px solid var(--border)"}}>🔗 LIENS</div>
        <div className="form-grid">
          {fi("tmUrl","TM URL")} {fi("ssUrl","SofaScore URL")}
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-gold" onClick={()=>onSave(f)}>💾 Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PLAYER TABLE
══════════════════════════════════════════════════════════ */
function PlayerTable({players, title, rowClass, onView, onEdit, onDelete, onExport}){
  const [search,setSearch]=useState("");
  const [fRole,setFRole]=useState("TOUS");
  const [fStatut,setFStatut]=useState("TOUS");

  const filtered=players.filter(p=>{
    if(fRole!=="TOUS"&&p.role!==fRole) return false;
    if(fStatut!=="TOUS"&&p.statut!==fStatut) return false;
    if(search&&!`${p.nom} ${p.club} ${p.poste}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="tbl-header">
        <div>
          <div className="tbl-title">{title}</div>
          <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{filtered.length} joueur{filtered.length>1?"s":""} • Sources : Transfermarkt + SofaScore</div>
        </div>
        <div style={{display:"flex",gap:"8px"}}>
          <button className="btn btn-ghost btn-sm" onClick={onExport}>📥 Exporter CSV</button>
        </div>
      </div>
      <div className="filter-bar">
        {["TOUS","GK","DEF","MIL","ATT"].map(r=><button key={r} className={`filter-btn ${fRole===r?"active":""}`} onClick={()=>setFRole(r)}>{r}</button>)}
        <div style={{width:1,background:"var(--border)",margin:"0 2px"}}/>
        {["TOUS",...STATUTS.slice(0,5)].map(s=><button key={s} className={`filter-btn ${fStatut===s?"active":""}`} onClick={()=>setFStatut(s)} style={{fontSize:10}}>{s}</button>)}
        <div style={{flex:1}}/>
        <input className="search" placeholder="🔍 Rechercher..." value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Nom</th><th>Nat.</th><th>Âge</th><th>Pied</th>
              <th>Poste</th><th>Rôle</th><th>Club actuel</th><th>Ligue</th>
              <th>Valeur €</th><th>Fin contrat</th><th>M</th><th>B</th><th>P</th>
              <th>Note SS</th><th>Statut</th><th>Priorité</th><th>Agent</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length===0&&<tr><td colSpan={19} style={{textAlign:"center",padding:"32px",color:"var(--muted)"}}>Aucun joueur trouvé</td></tr>}
            {filtered.map((p,i)=>(
              <tr key={p.id} className={rowClass} style={{cursor:"pointer"}} onClick={()=>onView(p)}>
                <td style={{color:"var(--muted)"}}>{i+1}</td>
                <td><strong>{p.nom}</strong></td>
                <td>{p.nationalite}</td>
                <td>{p.age||"—"}</td>
                <td>{p.pied||"—"}</td>
                <td>{p.poste}</td>
                <td><RoleTag role={p.role}/></td>
                <td>{p.club}</td>
                <td style={{fontSize:11,color:"var(--muted)"}}>{p.ligue}</td>
                <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>{p.valeur?parseInt(p.valeur).toLocaleString("fr")+"€":"—"}</td>
                <td><CtCell val={p.finContrat}/></td>
                <td style={{textAlign:"center"}}>{p.matchs||"—"}</td>
                <td style={{textAlign:"center"}}>{p.buts||"—"}</td>
                <td style={{textAlign:"center"}}>{p.passes||"—"}</td>
                <td style={{textAlign:"center"}}>{p.noteSS||"—"}</td>
                <td onClick={e=>e.stopPropagation()}><StatusTag statut={p.statut}/></td>
                <td><PrioTag prio={p.priorite}/></td>
                <td style={{fontSize:11,color:"var(--muted)"}}>{p.agent||"—"}</td>
                <td onClick={e=>e.stopPropagation()}>
                  <div style={{display:"flex",gap:4}}>
                    <button className="btn btn-ghost btn-sm" onClick={()=>onEdit(p)}>✏️</button>
                    <button className="btn btn-red btn-sm" onClick={()=>onDelete(p.id)}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   BUDGET PAGE
══════════════════════════════════════════════════════════ */
function BudgetPage({cibles}){
  const POSTES_BUDGET=[
    {poste:"Gardien #1",role:"GK",duree:"2 ans"},
    {poste:"Défenseur Central",role:"DEF",duree:"2 ans"},
    {poste:"Latéral Droit",role:"DEF",duree:"1 an"},
    {poste:"Milieu Box-to-Box",role:"MIL",duree:"2 ans"},
    {poste:"Ailier Gauche",role:"ATT",duree:"2 ans"},
    {poste:"Avant-Centre",role:"ATT",duree:"1 an"},
  ];
  const [rows,setRows]=useState(POSTES_BUDGET.map((p,i)=>({...p,id:i,joueur:"",salaire:"",indemnite:""})));
  const upd=(id,k,v)=>setRows(r=>r.map(x=>x.id===id?{...x,[k]:v}:x));
  const total=rows.reduce((s,r)=>{
    const sal=parseInt(r.salaire)||0;
    const ind=parseInt(r.indemnite)||0;
    const mois=r.duree==="2 ans"?24:12;
    return s+sal*mois+ind;
  },0);
  return (
    <div>
      <div className="page-title">💶 BUDGET MERCATO</div>
      <div className="page-sub">Été 2026 — Andorre D2 • Salaires estimés + indemnités</div>
      <div className="budget-grid">
        {[["Budget total estimé",total.toLocaleString("fr")+" €","var(--gold)"],["Masse sal. mensuelle",rows.reduce((s,r)=>(s+(parseInt(r.salaire)||0)),0).toLocaleString("fr")+" €/mois","var(--green)"],["Nb postes à recruter",rows.length,"var(--blue)"]].map(([l,v,c])=>(
          <div className="budget-kpi" key={l}><div className="budget-kpi-n" style={{color:c}}>{v}</div><div className="budget-kpi-l">{l}</div></div>
        ))}
      </div>
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>Poste à recruter</th><th>Rôle</th><th>Joueur cible</th><th>Statut</th><th>Salaire est. (€/mois)</th><th>Indemnité (€)</th><th>Durée</th><th>Coût total estimé</th></tr></thead>
          <tbody>
            {rows.map(r=>{
              const matched=cibles.find(c=>c.nom.toLowerCase()===r.joueur.toLowerCase());
              const sal=parseInt(r.salaire)||0;
              const ind=parseInt(r.indemnite)||0;
              const mois=r.duree==="2 ans"?24:12;
              const cout=sal*mois+ind;
              return (
                <tr key={r.id}>
                  <td><strong>{r.poste}</strong></td>
                  <td><RoleTag role={r.role}/></td>
                  <td><input className="form-input" style={{width:160,padding:"5px 8px"}} value={r.joueur} onChange={e=>upd(r.id,"joueur",e.target.value)} placeholder="Nom du joueur..."/></td>
                  <td>{matched?<StatusTag statut={matched.statut}/>:<span style={{color:"var(--dim)",fontSize:11}}>À définir</span>}</td>
                  <td><input className="form-input" style={{width:120,padding:"5px 8px",textAlign:"right"}} value={r.salaire} onChange={e=>upd(r.id,"salaire",e.target.value)} placeholder="0"/></td>
                  <td><input className="form-input" style={{width:120,padding:"5px 8px",textAlign:"right"}} value={r.indemnite} onChange={e=>upd(r.id,"indemnite",e.target.value)} placeholder="0"/></td>
                  <td><select className="form-select" style={{width:90}} value={r.duree} onChange={e=>upd(r.id,"duree",e.target.value)}><option>1 an</option><option>2 ans</option><option>3 ans</option></select></td>
                  <td style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:"var(--gold)"}}>{cout?cout.toLocaleString("fr")+" €":"—"}</td>
                </tr>
              );
            })}
            <tr style={{background:"rgba(245,166,35,.04)",borderTop:"2px solid var(--gold)"}}>
              <td colSpan={7} style={{fontWeight:700,fontSize:13}}>TOTAL BUDGET ESTIMÉ</td>
              <td style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:14,color:"var(--gold)"}}>{total.toLocaleString("fr")} €</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="info" style={{marginTop:16}}>
        <span>💡</span><div>Fourchettes réalistes D2 Andorre : GK 800-1500€/mois · DEF 600-1200€/mois · MIL 800-1400€/mois · ATT 1000-1800€/mois. Joueurs libres = 0€ d'indemnité.</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   GUIDE DS
══════════════════════════════════════════════════════════ */
function GuidePage(){
  const [open,setOpen]=useState(0);
  const sections=[
    {title:"🔍 COMMENT RÉCUPÉRER LES DONNÉES D'UN JOUEUR",color:"var(--blue)",items:[
      ["1. URL Transfermarkt","Va sur transfermarkt.fr → cherche le joueur → copie l'URL → colle dans l'onglet 'Analyser'. L'IA récupère automatiquement : valeur, contrat, agent, nationalité, stats."],
      ["2. SofaScore","Pour les stats avancées (xG, xA, duels %, note) : SofaScore.com → copier l'URL dans la fiche joueur → section Stats."],
      ["3. Vérification manuelle","Pour les joueurs non trouvés (erreur 403 sur TM) : compléter manuellement via le bouton ✏️ Modifier."],
      ["4. Agents","Chercher l'agent sur LinkedIn. Vérifier sur FootMercato ou L'Équipe pour les rumeurs de transfert."],
    ]},
    {title:"📋 WORKFLOW SCOUTING — STATUTS",color:"var(--green)",items:[
      ["✅ Identifié","TM URL ajoutée · Poste confirmé · Âge + contrat vérifiés · Fiche créée dans l'app"],
      ["✅ Contacté","Agent ou joueur contacté · Intérêt confirmé · Prétentions salariales approx. reçues"],
      ["✅ Observé","Min. 3 matchs analysés (vidéo) · Fiche complète · Note DS attribuée · Points forts/faibles remplis"],
      ["✅ En négociation","Offre formelle envoyée · Durée + salaire définis · Accord agent · Visite médicale planifiée"],
      ["✅ Signé","Contrat signé · Enregistrement FFAndorre · Annonce officielle"],
    ]},
    {title:"🏔️ RÈGLES SPÉCIFIQUES ANDORRE D2",color:"var(--purple)",items:[
      ["Joueurs étrangers","Vérifier chaque saison le quota de joueurs non-andorrans autorisés en D2 auprès de la FFAndorre."],
      ["Permis de travail","Tout joueur hors UE doit obtenir un permis de travail andorran. Délai : 4-8 semaines. Lancer la procédure dès l'accord verbal."],
      ["Terrain synthétique","Majorité des terrains en Andorre sont synthétiques. Prioriser joueurs habitués (clubs D4/D5 français)."],
      ["Altitude (1000-1500m)","Préparer une semaine d'acclimatation. Certains joueurs peuvent avoir des difficultés initiales."],
      ["Langue","Espagnol + catalan dans le vestiaire. Un minimum de compréhension est recommandé."],
    ]},
    {title:"💡 TIPS MERCATO ÉTÉ 2026",color:"var(--gold)",items:[
      ["Joueurs libres en priorité","Contacter dès janvier 2026 les joueurs dont le contrat expire en juin 2026 → zéro indemnité."],
      ["Agents identifiés","Talent Sport (3 joueurs), Agencysports (1), Goalactic (1). Entretenir la relation hors mercato."],
      ["Réseau France","Cibler National 2 / National 3 : niveau adapté à D2 Andorre, salaires accessibles (800-1500€/mois)."],
      ["Andorrans obligatoires","Inclure 2-3 joueurs andorrans dans l'effectif (image club + règlement potentiel FFAndorre)."],
    ]},
  ];
  return (
    <div>
      <div className="page-title">📖 GUIDE DS</div>
      <div className="page-sub">Mode d'emploi Data Room + Checklist scouting + Règles Andorre</div>
      {sections.map((s,i)=>(
        <div className="guide-section" key={i}>
          <div className="guide-hdr" style={{color:s.color}} onClick={()=>setOpen(open===i?-1:i)}>
            {s.title} <span>{open===i?"▲":"▼"}</span>
          </div>
          {open===i&&<div className="guide-body">
            {s.items.map(([k,v],j)=>(
              <div className="guide-row" key={j}>
                <div className="guide-key">{k}</div>
                <div className="guide-val">{v}</div>
              </div>
            ))}
          </div>}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════ */
export default function App(){
  const [tab,setTab]=useState("dashboard");
  const [players,setPlayers]=useState([...DEMO_EFF,...DEMO_CIB]);
  const [url,setUrl]=useState("");
  const [loading,setLoading]=useState(false);
  const [loadStep,setLoadStep]=useState("");
  const [preview,setPreview]=useState(null);
  const [error,setError]=useState("");
  const [editP,setEditP]=useState(null);
  const [viewP,setViewP]=useState(null);

  useEffect(()=>{
    (async()=>{try{const r=await window.storage.get("sr_v3");if(r?.value)setPlayers(JSON.parse(r.value));}catch(e){}})();
  },[]);

  const save=useCallback(async(list)=>{
    setPlayers(list);
    try{await window.storage.set("sr_v3",JSON.stringify(list));}catch(e){}
  },[]);

  const effectif=players.filter(p=>p.categorie==="EFFECTIF");
  const cibles=players.filter(p=>p.categorie==="CIBLE");

  // KPIs
  const urgents=players.filter(p=>ctAlert(p.finContrat)).length;
  const prio3=cibles.filter(p=>p.priorite==="★★★").length;
  const pipeline={
    "Identifié":cibles.filter(p=>p.statut==="Identifié").length,
    "Contacté":cibles.filter(p=>p.statut==="Contacté").length,
    "Observé":cibles.filter(p=>p.statut==="Observé").length,
    "En négociation":cibles.filter(p=>p.statut==="En négociation").length,
    "Signé":cibles.filter(p=>p.statut==="Signé").length,
    "Refusé":cibles.filter(p=>p.statut==="Refusé").length,
  };
  const POSTES_RENFORCER=[
    {poste:"Gardien #1",role:"GK",profil:"Expérimenté 25-33 ans, bon avec les pieds",urgence:"URGENT"},
    {poste:"Défenseur Central",role:"DEF",profil:"Physique, leadership, jeu aérien",urgence:"URGENT"},
    {poste:"Latéral Droit",role:"DEF",profil:"Double profil AD/LD, actif défensivement",urgence:"URGENT"},
    {poste:"Milieu Box-to-Box",role:"MIL",profil:"Volume, récupération, propre techniquement",urgence:"IMPORTANT"},
    {poste:"Ailier Gauche",role:"ATT",profil:"Vitesse, dribble, finition (libre de préférence)",urgence:"IMPORTANT"},
    {poste:"Avant-Centre",role:"ATT",profil:"Buteur référence D3/D4, physique 1m85+",urgence:"SOUHAITABLE"},
  ];

  const handleAnalyze=async()=>{
    if(!url.trim()) return;
    setError("");setPreview(null);setLoading(true);
    try{
      const p=await aiAnalyze(url.trim(),setLoadStep);
      setPreview(p);
    }catch(e){setError(`Erreur: ${e.message}`);}
    finally{setLoading(false);setLoadStep("");}
  };

  const handleSavePreview=()=>{
    if(!preview) return;
    save([...players,preview]);
    setPreview(null);setUrl("");
    setTab(preview.categorie==="EFFECTIF"?"effectif":"cibles");
  };

  const handleDelete=(id)=>{
    save(players.filter(p=>p.id!==id));
    if(viewP?.id===id) setViewP(null);
  };

  const handleEditSave=(updated)=>{
    save(players.map(p=>p.id===updated.id?updated:p));
    setEditP(null);
    if(viewP?.id===updated.id) setViewP(updated);
    if(preview?.id===updated.id) setPreview(updated);
  };

  const TABS=[
    {id:"dashboard",label:"🏠 Tableau de bord"},
    {id:"effectif",label:"👥 Effectif",count:effectif.length},
    {id:"cibles",label:"🎯 Cibles Mercato",count:cibles.length},
    {id:"analyser",label:"➕ Analyser joueur"},
    {id:"budget",label:"💶 Budget"},
    {id:"guide",label:"📖 Guide DS"},
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:css}}/>
      <div className="app">

        {/* TOPBAR */}
        <div className="topbar">
          <div style={display:"flex",alignItems:"center",gap:"12px"}>
            <img src="data:image/png;base64,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" alt="ScoutRoom" style={{width:"36px",height:"36px",borderRadius:"8px"}}/>
            <div>
              <div className="logo">SCOUT<span>ROOM</span></div>
              <div style={{fontSize:"10px",color:"var(--muted)",letterSpacing:"1px",fontWeight:500,marginTop:"-2px"}}>ANDORRE D2 · ÉTÉ 2026</div>
            </div>
          </div>
          <div className="tabs">
            {TABS.map(t=>(
              <button key={t.id} className={`tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
                {t.label}
                {t.count!=null&&<span className="tab-badge">{t.count}</span>}
              </button>
            ))}
          </div>
          <div className="sync-bar">
            <button className="btn btn-ghost btn-sm" onClick={()=>exportCSV(players)}>📥 Export CSV</button>
          </div>
        </div>

        <div className="main">

          {/* ─── DASHBOARD ─── */}
          {tab==="dashboard"&&(
            <div>
              <div className="page-title">🏠 TABLEAU DE BORD</div>
              <div className="page-sub">Directeur Sportif · Dernière MAJ : {new Date().toLocaleDateString("fr-FR")} · Sources : Transfermarkt + SofaScore</div>

              <div className="kpi-grid">
                {[[effectif.length,"👥 Effectif actuel","var(--blue)"],[cibles.length,"🎯 Cibles mercato","var(--purple)"],[prio3,"🔴 Priorité ★★★","var(--red)"],[urgents,"⚠️ Contrats urgents","var(--orange)"],[POSTES_RENFORCER.length,"🏟️ Postes à recruter","var(--cyan)"],["À définir","💶 Budget estimé","var(--gold)"]].map(([n,l,c])=>(
                  <div className="kpi" key={l}><div className="kpi-n" style={{color:c,fontSize:typeof n==="string"?18:34}}>{n}</div><div className="kpi-l">{l}</div></div>
                ))}
              </div>

              <div className="dash-grid">
                <div className="card">
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:14}}>🔍 POSTES À RENFORCER</div>
                  <table className="postes-table">
                    <thead><tr><th>Poste</th><th>Rôle</th><th>Profil</th><th>Urgence</th></tr></thead>
                    <tbody>
                      {POSTES_RENFORCER.map(p=>(
                        <tr key={p.poste}>
                          <td style={{fontWeight:600}}>{p.poste}</td>
                          <td><RoleTag role={p.role}/></td>
                          <td style={{color:"var(--muted)",fontSize:11}}>{p.profil}</td>
                          <td><span className={`urg-${p.urgence.toLowerCase()}`}>{p.urgence}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="card">
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"var(--muted)",marginBottom:14}}>📊 PIPELINE SCOUTING</div>
                  <div className="kanban">
                    {[["Identifié","var(--muted)"],["Contacté","var(--blue)"],["Observé","var(--purple)"],["En négociation","var(--orange)"],["Signé","var(--green)"],["Refusé","var(--red)"]].map(([s,c])=>(
                      <div className="kol" key={s}>
                        <div className="kol-hdr" style={{color:c}}>{s}<span className="kol-count">{pipeline[s]}</span></div>
                        {cibles.filter(p=>p.statut===s).map(p=>(
                          <div className="kcard" key={p.id} style={{cursor:"pointer",borderLeft:`2px solid ${c}`}} onClick={()=>{setViewP(p);}}>
                            <div className="kcard-name">{p.nom}</div>
                            <div className="kcard-pos">{p.poste} · {p.priorite}</div>
                          </div>
                        ))}
                        {pipeline[s]===0&&<div style={{fontSize:11,color:"var(--dim)",textAlign:"center",padding:"8px 0"}}>—</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="info">
                <span>💡</span>
                <div>Pour ajouter un joueur : onglet <strong>➕ Analyser joueur</strong> → colle l'URL Transfermarkt → l'IA remplit automatiquement toute la fiche en 5 secondes.</div>
              </div>
            </div>
          )}

          {/* ─── EFFECTIF ─── */}
          {tab==="effectif"&&(
            <PlayerTable players={effectif} title="👥 EFFECTIF" rowClass="tbl-row-eff"
              onView={p=>setViewP(p)} onEdit={p=>setEditP(p)} onDelete={handleDelete}
              onExport={()=>exportCSV(effectif)}/>
          )}

          {/* ─── CIBLES ─── */}
          {tab==="cibles"&&(
            <PlayerTable players={cibles} title="🎯 CIBLES MERCATO ÉTÉ 2026" rowClass="tbl-row-cib"
              onView={p=>setViewP(p)} onEdit={p=>setEditP(p)} onDelete={handleDelete}
              onExport={()=>exportCSV(cibles)}/>
          )}

          {/* ─── ANALYSER ─── */}
          {tab==="analyser"&&(
            <div>
              {!preview&&!loading&&(
                <div className="url-page">
                  <div className="url-hero">
                    <h1>COLLE L'URL TRANSFERMARKT</h1>
                    <p>L'IA récupère automatiquement toutes les données et remplit la fiche complète en 5 sections.</p>
                  </div>
                  <div className="url-box">
                    <div className="url-lbl">🔗 URL Transfermarkt du joueur</div>
                    <div className="url-row">
                      <input className="url-input" placeholder="https://www.transfermarkt.fr/nom-joueur/profil/spieler/..." value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAnalyze()}/>
                      <button className="btn btn-gold" onClick={handleAnalyze} disabled={!url.trim()}>⚡ Analyser</button>
                    </div>
                  </div>
                  {error&&<div className="err"><span>⚠️</span>{error}</div>}
                  <div style={{marginTop:20}}>
                    <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,color:"var(--muted)",textTransform:"uppercase",marginBottom:10}}>Liens rapides — Tes cibles prioritaires</div>
                    <div className="quick-grid">
                      {[{n:"Victor Poisson",u:"https://www.transfermarkt.fr/victor-poisson/profil/spieler/981785"},{n:"Albertin",u:"https://www.transfermarkt.fr/albertin/profil/spieler/809519"},{n:"Dylan Okyere",u:"https://www.transfermarkt.fr/dylan-okyere/profil/spieler/983288"},{n:"Ludovic Faucher",u:"https://www.transfermarkt.fr/ludovic-faucher/profil/spieler/820386"},{n:"Thomas Carbonero",u:"https://www.transfermarkt.fr/thomas-carbonero/leistungsdatendetails/spieler/626589"}].map(s=>(
                        <button key={s.n} className="btn btn-ghost btn-sm" onClick={()=>setUrl(s.u)}>⚡ {s.n}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {loading&&(
                <div className="loading">
                  <div className="spinner"/>
                  <div className="loading-title">ANALYSE EN COURS</div>
                  <div className="loading-step">{loadStep}</div>
                </div>
              )}
              {preview&&!loading&&(
                <div>
                  <div className="warn" style={{marginBottom:16}}><span>👁️</span><div>Fiche générée — <strong>vérifie les données</strong> puis sauvegarde. Tu peux modifier avant.</div></div>
                  <FicheView player={preview} onEdit={()=>setEditP(preview)} onSave={handleSavePreview} onDiscard={()=>{setPreview(null);setUrl("");}} isSaved={false}/>
                </div>
              )}
            </div>
          )}

          {/* ─── BUDGET ─── */}
          {tab==="budget"&&<BudgetPage cibles={cibles}/>}

          {/* ─── GUIDE ─── */}
          {tab==="guide"&&<GuidePage/>}

        </div>

        {/* VIEW MODAL */}
        {viewP&&(
          <div className="overlay" onClick={e=>e.target===e.currentTarget&&setViewP(null)}>
            <div className="modal modal-lg">
              <FicheView player={viewP} isSaved={true} onEdit={()=>setEditP(viewP)} onSave={()=>{}} onDiscard={()=>setViewP(null)}/>
              <div className="modal-actions"><button className="btn btn-ghost" onClick={()=>setViewP(null)}>Fermer</button></div>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {editP&&<EditModal player={editP} onSave={handleEditSave} onClose={()=>setEditP(null)}/>}

      </div>
    </>
  );
}
