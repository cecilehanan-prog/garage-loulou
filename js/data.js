/* =========================================================
   DONNÉES PÉDAGOGIQUES — Zouzou Gabi CM1
   ---------------------------------------------------------
   Format des mots (champ "s") :
     - les syllabes sont séparées par des tirets  :  ba-llon
     - [ ] = le "piège" (la partie qui ne s'écrit pas comme on l'entend)
     - ( ) = lettre muette (on l'écrit mais on ne l'entend pas)
   Exemple : "b[eau]-cou(p)"  →  beaucoup
   ========================================================= */

window.ZDATA = {};

ZDATA.words = [
  // --- Niveau + : mots invariables et mots plus longs (fin CM1 / début CM2) ---
  { id: 'longtemps', s: 'lon(g)-t[em](ps)', e: '⌛', ph: "Il y a très longtemps, les dinosaures vivaient sur la Terre.",
    family: { w: 'longue', say: "Long… longue ! Dans longue, on entend le G. Donc on l'écrit aussi dans longtemps." },
    hint: "Longtemps, c'est long et temps collés : un G muet, puis E M, et P S muets à la fin." },
  { id: 'quelquefois', s: '[qu]el-[qu]e-foi(s)', e: '🔂', ph: "Quelquefois, Loulou dort sur mon lit au lieu du canapé.",
    hint: "Quelquefois : deux fois Q U, puis le mot fois avec son S muet." },
  { id: 'parfois', s: 'par-foi(s)', e: '🎲', ph: "Parfois, je gagne la course, parfois je perds, mais je m'entraîne.",
    hint: "Parfois, c'est par et fois. Fois finit par un S muet." },
  { id: 'pourtant', s: 'pour-t[an](t)', e: '🤨', ph: "Il pleuvait, et pourtant le match a continué.",
    hint: "Pourtant, c'est pour et tant : le son an s'écrit A N, avec un T muet." },
  { id: 'plusieurs', s: 'plu-sieur(s)', e: '🔢', ph: "Zouzou a marqué plusieurs buts pendant le match.",
    hint: "Plusieurs veut dire beaucoup de choses : il finit toujours par un S muet." },
  { id: 'environ', s: '[en]-vi-ron', e: '≈', ph: "La piste mesure environ deux kilomètres.",
    hint: "Environ commence par E N, comme dans enfant." },
  { id: 'vraiment', s: 'vr[ai]-m[en](t)', e: '💯', ph: "Ma Kukirin G2 est vraiment rapide dans les lignes droites.",
    hint: "Vraiment, c'est vrai plus ment : V R A I, puis M E N T." },
  { id: 'tellement', s: 'te-[ll]e-m[en](t)', e: '🤩', ph: "J'étais tellement content que j'ai sauté de joie.",
    hint: "Tellement a deux L, et finit par M E N T, avec un T muet." },
  { id: 'cependant', s: '[c]e-p[en]-d[an](t)', e: '⚖️', ph: "Le chemin est court, cependant il est dangereux.",
    hint: "Cependant : un C qui fait s, puis E N, puis A N, et un T muet." },
  { id: 'soudain', s: 'sou-d[ain]', e: '⚡', ph: "Soudain, un ballon a traversé la chaussée.",
    hint: "Soudain finit par A I N, comme dans la main." },
  { id: 'ensuite', s: '[en]-sui-te', e: '⏭️', ph: "D'abord je mets mon casque, ensuite je démarre.",
    hint: "Ensuite commence par E N, comme ensemble." },
  { id: 'accident', s: 'a[c]-[c]i-d[en](t)', e: '🚑', ph: "Avec un casque, on se protège en cas d'accident.",
    hint: "Accident a deux C : le premier fait k, le deuxième fait s. Et dent finit par un T muet." },
  { id: 'prudent', s: 'pru-d[en](t)', e: '🦺', ph: "Sur la route, un bon pilote reste toujours prudent.",
    family: { w: 'prudente', say: "Prudent… prudente ! Dans prudente, on entend le T. Donc on l'écrit aussi dans prudent." },
    hint: "Prudent : le son an s'écrit E N, avec un T muet." },
  { id: 'carrefour', s: 'ca-[rr]e-four', e: '✖️', ph: "Au carrefour, je cède le passage aux voitures de droite.",
    hint: "Carrefour a deux R au milieu, comme deux routes qui se croisent." },
  { id: 'panneau', s: 'pa-[nn][eau]', e: '🛑', ph: "Le panneau stop m'oblige à m'arrêter.",
    hint: "Panneau a deux N et finit par E A U, comme l'eau." },
  { id: 'dangereux', s: 'd[an]-ge-r[eux]', e: '⚠️', ph: "Ce virage est dangereux, je ralentis.",
    hint: "Dangereux commence par le mot danger, et finit par E U X, comme heureux." },
  { id: 'electrique', s: 'é-lec-tri-[qu]e', e: '🔌', ph: "Ma trottinette électrique se recharge sur la prise.",
    hint: "Électrique finit par Q U E : le son k s'écrit Q U." },
  { id: 'squelette', s: 's[qu]e-le-[tt]e', e: '🦴', ph: "Au musée, j'ai vu le squelette d'un tyrannosaure.",
    hint: "Squelette : le son k s'écrit Q U, et il y a deux T à la fin." },
  { id: 'prehistoire', s: 'pré-(h)is-toi-re', e: '🦣', ph: "À la préhistoire, les hommes chassaient les mammouths.",
    hint: "Préhistoire, c'est pré et histoire : avant l'histoire. Le H d'histoire est muet." },
  { id: 'gagnant', s: 'ga-[gn][an](t)', e: '🏆', ph: "Le gagnant du Grand Prix monte sur le podium.",
    family: { w: 'gagnante', say: "Gagnant… gagnante ! Dans gagnante, on entend le T. Donc on l'écrit aussi dans gagnant." },
    hint: "Gagnant : G N fait le son gn, comme dans montagne. Et un T muet à la fin." },
  { id: 'attention', s: 'a-[tt]en-[t]ion', e: '👀', ph: "Attention, le feu passe à l'orange !",
    hint: "Attention : deux T au début, et à la fin T I O N se lit sion." },

  // --- Mots invariables du CM1 (très fréquents à l'école) ---
  { id: 'beaucoup', s: 'b[eau]-cou(p)', e: '🍬🍬🍬', ph: "J'ai beaucoup de bonbons.",
    hint: "Dans beaucoup, il y a de l'eau : E A U. Et un P muet tout au bout, chut !" },
  { id: 'toujours', s: 'tou-jour(s)', e: '♾️', ph: "Loulou dort toujours sur le canapé.",
    hint: "Toujours finit toujours par un S muet." },
  { id: 'maintenant', s: 'm[ain]-te-n[an](t)', e: '⏰', ph: "Maintenant, on part en trottinette !",
    hint: "Maintenant commence par MAIN, comme la main. Je lève la main… maintenant !" },
  { id: 'pendant', s: 'p[en]-d[an](t)', e: '⏳', ph: "Pendant le match, Zouzou court vite.",
    hint: "Deux fois le son an : d'abord avec E N, puis avec A N. Et un T muet." },
  { id: 'souvent', s: 'sou-v[en](t)', e: '🔁', ph: "Je joue souvent au foot.",
    hint: "Souvent : le son an s'écrit E N, et il y a un T muet à la fin." },
  { id: 'deja', s: 'dé-j[à]', e: '✅', ph: "J'ai déjà fini !",
    hint: "Déjà a deux accents qui regardent dans des sens différents : é, puis à." },
  { id: 'apres', s: 'a-pr[ès]', e: '➡️', ph: "Après l'école, je fais de la trottinette.",
    hint: "Après finit par È S : un accent grave, comme une petite pente, et un S." },
  { id: 'bientot', s: 'bien-t[ô](t)', e: '🔜', ph: "Bientôt les vacances !",
    hint: "Bientôt, c'est bien et tôt. Le O a un petit chapeau, et il y a un T muet." },
  { id: 'ensemble', s: '[en]-s[em]-ble', e: '🤝', ph: "On joue ensemble.",
    hint: "Devant B, le N se transforme en M : s E M ble." },
  { id: 'dehors', s: 'de-(h)or(s)', e: '🌳', ph: "Loulou veut aller dehors.",
    hint: "Dehors cache un H muet au milieu et un S muet à la fin." },
  { id: 'jamais', s: 'ja-m[ai](s)', e: '🚫', ph: "Je n'abandonne jamais !",
    hint: "Jamais, comme mais, avec A I, et un S muet." },
  { id: 'tres', s: 'tr[ès]', e: '💯', ph: "Ma trottinette est très rapide.",
    hint: "Très, avec un accent grave et un S, comme après." },
  { id: 'combien', s: 'c[om]-bien', e: '❓', ph: "Combien de buts as-tu marqués ?",
    hint: "Devant B, le N devient M : c O M bien." },
  { id: 'quand', s: '[qu]an(d)', e: '🕐', ph: "Quand est-ce qu'on mange ?",
    hint: "Quand commence par Q U et finit par un D muet." },
  { id: 'pourquoi', s: 'pour-[qu]oi', e: '🤔', ph: "Pourquoi le ciel est bleu ?",
    hint: "Pourquoi, c'est pour et quoi collés ensemble." },
  { id: 'autour', s: '[au]-tour', e: '🔄', ph: "Je fais le tour, je tourne autour.",
    hint: "Autour commence par A U, puis le mot tour." },

  // --- Mots du monde de Zouzou ---
  { id: 'trottinette', s: 'tro-[tt]i-ne[tt](e)', e: '🛴', ph: "Ma trottinette Kukirin G2 est la meilleure !",
    hint: "Trottinette a deux fois deux T, comme deux roues et deux roues !" },
  { id: 'casque', s: 'cas-[qu]e', e: '⛑️', ph: "Je mets toujours mon casque.",
    hint: "Dans casque, le son k s'écrit Q U." },
  { id: 'vitesse', s: 'vi-te[ss]e', e: '💨', ph: "La G2 prend de la vitesse.",
    hint: "Entre deux voyelles, pour faire le son s, on met deux S." },
  { id: 'circuit', s: '[c]ir-cui(t)', e: '🏁', ph: "La Formule 1 roule sur le circuit.",
    hint: "Circuit commence par un C qui fait s, et finit par un T muet." },
  { id: 'gardien', s: 'gar-di[en]', e: '🧤', ph: "Le gardien arrête le ballon.",
    hint: "Gardien finit par E N, comme chien." },
  { id: 'dinosaure', s: 'di-no-s[au]re', e: '🦖', ph: "Le dinosaure était énorme.",
    hint: "Dans dinosaure, le son o s'écrit A U." },
  { id: 'fossile', s: 'fo-[ss]i-le', e: '🦴', ph: "J'ai trouvé un fossile de dinosaure !",
    hint: "Fossile a deux S au milieu, pour bien faire le son s." },
  { id: 'grand', s: 'gran(d)', e: '🦕', ph: "Le diplodocus est très grand.",
    family: { w: 'grande', say: "Grand… grande ! Dans grande, on entend le D. Donc on l'écrit aussi dans grand." },
    hint: "Grand a un D muet à la fin." },
  { id: 'sport', s: 'spor(t)', e: '🏆', ph: "Le foot, c'est mon sport préféré.",
    family: { w: 'sportif', say: "Sport… sportif ! Dans sportif, on entend le T. Donc on l'écrit dans sport." },
    hint: "Sport a un T muet." },
  { id: 'lent', s: 'l[en](t)', e: '🐢', ph: "La tortue est lente, l'escargot est lent.",
    family: { w: 'lente', say: "Lent… lente ! Dans lente, on entend le T. Donc on l'écrit dans lent." },
    hint: "Lent : le son an s'écrit E N, avec un T muet." },
  { id: 'freiner', s: 'fr[ei]-n[er]', e: '🛑', ph: "Il faut freiner avant le virage.",
    hint: "Freiner : le son è s'écrit E I, et le son é final s'écrit E R, comme tous les verbes en er." },
  { id: 'champion', s: 'ch[am]-pion', e: '🥇', ph: "Zouzou est un champion !",
    hint: "Devant P, le N devient M : ch A M pion." },
  { id: 'equipe', s: 'é-[qu]i-pe', e: '👕', ph: "Mon équipe a gagné le match.",
    hint: "Dans équipe, le son k s'écrit Q U." },
  { id: 'famille', s: 'fa-mi-[ll]e', e: '👨‍👩‍👦', ph: "J'aime ma famille.",
    hint: "Famille finit par I L L E, qui fait le son ill." },
  { id: 'heureux', s: '(h)eu-r[eux]', e: '😄', ph: "Je suis heureux quand je gagne.",
    hint: "Heureux commence par un H muet et finit par E U X." },
  { id: 'batterie', s: 'ba-[tt]e-ri(e)', e: '🔋', ph: "La batterie de la G2 est pleine.",
    hint: "Batterie a deux T, et un E muet à la fin." }
];

