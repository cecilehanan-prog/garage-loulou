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
   • table    : une seule table, jouée dans le Grand Prix (table: 4).
   • phrases  : construire des phrases avec des boutons, une par sorte de groupe sujet.
   • conjug   : la leçon d'un verbe (6 formes) lue, puis choisir la bonne forme.
   • mesures  : tableau de conversion. parts = [nombre, unité] ; vers = unité voulue.
   • mathador : sans « cible », Jasmin tape le nombre à atteindre la première fois.

   NOUVELLE SEMAINE : on DÉPLACE l'objet ci-dessous dans js/devoirs-archives.js
   (il devient un « ancien devoir », toujours jouable pour réviser), on en
   garde aussi une copie dans le dossier « archives-devoirs » de l'ordi,
   puis on écrit ici les nouveaux devoirs avec un nouvel id (la date du lundi).
   ========================================================= */
window.ZDEVOIRS = {
  id: '2026-11-23', titre: 'Semaine du 23 novembre',
  items: [
    {
      id: 'suite', type: 'suite', pour: 'Lundi 23 · polycopié de maths', titre: 'La suite des nombres',
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
      id: 'poesie', type: 'poesie', pour: 'Lundi 23 · en entier', entier: true,
      titre: 'Comme il est bon d’aimer', auteur: 'Jean-Pierre Siméon',
      consigne: 'Poésie à savoir en entier.'
    },
    { id: 'table4', type: 'table', table: 4, pour: 'Lundi 23', titre: 'La table de 4' },
    {
      id: 'mathador', type: 'mathador', pour: 'Mardi 24', titre: 'Le Mathador',
      consigne: 'Avec ces nombres, approche-toi le plus possible du nombre à atteindre.',
      nombres: [2, 9, 5, 4, 7, 30, 60, 400]   /* le nombre à atteindre n'est pas dans l'agenda */
    },
    {
      id: 'phrasesGS', type: 'phrases', pour: 'Mardi 24', titre: 'Mes phrases et leur groupe sujet',
      consigne: 'Écris une phrase avec un groupe sujet qui est un groupe nominal, une avec un pronom, et une avec un groupe verbal à l’infinitif.',
      sortes: [
        { k: 'GN', nom: 'un groupe nominal', ex: 'Mon chat Loulou',
          regle: 'Un groupe nominal, c’est un nom avec un petit mot devant : le, la, les, un, mon…',
          sujets: [
            ['Mon chat Loulou', ['dort sur mon lit.', 'mange ses croquettes.', 'joue avec une balle.']],
            ['La trottinette orange', ['roule très vite.', 'est garée devant la maison.', 'brille au soleil.']],
            ['Les enfants de la classe', ['jouent dans la cour.', 'écoutent la maîtresse.', 'chantent une chanson.']]
          ] },
        { k: 'PRO', nom: 'un pronom', ex: 'Il',
          regle: 'Un pronom, c’est un petit mot qui remplace un nom : je, tu, il, elle, nous, vous, ils, elles.',
          sujets: [
            ['Il', ['regarde le match de foot.', 'range sa chambre.', 'roule avec son casque.']],
            ['Nous', ['partons à l’école.', 'jouons aux cartes.', 'mangeons une crêpe.']],
            ['Elles', ['dansent dans le salon.', 'lisent une BD.', 'rient très fort.']]
          ] },
        { k: 'INF', nom: 'un groupe verbal à l’infinitif', ex: 'Faire de la trottinette',
          regle: 'Un groupe verbal à l’infinitif commence par un verbe pas conjugué, qui finit souvent par -er, -ir ou -re : faire, lire, ranger…',
          sujets: [
            ['Faire de la trottinette', ['est mon sport préféré.', 'demande un bon casque.', 'me rend heureux.']],
            ['Lire une BD', ['me fait rire.', 'repose mes yeux le soir.', 'est agréable sous la couette.']],
            ['Ranger sa chambre', ['prend du temps.', 'fait plaisir à Maman.', 'rapporte des étoiles.']]
          ] }
      ]
    },
    {
      id: 'conjug', type: 'conjug', pour: 'Jeudi 26', titre: 'Les verbes tenir et finir', temps: 'présent',
      consigne: 'Apprends les verbes tenir et finir au présent.',
      verbes: [
        { inf: 'tenir', groupe: 3, formes: ['tiens', 'tiens', 'tient', 'tenons', 'tenez', 'tiennent'], faux: ['tien', 'tienent', 'tenont', 'tiennons'],
          astuce: 'Tenir, 3e groupe. Je tiens, tu tiens : avec un S. Il tient : avec un T. Nous tenons, vous tenez. Ils tiennent : avec deux N.' },
        { inf: 'finir', groupe: 2, formes: ['finis', 'finis', 'finit', 'finissons', 'finissez', 'finissent'], faux: ['fini', 'finie', 'finons', 'finent'],
          astuce: 'Finir, 2e groupe. Je finis, tu finis : avec un S. Il finit : avec un T. Au pluriel, on ajoute i, s, s : nous finissons, vous finissez, ils finissent.' }
      ]
    },
    {
      id: 'mesures', type: 'mesures', pour: 'Vendredi 27', titre: 'Les mesures de longueur',
      consigne: 'Place les mesures de longueur dans le tableau et complète.',
      lignes: [
        { q: '2,7 km', parts: [['2,7', 'km']], vers: 'm' },
        { q: '254 cm', parts: [['254', 'cm']], vers: 'mm' },
        { q: '6,7 cm', parts: [['6,7', 'cm']], vers: 'mm' },
        { q: '54,7 m', parts: [['54,7', 'm']], vers: 'cm' },
        { q: '6 250 dm', parts: [['6250', 'dm']], vers: 'dam' },
        { q: '63 hm et 4 dam', parts: [['63', 'hm'], ['4', 'dam']], vers: 'm' },
        { q: '5 km et 9 dam', parts: [['5', 'km'], ['9', 'dam']], vers: 'm' },
        { q: '1,2 km', parts: [['1,2', 'km']], vers: 'm' }
      ]
    }
  ]
};
