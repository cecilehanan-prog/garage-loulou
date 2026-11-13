/* =========================================================
   CŒUR DE L'APPLI : sauvegarde, voix, sons, dessins, outils
   ========================================================= */
window.Z = { screens: {} };

/* append() ignore les éléments vides (null/false) au lieu d'écrire "null" */
(function () {
  const ap = Element.prototype.append;
  Element.prototype.append = function (...n) { return ap.apply(this, n.filter(x => x != null && x !== false)); };
})();

/* ---------- Petits outils ---------- */
Z.$ = (sel, root = document) => root.querySelector(sel);
Z.rand = (n) => Math.floor(Math.random() * n);
Z.pick = (arr) => arr[Z.rand(arr.length)];
Z.shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Z.rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
Z.wait = (ms) => new Promise(r => setTimeout(r, ms));

/* h('div', {class:'x', onclick: fn}, enfant1, enfant2...) */
Z.h = function (tag, attrs, ...kids) {
  const el = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue;
    el.appendChild(typeof kid === 'string' || typeof kid === 'number' ? document.createTextNode(kid) : kid);
  }
  return el;
};

/* ---------- Dates ---------- */
Z.today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
Z.dayNum = (iso = Z.today()) => { const [y, m, d] = iso.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 864e5); };

/* ---------- Sauvegarde (reste sur le téléphone) ---------- */
const KEY = 'zouzou-cm1-v1';
function defaultState() {
  return {
    name: 'Zouzou Gabi', eclairs: 25, xp: 0,
    streak: { count: 0, last: null },
    words: {}, facts: {}, probs: {}, stickers: {}, route: {},
    owned: { color: ['orange'], helmet: ['aucun'], cat: ['aucun'] },
    equip: { color: 'orange', helmet: 'aucun', cat: 'aucun' },
    daily: { date: null, games: 0, chest: false },
    customWords: [],
    settings: { rate: 0.9, sound: true },
    log: []
  };
}
Z.load = function () {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
  const d = defaultState();
  if (!s) return d;
  for (const k in d) if (s[k] === undefined) s[k] = d[k];
  for (const k of ['owned', 'equip', 'settings', 'daily', 'streak']) s[k] = Object.assign({}, d[k], s[k]);
  return s;
};
Z.state = Z.load();
Z.save = () => { try { localStorage.setItem(KEY, JSON.stringify(Z.state)); } catch (e) { /* stockage indisponible */ } };
Z.reset = () => { Z.state = defaultState(); Z.save(); };

/* Mission du jour */
Z.daily = function () {
  if (Z.state.daily.date !== Z.today()) Z.state.daily = { date: Z.today(), games: 0, chest: false };
  return Z.state.daily;
};

/* Série de jours (flamme) */
Z.touchStreak = function () {
  const st = Z.state.streak, t = Z.today();
  if (st.last === t) return;
  if (st.last && Z.dayNum(t) - Z.dayNum(st.last) === 1) st.count += 1; else st.count = 1;
  st.last = t;
};
Z.streakAlive = () => {
  const st = Z.state.streak;
  return st.last && (Z.dayNum() - Z.dayNum(st.last)) <= 1 ? st.count : 0;
};

/* Niveau */
Z.levelInfo = function () {
  const xp = Z.state.xp;
  let lvl = 1, need = 40, base = 0;
  while (xp >= base + need) { base += need; lvl++; need = 40 + (lvl - 1) * 20; }
  return { lvl, cur: xp - base, need };
};

/* Plus Jasmin progresse, plus sa Kukirin va vite (affichée sur l'écran du guidon) */
Z.speedOf = (lvl) => Math.min(45, 10 + (lvl - 1) * 4);
Z.speed = () => Z.speedOf(Z.levelInfo().lvl);
/* Les roues, la route et le décor tournent/défilent selon la vitesse */
Z.applySpeed = function () {
  const v = Z.speed(), r = document.documentElement.style;
  r.setProperty('--spin', (14 / v).toFixed(2) + 's');     // 10 km/h : 1,4 s par tour ; 45 km/h : 0,3 s
  r.setProperty('--dash', (5 / v).toFixed(2) + 's');
  r.setProperty('--deco', (90 / v).toFixed(1) + 's');
  r.setProperty('--ground', (12 / v).toFixed(2) + 's');
};

/* Fin d'un jeu : récompense + journal */
Z.finishGame = function (kind, eclairs, xp, detail) {
  const before = Z.levelInfo().lvl;
  Z.state.eclairs += eclairs;
  Z.state.xp += xp;
  Z.touchStreak();
  Z.daily().games += 1;
  Z.state.log.push({ d: Z.today(), k: kind, e: eclairs, x: detail || '' });
  if (Z.state.log.length > 300) Z.state.log = Z.state.log.slice(-300);
  Z.save();
  return Z.levelInfo().lvl > before;
};

/* ---------- Répétition espacée (boîtes de Leitner) ----------
   boîte 1 = à revoir aujourd'hui, 2 = demain, 3 = dans 3 j, 4 = 7 j, 5 = 16 j (maîtrisé) */