/* Graphies "voisines" : utilisées pour fabriquer UNE fausse syllabe piège
   (on ne montre jamais une liste de fautes, juste un choix ciblé). */
ZDATA.alts = {
  'eau': ['o', 'au'], 'au': ['o', 'eau'], 'o': ['au'], 'ô': ['o', 'au'],
  'ain': ['in', 'ein'], 'ein': ['ain', 'in'], 'in': ['ain'],
  'an': ['en'], 'en': ['an'], 'am': ['an'], 'em': ['en'], 'om': ['on'],
  'ai': ['è', 'é'], 'ei': ['ai', 'è'], 'ès': ['ai', 'et'], 'è': ['ai'],
  'er': ['é', 'ez'], 'ez': ['é', 'er'], 'é': ['er'], 'à': ['a'],
  'qu': ['k', 'c'], 'c': ['s'], 'ss': ['s'], 'tt': ['t'], 'll': ['l'],
  'eux': ['eu', 'eut'],
  'rr': ['r'], 'nn': ['n'], 'gn': ['ni', 'n'], 't': ['s', 'c']
};

/* =========================================================
   PROBLÈMES — méthode « Détective Isis »
   {n} = un nombre UTILE ; {n!} = un nombre INUTILE (piège)
   schema : parties | comparaison | groupes | partage
   ========================================================= */
