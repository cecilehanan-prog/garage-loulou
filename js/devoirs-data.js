/* =========================================================
   MES DEVOIRS — le contenu de la semaine
   ---------------------------------------------------------
   Ce fichier est le SEUL à changer quand Maman envoie une nouvelle
   photo des devoirs. Les exercices sont recopiés de l'agenda.

   Types d'exercice :
   • verbes   : phrases à trous. « ¤ » = un trou. Pour chaque trou :
                [début du mot, bonne fin, [fins fausses], question pour trouver le sujet,
                 le sujet, le pronom qui le remplace]
   • sujet    : encadrer le verbe (V:) et souligner le sujet (S:).
                s?: / v?: = mot accepté en plus, mais pas obligatoire.
   • mathador : nombres à combiner pour s'approcher de la cible.
   • poesie   : texte tapé par Maman (espace « Pour Maman » de l'exercice).
   • mots     : mots à apprendre, joués dans le Garage des Mots (même format que data.js,
                ou juste l'id d'un mot qui existe déjà). Ils reviennent ensuite en révision.
   • suite    : tableau de nombres à compléter (pavé de chiffres), puis questions :
                lignes (choisir des lignes), entoure (rouge / vert), nombres (choisir des nombres).
   • groupes  : la leçon est lue, puis on range chaque verbe dans son groupe.

   NOUVELLE SEMAINE : on DÉPLACE l'objet ci-dessous dans js/devoirs-archives.js
   (il devient un « ancien devoir », toujours jouable pour réviser), on en
   garde aussi une copie dans le dossier « archives-devoirs » de l'ordi,
   puis on écrit ici les nouveaux devoirs avec un nouvel id (la date du lundi).
   ========================================================= */
window.ZDEVOIRS = {
  id: '2026-11-18', titre: 'Devoirs du 18 novembre',
  items: [
    {
      id: 'suite', type: 'suite', pour: 'Exercice 2', titre: 'La suite des nombres',
      consigne: 'Complète la suite des nombres.',
      /* 4 lignes, 10 colonnes : on compte de haut en bas, colonne par colonne */
      lignes: 4, colonnes: 10,
      donnes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      questions: [
        { type: 'lignes', q: 'a. Où sont les multiples de 2 ?', ok: [2, 4],
          aide: 'Les multiples de 2, c’est la table de 2 : 2, 4, 6, 8, 10… Regarde dans quelles lignes ils sont.',
          rep: 'Les multiples de 2 sont dans la 2e et la 4e ligne.' },
        { type: 'lignes', q: 'b. Où sont les multiples de 4 ?', ok: [4],
          aide: 'Les multiples de 4, c’est la table de 4 : 4, 8, 12, 16… Regarde dans quelle ligne ils sont.',
          rep: 'Les multiples de 4 sont dans la 4e ligne.' },
        { type: 'entoure', q: 'c. Entoure en rouge les multiples de 3 et en vert les multiples de 5.', rouge: 3, vert: 5 },
        { type: 'nombres', q: 'd. Quels sont les nombres entourés à la fois en rouge et en vert ?', ok: [15, 30],
          choix: [10, 12, 15, 20, 25, 30, 33, 35],
          aide: 'Ce sont les nombres qui sont dans la table de 3 ET dans la table de 5.',
          rep: 'Les nombres entourés en rouge et en vert sont 15 et 30.' }
      ]
    },
    {
      id: 'motsS5', type: 'mots', pour: 'Les mots S5', titre: 'Mes mots à apprendre (S5)',
      consigne: 'Apprends les mots 21 à 25.',
      mots: [
        'autour',
        { id: 'autrefois', s: '[au]-tre-foi(s)', e: '🦕', ph: "Autrefois, il n'y avait pas de trottinettes électriques.",
          hint: "Autrefois, c'est autre et fois collés : A U au début, et le S de fois ne s'entend pas." },
        { id: 'avant', s: 'a-v[an](t)', e: '⏮️', ph: "Je regarde à gauche et à droite avant de traverser.",
          family: { w: 'avantage', say: "Avant… avantage ! Dans avantage, on entend le T. Donc avant s'écrit avec un T à la fin." },
          hint: "Avant : le son an s'écrit A N, et le T à la fin ne s'entend pas." },
        { id: 'avec', s: 'a-vec', e: '🤝', ph: "Je roule avec mon casque sur la tête.",
          hint: "Avec : A, V, E, C. Le C à la fin, on l'entend bien." },
        { id: 'alarriere', s: "à -l'a-[rr]iè-re", e: '🔙', ph: "Loulou est assis à l'arrière de la voiture.",
          hint: "À l'arrière : à avec un accent, l apostrophe, puis arrière avec deux R et un è avec un accent grave." }
      ]
    },
    {
      id: 'groupes', type: 'groupes', pour: 'La leçon', titre: 'Les groupes de verbes',
      consigne: 'Apprends la leçon : le 3e groupe.',
      lecon: [
        ['1er groupe', 'Les verbes en -er', 'chanter, jouer, manger (sauf aller)'],
        ['2e groupe', 'Les verbes en -ir qui font « nous …issons »', 'finir : nous finissons'],
        ['3e groupe', 'Tous les autres verbes', 'être, voir, rendre, venir, avoir, faire, craindre, tenir, peindre, écrire, lire…']
      ],
      verbes: [
        ['être', 3], ['voir', 3], ['chanter', 1], ['rendre', 3], ['venir', 3, 'ir3'], ['finir', 2], ['avoir', 3], ['faire', 3],
        ['jouer', 1], ['craindre', 3], ['tenir', 3, 'ir3'], ['grandir', 2], ['peindre', 3], ['aller', 3, 'aller'], ['écrire', 3], ['lire', 3]
      ]
    }
  ]
};