Z.INTERVALS = [0, 0, 1, 3, 7, 16];
Z.srsUpdate = function (store, id, success) {
  const it = store[id] || { box: 0, due: Z.dayNum(), seen: 0, ok: 0 };
  it.seen += 1;
  if (success) { it.ok += 1; it.box = Math.min(5, it.box + 1); }
  else it.box = 1;
  it.due = Z.dayNum() + Z.INTERVALS[it.box];
  store[id] = it;
  return it;
};
Z.isDue = (it) => it && it.due <= Z.dayNum();

/* ---------- Voix (synthèse vocale du téléphone) ---------- */
let voice = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices().filter(v => v.lang && v.lang.toLowerCase().replace('_', '-').startsWith('fr'));
  voice = vs.find(v => /google/i.test(v.name) && /fr-FR/i.test(v.lang.replace('_', '-')))
       || vs.find(v => /fr-FR/i.test(v.lang.replace('_', '-')))
       || vs[0] || null;
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

let speakToken = 0;
/* Pauses de lecture (demandées par Maman) : 0,25 s après une virgule, 1,5 s après un point final.
   Le texte est découpé en morceaux lus l'un après l'autre, avec un vrai silence entre eux :
   l'enfant a le temps de comprendre chaque morceau avant le suivant. */
Z.PAUSE_COMMA = 250;
Z.PAUSE_END = 1500;
function chunksOf(text) {
  const parts = text.match(/[^,;:.!?…]+[,;:.!?…]*/g) || [text];
  return parts.map(t => t.trim()).filter(t => /[\p{L}\p{N}]/u.test(t)).map(t => {
    const last = t.slice(-1);
    const pause = /[.!?…]/.test(last) ? Z.PAUSE_END : /[,;:]/.test(last) ? Z.PAUSE_COMMA : 0;
    return { t, pause };
  });
}
function speakOne(text, rate, pitch, my) {
  return new Promise(resolve => {
    if (my !== speakToken) return resolve();
    // Prononciation : "Moezeh" se dit "Moizè" (le texte affiché ne change pas)
    const u = new SpeechSynthesisUtterance(text.replace(/Moezeh/g, "Moizè"));
    u.lang = 'fr-FR';
    if (voice) u.voice = voice;
    u.rate = rate; u.pitch = pitch;
    let done = false;
    const fin = () => { if (!done) { done = true; resolve(); } };
    u.onend = fin; u.onerror = fin;
    speechSynthesis.speak(u);
    setTimeout(fin, 3000 + text.length * 150);
  });
}
Z.speak = function (text, opts = {}) {
  if (!('speechSynthesis' in window) || !text) return Promise.resolve();
  const my = ++speakToken;
  speechSynthesis.cancel();
  /* Voix de Loulou "dessin animé" (aiguë, petite voix d'enfant) pour tout ce que dit Loulou.
     Un mot seul à apprendre est lu avec une voix NATURELLE : le cerveau doit entendre
     les vrais sons du mot, sans déformation. */
  const singleWord = !/\s/.test(text.trim());
  const cartoon = Z.state.settings.cartoon !== false && !opts.natural && !singleWord && opts.pitch === undefined;
  const rate = (opts.rate || 1) * Z.state.settings.rate * (cartoon ? (({ loulou: 1.0, moezeh: 1.05, doudou: 0.95, isis: 0.98 })[Z.narrator] || 1) : 1);
  /* Chaque chat a sa voix : Loulou = la plus aiguë (petite voix d'enfant),
     Moezeh = un peu plus grave et tonique (le coach des maths), Doudou = douce et posée */
  const VOICES = { isis: { p: 1.65, r: 0.98 }, loulou: { p: 2.0, r: 1.0 }, moezeh: { p: 1.45, r: 1.05 }, doudou: { p: 1.8, r: 0.95 } };
  const vc = VOICES[Z.narrator] || VOICES.loulou;
  const pitch = opts.pitch !== undefined ? opts.pitch : cartoon ? vc.p : 1.0;
  return (async () => {
    await Z.wait(60);
    const chunks = singleWord ? [{ t: text.trim(), pause: 0 }] : chunksOf(text);
    for (const c of chunks) {
      if (my !== speakToken) return;
      await speakOne(c.t, rate, pitch, my);
      if (my !== speakToken) return;
      if (c.pause) await Z.wait(c.pause);
    }
  })();
};
Z.stopSpeak = () => { speakToken++; if ('speechSynthesis' in window) speechSynthesis.cancel(); };

/* Bouton haut-parleur */
Z.ear = (text, opts) => Z.h('button', {
  class: 'ear', 'aria-label': 'Écouter',
  onclick: (ev) => { ev.stopPropagation(); Z.sfx.tap(); Z.speak(typeof text === 'function' ? text() : text, opts); }
}, '🔊');

