/* =========================================================
   MES ANCIENS DEVOIRS — les semaines passées, gardées pour réviser
   ---------------------------------------------------------
   Chaque semaine terminée est ajoutée ici (même forme que ZDEVOIRS,
   avec un id = date du lundi et un titre « Semaine du … »).
   Les réponses de Jasmin restent sur son téléphone, rangées par semaine.
   ========================================================= */
window.ZARCHIVES = [
  {
    id: '2026-11-18', titre: 'Devoirs pour jeudi 19 novembre',
    items: [
      {
        id: 'suite', type: 'suite', pour: 'Pour jeudi 19 · exercice 2', titre: 'La suite des nombres',
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
        id: 'motsS5', type: 'mots', pour: 'Pour jeudi 19 · mots 21 à 25', titre: 'Mes mots à apprendre (S5)',
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
        id: 'groupes', type: 'groupes', pour: 'Pour jeudi 19 · leçon', titre: 'Les groupes de verbes',
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
  },
  {
    id: '2026-11-16', titre: 'Semaine du 16 novembre',
    items: [
      {
        id: 'poesie', type: 'poesie', pour: 'Lundi 16',
        titre: 'Comme il est bon d’aimer', auteur: 'Jean-Pierre Siméon',
        consigne: 'Poésie à apprendre : 2/3 ou en entier.'
      },
      {
        id: 'verbes14', type: 'verbes', pour: 'Lundi 16', titre: 'Le polycopié des verbes',
        consigne: 'Accorde les verbes en mettant la bonne terminaison.',
        phrases: [
          { t: 'Il faut que tu leur ¤ la carte routière.', b: [['montr', 'es', ['e', 'ent'], 'Qui montre ?', 'tu', 'tu']] },
          { t: 'Elle vit les voitures qui ¤ brutalement.', b: [['démarrai', 'ent', ['t', 's'], 'Qui démarre ?', 'les voitures', 'elles']] },
          { t: 'Il ne les ¤ pas.', b: [['reconnaissai', 't', ['ent', 's'], 'Qui ne reconnaît pas ?', 'il', 'il']] },
          { t: 'Son oncle et sa tante ¤ de vieux vêtements même s’ils ne ¤ plus à personne.', b: [
            ['conservai', 'ent', ['t', 's'], 'Qui conserve les vêtements ?', 'son oncle et sa tante', 'ils'],
            ['servai', 'ent', ['t', 's'], 'Qu’est-ce qui ne sert plus ?', 'ils', 'ils']] },
          { t: 'Autrefois, on les ¤ dans du lait.', b: [['mangeai', 't', ['ent', 's'], 'Qui mangeait ?', 'on', 'il']] },
          { t: 'Les défenseurs ne la ¤ pas du regard.', b: [['quittai', 'ent', ['t', 's'], 'Qui ne quitte pas du regard ?', 'les défenseurs', 'ils']] },
          { t: 'Que ¤ tes enfants ?', b: [['devienn', 'ent', ['e', 'es'], 'Qui devient ?', 'tes enfants', 'ils']] },
          { t: 'Les parents de ma copine Sophie ¤ une ferme en Touraine.', b: [['exploit', 'ent', ['e', 'es'], 'Qui exploite la ferme ?', 'les parents', 'ils']] },
          { t: 'Un troupeau de vaches leur ¤ la route.', b: [['barrai', 't', ['ent', 's'], 'Qui barre la route ?', 'un troupeau', 'il']] }
        ]
      },
      {
        id: 'verbes12', type: 'verbes', pour: 'Fiche du jeudi 12', titre: 'La fiche des verbes du 12',
        consigne: 'Accorde les verbes en mettant la bonne terminaison.',
        phrases: [
          { t: 'Il y a des gens qui vous ¤ pour un oui ou pour un non !', b: [['dérang', 'ent', ['e', 'ez'], 'Qui dérange ?', 'des gens', 'ils']] },
          { t: 'Je ne ¤ pas que mes frères et sœurs ¤ tant d’argent.', b: [
            ['savai', 's', ['t', 'ent'], 'Qui ne savait pas ?', 'je', 'je'],
            ['avai', 'ent', ['t', 's'], 'Qui avait de l’argent ?', 'mes frères et sœurs', 'ils']] },
          { t: 'Les draps, suspendus sur l’étendage, ¤ être secs.', b: [['devrai', 'ent', ['t', 's'], 'Qu’est-ce qui devrait être sec ?', 'les draps', 'ils']] },
          { t: 'Les chats qu’il ¤, ¤ très fort.', b: [
            ['caressai', 't', ['ent', 's'], 'Qui caresse les chats ?', 'il', 'il'],
            ['ronronnai', 'ent', ['t', 's'], 'Qui ronronne ?', 'les chats', 'ils']] },
          { t: 'Les sièges de sa voiture ¤ en cuir.', b: [['étai', 'ent', ['t', 's'], 'Qu’est-ce qui était en cuir ?', 'les sièges', 'ils']] },
          { t: 'Il ¤ les nombres et les ¤ si nécessaire.', b: [
            ['dictai', 't', ['ent', 's'], 'Qui dicte ?', 'il', 'il'],
            ['répétai', 't', ['ent', 's'], 'Qui répète ?', 'il', 'il']] },
          { t: 'Elles ne l’¤ plus.', b: [['admirai', 'ent', ['t', 's'], 'Qui admire ?', 'elles', 'elles']] },
          { t: 'Il les ¤ toujours pour monter le premier.', b: [['bousculai', 't', ['ent', 's'], 'Qui bouscule ?', 'il', 'il']] }
        ]
      },
      {
        id: 'mathador', type: 'mathador', pour: 'Mardi 17', titre: 'Le Mathador',
        consigne: 'Avec ces nombres, approche-toi le plus possible du grand nombre.',
        nombres: [5, 6, 8, 3, 1, 50, 40, 900], cible: 63720
      },
      {
        id: 'sujet4', type: 'sujet', pour: 'Mardi 17', titre: 'Le verbe et le sujet (n°4)',
        consigne: 'Encadre en rouge le verbe conjugué et souligne en bleu le sujet.',
        phrases: [
          'À la ferme, S:les S:chiens S:de S:berger V:gardent les moutons.',
          'S:Tous S:les S:champs V:seront v?:labourés à l’automne.',
          'S:La S:jument s?:dans s?:le s?:pré V:reste près de son poulain.',
          'S:Les S:tulipes S:de S:Hollande V:sont réputées.',
          'S:Les S:enfants S:de S:la S:classe V:sont très sages.'
        ]
      }
    ]
  }
];