ZDATA.problems = [
  { id: 'p1', e: '🛴', schema: 'parties', unknown: 'tout',
    text: "Samedi, Zouzou Gabi roule {12} km avec sa trottinette Kukirin G2. Dimanche, il roule {15} km. Pendant ce temps, Loulou dort {3!} heures. Combien de kilomètres Zouzou a-t-il roulés en tout ?",
    q: ["Combien de kilomètres en tout ?", "Combien d'heures Loulou dort ?", "De quelle couleur est la G2 ?"],
    op: '+', a: 12, b: 15, r: 27, unit: 'km',
    end: ["Zouzou a roulé 27 km en tout.", "Zouzou a roulé 27 chats en tout."] },

  { id: 'p2', e: '🐱', schema: 'parties', unknown: 'partie',
    text: "Loulou a {35} croquettes dans sa gamelle. Il en mange {18}. Combien de croquettes reste-t-il dans la gamelle ?",
    q: ["Combien de croquettes il reste ?", "Combien de gamelles a Loulou ?", "Quel âge a Loulou ?"],
    op: '-', a: 35, b: 18, r: 17, unit: 'croquettes',
    end: ["Il reste 17 croquettes.", "Il reste 17 dinosaures."] },

  { id: 'p3', e: '⚽', schema: 'comparaison', unknown: 'ecart',
    text: "Cette saison, Zouzou a marqué {14} buts. Son copain Malo a marqué {9} buts. Un match dure {60!} minutes. Combien de buts Zouzou a-t-il marqués de plus que Malo ?",
    q: ["Combien de buts de plus que Malo ?", "Combien de temps dure un match ?", "Combien de buts en tout ?"],
    op: '-', a: 14, b: 9, r: 5, unit: 'buts',
    end: ["Zouzou a marqué 5 buts de plus que Malo.", "Zouzou a marqué 5 ballons de foot de plus."] },

  { id: 'p4', e: '🦖', schema: 'groupes', unknown: 'tout',
    text: "Une pochette contient {6} cartes de dinosaures. Zouzou achète {7} pochettes. Combien de cartes a-t-il en tout ?",
    q: ["Combien de cartes en tout ?", "Combien coûte une pochette ?", "Combien de pochettes ?"],
    op: '×', a: 7, b: 6, r: 42, unit: 'cartes',
    end: ["Zouzou a 42 cartes de dinosaures.", "Zouzou a 42 pochettes de chats."] },

  { id: 'p5', e: '🍬', who: 'cecile', schema: 'partage', unknown: 'part',
    text: "Maman partage {48} bonbons entre {6} enfants. Chaque enfant reçoit le même nombre de bonbons. Combien de bonbons reçoit chaque enfant ?",
    q: ["Combien de bonbons pour chaque enfant ?", "Combien d'enfants en tout ?", "De quelle couleur sont les bonbons ?"],
    op: '÷', a: 48, b: 6, r: 8, unit: 'bonbons',
    end: ["Chaque enfant reçoit 8 bonbons.", "Chaque enfant reçoit 8 trottinettes."] },

  { id: 'p6', e: '🏍️', schema: 'comparaison', unknown: 'grand',
    text: "La trottinette Kukirin G2 de Zouzou roule à {25} km par heure. La moto du voisin roule {55} km par heure plus vite. Le voisin a {2!} casques. À quelle vitesse roule la moto ?",
    q: ["À quelle vitesse roule la moto ?", "Combien de casques a le voisin ?", "À quelle vitesse roule la G2 ?"],
    op: '+', a: 25, b: 55, r: 80, unit: 'km par heure',
    end: ["La moto roule à 80 km par heure.", "La moto roule à 80 casques par heure."] },

  { id: 'p7', e: '🏎️', schema: 'groupes', unknown: 'tout',
    text: "Un tour de circuit mesure {5} km. Une Formule 1 fait {8} tours. Il y a {20!} voitures dans la course. Combien de kilomètres la Formule 1 a-t-elle parcourus ?",
    q: ["Combien de kilomètres parcourus ?", "Combien de voitures dans la course ?", "Qui gagne la course ?"],
    op: '×', a: 8, b: 5, r: 40, unit: 'km',
    end: ["La Formule 1 a parcouru 40 km.", "La Formule 1 a parcouru 40 voitures."] },

  { id: 'p8', e: '🦕', schema: 'comparaison', unknown: 'ecart',
    text: "Le brachiosaure mesure {23} mètres de long. Le tyrannosaure mesure {12} mètres de long. Combien de mètres le brachiosaure mesure-t-il de plus que le tyrannosaure ?",
    q: ["Combien de mètres de plus ?", "Combien mesurent-ils tous les deux ensemble ?", "Lequel est le plus méchant ?"],
    op: '-', a: 23, b: 12, r: 11, unit: 'mètres',
    end: ["Le brachiosaure mesure 11 mètres de plus.", "Le brachiosaure mesure 11 dents de plus."] },

  { id: 'p9', e: '🐾', schema: 'groupes', unknown: 'tout',
    text: "Un chat a {4} pattes. Dans le jardin, il y a {9} chats. Loulou a {2!} ans. Combien de pattes y a-t-il en tout ?",
    q: ["Combien de pattes en tout ?", "Quel âge a Loulou ?", "Combien de chats ?"],
    op: '×', a: 9, b: 4, r: 36, unit: 'pattes',
    end: ["Il y a 36 pattes en tout.", "Il y a 36 jardins en tout."] },

  { id: 'p10', e: '🦴', schema: 'partage', unknown: 'part',
    text: "Le tyrannosaure mange {63} kilos de viande en {7} jours. Il mange la même quantité chaque jour. Combien de kilos mange-t-il par jour ?",
    q: ["Combien de kilos par jour ?", "Combien de jours en tout ?", "Combien de dents a le T-rex ?"],
    op: '÷', a: 63, b: 7, r: 9, unit: 'kilos',
    end: ["Il mange 9 kilos de viande par jour.", "Il mange 9 jours par kilo."] },

  { id: 'p11', e: '🃏', who: 'cecile', schema: 'parties', unknown: 'tout',
    text: "Zouzou a {128} cartes dans son classeur. Maman lui offre {45} cartes. Combien de cartes Zouzou a-t-il maintenant ?",
    q: ["Combien de cartes maintenant ?", "Combien de classeurs ?", "Combien de cartes Maman a gardées ?"],
    op: '+', a: 128, b: 45, r: 173, unit: 'cartes',
    end: ["Zouzou a maintenant 173 cartes.", "Zouzou a maintenant 173 mamans."] },

  { id: 'p12', e: '🔋', schema: 'parties', unknown: 'partie',
    text: "La batterie de la G2 permet de rouler {40} km. Zouzou a déjà roulé {26} km. Il fait {18!} degrés dehors. Combien de kilomètres peut-il encore rouler ?",
    q: ["Combien de kilomètres il peut encore rouler ?", "Quelle température fait-il ?", "Combien de batteries a la G2 ?"],
    op: '-', a: 40, b: 26, r: 14, unit: 'km',
    end: ["Il peut encore rouler 14 km.", "Il peut encore rouler 14 degrés."] }
];