/* ---------- Sons (fabriqués, aucun fichier) ---------- */
let ac = null;
function actx() {
  if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
  if (ac.state === 'suspended') ac.resume();
  return ac;
}
function tone(freq, dur, type = 'sine', vol = 0.15, when = 0, slide = 0) {
  if (!Z.state.settings.sound) return;
  const c = actx(); if (!c) return;
  const t0 = c.currentTime + when;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(c.destination);
  o.start(t0); o.stop(t0 + dur + 0.05);
}
const buzz = (ms) => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { } };
Z.sfx = {
  tap() { tone(700, 0.06, 'triangle', 0.08); },
  good() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.2, 'triangle', 0.13, i * 0.07)); buzz(25); },
  bad() { tone(330, 0.15, 'sine', 0.1, 0, -80); tone(262, 0.22, 'sine', 0.08, 0.12, -60); buzz([20, 40, 20]); },
  coin() { tone(988, 0.07, 'square', 0.05); tone(1319, 0.25, 'square', 0.05, 0.07); },
  drum() { tone(140, 0.18, 'sine', 0.35, 0, -90); tone(90, 0.25, 'triangle', 0.15, 0.01, -40); buzz(30); },
  vroum() { tone(90, 0.6, 'sawtooth', 0.06, 0, 260); tone(120, 0.6, 'square', 0.03, 0.05, 300); },
  click() { tone(1500, 0.03, 'square', 0.05); },
  win() { [523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.13, i * 0.12)); buzz([40, 60, 40]); },
  camera() { tone(2000, 0.04, 'square', 0.06); tone(600, 0.12, 'triangle', 0.08, 0.05); }
};

/* ---------- Confettis ---------- */
Z.confetti = function (n = 110) {
  const cv = Z.h('canvas', { class: 'confetti' });
  document.body.appendChild(cv);
  const W = cv.width = innerWidth, H = cv.height = innerHeight, g = cv.getContext('2d');
  const cols = ['#facc15', '#22c55e', '#3b82f6', '#ef4444', '#a855f7', '#f97316'];
  const ps = Array.from({ length: n }, () => ({
    x: W / 2 + (Math.random() - .5) * 80, y: H * .45, vx: (Math.random() - .5) * 14, vy: -Math.random() * 15 - 4,
    s: 6 + Math.random() * 8, c: Z.pick(cols), r: Math.random() * 6, vr: (Math.random() - .5) * .4
  }));
  let t = 0;
  (function frame() {
    g.clearRect(0, 0, W, H);
    ps.forEach(p => { p.vy += .45; p.x += p.vx; p.y += p.vy; p.r += p.vr; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore(); });
    if (++t < 130) requestAnimationFrame(frame); else cv.remove();
  })();
};

/* Petit message volant (+5 ⚡, Bravo…) */
Z.pop = function (text, cls = '') {
  const el = Z.h('div', { class: 'pop ' + cls }, text);
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1400);
};

/* Fenêtre par-dessus l'écran */
Z.modal = function (content, { onClose, closable = true } = {}) {
  const box = Z.h('div', { class: 'modal-box' }, content);
  const bg = Z.h('div', { class: 'modal' }, box);
  const close = () => { bg.remove(); onClose && onClose(); };
  if (closable) bg.addEventListener('click', (e) => { if (e.target === bg) close(); });
  document.body.appendChild(bg);
  return close;
};

/* ---------- Mots : lecture du format "b[eau]-cou(p)" ---------- */
Z.parseWord = function (spec) {
  const syl = spec.split('-').map(part => {
    const segs = []; let i = 0;
    while (i < part.length) {
      const ch = part[i];
      if (ch === '[' || ch === '(') {
        const close = ch === '[' ? ']' : ')';
        const j = part.indexOf(close, i);
        segs.push({ t: part.slice(i + 1, j), k: ch === '[' ? 'trick' : 'mute' });
        i = j + 1;
      } else {
        let j = i; while (j < part.length && !'[('.includes(part[j])) j++;
        segs.push({ t: part.slice(i, j), k: 'n' });
        i = j;
      }
    }
    return { segs, text: segs.map(s => s.t).join('') };
  });
  return { syl, word: syl.map(s => s.text).join('') };
};

/* Affiche un mot en syllabes colorées (bleu / rouge), piège surligné, lettres muettes grisées */
Z.wordEl = function (parsed, { big = false, tricks = true, cls = '' } = {}) {
  return Z.h('span', { class: 'word ' + (big ? 'big ' : '') + cls },
    parsed.syl.map((s, i) => Z.h('span', { class: 'syl s' + (i % 2) },
      s.segs.map(sg => Z.h('span', { class: tricks ? ('seg-' + sg.k) : '' }, sg.t)))));
};

/* Tous les mots (programme + mots ajoutés par les parents) */
Z.allWords = () => ZDATA.words.concat(Z.state.customWords || []);

/* ---------- Dessins (SVG) ---------- */
Z.art = {};
Z.colorOf = (id) => (ZDATA.colors.find(c => c.id === id) || ZDATA.colors[0]).c;
Z.helmetOf = (id) => (ZDATA.helmets.find(c => c.id === id) || ZDATA.helmets[0]);

