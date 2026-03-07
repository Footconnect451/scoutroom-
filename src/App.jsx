import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase.js";

// Strip <cite> tags from AI-generated text
const cleanText = (t) => t ? String(t).replace(/<cite[^>]*>/gi,'').replace(/<\/cite>/gi,'').trim() : t;

/* ══════════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#07101f;--card:#0c1a2e;--card2:#0f1e34;--card3:#111f35;--border:#1a2d45;--border2:#22395a;
  --gold:#f5a623;--gold2:#ffc55a;--gold3:rgba(245,166,35,.08);
  --white:#eef2f8;--muted:#5a7a9a;--dim:#2e4460;
  --green:#22c55e;--red:#ef4444;--blue:#3b82f6;--orange:#f97316;--purple:#a855f7;--cyan:#06b6d4;
  --gk:#1e3a5f;--gkc:#60a5fa;--def:#14532d;--defc:#4ade80;--mil:#1e3a6e;--milc:#93c5fd;--att:#7f1d1d;--attc:#fca5a5;
  --shadow:0 4px 24px rgba(0,0,0,.4);--shadow-sm:0 2px 8px rgba(0,0,0,.3);
  --radius:12px;--radius-sm:8px;--radius-lg:16px;
}
html,body{background:var(--bg);color:var(--white);font-family:'Inter',sans-serif;min-height:100vh;font-size:14px;line-height:1.5}

/* ══ TOPBAR ══ */
.topbar{background:linear-gradient(180deg,#05111e 0%,#07101f 100%);border-bottom:1px solid var(--border);padding:0 28px;height:62px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200;box-shadow:0 1px 0 var(--border),0 4px 20px rgba(0,0,0,.3)}
.logo-wrap{display:flex;align-items:center;gap:12px}
.logo-icon{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,var(--gold),#e8950f);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;color:#07101f;font-family:'Bebas Neue',sans-serif;letter-spacing:1px;box-shadow:0 2px 12px rgba(245,166,35,.3);flex-shrink:0}
.logo{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:3px;color:var(--white);line-height:1}
.logo span{color:var(--gold)}
.logo-club{font-size:10px;color:var(--muted);letter-spacing:1.5px;font-weight:500;text-transform:uppercase;margin-top:1px}
.tabs{display:flex;gap:1px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:10px;padding:3px}
.tab{padding:6px 14px;border-radius:7px;font-size:11px;font-weight:600;cursor:pointer;border:none;background:transparent;color:var(--muted);transition:all .18s;letter-spacing:.3px;white-space:nowrap;font-family:'Inter',sans-serif}
.tab:hover{color:var(--white);background:rgba(255,255,255,.06)}
.tab.active{color:#07101f;background:var(--gold);font-weight:700;box-shadow:0 2px 8px rgba(245,166,35,.25)}
.tab-badge{display:inline-flex;align-items:center;justify-content:center;background:rgba(0,0,0,.2);border-radius:20px;padding:0 6px;font-size:9px;margin-left:4px;min-width:16px;height:16px;font-weight:700}
.tab:not(.active) .tab-badge{background:rgba(255,255,255,.1)}
.topbar-right{display:flex;align-items:center;gap:8px}
.user-pill{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--muted);background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:20px;padding:5px 12px;font-weight:500}
.user-pill:hover{background:rgba(255,255,255,.07);color:var(--white)}

/* ══ LAYOUT ══ */
.main{padding:28px 32px;max-width:1440px;margin:0 auto}
.page-header{margin-bottom:24px}
.page-title{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:2.5px;line-height:1;color:var(--white)}
.page-title span{color:var(--gold)}
.page-sub{font-size:12px;color:var(--muted);margin-top:4px;letter-spacing:.3px}

/* ══ BUTTONS ══ */
.btn{padding:8px 18px;border-radius:var(--radius-sm);font-size:12px;font-weight:600;cursor:pointer;border:none;transition:all .18s;display:inline-flex;align-items:center;gap:6px;font-family:'Inter',sans-serif;white-space:nowrap;letter-spacing:.2px}
.btn-gold{background:linear-gradient(135deg,var(--gold),#e8950f);color:#07101f;box-shadow:0 2px 10px rgba(245,166,35,.25)}
.btn-gold:hover:not(:disabled){background:linear-gradient(135deg,var(--gold2),var(--gold));box-shadow:0 4px 16px rgba(245,166,35,.35);transform:translateY(-1px)}
.btn-gold:disabled{opacity:.4;cursor:not-allowed;transform:none}
.btn-ghost{background:transparent;color:var(--muted);border:1px solid var(--border)}
.btn-ghost:hover{color:var(--white);border-color:var(--border2);background:rgba(255,255,255,.04)}
.btn-sm{padding:5px 12px;font-size:11px;border-radius:6px}
.btn-red{background:rgba(239,68,68,.1);color:var(--red);border:1px solid rgba(239,68,68,.2)}
.btn-red:hover{background:rgba(239,68,68,.18);border-color:rgba(239,68,68,.35)}
.btn-blue{background:rgba(59,130,246,.1);color:var(--blue);border:1px solid rgba(59,130,246,.2)}
.btn-cyan{background:rgba(6,182,212,.1);color:var(--cyan);border:1px solid rgba(6,182,212,.2)}

/* ══ CARDS ══ */
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;box-shadow:var(--shadow-sm)}
.card:hover{border-color:var(--border2)}
.card-sm{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px}
.card-glow{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;box-shadow:var(--shadow-sm),0 0 0 1px rgba(245,166,35,.04),inset 0 1px 0 rgba(255,255,255,.03)}
.section-title{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:14px;display:flex;align-items:center;gap:8px}
.section-title::after{content:'';flex:1;height:1px;background:var(--border)}

/* ══ KPI ROW ══ */
.kpi-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:24px}
.kpi{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px;position:relative;overflow:hidden;transition:all .2s}
.kpi::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.02) 0%,transparent 60%);pointer-events:none}
.kpi:hover{border-color:var(--border2);transform:translateY(-1px);box-shadow:var(--shadow)}
.kpi-n{font-family:'Bebas Neue',sans-serif;font-size:36px;line-height:1;letter-spacing:1px}
.kpi-l{font-size:10px;color:var(--muted);margin-top:4px;font-weight:500;letter-spacing:.5px;text-transform:uppercase}
.kpi-icon{position:absolute;right:14px;top:14px;font-size:20px;opacity:.15}

/* ══ TABLE ══ */
.tbl-wrap{overflow-x:auto;border-radius:var(--radius);border:1px solid var(--border);box-shadow:var(--shadow-sm)}
table{width:100%;border-collapse:collapse;font-size:12px}
thead tr{background:linear-gradient(180deg,#0a1828 0%,#091522 100%)}
th{padding:11px 14px;text-align:left;font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);white-space:nowrap;border-bottom:1px solid var(--border)}
td{padding:10px 14px;border-bottom:1px solid rgba(26,45,69,.4);vertical-align:middle;white-space:nowrap;transition:background .1s}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(255,255,255,.025)}
.tbl-row-eff td{background:rgba(34,197,94,.02)}
.tbl-row-eff:hover td{background:rgba(34,197,94,.05)}
.tbl-row-cib td{background:rgba(168,85,247,.02)}
.tbl-row-cib:hover td{background:rgba(168,85,247,.05)}

/* ══ TAGS ══ */
.tag{display:inline-flex;align-items:center;font-size:9px;font-weight:700;padding:3px 8px;border-radius:20px;letter-spacing:.6px;text-transform:uppercase}
.tag-gk{background:rgba(30,58,95,.8);color:var(--gkc);border:1px solid rgba(96,165,250,.2)}
.tag-def{background:rgba(20,83,45,.8);color:var(--defc);border:1px solid rgba(74,222,128,.2)}
.tag-mil{background:rgba(30,58,110,.8);color:var(--milc);border:1px solid rgba(147,197,253,.2)}
.tag-att{background:rgba(127,29,29,.8);color:var(--attc);border:1px solid rgba(252,165,165,.2)}
.tag-staff{background:rgba(45,31,94,.8);color:#c4b5fd;border:1px solid rgba(196,181,253,.2)}
.tag-gold{background:rgba(245,166,35,.1);color:var(--gold);border:1px solid rgba(245,166,35,.2)}
.tag-green{background:rgba(34,197,94,.1);color:var(--green);border:1px solid rgba(34,197,94,.2)}
.tag-red{background:rgba(239,68,68,.1);color:var(--red);border:1px solid rgba(239,68,68,.2)}
.tag-orange{background:rgba(249,115,22,.1);color:var(--orange);border:1px solid rgba(249,115,22,.2)}
.tag-blue{background:rgba(59,130,246,.1);color:var(--blue);border:1px solid rgba(59,130,246,.2)}
.tag-purple{background:rgba(168,85,247,.1);color:var(--purple);border:1px solid rgba(168,85,247,.2)}
.tag-gray{background:rgba(90,122,154,.08);color:var(--muted);border:1px solid rgba(90,122,154,.15)}
.tag-cyan{background:rgba(6,182,212,.1);color:var(--cyan);border:1px solid rgba(6,182,212,.2)}

/* ══ STATUS ══ */
.status{display:inline-flex;align-items:center;gap:5px;font-size:9px;font-weight:700;padding:4px 10px;border-radius:20px;letter-spacing:.6px;text-transform:uppercase}
.status-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;box-shadow:0 0 4px currentColor}
.st-id{background:rgba(90,122,154,.1);color:#7a9aba;border:1px solid rgba(90,122,154,.2)}
.st-co{background:rgba(59,130,246,.1);color:var(--blue);border:1px solid rgba(59,130,246,.2)}
.st-ob{background:rgba(168,85,247,.1);color:var(--purple);border:1px solid rgba(168,85,247,.2)}
.st-ne{background:rgba(249,115,22,.1);color:var(--orange);border:1px solid rgba(249,115,22,.2)}
.st-si{background:rgba(34,197,94,.1);color:var(--green);border:1px solid rgba(34,197,94,.2)}
.st-re{background:rgba(239,68,68,.1);color:var(--red);border:1px solid rgba(239,68,68,.2)}
.st-sc{background:rgba(34,197,94,.1);color:var(--green);border:1px solid rgba(34,197,94,.2)}

/* ══ PRIO ══ */
.prio-3{color:var(--red);font-size:13px;text-shadow:0 0 8px rgba(239,68,68,.4)}
.prio-2{color:var(--orange);font-size:13px}
.prio-1{color:var(--muted);font-size:13px}

/* ══ CONTRACT ALERT ══ */
.ct-red{color:var(--red);font-weight:700}
.ct-orange{color:var(--orange);font-weight:600}

/* ══ DASHBOARD ══ */
.dash-grid{display:grid;grid-template-columns:1.2fr 1fr;gap:16px;margin-bottom:20px}
.postes-table{width:100%;border-collapse:collapse;font-size:12px}
.postes-table th{padding:9px 12px;text-align:left;font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted)}
.postes-table td{padding:9px 12px;border-top:1px solid var(--border)}
.urg-urgent{background:rgba(239,68,68,.1);color:var(--red);border:1px solid rgba(239,68,68,.2);border-radius:6px;padding:2px 8px;font-size:9px;font-weight:700;letter-spacing:.5px}
.urg-important{background:rgba(249,115,22,.1);color:var(--orange);border:1px solid rgba(249,115,22,.2);border-radius:6px;padding:2px 8px;font-size:9px;font-weight:700;letter-spacing:.5px}
.urg-souhaitable{background:rgba(34,197,94,.1);color:var(--green);border:1px solid rgba(34,197,94,.2);border-radius:6px;padding:2px 8px;font-size:9px;font-weight:700;letter-spacing:.5px}

/* ══ KANBAN ══ */
.kanban{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px}
.kol{min-width:140px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px}
.kol-hdr{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;padding-bottom:8px;border-bottom:1px solid var(--border)}
.kol-count{background:rgba(255,255,255,.08);border-radius:20px;padding:1px 7px;font-size:11px;font-family:'Bebas Neue',sans-serif}
.kcard{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:8px 10px;margin-bottom:6px;font-size:11px;cursor:pointer;transition:all .15s}
.kcard:hover{border-color:var(--border2);transform:translateY(-1px);box-shadow:var(--shadow-sm)}
.kcard-name{font-weight:600;margin-bottom:2px}
.kcard-pos{color:var(--muted);font-size:10px}

