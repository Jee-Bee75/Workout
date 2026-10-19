'use strict';
const KEY = 'homeWorkout.v1';
const $app = document.getElementById('app');
let state = load();
let view = { week: state.lastWeek || currentWeekKey(), ex: null };

// ---------- opslag ----------
function load(){ try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.weeks) return s; } catch(e){} return { weeks:{}, lastWeek:null }; }
function save(){ state.lastWeek = view.week; localStorage.setItem(KEY, JSON.stringify(state)); }

// ---------- weken (ISO) ----------
function isoWeek(d){ const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day); const y = t.getUTCFullYear(); const w = Math.ceil(((t - Date.UTC(y,0,1)) / 864e5 + 1) / 7); return [y, w]; }
function key(y,w){ return y + '-W' + String(w).padStart(2,'0'); }
function currentWeekKey(){ const [y,w] = isoWeek(new Date()); return key(y,w); }
function mondayOf(k){ const [y,w] = k.split('-W').map(Number); const jan4 = new Date(y,0,4); const d = (jan4.getDay()||7); const m = new Date(y,0,4 - d + 1 + (w-1)*7); return m; }
function shiftWeek(k, n){ const m = mondayOf(k); m.setDate(m.getDate() + 7*n + 3); const [y,w] = isoWeek(m); return key(y,w); }
const MAANDEN = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
function rangeLabel(k){ const a = mondayOf(k), b = new Date(a); b.setDate(a.getDate()+6); return a.getDate()+' '+MAANDEN[a.getMonth()]+' – '+b.getDate()+' '+MAANDEN[b.getMonth()]; }
function weekNr(k){ return Number(k.split('-W')[1]); }

// ---------- data per week ----------
function prevEntry(k, exId){ const keys = Object.keys(state.weeks).filter(x => x < k && state.weeks[x][exId]).sort(); return keys.length ? state.weeks[keys[keys.length-1]][exId] : null; }
function defaults(ex){ return { v:0, reps:ex.min, kg:0, band:'licht', step:0, sets:Array(ex.sets).fill(false) }; }
function getEntry(k, exId, create){
  const w = state.weeks[k]; if (w && w[exId]) return w[exId];
  const ex = EXERCISES.find(e => e.id === exId);
  const p = prevEntry(k, exId);
  const e = p ? { v:p.v, reps:p.reps, kg:p.kg, band:p.band, step:p.step, sets:Array(ex.sets).fill(false) } : defaults(ex);
  if (create){ (state.weeks[k] = state.weeks[k] || {})[exId] = e; }
  return e;
}
function isDone(ex, e){ return e.sets.length > 0 && e.sets.every(Boolean); }
function hasData(k, exId){ return !!(state.weeks[k] && state.weeks[k][exId]); }
function suggestion(ex, k){
  // twee weken achter elkaar de bovengrens gehaald (deze + vorige, of de twee weken ervoor)
  const hit = kk => hasData(kk, ex.id) && state.weeks[kk][ex.id].reps >= ex.max && state.weeks[kk][ex.id].sets.some(Boolean);
  const p1 = shiftWeek(k,-1), p2 = shiftWeek(k,-2);
  const cur = getEntry(k, ex.id, false); const steps = ex.variants[cur.v].steps;
  if (cur.step >= steps.length - 1) return false;
  return (hit(k) && hit(p1)) || (hit(p1) && hit(p2) && cur.reps >= ex.max);
}

// ---------- helpers ----------
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmtKg = n => (Math.round(n*10)/10).toString().replace('.', ',');
const fmtSec = s => s >= 60 ? Math.floor(s/60) + ':' + String(s%60).padStart(2,'0') + ' min' : s + ' s';
function toast(msg){ const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2200); }
function buzz(){ if (navigator.vibrate) navigator.vibrate(10); }