/* Zouzou Gabi sur sa trottinette Kukirin G2 (vue de côté) */
Z.art.rider = function ({ color, helmet, rider = true } = {}) {
  const c = color || Z.colorOf(Z.state.equip.color);
  const two = !color && !!(ZDATA.colors.find(x => x.id === Z.state.equip.color) || {}).two;
  const deck = two ? '#111827' : c, band = two ? c : '#111827', label = two ? '#fff' : '#111827';
  const hm = Z.helmetOf(helmet || Z.state.equip.helmet);
  let deco = '';
  if (hm.id === 'flamme') deco = `<path d="M100 22 q6 -10 12 -2 q4 -8 10 0 q2 -6 6 -2" stroke="#dc2626" stroke-width="3" fill="none"/>`;
  if (hm.id === 'eclair') deco = `<path d="M110 14 l-6 10 h6 l-4 9 l11 -13 h-6 l4 -6z" fill="#1f2937"/>`;
  if (hm.id === 'dino') deco = `<path d="M96 20 l4 -8 l4 7 l4 -9 l4 8 l4 -8 l4 9" fill="#15803d"/>`;
  if (hm.id === 'pilote') deco = `<rect x="98" y="27" width="34" height="7" rx="3" fill="#111827"/><rect x="99" y="16" width="30" height="4" fill="#fff"/>`;
  const kid = rider ? `
    <!-- jambes -->
    <path d="M92 128 L98 96" stroke="#1e3a8a" stroke-width="11" stroke-linecap="round"/>
    <path d="M110 128 L106 96" stroke="#1e3a8a" stroke-width="11" stroke-linecap="round"/>
    <ellipse cx="90" cy="129" rx="10" ry="5" fill="#111827"/><ellipse cx="112" cy="129" rx="10" ry="5" fill="#111827"/>
    <!-- corps (maillot de foot) -->
    <rect x="88" y="56" width="30" height="44" rx="12" fill="#1d4ed8"/>
    <text x="103" y="86" font-size="16" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial">10</text>
    <!-- bras vers le guidon -->
    <path d="M112 66 Q135 64 150 46" stroke="#1d4ed8" stroke-width="9" stroke-linecap="round" fill="none"/>
    <circle cx="151" cy="45" r="5" fill="#f2c9a8"/>
    <!-- tête (d'après la photo de Jasmin : cheveux châtain foncé, frange, yeux marron) -->
    <path d="M95 36 Q94 52 102 55 L104 40 Z" fill="#3b2416"/>
    <circle cx="112" cy="41" r="17" fill="#f2c9a8"/>
    <ellipse cx="103" cy="43" rx="3.5" ry="5" fill="#e6b38f"/>
    <path d="M100 37 Q112 44 129 40 L129 35 L100 35 Z" fill="#3b2416"/>
    <path d="M118 37 q6 6 11 3" stroke="#2a180d" stroke-width="2" fill="none"/>
    <ellipse cx="120" cy="45" rx="2.8" ry="3.4" fill="#4a2c1a"/>
    <circle cx="121" cy="44" r="1" fill="#fff"/>
    <path d="M117 41 q3 -1.5 6 0" stroke="#3b2416" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M114 51 q5 4 10 -1" stroke="#9a3b2b" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <circle cx="115" cy="49" r="2.4" fill="#f4a7a0" opacity=".55"/>
    <!-- casque -->
    <path d="M94 38 a18 18 0 0 1 36 0 z" fill="${hm.c}" stroke="#374151" stroke-width="2"/>
    ${deco}` : '';
  return `<svg viewBox="0 0 220 180" class="rider-svg" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="112" cy="172" rx="86" ry="6" fill="rgba(0,0,0,.18)"/>
    <!-- Kukirin G2 sportive : cadre orange, lignes anguleuses, gros pneus, double suspension -->
    <!-- traits de vitesse -->
    <path d="M4 112 h26 M0 124 h20 M8 100 h16" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="${(0.15 + Z.speed() / 50).toFixed(2)}"/>
    <!-- tige épaisse inclinée + fourche -->
    <path d="M164 122 L152 40" stroke="${c}" stroke-width="12" stroke-linecap="round"/>
    <path d="M161 100 L155 58" stroke="#111827" stroke-width="3" stroke-linecap="round"/>
    <path d="M164 122 L174 152" stroke="#111827" stroke-width="8" stroke-linecap="round"/>
    <path d="M163 124 l11 2 M164 130 l11 2 M166 136 l11 2 M168 142 l11 2" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
    <!-- guidon large relevé + écran -->
    <path d="M132 40 Q152 34 176 36" stroke="#111827" stroke-width="7" fill="none" stroke-linecap="round"/>
    <rect x="132" y="35" width="10" height="8" rx="3" fill="${c}"/><rect x="167" y="32" width="10" height="8" rx="3" fill="${c}"/>
    <rect x="146" y="28" width="18" height="10" rx="2.5" fill="#111827" stroke="${c}" stroke-width="1.5"/>
    <text x="155" y="36" font-size="7" font-weight="700" text-anchor="middle" fill="#38bdf8" font-family="Arial">${Z.speed()}</text>
    <!-- phare LED -->
    <path d="M156 52 l14 -3 l1 8 l-14 2 z" fill="#fef9c3" stroke="#111827" stroke-width="2"/>
    <path d="M173 50 l16 -6 M173 54 l18 0 M173 58 l16 5" stroke="#fde68a" stroke-width="2" opacity=".9"/>
    <!-- plateau anguleux type course -->
    <path d="M30 118 L48 122 L168 120 L180 128 L174 142 L40 144 L26 132 Z" fill="${deck}" stroke="#111827" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M46 128 L170 126 L166 132 L44 134 Z" fill="${band}"/>${two ? `<path d="M128 122 l14 0 l-10 18 l-14 0 z M146 122 l8 0 l-10 18 l-8 0 z" fill="${c}"/>`: ""}
    <path d="M60 122 l12 0 l-8 18 l-12 0 z M76 122 l8 0 l-8 18 l-8 0 z" fill="#111827" opacity=".85"/>
    <text x="112" y="142" font-size="7.5" font-weight="700" text-anchor="middle" fill="${label}" font-family="Arial" letter-spacing="1">KUKIRIN G2</text>
    <!-- aileron arrière -->
    <path d="M22 118 L44 114 L48 122 L30 124 Z" fill="#111827"/>
    <!-- bras arrière + amortisseur -->
    <path d="M58 140 L48 152" stroke="#111827" stroke-width="8" stroke-linecap="round"/>
    <path d="M70 126 l-12 14" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>
    <!-- garde-boue sport -->
    <path d="M20 146 Q28 122 58 126" stroke="#111827" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M150 134 Q178 120 198 146" stroke="${two ? '#111827' : c}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <!-- gros pneus tout-terrain, jantes orange -->
    <g class="wheel" style="transform-origin:50px 152px"><circle cx="50" cy="152" r="24" fill="#111827"/><circle cx="50" cy="152" r="24" fill="none" stroke="#4b5563" stroke-width="4" stroke-dasharray="5 3"/><circle cx="50" cy="152" r="12" fill="${c}"/><circle cx="50" cy="152" r="5" fill="#111827"/><path d="M50 141 V163 M39 152 H61" stroke="#111827" stroke-width="2.5"/></g>
    <g class="wheel" style="transform-origin:172px 152px"><circle cx="172" cy="152" r="24" fill="#111827"/><circle cx="172" cy="152" r="24" fill="none" stroke="#4b5563" stroke-width="4" stroke-dasharray="5 3"/><circle cx="172" cy="152" r="12" fill="${c}"/><circle cx="172" cy="152" r="5" fill="#111827"/><path d="M172 141 V163 M161 152 H183" stroke="#111827" stroke-width="2.5"/></g>
    ${kid}
  </svg>`;
};