/* ══ FICHE JOUEUR ══ */
.fiche-header{background:linear-gradient(135deg,#0b1e38 0%,#091528 60%,#0d1f34 100%);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px 28px;margin-bottom:16px;display:flex;gap:20px;align-items:flex-start;box-shadow:var(--shadow)}
.fiche-avatar{width:72px;height:72px;border-radius:14px;background:linear-gradient(135deg,var(--border2),var(--bg));display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;border:1px solid var(--border2);box-shadow:0 4px 16px rgba(0,0,0,.3)}
.fiche-name{font-family:'Bebas Neue',sans-serif;font-size:34px;letter-spacing:1px;line-height:1;margin-bottom:8px}
.fiche-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.fiche-actions{display:flex;flex-direction:column;gap:6px;align-items:flex-end;margin-left:auto;flex-shrink:0}
.fiche-section{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:10px;overflow:hidden}
.fiche-section-hdr{padding:10px 16px;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px}
.fiche-body{padding:16px}
.fiche-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.fiche-grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.fiche-field{display:flex;flex-direction:column;gap:4px}
.fiche-label{font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted)}
.fiche-val{font-size:13px;font-weight:500}
.fiche-val-empty{color:var(--dim);font-style:italic;font-size:12px}

.stat-boxes{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:0}
.stat-box{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;text-align:center;transition:all .15s}
.stat-box:hover{border-color:rgba(245,166,35,.2);background:rgba(245,166,35,.03)}
.stat-n{font-family:'Bebas Neue',sans-serif;font-size:28px;color:var(--gold);line-height:1}
.stat-l{font-size:9px;color:var(--muted);margin-top:4px;text-transform:uppercase;letter-spacing:.5px}
.notes-area{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 14px;font-size:12px;color:#7a9aba;line-height:1.7;font-style:italic}

/* ══ URL INPUT PAGE ══ */
.url-page{max-width:680px;margin:40px auto}
.url-hero{text-align:center;margin-bottom:32px}
.url-hero h1{font-family:'Bebas Neue',sans-serif;font-size:44px;letter-spacing:3px;background:linear-gradient(135deg,var(--white) 30%,var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;margin-bottom:8px}
.url-hero p{color:var(--muted);font-size:13px}
.url-box{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:22px;transition:border-color .2s;box-shadow:var(--shadow-sm)}
.url-box:focus-within{border-color:var(--gold);box-shadow:0 0 0 3px rgba(245,166,35,.08)}
.url-lbl{font-size:9px;font-weight:700;letter-spacing:2px;color:var(--gold);text-transform:uppercase;margin-bottom:10px}
.url-row{display:flex;gap:8px}
.url-input{flex:1;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:11px 14px;color:var(--white);font-family:'JetBrains Mono',monospace;font-size:12px;outline:none;transition:border-color .2s}
.url-input::placeholder{color:var(--dim)}
.url-input:focus{border-color:var(--gold)}

/* ══ LOADING ══ */
.loading{text-align:center;padding:80px 20px}
.spinner{width:36px;height:36px;border:2px solid var(--border);border-top-color:var(--gold);border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 16px}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-title{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:2px;margin-bottom:8px}
.loading-step{font-size:12px;color:var(--muted)}

/* ══ MODAL ══ */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(6px)}
.modal{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-lg);width:100%;max-width:640px;max-height:90vh;overflow-y:auto;padding:24px;animation:fadeUp .22s ease;box-shadow:0 24px 80px rgba(0,0,0,.6)}
.modal-lg{max-width:920px}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.modal-title{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:1.5px;margin-bottom:18px;display:flex;align-items:center;gap:10px;justify-content:space-between;color:var(--white)}
.modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px;padding-top:16px;border-top:1px solid var(--border)}

/* ══ FORM ══ */
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.form-field{display:flex;flex-direction:column;gap:5px}
.form-field.full{grid-column:span 2}
.form-lbl{font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted)}
.form-input,.form-select,.form-textarea{background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:9px 12px;color:var(--white);font-family:'Inter',sans-serif;font-size:12px;outline:none;transition:all .2s;width:100%}
.form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--gold);box-shadow:0 0 0 2px rgba(245,166,35,.1)}
.form-select option{background:var(--card)}
.form-textarea{resize:vertical;min-height:72px}

/* ══ BUDGET ══ */
.budget-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px}
.budget-kpi{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px}
.budget-kpi-n{font-family:'Bebas Neue',sans-serif;font-size:30px;color:var(--gold)}
.budget-kpi-l{font-size:10px;color:var(--muted);margin-top:3px;text-transform:uppercase;letter-spacing:.5px}

/* ══ GUIDE ══ */
.guide-section{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:10px;overflow:hidden}
.guide-hdr{padding:12px 16px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid var(--border);cursor:pointer;display:flex;align-items:center;justify-content:space-between;user-select:none;transition:background .15s}
.guide-hdr:hover{background:rgba(255,255,255,.02)}
.guide-body{padding:0}
.guide-row{display:grid;grid-template-columns:220px 1fr;border-top:1px solid rgba(26,45,69,.5)}
.guide-row:first-child{border-top:none}
.guide-key{padding:10px 14px;font-size:11px;font-weight:600;color:var(--white);background:rgba(255,255,255,.02);border-right:1px solid rgba(26,45,69,.5)}
.guide-val{padding:10px 14px;font-size:12px;color:#7a9aba;line-height:1.6}

/* ══ FILTER BAR ══ */
.filter-bar{display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap;align-items:center}
.filter-btn{padding:5px 12px;border-radius:20px;font-size:11px;font-weight:500;cursor:pointer;border:1px solid var(--border);background:transparent;color:var(--muted);transition:all .15s;font-family:'Inter',sans-serif}
.filter-btn:hover{color:var(--white);border-color:var(--border2)}
.filter-btn.active{background:var(--gold);color:#07101f;border-color:var(--gold);font-weight:700;box-shadow:0 2px 8px rgba(245,166,35,.2)}
.search{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:7px 12px;color:var(--white);font-size:12px;outline:none;transition:all .2s;font-family:'Inter',sans-serif}
.search::placeholder{color:var(--dim)}
.search:focus{border-color:var(--gold);box-shadow:0 0 0 2px rgba(245,166,35,.08)}

/* ══ QUICK LINKS ══ */
.quick-grid{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}

/* ══ SYNC STATUS ══ */
.sync-bar{display:flex;gap:8px;align-items:center}
.sync-pill{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--muted)}
.sync-dot{width:7px;height:7px;border-radius:50%}

/* ══ INFO BOX ══ */
.info{background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.15);border-radius:var(--radius-sm);padding:12px 16px;font-size:12px;color:#93c5fd;line-height:1.6;display:flex;gap:10px}
.warn{background:rgba(245,166,35,.06);border:1px solid rgba(245,166,35,.15);border-radius:var(--radius-sm);padding:12px 16px;font-size:12px;color:var(--gold);line-height:1.6;display:flex;gap:10px}
.err{background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.15);border-radius:var(--radius-sm);padding:12px 16px;font-size:12px;color:var(--red);line-height:1.6;display:flex;gap:10px;margin-bottom:12px}
.success{background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.15);border-radius:var(--radius-sm);padding:12px 16px;font-size:12px;color:var(--green);line-height:1.6;display:flex;gap:10px;margin-bottom:12px}

/* ══ TBL HEADER ══ */
.tbl-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.tbl-title{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:2px}

/* ══ SCROLLBAR ══ */
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}
::-webkit-scrollbar-thumb:hover{background:var(--muted)}

/* ══ AUTH ══ */
.auth-bg{position:fixed;inset:0;background:radial-gradient(ellipse at 20% 50%,rgba(245,166,35,.04) 0%,transparent 60%),var(--bg);display:flex;align-items:center;justify-content:center;z-index:999;padding:20px}
.auth-box{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:36px 32px;width:100%;max-width:420px;box-shadow:0 40px 120px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.03)}
.auth-logo{font-family:'Bebas Neue',sans-serif;font-size:36px;letter-spacing:4px;color:var(--white);text-align:center;margin-bottom:2px}
.auth-logo span{color:var(--gold)}
.auth-sub{font-size:10px;color:var(--muted);letter-spacing:2px;text-align:center;margin-bottom:28px;text-transform:uppercase}
.auth-tabs{display:flex;gap:3px;background:var(--bg);border-radius:10px;padding:3px;margin-bottom:22px;border:1px solid var(--border)}
.auth-tab{flex:1;padding:8px;border:none;border-radius:7px;font-size:11px;font-weight:600;cursor:pointer;background:transparent;color:var(--muted);font-family:'Inter',sans-serif;transition:all .15s;letter-spacing:.3px}
.auth-tab.active{background:linear-gradient(135deg,var(--gold),#e8950f);color:#07101f;box-shadow:0 2px 8px rgba(245,166,35,.25)}
.auth-field{margin-bottom:14px}
.auth-lbl{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:6px;display:block}
.auth-input{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:11px 14px;color:var(--white);font-family:'Inter',sans-serif;font-size:13px;outline:none;transition:all .2s;box-sizing:border-box}
.auth-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(245,166,35,.1)}
.auth-btn{width:100%;padding:12px;background:linear-gradient(135deg,var(--gold),#e8950f);color:#07101f;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;margin-top:6px;transition:all .2s;letter-spacing:.3px;box-shadow:0 4px 16px rgba(245,166,35,.25)}
.auth-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(245,166,35,.35)}
.auth-btn:disabled{opacity:.5;transform:none;cursor:not-allowed}
.auth-err{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:8px;padding:10px 14px;font-size:12px;color:var(--red);margin-bottom:12px;text-align:center}
.auth-ok{background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);border-radius:8px;padding:10px 14px;font-size:12px;color:var(--green);margin-bottom:12px;text-align:center}
.auth-code{font-family:'JetBrains Mono',monospace;letter-spacing:2px;text-transform:uppercase}

/* ══ LOGIN ══ */
.login-bg{position:fixed;inset:0;background:var(--bg);display:flex;align-items:center;justify-content:center;z-index:999}
.login-box{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:36px 32px;width:100%;max-width:380px;text-align:center}
.login-logo{font-family:'Bebas Neue',sans-serif;font-size:36px;letter-spacing:3px;color:var(--gold);margin-bottom:4px}
.login-sub{font-size:11px;color:var(--muted);letter-spacing:1px;margin-bottom:28px}

/* ══ TABLET ══ */
@media(max-width:1024px){
  .kpi-grid{grid-template-columns:repeat(3,1fr)}
  .dash-grid{grid-template-columns:1fr}
  .admin-grid{grid-template-columns:repeat(2,1fr)}
  .fiche-grid{grid-template-columns:repeat(2,1fr)}
  .stat-boxes{grid-template-columns:repeat(3,1fr)}
  .budget-grid{grid-template-columns:repeat(2,1fr)}
  .main{padding:20px 20px}
}
/* ══ MOBILE ══ */
@media(max-width:768px){
  .main{padding:12px 10px 80px}
  .page-title{font-size:22px}
  .topbar{height:auto;flex-direction:column;align-items:stretch;padding:10px 14px 0;gap:0}
  .tabs{display:flex;overflow-x:auto;gap:0;-webkit-overflow-scrolling:touch;scrollbar-width:none;border:none;border-radius:0;background:transparent;border-top:1px solid var(--border);margin:8px -14px 0;padding:0 6px}
  .tabs::-webkit-scrollbar{display:none}
  .tab{font-size:10px;padding:10px 10px;white-space:nowrap;flex-shrink:0;border-radius:0;border-bottom:2px solid transparent;background:transparent!important;color:var(--muted)}
  .tab.active{color:var(--gold);border-bottom-color:var(--gold);box-shadow:none}
  .topbar-right{display:none}
  .logo{font-size:18px}
  .kpi-grid{grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:16px}
  .kpi{padding:12px 14px}
  .kpi-n{font-size:28px}
  .card{padding:14px 12px}
  .dash-grid{grid-template-columns:1fr;gap:12px}
  .fiche-header{flex-direction:column;gap:12px;padding:16px}
  .fiche-avatar{width:52px;height:52px;font-size:22px}
  .fiche-name{font-size:24px}
  .fiche-actions{flex-direction:row;margin-left:0;flex-wrap:wrap}
  .fiche-grid{grid-template-columns:repeat(2,1fr);gap:8px}
  .stat-boxes{grid-template-columns:repeat(3,1fr);gap:6px}
  .form-grid{grid-template-columns:1fr}
  .form-field.full{grid-column:span 1}
  .modal{padding:16px;border-radius:16px 16px 0 0;position:fixed;bottom:0;left:0;right:0;max-height:92vh;max-width:100%;border-bottom:none}
  .overlay{align-items:flex-end;padding:0}
  .auth-box{padding:28px 20px;border-radius:16px}
  .auth-logo{font-size:28px}
  .url-page{margin:20px auto;padding:0}
  .url-hero h1{font-size:30px}
  .url-row{flex-direction:column}
  .kanban{gap:8px}
  .budget-grid{grid-template-columns:1fr}
  .admin-grid{grid-template-columns:repeat(2,1fr)}
  .guide-row{grid-template-columns:1fr}
  .guide-key{border-right:none;border-bottom:1px solid rgba(26,45,69,.5)}
  .filter-bar{gap:4px}
  .tbl-header{flex-direction:column;gap:8px;align-items:flex-start}
  .btn{font-size:11px;padding:7px 14px}
  .btn-sm{padding:4px 10px;font-size:10px}
  .radar-wrap{flex-direction:column}
}
@media(max-width:390px){
  .kpi-grid{grid-template-columns:repeat(2,1fr)}
  .stat-boxes{grid-template-columns:repeat(2,1fr)}
  .fiche-grid{grid-template-columns:1fr}
  .auth-tabs{flex-direction:column}
}

/* ══ ADMIN ══ */
.admin-bg{min-height:100vh;background:var(--bg);padding:28px}
.admin-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px}
.admin-title{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:2px;color:var(--gold)}
.admin-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px}
.admin-kpi{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:18px}
.admin-kpi-n{font-family:'Bebas Neue',sans-serif;font-size:38px;color:var(--gold)}
.admin-kpi-l{font-size:10px;color:var(--muted);margin-top:3px;text-transform:uppercase;letter-spacing:.5px}
.admin-section{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:22px;margin-bottom:20px}
.admin-section-title{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:16px}
.club-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border)}
.club-row:last-child{border-bottom:none}
.club-code{font-family:'JetBrains Mono',monospace;font-size:12px;background:rgba(245,166,35,.1);color:var(--gold);padding:3px 10px;border-radius:6px;letter-spacing:1.5px;border:1px solid rgba(245,166,35,.15)}

/* ══ ALERTES CONTRATS ══ */
.alert-banner{background:linear-gradient(135deg,rgba(239,68,68,.06),rgba(239,68,68,.03));border:1px solid rgba(239,68,68,.2);border-radius:var(--radius);padding:14px 18px;margin-bottom:20px}
.alert-banner-title{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--red);margin-bottom:10px;display:flex;align-items:center;gap:6px}
.alert-list{display:flex;flex-wrap:wrap;gap:8px}
.alert-pill{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);border-radius:20px;padding:4px 12px;font-size:11px;color:var(--red);cursor:pointer;transition:all .15s;font-weight:500}
.alert-pill:hover{background:rgba(239,68,68,.2);transform:translateY(-1px)}
.alert-pill-orange{background:rgba(249,115,22,.1);border-color:rgba(249,115,22,.2);color:var(--orange)}
.alert-pill-orange:hover{background:rgba(249,115,22,.2)}

