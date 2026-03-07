import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase.js";

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


/* ── LOGIN ── */
.login-bg{position:fixed;inset:0;background:var(--bg);display:flex;align-items:center;justify-content:center;z-index:999}
.login-box{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:36px 32px;width:100%;max-width:380px;text-align:center}
.login-logo{font-family:'Bebas Neue',sans-serif;font-size:36px;letter-spacing:3px;color:var(--gold);margin-bottom:4px}
.login-sub{font-size:11px;color:var(--muted);letter-spacing:1px;margin-bottom:28px}
.login-field{text-align:left;margin-bottom:14px}
.login-lbl{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:6px;display:block}
.login-input{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 14px;color:var(--white);font-family:'Inter',sans-serif;font-size:13px;outline:none;transition:border-color .2s}
.login-input:focus{border-color:var(--gold)}
.login-err{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);border-radius:8px;padding:8px 12px;font-size:12px;color:var(--red);margin-bottom:14px}
.login-btn{width:100%;padding:11px;background:var(--gold);color:var(--bg);border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:background .18s;margin-top:4px}
.login-btn:hover{background:var(--gold2)}
.login-badge{display:inline-block;background:rgba(245,166,35,.1);border:1px solid rgba(245,166,35,.2);border-radius:20px;padding:3px 12px;font-size:10px;color:var(--gold);margin-bottom:20px;letter-spacing:.5px}


/* ── AUTH ── */
.auth-bg{position:fixed;inset:0;background:var(--bg);display:flex;align-items:center;justify-content:center;z-index:999;padding:20px}
.auth-box{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:32px 28px;width:100%;max-width:400px}
.auth-logo{font-family:'Bebas Neue',sans-serif;font-size:32px;letter-spacing:3px;color:var(--gold);text-align:center;margin-bottom:2px}
.auth-sub{font-size:10px;color:var(--muted);letter-spacing:1.5px;text-align:center;margin-bottom:24px;text-transform:uppercase}
.auth-tabs{display:flex;gap:4px;background:var(--bg);border-radius:8px;padding:3px;margin-bottom:20px}
.auth-tab{flex:1;padding:7px;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;background:transparent;color:var(--muted);font-family:'Inter',sans-serif;transition:all .15s}
.auth-tab.active{background:var(--gold);color:var(--bg)}
.auth-field{margin-bottom:12px}
.auth-lbl{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:5px;display:block}
.auth-input{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:7px;padding:9px 12px;color:var(--white);font-family:'Inter',sans-serif;font-size:13px;outline:none;transition:border-color .2s;box-sizing:border-box}
.auth-input:focus{border-color:var(--gold)}
.auth-btn{width:100%;padding:11px;background:var(--gold);color:var(--bg);border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;margin-top:6px;transition:background .15s}
.auth-btn:hover{background:var(--gold2)}
.auth-err{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);border-radius:7px;padding:8px 12px;font-size:12px;color:var(--red);margin-bottom:10px;text-align:center}
.auth-ok{background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.2);border-radius:7px;padding:8px 12px;font-size:12px;color:var(--green);margin-bottom:10px;text-align:center}
.auth-code{font-family:'JetBrains Mono',monospace;letter-spacing:2px;text-transform:uppercase}
.user-pill{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--muted);background:var(--card);border:1px solid var(--border);border-radius:20px;padding:3px 10px}
@media(max-width:768px){
  .kpi-grid{grid-template-columns:repeat(3,1fr)}
  .dash-grid{grid-template-columns:1fr}
  .fiche-grid{grid-template-columns:repeat(2,1fr)}
  .stat-boxes{grid-template-columns:repeat(3,1fr)}
  .form-grid{grid-template-columns:1fr}
  .form-field.full{grid-column:span 1}
  .tabs{display:flex;overflow-x:auto;gap:2px;-webkit-overflow-scrolling:touch;scrollbar-width:none}
  .tabs::-webkit-scrollbar{display:none}
  .tab{font-size:10px;padding:5px 10px;white-space:nowrap;flex-shrink:0}
  .topbar{height:auto;flex-direction:column;align-items:flex-start;padding:10px 14px;gap:8px}
  .sync-bar{display:none}
  .main{padding:14px}
  .kpi-grid{grid-template-columns:repeat(2,1fr)}
  .tbl-wrap{font-size:11px}
}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
/* ── ADMIN ── */
.admin-bg{min-height:100vh;background:var(--bg);padding:24px}
.admin-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px}
.admin-title{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:2px;color:var(--gold)}
.admin-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px}
.admin-kpi{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:16px}
.admin-kpi-n{font-family:'Bebas Neue',sans-serif;font-size:36px;color:var(--gold)}
.admin-kpi-l{font-size:11px;color:var(--muted);margin-top:2px}
.admin-section{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:20px}
.admin-section-title{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:14px}
.club-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)}
.club-row:last-child{border-bottom:none}
.club-code{font-family:'JetBrains Mono',monospace;font-size:12px;background:rgba(245,166,35,.1);color:var(--gold);padding:2px 8px;border-radius:4px;letter-spacing:1px}

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




