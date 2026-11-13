/* =========================================================
   JEU 2 — GRAND PRIX DES TABLES (×6 ×7 ×8 ×9)
   ---------------------------------------------------------
   • Chaque NOUVEAU résultat est d'abord montré (points + astuce) avant
     d'être demandé : on apprend sans échec.
   • Astuces "faits dérivés" (6×7 = 5×7 + 7 ; 9×n = 10×n − n) : la mémoire
     des faits est fragile chez les dyslexiques, la stratégie la soutient.
   • Récupération active + répétition espacée par résultat.
   • Pas de chrono qui punit : la course se gagne TOUJOURS (10 bonnes
     réponses). Les erreurs reviennent 2 et 5 questions plus tard.
   • Mélange avec des résultats faciles (×2 ×5 ×10) pour garder ~80 % de
     réussite : c'est ce qui maintient la motivation.
   ========================================================= */
(function () {
  const h = Z.h;
  Z.factKey = (a, b) => Math.min(a, b) + 'x' + Math.max(a, b);

  const TARGET = [];
  for (let a = 6; a <= 9; a++) for (let b = 2; b <= 10; b++) {
    const k = Z.factKey(a, b);
    if (!TARGET.includes(k)) TARGET.push(k);
  }
  const EASY = ['2x3', '2x4', '5x4', '5x3', '2x10', '5x10', '3x10', '4x10', '2x5', '5x5', '3x3', '4x2'];
  const GOAL = 10;

  Z.screens.tables = function () { start(); };

  function buildQueue() {
    const st = Z.state.facts;
    const learning = TARGET.filter(k => st[k] && Z.isDue(st[k])).sort((a, b) => st[a].box - st[b].box).slice(0, 6);
    const fresh = TARGET.filter(k => !st[k]).slice(0, Math.max(2, 4 - Math.floor(learning.length / 2)));
    let old = learning.slice();
    if (old.length + fresh.length < 6) {
      const rest = TARGET.filter(k => !old.includes(k) && !fresh.includes(k) && st[k]).sort((a, b) => st[a].box - st[b].box);
      old = old.concat(rest.slice(0, 6 - old.length - fresh.length));
    }
    const easy = Z.shuffle(EASY).map(k => { const [a, b] = k.split('x').map(Number); return Z.factKey(a, b); });
    // 1 facile pour démarrer, puis anciens et nouveaux mélangés,
    // et chaque nouveau résultat est redemandé plus tard (récupération espacée)
    let q = [{ k: easy[0] }];
    const mid = Z.shuffle(old.map(k => ({ k })).concat(fresh.map(k => ({ k, isNew: true }))));
    q = q.concat(mid);
    q.splice(Math.min(4, q.length), 0, { k: easy[1] });
    Z.shuffle(fresh).forEach(k => q.push({ k }));
    old.slice(0, 2).forEach(k => q.push({ k }));
    q.push({ k: easy[2] });
    return q;
  }

  function strategy(a, b) {
    const x = Math.max(a, b), y = Math.min(a, b), r = a * b;
    const has = (n) => a === n || b === n, other = (n) => a === n ? b : a;
    if (has(10)) { const n = other(10); return { t: `Fois 10, facile : on ajoute un zéro ! ${n} devient ${n * 10}.`, rows: n, cols: 10, split: 0 }; }
    if (has(2)) { const n = other(2); return { t: `Fois 2, c'est le double : ${n} plus ${n} égale ${r}.`, rows: 2, cols: n, split: 1 }; }
    if (has(5)) { const n = other(5); return { t: `Fois 5, c'est la moitié de fois 10. ${n} fois 10 égale ${n * 10}, la moitié c'est ${r}.`, rows: 5, cols: n, split: 0 }; }
    if (has(9)) { const n = other(9); return { t: `Astuce du 9 : ${n} fois 10 égale ${n * 10}, puis on enlève ${n}. ${n * 10} moins ${n} égale ${r}.`, rows: 9, cols: n, split: 0, nine: true }; }
    if (x === 8 && y === 7) return { t: `Formule magique : 5, 6, 7, 8 ! 56 égale 7 fois 8.`, rows: 7, cols: 8, split: 5 };
    if (x === 7 && y === 7) return { t: `7 fois 7 égale 49. C'est 5 fois 7, 35, plus 2 fois 7, 14. 35 plus 14 égale 49.`, rows: 7, cols: 7, split: 5 };
    if (has(6)) { const n = other(6); return { t: `Astuce du 6 : 5 fois ${n} égale ${5 * n}, et on ajoute encore ${n}. ${5 * n} plus ${n} égale ${r}.`, rows: 6, cols: n, split: 5 }; }
    if (has(4)) { const n = other(4); return { t: `Fois 4, c'est le double du double : ${n}, puis ${2 * n}, puis ${r}.`, rows: 4, cols: n, split: 2 }; }
    if (has(8)) { const n = other(8); return { t: `Fois 8, c'est le double de fois 4. 4 fois ${n} égale ${4 * n}, le double c'est ${r}.`, rows: 8, cols: n, split: 4 }; }
    if (has(3)) { const n = other(3); return { t: `Fois 3 : ${n} plus ${n} plus ${n} égale ${r}.`, rows: 3, cols: n, split: 0 }; }
    return { t: `${a} fois ${b} égale ${r}.`, rows: a, cols: b, split: 0 };
  }

  function dotGrid(s) {
    const g = h('div', { class: 'dotgrid', style: { gridTemplateColumns: `repeat(${s.cols}, 18px)` } });
    for (let r = 0; r < s.rows; r++) for (let c = 0; c < s.cols; c++)
      g.appendChild(h('i', { class: s.split && r >= s.split ? 'b' : '' }));
    return g;
  }

  function choicesFor(a, b) {
    const r = a * b, set = new Set();
    const cands = Z.shuffle([a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b, r + 10, r - 10, r + 1, r - 1, r + 2]);
    const swap = Number(String(r).split('').reverse().join(''));
    if (r >= 10 && r % 10 !== 0 && swap !== r) cands.unshift(swap);          // inversion de chiffres (56/65), fréquente chez les dys
    for (const c of cands) { if (c > 0 && c !== r) set.add(c); if (set.size >= 3) break; }
    return Z.shuffle([r, ...set]);
  }

  function start() {
    const shell = Z.shell({ title: 'Grand Prix' });
    let queue = buildQueue();
    let correct = 0, errors = 0, streak = 0, bonus = 0;
    const firstTry = {};

    const track = h('div', { class: 'track' }, h('div', { class: 'finish' }));
    const me = Z.svg(Z.art.rider(), 'me');
    track.appendChild(me);
    const moveMe = () => { me.style.left = `calc((100% - 126px) * ${correct / GOAL})`; me.classList.toggle('turbo', streak >= 3); };

    const intro = () => {
      shell.clear(); shell.setSteps(GOAL, 0);
      const t = `Salut champion, moi c'est Moezeh, ton coach des maths ! Bienvenue au Grand Prix des tables. Dix bonnes réponses et tu passes la ligne d'arrivée. Prends ton temps, il n'y a pas de chrono.`;
      shell.root.append(h('h2', null, '🏁 Grand Prix des Tables'), Z.loulouSays(t, { speak: false }),
        h('div', { class: 'card center' }, h('div', { class: 'emoji-big' }, '🛴💨🏁')),
        h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.vroum(); ask(); } }, '🚦 3, 2, 1… Partez !'));
      Z.speak(t);
    };

    const ask = () => {
      if (correct >= GOAL) return finish();
      if (!queue.length) queue = buildQueue().map(x => ({ k: x.k }));
      const item = queue.shift();
      let [a, b] = item.k.split('x').map(Number);
      if (Math.random() < .5) [a, b] = [b, a];
      if (item.isNew && !Z.state.facts[item.k]) return teach(a, b, item, () => question(a, b, item));
      question(a, b, item);
    };

    const teach = (a, b, item, next) => {
      shell.clear(); shell.setSteps(GOAL, correct);
      const s = strategy(a, b);
      const t = `Nouveau résultat ! ${a} fois ${b}. ${s.t}`;
      shell.root.append(track,
        h('h2', null, '✨ Nouveau résultat à apprendre'),
        h('div', { class: 'card center col' },
          h('div', { class: 'question' }, `${a} × ${b} = ${a * b}`),
          dotGrid(s),
          h('div', { class: 'row' }, h('span', { class: 'grow' }, s.t), Z.ear(t))),
        h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.tap(); item.isNew = false; next(); } }, 'Je l\'ai retenu ! ➡️'));
      moveMe();
      Z.speak(t);
    };

    const question = (a, b, item) => {
      shell.clear(); shell.setSteps(GOAL, correct);
      const r = a * b, t0 = Date.now();
      let tries = 0;
      const turbo = h('div', { class: 'streak-turbo' }, streak >= 3 ? `🔥 TURBO × ${streak} !` : '');
      const qText = `${a} fois ${b} ?`;
      const grid = h('div', { class: 'choices' });
      choicesFor(a, b).forEach(v => {
        const btn = h('button', {
          class: 'choice', onclick: () => {
            if (btn.classList.contains('bad') || grid.dataset.done) return;
            tries++;
            if (v === r) {
              grid.dataset.done = '1';
              btn.classList.add('good'); Z.sfx.good();
              const fast = Date.now() - t0 < 5000;
              if (tries === 1) { streak++; if (!(item.k in firstTry)) firstTry[item.k] = true; }
              else { streak = 0; }
              correct++;
              if (streak >= 3 && fast) { bonus++; Z.pop('🔥 Turbo +1 ⚡', 'gold'); } else Z.pop('✓', '');
              moveMe(); Z.sfx.vroum();
              Z.speak(`${a} fois ${b}, ${r} !`);
              setTimeout(ask, 1100);
            } else {
              errors++; streak = 0;
              if (!(item.k in firstTry)) firstTry[item.k] = false;
              btn.classList.add('bad'); Z.sfx.bad();
              // la même question reviendra un peu plus tard
              queue.splice(Math.min(2, queue.length), 0, { k: item.k });
              queue.splice(Math.min(5, queue.length), 0, { k: item.k });
              help(a, b, grid);
            }
          }
        }, String(v));
        grid.appendChild(btn);
      });
      shell.root.append(track, turbo,
        h('div', { class: 'card center' }, h('div', { class: 'row', style: { justifyContent: 'center' } }, h('div', { class: 'question' }, `${a} × ${b}`), Z.ear(qText))),
        grid, h('div', { id: 'help' }));
      moveMe();
      Z.speak(qText);
    };

    const help = (a, b, grid) => {
      const box = document.getElementById('help');
      const s = strategy(a, b);
      box.innerHTML = '';
      box.appendChild(h('div', { class: 'card col center' },
        h('div', { style: { fontWeight: 700 } }, '💡 Astuce de Moezeh'),
        dotGrid(s), h('div', { class: 'row' }, h('span', { class: 'grow' }, s.t), Z.ear(s.t))));
      Z.speak(`Pas grave ! ${s.t}`);
    };

    const finish = () => {
      for (const k in firstTry) Z.srsUpdate(Z.state.facts, k, firstTry[k]);
      Z.save();
      const medal = errors <= 1 ? '🥇' : errors <= 3 ? '🥈' : '🥉';
      const known = TARGET.filter(k => Z.state.facts[k] && Z.state.facts[k].box >= 4).length;
      Z.endScreen(shell, {
        medal, kind: 'tables', eclairs: 12 + bonus, xp: 20 + Math.max(0, 10 - errors * 2),
        title: errors <= 1 ? 'Victoire au Grand Prix !' : 'Ligne d\'arrivée franchie !',
        lines: [`${errors} erreur(s) · ${bonus} turbo(s)`, `Tables 6-9 connues par cœur : ${known} / ${TARGET.length}`],
        detail: Object.keys(firstTry).join(','),
        again: () => Z.go('tables')
      });
    };

    intro();
  }
})();
