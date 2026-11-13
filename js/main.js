/* =========================================================
   ÉCRANS : accueil, garage (boutique), album, coffre, parents
   ========================================================= */
const { h } = Z;
const app = document.getElementById('app');


Z.go = function (name, ...args) {
  Z.stopSpeak();
  app.innerHTML = '';
  window.scrollTo(0, 0);
  Z.current = name;
  Z.applySpeed();
  Z.narrator = { mots: 'doudou', tables: 'moezeh', problemes: 'isis' }[name] || 'loulou';
  Z.screens[name](...args);
};

/* En-tête commun des jeux */
Z.shell = function ({ title }) {
  const steps = h('div', { class: 'steps' });
  const root = h('div', { class: 'screen' });
  const top = h('div', { class: 'topbar' },
    h('button', { class: 'home-btn', 'aria-label': 'Accueil', onclick: () => { Z.sfx.tap(); Z.go('home'); } }, '🏠'),
    steps,
    h('span', { class: 'chip bolt' }, '⚡ ', h('span', { id: 'bolt' }, String(Z.state.eclairs))));
  app.append(top, root);
  return {
    root,
    title,
    setSteps(n, cur) {
      steps.innerHTML = '';
      for (let i = 0; i < n; i++) steps.appendChild(h('i', { class: i < cur ? 'on' : i === cur ? 'cur' : '' }));
    },
    clear() { root.innerHTML = ''; }
  };
};

/* Écran de fin de jeu, commun aux 3 jeux */
Z.endScreen = function (shell, { medal, title, eclairs, xp, lines = [], kind, again, detail }) {
  const leveled = Z.finishGame(kind, eclairs, xp, detail);
  shell.clear();
  shell.setSteps(0, 0);
  Z.sfx.win(); Z.confetti(160);
  const msg = `${title} Tu gagnes ${eclairs} éclairs !`;
  Z.speak(msg);
  shell.root.append(
    h('div', { class: 'medal' }, medal),
    h('h2', { class: 'center' }, title),
    h('div', { class: 'card center col' },
      h('div', { style: { fontSize: '2em', fontWeight: 700 } }, `+ ${eclairs} ⚡`),
      ...lines.map(l => h('div', null, l))),
    (() => { const f = Z.pick(ZDATA.family); const t = f.name + ' : ' + Z.pick(ZDATA.cheers); setTimeout(() => Z.speak(t, Z.FAMILY_VOICE[f.id] || { pitch: 0.95 }), 3200); return Z.familySays(f.id, t, { speak: false }); })(),
    Z.svg(Z.art.rider(), 'end-rider'),
    h('button', { class: 'btn green wide', onclick: () => { Z.sfx.tap(); again(); } }, '🔁 Encore !'),
    h('button', { class: 'btn ghost wide', onclick: () => { Z.sfx.tap(); Z.go('home'); } }, '🏠 Retour au monde'));
  if (leveled) setTimeout(() => {
    Z.sfx.win(); Z.confetti(200);
    const t = `Niveau ${Z.levelInfo().lvl} ! Tu montes de niveau, champion ! Ta ${Z.modelOf().name} roule maintenant à ${Z.speed()} kilomètres heure !${(ZDATA.models.find(m => m.lvl === Z.levelInfo().lvl) || null) ? ` Nouveau au garage : la ${ZDATA.models.find(m => m.lvl === Z.levelInfo().lvl).name} !` : ''}`;
    Z.speak(t);
    Z.modal(h('div', { class: 'col center' }, h('div', { class: 'big-reward' }, '⭐'), h('h2', null, t),
      h('button', { class: 'btn gold wide', onclick: (e) => e.target.closest('.modal').remove() }, 'Trop bien !')));
  }, 1800);
};

