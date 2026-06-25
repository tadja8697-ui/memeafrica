// src/middleware/culturalAdapter.ts
// Membre 3 — Middleware d'adaptation culturelle camerounaise
// Applicable sur : /api/context-reader, /api/voice-to-meme

import {
  CAMFRANGLAIS_DICTIONARY,
  CAMEROON_CULTURAL_REFERENCES,
  CAMEROON_CAPTION_TEMPLATES,
  CulturalContext,
  CamExpression,
} from '../data/cameroon-culture';

// ─────────────────────────────────────────────
// FONCTION PRINCIPALE : adaptCulturally()
// Entrée  : texte brut (venant de context-reader ou voice-to-meme)
// Sortie  : CulturalContext enrichi
// ─────────────────────────────────────────────
export function adaptCulturally(inputText: string): CulturalContext {
  const lowerText = inputText.toLowerCase();
  const detectedExpressions: CamExpression[] = [];

  // 1. Scanner le dictionnaire camfranglais
  CAMFRANGLAIS_DICTIONARY.forEach((entry) => {
    if (lowerText.includes(entry.original.toLowerCase())) {
      detectedExpressions.push(entry);
    }
  });

  // 2. Scanner les références culturelles (lieux, nourriture, musique)
  const allRefs = [
    ...CAMEROON_CULTURAL_REFERENCES.foods,
    ...CAMEROON_CULTURAL_REFERENCES.places,
    ...CAMEROON_CULTURAL_REFERENCES.music,
  ];

  const foundRefs = allRefs.filter((ref) =>
    lowerText.includes(ref.toLowerCase())
  );

  // 3. Détecter le mood
  const moodTag = detectMood(lowerText, detectedExpressions);

  // 4. Choisir un emoji culturel
  const suggestedEmoji = pickCulturalEmoji(moodTag);

  // 5. Calculer le score culturel (0-100)
  const culturalScore = Math.min(
    100,
    detectedExpressions.length * 20 + foundRefs.length * 10
  );

  return {
    detected: detectedExpressions.length > 0 || foundRefs.length > 0,
    expressions: detectedExpressions,
    moodTag,
    suggestedEmoji,
    culturalScore,
  };
}

// ─────────────────────────────────────────────
// Enrichit une caption existante avec le style camerounais
// ─────────────────────────────────────────────
export function enrichCaption(
  caption: string,
  context: CulturalContext
): { top: string; bottom: string } {
  if (!context.detected) {
    return { top: caption, bottom: "" };
  }

  // Prendre la première expression détectée pour enrichir
  const firstExpr = context.expressions[0];
  if (firstExpr) {
    return {
      top: firstExpr.memeCaption.split(" ").slice(0, 5).join(" ").toUpperCase(),
      bottom: firstExpr.memeCaption.split(" ").slice(5).join(" ").toUpperCase(),
    };
  }

  // Sinon, utiliser un template aléatoire
  const template =
    CAMEROON_CAPTION_TEMPLATES[
      Math.floor(Math.random() * CAMEROON_CAPTION_TEMPLATES.length)
    ];

  return {
    top: template.replace("{situation}", caption).toUpperCase(),
    bottom: `🇨🇲 ${context.suggestedEmoji}`,
  };
}

// ─────────────────────────────────────────────
// Construit le système prompt pour l'API Gemini/Claude
// avec le contexte culturel camerounais injecté
// ─────────────────────────────────────────────
export function buildCulturalSystemPrompt(basePrompt: string): string {
  return `${basePrompt}

CONTEXTE CULTUREL CAMEROUNAIS — INSTRUCTIONS OBLIGATOIRES :
Tu dois adapter ta réponse au contexte camerounais. 
- Utilise des références au camfranglais (mélange camerounais de français et d'anglais)
- Intègre des références à la culture locale : ndolé, bikutsi, Yaoundé, Douala, oga, abeg, chop life
- Le ton doit être chaud, communautaire et humoristique à la camerounaise
- Privilégie les expressions comme : "Na so e be", "Abeg", "On va faire comment ?", "Man", "Kamer people"
- Les captions mèmes doivent résonner avec la réalité camerounaise (transport, burocratie, famille, nourriture)
- Réponds toujours en FRANÇAIS (avec des touches de camfranglais selon le contexte)`;
}

// ─────────────────────────────────────────────
// Fonctions utilitaires internes
// ─────────────────────────────────────────────
function detectMood(text: string, expressions: CamExpression[]): string {
  const joyWords = ["chop", "linga", "sawa", "chale", "life", "sweet"];
  const frustWords = ["kong", "oga", "abeg", "waka", "kolo", "tchoko"];
  const prideWords = ["kamer", "237", "cameroun", "national"];

  const hasJoy = joyWords.some((w) => text.includes(w));
  const hasFrust = frustWords.some((w) => text.includes(w));
  const hasPride = prideWords.some((w) => text.includes(w));

  if (hasPride) return "fierté";
  if (hasJoy) return "joie";
  if (hasFrust) return "frustration";
  if (expressions.length > 2) return "humour";
  return "humour";
}

function pickCulturalEmoji(mood: string): string {
  const CAMEROON_CULTURAL_REFERENCES_MOODS: Record<string, string[]> = {
    joie: ["🎉", "🌿", "🥁"],
    frustration: ["😤", "🙃", "💀"],
    nostalgie: ["🌅", "🍃", "💚"],
    humour: ["😂", "🤣", "👀"],
    fierté: ["🦁", "🇨🇲", "✊"],
    amour: ["❤️", "🌺", "💛"],
  };
  const pool = CAMEROON_CULTURAL_REFERENCES_MOODS[mood] || ["🇨🇲"];
  return pool[Math.floor(Math.random() * pool.length)];
}