// ---------- weekscherm ----------
function renderWeek(){
  const k = view.week;
  let done = 0, setsDone = 0, setsTot = 0;
  const cards = EXERCISES.map(ex => {
    const e = getEntry(k, ex.id, false); const d = isDone(ex, e); if (d) done++;
    setsDone += e.sets.filter(Boolean).length; setsTot += ex.sets;
    const variant = ex.variants[e.v];
    const amount = ex.unit === 'sec' ? fmtSec(e.reps) : e.reps + '×';
    const load = variant.load === 'kg' && e.kg > 0 ? ' · ' + fmtKg(e.kg) + ' kg' : variant.load === 'band' ? ' · band ' + e.band : '';
    const tip = suggestion(ex, k) ? '<span class="tip">⭐ Klaar voor de volgende stap?</span>' : '';
    return `<button class="card ${d?'done':''}" data-ex="${ex.id}">
      <div class="ic"${d ? '' : ` style="background:${tint(ex.accent,.14)};color:${ex.accent}"`}>${d ? '✓' : exIcon(ex.id)}</div>
      <div class="tx"><b>${ex.nr}. ${esc(variant.name)}</b><span>${esc(ex.muscle)} · ${amount}${load}</span>${tip}</div>
      <div class="st">${e.sets.filter(Boolean).length}/${ex.sets}<br>sets</div></button>`;
  }).join('');
  const pct = Math.round(setsDone / setsTot * 100);
  const isNow = k === currentWeekKey();
  $app.innerHTML = `
  <header class="top">
    <div class="weeknav">
      <button class="navbtn" id="prev" aria-label="Vorige week">◀</button>
      <div class="wk"><b>Week ${weekNr(k)}</b><small>${rangeLabel(k)}${isNow ? ' · deze week' : ''}</small></div>
      <button class="navbtn" id="next" aria-label="Volgende week">▶</button>
    </div>
    <div class="bar"><i style="width:${pct}%"></i></div>
    <div class="barlbl">${done} van de ${EXERCISES.length} oefeningen klaar · ${setsDone}/${setsTot} sets</div>
  </header>
  <main>
    ${cards}
    ${!isNow ? '<button class="btn sec full" id="today" style="margin-top:6px">Naar deze week</button>' : ''}
    <div class="tools">
      <button class="btn sec" id="exp">⬇️ Backup maken</button>
      <button class="btn sec" id="imp">⬆️ Backup terugzetten</button>
    </div>
    <p class="note">Je gegevens staan alleen op deze telefoon. Maak af en toe een backup.</p>
  </main>`;
  $app.querySelector('#prev').onclick = () => { view.week = shiftWeek(k,-1); save(); render(); };
  $app.querySelector('#next').onclick = () => { view.week = shiftWeek(k,1); save(); render(); };
  const t = $app.querySelector('#today'); if (t) t.onclick = () => { view.week = currentWeekKey(); save(); render(); };
  $app.querySelectorAll('.card').forEach(c => c.onclick = () => { view.ex = c.dataset.ex; location.hash = 'ex-' + view.ex; });
  $app.querySelector('#exp').onclick = exportData;
  $app.querySelector('#imp').onclick = () => document.getElementById('importFile').click();
}