/* ══ NOTATION RADAR ══ */
.radar-wrap{display:flex;align-items:center;gap:28px;flex-wrap:wrap}
.radar-sliders{flex:1;min-width:220px;display:flex;flex-direction:column;gap:10px}
.radar-row{display:flex;align-items:center;gap:10px;font-size:11px}
.radar-lbl{width:88px;color:var(--muted);font-weight:600;letter-spacing:.5px;font-size:10px;text-transform:uppercase}
.radar-val{width:26px;text-align:right;font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--white)}
input[type=range].slider{-webkit-appearance:none;appearance:none;height:5px;background:var(--border);border-radius:3px;outline:none;flex:1;cursor:pointer}
input[type=range].slider::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;background:var(--gold);cursor:pointer;box-shadow:0 0 6px rgba(245,166,35,.4)}

/* ══ VIDEO ══ */
.video-wrap{position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:var(--radius);background:var(--bg);border:1px solid var(--border)}
.video-wrap iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:0;border-radius:var(--radius)}

/* ══ CONTACT LOG ══ */
.contact-log{display:flex;flex-direction:column;gap:8px}
.contact-entry{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 14px;font-size:12px;display:flex;gap:10px;align-items:flex-start;transition:border-color .15s}
.contact-entry:hover{border-color:var(--border2)}
.contact-date{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--muted);white-space:nowrap;margin-top:2px;flex-shrink:0}
.contact-type{font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;white-space:nowrap;flex-shrink:0;background:rgba(255,255,255,.06);color:var(--white)}
.contact-note{color:var(--white);line-height:1.5;flex:1}

/* ══ COMPARATEUR ══ */
.comp-row{display:grid;border-left:1px solid var(--border);border-right:1px solid var(--border);border-bottom:1px solid rgba(26,45,69,.4)}
.comp-label{background:rgba(255,255,255,.02);padding:10px 14px;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);border-right:1px solid var(--border)}
.comp-cell{padding:10px 14px;font-size:12px;text-align:center;border-right:1px solid rgba(26,45,69,.3)}
.comp-cell:last-child{border-right:none}
.comp-better{color:var(--green);font-weight:700}
.comp-worse{color:var(--red)}