/* ---------- ACCUEIL ---------- */
Z.screens.home = function () {
  const st = Z.state, lv = Z.levelInfo(), d = Z.daily(), streak = Z.streakAlive();
  const goal = 3;

  const dueWords = Z.allWords().filter(w => Z.isDue(st.words[w.id])).length;

  const top = h('div', { class: 'topbar' },
    h('span', { class: 'chip fire' }, '🔥 ', String(streak)),
    h('span', { class: 'chip bolt' }, '⚡ ', String(st.eclairs)),
    h('div', { class: 'spacer' }),
    h('button', {
      class: 'home-btn', 'aria-label': 'Espace parents', title: 'Espace parents (appui long)',
      onpointerdown: (e) => { e.currentTarget._t = setTimeout(() => { Z.sfx.click(); Z.go('parent'); }, 1200); },
      onpointerup: (e) => clearTimeout(e.currentTarget._t), onpointerleave: (e) => clearTimeout(e.currentTarget._t),
      onclick: () => Z.pop('Appui long = parents', 'soft')
    }, '⚙️'));

  const hello = h('div', { class: 'hello' },
    h('h1', null, `Salut ${st.name} ! `),
    h('div', { class: 'lvl' }, h('span', null, `Niveau ${lv.lvl}`), h('div', { class: 'bar' }, h('i', { style: { width: Math.round(lv.cur / lv.need * 100) + '%' } })), h('span', null, '⭐')),
    h('div', { class: 'speedo' }, `🛴 Ta ${Z.modelOf().name} roule à `, h('b', null, `${Z.speed()} km/h`), Z.speedOf(lv.lvl) < 45 ? h('span', { class: 'hint' }, ` · niveau ${lv.lvl + 1} : ${Z.speedOf(lv.lvl + 1) + Z.modelOf().bonus} km/h`) : h('span', { class: 'hint' }, ' · vitesse maximum ! 🔥')));

  const scene = h('div', { class: 'scene', onclick: () => { Z.sfx.vroum(); Z.speak(`Vroum ! Allez ${st.name}, on y va !`); } },
    h('div', { class: 'sun' }), h('div', { class: 'cloud' }), h('div', { class: 'cloud c2' }),
    h('div', { class: 'ground' }),
    Z.svg(Z.art.rider(), 'rider'),
    Z.svg(Z.art.cat(), 'cat'));

  const ready = d.games >= goal && !d.chest;
  const mission = h('div', { class: 'mission' },
    h('div', { class: 'chest' + (ready ? ' ready' : '') }, d.chest ? '🎁' : '🧰'),
    h('div', { class: 'grow' },
      h('div', { style: { fontWeight: 700 } }, d.chest ? 'Coffre ouvert ! Reviens demain.' : ready ? 'Ton coffre est prêt !' : 'Mission du jour : 3 jeux'),
      h('div', { class: 'dots' }, Array.from({ length: goal }, (_, i) => h('i', { class: i < d.games ? 'on' : '' })))),
    ready ? h('button', { class: 'btn gold', onclick: openChest }, 'Ouvrir') : Z.ear(d.chest ? 'Bravo, tu as ouvert ton coffre aujourd\'hui. Reviens demain pour un nouveau coffre !' : `Mission du jour : joue à 3 jeux pour ouvrir le coffre au trésor. Tu en as fait ${d.games}.`));

  const world = (cls, ico, title, sub, go, badge) => h('button', { class: 'world ' + cls, onclick: () => { Z.sfx.vroum(); Z.go(go); } },
    h('span', { class: 'ico' }, Z.svg(Z.art.cat({ who: ico }), 'ico-cat')), h('span', null, title, h('small', null, sub)), badge ? h('span', { class: 'badge' }, badge) : null);

  const worlds = h('div', { class: 'worlds' },
    world('w1', 'doudou', 'Le Garage des Mots', 'Avec Doudou : répare les mots', 'mots', dueWords ? `${dueWords} à revoir` : null),
    world('w2', 'moezeh', 'Grand Prix des Tables', 'Avec Moezeh : ×6 ×7 ×8 ×9', 'tables'),
    world('w3', 'isis', 'Détective Isis', 'Résous les problèmes comme un pro', 'problemes'),
    world('w4', 'loulou', 'Le Permis Trottinette', 'Avec Loulou : la route, le marché…', 'route'));

  const nav = h('div', { class: 'nav' },
    h('button', { class: 'on' }, h('span', null, '🏠'), 'Monde'),
    h('button', { onclick: () => { Z.sfx.tap(); Z.go('garage'); } }, h('span', null, '🛠️'), 'Garage'),
    h('button', { onclick: () => { Z.sfx.tap(); Z.go('album'); } }, h('span', null, '📒'), 'Album'));

  app.append(top, hello, scene, mission, worlds, nav);

  if (!st.welcomed) {
    st.welcomed = true; Z.save();
    setTimeout(() => welcome(), 400);
  }
};