// ---------- detailscherm ----------
function renderDetail(){
  const k = view.week; const ex = EXERCISES.find(e => e.id === view.ex);
  const e = getEntry(k, ex.id, false); const variant = ex.variants[e.v];
  const isSec = ex.unit === 'sec';
  const steps = variant.steps; const step = Math.min(e.step, steps.length - 1);
  const sug = suggestion(ex, k);
  $app.innerHTML = `
  <header class="top"><div class="dtop">
    <button class="back" id="back">◀ Week</button>
    <div class="hic" style="background:${tint(ex.accent,.14)};color:${ex.accent}">${exIcon(ex.id,36)}</div><div class="dtitle"><b>${esc(variant.name)}</b><small>${esc(ex.muscle)} · week ${weekNr(k)}</small></div>
  </div></header>
  <main>
    ${ex.variants.length > 1 ? `<div class="sec-h">Welke oefening</div><div class="toggle">${ex.variants.map((v,i) => `<button data-v="${i}" class="${i===e.v?'on':''}">${esc(v.name)}</button>`).join('')}</div>` : ''}
    <div class="sec-h">Sets – tik als klaar</div>
    <div class="sets">${e.sets.map((s,i) => `<button class="dot ${s?'on':''}" data-s="${i}">${s ? '✓' : i+1}</button>`).join('')}</div>
    <div class="sec-h">${isSec ? 'Tijd per set' : 'Herhalingen per set'} <span style="text-transform:none;letter-spacing:0;font-weight:400">(doel ${isSec ? '30 s – 2 min' : ex.min+'–'+ex.max})</span></div>
    <div class="stepper"><button id="rm" aria-label="minder">−</button><div class="val"><b>${isSec ? fmtSec(e.reps) : e.reps}</b><small>${isSec ? 'stappen van 5 s' : 'herhalingen'}</small></div><button id="rp" aria-label="meer">+</button></div>
    ${variant.load === 'kg' ? `<div class="sec-h">Gewicht</div>
    <div class="stepper"><button id="km" aria-label="minder gewicht">−</button><div class="val"><b>${fmtKg(e.kg)} kg</b><small>${e.kg === 0 ? 'zonder gewicht' : 'per hand / totaal'}</small></div><button id="kp" aria-label="meer gewicht">+</button></div>` : ''}
    ${variant.load === 'band' ? `<div class="sec-h">Elastiek</div>
    <div class="bands">${BANDS.map(b => `<button data-b="${b.id}" class="${e.band===b.id?'on':''}"><i style="background:${b.color}"></i>${b.label}</button>`).join('')}</div>` : ''}
    ${sug ? `<div class="suggest">⭐ Klaar voor de volgende stap?<small>Je haalde 2 weken op rij ${isSec ? '2 minuten' : ex.max + ' herhalingen'}. Tik op ‘Volgende stap’.</small></div>` : ''}
    <div class="sec-h">Zwaarder maken</div>
    <div class="stepbox"><div class="n">Stap ${step+1} van ${steps.length}</div><div class="t">${esc(steps[step])}</div>
      <div class="row"><button class="btn sec" id="sb" ${step===0?'disabled':''}>◀ Vorige</button><button class="btn" id="sn" ${step>=steps.length-1?'disabled':''}>Volgende stap ▶</button></div></div>
    <div class="sec-h">Voortgang</div>
    ${chart(ex)}
    <button class="btn full" id="ok" style="margin-top:18px">✓ Klaar, terug naar week</button>
  </main>`;
  const upd = fn => { const en = getEntry(k, ex.id, true); fn(en); save(); buzz(); renderDetail(); };
  $app.querySelector('#back').onclick = $app.querySelector('#ok').onclick = () => history.length > 1 ? history.back() : (location.hash = '');
  $app.querySelectorAll('[data-v]').forEach(b => b.onclick = () => upd(en => { if (en.v !== +b.dataset.v){ en.v = +b.dataset.v; en.step = 0; } }));
  $app.querySelectorAll('[data-s]').forEach(b => b.onclick = () => upd(en => { en.sets[+b.dataset.s] = !en.sets[+b.dataset.s]; }));
  const stepR = isSec ? 5 : 1, minR = isSec ? 5 : 1, maxR = isSec ? 600 : 100;
  $app.querySelector('#rm').onclick = () => upd(en => en.reps = Math.max(minR, en.reps - stepR));
  $app.querySelector('#rp').onclick = () => upd(en => en.reps = Math.min(maxR, en.reps + stepR));
  const km = $app.querySelector('#km'); if (km){ km.onclick = () => upd(en => en.kg = Math.max(0, Math.round((en.kg - .5)*10)/10)); $app.querySelector('#kp').onclick = () => upd(en => en.kg = Math.round((en.kg + .5)*10)/10); }
  $app.querySelectorAll('[data-b]').forEach(b => b.onclick = () => upd(en => en.band = b.dataset.b));
  $app.querySelector('#sb').onclick = () => upd(en => en.step = Math.max(0, en.step - 1));
  $app.querySelector('#sn').onclick = () => upd(en => en.step = Math.min(steps.length - 1, en.step + 1));
}