const ADMIN_EMAIL = 'fcdeportivolamassana@gmail.com';

/* ══════════════════════════════════════════════════════════
   SUPABASE AUTH + MULTI-TENANT
══════════════════════════════════════════════════════════ */
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({length:8}, () => chars[Math.floor(Math.random()*chars.length)]).join('');
}

function ProfilPage({authData, onUpdate}) {
  const [clubName, setClubName] = useState(authData?.club?.name || '');
  const [logoUrl, setLogoUrl] = useState(authData?.club?.logo_url || '');
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState('');
  const [err, setErr] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  const handleSave = async () => {
    setSaving(true); setOk(''); setErr('');
    try {
      let finalLogoUrl = logoUrl.trim();
      if (logoFile) {
        const ext = logoFile.name.split('.').pop();
        const path = `${authData.club.code}.${ext}`;
        const { error: upErr } = await supabase.storage.from('club-logos').upload(path, logoFile, { upsert: true });
        if (!upErr) {
          const { data: urlData } = supabase.storage.from('club-logos').getPublicUrl(path);
          finalLogoUrl = urlData.publicUrl;
        }
      }
      const { error } = await supabase.from('clubs').update({ name: clubName.trim(), logo_url: finalLogoUrl }).eq('id', authData.club.id);
      if (error) throw error;
      setLogoUrl(finalLogoUrl);
      setLogoFile(null);
      setOk('✅ Club mis à jour !');
      if (onUpdate) onUpdate({ ...authData.club, name: clubName.trim(), logo_url: finalLogoUrl });
    } catch(e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="page-title">⚙️ MON CLUB</div>
      <div className="page-sub">Gérer les informations de ton club</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,maxWidth:800}}>
        <div className="card">
          <div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'var(--muted)',marginBottom:16}}>Informations du club</div>
          {err && <div className="auth-err" style={{marginBottom:12}}>⚠️ {err}</div>}
          {ok && <div className="auth-ok" style={{marginBottom:12}}>{ok}</div>}
          <div style={{marginBottom:14}}>
            <label className="auth-lbl">Nom du club</label>
            <input className="auth-input" value={clubName} onChange={e=>setClubName(e.target.value)} placeholder="Nom du club"/>
          </div>
          <div style={{marginBottom:14}}>
            <label className="auth-lbl">Logo du club</label>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              {(logoPreview||logoUrl) && <img src={logoPreview||logoUrl} style={{width:40,height:40,borderRadius:8,objectFit:'cover',border:'1px solid var(--border)'}}/>}
              <label style={{cursor:'pointer',flex:1}}>
                <input type="file" accept="image/*" style={{display:'none'}} onChange={e=>{
                  const f=e.target.files[0]; if(!f) return;
                  setLogoFile(f);
                  setLogoPreview(URL.createObjectURL(f));
                }}/>
                <div className="auth-input" style={{cursor:'pointer',color:'var(--muted)',display:'flex',alignItems:'center',gap:6}}>
                  📁 {logoFile ? logoFile.name : 'Changer le logo...'}
                </div>
              </label>
            </div>
          </div>
          <button className="btn btn-gold" onClick={handleSave} disabled={saving}>{saving?'Sauvegarde...':'💾 Sauvegarder'}</button>
        </div>
        <div className="card">
          <div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'var(--muted)',marginBottom:16}}>Aperçu</div>
          <div style={{textAlign:'center',padding:20}}>
            {logoUrl ? <img src={logoUrl} style={{width:80,height:80,borderRadius:12,objectFit:'cover',marginBottom:12}}/> : <div style={{width:80,height:80,borderRadius:12,background:'var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,margin:'0 auto 12px'}}>🏟️</div>}
            <div style={{fontWeight:700,fontSize:16}}>{clubName || 'Nom du club'}</div>
            <div style={{fontSize:11,color:'var(--muted)',marginTop:4}}>Code : <span style={{fontFamily:'monospace',color:'var(--gold)',letterSpacing:2}}>{authData?.club?.code}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
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
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
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
      let finalLogoUrl = logoUrl.trim();
      if (logoFile) {
        const ext = logoFile.name.split('.').pop();
        const path = `${code}.${ext}`;
        const { error: upErr } = await supabase.storage.from('club-logos').upload(path, logoFile, { upsert: true });
        if (!upErr) {
          const { data: urlData } = supabase.storage.from('club-logos').getPublicUrl(path);
          finalLogoUrl = urlData.publicUrl;
        }
      }
      const { data: club, error: cErr } = await supabase.from('clubs').insert({ name: clubName.trim(), code, logo_url: finalLogoUrl }).select().single();
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
        <div className="auth-logo"><img src="/logo.png" style={{width:52,height:52,borderRadius:10,marginBottom:6}}/><br/>SCOUTROOM</div>
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
        {mode === 'create' && (
          <div className="auth-field">
            <label className="auth-lbl">🖼️ Logo du club (optionnel)</label>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              {logoPreview && <img src={logoPreview} style={{width:40,height:40,borderRadius:8,objectFit:'cover',border:'1px solid var(--border)'}}/>}
              <label style={{cursor:'pointer',flex:1}}>
                <input type="file" accept="image/*" style={{display:'none'}} onChange={e=>{
                  const f=e.target.files[0]; if(!f) return;
                  setLogoFile(f);
                  setLogoPreview(URL.createObjectURL(f));
                }}/>
                <div className="auth-input" style={{cursor:'pointer',color:'var(--muted)',display:'flex',alignItems:'center',gap:6}}>
                  📁 {logoFile ? logoFile.name : 'Choisir un fichier...'}
                </div>
              </label>
            </div>
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
  const [tab,setTab]=useState("dashboard");
  const [players,setPlayers]=useState([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [url,setUrl]=useState("");
  const [loading,setLoading]=useState(false);
  const [loadStep,setLoadStep]=useState("");
  const [preview,setPreview]=useState(null);
  const [error,setError]=useState("");
  const [editP,setEditP]=useState(null);
  const [viewP,setViewP]=useState(null);
  const [newClubCode, setNewClubCode] = useState(null);

  // Check existing session on mount
  useEffect(()=>{
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        try {
          const { data: profile } = await supabase.from('profiles').select('*, clubs(*)').eq('id', session.user.id).single();
          if (profile?.club_id) {
            setAuthData({ user: session.user, profile, club: profile.clubs });
          }
        } catch(e) { console.error(e); }
      }
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
        pointsForts: p.points_forts, pointsFaibles: p.points_faibles,
        noteSS: p.note_ss, passeportUE: p.passeport_ue, espCatalan: p.esp_catalan,
        debutContrat: p.debut_contrat
      }));
      const cib = (cibData||[]).map(p => ({
        ...p, categorie:'CIBLE', finContrat: p.fin_contrat, clubActuel: p.club_actuel,
        pointsForts: p.points_forts, pointsFaibles: p.points_faibles,
        noteSS: p.note_ss, passeportUE: p.passeport_ue, espCatalan: p.esp_catalan,
        debutContrat: p.debut_contrat
      }));
      setPlayers([...eff, ...cib]);
    } catch(e) { console.error(e); }
    finally { setDbLoading(false); }
  };

  const toDbRow = (p, clubId) => ({
    club_id: clubId,
    nom: p.nom||'', poste: p.poste||'', role: p.role||'',
    club_actuel: p.clubActuel||p.club_actuel||'', ligue: p.ligue||'',
    nationalite: p.nationalite||'', age: p.age||'', taille: p.taille||'',
    pied: p.pied||'', fin_contrat: p.finContrat||p.fin_contrat||'',
    valeur: p.valeur||'', agent: p.agent||'', tm_url: p.tm_url||'',
    statut: p.statut||'', commentaires: p.commentaires||'',
    points_forts: p.pointsForts||p.points_forts||'',
    points_faibles: p.pointsFaibles||p.points_faibles||'',
    note_ss: p.noteSS||p.note_ss||'',
    passeport_ue: p.passeportUE||p.passeport_ue||'',
    esp_catalan: p.espCatalan||p.esp_catalan||'',
    debut_contrat: p.debutContrat||p.debut_contrat||'',
    matchs: p.matchs||'', buts: p.buts||'', passes: p.passes||'',
    priorite: p.priorite||'★★', categorie: p.categorie||'CIBLE',
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
    {id:"dashboard",label:"🏠 Tableau de bord"},
    {id:"effectif",label:"👥 Effectif",count:effectif.length},
    {id:"cibles",label:"🎯 Cibles Mercato",count:cibles.length},
    {id:"analyser",label:"➕ Analyser joueur"},
    {id:"budget",label:"💶 Budget"},
    {id:"guide",label:"📖 Guide DS"},
    {id:"profil",label:"⚙️ Mon Club"},
  ];

  if(!authData) return <><style dangerouslySetInnerHTML={{__html:css}}/><AuthPage onLogin={handleLogin}/></>;

  const clubName = authData.club?.name || 'Mon Club';
  const user = authData.profile;





  return (
    <>
      <style dangerouslySetInnerHTML={{__html:css}}/>
      {newClubCode && (
        <div style={{background:'rgba(34,197,94,.12)',border:'1px solid rgba(34,197,94,.25)',borderRadius:10,padding:'12px 20px',margin:'16px',display:'flex',alignItems:'center',gap:12,justifyContent:'space-between'}}>
          <div>🎉 <strong>Club créé !</strong> Ton code d'invitation : <span style={{fontFamily:'monospace',fontWeight:900,fontSize:16,color:'var(--green)',letterSpacing:2}}>{newClubCode}</span> — partage-le à tes membres</div>
          <button className="btn btn-ghost btn-sm" onClick={()=>setNewClubCode(null)}>✕</button>
        </div>
      )}
      <div className="app">

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <img src="/logo.png" style={{width:36,height:36,borderRadius:8,objectFit:'cover'}}/>
            <div>
              <div className="logo">SCOUT<span>ROOM</span></div>
              <div style={{fontSize:"10px",color:"var(--muted)",letterSpacing:"1px",fontWeight:500,marginTop:"-2px",display:"flex",alignItems:"center",gap:4}}>
              {authData?.club?.logo_url && <img src={authData.club.logo_url} style={{width:14,height:14,borderRadius:3,objectFit:'cover'}}/>}
              {clubName.toUpperCase()} · SCOUTROOM
            </div>
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
            <div className="user-pill">👤 {user?.nom}</div>
            {authData?.user?.email === ADMIN_EMAIL && <button className="btn btn-ghost btn-sm" style={{color:'var(--gold)',borderColor:'var(--gold)'}} onClick={()=>setTab('admin')}>⚙️ Admin</button>}
            <button className="btn btn-ghost btn-sm" onClick={()=>exportCSV(players)}>📥 Export CSV</button>
            <button className="btn btn-ghost btn-sm" title="Déconnexion" onClick={handleLogout}>🚪</button>
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

          {/* ─── PROFIL ─── */}
          {tab==="profil"&&<ProfilPage authData={authData} onUpdate={(club)=>setAuthData(prev=>({...prev,club}))}/>}

          {/* ─── ADMIN ─── */}
          {tab==="admin"&&authData?.user?.email===ADMIN_EMAIL&&<AdminPage onLogout={handleLogout}/>}

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