function welcome() {
  const t = `Salut ${Z.state.name} ! Moi c'est Loulou. Bienvenue au Garage de Loulou ! Mes copains Doudou, Moezeh et Isis sont là aussi. Doudou t'aide en français, Moezeh en maths, Isis résout les problèmes avec toi, et moi, je t'apprends à rouler prudent en trottinette. Ici, tu gagnes des éclairs pour décorer ta trottinette Kukirin G2. On y va ?`;
  const close = Z.modal(h('div', { class: 'col center' },
    Z.svg(Z.art.cat(), 'mini-cat-big'),
    h('h2', null, 'Salut ! Moi c\'est Loulou 🐾'),
    h('p', null, 'Bienvenue au Garage de Loulou ! Gagne des ⚡ pour décorer ta trottinette Kukirin G2.'),
    h('div', { class: 'row', style: { justifyContent: 'center' } }, Z.ear(t)),
    h('button', { class: 'btn green wide', onclick: () => { Z.sfx.vroum(); close(); } }, 'C\'est parti !')));
  Z.speak(t);
}

/* ---------- COFFRE ---------- */
function openChest() {
  const d = Z.daily(); if (d.chest) return;
  d.chest = true;
  const roll = Math.random();
  const rar = roll < 0.07 ? 3 : roll < 0.35 ? 2 : 1;
  const pool = ZDATA.stickers.filter(s => s.r === rar);
  const stk = Z.pick(pool);
  const dup = !!Z.state.stickers[stk.id];
  Z.state.stickers[stk.id] = (Z.state.stickers[stk.id] || 0) + 1;
  const bonus = 15 + (dup ? 10 : 0);
  Z.state.eclairs += bonus;
  Z.save();

  const box = h('div', { class: 'col center' });
  const chest = h('div', { class: 'big-reward', style: { cursor: 'pointer' } }, '🧰');
  box.append(h('h2', null, 'Touche le coffre !'), chest);
  const close = Z.modal(box, { closable: false, onClose: () => Z.go('home') });
  Z.speak('Touche le coffre pour l\'ouvrir !');
  let taps = 0;
  chest.addEventListener('click', () => {
    taps++; Z.sfx.drum(); chest.classList.remove('shake'); void chest.offsetWidth; chest.classList.add('shake');
    if (taps < 3) return;
    Z.sfx.win(); Z.confetti(180);
    const rname = rar === 3 ? 'LÉGENDAIRE' : rar === 2 ? 'RARE' : '';
    const say = `${rname ? 'Waouh, un autocollant ' + rname.toLowerCase() + ' ! ' : ''}${stk.n} ! ${dup ? 'Tu l\'avais déjà, alors tu gagnes 10 éclairs en plus.' : 'Nouveau dans ton album !'} Plus ${bonus} éclairs.`;
    Z.speak(say);
    box.innerHTML = '';
    box.append(
      rname ? h('div', { style: { fontWeight: 700, color: rar === 3 ? '#b45309' : '#2563eb' } }, '✨ ' + rname + ' ✨') : null,
      h('div', { class: 'big-reward' }, stk.e), h('h2', null, stk.n),
      h('div', null, dup ? 'Déjà dans ton album : +10 ⚡ bonus' : 'Nouveau dans ton album !'),
      h('div', { style: { fontSize: '1.6em', fontWeight: 700 } }, `+ ${bonus} ⚡`),
      h('button', { class: 'btn green wide', onclick: close }, 'Génial !'));
  });
}