// ---------- grafiek ----------
function chart(ex){
  const keys = Object.keys(state.weeks).filter(k => state.weeks[k][ex.id]).sort().slice(-12);
  if (keys.length < 1) return '<div class="chart"><div class="empty">Nog geen gegevens. Na een paar weken zie je hier je lijn omhoog gaan.</div></div>';
  const pts = keys.map(k => ({ w:weekNr(k), r:state.weeks[k][ex.id].reps, kg:state.weeks[k][ex.id].kg || 0 }));
  const W = 340, H = 170, L = 34, R = 10, T = 14, B = 26;
  const maxR = Math.max(ex.max, ...pts.map(p => p.r)), minR = 0;
  const showKg = pts.some(p => p.kg > 0); const maxKg = Math.max(1, ...pts.map(p => p.kg));
  const x = i => pts.length === 1 ? (L + W - R)/2 : L + i * (W - L - R) / (pts.length - 1);
  const y = v => T + (H - T - B) * (1 - (v - minR) / (maxR - minR));
  const yk = v => T + (H - T - B) * (1 - v / maxKg);
  const line = (f) => pts.map((p,i) => (i?'L':'M') + x(i).toFixed(1) + ' ' + f(p).toFixed(1)).join(' ');
  const goal = y(ex.max);
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Voortgang">
    <line x1="${L}" x2="${W-R}" y1="${goal}" y2="${goal}" stroke="#1a9e55" stroke-dasharray="4 4"/>
    <text x="${W-R}" y="${goal-4}" font-size="10" fill="#1a9e55" text-anchor="end">doel ${ex.unit==='sec' ? '2 min' : ex.max}</text>
    <line x1="${L}" x2="${W-R}" y1="${H-B}" y2="${H-B}" stroke="#e5e7eb"/>
    <text x="${L-6}" y="${y(maxR)+4}" font-size="10" fill="#6b7280" text-anchor="end">${maxR}</text>
    <text x="${L-6}" y="${H-B+4}" font-size="10" fill="#6b7280" text-anchor="end">0</text>`;
  if (showKg) s += `<path d="${line(p => yk(p.kg))}" fill="none" stroke="#0a0a0a" stroke-width="2" stroke-dasharray="5 4"/>`;
  s += `<path d="${line(p => y(p.r))}" fill="none" stroke="#1f6fe0" stroke-width="3" stroke-linejoin="round"/>`;
  pts.forEach((p,i) => { s += `<circle cx="${x(i)}" cy="${y(p.r)}" r="4.5" fill="#1f6fe0"/><text x="${x(i)}" y="${H-8}" font-size="10" fill="#6b7280" text-anchor="middle">w${p.w}</text>`; });
  s += '</svg>';
  return `<div class="chart">${s}<div class="legend"><span><i style="background:#1f6fe0"></i>${ex.unit==='sec'?'seconden':'herhalingen'}</span>${showKg ? '<span><i style="background:#0a0a0a"></i>kg</span>' : ''}</div></div>`;
}

// ---------- backup ----------
async function exportData(){
  const json = JSON.stringify({ app:'home-workout', version:1, exported:new Date().toISOString(), data:state }, null, 1);
  const name = 'workout-backup-' + new Date().toISOString().slice(0,10) + '.json';
  try {
    const file = new File([json], name, { type:'application/json' });
    if (navigator.canShare && navigator.canShare({ files:[file] })) { await navigator.share({ files:[file], title:'Workout backup' }); return; }
  } catch(e){ if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([json], { type:'application/json' })); a.download = name; document.body.appendChild(a); a.click(); a.remove();
  toast('Backup opgeslagen');
}
document.getElementById('importFile').addEventListener('change', ev => {
  const f = ev.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => { try { const o = JSON.parse(r.result); const d = o.data || o; if (!d.weeks) throw 0;
      if (!confirm('Backup terugzetten? Je huidige gegevens worden vervangen.')) return;
      state = d; save(); render(); toast('Backup teruggezet'); } catch(e){ toast('Dit is geen geldig backupbestand'); } };
  r.readAsText(f); ev.target.value = '';
});

// ---------- router ----------
function render(){
  const m = location.hash.match(/^#ex-(\w+)/);
  view.ex = m && EXERCISES.some(e => e.id === m[1]) ? m[1] : null;
  if (view.ex) renderDetail(); else renderWeek();
  window.scrollTo(0,0);
}
window.addEventListener('hashchange', render);
render();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