/* =========================================================
   RÉCOMPENSES
   ========================================================= */
ZDATA.colors = [
  { id: 'orange', name: 'Orange Kukirin', c: '#f26a10', price: 0 },
  { id: 'bleu',   name: 'Bleu turbo',   c: '#2563eb', price: 30 },
  { id: 'rougenoir', name: 'Kukirin G2 Rouge & Noir', c: '#dc2626', two: true, price: 100 },
  { id: 'vert',   name: 'Vert creeper', c: '#16a34a', price: 30 },
  { id: 'violet', name: 'Violet galaxie', c: '#7c3aed', price: 50 },
  { id: 'noir',   name: 'Noir carbone', c: '#1f2937', price: 60 },
  { id: 'or',     name: 'Or champion',  c: '#d4a017', price: 120 }
];
ZDATA.helmets = [
  { id: 'aucun',  name: 'Casque classique', c: '#f3f4f6', price: 0 },
  { id: 'flamme', name: 'Casque flamme',    c: '#f97316', price: 40 },
  { id: 'eclair', name: 'Casque éclair',    c: '#facc15', price: 50 },
  { id: 'dino',   name: 'Casque dino',      c: '#22c55e', price: 70 },
  { id: 'pilote', name: 'Casque pilote F1', c: '#ef4444', price: 90 }
];
ZDATA.catItems = [
  { id: 'aucun',    name: 'Loulou tout simple', price: 0 },
  { id: 'bandana',  name: 'Bandana de foot',    price: 30 },
  { id: 'lunettes', name: 'Lunettes de star',   price: 50 },
  { id: 'couronne', name: 'Couronne de roi',    price: 80 },
  { id: 'casque',   name: 'Mini-casque',        price: 60 }
];