/* ---------- GARAGE (boutique) ---------- */
Z.screens.garage = function (tab = 'model') {
  const st = Z.state;
  const top = h('div', { class: 'topbar' },
    h('button', { class: 'home-btn', onclick: () => { Z.sfx.tap(); Z.go('home'); } }, '🏠'),
    h('h2', { class: 'grow', style: { margin: 0 } }, '🛠️ Le Garage'),
    h('span', { class: 'chip bolt' }, '⚡ ', String(st.eclairs)));
  const preview = h('div', { class: 'scene', style: { height: '190px' } },
    h('div', { class: 'ground' }), Z.svg(Z.art.rider(), 'rider'), Z.svg(Z.art.cat({ who: tab === 'cat' ? (Z.garageCat || 'loulou') : 'loulou' }), 'cat'));
  const tabs = h('div', { class: 'tabs' },
    [['model', '🛴 Modèle'], ['color', '🎨 Couleur'], ['helmet', '⛑️ Casque'], ['cat', '🐱 Chats']].map(([k, l]) =>
      h('button', { class: tab === k ? 'on' : '', onclick: () => { Z.sfx.tap(); Z.go('garage', k); } }, l)));
  const lvl = Z.levelInfo().lvl;
  const who = Z.garageCat || 'loulou', key = tab === 'cat' ? Z.catKey(who) : tab;
  if (!st.owned[key]) st.owned[key] = ['aucun'];
  if (!st.equip[key]) st.equip[key] = 'aucun';
  const catPick = tab === 'cat' ? h('div', { class: 'tabs cat-pick' }, ['loulou', 'moezeh', 'doudou', 'isis'].map(c =>
    h('button', { class: who === c ? 'on' : '', onclick: () => { Z.sfx.tap(); Z.garageCat = c; Z.go('garage', 'cat'); } }, Z.svg(Z.art.cat({ who: c }), 'pick-cat'), Z.CATS[c].name))) : null;
  const list = tab === 'model' ? ZDATA.models : tab === 'color' ? ZDATA.colors : tab === 'helmet' ? ZDATA.helmets : ZDATA.catItems;
  const grid = h('div', { class: 'shop-grid' }, list.map(it => {
    const owned = st.owned[key].includes(it.id), on = st.equip[key] === it.id;
    let vis;
    if (tab === 'model') vis = Z.svg(Z.art.rider({ model: it.id, rider: false }), 'shop-scoot');
    else if (tab === 'color') vis = h('div', { class: 'sw', style: { background: it.two ? `linear-gradient(135deg, ${it.c} 50%, #111827 50%)` : it.c } });
    else if (tab === 'helmet') vis = Z.svg(Z.art.rider({ helmet: it.id }).replace('viewBox="0 0 220 180"', 'viewBox="86 0 52 60"'), 'shop-helmet');
    else vis = Z.svg(Z.art.cat({ acc: it.id, who }), 'shop-cat');
    return h('button', {
      class: 'item' + (on ? ' on' : '') + (owned ? '' : ' locked'),
      onclick: () => {
        if (owned) { st.equip[key] = it.id; Z.save(); Z.sfx.good(); Z.go('garage', tab); return; }
        if (it.lvl && lvl < it.lvl) { Z.sfx.bad(); Z.speak(`La ${it.name} se débloque au niveau ${it.lvl}. Tu es au niveau ${lvl}. Continue, champion !`); Z.pop(`🔒 Niveau ${it.lvl}`, 'soft'); return; }
        if (st.eclairs < it.price) { Z.sfx.bad(); const m = `Il te faut ${it.price} éclairs. Tu en as ${st.eclairs}. Joue encore un peu !`; Z.speak(m); Z.pop(`Il manque ${it.price - st.eclairs} ⚡`, 'soft'); return; }
        st.eclairs -= it.price; st.owned[key].push(it.id); st.equip[key] = it.id; Z.save();
        Z.sfx.coin(); Z.sfx.win(); Z.confetti(); Z.speak(`Super ! ${it.name} !`);
        Z.go('garage', tab);
      }
    }, vis, h('div', null, tab === 'cat' && it.id === 'aucun' ? `${Z.CATS[who].name} tout simple` : it.name), tab === 'model' && it.bonus ? h('div', { class: 'small-note' }, `+${it.bonus} km/h`) : null, owned ? h('div', { class: 'price' }, on ? '✅ Choisi' : 'À toi') : h('div', { class: 'price' }, it.lvl && lvl < it.lvl ? `🔒 Niveau ${it.lvl}` : `${it.price} ⚡`));
  }));
  const nav = h('div', { class: 'nav' },
    h('button', { onclick: () => { Z.sfx.tap(); Z.go('home'); } }, h('span', null, '🏠'), 'Monde'),
    h('button', { class: 'on' }, h('span', null, '🛠️'), 'Garage'),
    h('button', { onclick: () => { Z.sfx.tap(); Z.go('album'); } }, h('span', null, '📒'), 'Album'));
  app.append(top, h('div', { class: 'screen' }, preview, tabs, catPick, grid), nav);
};