/* ══ TERRAIN TACTIQUE ══ */
.pitch-container{display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap}
.pitch-sidebar{width:220px;flex-shrink:0;display:flex;flex-direction:column;gap:10px}
.pitch-sidebar-title{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:6px}
.pitch-player-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:8px 10px;font-size:11px;cursor:grab;transition:all .15s;user-select:none}
.pitch-player-card:hover{border-color:var(--border2);transform:translateX(2px)}
.pitch-player-card.dragging{opacity:.5;cursor:grabbing}
.pitch-player-card-name{font-weight:600;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px}
.pitch-player-card-pos{color:var(--muted);font-size:10px}
.formation-selector{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}
.formation-btn{padding:5px 12px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid var(--border);background:transparent;color:var(--muted);transition:all .15s;font-family:'Inter',sans-serif}
.formation-btn:hover{color:var(--white);border-color:var(--border2)}
.formation-btn.active{background:var(--gold);color:#07101f;border-color:var(--gold);font-weight:700}
.pitch-actions{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
.pitch-name-input{background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:6px 10px;color:var(--white);font-size:12px;outline:none;font-family:'Inter',sans-serif;flex:1;min-width:120px}
.pitch-name-input:focus{border-color:var(--gold)}

/* ══ PRINT ══ */
@media print{
  .topbar,.sync-bar,.tabs,.btn,.filter-bar,.modal-actions,.fiche-actions,.no-print{display:none!important}
  .main{padding:0!important}
  .fiche-section{break-inside:avoid}
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
  tmUrl:"",ssUrl:"",videoUrl:"",photoUrl:"",clubLogoUrl:"",
  notation:{technique:0,physique:0,mental:0,vitesse:0,defense:0,potentiel:0},
  contacts:[],
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
  const res = await fetch("/api/analyze",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({tmUrl})
  });
  if(!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  if(data.error) throw new Error(data.error);
  onStep("📊 Traitement de la fiche...");
  let d=data.player||null;
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
   RADAR CHART (SVG)
══════════════════════════════════════════════════════════ */
const RADAR_AXES = ["Technique","Physique","Mental","Vitesse","Défense","Potentiel"];
const RADAR_KEYS = ["technique","physique","mental","vitesse","defense","potentiel"];
const RADAR_COLORS = {"GK":"#60a5fa","DEF":"#4ade80","MIL":"#93c5fd","ATT":"#fca5a5","STAFF":"#c4b5fd"};

function RadarChart({notation={}, role="ATT", size=180}){
  const vals = RADAR_KEYS.map(k => (notation[k]||0)/10);
  const cx=size/2, cy=size/2, r=size*0.38;
  const angle = i => (Math.PI*2*i/6) - Math.PI/2;
  const pt = (i,v) => [cx+r*v*Math.cos(angle(i)), cy+r*v*Math.sin(angle(i))];
  const color = RADAR_COLORS[role]||"#f5a623";
  const grid = [0.25,0.5,0.75,1];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
      {/* Grid */}
      {grid.map(g=>(
        <polygon key={g} points={RADAR_AXES.map((_,i)=>pt(i,g).join(",")).join(" ")}
          fill="none" stroke="rgba(28,46,71,.6)" strokeWidth={0.5}/>
      ))}
      {/* Axes */}
      {RADAR_AXES.map((_,i)=>(
        <line key={i} x1={cx} y1={cy} x2={pt(i,1)[0]} y2={pt(i,1)[1]}
          stroke="rgba(28,46,71,.6)" strokeWidth={0.5}/>
      ))}
      {/* Data */}
      <polygon points={vals.map((v,i)=>pt(i,v).join(",")).join(" ")}
        fill={color} fillOpacity={0.15} stroke={color} strokeWidth={1.5}/>
      {/* Dots */}
      {vals.map((v,i)=><circle key={i} cx={pt(i,v)[0]} cy={pt(i,v)[1]} r={3} fill={color}/>)}
      {/* Labels */}
      {RADAR_AXES.map((lbl,i)=>{
        const [x,y]=pt(i,1.22);
        return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
          fill="#5a7a9a" fontSize={size*0.065} fontFamily="Inter,sans-serif">{lbl}</text>;
      })}
    </svg>
  );
}

function RadarEditor({notation={}, onChange, role="ATT"}){
  const n = {...{technique:0,physique:0,mental:0,vitesse:0,defense:0,potentiel:0}, ...notation};
  const color = RADAR_COLORS[role]||"#f5a623";
  const score = Math.round(Object.values(n).reduce((a,b)=>a+b,0)/6*10)/10;
  return (
    <div className="radar-wrap">
      <RadarChart notation={n} role={role} size={180}/>
      <div className="radar-sliders">
        <div style={{fontSize:11,color:"var(--muted)",marginBottom:4}}>Note globale : <span style={{fontFamily:"'Bebas Neue'",fontSize:20,color}}>{score}/10</span></div>
        {RADAR_KEYS.map((k,i)=>(
          <div className="radar-row" key={k}>
            <div className="radar-lbl">{RADAR_AXES[i]}</div>
            <input type="range" className="slider" min={0} max={10} step={1} value={n[k]||0}
              onChange={e=>onChange({...n,[k]:parseInt(e.target.value)})}
              style={{"--fill":color}}/>
            <div className="radar-val">{n[k]||0}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   VIDEO EMBED
══════════════════════════════════════════════════════════ */
function VideoEmbed({url}){
  if(!url) return null;
  let embed = null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if(yt) embed = `https://www.youtube.com/embed/${yt[1]}`;
  else if(vm) embed = `https://player.vimeo.com/video/${vm[1]}`;
  if(!embed) return (
    <a href={url} target="_blank" rel="noreferrer"
      style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12,color:"var(--gold)",textDecoration:"none"}}>
      🎬 Voir la vidéo ↗
    </a>
  );
  return (
    <div className="video-wrap">
      <iframe src={embed} allowFullScreen title="Video joueur"/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CONTACT LOG
══════════════════════════════════════════════════════════ */
const CONTACT_TYPES = ["📞 Appel","📧 Email","👁️ Observation","🤝 Réunion","💬 WhatsApp","📝 Note"];
const CONTACT_COLORS = {
  "📞 Appel":"rgba(59,130,246,.15)","📧 Email":"rgba(168,85,247,.15)",
  "👁️ Observation":"rgba(34,197,94,.15)","🤝 Réunion":"rgba(245,166,35,.15)",
  "💬 WhatsApp":"rgba(34,197,94,.15)","📝 Note":"rgba(90,122,154,.15)"
};

function ContactLog({contacts=[], onChange, readOnly=false}){
  const [type,setType]=useState("📞 Appel");
  const [note,setNote]=useState("");
  const sorted = [...contacts].sort((a,b)=>new Date(b.date)-new Date(a.date));
  const add = () => {
    if(!note.trim()) return;
    const entry={id:Date.now(),date:new Date().toISOString(),type,note:note.trim()};
    onChange([...contacts,entry]);
    setNote("");
  };
  return (
    <div>
      {!readOnly&&(
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          <select className="form-select" style={{width:160}} value={type} onChange={e=>setType(e.target.value)}>
            {CONTACT_TYPES.map(t=><option key={t}>{t}</option>)}
          </select>
          <input className="form-input" style={{flex:1,minWidth:200}} placeholder="Note de contact..."
            value={note} onChange={e=>setNote(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}/>
          <button className="btn btn-gold btn-sm" onClick={add}>+ Ajouter</button>
        </div>
      )}
      {sorted.length===0&&<div style={{color:"var(--dim)",fontSize:12,fontStyle:"italic"}}>Aucun contact enregistré</div>}
      <div className="contact-log">
        {sorted.map(c=>(
          <div className="contact-entry" key={c.id} style={{background:CONTACT_COLORS[c.type]||"var(--bg)"}}>
            <div className="contact-date">{new Date(c.date).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
            <div className="contact-type" style={{background:"rgba(255,255,255,.08)",color:"var(--white)"}}>{c.type}</div>
            <div className="contact-note">{c.note}</div>
            {!readOnly&&<button onClick={()=>onChange(contacts.filter(x=>x.id!==c.id))}
              style={{background:"none",border:"none",color:"var(--dim)",cursor:"pointer",fontSize:14,padding:"0 4px",flexShrink:0}}>✕</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FICHE JOUEUR VIEW
══════════════════════════════════════════════════════════ */
function FicheView({player:p, onEdit, onSave, onDiscard, isSaved, onContactsChange}){
  const al=ctAlert(p.finContrat);
  const notation = p.notation||{technique:0,physique:0,mental:0,vitesse:0,defense:0,potentiel:0};
  const contacts = p.contacts||[];
  const score = Math.round(Object.values(notation).reduce((a,b)=>a+b,0)/6*10)/10;
  return (
    <div>
      {/* Header */}
      <div className="fiche-header">
        {/* Photo joueur : vraie photo si dispo, sinon emoji rôle */}
        {p.photoUrl
          ? <div style={{
              width:80,height:80,borderRadius:14,overflow:'hidden',flexShrink:0,
              border:'2px solid var(--border)',background:'var(--surface)',
              boxShadow:'0 4px 16px rgba(0,0,0,.4)'
            }}>
              <img src={p.photoUrl} alt={p.nom}
                style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top'}}
                onError={e=>{e.target.style.display='none'; e.target.parentNode.innerHTML=`<span style="font-size:36px;display:flex;align-items:center;justify-content:center;height:100%">${ROLE_E[p.role]||"⚽"}</span>`;}}
              />
            </div>
          : <div className="fiche-avatar">{ROLE_E[p.role]||"⚽"}</div>
        }
        <div style={{flex:1}}>
          <div className="fiche-name">{p.nom||"Joueur"}</div>
          <div className="fiche-tags">
            {p.role&&<RoleTag role={p.role}/>}
            {p.poste&&<span className="tag tag-gray">{p.poste}</span>}
            {p.nationalite&&<span className="tag tag-gold">🌍 {p.nationalite}</span>}
            {p.passeportUE==="Oui"&&<span className="tag tag-green">🇪🇺 UE</span>}
            {p.categorie&&<span className={`tag ${p.categorie==="EFFECTIF"?"tag-blue":"tag-purple"}`}>{p.categorie}</span>}
            {score>0&&<span className="tag tag-gold">⭐ {score}/10</span>}
          </div>
          <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
            <StatusTag statut={p.statut}/>
            <PrioTag prio={p.priorite}/>
          </div>
        </div>
        <div className="fiche-actions no-print">
          {!isSaved&&<button className="btn btn-gold btn-sm" onClick={onSave}>💾 Sauvegarder</button>}
          <button className="btn btn-ghost btn-sm" onClick={onEdit}>✏️ Modifier</button>
          <button className="btn btn-ghost btn-sm" onClick={()=>window.print()}>🖨️ PDF</button>
          {!isSaved&&<button className="btn btn-red btn-sm" onClick={onDiscard}>✕ Annuler</button>}
        </div>
      </div>

      {al&&<div className="warn" style={{marginBottom:"12px"}}>⚠️ Contrat expirant le <strong>{p.finContrat}</strong> — À contacter en priorité</div>}

      {/* Section 1 */}
      <div className="fiche-section">
        <div className="fiche-section-hdr" style={{background:"rgba(59,130,246,.06)",color:"#93c5fd"}}>🔵 1. IDENTITÉ & PROFIL</div>
        <div className="fiche-body">
          <div className="fiche-grid">
            {[["Nom complet",p.nom],["Nationalité(s)",p.nationalite],["Date de naissance",p.ddn],["Âge",p.age?p.age+" ans":""],["Taille / Poids",p.taille?p.taille+" cm":""],["Pied fort",p.pied],["Poste principal",p.poste],["Postes secondaires",p.postesSec],["Rôle",p.role]].map(([l,v])=>(
              <div className="fiche-field" key={l}><div className="fiche-label">{l}</div><FVal v={v}/></div>
            ))}
          </div>
          {(p.tmUrl||p.ssUrl||p.videoUrl)&&<div style={{marginTop:"12px",display:"flex",gap:"14px",flexWrap:"wrap"}}>
            {p.tmUrl&&<a href={p.tmUrl} target="_blank" rel="noreferrer" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--gold)",textDecoration:"none",opacity:.8}}>🔗 Transfermarkt ↗</a>}
            {p.ssUrl&&<a href={p.ssUrl} target="_blank" rel="noreferrer" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--gold)",textDecoration:"none",opacity:.8}}>🔗 SofaScore ↗</a>}
          </div>}
        </div>
      </div>

      {/* Video */}
      {p.videoUrl&&(
        <div className="fiche-section">
          <div className="fiche-section-hdr" style={{background:"rgba(239,68,68,.06)",color:"#f87171"}}>🎬 VIDÉO</div>
          <div className="fiche-body"><VideoEmbed url={p.videoUrl}/></div>
        </div>
      )}

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

      {/* Section 4 — Notation Radar */}
      <div className="fiche-section">
        <div className="fiche-section-hdr" style={{background:"rgba(245,166,35,.06)",color:"var(--gold)"}}>⭐ 4. NOTATION DS</div>
        <div className="fiche-body">
          <RadarChart notation={notation} role={p.role} size={200}/>
          {score>0&&(
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:14}}>
              {RADAR_KEYS.map((k,i)=>(
                <div key={k} style={{textAlign:"center",minWidth:70}}>
                  <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".5px",marginBottom:3}}>{RADAR_AXES[i]}</div>
                  <div style={{fontFamily:"'Bebas Neue'",fontSize:22,color:RADAR_COLORS[p.role]||"var(--gold)"}}>{notation[k]||0}</div>
                </div>
              ))}
            </div>
          )}
          {score===0&&<div style={{color:"var(--dim)",fontSize:12,fontStyle:"italic",marginTop:8}}>Aucune notation — modifie la fiche pour noter ce joueur.</div>}
        </div>
      </div>

      {/* Section 5 — Critères Andorre */}
      <div className="fiche-section">
        <div className="fiche-section-hdr" style={{background:"rgba(168,85,247,.06)",color:"var(--purple)"}}>🏔️ 5. CRITÈRES SPÉCIFIQUES</div>
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

      {/* Section 6 — Évaluation */}
      <div className="fiche-section">
        <div className="fiche-section-hdr" style={{background:"rgba(239,68,68,.06)",color:"var(--red)"}}>📋 6. ÉVALUATION DS</div>
        <div className="fiche-body">
          <div className="fiche-grid" style={{marginBottom:"12px"}}>
            {[["Priorité",p.priorite],["Statut scouting",p.statut],["Fit tactique",p.fit],["Compat. salariale",p.compatSal],["Recommandé par",p.recommande],["Retour joueur",p.retourJoueur]].map(([l,v])=>(
              <div className="fiche-field" key={l}><div className="fiche-label">{l}</div><FVal v={v}/></div>
            ))}
          </div>
          {p.pointsForts&&<div style={{marginBottom:"8px"}}><div className="fiche-label" style={{marginBottom:"4px"}}>Points forts</div><div style={{fontSize:"12px",color:"var(--green)",lineHeight:1.6}}>{cleanText(p.pointsForts)}</div></div>}
          {p.pointsFaibles&&<div style={{marginBottom:"8px"}}><div className="fiche-label" style={{marginBottom:"4px"}}>Points faibles</div><div style={{fontSize:"12px",color:"var(--red)",lineHeight:1.6}}>{cleanText(p.pointsFaibles)}</div></div>}
          {p.commentaires&&<div><div className="fiche-label" style={{marginBottom:"4px"}}>Commentaires DS</div><div className="notes-area">{cleanText(p.commentaires)}</div></div>}
        </div>
      </div>

      {/* Section 7 — Timeline contacts */}
      <div className="fiche-section no-print">
        <div className="fiche-section-hdr" style={{background:"rgba(6,182,212,.06)",color:"var(--cyan)"}}>📅 7. HISTORIQUE CONTACTS <span style={{marginLeft:"auto",fontSize:10,color:"var(--muted)"}}>{contacts.length} entrée{contacts.length>1?"s":""}</span></div>
        <div className="fiche-body">
          <ContactLog contacts={contacts} onChange={onContactsChange||((c)=>{})} readOnly={!onContactsChange}/>
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
        <div style={{fontWeight:700,fontSize:11,letterSpacing:1,textTransform:"uppercase",color:"var(--muted)",marginBottom:10,paddingBottom:6,borderBottom:"1px solid var(--border)"}}>⭐ NOTATION DS</div>
        <div style={{marginBottom:16}}>
          <RadarEditor notation={f.notation||{technique:0,physique:0,mental:0,vitesse:0,defense:0,potentiel:0}} role={f.role}
            onChange={n=>s("notation",n)}/>
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
          <div className="form-field full">{fi("videoUrl","🎬 Vidéo URL (YouTube / Vimeo)")}</div>
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
function PlayerTable({players, title, rowClass, onView, onEdit, onDelete, onExport, onSign, onRefuse}){
  const [search,setSearch]=useState("");
  const [fRole,setFRole]=useState("TOUS");
  const [fStatut,setFStatut]=useState("TOUS");
  const [confirmSign, setConfirmSign] = useState(null); // player à confirmer

  const filtered=players.filter(p=>{
    if(fRole!=="TOUS"&&p.role!==fRole) return false;
    if(fStatut!=="TOUS"&&p.statut!==fStatut) return false;
    if(search&&!`${p.nom} ${p.club} ${p.poste}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const isCibles = players.some(p=>p.categorie==="CIBLE");

  return (
    <div>
      {/* Modal de confirmation signature */}
      {confirmSign&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setConfirmSign(null)}>
          <div className="modal" style={{maxWidth:440,textAlign:'center'}}>
            <div style={{fontSize:40,marginBottom:8}}>🏆</div>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:22,letterSpacing:1,marginBottom:8}}>CONFIRMER LA SIGNATURE</div>
            <div style={{fontSize:13,color:'var(--muted)',marginBottom:20,lineHeight:1.6}}>
              <strong style={{color:'var(--white)'}}>{confirmSign.nom}</strong> sera transféré de <span className="tag tag-purple" style={{fontSize:11}}>Cibles</span> vers <span className="tag tag-green" style={{fontSize:11}}>Effectif</span><br/>
              Son statut passera à <strong style={{color:'var(--green)'}}>Sous contrat</strong> et il sera disponible sur le Terrain.
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'center'}}>
              <button className="btn btn-ghost" onClick={()=>setConfirmSign(null)}>Annuler</button>
              <button className="btn btn-gold" onClick={()=>{ onSign(confirmSign); setConfirmSign(null); }}>✅ Confirmer la signature</button>
            </div>
          </div>
        </div>
      )}

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
                <td>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {/* Mini photo joueur */}
                    {p.photoUrl
                      ? <img src={p.photoUrl} alt={p.nom}
                          style={{width:30,height:30,borderRadius:8,objectFit:'cover',objectPosition:'top',border:'1px solid var(--border)',flexShrink:0}}
                          onError={e=>e.target.style.display='none'}
                        />
                      : <div style={{width:30,height:30,borderRadius:8,background:'var(--surface-2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>{ROLE_E[p.role]||"⚽"}</div>
                    }
                    <strong>{p.nom}</strong>
                  </div>
                </td>
                <td>{p.nationalite}</td>
                <td>{p.age||"—"}</td>
                <td>{p.pied||"—"}</td>
                <td>{p.poste}</td>
                <td><RoleTag role={p.role}/></td>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    {p.clubLogoUrl&&<img src={p.clubLogoUrl} alt="" style={{width:18,height:18,objectFit:'contain',flexShrink:0}} onError={e=>e.target.style.display='none'}/>}
                    {p.club}
                  </div>
                </td>
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
                    {/* Boutons signer / refuser uniquement sur les cibles non-terminées */}
                    {isCibles && p.statut!=="Signé" && p.statut!=="Refusé" && onSign && (
                      <button
                        className="btn btn-sm"
                        style={{background:'rgba(34,197,94,.12)',color:'var(--green)',border:'1px solid rgba(34,197,94,.25)',padding:'4px 8px',fontSize:11}}
                        title="Signer ce joueur → transfère en Effectif"
                        onClick={()=>setConfirmSign(p)}
                      >✅</button>
                    )}
                    {isCibles && p.statut!=="Signé" && p.statut!=="Refusé" && onRefuse && (
                      <button
                        className="btn btn-sm"
                        style={{background:'rgba(239,68,68,.1)',color:'var(--red)',border:'1px solid rgba(239,68,68,.2)',padding:'4px 8px',fontSize:11}}
                        title="Marquer comme refusé"
                        onClick={()=>onRefuse(p)}
                      >❌</button>
                    )}
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
   COMPARATEUR
══════════════════════════════════════════════════════════ */
function ComparateurPage({players}){
  const [selA,setSelA]=useState("");
  const [selB,setSelB]=useState("");
  const pA=players.find(p=>p.id==selA);
  const pB=players.find(p=>p.id==selB);

  const compare=(a,b,key,numeric=true)=>{
    if(!a||!b) return [false,false];
    const va=numeric?parseFloat(a[key]||0):a[key];
    const vb=numeric?parseFloat(b[key]||0):b[key];
    if(numeric) return [va>vb,va<vb];
    return [false,false];
  };

  const ROWS=[
    {l:"Âge",k:"age",num:true,better:"lower"},
    {l:"Taille (cm)",k:"taille",num:true,better:"higher"},
    {l:"Club",k:"club",num:false},
    {l:"Ligue",k:"ligue",num:false},
    {l:"Fin contrat",k:"finContrat",num:false},
    {l:"Valeur TM",k:"valeur",num:true,better:"lower",fmt:v=>v?parseInt(v).toLocaleString("fr")+"€":"—"},
    {l:"Matchs",k:"matchs",num:true,better:"higher"},
    {l:"Buts",k:"buts",num:true,better:"higher"},
    {l:"Passes D.",k:"passes",num:true,better:"higher"},
    {l:"xG",k:"xG",num:true,better:"higher"},
    {l:"Note SS",k:"noteSS",num:true,better:"higher"},
    {l:"Passeport UE",k:"passeportUE",num:false},
    {l:"Statut",k:"statut",num:false},
    {l:"Priorité",k:"priorite",num:false},
  ];

  const getScore=(p)=>{
    if(!p?.notation) return 0;
    return Math.round(Object.values(p.notation).reduce((a,b)=>a+b,0)/6*10)/10;
  };

  const cols=2;
  const gridStyle={gridTemplateColumns:`180px repeat(${cols},1fr)`};

  return (
    <div>
      <div className="page-title">⚖️ COMPARATEUR</div>
      <div className="page-sub">Comparez deux joueurs côte à côte</div>

      {/* Selector */}
      <div style={{display:"flex",gap:16,marginBottom:20,flexWrap:"wrap"}}>
        {[["Joueur A",selA,setSelA],["Joueur B",selB,setSelB]].map(([lbl,val,set])=>(
          <div key={lbl} style={{flex:1,minWidth:200}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--muted)",marginBottom:6}}>{lbl}</div>
            <select className="form-select" value={val} onChange={e=>set(e.target.value)}>
              <option value="">— Choisir un joueur —</option>
              {players.map(p=><option key={p.id} value={p.id}>{p.nom} ({p.poste||p.role})</option>)}
            </select>
          </div>
        ))}
      </div>

      {pA&&pB&&(
        <div style={{borderRadius:10,overflow:"hidden",border:"1px solid var(--border)"}}>
          {/* Header */}
          <div style={{display:"grid",...gridStyle,background:"#0a1828"}}>
            <div style={{padding:"14px 16px",fontSize:10,fontWeight:700,letterSpacing:1,color:"var(--muted)",textTransform:"uppercase"}}>Critère</div>
            {[pA,pB].map(p=>(
              <div key={p.id} style={{padding:"14px 16px",textAlign:"center",borderLeft:"1px solid var(--border)"}}>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:18,letterSpacing:1}}>{p.nom}</div>
                <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{p.poste} · <RoleTag role={p.role}/></div>
              </div>
            ))}
          </div>

          {/* Note globale */}
          <div style={{display:"grid",...gridStyle,background:"rgba(245,166,35,.04)",borderTop:"1px solid var(--border)"}}>
            <div className="comp-label">Note DS globale</div>
            {[pA,pB].map((p,i)=>{
              const s=getScore(p); const other=getScore(i===0?pB:pA);
              return <div key={p.id} className={`comp-cell ${s>other?"comp-better":s<other?"comp-worse":""}`} style={{borderLeft:"1px solid var(--border)"}}>
                {s>0?<>{s}/10 <RadarChart notation={p.notation} role={p.role} size={60}/></>:"—"}
              </div>;
            })}
          </div>

          {/* Radar mini */}
          <div style={{display:"grid",...gridStyle,borderTop:"1px solid var(--border)"}}>
            <div className="comp-label">Radar</div>
            {[pA,pB].map(p=>(
              <div key={p.id} className="comp-cell" style={{borderLeft:"1px solid var(--border)",display:"flex",justifyContent:"center"}}>
                <RadarChart notation={p.notation||{}} role={p.role} size={100}/>
              </div>
            ))}
          </div>

          {/* Data rows */}
          {ROWS.map(row=>(
            <div key={row.k} style={{display:"grid",...gridStyle,borderTop:"1px solid rgba(28,46,71,.5)"}}>
              <div className="comp-label">{row.l}</div>
              {[pA,pB].map((p,i)=>{
                const other=i===0?pB:pA;
                const va=row.num?parseFloat(p[row.k]||0):0;
                const vb=row.num?parseFloat(other[row.k]||0):0;
                const better=row.num&&row.better==="higher"?va>vb:row.num&&row.better==="lower"?va<vb:false;
                const worse=row.num&&row.better==="higher"?va<vb:row.num&&row.better==="lower"?va>vb:false;
                const display=row.fmt?row.fmt(p[row.k]):(p[row.k]||"—");
                return <div key={p.id} className={`comp-cell ${better?"comp-better":worse?"comp-worse":""}`} style={{borderLeft:"1px solid var(--border)"}}>{display}</div>;
              })}
            </div>
          ))}
        </div>
      )}

      {(!pA||!pB)&&(
        <div className="info"><span>💡</span><div>Sélectionne deux joueurs pour les comparer côte à côte sur tous les critères.</div></div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TERRAIN TACTIQUE
══════════════════════════════════════════════════════════ */

// ─── Formations : [nom, [postes normalisés avec coords x/y en %]]
// x = gauche→droite (0=gauche=but adversaire vue depuis haut)
// y = bas→haut (0=bas=gardien)
const FORMATIONS = {
  "4-3-3": {
    label:"4-3-3", color:"#f5a623",
    positions:[
      {id:"GK",label:"G",x:50,y:8},
      {id:"RB",label:"DD",x:18,y:22},{id:"CB1",label:"DC",x:36,y:22},{id:"CB2",label:"DC",x:64,y:22},{id:"LB",label:"DG",x:82,y:22},
      {id:"CM1",label:"MC",x:28,y:44},{id:"CM2",label:"MC",x:50,y:44},{id:"CM3",label:"MC",x:72,y:44},
      {id:"RW",label:"AD",x:20,y:72},{id:"ST",label:"AC",x:50,y:78},{id:"LW",label:"AG",x:80,y:72},
    ]
  },
  "4-4-2": {
    label:"4-4-2", color:"#3b82f6",
    positions:[
      {id:"GK",label:"G",x:50,y:8},
      {id:"RB",label:"DD",x:18,y:22},{id:"CB1",label:"DC",x:36,y:22},{id:"CB2",label:"DC",x:64,y:22},{id:"LB",label:"DG",x:82,y:22},
      {id:"RM",label:"MD",x:18,y:50},{id:"CM1",label:"MC",x:38,y:50},{id:"CM2",label:"MC",x:62,y:50},{id:"LM",label:"MG",x:82,y:50},
      {id:"ST1",label:"AC",x:35,y:76},{id:"ST2",label:"AC",x:65,y:76},
    ]
  },
  "4-2-3-1": {
    label:"4-2-3-1", color:"#22c55e",
    positions:[
      {id:"GK",label:"G",x:50,y:8},
      {id:"RB",label:"DD",x:18,y:20},{id:"CB1",label:"DC",x:36,y:20},{id:"CB2",label:"DC",x:64,y:20},{id:"LB",label:"DG",x:82,y:20},
      {id:"CDM1",label:"MD",x:37,y:38},{id:"CDM2",label:"MD",x:63,y:38},
      {id:"RAM",label:"MOD",x:20,y:57},{id:"CAM",label:"MOC",x:50,y:57},{id:"LAM",label:"MOG",x:80,y:57},
      {id:"ST",label:"AC",x:50,y:78},
    ]
  },
  "3-5-2": {
    label:"3-5-2", color:"#a855f7",
    positions:[
      {id:"GK",label:"G",x:50,y:8},
      {id:"CB1",label:"DC",x:28,y:22},{id:"CB2",label:"DC",x:50,y:22},{id:"CB3",label:"DC",x:72,y:22},
      {id:"RWB",label:"PLD",x:12,y:46},{id:"CM1",label:"MC",x:32,y:46},{id:"CM2",label:"MC",x:50,y:46},{id:"CM3",label:"MC",x:68,y:46},{id:"LWB",label:"PLG",x:88,y:46},
      {id:"ST1",label:"AC",x:35,y:76},{id:"ST2",label:"AC",x:65,y:76},
    ]
  },
  "4-1-4-1": {
    label:"4-1-4-1", color:"#06b6d4",
    positions:[
      {id:"GK",label:"G",x:50,y:8},
      {id:"RB",label:"DD",x:18,y:20},{id:"CB1",label:"DC",x:36,y:20},{id:"CB2",label:"DC",x:64,y:20},{id:"LB",label:"DG",x:82,y:20},
      {id:"CDM",label:"MD",x:50,y:36},
      {id:"RM",label:"MD",x:16,y:55},{id:"CM1",label:"MC",x:36,y:55},{id:"CM2",label:"MC",x:64,y:55},{id:"LM",label:"MG",x:84,y:55},
      {id:"ST",label:"AC",x:50,y:78},
    ]
  },
  "3-4-3": {
    label:"3-4-3", color:"#ef4444",
    positions:[
      {id:"GK",label:"G",x:50,y:8},
      {id:"CB1",label:"DC",x:28,y:22},{id:"CB2",label:"DC",x:50,y:22},{id:"CB3",label:"DC",x:72,y:22},
      {id:"RM",label:"MD",x:18,y:46},{id:"CM1",label:"MC",x:38,y:46},{id:"CM2",label:"MC",x:62,y:46},{id:"LM",label:"MG",x:82,y:46},
      {id:"RW",label:"AD",x:20,y:74},{id:"ST",label:"AC",x:50,y:80},{id:"LW",label:"AG",x:80,y:74},
    ]
  },
  "5-3-2": {
    label:"5-3-2", color:"#f97316",
    positions:[
      {id:"GK",label:"G",x:50,y:8},
      {id:"RWB",label:"PLD",x:12,y:22},{id:"CB1",label:"DC",x:28,y:22},{id:"CB2",label:"DC",x:50,y:22},{id:"CB3",label:"DC",x:72,y:22},{id:"LWB",label:"PLG",x:88,y:22},
      {id:"CM1",label:"MC",x:28,y:50},{id:"CM2",label:"MC",x:50,y:50},{id:"CM3",label:"MC",x:72,y:50},
      {id:"ST1",label:"AC",x:35,y:78},{id:"ST2",label:"AC",x:65,y:78},
    ]
  },
  "4-3-2-1": {
    label:"4-3-2-1", color:"#60a5fa",
    positions:[
      {id:"GK",label:"G",x:50,y:8},
      {id:"RB",label:"DD",x:18,y:20},{id:"CB1",label:"DC",x:36,y:20},{id:"CB2",label:"DC",x:64,y:20},{id:"LB",label:"DG",x:82,y:20},
      {id:"CM1",label:"MC",x:28,y:40},{id:"CM2",label:"MC",x:50,y:40},{id:"CM3",label:"MC",x:72,y:40},
      {id:"SS1",label:"SA",x:36,y:60},{id:"SS2",label:"SA",x:64,y:60},
      {id:"ST",label:"AC",x:50,y:80},
    ]
  },
};

// SVG Terrain de football
function PitchSVG({formation, lineup, onSlotClick, onSlotDrop}){
  const form = FORMATIONS[formation];
  if(!form) return null;
  const W=480, H=680;

  const handleDrop=(e,pos)=>{
    e.preventDefault();
    const pid = e.dataTransfer.getData("playerId");
    if(pid) onSlotDrop(pos.id, pid);
  };
  const handleDragOver=(e)=>{ e.preventDefault(); };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",maxWidth:480,display:"block",borderRadius:12,boxShadow:"0 8px 40px rgba(0,0,0,.5)"}}
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#16a34a" stopOpacity=".85"/>
          <stop offset="100%" stopColor="#14532d" stopOpacity=".95"/>
        </radialGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* Fond terrain */}
      <rect width={W} height={H} fill="url(#pg)" rx={12}/>

      {/* Bandes d'herbe */}
      {[0,1,2,3,4,5,6,7].map(i=>(
        <rect key={i} x={0} y={i*(H/8)} width={W} height={H/8} fill="rgba(0,0,0,.06)" opacity={i%2===0?1:0}/>
      ))}

      {/* Contour du terrain */}
      <rect x={28} y={28} width={W-56} height={H-56} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={1.5} rx={2}/>

      {/* Ligne médiane */}
      <line x1={28} y1={H/2} x2={W-28} y2={H/2} stroke="rgba(255,255,255,.3)" strokeWidth={1}/>

      {/* Cercle central */}
      <circle cx={W/2} cy={H/2} r={52} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={1}/>
      <circle cx={W/2} cy={H/2} r={3} fill="rgba(255,255,255,.5)"/>

      {/* Surface de réparation haute */}
      <rect x={120} y={28} width={240} height={100} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={1}/>
      {/* Surface de but haute */}
      <rect x={176} y={28} width={128} height={42} fill="none" stroke="rgba(255,255,255,.2)" strokeWidth={1}/>
      {/* Point de penalty haut */}
      <circle cx={W/2} cy={100} r={3} fill="rgba(255,255,255,.4)"/>
      {/* Arc haut */}
      <path d={`M 174,128 A 60,60 0 0,1 306,128`} fill="none" stroke="rgba(255,255,255,.2)" strokeWidth={1}/>

      {/* Surface de réparation basse */}
      <rect x={120} y={H-128} width={240} height={100} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={1}/>
      {/* Surface de but basse */}
      <rect x={176} y={H-70} width={128} height={42} fill="none" stroke="rgba(255,255,255,.2)" strokeWidth={1}/>
      {/* Point de penalty bas */}
      <circle cx={W/2} cy={H-100} r={3} fill="rgba(255,255,255,.4)"/>
      {/* Arc bas */}
      <path d={`M 174,${H-128} A 60,60 0 0,0 306,${H-128}`} fill="none" stroke="rgba(255,255,255,.2)" strokeWidth={1}/>

      {/* Coins */}
      {[[28,28],[W-28,28],[28,H-28],[W-28,H-28]].map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r={7} fill="none" stroke="rgba(255,255,255,.2)" strokeWidth={1}/>
      ))}

      {/* Slots joueurs */}
      {form.positions.map(pos=>{
        const px = pos.x/100*W;
        const py = (1-pos.y/100)*H;
        const player = lineup[pos.id];
        const ROLE_COLOR={GK:"#1e3a5f",DEF:"#14532d",MIL:"#1e3a6e",ATT:"#7f1d1d",STAFF:"#2d1f5e"};
        const ROLE_BORDER={GK:"#60a5fa",DEF:"#4ade80",MIL:"#93c5fd",ATT:"#fca5a5",STAFF:"#c4b5fd"};
        const role = player?.role||"ATT";
        const hasPlayer = !!player;

        return (
          <g key={pos.id} style={{cursor:"pointer"}}
            onClick={()=>onSlotClick(pos.id)}
            onDrop={(e)=>handleDrop(e,pos)}
            onDragOver={handleDragOver}
          >
            {/* Ombre */}
            <ellipse cx={px} cy={py+28} rx={20} ry={5} fill="rgba(0,0,0,.3)"/>
            {/* Cercle joueur */}
            <circle cx={px} cy={py} r={22}
              fill={hasPlayer ? ROLE_COLOR[role] : "rgba(0,0,0,.3)"}
              stroke={hasPlayer ? ROLE_BORDER[role] : "rgba(255,255,255,.25)"}
              strokeWidth={hasPlayer ? 2 : 1.5}
              strokeDasharray={hasPlayer ? "none" : "4,3"}
              filter={hasPlayer?"url(#glow)":"none"}
            />
            {/* Numéro / initiale */}
            {hasPlayer ? (
              <>
                <text x={px} y={py-4} textAnchor="middle" dominantBaseline="middle"
                  fill={ROLE_BORDER[role]} fontSize={9} fontFamily="'Bebas Neue',sans-serif" letterSpacing={0.5}>
                  {ROLE_E[role]||"⚽"}
                </text>
                <text x={px} y={py+7} textAnchor="middle" dominantBaseline="middle"
                  fill="white" fontSize={7.5} fontFamily="Inter,sans-serif" fontWeight={700}>
                  {player.nom.split(" ").pop().substring(0,8)}
                </text>
              </>
            ) : (
              <text x={px} y={py} textAnchor="middle" dominantBaseline="middle"
                fill="rgba(255,255,255,.4)" fontSize={10} fontFamily="'Bebas Neue',sans-serif" letterSpacing={0.5}>
                {pos.label}
              </text>
            )}
            {/* Nom complet en dessous */}
            {hasPlayer && (
              <text x={px} y={py+30} textAnchor="middle"
                fill="rgba(255,255,255,.85)" fontSize={8.5} fontFamily="Inter,sans-serif" fontWeight={600}>
                {player.nom.length>12 ? player.nom.substring(0,11)+"." : player.nom}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function TerrainPage({players}){
  const [formation, setFormation] = useState("4-3-3");
  const [lineup, setLineup] = useState({});
  const [selectSlot, setSelectSlot] = useState(null);
  const [tacNote, setTacNote] = useState("");
  const [schemeName, setSchemeName] = useState("Schéma 1");
  const [saved, setSaved] = useState(false);

  const effectif = players.filter(p=>p.categorie==="EFFECTIF");
  const usedIds = Object.values(lineup).map(p=>p?.id).filter(Boolean);
  const available = effectif.filter(p=>!usedIds.includes(p.id));

  const handleSlotClick = (slotId) => {
    // Si slot occupé → libérer
    if(lineup[slotId]){
      setLineup(l=>{ const n={...l}; delete n[slotId]; return n; });
    } else {
      setSelectSlot(slotId);
    }
  };

  const assignPlayer = (slotId, player) => {
    // Retirer ce joueur de tout autre slot d'abord
    const cleaned = Object.fromEntries(Object.entries(lineup).filter(([,v])=>v?.id!==player.id));
    setLineup({...cleaned,[slotId]:player});
    setSelectSlot(null);
  };

  const handleDrop = (slotId, playerId) => {
    const player = players.find(p=>p.id==playerId);
    if(player) assignPlayer(slotId, player);
  };

  const clearAll = () => { setLineup({}); setSelectSlot(null); };

  const autoFill = () => {
    const form = FORMATIONS[formation];
    const newLineup = {};
    // Map positions to roles
    const roleMap={
      GK:["GK"],
      RB:["DEF"],LB:["DEF"],CB1:["DEF"],CB2:["DEF"],CB3:["DEF"],
      RWB:["DEF","MIL"],LWB:["DEF","MIL"],
      CDM:["MIL"],CDM1:["MIL"],CDM2:["MIL"],
      CM1:["MIL"],CM2:["MIL"],CM3:["MIL"],
      RM:["MIL"],LM:["MIL"],
      RAM:["MIL","ATT"],CAM:["MIL","ATT"],LAM:["MIL","ATT"],
      SS1:["ATT"],SS2:["ATT"],
      RW:["ATT"],LW:["ATT"],ST:["ATT"],ST1:["ATT"],ST2:["ATT"],
    };
    let pool = [...effectif];
    form.positions.forEach(pos=>{
      const roles = roleMap[pos.id]||["ATT"];
      const match = pool.find(p=>roles.includes(p.role));
      if(match){
        newLineup[pos.id]=match;
        pool=pool.filter(p=>p.id!==match.id);
      } else {
        const any = pool[0];
        if(any){ newLineup[pos.id]=any; pool=pool.filter(p=>p.id!==any.id); }
      }
    });
    setLineup(newLineup);
  };

  const saveScheme = () => {
    setSaved(true);
    setTimeout(()=>setSaved(false),2200);
  };

  const filledCount = Object.values(lineup).filter(Boolean).length;
  const totalSlots = FORMATIONS[formation]?.positions?.length||11;
  const pct = Math.round(filledCount/totalSlots*100);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">🏟️ TERRAIN <span>TACTIQUE</span></div>
        <div className="page-sub">Positionnez vos joueurs, simulez vos systèmes de jeu</div>
      </div>

      {/* Formation selector */}
      <div className="card" style={{marginBottom:16}}>
        <div className="section-title">SYSTÈME DE JEU</div>
        <div className="formation-selector">
          {Object.keys(FORMATIONS).map(f=>(
            <button key={f} className={`formation-btn ${formation===f?"active":""}`}
              onClick={()=>{ setFormation(f); setLineup({}); setSelectSlot(null); }}
              style={formation===f?{background:FORMATIONS[f].color,borderColor:FORMATIONS[f].color,color:"#07101f"}:{}}>
              {f}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginTop:8}}>
          <input className="pitch-name-input" value={schemeName} onChange={e=>setSchemeName(e.target.value)} placeholder="Nom du schéma..."/>
          <button className="btn btn-blue btn-sm" onClick={autoFill} title="Remplissage automatique selon les rôles">⚡ Auto-remplir</button>
          <button className="btn btn-ghost btn-sm" onClick={clearAll}>🗑️ Vider</button>
          <button className={`btn btn-sm ${saved?"btn-cyan":"btn-gold"}`} onClick={saveScheme}>{saved?"✓ Sauvegardé":"💾 Sauvegarder"}</button>
          <span style={{fontSize:11,color:"var(--muted)",marginLeft:"auto"}}>{filledCount}/{totalSlots} postes · {pct}%</span>
        </div>

        {/* Progress bar */}
        <div style={{marginTop:10,height:4,background:"var(--border)",borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${FORMATIONS[formation].color},${FORMATIONS[formation].color}99)`,borderRadius:2,transition:"width .3s"}}/>
        </div>
      </div>

      {/* Main layout : terrain + sidebar */}
      <div className="pitch-container">

        {/* Terrain SVG */}
        <div style={{flex:"1",minWidth:280,maxWidth:480}}>
          <PitchSVG
            formation={formation}
            lineup={lineup}
            onSlotClick={handleSlotClick}
            onSlotDrop={handleDrop}
          />

          {/* Légende */}
          <div style={{display:"flex",gap:10,marginTop:10,flexWrap:"wrap",justifyContent:"center"}}>
            {[["GK","#60a5fa","#1e3a5f"],["DEF","#4ade80","#14532d"],["MIL","#93c5fd","#1e3a6e"],["ATT","#fca5a5","#7f1d1d"]].map(([r,c,bg])=>(
              <div key={r} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"var(--muted)"}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:bg,border:`1.5px solid ${c}`}}/>
                {r}
              </div>
            ))}
            <div style={{fontSize:10,color:"var(--dim)"}}>— Cliquer pour assigner / désassigner</div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="pitch-sidebar">

          {/* Modal sélection joueur */}
          {selectSlot && (
            <div className="card" style={{border:"1px solid var(--gold)",boxShadow:"0 0 0 2px rgba(245,166,35,.1)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:700,color:"var(--gold)",letterSpacing:.5}}>
                  📍 {FORMATIONS[formation]?.positions.find(p=>p.id===selectSlot)?.label} — Choisir
                </div>
                <button className="btn btn-ghost btn-sm" onClick={()=>setSelectSlot(null)} style={{padding:"2px 7px"}}>✕</button>
              </div>
              {available.length===0 && (
                <div style={{fontSize:11,color:"var(--dim)",fontStyle:"italic"}}>Tous les joueurs sont placés</div>
              )}
              <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:280,overflowY:"auto"}}>
                {available.map(p=>(
                  <div key={p.id} className="pitch-player-card"
                    onClick={()=>assignPlayer(selectSlot,p)}
                    style={{cursor:"pointer"}}>
                    <div className="pitch-player-card-name">{p.nom}</div>
                    <div className="pitch-player-card-pos">{ROLE_E[p.role]} {p.poste||p.role} {p.club?"· "+p.club:""}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Roster disponible */}
          {!selectSlot && (
            <>
              <div>
                <div className="pitch-sidebar-title">EFFECTIF DISPONIBLE <span style={{color:"var(--gold)"}}>{available.length}</span></div>
                <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:360,overflowY:"auto"}}>
                  {available.length===0&&<div style={{fontSize:11,color:"var(--dim)",fontStyle:"italic"}}>Tous les joueurs sont sur le terrain</div>}
                  {available.map(p=>(
                    <div key={p.id} className="pitch-player-card" draggable
                      onDragStart={e=>e.dataTransfer.setData("playerId",p.id)}>
                      <div className="pitch-player-card-name">{p.nom}</div>
                      <div className="pitch-player-card-pos">{ROLE_E[p.role]} {p.poste||p.role}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sur le terrain */}
              <div style={{marginTop:8}}>
                <div className="pitch-sidebar-title">SUR LE TERRAIN <span style={{color:"var(--green)"}}>{filledCount}</span></div>
                <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:280,overflowY:"auto"}}>
                  {Object.entries(lineup).filter(([,p])=>p).map(([slotId,p])=>(
                    <div key={slotId} className="pitch-player-card"
                      style={{borderColor:"rgba(34,197,94,.2)",background:"rgba(34,197,94,.04)",cursor:"pointer"}}
                      onClick={()=>handleSlotClick(slotId)}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <div className="pitch-player-card-name">{p.nom}</div>
                        <span style={{fontSize:9,color:"var(--red)",marginLeft:6}}>✕</span>
                      </div>
                      <div className="pitch-player-card-pos">
                        {FORMATIONS[formation]?.positions.find(pos=>pos.id===slotId)?.label} · {p.poste||p.role}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Notes tactiques */}
          <div style={{marginTop:8}}>
            <div className="pitch-sidebar-title">NOTES TACTIQUES</div>
            <textarea className="form-textarea" rows={4} value={tacNote}
              onChange={e=>setTacNote(e.target.value)}
              placeholder="Principes de jeu, consignes, bloc..."/>
          </div>

          {/* Alerte si pas d'effectif */}
          {effectif.length===0&&(
            <div className="warn" style={{marginTop:8}}>
              <span>⚠️</span><div>Ajoute des joueurs dans l'onglet Effectif pour les positionner sur le terrain.</div>
            </div>
          )}
        </div>
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
   PROFIL PAGE (Mon Club)
══════════════════════════════════════════════════════════ */
function ProfilPage({ authData, onUpdated }) {
  const club = authData?.club || {};
  const user = authData?.profile || {};
  const [clubName, setClubName] = useState(club.name || '');
  const [logoUrl, setLogoUrl] = useState(club.logo_url || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setErr('Fichier image uniquement (PNG, JPG, WebP)'); return; }
    setUploading(true); setErr(''); setMsg('');
    try {
      const ext = file.name.split('.').pop();
      const path = `${club.id}/logo.${ext}`;
      const { error: upErr } = await supabase.storage.from('club-logos').upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from('club-logos').getPublicUrl(path);
      const url = publicUrl + '?t=' + Date.now();
      setLogoUrl(url);
      await supabase.from('clubs').update({ logo_url: url }).eq('id', club.id);
      setMsg('✅ Logo mis à jour !');
      onUpdated({ ...authData, club: { ...club, logo_url: url } });
    } catch(e) { setErr(e.message); }
    finally { setUploading(false); }
  };

  const handleSaveClub = async () => {
    setSaving(true); setErr(''); setMsg('');
    try {
      await supabase.from('clubs').update({ name: clubName.trim() }).eq('id', club.id);
      setMsg('✅ Nom du club mis à jour !');
      onUpdated({ ...authData, club: { ...club, name: clubName.trim() } });
    } catch(e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <div className="page-title">⚙️ MON CLUB</div>
      <div className="page-sub">Paramètres du club · {club.code && <span style={{fontFamily:'monospace',color:'var(--gold)',letterSpacing:2}}>{club.code}</span>}</div>

      {msg && <div className="auth-ok" style={{marginBottom:14}}>✅ {msg.replace('✅ ','')}</div>}
      {err && <div className="auth-err" style={{marginBottom:14}}>⚠️ {err}</div>}

      {/* Logo */}
      <div className="card" style={{marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'var(--muted)',marginBottom:16}}>🖼️ LOGO DU CLUB</div>
        <div style={{display:'flex',alignItems:'center',gap:20,flexWrap:'wrap'}}>
          <div style={{width:90,height:90,borderRadius:12,background:'var(--bg)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',flexShrink:0}}>
            {logoUrl
              ? <img src={logoUrl} alt="logo" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              : <span style={{fontSize:32}}>🏟️</span>
            }
          </div>
          <div>
            <label style={{display:'inline-block',padding:'8px 16px',background:'var(--gold)',color:'var(--bg)',borderRadius:8,fontWeight:700,fontSize:12,cursor:'pointer',fontFamily:"'Inter',sans-serif"}}>
              {uploading ? '⏳ Upload...' : '📁 Choisir un logo'}
              <input type="file" accept="image/*" style={{display:'none'}} onChange={handleLogoUpload} disabled={uploading}/>
            </label>
            <div style={{fontSize:11,color:'var(--muted)',marginTop:6}}>PNG, JPG ou WebP · Recommandé : 200×200px</div>
          </div>
        </div>
      </div>

      {/* Club name */}
      <div className="card" style={{marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'var(--muted)',marginBottom:14}}>🏟️ NOM DU CLUB</div>
        <div style={{display:'flex',gap:10}}>
          <input className="form-input" value={clubName} onChange={e=>setClubName(e.target.value)} placeholder="Nom du club..." style={{flex:1}}/>
          <button className="btn btn-gold" onClick={handleSaveClub} disabled={saving||!clubName.trim()}>{saving?'⏳ Sauvegarde...':'💾 Sauvegarder'}</button>
        </div>
      </div>

      {/* Infos */}
      <div className="card">
        <div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'var(--muted)',marginBottom:14}}>👤 MON COMPTE</div>
        <div className="fiche-grid-2">
          {[['Nom',user.nom||'—'],['Rôle',user.role||'membre'],['Plan',club.plan||'free'],['Code club',club.code||'—']].map(([l,v])=>(
            <div className="fiche-field" key={l}>
              <div className="fiche-label">{l}</div>
              <div className="fiche-val" style={l==='Code club'?{fontFamily:'monospace',color:'var(--gold)',letterSpacing:2}:{}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════ */


const ADMIN_EMAIL = 'fcdeportivolamassana@gmail.com';

/* ══════════════════════════════════════════════════════════
   SUPABASE AUTH + MULTI-TENANT
══════════════════════════════════════════════════════════ */
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({length:8}, () => chars[Math.floor(Math.random()*chars.length)]).join('');
}

function AdminPage({onLogout}) {
  const [clubs, setClubs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: clubsData } = await supabase.from('clubs').select('*').order('created_at', {ascending: false});
      const { data: profilesData } = await supabase.from('profiles').select('*, clubs(name)').order('created_at', {ascending: false});
      setClubs(clubsData || []);
      setUsers(profilesData || []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const deleteClub = async (id) => {
    if (!confirm('Supprimer ce club et toutes ses données ?')) return;
    await supabase.from('clubs').delete().eq('id', id);
    loadData();
  };

  return (
    <div className="admin-bg">
      <div className="admin-header">
        <div>
          <div className="admin-title">⚙️ SCOUTROOM ADMIN</div>
          <div style={{fontSize:11,color:'var(--muted)'}}>Tableau de bord administrateur</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onLogout}>🚪 Déconnexion</button>
      </div>

      {loading ? <div style={{color:'var(--muted)',textAlign:'center',padding:40}}>Chargement...</div> : (
        <>
          <div className="admin-grid">
            {[[clubs.length,'🏟️ Clubs','var(--gold)'],[users.length,'👥 Utilisateurs','var(--blue)'],
              [users.filter(u=>u.club_id).length,'✅ Membres actifs','var(--green)'],
              [clubs.filter(c=>c.plan==='pro').length,'⭐ Clubs Pro','var(--purple)']
            ].map(([n,l,c])=>(
              <div className="admin-kpi" key={l}>
                <div className="admin-kpi-n" style={{color:c}}>{n}</div>
                <div className="admin-kpi-l">{l}</div>
              </div>
            ))}
          </div>

          <div className="admin-section">
            <div className="admin-section-title">🏟️ Clubs ({clubs.length})</div>
            {clubs.length === 0 && <div style={{color:'var(--muted)',fontSize:12}}>Aucun club</div>}
            {clubs.map(club => (
              <div className="club-row" key={club.id}>
                <div>
                  <div style={{fontWeight:600,marginBottom:2}}>{club.name}</div>
                  <div style={{fontSize:11,color:'var(--muted)'}}>
                    {new Date(club.created_at).toLocaleDateString('fr-FR')} · {users.filter(u=>u.club_id===club.id).length} membre(s)
                  </div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span className="club-code">{club.code}</span>
                  <span className={`tag ${club.plan==='pro'?'tag-purple':'tag-gray'}`}>{club.plan}</span>
                  <button className="btn btn-red btn-sm" onClick={()=>deleteClub(club.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-section">
            <div className="admin-section-title">👥 Utilisateurs ({users.length})</div>
            {users.length === 0 && <div style={{color:'var(--muted)',fontSize:12}}>Aucun utilisateur</div>}
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Nom</th><th>Club</th><th>Rôle</th><th>Inscrit le</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{fontWeight:500}}>{u.nom||'—'}</td>
                      <td style={{color:'var(--muted)'}}>{u.clubs?.name||'—'}</td>
                      <td><span className={`tag ${u.role==='admin'?'tag-gold':u.role==='ds'?'tag-blue':'tag-gray'}`}>{u.role||'membre'}</span></td>
                      <td style={{color:'var(--muted)',fontSize:11}}>{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


function AuthPage({onLogin}) {
  const [mode, setMode] = useState('login'); // login | join | create
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [clubCode, setClubCode] = useState('');
  const [clubName, setClubName] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErr(''); setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass });
      if (error) throw error;
      // Get profile + club
      const { data: profile } = await supabase.from('profiles').select('*, clubs(*)').eq('id', data.user.id).single();
      onLogin({ user: data.user, profile, club: profile?.clubs });
    } catch(e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  const handleJoinClub = async () => {
    setErr(''); setLoading(true);
    try {
      if (!nom.trim() || !email.trim() || !pass.trim() || !clubCode.trim()) throw new Error('Tous les champs sont requis.');
      if (pass.length < 6) throw new Error('Mot de passe trop court (min. 6 caractères).');
      // Find club by code
      const { data: club, error: cErr } = await supabase.from('clubs').select('*').eq('code', clubCode.trim().toUpperCase()).single();
      if (cErr || !club) throw new Error('Code club invalide. Contacte ton DS.');
      // Sign up
      const { data, error } = await supabase.auth.signUp({ email: email.trim(), password: pass, options: { data: { nom: nom.trim() } } });
      if (error) throw error;
      // Update profile with club_id
      await supabase.from('profiles').update({ club_id: club.id, nom: nom.trim(), role: 'membre' }).eq('id', data.user.id);
      const { data: profile } = await supabase.from('profiles').select('*, clubs(*)').eq('id', data.user.id).single();
      onLogin({ user: data.user, profile, club });
    } catch(e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  const handleCreateClub = async () => {
    setErr(''); setLoading(true);
    try {
      if (!nom.trim() || !email.trim() || !pass.trim() || !clubName.trim()) throw new Error('Tous les champs sont requis.');
      if (pass.length < 6) throw new Error('Mot de passe trop court (min. 6 caractères).');
      const code = generateCode();
      // Sign up
      const { data, error } = await supabase.auth.signUp({ email: email.trim(), password: pass, options: { data: { nom: nom.trim() } } });
      if (error) throw error;
      // Create club
      const { data: club, error: cErr } = await supabase.from('clubs').insert({ name: clubName.trim(), code }).select().single();
      if (cErr) throw cErr;
      // Update profile
      await supabase.from('profiles').update({ club_id: club.id, nom: nom.trim(), role: 'admin' }).eq('id', data.user.id);
      onLogin({ user: data.user, profile: { club_id: club.id, nom: nom.trim(), role: 'admin', clubs: club }, club, newClub: true, clubCode: code });
    } catch(e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  const submit = mode === 'login' ? handleLogin : mode === 'join' ? handleJoinClub : handleCreateClub;

  return (
    <div className="auth-bg">
      <div className="auth-box">
        <div className="auth-logo">⚽ SCOUTROOM</div>
        <div className="auth-sub">Plateforme de scouting football</div>
        <div className="auth-tabs">
          <button className={`auth-tab ${mode==='login'?'active':''}`} onClick={()=>{setMode('login');setErr('');}}>Connexion</button>
          <button className={`auth-tab ${mode==='join'?'active':''}`} onClick={()=>{setMode('join');setErr('');}}>Rejoindre</button>
          <button className={`auth-tab ${mode==='create'?'active':''}`} onClick={()=>{setMode('create');setErr('');}}>Créer un club</button>
        </div>
        {err && <div className="auth-err">⚠️ {err}</div>}

        {mode !== 'login' && (
          <div className="auth-field">
            <label className="auth-lbl">Prénom / Nom</label>
            <input className="auth-input" placeholder="Thomas Martin" value={nom} onChange={e=>setNom(e.target.value)}/>
          </div>
        )}
        <div className="auth-field">
          <label className="auth-lbl">Email</label>
          <input className="auth-input" type="email" placeholder="ton@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()}/>
        </div>
        <div className="auth-field">
          <label className="auth-lbl">Mot de passe</label>
          <input className="auth-input" type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()}/>
        </div>
        {mode === 'join' && (
          <div className="auth-field">
            <label className="auth-lbl">🔑 Code club</label>
            <input className="auth-input auth-code" placeholder="ex: ANDORRE26" value={clubCode} onChange={e=>setClubCode(e.target.value)}/>
          </div>
        )}
        {mode === 'create' && (
          <div className="auth-field">
            <label className="auth-lbl">🏟️ Nom du club</label>
            <input className="auth-input" placeholder="ex: FC Andorra B" value={clubName} onChange={e=>setClubName(e.target.value)}/>
          </div>
        )}
        <button className="auth-btn" onClick={submit} disabled={loading}>
          {loading ? '⏳ En cours...' : mode==='login' ? '→ Se connecter' : mode==='join' ? '→ Rejoindre le club' : '→ Créer mon club'}
        </button>
        {mode==='login' && (
          <div style={{textAlign:'center',marginTop:12}}>
            <button style={{background:'none',border:'none',color:'var(--muted)',fontSize:11,cursor:'pointer',textDecoration:'underline'}} onClick={async()=>{
              if(!email.trim()){setErr("Entre ton email d'abord.");return;}
              await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:'https://scoutroom.vercel.app/?reset=true'});
              setErr('');alert('📧 Email de réinitialisation envoyé !');
            }}>Mot de passe oublié ?</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════ */

export default function App(){
  const [authData, setAuthData] = useState(null); // { user, profile, club }
  const getHashTab=()=>{const h=window.location.hash.replace('#','');const v=['dashboard','effectif','cibles','analyser','terrain','comparer','budget','guide','profil','admin'];return v.includes(h)?h:'dashboard';};
  const [tab,setTab]=useState(getHashTab);
  const [players,setPlayers]=useState([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [url,setUrl]=useState("");
  const [loading,setLoading]=useState(false);
  const [loadStep,setLoadStep]=useState("");
  const [preview,setPreview]=useState(null);
  const [error,setError]=useState("");
  const [editP,setEditP]=useState(null);
  const [viewP,setViewP]=useState(null);
  const [newClubCode, setNewClubCode] = useState(null);
  const [signedFlash, setSignedFlash] = useState(null);

  // Check existing session on mount
  useEffect(()=>{
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*, clubs(*)').eq('id', session.user.id).single();
        if (profile?.club_id) {
          setAuthData({ user: session.user, profile, club: profile.clubs });
        }
      }
      setAuthLoading(false);
    });
  }, []);

  // Load players when authenticated
  useEffect(()=>{
    if (!authData?.profile?.club_id) return;
    loadPlayers();
  }, [authData]);

  const loadPlayers = async () => {
    setDbLoading(true);
    try {
      const clubId = authData.profile.club_id;
      const [{ data: effData }, { data: cibData }] = await Promise.all([
        supabase.from('players').select('*').eq('club_id', clubId).order('created_at'),
        supabase.from('targets').select('*').eq('club_id', clubId).order('created_at'),
      ]);
      const eff = (effData||[]).map(p => ({
        ...p, categorie:'EFFECTIF', finContrat: p.fin_contrat, clubActuel: p.club_actuel,
        club: p.club_actuel, tmUrl: p.tm_url, videoUrl: p.video_url||'',
        photoUrl: p.photo_url||'', clubLogoUrl: p.club_logo_url||'',
        pointsForts: p.points_forts, pointsFaibles: p.points_faibles,
        noteSS: p.note_ss, passeportUE: p.passeport_ue, espCatalan: p.esp_catalan,
        debutContrat: p.debut_contrat,
        notation: p.notation ? (typeof p.notation==='string'?JSON.parse(p.notation):p.notation) : {technique:0,physique:0,mental:0,vitesse:0,defense:0,potentiel:0},
        contacts: p.contacts ? (typeof p.contacts==='string'?JSON.parse(p.contacts):p.contacts) : [],
      }));
      const cib = (cibData||[]).map(p => ({
        ...p, categorie:'CIBLE', finContrat: p.fin_contrat, clubActuel: p.club_actuel,
        club: p.club_actuel, tmUrl: p.tm_url, videoUrl: p.video_url||'',
        photoUrl: p.photo_url||'', clubLogoUrl: p.club_logo_url||'',
        pointsForts: p.points_forts, pointsFaibles: p.points_faibles,
        noteSS: p.note_ss, passeportUE: p.passeport_ue, espCatalan: p.esp_catalan,
        debutContrat: p.debut_contrat,
        notation: p.notation ? (typeof p.notation==='string'?JSON.parse(p.notation):p.notation) : {technique:0,physique:0,mental:0,vitesse:0,defense:0,potentiel:0},
        contacts: p.contacts ? (typeof p.contacts==='string'?JSON.parse(p.contacts):p.contacts) : [],
      }));
      setPlayers([...eff, ...cib]);
    } catch(e) { console.error(e); }
    finally { setDbLoading(false); }
  };

  const toDbRow = (p, clubId) => ({
    club_id: clubId,
    nom: p.nom||'', poste: p.poste||'', role: p.role||'',
    club_actuel: p.clubActuel||p.club_actuel||p.club||'', ligue: p.ligue||'',
    nationalite: p.nationalite||'', age: p.age||'', taille: p.taille||'',
    pied: p.pied||'', fin_contrat: p.finContrat||p.fin_contrat||'',
    valeur: p.valeur||'', agent: p.agent||'', tm_url: p.tmUrl||p.tm_url||'',
    statut: p.statut||'', commentaires: p.commentaires||'',
    points_forts: p.pointsForts||p.points_forts||'',
    points_faibles: p.pointsFaibles||p.points_faibles||'',
    note_ss: p.noteSS||p.note_ss||'',
    passeport_ue: p.passeportUE||p.passeport_ue||'',
    esp_catalan: p.espCatalan||p.esp_catalan||'',
    debut_contrat: p.debutContrat||p.debut_contrat||'',
    matchs: p.matchs||'', buts: p.buts||'', passes: p.passes||'',
    priorite: p.priorite||'★★', categorie: p.categorie||'CIBLE',
    video_url: p.videoUrl||p.video_url||'',
    photo_url: p.photoUrl||p.photo_url||'',
    club_logo_url: p.clubLogoUrl||p.club_logo_url||'',
    notation: p.notation ? JSON.stringify(p.notation) : null,
    contacts: p.contacts ? JSON.stringify(p.contacts) : null,
  });

  const handleLogin = (data) => {
    setAuthData(data);
    if (data.newClub && data.clubCode) setNewClubCode(data.clubCode);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthData(null); setPlayers([]);
  };

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

  const handleSavePreview=async()=>{
    if(!preview||!authData?.profile?.club_id) return;
    const clubId = authData.profile.club_id;
    const table = preview.categorie === 'EFFECTIF' ? 'players' : 'targets';
    const row = toDbRow(preview, clubId);
    const { data, error } = await supabase.from(table).insert(row).select().single();
    if (!error && data) {
      const mapped = { ...preview, id: data.id };
      setPlayers(prev => [...prev, mapped]);
    }
    setPreview(null); setUrl('');
    setTab(preview.categorie==="EFFECTIF"?"effectif":"cibles");
  };

  const handleDelete=async(id)=>{
    const p = players.find(x=>x.id===id);
    if (!p) return;
    const table = p.categorie === 'EFFECTIF' ? 'players' : 'targets';
    await supabase.from(table).delete().eq('id', id);
    setPlayers(prev => prev.filter(x=>x.id!==id));
    if(viewP?.id===id) setViewP(null);
  };

  // Signer une cible → la transfère en EFFECTIF (supprime targets, insère players)
  const handleSign=async(cible)=>{
    if(!authData?.profile?.club_id) return;
    const clubId = authData.profile.club_id;
    const signed = {...cible, categorie:'EFFECTIF', statut:'Sous contrat'};
    const row = toDbRow(signed, clubId);
    // Insérer dans players
    const { data, error } = await supabase.from('players').insert(row).select().single();
    if(error){ console.error(error); return; }
    // Supprimer de targets
    await supabase.from('targets').delete().eq('id', cible.id);
    // Mettre à jour le state local
    const mapped = {...signed, id: data.id};
    setPlayers(prev => [...prev.filter(x=>x.id!==cible.id), mapped]);
    if(viewP?.id===cible.id) setViewP(mapped);
    // Notification flash
    setSignedFlash(cible.nom);
    setTimeout(()=>setSignedFlash(null), 3000);
  };

  // Refuser une cible → change statut en "Refusé" dans targets
  const handleRefuse=async(cible)=>{
    const updated = {...cible, statut:'Refusé'};
    const row = toDbRow(updated, authData.profile.club_id);
    await supabase.from('targets').update(row).eq('id', cible.id);
    setPlayers(prev => prev.map(p=>p.id===cible.id?updated:p));
    if(viewP?.id===cible.id) setViewP(updated);
  };

  const handleEditSave=async(updated)=>{
    const table = updated.categorie === 'EFFECTIF' ? 'players' : 'targets';
    const row = toDbRow(updated, authData.profile.club_id);
    await supabase.from(table).update(row).eq('id', updated.id);
    setPlayers(prev => prev.map(p=>p.id===updated.id?updated:p));
    setEditP(null);
    if(viewP?.id===updated.id) setViewP(updated);
    if(preview?.id===updated.id) setPreview(updated);
  };

  const TABS=[
    {id:"dashboard",label:"🏠 Dashboard"},
    {id:"effectif",label:"👥 Effectif",count:effectif.length},
    {id:"cibles",label:"🎯 Cibles",count:cibles.length},
    {id:"analyser",label:"➕ Analyser"},
    {id:"terrain",label:"🏟️ Terrain"},
    {id:"comparer",label:"⚖️ Comparer"},
    {id:"budget",label:"💶 Budget"},
    {id:"guide",label:"📖 Guide"},
    {id:"profil",label:"⚙️ Mon Club"},
  ];

  if(authLoading) return <><style dangerouslySetInnerHTML={{__html:css}}/><div style={{position:'fixed',inset:0,background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center'}}><div className="spinner"/></div></>;
  if(!authData) return <><style dangerouslySetInnerHTML={{__html:css}}/><AuthPage onLogin={handleLogin}/></>;

  const clubName = authData.club?.name || 'Mon Club';
  const clubLogo = authData.club?.logo_url || null;
  const user = authData.profile;

  const handleAuthUpdated = (newData) => {
    setAuthData(newData);
  };

  // Joueurs avec contrats urgents
  const alertRed = players.filter(p=>ctAlert(p.finContrat)==="red");
  const alertOrange = players.filter(p=>ctAlert(p.finContrat)==="orange");

  const handleContactsChange = async (player, newContacts) => {
    const updated = {...player, contacts: newContacts};
    const table = player.categorie === 'EFFECTIF' ? 'players' : 'targets';
    const row = toDbRow(updated, authData.profile.club_id);
    await supabase.from(table).update(row).eq('id', player.id);
    setPlayers(prev => prev.map(p=>p.id===player.id?updated:p));
    if(viewP?.id===player.id) setViewP(updated);
  };
  return (
    <>
      <style dangerouslySetInnerHTML={{__html:css}}/>
      {newClubCode && (
        <div style={{background:'rgba(34,197,94,.12)',border:'1px solid rgba(34,197,94,.25)',borderRadius:10,padding:'12px 20px',margin:'16px',display:'flex',alignItems:'center',gap:12,justifyContent:'space-between'}}>
          <div>🎉 <strong>Club créé !</strong> Ton code d'invitation : <span style={{fontFamily:'monospace',fontWeight:900,fontSize:16,color:'var(--green)',letterSpacing:2}}>{newClubCode}</span> — partage-le à tes membres</div>
          <button className="btn btn-ghost btn-sm" onClick={()=>setNewClubCode(null)}>✕</button>
        </div>
      )}

      {/* Toast : joueur signé */}
      {signedFlash&&(
        <div style={{position:'fixed',bottom:24,right:24,zIndex:999,background:'linear-gradient(135deg,rgba(34,197,94,.15),rgba(34,197,94,.08))',border:'1px solid rgba(34,197,94,.35)',borderRadius:12,padding:'14px 20px',display:'flex',alignItems:'center',gap:12,boxShadow:'0 8px 32px rgba(0,0,0,.4)',animation:'fadeUp .25s ease'}}>
          <span style={{fontSize:22}}>✅</span>
          <div>
            <div style={{fontWeight:700,color:'var(--green)',fontSize:13}}>{signedFlash} — SIGNÉ !</div>
            <div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>Transféré dans l'Effectif · disponible sur le Terrain</div>
          </div>
        </div>
      )}
      <div className="app">

        {/* TOPBAR */}
        <div className="topbar">
          {/* Logo */}
          <div className="logo-wrap">
            <div className="logo-icon">
              {clubLogo
                ? <img src={clubLogo} alt="logo" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:10}}/>
                : "SR"
              }
            </div>
            <div>
              <div className="logo">SCOUT<span>ROOM</span></div>
              <div className="logo-club">{clubName}</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            {TABS.map(t=>(
              <button key={t.id} className={`tab ${tab===t.id?"active":""}`} onClick={()=>{window.location.hash=t.id;setTab(t.id);}}>
                {t.label}
                {t.count!=null&&<span className="tab-badge">{t.count}</span>}
              </button>
            ))}
          </div>

          {/* Right zone */}
          <div className="topbar-right">
            {dbLoading&&<div style={{width:16,height:16,border:"2px solid var(--border)",borderTopColor:"var(--gold)",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>}
            <button className="btn btn-ghost btn-sm" onClick={()=>exportCSV(players)} title="Export CSV">📥 CSV</button>
            {authData?.user?.email===ADMIN_EMAIL&&<button className="btn btn-ghost btn-sm" style={{color:"var(--gold)",borderColor:"rgba(245,166,35,.3)"}} onClick={()=>{window.location.hash="admin";setTab("admin");}}>⚙️</button>}
            <div className="user-pill">
              <span style={{fontSize:14}}>👤</span>
              <span>{user?.nom||"Utilisateur"}</span>
            </div>
            <button className="btn btn-ghost btn-sm" title="Déconnexion" onClick={handleLogout}>🚪</button>
          </div>
        </div>

        <div className="main">

          {/* ─── DASHBOARD ─── */}
          {tab==="dashboard"&&(
            <div>
              <div className="page-title">🏠 TABLEAU DE BORD</div>
              <div className="page-sub">Directeur Sportif · Dernière MAJ : {new Date().toLocaleDateString("fr-FR")} · Sources : Transfermarkt + SofaScore</div>

              {/* Alertes contrats */}
              {(alertRed.length>0||alertOrange.length>0)&&(
                <div className="alert-banner">
                  <div className="alert-banner-title">⚠️ ALERTES CONTRATS — Action requise</div>
                  <div className="alert-list">
                    {alertRed.map(p=>(
                      <span key={p.id} className="alert-pill" onClick={()=>setViewP(p)}>
                        🔴 {p.nom} — exp. {p.finContrat}
                      </span>
                    ))}
                    {alertOrange.map(p=>(
                      <span key={p.id} className="alert-pill alert-pill-orange" onClick={()=>setViewP(p)}>
                        🟠 {p.nom} — exp. {p.finContrat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="kpi-grid">
                <div className="kpi" style={{borderTop:"2px solid var(--blue)"}}>
                  <div className="kpi-n" style={{color:"var(--blue)"}}>{effectif.length}</div>
                  <div className="kpi-l">👥 Effectif actuel</div>
                  <div className="kpi-icon">👥</div>
                </div>
                <div className="kpi" style={{borderTop:"2px solid var(--purple)"}}>
                  <div className="kpi-n" style={{color:"var(--purple)"}}>{cibles.length}</div>
                  <div className="kpi-l">🎯 Cibles mercato</div>
                  <div className="kpi-icon">🎯</div>
                </div>
                <div className="kpi" style={{borderTop:"2px solid var(--red)"}}>
                  <div className="kpi-n" style={{color:"var(--red)"}}>{prio3}</div>
                  <div className="kpi-l">🔴 Priorité ★★★</div>
                  <div className="kpi-icon">⭐</div>
                </div>
                <div className="kpi" style={{borderTop:`2px solid ${urgents>0?"var(--red)":"var(--border)"}`}}>
                  <div className="kpi-n" style={{color:urgents>0?"var(--orange)":"var(--muted)"}}>{urgents}</div>
                  <div className="kpi-l">⚠️ Contrats urgents</div>
                  <div className="kpi-icon">⚠️</div>
                </div>
                <div className="kpi" style={{borderTop:"2px solid var(--cyan)"}}>
                  <div className="kpi-n" style={{color:"var(--cyan)"}}>{POSTES_RENFORCER.length}</div>
                  <div className="kpi-l">🏟️ Postes à recruter</div>
                  <div className="kpi-icon">🏟️</div>
                </div>
                <div className="kpi" style={{borderTop:"2px solid var(--gold)"}}>
                  <div className="kpi-n" style={{color:"var(--gold)",fontSize:18}}>Mercato</div>
                  <div className="kpi-l">📅 Saison 2025-26</div>
                  <div className="kpi-icon">💶</div>
                </div>
              </div>

              <div className="dash-grid">
                <div className="card">
                  <div className="section-title">🔍 POSTES À RENFORCER</div>
                  <table className="postes-table">
                    <thead><tr><th>Poste</th><th>Rôle</th><th>Profil cible</th><th>Urgence</th></tr></thead>
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
                  <div className="section-title">📊 PIPELINE SCOUTING</div>
                  <div className="kanban">
                    {[["Identifié","var(--muted)"],["Contacté","var(--blue)"],["Observé","var(--purple)"],["En négociation","var(--orange)"],["Signé","var(--green)"],["Refusé","var(--red)"]].map(([s,c])=>(
                      <div className="kol" key={s}>
                        <div className="kol-hdr" style={{color:c}}>{s}<span className="kol-count">{pipeline[s]}</span></div>
                        {cibles.filter(p=>p.statut===s).map(p=>(
                          <div className="kcard" key={p.id} style={{borderLeft:`2px solid ${c}`}} onClick={()=>{setViewP(p);}}>
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

              {/* Quick actions */}
              <div className="card" style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                <span style={{fontSize:11,color:"var(--muted)",fontWeight:700,letterSpacing:.5,textTransform:"uppercase",marginRight:4}}>Actions rapides</span>
                <button className="btn btn-gold btn-sm" onClick={()=>setTab("analyser")}>➕ Analyser joueur IA</button>
                <button className="btn btn-ghost btn-sm" onClick={()=>setTab("terrain")}>🏟️ Ouvrir le terrain</button>
                <button className="btn btn-ghost btn-sm" onClick={()=>setTab("comparer")}>⚖️ Comparer joueurs</button>
                <button className="btn btn-ghost btn-sm" onClick={()=>exportCSV(players)}>📥 Export CSV</button>
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
              onExport={()=>exportCSV(cibles)}
              onSign={handleSign} onRefuse={handleRefuse}/>
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

          {tab==="terrain"&&<TerrainPage players={players}/>}

          {/* ─── COMPARER ─── */}
          {tab==="comparer"&&<ComparateurPage players={players}/>}

          {/* ─── BUDGET ─── */}
          {tab==="budget"&&<BudgetPage cibles={cibles}/>}

          {/* ─── GUIDE ─── */}
          {tab==="guide"&&<GuidePage/>}

          {/* ─── MON CLUB ─── */}
          {tab==="profil"&&<ProfilPage authData={authData} onUpdated={handleAuthUpdated}/>}

          {/* ─── ADMIN ─── */}
          {tab==="admin"&&authData?.user?.email===ADMIN_EMAIL&&<AdminPage onLogout={handleLogout}/>}

        </div>

        {/* VIEW MODAL */}
        {viewP&&(
          <div className="overlay" onClick={e=>e.target===e.currentTarget&&setViewP(null)}>
            <div className="modal modal-lg">
              <FicheView player={viewP} isSaved={true} onEdit={()=>setEditP(viewP)} onSave={()=>{}} onDiscard={()=>setViewP(null)}
                onContactsChange={(c)=>handleContactsChange(viewP,c)}/>
              <div className="modal-actions no-print">
                {/* Actions signer / refuser pour les cibles */}
                {viewP.categorie==="CIBLE" && viewP.statut!=="Signé" && viewP.statut!=="Refusé" && (
                  <>
                    <button
                      className="btn btn-sm"
                      style={{background:'rgba(34,197,94,.12)',color:'var(--green)',border:'1px solid rgba(34,197,94,.3)',fontWeight:700}}
                      onClick={()=>{ handleSign(viewP); setViewP(null); }}
                    >✅ Signer → Effectif</button>
                    <button
                      className="btn btn-sm"
                      style={{background:'rgba(239,68,68,.1)',color:'var(--red)',border:'1px solid rgba(239,68,68,.2)'}}
                      onClick={()=>handleRefuse(viewP)}
                    >❌ Refusé</button>
                  </>
                )}
                {viewP.categorie==="CIBLE" && viewP.statut==="Signé" && (
                  <span style={{fontSize:12,color:'var(--green)',fontWeight:600}}>✅ Joueur signé · dans l'Effectif</span>
                )}
                {viewP.categorie==="CIBLE" && viewP.statut==="Refusé" && (
                  <span style={{fontSize:12,color:'var(--red)',fontWeight:600}}>❌ Dossier refusé</span>
                )}
                <div style={{flex:1}}/>
                <button className="btn btn-ghost" onClick={()=>setViewP(null)}>Fermer</button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {editP&&<EditModal player={editP} onSave={handleEditSave} onClose={()=>setEditP(null)}/>}

      </div>
    </>
  );
}