ZDATA.stickers = [
  // commun
  { id: 's1', e: '⚽', n: 'Ballon', r: 1 }, { id: 's2', e: '🛴', n: 'Trottinette', r: 1 },
  { id: 's3', e: '🐱', n: 'Chat', r: 1 }, { id: 's4', e: '🦴', n: 'Fossile', r: 1 },
  { id: 's5', e: '🏁', n: 'Drapeau', r: 1 }, { id: 's6', e: '⛑️', n: 'Casque', r: 1 },
  { id: 's7', e: '🥅', n: 'But', r: 1 }, { id: 's8', e: '🐾', n: 'Pattes', r: 1 },
  { id: 's9', e: '🧱', n: 'Bloc', r: 1 }, { id: 's10', e: '🌋', n: 'Volcan', r: 1 },
  { id: 's11', e: '🔋', n: 'Batterie', r: 1 }, { id: 's12', e: '🍕', n: 'Pizza', r: 1 },
  // rare
  { id: 'r1', e: '🦖', n: 'T-rex', r: 2 }, { id: 'r2', e: '🦕', n: 'Diplodocus', r: 2 },
  { id: 'r3', e: '🏍️', n: 'Moto', r: 2 }, { id: 'r4', e: '🏎️', n: 'Formule 1', r: 2 },
  { id: 'r5', e: '🧤', n: 'Gardien', r: 2 }, { id: 'r6', e: '😼', n: 'Chat malin', r: 2 },
  { id: 'r7', e: '🐉', n: 'Dragon', r: 2 }, { id: 'r8', e: '💎', n: 'Diamant', r: 2 },
  { id: 'r9', e: '⚡', n: 'Éclair', r: 2 }, { id: 'r10', e: '🛡️', n: 'Bouclier', r: 2 },
  // légendaire
  { id: 'l1', e: '🏆', n: 'Coupe du monde', r: 3 }, { id: 'l2', e: '👑', n: 'Roi Loulou', r: 3 },
  { id: 'l3', e: '🚀', n: 'G2 fusée', r: 3 }, { id: 'l4', e: '🌟', n: 'Super étoile', r: 3 },
  { id: 'l5', e: '🦄', n: 'Licorne turbo', r: 3 }, { id: 'l6', e: '🥇', n: 'Médaille d\'or', r: 3 }
];