/* ---------- ALBUM ---------- */
Z.screens.album = function () {
  const st = Z.state;
  const have = ZDATA.stickers.filter(s => st.stickers[s.id]).length;
  const top = h('div', { class: 'topbar' },
    h('button', { class: 'home-btn', onclick: () => { Z.sfx.tap(); Z.go('home'); } }, '🏠'),
    h('h2', { class: 'grow', style: { margin: 0 } }, '📒 Mon album'),
    h('span', { class: 'chip' }, `${have} / ${ZDATA.stickers.length}`));
  const album = h('div', { class: 'album' }, ZDATA.stickers.map(s => h('button', {
    class: `stk r${s.r}` + (st.stickers[s.id] ? '' : ' no'),
    onclick: () => { Z.sfx.tap(); Z.speak(st.stickers[s.id] ? s.n : 'Pas encore trouvé. Ouvre des coffres !'); }
  }, s.e, st.stickers[s.id] > 1 ? h('small', null, '×' + st.stickers[s.id]) : null)));

  // Carte des tables : chaque case se colore quand le fait est appris
  const facts = h('div', { class: 'facts' });
  facts.appendChild(h('i', { class: 'h' }, '×'));
  for (let b = 1; b <= 9; b++) facts.appendChild(h('i', { class: 'h' }, String(b + 1)));
  for (let a = 2; a <= 10; a++) {
    facts.appendChild(h('i', { class: 'h' }, String(a)));
    for (let b = 2; b <= 10; b++) {
      const k = Z.factKey(a, b), f = st.facts[k];
      facts.appendChild(h('i', { class: f ? 'b' + f.box : '' }, f && f.box >= 4 ? String(a * b) : ''));
    }
  }
  const words = Z.allWords();
  const mastered = words.filter(w => st.words[w.id] && st.words[w.id].box >= 4).length;
  const probs = Object.keys(st.probs).length;

  const nav = h('div', { class: 'nav' },
    h('button', { onclick: () => { Z.sfx.tap(); Z.go('home'); } }, h('span', null, '🏠'), 'Monde'),
    h('button', { onclick: () => { Z.sfx.tap(); Z.go('garage'); } }, h('span', null, '🛠️'), 'Garage'),
    h('button', { class: 'on' }, h('span', null, '📒'), 'Album'));

  app.append(top, h('div', { class: 'screen' },
    h('div', { class: 'card' }, h('h2', null, '🏆 Mes trophées'),
      h('div', null, `🔤 Mots bien rangés dans ta tête : ${mastered} / ${words.length}`),
      h('div', null, `🔍 Enquêtes résolues : ${probs} / ${ZDATA.problems.length}`),
      h('div', null, `🪪 Règles de la route bien sues : ${ZDATA.routeKnown ? ZDATA.routeKnown() : 0} / ${Z.ROUTE_COUNT || 0}`),
      h('div', null, `🔥 Série actuelle : ${Z.streakAlive()} jour(s)`)),
    h('div', { class: 'card' }, h('h2', null, '✨ Autocollants'), h('p', { class: 'hint' }, 'Ouvre le coffre du jour pour en gagner.'), album),
    h('div', { class: 'card' }, h('h2', null, '🗺️ Carte des tables'), h('p', { class: 'hint' }, 'Les cases deviennent vertes quand tu connais le résultat par cœur.'), facts)), nav);
};

