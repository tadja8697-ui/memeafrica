// src/data/cameroon-culture.ts
// Membre 3 — Base de données d'adaptation culturelle camerounaise

export interface CamExpression {
  original: string;         // Mot/expression détectée dans le texte
  meaning: string;          // Signification en français standard
  memeCaption: string;      // Caption mème suggérée
  context: string;          // Contexte d'usage
  region: 'nationale' | 'yaoundé' | 'douala' | 'ouest';
}

export interface CulturalContext {
  detected: boolean;
  expressions: CamExpression[];
  moodTag: string;
  suggestedEmoji: string;
  culturalScore: number;    // 0-100 : score d'intensité culturelle
}

// ═══════════════════════════════════════════════
// DICTIONNAIRE CAMFRANGLAIS / FRANCANGLAIS
// ═══════════════════════════════════════════════
export const CAMFRANGLAIS_DICTIONARY: CamExpression[] = [
  {
    original: "mbombo",
    meaning: "argent / monnaie",
    memeCaption: "Quand le mbombo arrive enfin au 30 du mois",
    context: "finances",
    region: "nationale"
  },
  {
    original: "go",
    meaning: "fille / petite amie",
    memeCaption: "Ma go quand elle voit mes notes d'examen",
    context: "relations",
    region: "douala"
  },
  {
    original: "njama njama",
    meaning: "feuilles de huckleberry (légume)",
    memeCaption: "Le njama njama de ma maman vs le restaurant",
    context: "nourriture",
    region: "ouest"
  },
  {
    original: "oga",
    meaning: "patron / chef / supérieur",
    memeCaption: "L'oga qui arrive sans prévenir un vendredi à 17h",
    context: "travail",
    region: "nationale"
  },
  {
    original: "abeg",
    meaning: "s'il te plaît / je t'en supplie",
    memeCaption: "Abeg, pas ce lundi matin encore",
    context: "expression générale",
    region: "nationale"
  },
  {
    original: "kong",
    meaning: "problème / ennui",
    memeCaption: "Quand tu pensais éviter le kong mais il te retrouve",
    context: "situation difficile",
    region: "yaoundé"
  },
  {
    original: "chop",
    meaning: "manger / profiter",
    memeCaption: "On va chop life aujourd'hui, le salaire est arrivé",
    context: "nourriture/style de vie",
    region: "nationale"
  },
  {
    original: "dem",
    meaning: "eux / ils / les gens",
    memeCaption: "Dem disaient que ça marchera pas...",
    context: "expression générale",
    region: "nationale"
  },
  {
    original: "na so",
    meaning: "c'est comme ça / exact",
    memeCaption: "Na so la vie marche ici",
    context: "approbation / résignation",
    region: "nationale"
  },
  {
    original: "waka",
    meaning: "partir / s'en aller",
    memeCaption: "Waka from my life avec tes mensonges",
    context: "déplacement / rejet",
    region: "nationale"
  },
  {
    original: "mami",
    meaning: "femme / madame / mère",
    memeCaption: "La mami du quartier qui sait tout sur tout le monde",
    context: "famille/communauté",
    region: "nationale"
  },
  {
    original: "sawa",
    meaning: "d'accord / OK",
    memeCaption: "Dis sawa mais à l'intérieur...",
    context: "approbation",
    region: "nationale"
  },
  {
    original: "kamer",
    meaning: "Cameroun / camerounais",
    memeCaption: "Kamer people savent de quoi je parle",
    context: "identité nationale",
    region: "nationale"
  },
  {
    original: "man",
    meaning: "moi / je / un gars",
    memeCaption: "Man était prêt. Man avait tort.",
    context: "expression personnelle",
    region: "douala"
  },
  {
    original: "nyash",
    meaning: "fesses (argot)",
    memeCaption: "Le bus de 7h quand t'as pas de nyash pour la place",
    context: "humour adulte",
    region: "nationale"
  },
  {
    original: "linga",
    meaning: "danser / bouger",
    memeCaption: "Quand le ndombolo commence et ton corps linga tout seul",
    context: "danse/musique",
    region: "nationale"
  },
  {
    original: "kolo",
    meaning: "idiot / naïf / sans argent",
    memeCaption: "Don't be a kolo, lis le contrat avant de signer",
    context: "mise en garde",
    region: "douala"
  },
  {
    original: "quartier",
    meaning: "quartier / voisinage",
    memeCaption: "Les nouvelles du quartier arrivent avant la radio",
    context: "vie communautaire",
    region: "yaoundé"
  },
  {
    original: "tchoko",
    meaning: "pot-de-vin / corruption",
    memeCaption: "Quand ils demandent le tchoko pour le permis de conduire",
    context: "corruption / satire sociale",
    region: "nationale"
  },
  {
    original: "feymania",
    meaning: "escroquerie / arnaque élaborée",
    memeCaption: "Le feymania du 21e siècle c'est les frais de dossier",
    context: "escroquerie / humour",
    region: "nationale"
  },
];

// ═══════════════════════════════════════════════
// RÉFÉRENCES CULTURELLES CAMEROUNAISES
// ═══════════════════════════════════════════════
export const CAMEROON_CULTURAL_REFERENCES = {
  foods: [
    "ndolé", "eru", "koki", "achu", "bobolo", "miondo",
    "sanga", "kondre", "fufu", "nkui", "mbongo tchobi", "poulet DG"
  ],
  places: [
    "Yaoundé", "Douala", "Bafoussam", "Limbé", "Kribi",
    "Wouri", "Mvog-Mbi", "Biyem-Assi", "Akwa", "Bonanjo",
    "Marché Central", "Nlongkak", "Melen"
  ],
  music: [
    "bikutsi", "makossa", "ndombolo", "afrobeat camerounais",
    "bend skin", "assiko"
  ],
  expressions_yaunde: [
    "On va faire comment ?", "C'est quoi là ?", "Tu veux tuer man ?",
    "Ça va aller", "Na so e be", "On se retrouve"
  ],
  moodTags: {
    joie: ["🎉", "🌿", "🥁"],
    frustration: ["😤", "🙃", "💀"],
    nostalgie: ["🌅", "🍃", "💚"],
    humour: ["😂", "🤣", "👀"],
    fierté: ["🦁", "🇨🇲", "✊"],
    amour: ["❤️", "🌺", "💛"]
  }
};

// ═══════════════════════════════════════════════
// TEMPLATES DE CAPTIONS CAMEROUNAISES
// ═══════════════════════════════════════════════
export const CAMEROON_CAPTION_TEMPLATES = [
  "Kamer people quand {situation}",
  "POV: tu es au Cameroun et {situation}",
  "Na so e be quand {situation}",
  "L'oga de Yaoundé face à {situation}",
  "Le 237 quand {situation}",
  "Abeg, {situation} encore ?",
  "Quand le {aliment} de maman vs {situation}",
  "Man pensait éviter {situation} mais...",
  "Le quartier entier quand {situation}",
  "Douala vs Yaoundé : {situation}",
];