/* Phrases d'encouragement : on félicite l'EFFORT et la MÉTHODE, pas le "don". */
ZDATA.praise = [
  "Bravo, tu as pris ton temps !", "Super, ton cerveau s'entraîne !", "Excellent travail !",
  "Tu progresses à toute vitesse !", "Trop fort, Zouzou Gabi !", "Champion !", "Génial, continue !",
  "Tu as bien réfléchi !", "Waouh, quelle concentration !"
];
ZDATA.retry = [
  "Presque ! Essaie encore.", "Pas grave, ton cerveau apprend en se trompant.",
  "On réessaie ensemble ?", "Tu y es presque !", "Une erreur, c'est un entraînement !"
];

/* =========================================================
   LA FAMILLE (portraits dessinés d'après les photos)
   ========================================================= */
ZDATA.family = [
  { id: 'cecile', name: 'Maman' },
  { id: 'charlie', name: 'Charlie' },
  { id: 'gabriel', name: 'Gabriel' }
];
ZDATA.cheers = [
  "Bravo Zouzou, t'es un champion !", "Trop fort, Zouzou Gabi !", "Waouh, quelle fierté !",
  "Continue comme ça, Zouzou !", "Énorme ! Tu progresses à fond !", "Respect, Zouzou ! Quelle concentration !"
];