/* ---------- ESPACE PARENTS ---------- */
Z.screens.parent = function () {
  const st = Z.state;
  const top = h('div', { class: 'topbar' },
    h('button', { class: 'home-btn', onclick: () => Z.go('home') }, '🏠'),
    h('h2', { class: 'grow', style: { margin: 0 } }, 'Espace parents'));
  const words = Z.allWords();
  const rows = words.map(w => {
    const it = st.words[w.id];
    return h('tr', null, h('td', null, Z.parseWord(w.s).word), h('td', null, it ? `boîte ${it.box}/5` : '—'), h('td', null, it ? `${it.ok}/${it.seen}` : ''));
  });
  const days = {};
  st.log.forEach(l => { days[l.d] = (days[l.d] || 0) + 1; });
  const lastDays = Object.keys(days).sort().slice(-7).map(d => `${d.slice(8)}/${d.slice(5, 7)} : ${days[d]} jeu(x)`).join(' · ') || 'Aucune partie pour l\'instant.';

  // Ajout de mots (ex. la dictée de la semaine)
  const fSpec = h('input', { placeholder: 'ex. pa-pi-[ll]on  ou  gran(d)' });
  const fEmoji = h('input', { placeholder: 'emoji ex. 🦋', maxlength: '8' });
  const fPh = h('input', { placeholder: 'phrase ex. Le papillon vole.' });
  const fHint = h('input', { placeholder: 'astuce (facultatif)' });
  const preview = h('div', { class: 'card center', style: { minHeight: '60px' } });
  const upd = () => { preview.innerHTML = ''; if (fSpec.value.trim()) preview.appendChild(Z.wordEl(Z.parseWord(fSpec.value.trim()))); };
  fSpec.addEventListener('input', upd);
  const addBtn = h('button', {
    class: 'btn green wide', onclick: () => {
      const s = fSpec.value.trim(); if (!s) return;
      const word = Z.parseWord(s).word;
      st.customWords.push({ id: 'c_' + Date.now(), s, e: fEmoji.value.trim() || '📝', ph: fPh.value.trim() || word, hint: fHint.value.trim() || '', custom: true, prio: true });
      Z.save(); Z.go('parent');
    }
  }, '➕ Ajouter ce mot');
  const custom = st.customWords.map(w => h('div', { class: 'row' }, h('span', { class: 'grow' }, w.e + ' ', Z.wordEl(Z.parseWord(w.s))),
    h('button', { class: 'btn ghost', style: { minHeight: '44px' }, onclick: () => { st.customWords = st.customWords.filter(x => x.id !== w.id); delete st.words[w.id]; Z.save(); Z.go('parent'); } }, '🗑️')));

  const rate = h('input', { type: 'range', min: '0.6', max: '1.2', step: '0.05', value: String(st.settings.rate) });
  rate.addEventListener('change', () => { st.settings.rate = Number(rate.value); Z.save(); Z.speak('Voici la vitesse de la voix.'); });
  const name = h('input', { value: st.name });
  name.addEventListener('change', () => { st.name = name.value.trim() || 'Zouzou Gabi'; Z.save(); });
  const snd = h('select', null, h('option', { value: '1', selected: st.settings.sound }, 'Sons activés'), h('option', { value: '0', selected: !st.settings.sound }, 'Sons coupés'));
  snd.addEventListener('change', () => { st.settings.sound = snd.value === '1'; Z.save(); });
  const cartoon = h('select', null, h('option', { value: '1', selected: st.settings.cartoon !== false }, 'Voix de Loulou : dessin animé'), h('option', { value: '0', selected: st.settings.cartoon === false }, 'Voix de Loulou : normale'));
  cartoon.addEventListener('change', () => { st.settings.cartoon = cartoon.value === '1'; Z.save(); Z.speak('Miaou ! Coucou, c\'est moi, Loulou !'); });

  app.append(top, h('div', { class: 'screen parent' },
    h('div', { class: 'card' },
      h('h3', null, '📈 Activité (7 derniers jours)'), h('p', null, lastDays),
      h('p', null, `Niveau ${Z.levelInfo().lvl} · ${st.eclairs} ⚡ · série ${Z.streakAlive()} j · ${Object.keys(st.probs).length} problèmes réussis`),
      h('h3', null, '🔤 Mots (répétition espacée)'),
      h('p', { class: 'small-note' }, 'Boîte 1 = revu le jour même, 2 = le lendemain, 3 = 3 jours, 4 = 1 semaine, 5 = 16 jours (mémorisé). Une erreur renvoie en boîte 1 : c\'est normal et voulu.'),
      h('table', null, h('tr', null, h('th', null, 'Mot'), h('th', null, 'Niveau'), h('th', null, 'Réussites')), rows)),
    h('div', { class: 'card' },
      h('h3', null, '➕ Ajouter des mots (dictée de la semaine)'),
      h('p', { class: 'small-note' }, 'Coupez en syllabes avec des tirets. Entre [crochets] : la partie difficile (surlignée en jaune). Entre (parenthèses) : les lettres muettes (en gris). Les mots ajoutés passent en priorité.'),
      h('label', null, 'Mot'), fSpec, preview,
      h('label', null, 'Image'), fEmoji, h('label', null, 'Phrase exemple'), fPh, h('label', null, 'Astuce lue à voix haute'), fHint,
      h('div', { style: { marginTop: '10px' } }, addBtn),
      custom.length ? h('h3', null, 'Mots ajoutés') : null, ...custom),
    transferCard(),
    h('div', { class: 'card' },
      h('h3', null, '⚙️ Réglages'),
      h('label', null, 'Prénom affiché'), name,
      h('label', null, 'Vitesse de la voix'), rate, snd, cartoon,
      h('div', { style: { marginTop: '14px' } }, h('button', {
        class: 'btn ghost wide', onclick: () => { if (confirm('Effacer toute la progression ? (irréversible)')) { Z.reset(); Z.go('home'); } }
      }, '♻️ Remettre à zéro')))));
};

