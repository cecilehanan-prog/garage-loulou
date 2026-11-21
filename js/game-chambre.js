/* =========================================================
   JEU 5 — MA CHAMBRE (avec Loulou)
   ---------------------------------------------------------
   • Aménager : la vraie chambre de Jasmin vue du dessus. Il déplace
     ses meubles (lit clic-clac qui s'ouvre et se ferme, bureau, chaise,
     lampe, 2 étagères, tapis de jeux, descente de lit). Le placard mural,
     la fenêtre et la porte sont fixes, comme chez lui (chambre carrée).
   • Ranger le bazar : chaque objet par terre va à sa place.
   • Plier le linge (niveau 2) et Mon armoire rangée (niveau 3).
   • Chaque rangement rapporte des étoiles ⭐ : elles débloquent des
     jouets et des décos pour la chambre (plus il range, plus il gagne).
   • Défi « vraie chambre » : il range sa vraie chambre, Maman valide.
   ========================================================= */
(function () {
  const h = Z.h;
  /* Chambre CARRÉE (demande de Maman) : fenêtre au centre du mur du haut,
     porte en bas à gauche, placard mural intégré au mur en bas à droite (2 portes battantes) */
  const W = 340, H = 370;                 // plan de la chambre (unités SVG)
  const IN = { x0: 14, y0: 14, x1: 326, y1: 326 };
  const PLAN = 2;                         // version du plan (remet les meubles en place si le plan change)

  /* ---------- Les meubles (vue du dessus) ---------- */
  const FURN = {
    clicclac: { name: 'Lit clic-clac', w: 104, h: 64, hc: 38 },
    bureau: { name: 'Bureau', w: 84, h: 42 },
    chaise: { name: 'Chaise', w: 30, h: 30 },
    lampe: { name: 'Lampe de bureau', w: 20, h: 20 },
    etagere1: { name: 'Étagère', w: 72, h: 18 },
    etagere2: { name: 'Étagère', w: 72, h: 18 },
    tapis: { name: 'Tapis de jeux', w: 112, h: 84, rug: true },
    descente: { name: 'Descente de lit', w: 64, h: 26, rug: true }
  };
  const START = {
    clicclac: { x: 214, y: 22, r: 0, open: true },
    descente: { x: 234, y: 92, r: 0 },
    etagere1: { x: 22, y: 18, r: 0 },
    bureau: { x: 20, y: 44, r: 0 },
    lampe: { x: 78, y: 50, r: 0 },
    chaise: { x: 47, y: 92, r: 180 },
    tapis: { x: 116, y: 150, r: 0 },
    etagere2: { x: 104, y: 304, r: 180 }
  };

  /* ---------- Jouets et décos débloqués avec les étoiles ⭐ ---------- */
  const DECO = [
    { id: 'ballon', e: '⚽', name: 'Ballon de foot', seuil: 1 },
    { id: 'peluche', e: '🧸', name: 'Peluche', seuil: 2 },
    { id: 'plante', e: '🪴', name: 'Plante verte', seuil: 3 },
    { id: 'dino', e: '🦖', name: 'Dinosaure', seuil: 5 },
    { id: 'f1', e: '🏎️', name: 'Voiture de F1', seuil: 7 },
    { id: 'lego', e: '🧱', name: 'Boîte de briques', seuil: 9 },
    { id: 'manette', e: '🎮', name: 'Console de jeux', seuil: 11 },
    { id: 'basket', e: '🏀', name: 'Panier de basket', seuil: 13 },
    { id: 'guirlande', e: '✨', name: 'Guirlande lumineuse', seuil: 15 },
    { id: 'trophee', e: '🏆', name: 'Trophée', seuil: 18 },
    { id: 'aquarium', e: '🐠', name: 'Aquarium', seuil: 21 },
    { id: 'fusee', e: '🚀', name: 'Fusée', seuil: 24 },
    { id: 'casque', e: '⛑️', name: 'Casque de trottinette', seuil: 27 },
    { id: 'globe', e: '🌍', name: 'Globe terrestre', seuil: 30 },
    { id: 'telescope', e: '🔭', name: 'Télescope', seuil: 34 },
    { id: 'coupe', e: '🥇', name: 'Médaille d’or', seuil: 38 },
    { id: 'vr', e: '🥽', name: 'Casque de réalité virtuelle', seuil: 42 }
  ];

  /* ---------- Les activités, débloquées par niveau ---------- */
  const ACTS = [
    { id: 'amenager', ico: '🛋️', name: 'Aménager ma chambre', sub: 'Déplace tes meubles et tes jouets', lvl: 1 },
    { id: 'ranger', ico: '🧹', name: 'Ranger le bazar', sub: 'Chaque objet à sa place', lvl: 1 },
    { id: 'linge', ico: '👕', name: 'Plier mon linge', sub: 'T-shirt, pantalon, pull, chaussettes', lvl: 2 },
    { id: 'armoire', ico: '🚪', name: 'Mon armoire rangée', sub: 'Chaque vêtement sur sa bonne étagère', lvl: 3 }
  ];
  Z.chambreNews = (lvl) => ACTS.filter(a => a.lvl === lvl && lvl > 1).map(a => a.name);
  const LIMITE = { ranger: 3, linge: 2, armoire: 2 };   // étoiles gagnées par jour et par activité

  function ch() {
    const st = Z.state;
    st.chambre = st.chambre || {};
    const c = st.chambre;
    if (!c.meubles || c.plan !== PLAN) { c.meubles = JSON.parse(JSON.stringify(START)); c.plan = PLAN; c.deco = {}; }
    c.deco = c.deco || {};
    c.etoiles = c.etoiles || 0;
    if (!c.jour || c.jour.date !== Z.today()) c.jour = { date: Z.today(), ranger: 0, linge: 0, armoire: 0, vrai: false };
    return c;
  }
  const unlocked = () => DECO.filter(d => d.seuil <= ch().etoiles);
  const nextDeco = () => DECO.find(d => d.seuil > ch().etoiles);
  Z.chambreBadge = () => { const c = ch(); return c.jour.vrai ? '⭐ ' + c.etoiles : '🧹 à ranger'; };

  /* gagne une étoile (avec limite par jour) et annonce les nouveaux jouets */
  function gagne(act, n = 1) {
    const c = ch();
    if (act !== 'vrai' && c.jour[act] >= LIMITE[act]) return { got: 0, news: [] };
    const before = unlocked().length;
    c.etoiles += n;
    if (act === 'vrai') c.jour.vrai = true; else c.jour[act]++;
    Z.save();
    return { got: n, news: unlocked().slice(before) };
  }
  function fin(shell, act, title, lines, eclairs) {
    const r = gagne(act);
    const extra = [];
    if (r.got) extra.push(`+ ${r.got} ⭐ de rangement (tu en as ${ch().etoiles})`);
    else extra.push('Tu as déjà gagné tes étoiles pour ça aujourd’hui. Reviens demain !');
    r.news.forEach(d => extra.push(`🎁 Nouveau dans ta chambre : ${d.e} ${d.name} !`));
    const nx = nextDeco(); if (nx) extra.push(`Prochain cadeau : ${nx.e} à ${nx.seuil} ⭐`);
    Z.endScreen(shell, { medal: r.news.length ? '🎁' : '⭐', title, eclairs, xp: eclairs + 4, lines: lines.concat(extra), kind: 'chambre', detail: act, again: () => Z.go('chambre'), againLabel: '🏠 Ma chambre' });
    if (r.news.length) setTimeout(() => Z.speak(`Super ! Tu as débloqué : ${r.news.map(d => d.name).join(', ')}. Va le mettre dans ta chambre !`), 4200);
  }

  /* ---------- Dessins ---------- */
  function furnSvg(id, m) {
    const f = FURN[id];
    if (id === 'clicclac') {
      if (m.open) return `<rect width="104" height="64" rx="6" fill="#3b82f6"/><rect x="4" y="4" width="96" height="56" rx="5" fill="#e0f2fe"/>
        <rect x="8" y="8" width="26" height="48" rx="6" fill="#fff" stroke="#bfdbfe" stroke-width="2"/>
        <rect x="40" y="6" width="60" height="52" rx="5" fill="#2563eb"/><path d="M44 16 h52 M44 30 h52 M44 44 h52" stroke="#60a5fa" stroke-width="3"/>
        <text x="70" y="38" font-size="13" text-anchor="middle">🛴</text>`;
      return `<rect width="104" height="38" rx="6" fill="#1e40af"/><rect x="4" y="4" width="96" height="12" rx="4" fill="#3b82f6"/>
        <rect x="6" y="18" width="45" height="16" rx="4" fill="#60a5fa"/><rect x="53" y="18" width="45" height="16" rx="4" fill="#60a5fa"/>`;
    }
    if (id === 'bureau') return `<rect width="84" height="42" rx="3" fill="#b07a45"/><rect x="3" y="3" width="78" height="36" rx="2" fill="#c98f55"/>
      <rect x="30" y="8" width="26" height="17" rx="2" fill="#334155"/><rect x="33" y="10" width="20" height="12" fill="#93c5fd"/><rect x="10" y="26" width="16" height="10" fill="#fff" transform="rotate(-8 18 31)"/>`;
    if (id === 'chaise') return `<rect x="3" y="3" width="24" height="24" rx="6" fill="#ef4444"/><rect x="3" y="24" width="24" height="6" rx="3" fill="#991b1b"/>`;
    if (id === 'lampe') return `<circle cx="10" cy="10" r="9" fill="#fde047" opacity=".45"/><circle cx="10" cy="10" r="6" fill="#facc15" stroke="#a16207" stroke-width="1.5"/><circle cx="10" cy="10" r="2" fill="#fff"/>`;
    if (id === 'etagere1' || id === 'etagere2') return `<rect width="72" height="18" rx="2" fill="#8b5a2b"/>` +
      ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#f97316', '#0ea5e9'].map((c, i) => `<rect x="${4 + i * 9}" y="3" width="7" height="12" rx="1" fill="${c}"/>`).join('') + `<text x="66" y="14" font-size="10" text-anchor="middle">🦖</text>`;
    if (id === 'tapis') return `<rect width="112" height="84" rx="8" fill="#86efac"/><rect x="4" y="4" width="104" height="76" rx="6" fill="#4ade80"/>
      <path d="M14 20 H98 V64 H14 Z M56 20 V64" stroke="#475569" stroke-width="8" fill="none"/><path d="M14 20 H98 V64 H14 Z M56 20 V64" stroke="#fde047" stroke-width="1.5" stroke-dasharray="4 4" fill="none"/>
      <rect x="22" y="30" width="22" height="16" rx="2" fill="#f97316"/><rect x="68" y="36" width="20" height="16" rx="2" fill="#60a5fa"/><circle cx="34" cy="56" r="4" fill="#ef4444"/>`;
    if (id === 'descente') return `<rect width="64" height="26" rx="12" fill="#c4b5fd"/><rect x="4" y="4" width="56" height="18" rx="9" fill="#ddd6fe"/>` +
      Array.from({ length: 6 }, (_, i) => `<path d="M${8 + i * 10} 0 v-3 M${8 + i * 10} 26 v3" stroke="#a78bfa" stroke-width="2"/>`).join('');
    return '';
  }
  /* murs, fenêtre, porte, placard mural (fixes) */
  const roomBase = () => {
    const { x0, y0, x1, y1 } = IN;
    return `
    <rect x="0" y="0" width="${W}" height="${y1 + 14}" fill="#7c6a58"/>
    <rect x="196" y="${y1}" width="136" height="38" rx="2" fill="#7c6a58"/>
    <rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="#e7cfa6"/>
    ${Array.from({ length: 12 }, (_, i) => `<path d="M${x0} ${y0 + 12 + i * 26} H${x1}" stroke="#d6b98a" stroke-width="1.2"/>`).join('')}
    <!-- fenêtre au centre du mur du haut -->
    <rect x="${W / 2 - 40}" y="2" width="80" height="12" fill="#bae6fd" stroke="#e0f2fe" stroke-width="2"/><path d="M${W / 2} 2 v12" stroke="#fff" stroke-width="2"/>
    <text x="${W / 2}" y="26" font-size="9" text-anchor="middle" fill="#57534e">fenêtre</text>
    <!-- porte en bas à gauche -->
    <rect x="${x0 + 6}" y="${y1}" width="58" height="14" fill="#e7cfa6"/>
    <path d="M${x0 + 64} ${y1} A58 58 0 0 0 ${x0 + 6} ${y1 - 58}" stroke="#a8a29e" stroke-width="1.5" stroke-dasharray="3 3" fill="none"/>
    <path d="M${x0 + 6} ${y1} V${y1 - 58}" stroke="#8b6b45" stroke-width="4" stroke-linecap="round"/>
    <text x="${x0 + 38}" y="${y1 - 6}" font-size="9" text-anchor="middle" fill="#57534e">porte</text>
    <!-- placard mural intégré dans le mur, en bas à droite, 2 portes battantes -->
    <rect x="204" y="${y1}" width="120" height="30" fill="#d4b483"/>
    <path d="M206 ${y1 + 1} H322" stroke="#8b6b45" stroke-width="3"/>
    <path d="M264 ${y1 - 1} V${y1 + 3}" stroke="#5b4630" stroke-width="2"/>
    <path d="M264 ${y1} A58 58 0 0 0 206 ${y1 - 58} M264 ${y1} A58 58 0 0 1 322 ${y1 - 58}" stroke="#a8a29e" stroke-width="1.2" stroke-dasharray="3 3" fill="none"/>
    <circle cx="258" cy="${y1 + 6}" r="2" fill="#5b4630"/><circle cx="270" cy="${y1 + 6}" r="2" fill="#5b4630"/>
    <text x="264" y="${y1 + 22}" font-size="9" text-anchor="middle" fill="#5b4630">placard mural</text>`;
  };
  const furnBox = (id, m) => { const f = FURN[id]; return { w: f.w, h: id === 'clicclac' && !m.open ? f.hc : f.h }; };
  const placeG = (id, m, inner, cls = '') => {
    const b = furnBox(id, m);
    return `<g class="piece ${cls}" data-id="${id}" transform="translate(${m.x} ${m.y}) rotate(${m.r || 0} ${b.w / 2} ${b.h / 2})">${inner}</g>`;
  };
  function roomSvg({ sel, mess = [] } = {}) {
    const c = ch();
    const ids = Object.keys(FURN).sort((a, b) => (FURN[b].rug ? 1 : 0) - (FURN[a].rug ? 1 : 0) || (a === 'lampe' ? 1 : b === 'lampe' ? -1 : 0));
    const furn = ids.map(id => placeG(id, c.meubles[id], furnSvg(id, c.meubles[id]), id === sel ? 'sel' : '')).join('');
    const deco = Object.entries(c.deco).map(([id, p]) => { const d = DECO.find(x => x.id === id); return d ? `<g class="piece deco ${id === sel ? 'sel' : ''}" data-id="${id}" transform="translate(${p.x} ${p.y})"><rect width="30" height="30" fill="transparent"/><text x="15" y="23" font-size="22" text-anchor="middle">${d.e}</text></g>` : ''; }).join('');
    const messG = mess.map(m => m.done ? '' : `<g class="bazar" data-k="${m.k}" transform="translate(${m.x} ${m.y}) rotate(${m.rot})"><circle cx="15" cy="15" r="17" fill="#fff" opacity=".55"/><text x="15" y="24" font-size="24" text-anchor="middle">${m.e}</text></g>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" class="chambre-svg" xmlns="http://www.w3.org/2000/svg">${roomBase()}${furn}${deco}${messG}</svg>`;
  }

  /* ---------- MENU ---------- */
  Z.screens.chambre = function (mode) {
    if (mode) return ({ amenager, ranger, linge, armoire })[mode]();
    const c = ch(), lvl = Z.levelInfo().lvl;
    const shell = Z.shell({ title: 'Ma chambre' });
    shell.setSteps(0, 0);
    const nx = nextDeco();
    const t = c.etoiles === 0 && !c.vu
      ? `Bienvenue dans ta chambre, ${Z.state.name} ! Ici, tu peux déplacer tes meubles comme tu veux. Et chaque fois que tu ranges, tu gagnes des étoiles. Avec les étoiles, tu débloques des jouets et des décos !`
      : `Ta chambre ! Tu as ${c.etoiles} étoiles de rangement.${nx ? ` Encore ${nx.seuil - c.etoiles} pour débloquer : ${nx.name} !` : ' Tu as tout débloqué, bravo !'}`;
    c.vu = true; Z.save();
    shell.root.append(
      h('h2', null, '🛏️ Ma chambre'),
      Z.loulouSays(t, { who: 'loulou' }),
      h('div', { class: 'card center etoiles' }, h('b', null, `⭐ ${c.etoiles} étoiles de rangement`),
        nx ? h('div', { class: 'hint' }, `Prochain cadeau : ${nx.e} ${nx.name} à ${nx.seuil} ⭐`) : h('div', { class: 'hint' }, 'Tout est débloqué ! 🏆'),
        h('div', { class: 'jauge' }, h('i', { style: { width: (nx ? Math.min(100, Math.round(c.etoiles / nx.seuil * 100)) : 100) + '%' } }))),
      Z.svg(roomSvg(), 'chambre-mini'),
      ...ACTS.map(a => {
        const locked = lvl < a.lvl;
        const left = LIMITE[a.id] ? LIMITE[a.id] - c.jour[a.id] : null;
        return h('button', { class: 'devoir' + (locked ? ' lock' : ''), onclick: () => {
          if (locked) { Z.sfx.bad(); const m = `${a.name} se débloque au niveau ${a.lvl}. Continue à jouer pour monter de niveau !`; Z.pop('🔒 Niveau ' + a.lvl, 'soft'); Z.speak(m); return; }
          Z.sfx.vroum(); Z.go('chambre', a.id);
        } },
          h('span', { class: 'd-ico' }, locked ? '🔒' : a.ico),
          h('span', { class: 'grow' }, a.name, h('small', null, locked ? `Se débloque au niveau ${a.lvl}` : a.sub + (left !== null ? ` · ${left > 0 ? `${left} ⭐ à gagner aujourd’hui` : 'étoiles du jour gagnées ✅'}` : ''))),
          h('span', { class: 'd-go' }, locked ? '' : '▶'));
      }),
      vraieChambre(c));
  };

  /* Défi dans la vraie vie : Maman valide avec un appui long */
  function vraieChambre(c) {
    if (c.jour.vrai) return h('div', { class: 'card center vrai ok' }, '✅ Ta vraie chambre est rangée aujourd’hui. Bravo !');
    const btn = h('button', { class: 'btn gold wide',
      onpointerdown: (e) => { const b = e.currentTarget; b.classList.add('appui'); b._t = setTimeout(() => {
        b.classList.remove('appui'); const r = gagne('vrai', 3); Z.sfx.win(); Z.confetti(160);
        Z.finishGame('chambre', 10, 10, 'vraie chambre');
        const t = `Bravo ! Ta vraie chambre est rangée ! Tu gagnes 3 étoiles et 10 éclairs !${r.news.length ? ' Et tu débloques : ' + r.news.map(d => d.name).join(', ') + ' !' : ''}`;
        Z.speak(t); Z.pop('+3 ⭐', 'gold'); setTimeout(() => Z.go('chambre'), 2500);
      }, 1500); },
      onpointerup: (e) => { clearTimeout(e.currentTarget._t); e.currentTarget.classList.remove('appui'); },
      onpointerleave: (e) => { clearTimeout(e.currentTarget._t); e.currentTarget.classList.remove('appui'); }
    }, '👩 Maman valide (appui long)');
    return h('div', { class: 'card col vrai' },
      h('div', { style: { fontWeight: 700 } }, '🏠 Défi de la vraie chambre : + 3 ⭐'),
      h('div', null, 'Range ta VRAIE chambre : linge sale au panier, jouets rangés, lit fait. Puis montre-la à Maman !'),
      btn);
  }

  /* ---------- AMÉNAGER ---------- */
  function amenager() {
    const c = ch();
    const shell = Z.shell({ title: 'Aménager' });
    shell.setSteps(0, 0);
    let sel = null;
    const stage = h('div', { class: 'chambre-stage' });
    const tools = h('div', { class: 'row tools' });
    const draw = () => {
      stage.innerHTML = roomSvg({ sel });
      const svg = stage.querySelector('svg');
      svg.querySelectorAll('.piece').forEach(g => g.addEventListener('pointerdown', (e) => startDrag(e, g.dataset.id, svg)));
      drawTools();
    };
    const pos = (id) => FURN[id] ? c.meubles[id] : c.deco[id];
    const size = (id) => FURN[id] ? furnBox(id, c.meubles[id]) : { w: 30, h: 30 };
    const clamp = (id) => {
      const p = pos(id), b = size(id), rot = (p.r || 0) % 180 !== 0;
      const w = rot ? b.h : b.w, hh = rot ? b.w : b.h, dx = rot ? (b.w - b.h) / 2 : 0, dy = rot ? (b.h - b.w) / 2 : 0;
      p.x = Math.max(IN.x0 - dx, Math.min(IN.x1 - w - dx, p.x));
      p.y = Math.max(IN.y0 - dy, Math.min(IN.y1 - hh - dy, p.y));
    };
    function startDrag(e, id, svg) {
      e.preventDefault();
      sel = id;
      const pt = svg.createSVGPoint();
      const toSvg = (ev) => { pt.x = ev.clientX; pt.y = ev.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()); };
      const p0 = toSvg(e), m = pos(id), start = { x: m.x, y: m.y };
      let moved = false;
      const g = svg.querySelector(`.piece[data-id="${id}"]`);
      svg.querySelectorAll('.piece.sel').forEach(x => x.classList.remove('sel')); g.classList.add('sel');
      const move = (ev) => {
        const p = toSvg(ev); m.x = start.x + p.x - p0.x; m.y = start.y + p.y - p0.y; clamp(id); moved = true;
        const b = size(id);
        g.setAttribute('transform', FURN[id] ? `translate(${m.x} ${m.y}) rotate(${m.r || 0} ${b.w / 2} ${b.h / 2})` : `translate(${m.x} ${m.y})`);
      };
      const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); if (moved) Z.sfx.click(); Z.save(); draw(); };
      window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
    }
    function drawTools() {
      tools.innerHTML = '';
      if (!sel) { tools.append(h('div', { class: 'hint grow center' }, '👆 Fais glisser un meuble avec ton doigt.')); return; }
      const name = FURN[sel] ? FURN[sel].name : DECO.find(d => d.id === sel).name;
      tools.append(h('b', { class: 'grow' }, name));
      tools.append(h('button', { class: 'btn ghost', onclick: () => { Z.sfx.tap(); const p = pos(sel); if (FURN[sel]) { p.r = ((p.r || 0) + 90) % 360; } clamp(sel); Z.save(); draw(); } }, FURN[sel] ? '🔄 Tourner' : ''));
      if (sel === 'clicclac') tools.append(h('button', { class: 'btn ghost', onclick: () => {
        const p = c.meubles.clicclac; p.open = !p.open; Z.sfx.click(); clamp(sel); Z.save(); draw();
        Z.speak(p.open ? 'Clic-clac ! Le canapé devient un lit.' : 'Clic-clac ! Le lit devient un canapé.');
      } }, c.meubles.clicclac.open ? '🛋️ Fermer' : '🛏️ Ouvrir'));
      if (!FURN[sel]) tools.append(h('button', { class: 'btn ghost', onclick: () => { delete c.deco[sel]; sel = null; Z.save(); draw(); drawInv(); } }, '📦 Ranger'));
    }
    const inv = h('div', { class: 'inv' });
    function drawInv() {
      inv.innerHTML = '';
      DECO.forEach(d => {
        const ok = d.seuil <= c.etoiles, placed = !!c.deco[d.id];
        inv.append(h('button', { class: 'inv-it' + (ok ? '' : ' lock') + (placed ? ' placed' : ''), title: d.name, onclick: () => {
          if (!ok) { Z.sfx.bad(); const m = `${d.name} : il faut ${d.seuil} étoiles. Range ta chambre pour en gagner !`; Z.pop(`🔒 ${d.seuil} ⭐`, 'soft'); Z.speak(m); return; }
          Z.sfx.tap();
          if (!placed) { c.deco[d.id] = { x: 150 + Z.rand(40), y: 150 + Z.rand(40) }; Z.save(); }
          sel = d.id; draw(); drawInv();
        } }, h('span', null, ok ? d.e : '🔒'), h('small', null, ok ? d.name : `${d.seuil} ⭐`)));
      });
    }
    const t = 'Voici ta chambre vue du dessus. Fais glisser tes meubles où tu veux ! Touche le lit clic-clac pour l’ouvrir ou le fermer. En bas, tes jouets et tes décos : plus tu ranges, plus tu en débloques.';
    shell.root.append(h('h2', null, '🛋️ Aménager ma chambre'), Z.loulouSays(t, { who: 'loulou' }), stage, tools,
      h('h3', { class: 'inv-t' }, `🎁 Mes jouets et décos (⭐ ${c.etoiles})`), inv,
      h('button', { class: 'btn ghost wide small-btn', onclick: () => { if (confirm('Remettre les meubles comme au début ?')) { c.meubles = JSON.parse(JSON.stringify(START)); Z.save(); sel = null; draw(); } } }, '↩️ Remettre comme au début'),
      h('button', { class: 'btn green wide', onclick: () => { Z.sfx.tap(); Z.go('chambre'); } }, '✅ C’est parfait !'));
    draw(); drawInv();
  }

  /* ---------- RANGER LE BAZAR ---------- */
  const PLACES = {
    panier: { ico: '🧺', name: 'Panier à linge' },
    placard: { ico: '🚪', name: 'Placard' },
    etagere: { ico: '📚', name: 'Étagère' },
    coffre: { ico: '🧸', name: 'Coffre à jouets' },
    bureau: { ico: '✏️', name: 'Bureau' },
    entree: { ico: '👟', name: 'Entrée' },
    cuisine: { ico: '🍽️', name: 'Cuisine' },
    poubelle: { ico: '🗑️', name: 'Poubelle' }
  };
  const BAZAR = [
    { k: 'tshirt', e: '👕', name: 'le t-shirt sale', to: 'panier', why: 'Un t-shirt sale, ça va dans le panier à linge.' },
    { k: 'chaussettes', e: '🧦', name: 'les chaussettes sales', to: 'panier', why: 'Les chaussettes sales vont dans le panier à linge.' },
    { k: 'short', e: '🩳', name: 'le short sale', to: 'panier', why: 'Le linge sale va dans le panier à linge.' },
    { k: 'pull', e: '🧥', name: 'le pull propre', to: 'placard', why: 'Un vêtement propre se range dans le placard.' },
    { k: 'pyjama', e: '👖', name: 'le pantalon propre', to: 'placard', why: 'Un pantalon propre se range dans le placard.' },
    { k: 'livre', e: '📕', name: 'le livre', to: 'etagere', why: 'Les livres vont sur l’étagère.' },
    { k: 'bd', e: '📘', name: 'la BD', to: 'etagere', why: 'Les BD vont sur l’étagère, avec les livres.' },
    { k: 'ballon', e: '⚽', name: 'le ballon', to: 'coffre', why: 'Le ballon va dans le coffre à jouets.' },
    { k: 'voiture', e: '🚗', name: 'la petite voiture', to: 'coffre', why: 'Les petites voitures vont dans le coffre à jouets.' },
    { k: 'dino', e: '🦕', name: 'le dinosaure', to: 'coffre', why: 'Les jouets vont dans le coffre à jouets.' },
    { k: 'cartes', e: '🃏', name: 'les cartes', to: 'coffre', why: 'Les cartes vont dans le coffre à jouets, dans leur boîte.' },
    { k: 'crayons', e: '✏️', name: 'les crayons', to: 'bureau', why: 'Les crayons vont sur le bureau, dans la trousse.' },
    { k: 'cartable', e: '🎒', name: 'le cartable', to: 'bureau', why: 'Le cartable se range près du bureau, prêt pour demain.' },
    { k: 'cahier', e: '📓', name: 'le cahier', to: 'bureau', why: 'Le cahier retourne sur le bureau, ou dans le cartable.' },
    { k: 'baskets', e: '👟', name: 'les baskets', to: 'entree', why: 'Les chaussures se rangent à l’entrée.' },
    { k: 'casque', e: '⛑️', name: 'le casque de trottinette', to: 'entree', why: 'Le casque de trottinette se range à l’entrée, avec la trottinette.' },
    { k: 'assiette', e: '🍽️', name: 'l’assiette du goûter', to: 'cuisine', why: 'L’assiette retourne à la cuisine.' },
    { k: 'verre', e: '🥛', name: 'le verre', to: 'cuisine', why: 'Le verre retourne à la cuisine.' },
    { k: 'papier', e: '🧻', name: 'le mouchoir usagé', to: 'poubelle', why: 'Un mouchoir usagé va à la poubelle.' },
    { k: 'emballage', e: '🍬', name: 'le papier de bonbon', to: 'poubelle', why: 'Les papiers de bonbons vont à la poubelle.' }
  ];
  function ranger() {
    const c = ch();
    const shell = Z.shell({ title: 'Ranger' });
    const nb = [6, 8, 10][Z.pal()];
    const mess = Z.shuffle(BAZAR).slice(0, nb).map(m => Object.assign({}, m, { x: IN.x0 + 20 + Z.rand(IN.x1 - IN.x0 - 70), y: IN.y0 + 30 + Z.rand(IN.y1 - IN.y0 - 100), rot: Z.rand(40) - 20 }));
    let cur = null, done = 0, errors = 0, tries = 0;
    const stage = h('div', { class: 'chambre-stage' });
    const info = h('div', { class: 'card center info-bazar' });
    const tip = h('div', { class: 'tip', style: { display: 'none' } });
    const places = [...new Set(mess.map(m => m.to))].concat(Object.keys(PLACES)).filter((v, i, a) => a.indexOf(v) === i).slice(0, 8);
    const btns = h('div', { class: 'places' }, Object.keys(PLACES).filter(p => places.includes(p)).map(p => {
      const b = h('button', { class: 'place', onclick: () => put(p, b) }, h('span', null, PLACES[p].ico), PLACES[p].name);
      b.dataset.p = p; return b;
    }));
    const draw = () => {
      stage.innerHTML = roomSvg({ mess });
      stage.querySelectorAll('.bazar').forEach(g => {
        if (cur && g.dataset.k === cur.k) g.classList.add('sel');
        g.addEventListener('pointerdown', () => pick(mess.find(m => m.k === g.dataset.k)));
      });
      info.innerHTML = '';
      info.append(cur ? h('div', null, h('span', { class: 'big-e' }, cur.e), h('b', null, ' Où va ' + cur.name + ' ?')) : h('div', null, `👆 Touche un objet par terre (${nb - done} à ranger)`));
    };
    const pick = (m) => { if (!m || m.done) return; Z.sfx.tap(); cur = m; tries = 0; tip.style.display = 'none'; [...btns.children].forEach(b => b.classList.remove('hint-good', 'bad')); draw(); Z.speak(`Où va ${m.name} ?`); };
    const put = (p, b) => {
      if (!cur) { Z.speak('Touche d’abord un objet par terre.'); return; }
      if (p === cur.to) {
        Z.sfx.good(); cur.done = true; done++;
        const said = `${cur.name.charAt(0).toUpperCase() + cur.name.slice(1)} : ${PLACES[p].name.toLowerCase()}. Bien rangé !`;
        cur = null; [...btns.children].forEach(x => x.classList.remove('hint-good', 'bad')); tip.style.display = 'none';
        shell.setSteps(nb, done); draw();
        if (done >= nb) return Z.speak('Bravo, ta chambre est toute rangée !').then(() => fin(shell, 'ranger', 'Chambre rangée !', [`${nb} objets rangés`, errors ? `${errors} petite${errors > 1 ? 's' : ''} erreur${errors > 1 ? 's' : ''}` : 'Zéro erreur ! 🔥'], 8));
        Z.speak(said);
        return;
      }
      errors++; tries++; Z.sfx.bad(); b.classList.add('bad');
      tip.style.display = ''; tip.textContent = '💡 ' + cur.why;
      if (tries >= 2) [...btns.children].forEach(x => { if (x.dataset.p === cur.to) x.classList.add('hint-good'); });
      Z.speak('Pas là ! ' + cur.why);
    };
    shell.setSteps(nb, 0);
    const t = `Oh là là, quel bazar ! Touche un objet par terre, puis choisis où il va. Il y a ${nb} objets à ranger.`;
    shell.root.append(h('h2', null, '🧹 Ranger le bazar'), Z.loulouSays(t, { who: 'loulou' }), stage, info, btns, tip);
    draw();
  }

  /* ---------- PLIER LE LINGE ---------- */
  /* chaque vêtement : les étapes dans l'ordre, et le dessin après chaque étape */
  const LINGE = [
    { k: 'tshirt', name: 'le t-shirt', color: '#f97316', steps: ['Je l’étale bien à plat', 'Je replie les manches vers le milieu', 'Je plie en deux, du bas vers le haut'],
      art: [
        (c) => `<path d="M40 30 L62 22 Q80 34 98 22 L120 30 L138 58 L118 66 L114 58 L114 128 L46 128 L46 58 L42 66 L22 58 Z" fill="${c}" opacity=".55" transform="rotate(-8 80 75)"/>`,
        (c) => `<path d="M40 30 L62 22 Q80 34 98 22 L120 30 L138 58 L118 66 L114 58 L114 128 L46 128 L46 58 L42 66 L22 58 Z" fill="${c}"/>`,
        (c) => `<path d="M50 26 L62 22 Q80 34 98 22 L110 26 L110 128 L50 128 Z" fill="${c}"/><path d="M58 40 V124 M102 40 V124" stroke="#00000033" stroke-width="2"/>`,
        (c) => `<rect x="50" y="62" width="60" height="44" rx="4" fill="${c}"/><path d="M50 84 H110" stroke="#00000033" stroke-width="2"/>`] },
    { k: 'pantalon', name: 'le pantalon', color: '#2563eb', steps: ['Je mets une jambe sur l’autre', 'Je plie en deux', 'Je plie encore en deux'],
      art: [
        (c) => `<path d="M52 20 H108 L122 130 H94 L80 54 L66 130 H38 Z" fill="${c}"/>`,
        (c) => `<path d="M62 20 H98 L104 130 H72 Z" fill="${c}"/><path d="M68 24 L74 126" stroke="#00000033" stroke-width="2"/>`,
        (c) => `<path d="M62 70 H100 L104 128 H64 Z" fill="${c}"/>`,
        (c) => `<rect x="60" y="96" width="44" height="32" rx="4" fill="${c}"/>`] },
    { k: 'pull', name: 'le pull', color: '#16a34a', steps: ['Je l’étale bien à plat', 'Je replie les manches derrière', 'Je plie en deux'],
      art: [
        (c) => `<path d="M44 26 L66 20 Q80 28 94 20 L116 26 L146 110 L130 116 L114 60 L114 128 L46 128 L46 60 L30 116 L14 110 Z" fill="${c}" opacity=".55" transform="rotate(6 80 75)"/>`,
        (c) => `<path d="M44 26 L66 20 Q80 28 94 20 L116 26 L146 110 L130 116 L114 60 L114 128 L46 128 L46 60 L30 116 L14 110 Z" fill="${c}"/>`,
        (c) => `<path d="M46 26 L66 20 Q80 28 94 20 L114 26 L114 128 L46 128 Z" fill="${c}"/>`,
        (c) => `<rect x="46" y="64" width="68" height="44" rx="5" fill="${c}"/>`] }
  ];
  function linge() {
    const shell = Z.shell({ title: 'Plier le linge' });
    const items = Z.shuffle(LINGE).slice(0, [2, 3, 3][Z.pal()]);
    const total = items.length + 1;
    let n = 0, errors = 0;
    const t = 'Un vêtement bien plié prend moins de place et ne se froisse pas ! Choisis les étapes dans le bon ordre.';
    shell.setSteps(total, 0);
    shell.root.append(h('h2', null, '👕 Plier mon linge'), Z.loulouSays(t, { who: 'loulou' }),
      h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.vroum(); next(); } }, 'C’est parti ! ➡️'));
    const next = () => {
      if (n >= items.length) return socks();
      const it = items[n]; let step = 0;
      const draw = () => {
        shell.clear(); shell.setSteps(total, n);
        const tip = h('div', { class: 'tip', style: { display: 'none' } });
        const art = Z.svg(`<svg viewBox="0 0 160 150" class="linge-svg">${it.art[step](it.color)}</svg>`, 'linge');
        const opts = h('div', { class: 'col' }, Z.shuffle(it.steps.map((s, i) => [s, i])).map(([s, i]) => {
          const done = i < step;
          const b = h('button', { class: 'opt' + (done ? ' good' : ''), disabled: done, onclick: () => {
            if (i === step) {
              Z.sfx.good(); step++;
              Z.speak(s).then(() => { if (step >= it.steps.length) { n++; Z.sfx.coin(); Z.pop('Bien plié ! 👍', 'gold'); setTimeout(next, 500); } });
              draw();
            } else { errors++; Z.sfx.bad(); b.classList.add('bad'); tip.style.display = ''; tip.textContent = `💡 D’abord : « ${it.steps[step]} ».`; Z.speak('Pas encore ! D’abord : ' + it.steps[step]); }
          } }, h('span', null, (done ? '✅ ' : '') + s));
          return b;
        }));
        shell.root.append(h('h2', null, `Plier ${it.name}`), h('div', { class: 'card center' }, art, h('div', { class: 'hint' }, `Étape ${Math.min(step + 1, it.steps.length)} sur ${it.steps.length}`)), opts, tip);
      };
      draw();
      Z.speak(`Plie ${it.name}. Quelle est la première étape ?`);
    };
    /* chaussettes : retrouver les paires */
    const socks = () => {
      shell.clear(); shell.setSteps(total, items.length);
      const cols = Z.shuffle(['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#111827']).slice(0, [3, 4, 5][Z.pal()]);
      const pile = Z.shuffle(cols.concat(cols).map((c, i) => ({ c, i, ok: false })));
      let first = null, pairs = 0;
      const sock = (c) => `<svg viewBox="0 0 40 60"><path d="M12 2 H28 V34 L36 46 Q38 56 28 56 L8 56 Q2 56 4 48 L12 36 Z" fill="${c}"/><path d="M12 8 H28" stroke="#fff" stroke-width="3"/></svg>`;
      const grid = h('div', { class: 'socks' }, pile.map(s => {
        const b = h('button', { class: 'sock', onclick: () => {
          if (s.ok || b === first) return;
          Z.sfx.tap(); b.classList.add('sel');
          if (!first) { first = b; first._s = s; return; }
          const a = first; first = null;
          if (a._s.c === s.c) { a._s.ok = s.ok = true; a.classList.add('paire'); b.classList.add('paire'); pairs++; Z.sfx.good();
            if (pairs >= cols.length) { Z.speak('Toutes les chaussettes sont en paires !').then(() => fin(shell, 'linge', 'Linge bien plié !', [`${items.length} vêtements pliés`, `${cols.length} paires de chaussettes`, errors ? `${errors} petite${errors > 1 ? 's' : ''} erreur${errors > 1 ? 's' : ''}` : 'Zéro erreur ! 🔥'], 8)); }
          } else { errors++; Z.sfx.bad(); setTimeout(() => { a.classList.remove('sel'); b.classList.remove('sel'); }, 500); }
        } }, Z.svg(sock(s.c), 'sock-art'));
        return b;
      }));
      shell.root.append(h('h2', null, '🧦 Les chaussettes par paires'), Z.loulouSays('Retrouve les paires de chaussettes : touche deux chaussettes de la même couleur.', { who: 'loulou' }), grid);
    };
  }

  /* ---------- MON ARMOIRE RANGÉE ---------- */
  const ETAGERES = [
    { id: 'haut', ico: '🧥', name: 'Pulls et sweats' },
    { id: 'tshirt', ico: '👕', name: 'T-shirts' },
    { id: 'bas', ico: '👖', name: 'Pantalons et shorts' },
    { id: 'pyjama', ico: '🌙', name: 'Pyjamas' },
    { id: 'tiroir', ico: '🧦', name: 'Tiroir : chaussettes et slips' }
  ];
  const VET = [
    { e: '🧥', name: 'le sweat', to: 'haut' }, { e: '🧶', name: 'le pull en laine', to: 'haut' },
    { e: '👕', name: 'le t-shirt bleu', to: 'tshirt' }, { e: '🎽', name: 'le maillot de foot', to: 'tshirt' }, { e: '👕', name: 'le t-shirt blanc', to: 'tshirt' },
    { e: '👖', name: 'le jean', to: 'bas' }, { e: '🩳', name: 'le short', to: 'bas' }, { e: '👖', name: 'le jogging', to: 'bas' },
    { e: '🌙', name: 'le pyjama', to: 'pyjama' }, { e: '😴', name: 'le haut de pyjama', to: 'pyjama' },
    { e: '🧦', name: 'les chaussettes', to: 'tiroir' }, { e: '🩲', name: 'le slip', to: 'tiroir' }
  ];
  function armoire() {
    const shell = Z.shell({ title: 'Mon armoire' });
    const list = Z.shuffle(VET).slice(0, [6, 8, 10][Z.pal()]);
    const fill = {}; ETAGERES.forEach(e => fill[e.id] = []);
    let n = 0, errors = 0, tries = 0;
    const draw = () => {
      shell.clear(); shell.setSteps(list.length, n);
      if (n >= list.length) return;
      const v = list[n];
      const tip = h('div', { class: 'tip', style: { display: 'none' } });
      const arm = h('div', { class: 'armoire' }, ETAGERES.map(e => {
        const b = h('button', { class: 'etag' + (e.id === 'tiroir' ? ' tiroir' : ''), onclick: () => {
          if (e.id === v.to) {
            Z.sfx.good(); fill[e.id].push(v.e); n++; tries = 0;
            Z.speak(`${v.name.charAt(0).toUpperCase() + v.name.slice(1)} : ${e.name.toLowerCase()}.`).then(() => {
              if (n >= list.length) fin(shell, 'armoire', 'Armoire bien rangée !', [`${list.length} vêtements rangés`, errors ? `${errors} petite${errors > 1 ? 's' : ''} erreur${errors > 1 ? 's' : ''}` : 'Zéro erreur ! 🔥'], 8);
              else draw();
            });
            b.append(h('span', { class: 'pose' }, v.e));
          } else {
            errors++; tries++; Z.sfx.bad(); b.classList.add('bad'); setTimeout(() => b.classList.remove('bad'), 600);
            const good = ETAGERES.find(x => x.id === v.to);
            tip.style.display = ''; tip.textContent = `💡 ${v.name.charAt(0).toUpperCase() + v.name.slice(1)} va avec : ${good.name.toLowerCase()}.`;
            if (tries >= 2) [...arm.children].forEach(x => { if (x.dataset.id === v.to) x.classList.add('hint-good'); });
            Z.speak('Pas sur cette étagère ! Cherche : ' + good.name);
          }
        } }, h('span', { class: 'etag-n' }, e.ico + ' ' + e.name), h('span', { class: 'etag-pile' }, fill[e.id].join(' ')));
        b.dataset.id = e.id; return b;
      }));
      shell.root.append(h('h2', null, '🚪 Mon armoire rangée'),
        h('div', { class: 'card center row', style: { justifyContent: 'center' } }, h('span', { class: 'big-e' }, v.e), h('b', null, ' Où ranger ' + v.name + ' ?')),
        arm, tip);
      Z.speak(`Où ranger ${v.name} ?`);
    };
    const t = 'Dans une armoire rangée, chaque vêtement a sa place. Comme ça, le matin, tu trouves tout de suite tes affaires ! Touche la bonne étagère.';
    shell.setSteps(list.length, 0);
    shell.root.append(h('h2', null, '🚪 Mon armoire rangée'), Z.loulouSays(t, { who: 'loulou' }),
      h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.vroum(); draw(); } }, 'C’est parti ! ➡️'));
  }
})();