/* Loulou le chat (assis, de face) */
/* Les 3 chats de la maison, dessinés d'après les photos :
   - Loulou : noir et blanc, masque noir, bande blanche jusqu'au nez, yeux vert-jaune
   - Moezeh : tigré gris-brun ET blanc (poitrail, ventre, museau, pattes blancs), yeux verts
   - Isis : tigrée brun-gris, museau et menton blancs, pattes rousses, yeux verts, collier gris
   - Doudou : tigrée brun doré aux reflets roux, menton clair, queue annelée, yeux vert-jaune */
Z.CATS = {
  loulou: { name: 'Loulou', fur: '#1c1c1f', mask: '#1c1c1f', face: '#f7f7f5', bib: '#f7f7f5', paw: '#f7f7f5', stripe: null, eye: '#c4c25a', nose: '#e79a9a', blaze: true },
  moezeh: { name: 'Moezeh', fur: '#7a7266', mask: '#7a7266', face: '#f7f7f5', bib: '#f7f7f5', paw: '#f7f7f5', stripe: '#3a342d', eye: '#8fb35a', nose: '#e8a3a3', blaze: true },
  isis: { name: 'Isis', fur: '#8b7655', mask: '#8b7655', face: '#8b7655', bib: '#f3eee4', paw: '#c98b4e', stripe: '#3b3022', eye: '#86a85c', nose: '#d98c84', blaze: false, ginger: '#b98b54' },
  doudou: { name: 'Doudou', fur: '#9a7a4e', mask: '#9a7a4e', face: '#9a7a4e', bib: '#e6d3ae', paw: '#a8875a', stripe: '#4a3a26', eye: '#b9b552', nose: '#d99a8a', blaze: false, ginger: '#c48a4a' }
};
Z.art.cat = function ({ acc, mood = 'happy', who } = {}) {
  const id = who || 'loulou';
  const k = Z.CATS[id] || Z.CATS.loulou;
  const a = id === 'loulou' ? (acc || Z.state.equip.cat) : 'aucun';
  let extra = '';
  if (a === 'bandana') extra = `<path d="M38 78 L82 78 L60 96 Z" fill="#ef4444"/><circle cx="60" cy="84" r="3" fill="#fff"/>`;
  if (a === 'lunettes') extra = `<rect x="36" y="46" width="20" height="13" rx="5" fill="#111827" stroke="#facc15" stroke-width="2.5"/><rect x="64" y="46" width="20" height="13" rx="5" fill="#111827" stroke="#facc15" stroke-width="2.5"/><path d="M56 52 H64" stroke="#facc15" stroke-width="3"/>`;
  if (a === 'couronne') extra = `<path d="M40 22 L46 8 L53 18 L60 4 L67 18 L74 8 L80 22 Z" fill="#facc15" stroke="#b45309" stroke-width="2"/>`;
  if (a === 'casque') extra = `<path d="M34 30 a26 22 0 0 1 52 0 z" fill="${Z.colorOf(Z.state.equip.color)}" stroke="#374151" stroke-width="2"/>`;
  const eye = (x) => `<ellipse cx="${x}" cy="53" rx="6.5" ry="7.5" fill="${k.eye}"/><ellipse cx="${x}" cy="53" rx="2.4" ry="6" fill="#111"/><circle cx="${x + 2}" cy="50" r="1.8" fill="#fff"/>`;
  const eyes = mood === 'think'
    ? `<path d="M42 54 q6 -4 12 0 M66 54 q6 -4 12 0" stroke="${k.eye}" stroke-width="4" fill="none" stroke-linecap="round"/>`
    : eye(48) + eye(72);
  const st = k.stripe;
  // rayures du corps, de la queue et du front (chats tigrés)
  const bodyStripes = st ? `<path d="M32 88 q8 4 6 14 M88 88 q-8 4 -6 14 M30 102 q8 2 8 12 M90 102 q-8 2 -8 12" stroke="${st}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>` : '';
  const tailRings = st ? `<path d="M96 108 l6 -5 M104 100 l7 -2 M108 90 l7 1 M108 80 l7 3" stroke="${st}" stroke-width="4" stroke-linecap="round"/>` : '';
  const foreheadM = st ? `<path d="M50 30 l4 10 l6 -8 l6 8 l4 -10 M40 38 l7 5 M80 38 l-7 5 M60 26 v8" stroke="${st}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : '';
  const cheekStripes = st ? `<path d="M30 56 l8 1 M31 62 l7 -1 M90 56 l-8 1 M89 62 l-7 -1" stroke="${st}" stroke-width="2.5" stroke-linecap="round"/>` : '';
  const ginger = k.ginger ? `<ellipse cx="44" cy="92" rx="10" ry="7" fill="${k.ginger}" opacity=".7"/><ellipse cx="80" cy="100" rx="9" ry="8" fill="${k.ginger}" opacity=".6"/><ellipse cx="72" cy="34" rx="8" ry="5" fill="${k.ginger}" opacity=".55"/>` : '';
  // tête : masque coloré + bande blanche (Loulou, Moezeh) ou tête tigrée avec museau clair (Doudou)
  const head = k.blaze
    ? `<ellipse cx="60" cy="52" rx="32" ry="28" fill="${k.face}"/>
       <path d="M28 54 Q27 24 60 24 Q93 24 92 54 Q88 64 82 66 Q76 60 67 47 L60 31 L53 47 Q44 60 38 66 Q31 63 28 54 Z" fill="${k.mask}"/>`
    : `<ellipse cx="60" cy="52" rx="32" ry="28" fill="${k.face}"/>
       <ellipse cx="60" cy="68" rx="15" ry="10" fill="${k.bib}"/>`;
  const collar = id === 'doudou' ? `<path d="M38 80 Q60 90 82 80" stroke="#ec4899" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="60" cy="88" r="4.5" fill="#facc15" stroke="#b45309" stroke-width="1.2"/>`
    : id === 'isis' ? `<path d="M38 80 Q60 90 82 80" stroke="#9ca3af" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="60" cy="88" r="4" fill="#e5e7eb" stroke="#6b7280" stroke-width="1"/>`
    : id === 'moezeh' ? `<path d="M38 80 Q60 90 82 80" stroke="#2563eb" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="55" y="84" width="10" height="9" rx="2" fill="#facc15" stroke="#b45309" stroke-width="1"/><text x="60" y="91.5" font-size="7" font-weight="700" text-anchor="middle" fill="#7c2d12" font-family="Arial">×</text>` : '';
  return `<svg viewBox="0 0 120 130" class="cat-svg" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="124" rx="38" ry="5" fill="rgba(0,0,0,.18)"/>
    <path class="tail" d="M88 112 q30 -6 22 -36" stroke="${k.fur}" stroke-width="10" fill="none" stroke-linecap="round"/>
    ${tailRings}
    <ellipse cx="60" cy="96" rx="32" ry="28" fill="${k.fur}"/>
    ${ginger}${bodyStripes}
    <ellipse cx="60" cy="104" rx="20" ry="21" fill="${k.bib}"/>
    <path d="M30 34 L36 8 L52 26 Z" fill="${k.mask}"/><path d="M90 34 L84 8 L68 26 Z" fill="${k.mask}"/>
    <path d="M35 30 L38 15 L47 26 Z" fill="#f2b3b3"/><path d="M85 30 L82 15 L73 26 Z" fill="#f2b3b3"/>
    ${head}
    ${foreheadM}${cheekStripes}
    ${eyes}
    <path d="M56 63 h8 l-4 5 z" fill="${k.nose}"/>
    <path d="M60 68 q-5 6 -10 2 M60 68 q5 6 10 2" stroke="#6b6b6b" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M20 62 h20 M20 69 l20 -3 M100 62 h-20 M100 69 l-20 -3" stroke="#9ca3af" stroke-width="1.4"/>
    <ellipse cx="44" cy="122" rx="10" ry="6" fill="${k.paw}"/><ellipse cx="76" cy="122" rx="10" ry="6" fill="${k.paw}"/>
    ${collar}
    ${extra}
  </svg>`;
};
Z.svg = (str, cls = '') => Z.h('div', { class: 'art ' + cls, html: str });

/* Bulle de Loulou qui parle (texte affiché + lu à voix haute) */
Z.loulouSays = function (text, { speak = true, mood, who } = {}) {
  if (speak) Z.speak(text);
  return Z.h('div', { class: 'loulou-says' },
    Z.svg(Z.art.cat({ mood, who: who || Z.narrator }), 'mini-cat'),
    Z.h('div', { class: 'bubble' }, Z.h('span', null, text), Z.ear(text)));
};

/* ---------- Portraits de la famille (dessinés d'après les photos) ---------- */
Z.art.face = function (id) {
  const skin = '#f3cdb0', skinD = '#e3b494';
  const base = (shirt, extraTop = '', hairBack = '', hairFront = '', eyes = '#4a2c1a', brows = '#3b2416', browW = 3) => `
  <svg viewBox="0 0 120 130" class="face-svg" xmlns="http://www.w3.org/2000/svg">
    ${hairBack}
    <path d="M14 130 Q16 100 44 96 L76 96 Q104 100 106 130 Z" fill="${shirt}"/>
    <rect x="50" y="80" width="20" height="20" rx="6" fill="${skinD}"/>
    <ellipse cx="33" cy="60" rx="6" ry="9" fill="${skinD}"/><ellipse cx="87" cy="60" rx="6" ry="9" fill="${skinD}"/>
    <ellipse cx="60" cy="56" rx="26" ry="31" fill="${skin}"/>
    <ellipse cx="50" cy="59" rx="3.4" ry="4" fill="${eyes}"/><ellipse cx="70" cy="59" rx="3.4" ry="4" fill="${eyes}"/>
    <circle cx="51.2" cy="57.6" r="1.2" fill="#fff"/><circle cx="71.2" cy="57.6" r="1.2" fill="#fff"/>
    <path d="M43 50 q7 -4 13 -1 M64 49 q6 -3 13 1" stroke="${brows}" stroke-width="${browW}" fill="none" stroke-linecap="round"/>
    <path d="M60 60 q-3 9 1 11" stroke="${skinD}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M51 76 q9 6 18 0" stroke="#a0453a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <circle cx="45" cy="70" r="4" fill="#f4a7a0" opacity=".45"/><circle cx="75" cy="70" r="4" fill="#f4a7a0" opacity=".45"/>
    ${hairFront}
    ${extraTop}
  </svg>`;

  if (id === 'charlie') {
    // cheveux plaqués en arrière avec chignon, lunettes rondes dorées, barbe courte, débardeur blanc, chaîne
    const hairBack = `<circle cx="60" cy="14" r="9" fill="#4a3426"/>`;
    const hairFront = `<path d="M34 50 Q32 20 60 20 Q88 20 86 50 Q82 34 60 32 Q38 34 34 50 Z" fill="#4a3426"/>
      <path d="M44 28 q16 -6 32 0" stroke="#6b4c36" stroke-width="1.5" fill="none"/>`;
    const beard = `<path d="M35 64 Q38 90 60 90 Q82 90 85 64 Q80 82 60 83 Q40 82 35 64 Z" fill="#7a5a3f" opacity=".55"/>
      <path d="M50 72 q10 -3 20 0" stroke="#7a5a3f" stroke-width="3" opacity=".6" fill="none" stroke-linecap="round"/>`;
    const glasses = `<circle cx="49" cy="59" r="8.5" fill="rgba(255,255,255,.15)" stroke="#c9a54a" stroke-width="1.8"/>
      <circle cx="71" cy="59" r="8.5" fill="rgba(255,255,255,.15)" stroke="#c9a54a" stroke-width="1.8"/>
      <path d="M57.5 58 q2.5 -2 5 0 M40.5 57 L33 55 M79.5 57 L87 55" stroke="#c9a54a" stroke-width="1.6" fill="none"/>`;
    const shirt = `<path d="M30 130 L36 102 Q60 112 84 102 L90 130 Z" fill="#f5f0e6"/>`;
    const chain = `<path d="M46 98 Q60 116 74 98" stroke="#c0c4c8" stroke-width="2.4" fill="none" stroke-dasharray="2 1.5"/>
      <rect x="28" y="62" width="4" height="8" rx="2" fill="#fff" stroke="#d1d5db"/>`;
    return base(skin, beard + glasses + shirt + chain, hairBack, hairFront, '#5a3d2a', '#4a3426', 2.6);
  }
  if (id === 'gabriel') {
    // grosses boucles foncées avec mèches cuivrées, sourcils épais, boucle d'oreille, t-shirt noir à éclair rouge
    let curls = '';
    const pts = [[34, 40], [40, 28], [50, 20], [62, 17], [74, 21], [84, 30], [88, 42], [30, 54], [90, 56], [44, 34], [58, 28], [72, 30], [32, 68], [88, 70]];
    pts.forEach(([x, y], i) => { curls += `<circle cx="${x}" cy="${y}" r="${i > 11 ? 7 : 11}" fill="#2e2522"/>`; });
    const copper = `<path d="M30 40 q6 -14 16 -14 q4 -10 16 -8" stroke="#b5532c" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M64 20 q12 -2 18 8 q8 2 9 12" stroke="#c4622f" stroke-width="6" fill="none" stroke-linecap="round"/>
      `;
    const fringe = `<path d="M36 50 Q38 34 60 34 Q82 34 84 50 Q76 40 60 42 Q44 40 36 50 Z" fill="#2e2522"/>`;
    const extra = `<circle cx="88" cy="66" r="1.8" fill="#e5e7eb" stroke="#9ca3af" stroke-width=".6"/>
      <path d="M52 112 l8 -9 l-2 7 l8 -1 l-9 11 l2 -7 z" fill="#ef4444"/>
      <circle cx="36" cy="118" r="2" fill="#ef4444"/><circle cx="84" cy="114" r="2" fill="#fff"/><circle cx="90" cy="122" r="1.5" fill="#fff"/>`;
    return base('#151515', extra, curls, fringe + copper, '#3b2416', '#2e2522', 4);
  }
  if (id === 'cecile') {
    // Maman : longs cheveux châtains ondulés avec reflets clairs, yeux marron, tunique blanche brodée terracotta
    const hairBack = `<path d="M30 50 Q24 18 60 16 Q96 18 92 52 Q98 80 96 104 Q90 116 80 112 Q86 90 80 70 L40 70 Q34 90 40 112 Q28 116 24 104 Q22 80 30 50 Z" fill="#5b3a24"/>
      <path d="M28 70 q-4 18 4 34 M92 70 q4 18 -4 34" stroke="#9a7148" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    const hairFront = `<path d="M34 52 Q30 22 62 20 Q90 22 86 50 Q80 34 64 32 Q50 36 40 46 Q37 50 34 52 Z" fill="#5b3a24"/>
      <path d="M44 30 q12 -8 30 -4 M40 38 q8 -8 16 -8" stroke="#a37a4f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M29 46 Q25 66 32 86 L38 84 Q33 66 37 48 Z" fill="#5b3a24"/><path d="M91 46 Q95 66 88 86 L82 84 Q87 66 83 48 Z" fill="#5b3a24"/>`;
    const tunic = `<path d="M48 97 L60 118 L72 97" fill="#f3cdb0"/>
      <path d="M46 96 L60 120 L74 96" stroke="#b5643c" stroke-width="3" fill="none"/>
      <path d="M42 97 L60 126 L78 97" stroke="#b5643c" stroke-width="1.6" fill="none" stroke-dasharray="3 2"/>
      <path d="M24 124 q6 -8 12 -2 M88 120 q6 -6 10 2" stroke="#b5643c" stroke-width="2" fill="none"/>
      <circle cx="33" cy="70" r="1.6" fill="#7c4a2d"/>`;
    return base('#f7f2e8', tunic, hairBack, hairFront, '#4a2c1a', '#5b3a24', 2.4);
  }
  // Jasmin (Zouzou) : cheveux châtain foncé avec frange sur le côté, yeux marron, maillot n°10
  const hair = `<path d="M33 54 Q30 22 60 22 Q90 22 87 54 Q84 40 72 38 Q58 44 40 40 Q35 46 33 54 Z" fill="#3b2416"/>
    <path d="M48 32 q14 10 34 4" stroke="#2a180d" stroke-width="2" fill="none"/>`;
  const num = `<text x="60" y="124" font-size="18" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial">10</text>`;
  return base('#1d4ed8', num, '', hair, '#4a2c1a', '#3b2416', 2.8);
};

/* Un membre de la famille qui encourage (bulle + voix) */
Z.familySays = function (id, text, { speak = true } = {}) {
  if (speak) Z.speak(text, { pitch: 0.95 });
  return Z.h('div', { class: 'loulou-says' },
    Z.svg(Z.art.face(id), 'mini-cat'),
    Z.h('div', { class: 'bubble' }, Z.h('span', null, text), Z.ear(text)));
};