/* Transfert de progression : d'une adresse à une autre (ex. Netlify → GitHub), ou d'un téléphone à l'autre.
   La progression est encodée dans un code texte à copier, puis à coller dans la nouvelle appli. */
Z.exportCode = () => 'GARAGE1:' + btoa(unescape(encodeURIComponent(JSON.stringify(Z.state))));
Z.importCode = function (code) {
  const c = String(code || '').replace(/\s+/g, '');
  if (!c.startsWith('GARAGE1:')) throw new Error('code');
  const s = JSON.parse(decodeURIComponent(escape(atob(c.slice(8)))));
  if (!s || typeof s !== 'object' || !s.words) throw new Error('code');
  localStorage.setItem('zouzou-cm1-v1', JSON.stringify(s));
  Z.state = Z.load();
};
function transferCard() {
  const h = Z.h;
  const out = h('textarea', { rows: 3, readonly: true, style: { width: '100%', fontSize: '12px', display: 'none' } });
  const inp = h('textarea', { rows: 3, placeholder: 'Collez ici le code GARAGE1:…', style: { width: '100%', fontSize: '12px' } });
  const msg = h('p', { class: 'small-note' });
  const copy = h('button', {
    class: 'btn purple wide', onclick: async () => {
      const code = Z.exportCode();
      out.value = code; out.style.display = 'block';
      try { await navigator.clipboard.writeText(code); msg.textContent = '✅ Code copié ! Ouvrez la nouvelle adresse, puis collez-le dans « Récupérer ».'; }
      catch (e) { out.select(); msg.textContent = 'Sélectionnez tout le code ci-dessus, puis copiez-le.'; }
    }
  }, '📤 Copier la progression');
  const load = h('button', {
    class: 'btn green wide', onclick: () => {
      try {
        Z.importCode(inp.value);
        Z.sfx.win(); Z.save(); alert(`✅ Progression récupérée : niveau ${Z.levelInfo().lvl}, ${Z.state.eclairs} éclairs.`); Z.go('home');
      } catch (e) { msg.textContent = '❌ Ce code ne marche pas. Recopiez-le en entier, depuis GARAGE1: jusqu\'au bout.'; }
    }
  }, '📥 Récupérer la progression');
  return h('div', { class: 'card' },
    h('h3', null, '📲 Transférer la progression'),
    h('p', { class: 'small-note' }, 'Pour changer d\'adresse ou de téléphone sans rien perdre : sur l\'ancienne appli, « Copier ». Sur la nouvelle, coller le code puis « Récupérer ». Attention : la récupération remplace la progression de la nouvelle appli.'),
    copy, out, h('div', { style: { height: '10px' } }), inp, load, msg);
}

/* Démarrage */
Z.go('home');