ZDATA.problems.splice(1, 0,
  { id: 'f1', e: '🎮', who: 'charlie', schema: 'parties', unknown: 'partie',
    text: "Charlie a {36} euros. Charlie achète un jeu vidéo à {24} euros. Combien d'euros reste-t-il à Charlie ?",
    q: ["Combien d'euros il reste à Charlie ?", "Combien coûte le jeu vidéo ?", "Quel jeu Charlie achète ?"],
    op: '-', a: 36, b: 24, r: 12, unit: 'euros',
    end: ["Il reste 12 euros à Charlie.", "Il reste 12 jeux vidéo à Charlie."] });

ZDATA.problems.splice(3, 0,
  { id: 'f2', e: '💪', who: 'gabriel', schema: 'groupes', unknown: 'tout',
    text: "Gabriel fait {7} séries de {9} pompes. La séance dure {20!} minutes. Gabriel fait combien de pompes en tout ?",
    q: ["Combien de pompes en tout ?", "Combien de temps dure la séance ?", "Combien de séries ?"],
    op: '×', a: 7, b: 9, r: 63, unit: 'pompes',
    end: ["Gabriel fait 63 pompes en tout.", "Gabriel fait 63 minutes en tout."] });

ZDATA.problems.splice(5, 0,
  { id: 'f3', e: '🃏', who: 'charlie', schema: 'comparaison', unknown: 'ecart',
    text: "Charlie a {54} cartes de foot. Gabriel a {38} cartes de foot. Charlie a combien de cartes de plus que Gabriel ?",
    q: ["Combien de cartes de plus que Gabriel ?", "Combien de cartes en tout ?", "Qui a les plus belles cartes ?"],
    op: '-', a: 54, b: 38, r: 16, unit: 'cartes',
    end: ["Charlie a 16 cartes de plus que Gabriel.", "Charlie a 16 Gabriel de plus."] });

ZDATA.problems.splice(7, 0,
  { id: 'f4', e: '🍬', who: 'gabriel', schema: 'partage', unknown: 'part',
    text: "Gabriel, Charlie et Zouzou se partagent {42} bonbons. Ils sont {3}. Chacun reçoit le même nombre de bonbons. Combien de bonbons reçoit chacun ?",
    q: ["Combien de bonbons pour chacun ?", "Combien de personnes ?", "Qui mange le plus vite ?"],
    op: '÷', a: 42, b: 3, r: 14, unit: 'bonbons',
    end: ["Chacun reçoit 14 bonbons.", "Chacun reçoit 14 personnes."] });
