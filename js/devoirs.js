/* =========================================================
   MES DEVOIRS — les devoirs de l'agenda, transformés en jeu
   ---------------------------------------------------------
   • Une consigne à la fois, grosse police, tout est lu à voix haute.
   • Pas d'écriture : gros boutons à choisir (une dictée ne marcherait pas
     pour les terminaisons : « savais » et « savait » se prononcent pareil).
   • Erreur → « Essaie encore » + la question pour trouver le sujet ;
     2e erreur → la bonne réponse clignote.
   • Poésie : l'appli la lit une fois, puis écoute la récitation au micro.
     1er tour : elle souffle les mots quand il bloque. 2e tour : sans aide.
   • À la fin : une page propre à imprimer pour la maîtresse.
   ========================================================= */
(function () {
  const h = Z.h;
  /* La semaine affichée : celle en cours (ZDEVOIRS) ou une semaine archivée (ZARCHIVES) */
  let week = null;
  const D = () => week || window.ZDEVOIRS;
  const archives = () => (window.ZARCHIVES || []).slice().sort((a, b) => b.id.localeCompare(a.id));
  const isOld = () => D() !== window.ZDEVOIRS;
  const findWeek = (wid) => (wid && archives().find(w => w.id === wid)) || window.ZDEVOIRS;
  /* une seule récitation à la fois : on coupe le micro en changeant d'écran */
  let stopRecite = null;
  const killRecite = () => { if (stopRecite) { const f = stopRecite; stopRecite = null; f(); } };

  /* Progression rangée PAR SEMAINE : rien n'est effacé quand les devoirs changent */
  function storeOf(wid) {
    const st = Z.state;
    st.devoirsAll = st.devoirsAll || {};
    if (st.devoirs && st.devoirs.id) { st.devoirsAll[st.devoirs.id] = st.devoirsAll[st.devoirs.id] || { done: st.devoirs.done, res: st.devoirs.res }; delete st.devoirs; }
    return st.devoirsAll[wid] = st.devoirsAll[wid] || { done: {}, res: {} };
  }
  const store = () => storeOf(D().id);
  /* Poésies rangées par titre (une nouvelle poésie n'efface pas l'ancienne) */
  function poemOf(titre) {
    const st = Z.state;
    st.poemes = st.poemes || {};
    if (st.poeme && st.poeme.titre) { st.poemes[st.poeme.titre] = st.poemes[st.poeme.titre] || st.poeme; delete st.poeme; }
    return st.poemes[titre] || null;
  }
  Z.devoirsLeft = () => { const s = storeOf(window.ZDEVOIRS.id); return window.ZDEVOIRS.items.filter(i => !s.done[i.id]).length; };
  const say = (t) => Z.speak(t, { natural: true });
  const back = () => { Z.sfx.tap(); Z.go('devoirs', isOld() ? D().id : undefined); };

  function reward(shell, it, eclairs, lines) {
    const s = store(); s.done[it.id] = true; Z.save();
    /* révision d'un ancien devoir : moitié moins d'éclairs (la semaine en cours reste la priorité) */
    if (isOld()) { eclairs = Math.max(5, Math.round(eclairs / 2)); lines = ['📦 Révision', ...lines]; }
    Z.endScreen(shell, { medal: '📚', title: isOld() ? 'Révision terminée !' : 'Exercice terminé !', eclairs, xp: eclairs, lines, kind: 'devoirs', detail: D().id + ':' + it.id, again: back, againLabel: '📚 Mes devoirs' });
  }

  const ICO = { verbes: '✏️', sujet: '🟥', mathador: '🔢', poesie: '📜', suite: '🧮', mots: '🔤', groupes: '📘', table: '✖️', phrases: '🧩', conjug: '🔁', mesures: '📏' };
  const itemBtn = (it, s, wid) => h('button', { class: 'devoir' + (s.done[it.id] ? ' fait' : ''), onclick: () => { Z.sfx.vroum(); Z.go('devoir', it.id, wid); } },
    h('span', { class: 'd-ico' }, s.done[it.id] ? '✅' : ICO[it.type]),
    h('span', { class: 'grow' }, it.titre, h('small', null, it.pour)),
    h('span', { class: 'd-go' }, '▶'));

  /* ---------- LISTE ---------- */
  Z.screens.devoirs = function (wid) {
    killRecite();
    week = findWeek(wid);
    const s = store();
    const shell = Z.shell({ title: 'Mes devoirs' });
    shell.setSteps(0, 0);
    const items = D().items;
    if (isOld()) {
      const t = `${D().titre}. Tu peux refaire ces devoirs pour réviser !`;
      shell.root.append(h('h2', null, '📦 ' + D().titre), Z.loulouSays(t),
        ...items.map(it => itemBtn(it, s, D().id)),
        h('button', { class: 'btn ghost wide', onclick: printSheet }, '🖨️ Réimprimer la feuille'),
        h('button', { class: 'btn ghost wide', onclick: () => { Z.sfx.tap(); Z.go('archives'); } }, '⬅️ Les autres semaines'));
      return;
    }
    const left = items.filter(i => !s.done[i.id]).length;
    const hello = Z.state.franklinMet ? '' : 'Moi c’est Franklin, la tortue. Je t’aide pour tes devoirs : doucement, mais sûrement ! ';
    if (!Z.state.franklinMet) { Z.state.franklinMet = true; Z.save(); }
    const t = left ? `Salut ${Z.state.name} ! ${hello}Voici tes devoirs. Il en reste ${left}. Choisis par où tu commences !` : `${hello}Bravo ${Z.state.name}, tous tes devoirs sont faits ! Tu peux imprimer la feuille pour la maîtresse.`;
    shell.root.append(
      h('h2', null, '📚 Mes devoirs'),
      Z.loulouSays(t),
      ...items.map(it => itemBtn(it, s)),
      h('button', { class: 'btn ghost wide', onclick: printSheet }, '🖨️ Imprimer pour la maîtresse'),
      archives().length ? h('button', { class: 'btn purple wide', onclick: () => { Z.sfx.tap(); Z.go('archives'); } }, `📦 Mes anciens devoirs (${archives().length})`) : null);
  };

  /* ---------- ANCIENS DEVOIRS ---------- */
  Z.screens.archives = function () {
    killRecite();
    const shell = Z.shell({ title: 'Anciens devoirs' });
    shell.setSteps(0, 0);
    const t = 'Voici tes anciens devoirs. Tu peux les refaire pour réviser, par exemple avant une évaluation !';
    shell.root.append(h('h2', null, '📦 Mes anciens devoirs'), Z.loulouSays(t),
      ...archives().map(w => {
        const s = storeOf(w.id), done = w.items.filter(i => s.done[i.id]).length;
        return h('button', { class: 'devoir', onclick: () => { Z.sfx.vroum(); Z.go('devoirs', w.id); } },
          h('span', { class: 'd-ico' }, '📦'),
          h('span', { class: 'grow' }, w.titre, h('small', null, w.items.map(i => ICO[i.type]).join(' ') + ` · ${done}/${w.items.length} faits`)),
          h('span', { class: 'd-go' }, '▶'));
      }),
      h('button', { class: 'btn ghost wide', onclick: () => { Z.sfx.tap(); Z.go('devoirs'); } }, '📚 Les devoirs de la semaine'));
  };

  Z.screens.devoir = function (id, wid) {
    killRecite();
    week = findWeek(wid);
    const it = D().items.find(i => i.id === id);
    const shell = Z.shell({ title: it.titre });
    ({ verbes, sujet, mathador, poesie, suite, mots, groupes, table, phrases, conjug, mesures })[it.type](shell, it);
  };

  /* ---------- VERBES À ACCORDER ---------- */
  const RULE = 'Je cherche le sujet : qui fait l’action ? Avec il, elle, on : la fin est t. Avec ils, elles : la fin est ent. Avec je, tu : la fin est s.';
  function verbes(shell, it) {
    const s = store();
    const res = s.res[it.id] = s.res[it.id] || {};
    const steps = [];
    it.phrases.forEach((p, pi) => p.b.forEach((b, bi) => steps.push({ pi, bi })));
    let n = 0, errors = 0;

    const intro = () => {
      shell.clear(); shell.setSteps(steps.length, 0);
      const t = `${it.consigne} ${RULE}`;
      shell.root.append(h('h2', null, '✏️ ' + it.titre), Z.loulouSays(it.consigne + ' Choisis la bonne fin du verbe.'),
        h('div', { class: 'card rule' },
          h('div', null, '🔎 Je cherche ', h('b', null, 'qui'), ' fait l’action.'),
          h('div', null, h('b', null, 'il, elle, on'), ' → ', h('span', { class: 'fin' }, 't')),
          h('div', null, h('b', null, 'ils, elles'), ' → ', h('span', { class: 'fin' }, 'ent')),
          h('div', null, h('b', null, 'je, tu'), ' → ', h('span', { class: 'fin' }, 's')), Z.ear(t)),
        h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.vroum(); ask(); } }, 'C’est parti ! ➡️'));
    };

    /* La phrase, avec les trous déjà remplis et le trou en cours */
    const sentence = (p, pi, cur) => {
      const parts = p.t.split('¤'), out = [];
      parts.forEach((txt, i) => {
        out.push(txt);
        if (i < p.b.length) {
          const b = p.b[i], key = pi + '-' + i;
          if (res[key]) out.push(h('span', { class: 'mot-fait' }, b[0], h('span', { class: 'fin' }, b[1])));
          else out.push(h('span', { class: 'mot-trou' + (i === cur ? ' cur' : '') }, b[0], h('span', { class: 'trou' }, '…')));
        }
      });
      return h('div', { class: 'phrase' }, out);
    };
    const full = (p) => { let k = 0; return p.t.replace(/¤/g, () => { const b = p.b[k++]; return b[0] + b[1]; }); };

    const ask = () => {
      if (n >= steps.length) return reward(shell, it, 20, [`${steps.length} verbes accordés`, errors ? `${errors} petite${errors > 1 ? 's' : ''} erreur${errors > 1 ? 's' : ''}, corrigée${errors > 1 ? 's' : ''}` : 'Zéro erreur ! 🔥']);
      const { pi, bi } = steps[n], p = it.phrases[pi], b = p.b[bi];
      shell.clear(); shell.setSteps(steps.length, n);
      let tries = 0;
      const hint = h('div', { class: 'tip', style: { display: 'none' } });
      const grid = h('div', { class: 'choices' });
      Z.shuffle([b[1], ...b[2]]).forEach(fin => {
        const btn = h('button', { class: 'choice mot', onclick: () => {
          if (btn.classList.contains('bad') || grid.dataset.done) return;
          tries++;
          if (fin === b[1]) {
            grid.dataset.done = '1'; btn.classList.add('good'); Z.sfx.good();
            res[pi + '-' + bi] = tries; Z.save();
            n++;
            say(p.b.every((_, i) => res[pi + '-' + i]) ? full(p) : b[0] + b[1]).then(() => setTimeout(ask, 400));
          } else {
            errors++; btn.classList.add('bad'); Z.sfx.bad();
            const sujetTxt = b[4] === b[5] ? `C’est « ${b[4]} ».` : `C’est « ${b[4]} » : comme « ${b[5]} ».`;
            hint.style.display = ''; hint.textContent = `💡 ${b[3]} ${sujetTxt}`;
            if (tries >= 2) {
              [...grid.children].find(x => x.dataset.fin === b[1]).classList.add('hint-good');
              Z.speak(`${b[3]} ${sujetTxt} Il faut écrire ${b[0]}${b[1]}, avec ${b[1].split('').join(' ')} à la fin.`);
            } else Z.speak(`Pas grave, essaie encore. ${b[3]} ${sujetTxt}`);
          }
        } }, b[0], h('span', { class: 'fin' }, fin));
        btn.dataset.fin = fin;
        grid.appendChild(btn);
      });
      shell.root.append(h('h2', null, `Phrase ${pi + 1} sur ${it.phrases.length}`),
        h('div', { class: 'card row' }, sentence(p, pi, bi), Z.ear(() => full(p), { natural: true })),
        h('div', { class: 'hint center' }, 'Choisis la bonne fin :'), grid, hint);
      say(full(p));
    };
    intro();
  }

  /* ---------- VERBE ET SUJET ---------- */
  function parseSujet(line) {
    return line.split(' ').map(w => {
      const m = w.match(/^(S|V|s\?|v\?):(.*)$/);
      return m ? { w: m[2], need: m[1] === 'S' ? 'S' : m[1] === 'V' ? 'V' : null, opt: m[1] === 's?' ? 'S' : m[1] === 'v?' ? 'V' : null } : { w, need: null, opt: null };
    });
  }
  function sujet(shell, it) {
    const s = store();
    const res = s.res[it.id] = s.res[it.id] || {};
    let n = 0, errors = 0;
    const intro = () => {
      shell.clear(); shell.setSteps(it.phrases.length, 0);
      const t = `${it.consigne} Touche un mot une fois : il devient le verbe, encadré en rouge. Touche-le deux fois : il devient le sujet, souligné en bleu. Pour trouver le verbe, je change le temps : hier, demain. Pour trouver le sujet, je demande : qui est-ce qui ?`;
      shell.root.append(h('h2', null, '🟥 ' + it.titre), Z.loulouSays(it.consigne),
        h('div', { class: 'card rule' },
          h('div', null, '👆 1 fois → ', h('span', { class: 'is-v' }, 'verbe')),
          h('div', null, '👆👆 2 fois → ', h('span', { class: 'is-s' }, 'sujet')),
          h('div', null, '👆👆👆 3 fois → on efface'), Z.ear(t)),
        h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.vroum(); ask(); } }, 'C’est parti ! ➡️'));
      Z.speak(t);
    };
    const ask = () => {
      if (n >= it.phrases.length) return reward(shell, it, 15, [`${it.phrases.length} phrases`, errors ? `${errors} essais en plus` : 'Zéro erreur ! 🔥']);
      shell.clear(); shell.setSteps(it.phrases.length, n);
      const words = parseSujet(it.phrases[n]);
      const mark = words.map(() => null);
      let tries = 0;
      const hint = h('div', { class: 'tip', style: { display: 'none' } });
      const line = h('div', { class: 'phrase mots' }, words.map((w, i) => {
        const el = h('button', { class: 'tap-mot', onclick: () => {
          Z.sfx.tap();
          mark[i] = mark[i] === null ? 'V' : mark[i] === 'V' ? 'S' : null;
          el.className = 'tap-mot' + (mark[i] === 'V' ? ' is-v' : mark[i] === 'S' ? ' is-s' : '');
        } }, w.w);
        return el;
      }));
      const plain = words.map(w => w.w).join(' ');
      const check = () => {
        const bad = words.some((w, i) => w.need ? mark[i] !== w.need : (mark[i] && mark[i] !== w.opt));
        if (!bad) {
          Z.sfx.good(); res[n] = mark.slice(); Z.save();
          const v = words.filter((w, i) => mark[i] === 'V').map(w => w.w).join(' ');
          const sj = words.filter((w, i) => mark[i] === 'S').map(w => w.w).join(' ').replace(/[,.]$/, '');
          n++;
          Z.speak(`Bravo ! Le verbe, c’est ${v.replace(/[,.]$/, '')}. Le sujet, c’est ${sj}.`).then(() => setTimeout(ask, 500));
          return;
        }
        tries++; errors++; Z.sfx.bad();
        const vWords = words.filter(w => w.need === 'V').map(w => w.w.replace(/[,.]$/, '')).join(' ');
        const sWords = words.filter(w => w.need === 'S').map(w => w.w).join(' ');
        const vOk = words.every((w, i) => (w.need === 'V') === (mark[i] === 'V') || (w.opt === 'V'));
        let t;
        if (tries >= 2) {
          t = `Regarde bien : le verbe, c’est « ${vWords} ». Qui est-ce qui ${vWords} ? « ${sWords} » : c’est le sujet.`;
          words.forEach((w, i) => { mark[i] = w.need; line.children[i].className = 'tap-mot' + (w.need === 'V' ? ' is-v' : w.need === 'S' ? ' is-s' : ''); });
        } else if (!vOk) t = 'Pas grave, essaie encore. Le verbe change quand on dit hier ou demain. Lequel ?';
        else t = `Le verbe est bon ! Maintenant, qui est-ce qui ${vWords} ? Ça, c’est le sujet, tous les mots du groupe.`;
        hint.style.display = ''; hint.textContent = '💡 ' + t;
        Z.speak(t);
      };
      shell.root.append(h('h2', null, `Phrase ${String.fromCharCode(97 + n)}.`),
        h('div', { class: 'card col' }, line, h('div', { class: 'row', style: { justifyContent: 'center' } }, Z.ear(plain, { natural: true }))),
        hint, h('button', { class: 'btn green wide', onclick: check }, '✅ Vérifier'));
      say(plain);
    };
    intro();
  }

  /* ---------- MATHADOR ---------- */
  /* la cible n'est pas écrite dans l'agenda : Jasmin (ou Maman) la tape une fois */
  const cibleOf = (it, wid) => it.cible || ((storeOf(wid).cible || {})[it.id]);
  function mathador(shell, it0) {
    const s = store();
    const c = cibleOf(it0, D().id);
    if (!c) return cibleSetup(shell, it0);
    const it = Object.assign({}, it0, { cible: c });
    let tiles, log, history, sel, op;
    const reset = () => { tiles = it.nombres.map((v, i) => ({ v, id: i })); log = []; history = []; sel = null; op = null; };
    reset();
    const OPS = [['+', (a, b) => a + b], ['−', (a, b) => a - b], ['×', (a, b) => a * b], ['÷', (a, b) => b && a % b === 0 ? a / b : null]];
    const best = () => tiles.reduce((m, t) => Math.abs(t.v - it.cible) < Math.abs(m - it.cible) ? t.v : m, tiles[0].v);
    const fmt = (v) => v.toLocaleString('fr-FR');
    let uid = 100;

    const draw = () => {
      shell.clear(); shell.setSteps(0, 0);
      const b = best(), gap = Math.abs(b - it.cible);
      shell.root.append(
        h('h2', null, '🔢 ' + it.titre),
        h('div', { class: 'card center col' },
          h('div', { class: 'hint' }, '🎯 Le nombre à atteindre'),
          h('div', { class: 'question' }, fmt(it.cible)),
          h('div', { class: 'ecart' + (gap === 0 ? ' pile' : '') }, gap === 0 ? '🎯 PILE DESSUS !' : `Ton meilleur : ${fmt(b)} · il manque ${fmt(gap)}`)),
        h('div', { class: 'hint center' }, sel === null ? '👆 Touche un nombre' : op === null ? 'Choisis une opération' : 'Touche le 2e nombre'),
        h('div', { class: 'tuiles-nb' }, tiles.map(t => h('button', {
          class: 'nb' + (sel === t.id ? ' sel' : ''), onclick: () => pickTile(t)
        }, fmt(t.v)))),
        h('div', { class: 'ops' }, OPS.map(([o]) => h('button', { class: 'op' + (op === o ? ' sel' : ''), disabled: sel === null, onclick: () => { Z.sfx.tap(); op = o; draw(); } }, o))),
        log.length ? h('div', { class: 'card calc' }, log.map(l => h('div', null, l))) : null,
        h('div', { class: 'row' },
          h('button', { class: 'btn ghost grow', disabled: !history.length, onclick: () => { Z.sfx.tap(); const p = history.pop(); tiles = p.tiles; log = p.log; sel = op = null; draw(); } }, '↩️ Annuler'),
          h('button', { class: 'btn ghost grow', onclick: () => { Z.sfx.tap(); reset(); draw(); } }, '🔄 Recommencer')),
        h('button', { class: 'btn green wide', disabled: !log.length, onclick: finish }, '✅ J’ai fini'));
    };
    const pickTile = (t) => {
      Z.sfx.tap();
      if (sel === null || op === null) { sel = sel === t.id ? null : t.id; draw(); return; }
      if (t.id === sel) return;
      const a = tiles.find(x => x.id === sel), f = OPS.find(o => o[0] === op)[1];
      const r = f(a.v, t.v);
      if (r === null || r < 0) {
        const msg = r === null ? 'Cette division ne tombe pas juste. Essaie autre chose !' : 'Ça donnerait un nombre négatif. Mets le plus grand en premier !';
        Z.pop(msg, 'soft'); Z.speak(msg); return;
      }
      history.push({ tiles: tiles.slice(), log: log.slice() });
      const line = `${fmt(a.v)} ${op} ${fmt(t.v)} = ${fmt(r)}`;
      log.push(line);
      tiles = tiles.filter(x => x.id !== a.id && x.id !== t.id).concat([{ v: r, id: uid++ }]);
      sel = op = null;
      Z.speak(line.replace('−', 'moins').replace('×', 'fois').replace('÷', 'divisé par').replace('+', 'plus').replace('=', 'égale').replace(/ | /g, ''));
      if (r === it.cible) { Z.sfx.win(); Z.confetti(120); }
      draw();
    };
    const finish = () => {
      const b = best();
      s.res[it.id] = { log: log.slice(), best: b }; Z.save();
      const gap = Math.abs(b - it.cible);
      reward(shell, it, gap === 0 ? 25 : 15, [gap === 0 ? `🎯 Pile ${fmt(it.cible)} !` : `Tu arrives à ${fmt(b)}, à ${fmt(gap)} de la cible`, `${log.length} calculs`]);
    };
    const t = `${it.consigne} Le nombre à atteindre, c’est ${it.cible}. Touche un nombre, puis une opération, puis un autre nombre. Le résultat devient un nouveau nombre. Chaque nombre ne sert qu’une fois.`;
    shell.clear();
    shell.root.append(h('h2', null, '🔢 ' + it.titre), Z.loulouSays(t, { speak: false }),
      h('div', { class: 'card center' }, h('div', { class: 'emoji-big' }, '🧮🎯')),
      h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.vroum(); draw(); } }, 'C’est parti ! ➡️'));
    Z.speak(t);
  }

  function cibleSetup(shell, it) {
    shell.clear(); shell.setSteps(0, 0);
    let entry = '';
    const disp = h('div', { class: 'entree' }, '?');
    const t = 'Quel est le nombre à atteindre ? Il est écrit au tableau ou dans ton cahier. Demande à Maman si tu ne sais pas. Tape-le ici.';
    shell.root.append(h('h2', null, '🔢 ' + it.titre), Z.loulouSays(t),
      h('div', { class: 'card center col' }, h('div', { class: 'hint' }, 'Les nombres : ' + it.nombres.join(' · ')), h('div', { class: 'hint' }, '🎯 Le nombre à atteindre :'), disp),
      h('div', { class: 'pave' }, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✅'].map(k => h('button', { class: 'touche' + (k === '✅' ? ' ok' : ''), onclick: () => {
        Z.sfx.tap();
        if (k === '⌫') entry = entry.slice(0, -1);
        else if (k === '✅') {
          if (!entry) return;
          const s = store(); s.cible = s.cible || {}; s.cible[it.id] = Number(entry); Z.save();
          return Z.go('devoir', it.id, isOld() ? D().id : undefined);
        } else if (entry.length < 7) entry += k;
        disp.textContent = entry ? Number(entry).toLocaleString('fr-FR') : '?';
      } }, k))),
      h('button', { class: 'btn ghost wide', onclick: back }, '⬅️ Mes devoirs'));
  }

  /* ---------- POÉSIE ---------- */
  const norm = (w) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  const tokens = (t) => t.replace(/[’']/g, ' ').replace(/-/g, ' ').split(/\s+/).map(norm).filter(Boolean);
  function lev(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  const same = (a, b) => a === b || (b.length >= 4 && lev(a, b) <= 1) || (b.length >= 7 && lev(a, b) <= 2);

  function poemLines(it) {
    const p = poemOf(it.titre) || {};
    if (!p.texte) return null;
    let lines = p.texte.split('\n').map(l => l.trim());
    while (lines.length && !lines[lines.length - 1]) lines.pop();
    if (p.part === '23' && !it.entier) {
      const real = lines.map((l, i) => l ? i : -1).filter(i => i >= 0);
      const keep = real[Math.ceil(real.length * 2 / 3) - 1];
      lines = lines.slice(0, keep + 1);
    }
    return lines;
  }

  function poesie(shell, it) {
    const lines = poemLines(it);
    if (!lines) return poemSetup(shell, it);
    let round = 0;
    /* disp = les mots affichés (« d’aimer »), words = les sons reconnus (« d », « aimer ») */
    const disp = [], words = [];
    lines.forEach((l, li) => l.split(/\s+/).filter(Boolean).forEach(w => {
      const ts = tokens(w);
      if (!ts.length) { if (disp.length) disp[disp.length - 1].t += ' ' + w; return; }
      const di = disp.length; disp.push({ t: w, line: li, toks: [] });
      ts.forEach(n => { disp[di].toks.push(words.length); words.push({ n, d: di }); });
    }));

    const menu = () => {
      shell.clear(); shell.setSteps(3, round);
      const t = round === 0 ? `Voici ta poésie : ${it.titre}, de ${it.auteur}. D’abord, écoute-la bien.` : round === 1 ? 'À toi ! Récite ta poésie. Si tu bloques, je te souffle les mots.' : 'Dernier tour : tu récites tout seul, sans aide. Tu es prêt ?';
      shell.root.append(h('h2', null, '📜 ' + it.titre), Z.loulouSays(t),
        h('div', { class: 'card col' },
          h('div', { class: round === 0 ? 'etape cur' : 'etape ok' }, round > 0 ? '✅' : '1️⃣', ' J’écoute la poésie'),
          h('div', { class: round === 1 ? 'etape cur' : round > 1 ? 'etape ok' : 'etape' }, round > 1 ? '✅' : '2️⃣', ' Je récite, avec de l’aide'),
          h('div', { class: round === 2 ? 'etape cur' : 'etape' }, '3️⃣', ' Je récite tout seul')),
        h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.vroum(); round === 0 ? listen() : recite(round === 1); } }, round === 0 ? '🎧 Écouter' : '🎤 Je récite'),
        round > 0 ? h('button', { class: 'btn ghost wide', onclick: () => { Z.sfx.tap(); round = 0; menu(); } }, '🎧 Réécouter la poésie') : null,
        h('button', { class: 'btn ghost wide small-btn', onclick: () => { Z.sfx.tap(); poemSetup(shell, it); } }, '⚙️ Pour Maman : changer le texte'));
    };

    const listen = async () => {
      shell.clear(); shell.setSteps(3, 0);
      const els = lines.map(l => l ? h('div', { class: 'vers' }, l) : h('div', { class: 'strophe' }));
      const skip = h('button', { class: 'btn green wide', onclick: () => { Z.stopSpeak(); stop = true; round = Math.max(round, 1); menu(); } }, 'J’ai bien écouté ➡️');
      shell.root.append(h('h2', null, '🎧 ' + it.titre), h('div', { class: 'hint center' }, it.auteur), h('div', { class: 'card poeme' }, els), skip);
      let stop = false;
      const my = Symbol(); listen.cur = my;
      await Z.wait(300);
      await say(`${it.titre}, de ${it.auteur}.`);
      for (let i = 0; i < lines.length; i++) {
        if (stop || listen.cur !== my || Z.current !== 'devoir') return;
        if (!lines[i]) { await Z.wait(500); continue; }
        els.forEach(e => e.classList.remove('lu')); els[i].classList.add('lu');
        els[i].scrollIntoView({ block: 'center', behavior: 'smooth' });
        await say(lines[i]);
        await Z.wait(250);
      }
      els.forEach(e => e.classList.remove('lu'));
    };

    const recite = (aide) => {
      killRecite();
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) return reciteSansMicro(aide);
      shell.clear(); shell.setSteps(3, aide ? 1 : 2);
      const state = words.map(() => '');   // '' | 'ok' | 'aide' | 'saute'
      const spans = disp.map(w => h('span', { class: 'mot-cache' }, w.t));
      const lineEls = lines.map((l, li) => l ? h('div', { class: 'vers' }, spans.filter((_, i) => disp[i].line === li).flatMap(s => [s, ' '])) : h('div', { class: 'strophe' }));
      const status = h('div', { class: 'micro' }, '🎤 J’écoute…');
      const paint = (p) => spans.forEach((s, di) => {
        const st = disp[di].toks.map(i => state[i]);
        const c = st.every(Boolean) ? (st.includes('aide') ? 'aide' : st.includes('saute') ? 'saute' : 'ok') : st.includes('aide') ? 'aide' : disp[di].toks.includes(p) ? 'next' : '';
        s.className = 'mot-cache' + (c ? ' ' + c : '');
      });
      let finals = [], session = '', p = 0, last = Date.now(), active = true, paused = false, rec = null, helping = false;

      const align = () => {
        const heard = tokens(finals.join(' ') + ' ' + session);
        let q = 0;
        const st = words.map((_, i) => state[i] === 'aide' ? 'aide' : '');
        for (const tok of heard) {
          for (let k = 0; k <= 2 && q + k < words.length; k++) {
            if (same(tok, words[q + k].n)) {
              for (let j = q; j < q + k; j++) if (!st[j]) st[j] = 'saute';
              if (st[q + k] !== 'aide') st[q + k] = 'ok';
              q = q + k + 1; break;
            }
          }
        }
        for (let i = 0; i < words.length; i++) state[i] = st[i];
        if (q > p) { p = q; last = Date.now(); }
        paint(p);
        const cur = spans[words[Math.min(p, words.length - 1)].d];
        if (cur) cur.scrollIntoView({ block: 'center', behavior: 'smooth' });
        if (p >= words.length) end();
      };
      const startRec = () => {
        if (!active || paused) return;
        const r = rec = new SR(); r.lang = 'fr-FR'; r.continuous = true; r.interimResults = true;
        r.onresult = (e) => { if (r !== rec) return; let t = ''; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript + ' '; session = t; align(); };
        r.onend = () => { if (r !== rec) return; if (session) finals.push(session); session = ''; rec = null; if (active && !paused) setTimeout(startRec, 150); };
        rec.onerror = (e) => { if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { active = false; status.textContent = '🚫 Le micro est bloqué. Autorise le micro, ou récite à Maman.'; } };
        try { rec.start(); status.textContent = '🎤 J’écoute…'; } catch (e) { }
      };
      const help = async () => {
        if (helping || p >= words.length) return;
        helping = true; paused = true;
        const old = rec; rec = null; if (session) finals.push(session); session = '';
        try { old && old.abort(); } catch (e) { }
        status.textContent = '🤫 Je te souffle…';
        /* on souffle les 3 mots suivants du même vers */
        const d0 = words[p].d, li = disp[d0].line, ds = [];
        for (let d = d0; d < disp.length && ds.length < 3 && disp[d].line === li; d++) ds.push(d);
        ds.forEach(d => disp[d].toks.forEach(i => { if (i >= p) state[i] = 'aide'; })); paint(p);
        await say(ds.map(d => disp[d].t).join(' '));
        /* il répète les mots soufflés, puis continue */
        last = Date.now(); paused = false; helping = false; status.textContent = '🎤 J’écoute…'; startRec();
      };
      const watch = setInterval(() => {
        if (!active) return clearInterval(watch);
        if (Z.current !== 'devoir' || !shell.root.isConnected) { stopAll(); return; }
        if (aide && !paused && Date.now() - last > 6000) help();
      }, 500);
      const stopAll = () => { active = false; clearInterval(watch); const r = rec; rec = null; try { r && r.abort(); } catch (e) { } };
      stopRecite = stopAll;
      const end = () => {
        if (!active) return; stopAll();
        const ok = state.filter(x => x === 'ok').length, aid = state.filter(x => x === 'aide').length;
        words.forEach((_, i) => { if (!state[i]) state[i] = 'saute'; }); paint(-1);
        spans.forEach(s => s.classList.add('vu'));
        const pct = Math.round(ok / words.length * 100);
        const t = aide
          ? `Bravo ! Tu as dit ${ok} mots tout seul${aid ? `, et je t’ai aidé pour ${aid} mots` : ''}. Maintenant, essaie sans aide !`
          : pct >= 90 ? `Waouh ! Tu connais ta poésie par cœur ! ${pct} pour cent des mots !` : `Bien joué ! Tu as trouvé ${pct} pour cent des mots. Les mots en rouge sont à revoir.`;
        Z.speak(t);
        status.textContent = aide ? `✅ ${ok} mots tout seul · 🤫 ${aid} soufflés` : `⭐ ${pct} % des mots`;
        btns.innerHTML = '';
        if (aide) btns.append(h('button', { class: 'btn orange wide', onclick: () => { round = 2; menu(); } }, '➡️ Tour 3 : tout seul'),
          h('button', { class: 'btn ghost wide', onclick: () => recite(true) }, '🔁 Encore avec de l’aide'));
        else {
          store().res[it.id] = { pct }; Z.save();
          btns.append(h('button', { class: 'btn green wide', onclick: () => reward(shell, it, pct >= 90 ? 30 : 20, [`${pct} % des mots récités tout seul`]) }, '🏁 Terminer'),
            h('button', { class: 'btn ghost wide', onclick: () => recite(false) }, '🔁 Recommencer'));
        }
      };
      const btns = h('div', { class: 'col' },
        aide ? h('button', { class: 'btn gold wide', onclick: () => help() }, '🆘 Aide-moi') : null,
        h('button', { class: 'btn green wide', onclick: () => end() }, '✅ J’ai fini'));
      shell.root.append(h('h2', null, aide ? '🎤 Je récite (avec aide)' : '🎤 Je récite tout seul'), status,
        h('div', { class: 'card poeme recit' }, lineEls), btns);
      paint(0);
      Z.speak(aide ? 'Vas-y, je t’écoute ! Commence par le titre si tu veux.' : 'Vas-y, tout seul ! Je t’écoute.').then(() => { last = Date.now(); startRec(); });
    };

    /* Sans micro (iPhone, ou micro refusé) : Maman écoute et valide chaque vers */
    const reciteSansMicro = (aide) => {
      shell.clear(); shell.setSteps(3, aide ? 1 : 2);
      let ok = 0;
      const real = lines.filter(Boolean);
      const t = 'Le micro ne marche pas ici. Récite à Maman : elle appuie sur le pouce à chaque vers bien dit.';
      shell.root.append(h('h2', null, '🎤 Récite à Maman'), Z.loulouSays(t),
        h('div', { class: 'card col' }, real.map((l, i) => {
          const txt = h('span', { class: 'grow mot-cache' }, l);
          return h('div', { class: 'row vers-m' }, txt,
            aide ? h('button', { class: 'ear', onclick: () => { txt.classList.add('aide'); say(l); } }, '🆘') : null,
            h('button', { class: 'ear', onclick: (e) => { if (!e.target.dataset.v) { ok++; e.target.dataset.v = 1; } txt.classList.add('ok'); Z.sfx.good(); } }, '👍'));
        })),
        h('button', { class: 'btn green wide', onclick: () => {
          if (aide) { round = 2; menu(); return; }
          const pct = Math.round(ok / real.length * 100); store().res[it.id] = { pct }; Z.save();
          reward(shell, it, pct >= 90 ? 30 : 20, [`${ok} vers sur ${real.length}`]);
        } }, aide ? '➡️ Tour 3 : tout seul' : '🏁 Terminer'));
    };
    menu();
  }

  /* Maman colle le texte de la poésie (une seule fois) */
  function poemSetup(shell, it) {
    shell.clear();
    const p = poemOf(it.titre) || {};
    const ta = h('textarea', { rows: 12, placeholder: 'Un vers par ligne.\nUne ligne vide entre deux strophes.' });
    ta.value = p.texte || '';
    const part = h('select', null, h('option', { value: 'tout' }, 'En entier'), h('option', { value: '23' }, 'Les 2 premiers tiers'));
    part.value = p.part || 'tout';
    shell.root.append(h('div', { class: 'parent col' },
      h('h2', null, '⚙️ Pour Maman : la poésie'),
      h('p', null, `Tape ou colle le texte de « ${it.titre} » (${it.auteur}), tel qu’il est dans le cahier de Jasmin. Il reste seulement sur ce téléphone.`),
      h('label', null, 'Texte de la poésie'), ta,
      h('label', null, 'À apprendre'), part,
      h('button', { class: 'btn green wide', onclick: () => {
        if (ta.value.trim().split('\n').filter(l => l.trim()).length < 2) { alert('Il faut au moins 2 vers.'); return; }
        poemOf(it.titre); Z.state.poemes[it.titre] = { titre: it.titre, texte: ta.value, part: part.value }; Z.save(); Z.go('devoir', it.id, isOld() ? D().id : undefined);
      } }, '💾 Enregistrer'),
      h('button', { class: 'btn ghost wide', onclick: back }, 'Annuler')));
  }

  /* ---------- MOTS À APPRENDRE : joués dans le Garage des Mots avec Doudou ---------- */
  const wordsOf = (it) => it.mots.map(m => typeof m === 'string' ? ZDATA.words.find(w => w.id === m) : Object.assign({ prio: true }, m)).filter(Boolean);
  /* les mots des devoirs reviennent ensuite en révision dans le Garage des Mots */
  Z.homeworkWords = () => [window.ZDEVOIRS].concat(window.ZARCHIVES || [])
    .flatMap(w => w.items.filter(i => i.type === 'mots')).flatMap(i => i.mots.filter(m => typeof m !== 'string').map(m => Object.assign({ prio: true }, m)));
  function mots(shell, it) {
    const wk = D(), old = isOld();
    Z.go('mots', {
      words: wordsOf(it), titre: it.titre,
      onEnd: () => { storeOf(wk.id).done[it.id] = true; Z.save(); },
      back: () => Z.go('devoirs', old ? wk.id : undefined)
    });
  }

  /* ---------- TABLEAU DE NOMBRES + MULTIPLES ---------- */
  function suite(shell, it) {
    const s = store();
    const res = s.res[it.id] = s.res[it.id] || {};
    res.fill = res.fill || {}; res.marks = res.marks || {}; res.rep = res.rep || {};
    const R = it.lignes, C = it.colonnes, val = (r, c) => c * R + r + 1;
    const given = new Set(it.donnes);
    const todo = []; for (let c = 0; c < C; c++) for (let r = 0; r < R; r++) if (!given.has(val(r, c))) todo.push(val(r, c));
    const steps = 1 + it.questions.length;
    const known = (v) => given.has(v) || res.fill[v];
    const ord = (n) => n === 1 ? '1re' : n + 'e';

    /* le tableau ; opts.cur = case en cours, opts.tap = toucher une case, opts.rows = lignes surlignées */
    const grid = (opts = {}) => h('div', { class: 'grille-wrap' }, h('table', { class: 'grille' }, Array.from({ length: R }, (_, r) =>
      h('tr', { class: (opts.rows || []).includes(r + 1) ? 'row-on' : '' },
        opts.labels ? h('th', null, ord(r + 1)) : null,
        Array.from({ length: C }, (_, c) => {
          const v = val(r, c), m = res.marks[v] || '';
          const td = h('td', { class: [given.has(v) ? 'donne' : res.fill[v] ? 'rempli' : '', v === opts.cur ? 'cur' : '', m ? 'm-' + m : '', (opts.bad || []).includes(v) ? 'a-revoir' : ''].join(' ').trim(),
            onclick: opts.tap ? () => opts.tap(v, td) : null }, known(v) ? String(v) : v === opts.cur ? (opts.entry || '?') : '');
          return td;
        })))));

    const intro = () => {
      shell.clear(); shell.setSteps(steps, 0);
      const t = `${it.consigne} On compte de 1 en 1, de haut en bas, colonne par colonne : 1, 2, 3, 4, puis on passe à la colonne suivante. Et dans chaque ligne, on ajoute 4 : 1, 5, 9, 13…`;
      shell.root.append(h('h2', null, '🧮 ' + it.titre), Z.loulouSays(t), grid(),
        h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.vroum(); todo.every(v => res.fill[v]) ? question(0) : fill(); } }, 'C’est parti ! ➡️'));
    };

    const fill = () => {
      const v = todo.find(x => !res.fill[x]);
      if (v === undefined) return question(0);
      shell.clear(); shell.setSteps(steps, 0);
      let entry = '', tries = 0;
      const box = h('div');
      const tip = h('div', { class: 'tip', style: { display: 'none' } });
      const draw = () => { box.innerHTML = ''; box.append(grid({ cur: v, entry: entry || '?' })); };
      const press = (k) => {
        Z.sfx.tap();
        if (k === '⌫') entry = entry.slice(0, -1);
        else if (k === '✅') return check();
        else if (entry.length < 3) entry += k;
        draw();
      };
      const check = () => {
        if (!entry) return;
        if (Number(entry) === v) {
          res.fill[v] = true; Z.save(); Z.sfx.good();
          Z.speak(String(v)).then(() => fill());
          return;
        }
        tries++; Z.sfx.bad(); entry = ''; draw();
        const t = tries >= 2 ? `C’est ${v}. Tape ${v}.` : `Pas grave, essaie encore. On compte de 1 en 1 : avant cette case, il y a ${v - 1}. Après ${v - 1}, il y a… ?`;
        tip.style.display = ''; tip.textContent = '💡 ' + t; Z.speak(t);
      };
      draw();
      shell.root.append(h('h2', null, `🧮 Complète le tableau (${todo.filter(x => res.fill[x]).length + 1}/${todo.length})`), box,
        h('div', { class: 'hint center' }, 'Tape le nombre de la case jaune :'), tip,
        h('div', { class: 'pave' }, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✅'].map(k => h('button', { class: 'touche' + (k === '✅' ? ' ok' : ''), onclick: () => press(k) }, k))));
    };

    const question = (qi) => {
      if (qi >= it.questions.length) return reward(shell, it, 20, [`${todo.length} nombres écrits`, 'Les multiples de 2, 3, 4 et 5 ✅']);
      const q = it.questions[qi];
      shell.clear(); shell.setSteps(steps, qi + 1);
      let tries = 0;
      const tip = h('div', { class: 'tip', style: { display: 'none' } });
      const fail = (t) => { tries++; Z.sfx.bad(); tip.style.display = ''; tip.textContent = '💡 ' + t; Z.speak(t); };
      const win = (t) => { Z.sfx.good(); Z.save(); Z.speak(t).then(() => setTimeout(() => question(qi + 1), 400)); };
      const title = h('h2', null, q.q);

      if (q.type === 'lignes' || q.type === 'nombres') {
        const opts = q.type === 'lignes' ? Array.from({ length: R }, (_, r) => r + 1) : q.choix;
        const picked = new Set();
        const box = h('div');
        const draw = () => { box.innerHTML = ''; box.append(grid({ labels: q.type === 'lignes', rows: q.type === 'lignes' ? [...picked] : [] })); };
        const btns = h('div', { class: 'choices' }, opts.map(o => {
          const b = h('button', { class: 'choice mot', onclick: () => { Z.sfx.tap(); picked.has(o) ? picked.delete(o) : picked.add(o); b.classList.toggle('picked'); draw(); } },
            q.type === 'lignes' ? `${ord(o)} ligne` : String(o));
          b.dataset.o = o; return b;
        }));
        draw();
        shell.root.append(title, Z.loulouSays(q.q.replace(/^[a-d]\. /, ''), { speak: true }), box, h('div', { class: 'hint center' }, 'Tu peux en choisir plusieurs.'), btns, tip,
          h('button', { class: 'btn green wide', onclick: () => {
            const ok = q.ok.length === picked.size && q.ok.every(x => picked.has(x));
            if (ok) { res.rep[qi] = [...picked].sort((a, b) => a - b); return win('Bravo ! ' + q.rep); }
            if (tries >= 1) [...btns.children].forEach(b => { if (q.ok.includes(Number(b.dataset.o))) b.classList.add('hint-good'); });
            fail(tries >= 1 ? `${q.aide} Les bonnes réponses clignotent.` : `Pas tout à fait. ${q.aide}`);
          } }, '✅ Vérifier'));
        return;
      }

      if (q.type === 'entoure') {
        const want = (v) => (v % q.rouge === 0 ? 'R' : '') + (v % q.vert === 0 ? 'V' : '');
        const all = []; for (let c = 0; c < C; c++) for (let r = 0; r < R; r++) all.push(val(r, c));
        let bad = [];
        const box = h('div');
        const cycle = { '': 'R', R: 'V', V: 'RV', RV: '' };
        const draw = () => { box.innerHTML = ''; box.append(grid({ bad, tap: (v) => { Z.sfx.tap(); res.marks[v] = cycle[res.marks[v] || '']; if (!res.marks[v]) delete res.marks[v]; bad = bad.filter(x => x !== v); draw(); } })); };
        draw();
        const t = `${q.q.replace(/^c\. /, '')} Touche une case une fois : rouge. Deux fois : vert. Trois fois : rouge et vert. Astuce : dans la table de 3, on additionne les chiffres. Dans la table de 5, ça finit par 0 ou par 5.`;
        shell.root.append(title, Z.loulouSays(t),
          h('div', { class: 'card rule' },
            h('div', null, '👆 1 fois → ', h('span', { class: 'leg m-R' }, '3'), ' rouge = table de 3'),
            h('div', null, '👆👆 2 fois → ', h('span', { class: 'leg m-V' }, '5'), ' vert = table de 5'),
            h('div', null, '👆👆👆 3 fois → ', h('span', { class: 'leg m-RV' }, '15'), ' les deux')),
          box, tip,
          h('button', { class: 'btn green wide', onclick: () => {
            const wrong = all.filter(v => (res.marks[v] || '') !== want(v));
            if (!wrong.length) return win('Bravo ! Tous les multiples de 3 sont en rouge, et tous les multiples de 5 en vert.');
            if (tries >= 2) { all.forEach(v => { const w = want(v); if (w) res.marks[v] = w; else delete res.marks[v]; }); bad = []; draw(); fail('Regarde bien la correction, puis appuie encore sur Vérifier.'); return; }
            if (tries >= 1) { bad = wrong; draw(); }
            fail(tries >= 1 ? `Les cases qui clignotent sont à corriger. Table de 3 : 3, 6, 9, 12, 15… Table de 5 : 5, 10, 15, 20…` : `Presque ! Il reste ${wrong.length} case${wrong.length > 1 ? 's' : ''} à corriger. Table de 3 : 3, 6, 9, 12… Table de 5 : ça finit par 0 ou par 5.`);
          } }, '✅ Vérifier'));
      }
    };
    intro();
  }

  /* ---------- LES GROUPES DE VERBES ---------- */
  function groupes(shell, it) {
    const list = Z.shuffle(it.verbes);
    let n = 0, errors = 0;
    const ord = (g) => g === 1 ? '1er' : g + 'e';
    const why = ([v, g, kind]) => {
      if (kind === 'aller') return 'Piège ! Aller finit par -er, mais c’est le seul verbe en -er du 3e groupe.';
      if (g === 1) return `${v} finit par -er : c’est le 1er groupe.`;
      if (g === 2) return `Dis « nous » : nous ${v.slice(0, -2)}issons. Avec -issons, c’est le 2e groupe.`;
      if (kind === 'ir3') return `Dis « nous » : nous ${v.slice(0, -2)}ons, pas « nous ${v.slice(0, -2)}issons ». Donc c’est le 3e groupe.`;
      return `${v} ne finit pas par -er, et ce n’est pas un verbe en -issons : c’est le 3e groupe, tous les autres verbes.`;
    };
    const intro = () => {
      shell.clear(); shell.setSteps(list.length, 0);
      const t = 'Voici la leçon. ' + it.lecon.map(([g, r, e]) => `${g} : ${r}. Par exemple : ${e.replace('…', '')}.`).join(' ');
      shell.root.append(h('h2', null, '📘 ' + it.titre), Z.loulouSays(it.consigne),
        h('div', { class: 'card col lecon' }, it.lecon.map(([g, r, e], i) => h('div', { class: 'lecon-g' + (i === 2 ? ' focus' : '') },
          h('div', { class: 'lecon-t' }, g), h('div', null, r), h('div', { class: 'hint' }, e))), Z.ear(t)),
        h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.vroum(); ask(); } }, 'Je m’entraîne ➡️'));
      Z.speak(t);
    };
    const ask = () => {
      if (n >= list.length) return reward(shell, it, 15, [`${list.length} verbes rangés`, errors ? `${errors} petite${errors > 1 ? 's' : ''} erreur${errors > 1 ? 's' : ''}, corrigée${errors > 1 ? 's' : ''}` : 'Zéro erreur ! 🔥']);
      shell.clear(); shell.setSteps(list.length, n);
      const cur = list[n], [v, g] = cur;
      let tries = 0;
      const tip = h('div', { class: 'tip', style: { display: 'none' } });
      const grid = h('div', { class: 'choices une-col' }, [1, 2, 3].map(k => {
        const b = h('button', { class: 'choice mot', onclick: () => {
          if (b.classList.contains('bad') || grid.dataset.done) return;
          tries++;
          if (k === g) {
            grid.dataset.done = '1'; b.classList.add('good'); Z.sfx.good(); n++;
            Z.speak(`Bravo ! ${v}, ${ord(g)} groupe.`).then(() => setTimeout(ask, 400));
          } else {
            errors++; b.classList.add('bad'); Z.sfx.bad();
            if (tries >= 2) [...grid.children][g - 1].classList.add('hint-good');
            tip.style.display = ''; tip.textContent = '💡 ' + why(cur);
            Z.speak((tries >= 2 ? '' : 'Pas grave, essaie encore. ') + why(cur));
          }
        } }, `${ord(k)} groupe`);
        return b;
      }));
      shell.root.append(h('h2', null, 'Dans quel groupe ?'),
        h('div', { class: 'card center row', style: { justifyContent: 'center' } }, h('div', { class: 'question' }, v), Z.ear(v, { natural: true })),
        grid, tip);
      Z.speak(`${v} ?`, { natural: true });
    };
    intro();
  }

  /* ---------- UNE TABLE : jouée dans le Grand Prix avec Moezeh ---------- */
  function table(shell, it) {
    const wk = D(), old = isOld();
    Z.go('tables', {
      table: it.table,
      onEnd: () => { storeOf(wk.id).done[it.id] = true; Z.save(); },
      back: () => Z.go('devoirs', old ? wk.id : undefined)
    });
  }

  /* ---------- CONSTRUIRE DES PHRASES (groupe sujet) : rien à écrire, on choisit ---------- */
  function phrases(shell, it) {
    const s = store();
    const res = s.res[it.id] = s.res[it.id] || {};
    const rounds = it.sortes;
    let n = 0, errors = 0;
    const gsLine = (gs, fin) => h('div', { class: 'phrase' }, h('span', { class: 'is-s' }, gs), ' ', fin ? h('span', null, fin) : h('span', { class: 'trou' }, '…'));
    const intro = () => {
      shell.clear(); shell.setSteps(rounds.length, 0);
      const t = `${it.consigne} Le groupe sujet, c’est qui fait l’action. Il est souvent au début de la phrase, avant le verbe. Tu vas fabriquer 3 phrases avec des boutons, puis tu les recopieras dans ton cahier.`;
      shell.root.append(h('h2', null, '🧩 ' + it.titre), Z.loulouSays(t),
        h('div', { class: 'card rule' }, rounds.map(r => h('div', null, h('b', null, r.nom), ' : ', h('span', { class: 'is-s' }, r.ex)))),
        h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.vroum(); ask(); } }, 'C’est parti ! ➡️'));
    };
    const ask = () => {
      if (n >= rounds.length) return bilan();
      const r = rounds[n];
      shell.clear(); shell.setSteps(rounds.length, n);
      let tries = 0;
      const tip = h('div', { class: 'tip', style: { display: 'none' } });
      const others = rounds.filter(x => x !== r).map(x => ({ gs: x.sujets[Z.rand(x.sujets.length)][0], k: x }));
      const opts = Z.shuffle(r.sujets.map(([gs]) => ({ gs, k: r })).concat(others));
      const grid = h('div', { class: 'choices une-col' }, opts.map(o => {
        const b = h('button', { class: 'choice mot', onclick: () => {
          if (b.classList.contains('bad') || grid.dataset.done) return;
          tries++;
          if (o.k === r) { grid.dataset.done = '1'; b.classList.add('good'); Z.sfx.good(); Z.speak(`Oui ! ${o.gs}, c’est ${r.nom}.`, { natural: true }).then(() => finPhrase(r, o.gs)); return; }
          errors++; b.classList.add('bad'); Z.sfx.bad();
          const t = `« ${o.gs} », c’est ${o.k.nom}. Ici, on cherche ${r.nom}. ${r.regle}`;
          if (tries >= 2) [...grid.children].forEach((x, i) => { if (opts[i].k === r) x.classList.add('hint-good'); });
          tip.style.display = ''; tip.textContent = '💡 ' + t; Z.speak((tries >= 2 ? '' : 'Pas grave, essaie encore. ') + t);
        } }, o.gs);
        return b;
      }));
      const t = `Phrase ${n + 1}. Le groupe sujet doit être ${r.nom}. ${r.regle} Choisis ton groupe sujet.`;
      shell.root.append(h('h2', null, `Phrase ${n + 1} : ${r.nom}`), Z.loulouSays(t),
        h('div', { class: 'hint center' }, 'Choisis ton groupe sujet :'), grid, tip);
    };
    const finPhrase = (r, gs) => {
      shell.clear(); shell.setSteps(rounds.length, n);
      const fins = r.sujets.find(x => x[0] === gs)[1];
      const t = `${gs}… Que fait ${r.k === 'GN' || r.k === 'INF' ? 'ton groupe sujet' : 'ton sujet'} ? Choisis la fin de ta phrase.`;
      shell.root.append(h('h2', null, 'Termine ta phrase'),
        h('div', { class: 'card row' }, gsLine(gs)), Z.loulouSays(t),
        h('div', { class: 'choices une-col' }, fins.map(f => h('button', { class: 'choice mot', onclick: () => {
          Z.sfx.good();
          res[r.k] = { gs, fin: f }; Z.save();
          const phrase = `${gs} ${f}`;
          shell.clear();
          const t2 = `Ta phrase : ${phrase} Le groupe sujet, c’est « ${gs} » : c’est ${r.nom}.`;
          shell.root.append(h('h2', null, '✨ Ta phrase'), h('div', { class: 'card row' }, gsLine(gs, f), Z.ear(phrase, { natural: true })),
            h('div', { class: 'tip' }, `Le groupe sujet (souligné en bleu) est ${r.nom}.`),
            h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.vroum(); n++; ask(); } }, n + 1 < rounds.length ? 'Phrase suivante ➡️' : 'Voir mes 3 phrases ➡️'));
          Z.speak(t2, { natural: true });
        } }, f))));
    };
    const bilan = () => {
      shell.clear(); shell.setSteps(rounds.length, rounds.length);
      const t = 'Voici tes 3 phrases. Recopie-les dans ton cahier, et souligne le groupe sujet en bleu !';
      shell.root.append(h('h2', null, '📝 Mes 3 phrases'), Z.loulouSays(t),
        h('div', { class: 'card col' }, rounds.map((r, i) => res[r.k] ? h('div', null, h('div', { class: 'hint' }, `${i + 1}. ${r.nom}`), gsLine(res[r.k].gs, res[r.k].fin)) : null)),
        h('button', { class: 'btn green wide', onclick: () => reward(shell, it, 15, ['3 phrases construites', errors ? `${errors} petite${errors > 1 ? 's' : ''} erreur${errors > 1 ? 's' : ''}, corrigée${errors > 1 ? 's' : ''}` : 'Zéro erreur ! 🔥', '✍️ À recopier dans le cahier']) }, '✅ Je les ai recopiées'));
    };
    intro();
  }

  /* ---------- CONJUGAISON : la leçon lue, puis on choisit la bonne forme ---------- */
  const PRON = ['je', 'tu', 'il, elle, on', 'nous', 'vous', 'ils, elles'];
  const PRON1 = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];
  function conjug(shell, it) {
    const s = store();
    const res = s.res[it.id] = s.res[it.id] || {};
    let vi = 0, errors = 0;
    const tableau = (v, cur) => h('div', { class: 'card col lecon conj' }, v.formes.map((f, i) => h('div', { class: 'conj-l' + (i === cur ? ' cur' : '') },
      h('span', { class: 'conj-p' }, PRON[i]), ' ', h('b', null, cur === undefined || i !== cur ? f : '…'))));
    const lecon = () => {
      if (vi >= it.verbes.length) return reward(shell, it, 20, [it.verbes.map(v => v.inf).join(' et ') + ' au ' + it.temps, errors ? `${errors} petite${errors > 1 ? 's' : ''} erreur${errors > 1 ? 's' : ''}, corrigée${errors > 1 ? 's' : ''}` : 'Zéro erreur ! 🔥']);
      const v = it.verbes[vi];
      shell.clear(); shell.setSteps(it.verbes.length * 6, vi * 6);
      const lu = `Le verbe ${v.inf}, au ${it.temps}. ` + v.formes.map((f, i) => `${PRON1[i]} ${f}`).join(', ') + '. ' + v.astuce;
      shell.root.append(h('h2', null, `🔁 ${v.inf[0].toUpperCase() + v.inf.slice(1)} (${v.groupe === 1 ? '1er' : v.groupe + 'e'} groupe)`),
        Z.loulouSays(v.astuce, { speak: false }), tableau(v),
        h('div', { class: 'row', style: { justifyContent: 'center' } }, Z.ear(lu, { natural: true })),
        h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.vroum(); quiz(v); } }, 'Je m’entraîne ➡️'));
      Z.speak(lu, { natural: true });
    };
    const quiz = (v) => {
      const order = Z.shuffle([0, 1, 2, 3, 4, 5]);
      let q = 0;
      const next = () => {
        if (q >= order.length) { vi++; return lecon(); }
        const p = order[q], good = v.formes[p];
        shell.clear(); shell.setSteps(it.verbes.length * 6, vi * 6 + q);
        let tries = 0;
        const tip = h('div', { class: 'tip', style: { display: 'none' } });
        const pool = [...new Set(v.formes.concat(v.faux))].filter(x => x !== good);
        const opts = Z.shuffle([good, ...Z.shuffle(pool).slice(0, 3)]);
        const grid = h('div', { class: 'choices' }, opts.map(o => {
          const b = h('button', { class: 'choice mot', onclick: () => {
            if (b.classList.contains('bad') || grid.dataset.done) return;
            tries++;
            if (o === good) {
              grid.dataset.done = '1'; b.classList.add('good'); Z.sfx.good();
              res[v.inf + p] = tries; Z.save(); q++;
              Z.speak(`${PRON1[p]} ${good}`, { natural: true }).then(() => setTimeout(next, 400)); return;
            }
            errors++; b.classList.add('bad'); Z.sfx.bad();
            if (tries >= 2) [...grid.children].forEach((x, i) => { if (opts[i] === good) x.classList.add('hint-good'); });
            tip.style.display = ''; tip.textContent = '💡 ' + v.astuce;
            Z.speak((tries >= 2 ? `Il faut écrire ${good}. ` : 'Pas grave, essaie encore. ') + v.astuce);
          } }, o);
          return b;
        }));
        shell.root.append(h('h2', null, `${v.inf} au ${it.temps}`),
          h('div', { class: 'card center row', style: { justifyContent: 'center' } }, h('div', { class: 'question' }, `${PRON[p]} …`), Z.ear(`${v.inf}, avec ${PRON1[p]}`)),
          h('div', { class: 'hint center' }, 'Choisis la bonne forme :'), grid, tip);
        Z.speak(`${v.inf}, avec ${PRON1[p]} ?`);
      };
      next();
    };
    lecon();
  }

  /* ---------- MESURES DE LONGUEUR : le tableau de conversion ---------- */
  const COLS = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'];
  const NOMS = ['kilomètre', 'hectomètre', 'décamètre', 'mètre', 'décimètre', 'centimètre', 'millimètre'];
  const parleMesure = (q) => q.replace(/(\d) (\d)/g, '$1$2').replace(/([\d,]+) (km|hm|dam|m|dm|cm|mm)\b/g, (_, n, u) =>
    n.replace(',', ' virgule ') + ' ' + NOMS[COLS.indexOf(u)] + (Number(n.replace(',', '.')) >= 2 ? 's' : ''));
  const nomU = (u) => NOMS[COLS.indexOf(u)] + 's';
  /* les chiffres de chaque partie dans les colonnes */
  const placer = (cells, [nb, u]) => {
    const [ent, dec = ''] = nb.split(','), ui = COLS.indexOf(u);
    ent.split('').reverse().forEach((d, i) => { cells[ui - i] = d; });
    dec.split('').forEach((d, i) => { cells[ui + 1 + i] = d; });
  };
  /* ce qu'il faut ajouter (des 0) et la réponse lue dans le tableau */
  function conversion(l) {
    const cells = {}; l.parts.forEach(p => placer(cells, p));
    const idx = Object.keys(cells).map(Number), first = Math.min(...idx), last = Math.max(...idx), t = COLS.indexOf(l.vers);
    const zeros = []; for (let i = first; i <= t; i++) if (cells[i] === undefined) zeros.push(i);
    for (let i = first; i <= last; i++) if (cells[i] === undefined && i > t) zeros.push(i);
    const full = Object.assign({}, cells); zeros.forEach(i => { full[i] = '0'; });
    let ent = '', dec = '';
    for (let i = first; i <= Math.max(t, last); i++) (i <= t ? ent += full[i] : dec += full[i]);
    dec = dec.replace(/0+$/, '');
    return { cells, full, zeros, virgule: t < last && dec ? t : null, rep: ent + (dec ? ',' + dec : ''), first, t };
  }
  const normRep = (x) => x.replace(/\s/g, '').replace(/^0+(?=\d)/, '').replace(/(,\d*?)0+$/, '$1').replace(/,$/, '');
  Z._conversion = conversion; /* pour les vérifications */

  function mesures(shell, it) {
    const s = store();
    const res = s.res[it.id] = s.res[it.id] || {};
    let errors = 0;
    const L = it.lignes;
    /* le tableau, comme sur la feuille : une ligne par mesure */
    const tab = (cur, show, opts = {}) => h('div', { class: 'grille-wrap' }, h('table', { class: 'grille mesures' },
      h('tr', null, COLS.map((c, ci) => h('th', { class: (opts.tapCol ? 'tap' : '') + (opts.hl === ci ? ' hl' : ''), onclick: opts.tapCol ? () => opts.tapCol(ci) : null }, c))),
      L.map((l, li) => {
        const cells = li === cur ? show : (res[li] ? conversion(l).full : {});
        const v = li === cur ? opts.virgule : (res[li] ? conversion(l).virgule : null);
        return h('tr', { class: li === cur ? 'row-on' : '' }, COLS.map((c, ci) => h('td', {
          class: [(cells[ci] !== undefined ? 'rempli' : ''), (v === ci ? 'virg' : ''), (opts.zero === ci ? 'cur' : '')].join(' ').trim(),
          onclick: opts.tapCol ? () => opts.tapCol(ci) : null
        }, cells[ci] !== undefined ? cells[ci] : '')));
      })));

    const intro = () => {
      shell.clear(); shell.setSteps(L.length, 0);
      const t = `${it.consigne} Le chiffre des unités va dans la colonne de l’unité. Puis on lit le tableau jusqu’à la colonne qu’on veut, en ajoutant des zéros s’il le faut. Kilo, hecto, déca, mètre, déci, centi, milli.`;
      shell.root.append(h('h2', null, '📏 ' + it.titre), Z.loulouSays(t), tab(-1, {}),
        h('div', { class: 'card rule' }, h('div', null, '1️⃣ Le chiffre des ', h('b', null, 'unités'), ' → la colonne de l’unité'),
          h('div', null, '2️⃣ Des ', h('b', null, '0'), ' dans les cases vides'), h('div', null, '3️⃣ Je lis jusqu’à la colonne demandée')),
        h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.vroum(); ligne(); } }, 'C’est parti ! ➡️'));
    };

    const ligne = () => {
      const li = L.findIndex((_, i) => !res[i]);
      if (li < 0) return reward(shell, it, 20, [`${L.length} mesures converties`, errors ? `${errors} petite${errors > 1 ? 's' : ''} erreur${errors > 1 ? 's' : ''}, corrigée${errors > 1 ? 's' : ''}` : 'Zéro erreur ! 🔥']);
      const l = L[li], cv = conversion(l), show = {};
      let pi = 0;
      const head = () => h('div', { class: 'card center row', style: { justifyContent: 'center' } },
        h('div', { class: 'question q-mes' }, `${l.q} = … ${l.vers}`.replace(/(\d|…) (?=\d|[a-z]+\b)/g, '$1\u00a0')), Z.ear(`${parleMesure(l.q)}, égale combien de ${nomU(l.vers)} ?`));
      /* 1. placer le chiffre des unités de chaque partie */
      const place = () => {
        if (pi >= l.parts.length) return zeros();
        const [nb, u] = l.parts[pi], ent = nb.split(',')[0], unite = ent[ent.length - 1];
        shell.clear(); shell.setSteps(L.length, li);
        let tries = 0;
        const tip = h('div', { class: 'tip', style: { display: 'none' } });
        const box = h('div');
        const draw = (hl) => { box.innerHTML = ''; box.append(tab(li, show, { tapCol, hl })); };
        const tapCol = (ci) => {
          if (ci === COLS.indexOf(u)) {
            Z.sfx.good(); placer(show, l.parts[pi]); draw();
            const t = `Oui ! ${unite} dans les ${nomU(u)}.`;
            pi++; Z.speak(t).then(() => setTimeout(place, 600)); return;
          }
          tries++; errors++; Z.sfx.bad();
          const t = (m) => `Pas grave. Dans ${m}, l’unité, c’est le ${nomU(u).slice(0, -1)} : le chiffre ${unite} va dans la colonne ${u}.`;
          tip.style.display = ''; tip.textContent = '💡 ' + t(nb + ' ' + u); Z.speak(t(parleMesure(nb + ' ' + u)));
          if (tries >= 2) draw(COLS.indexOf(u));
        };
        draw();
        const label = h('span', null, ...nb.split('').map((ch, i) => i === ent.length - 1 ? h('span', { class: 'chiffre-u' }, ch) : ch), ' ' + u);
        const t = `${parleMesure(l.q)}. Le chiffre des unités de ${parleMesure(nb + ' ' + u)}, c’est ${unite}. Touche la colonne où il va.`;
        shell.root.append(h('h2', null, `📏 Mesure ${li + 1} sur ${L.length}`), head(),
          h('div', { class: 'hint center' }, 'Le chiffre des unités de ', h('b', null, label), ' : touche sa colonne'), box, tip);
        Z.speak(t);
      };
      /* 2. les zéros, puis la virgule */
      const zeros = () => {
        const todo = cv.zeros.filter(i => show[i] === undefined);
        if (!todo.length) return virgule();
        shell.clear(); shell.setSteps(L.length, li);
        const box = h('div');
        const i0 = todo[0];
        box.append(tab(li, show, { zero: i0 }));
        const t = i0 > cv.t ? 'Il y a une case vide au milieu : on met un 0.' : `On veut des ${nomU(l.vers)}. Il faut remplir les cases vides jusqu’à la colonne ${l.vers}, avec des 0.`;
        shell.root.append(h('h2', null, '0️⃣ Les zéros'), head(), Z.loulouSays(t), box,
          h('button', { class: 'touche zero-btn', onclick: () => { Z.sfx.tap(); show[i0] = '0'; zeros(); } }, '0'));
      };
      const virgule = () => {
        if (cv.virgule === null) return lire();
        shell.clear(); shell.setSteps(L.length, li);
        const t = `On veut des ${nomU(l.vers)} : la virgule se met juste après la colonne ${l.vers}.`;
        shell.root.append(h('h2', null, '🔴 La virgule'), head(), Z.loulouSays(t), tab(li, show, { virgule: cv.virgule }),
          h('button', { class: 'btn orange wide', onclick: () => { Z.sfx.tap(); lire(); } }, 'J’ai compris ➡️'));
      };
      /* 3. il lit le tableau et tape la réponse */
      const lire = () => {
        shell.clear(); shell.setSteps(L.length, li);
        let entry = '', tries = 0;
        const disp = h('div', { class: 'entree' }, '?');
        const tip = h('div', { class: 'tip', style: { display: 'none' } });
        const ok = () => {
          if (!entry) return;
          if (normRep(entry) === normRep(cv.rep)) {
            Z.sfx.good(); res[li] = { rep: cv.rep, essais: tries + 1 }; Z.save();
            Z.speak(`Bravo ! ${parleMesure(l.q)} égale ${parleMesure(cv.rep + ' ' + l.vers)}.`).then(() => setTimeout(ligne, 500)); return;
          }
          tries++; errors++; Z.sfx.bad(); entry = ''; disp.textContent = '?';
          const t = tries >= 2 ? `La réponse, c’est ${cv.rep} ${l.vers}. Tape ${cv.rep}.` : `Pas grave, essaie encore. Lis les chiffres du tableau, de la première case jusqu’à la colonne ${l.vers}${cv.virgule !== null ? ', puis la virgule et ce qui reste' : ''}.`;
          tip.style.display = ''; tip.textContent = '💡 ' + t; Z.speak(tries >= 2 ? `La réponse, c’est ${parleMesure(cv.rep + ' ' + l.vers)}. Tape ${cv.rep.replace(',', ' virgule ')}.` : t);
        };
        shell.root.append(h('h2', null, '👀 Je lis le tableau'), head(), tab(li, show, { virgule: cv.virgule }),
          h('div', { class: 'row', style: { justifyContent: 'center', alignItems: 'center' } }, disp, h('b', { style: { fontSize: '1.6em' } }, l.vers)), tip,
          h('div', { class: 'pave' }, ['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', '⌫'].map(k => h('button', { class: 'touche', onclick: () => {
            Z.sfx.tap();
            if (k === '⌫') entry = entry.slice(0, -1);
            else if (k === ',' ? entry && !entry.includes(',') : entry.length < 7) entry += k;
            disp.textContent = entry || '?';
          } }, k))),
          h('button', { class: 'btn green wide', onclick: ok }, '✅ Vérifier'));
        Z.speak(`Lis le tableau jusqu’à la colonne ${l.vers}, et tape le nombre.`);
      };
      place();
    };
    L.findIndex((_, i) => !res[i]) > 0 ? ligne() : intro();
  }

  /* ---------- PAGE À IMPRIMER POUR LA MAÎTRESSE ---------- */
  function printSheet() {
    Z.sfx.tap();
    const s = store(), d = D();
    const old = document.getElementById('print'); if (old) old.remove();
    const blocks = [];
    for (const it of d.items) {
      const res = s.res[it.id];
      if (it.type === 'verbes') {
        blocks.push(h('section', null, h('h3', null, it.consigne),
          h('p', null, it.phrases.map((p, pi) => {
            const parts = p.t.split('¤'), out = [];
            parts.forEach((txt, i) => {
              out.push(txt);
              if (i < p.b.length) out.push(res && res[pi + '-' + i] ? h('span', null, p.b[i][0], h('u', null, h('b', null, p.b[i][1]))) : h('span', null, p.b[i][0] + '……'));
            });
            return h('span', null, ...out, ' ');
          }))));
      } else if (it.type === 'sujet') {
        blocks.push(h('section', null, h('h3', null, 'n°4 : ' + it.consigne),
          it.phrases.map((line, n) => {
            const words = parseSujet(line), m = res && res[n];
            return h('p', null, String.fromCharCode(97 + n) + '. ', words.flatMap((w, i) => [h('span', { class: m && m[i] === 'V' ? 'pv' : m && m[i] === 'S' ? 'ps' : '' }, w.w), ' ']));
          })));
      } else if (it.type === 'suite') {
        const R = it.lignes, C = it.colonnes, val = (r, c) => c * R + r + 1, given = new Set(it.donnes);
        const r0 = res || { fill: {}, marks: {}, rep: {} };
        blocks.push(h('section', null, h('h3', null, it.consigne),
          h('table', { class: 'p-grille' }, Array.from({ length: R }, (_, r) => h('tr', null, Array.from({ length: C }, (_, c) => {
            const v = val(r, c), m = (r0.marks || {})[v] || '';
            return h('td', null, given.has(v) || (r0.fill || {})[v] ? h('span', { class: m ? 'pm-' + m : '' }, String(v)) : '');
          })))),
          it.questions.filter(q => q.rep).map(q => { const qi = it.questions.indexOf(q); return h('p', null, h('b', null, q.q), ' ', (r0.rep || {})[qi] ? q.rep : '……'); })));
      } else if (it.type === 'phrases') {
        blocks.push(h('section', null, h('h3', null, it.consigne),
          it.sortes.map((r, i) => res && res[r.k] ? h('p', null, `${i + 1}. `, h('span', { class: 'ps' }, res[r.k].gs), ' ' + res[r.k].fin, h('i', null, ` (${r.nom})`)) : h('p', null, `${i + 1}. ……`))));
      } else if (it.type === 'mesures') {
        blocks.push(h('section', null, h('h3', null, it.consigne),
          h('table', { class: 'p-grille' }, h('tr', null, COLS.map(c => h('th', null, c))),
            it.lignes.map((l, li) => { const cv = conversion(l), ok = res && res[li]; return h('tr', null, COLS.map((c, ci) => h('td', null, ok && cv.full[ci] !== undefined ? cv.full[ci] + (cv.virgule === ci ? ',' : '') : ''))); })),
          it.lignes.map((l, li) => h('p', null, `${l.q} = `, res && res[li] ? h('b', null, res[li].rep) : '……', ` ${l.vers}`))));
      } else if (it.type === 'conjug') {
        blocks.push(h('section', null, h('h3', null, it.consigne),
          it.verbes.map(v => h('p', null, h('b', null, v.inf + ' : '), v.formes.map((f, i) => `${PRON1[i]} ${f}`).join(', ')))));
      } else if (it.type === 'mathador') {
        blocks.push(h('section', null, h('h3', null, `Mathador : ${it.nombres.join(' / ')} → ${cibleOf(it, d.id) || '?'}`),
          res ? res.log.map(l => h('p', null, l)) : h('p', null, '(pas encore fait)'),
          res ? h('p', null, h('b', null, `Résultat : ${res.best.toLocaleString('fr-FR')}`)) : null));
      }
    }
    const sheet = h('div', { id: 'print' },
      h('h1', null, `Devoirs de ${/^zouzou/i.test(Z.state.name) ? 'Jasmin' : Z.state.name}`),
      h('p', { class: 'p-date' }, new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })),
      ...blocks);
    document.body.appendChild(sheet);
    setTimeout(() => window.print(), 100);
  }
})();
