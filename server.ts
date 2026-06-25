import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Configure Multer for audio storage
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Lazy initializer for Google Gen AI to prevent crash if key is undefined
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// African slang fallback library
const SLANG_LIBRARY = [
  {
    keywords: ["oga", "boss", "work", "manager", "office", "meeting"],
    theme: "Corporate",
    explanation: "High tension corporate hierarchies clashing with the slow, hot realities of the local landscape.",
    line1: "WHEN OGA SAYS THE SUBMISSION IS OVERDUE",
    line2: "BUT THE POWER GRID WENT UNSTABLE AGAIN",
    baseMemeId: "base-lion",
    title: "Oga's Ultimatum",
    tag: "#CorporateJungle"
  },
  {
    keywords: ["chop", "food", "eat", "hungry", "money", "allowance", "salary"],
    theme: "Livelihood",
    explanation: "The struggle between the ambition to 'chop life' and the direct pressure on one's wallet.",
    line1: "ALLOWANCE RECEIVED AT 2:00 PM",
    line2: "CHOPPING LIFE LIKE A CHIEF BY 2:30 PM",
    baseMemeId: "base-grandma",
    title: "The Ultimate Chop Life Vibe",
    tag: "#LocalVibes"
  },
  {
    keywords: ["danfo", "traffic", "car", "travel", "nairobi", "lagos", "commute", "matatu"],
    theme: "Commuting",
    explanation: "Communal movement inside high-speed, high-density traffic where time is elastic.",
    line1: "POV: SPEEDING THROUGH 5TH DIMENSION DANFO",
    line2: "JUST TO REACH THE COMMUTE ON TIME",
    baseMemeId: "base-danfo",
    title: "Lagos Warp Speed",
    tag: "#CyberLagos"
  },
  {
    keywords: ["hustle", "crypto", "tech", "code", "ai", "smart", "clout", "internet"],
    theme: "Tech Hustle",
    explanation: "Deep connection to high computation and cloud-rooted resilience.",
    line1: "RAPPING KENTE COATS OVER QUANTUM CIRCUITS",
    line2: "STILL ROOTED DEEP IN THE LOCAL CLOUD",
    baseMemeId: "base-robot-kente",
    title: "Ancestral Node Connected",
    tag: "#AfroFuturism"
  }
];

// 1. Context / Tone Reader API
app.post("/api/analyze-context", async (req, res) => {
  const { text } = req.body;
  if (!text || String(text).trim().length < 3) {
    return res.status(400).json({ error: "Context text is too short or missing." });
  }

  const rawText = String(text);
  console.log("Analyzing conversation thread:", rawText);

  try {
    const ai = getAi();
    const systemPrompt = `You are MemeAfrica's Neural AI analyzer. You specialize in decoding regional African slang, colloquial subtext, and humor dialects (Naija Pidgin, Sheng, West African accent, South African slang, Francophone wit).
You will analyze the pasted text. You must output a JSON object defined exactly as:
{
  "summary": "Short 1-sentence analytical summary of the pasted text's vibe",
  "sentiment": "Vibe scale like 'Intense', 'Playful Savage', 'Severe Chilling', 'Hustle Mode'",
  "culturalBreakdown": "A precise but witty breakdown of the underlying social tone in 2 short sentences.",
  "suggestedMemes": [
    {
      "title": "Creative 2-4 word Title representing a meme",
      "caption": "A witty, hilarious capitalised meme caption suited for a clapback or punchline based on the discussion",
      "tag": "Vibrant custom hashtag",
      "description": "Why this specific meme fits perfectly in the conversation context",
      "imageUrl": "One of these specific URLs representing corresponding vibes: 
         1. For street hustle/Naija/Danfo/commute: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpFUmL9pHouHx8uBlExwoCyfCKSNU5Gi-ix3XEjNPr4mnsHxLpmkYhru_7SWYpeCrmSma0VSvOkM9Ie7SxivSWcv3SM_199ZvW5251WfcYPdxrKZYiQUoVkL18tbHf4rl4VRrJ3pSNC8ArKetfquhfP3Qn0w7oz6lfNvGvWFAeFMXSl2GbHxu9nRT7RS0MF0I-2XTBgooANeczLHT9XsWFPaSA3SEdhDT8KxtPhMN8leSjaNoxeXeRlZl2NggHMoatLiOZdNseOQ8H' (The Eweee Response)
         2. For strict checking/judging/warning/auntie: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_Z6P7rbprgPhhBj56Rws4vPQvqyVmh5mOAFe2Yy-Nx9I1U8m_kiYJn_5UFPX-4dW7AhbMrNzE39aT8xQN00yXaDLjpe39ZyTdKyevlf0fSBVQ7Nwr9KonfPxCnu1XQZw-Ee_6F9n0iv9Uq_uAqe1otrrB5a0mQnEqXCFm-TXyNlbTjJWxVOSdKK1Dg1fJzPPCZxVipD6WLI-RwEJZrAp9VK2NOmtO81c6BiWeCAX8VUqd91v_rXByReAPAZY7zNlatRvykzcvGlc2' (The Auntie Side-Eye)
         3. For moving on/leaving/successful vibe jeep: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbu_fZos68kbiMBweZPraiCBef1HeDQzb2KbbVhEthSjC2iVIlwpKLk2TLf4OcgVs36IW-rGy2gEYhO14Ughm8on9ZSJzKBJmBxQJ_tyzEpUiqZt2rnaPLkBVCGD4zSVX3zKwWH2lhroqZZWVK4-HbtMkt95MSJmDmS4C5aS_3P6o8rJUO3QGKbE2u1TjLEtXHhPZ3kNxikxdH4O-ksJ0N8XJP28jcea-WT6IbyLQWHVWKwb1uLseyOngDCr7FS1A1ggWYYG8V_geW' (Chrome Rover Savanna)
         4. For high technology/ancestors/authentication: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-07x5ZFN2CJNOmYHEKaHi8AfSCVriEaBiN4w0jr9BD4RKC2YhU9D9FGz1QWkxWa-Vf7gyJCH7nQHCecdsC_3ELibqIzg0xtzinSjhZujxVSwM-J9hzdr9hCp0AF6tI78LPjbeCcOa1LFrWw5taq8J8KFPVgy6wE6ACevG8NFcj9Um47wvQ7YvzPTjgJk8uTuij3_S-FMxF5aLO-rJaRMeEQm0ZbZK7X_ruDIJsdfDgRgUc_b3iDKSzbwhu_HQQImYQOx3MUd8d51p' (Ancestors Authenticating)"
    }
  ]
}
Make sure you only output standard JSON. No packaging blocks. Do not describe anything other than JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Context to evaluate: "${rawText}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json"
      }
    });

    const bodyText = response.text ? response.text.trim() : "";
    const parsedData = JSON.parse(bodyText);
    return res.json(parsedData);

  } catch (error: any) {
    console.warn("Using localized fallback engine. Reason:", error.message);

    // Analyze input keywords on the fly to yield customized sassy responses
    const matchedSlang = SLANG_LIBRARY.find(item =>
      item.keywords.some(keyword => rawText.toLowerCase().includes(keyword))
    ) || {
      theme: "General Savage",
      explanation: "A high-calibrating analysis of casual commentary, requiring a grounding check.",
      line1: "WHEN THEY SPEAK TOO DEEP ABOUT THINGS",
      line2: "BUT THE ANCESTORS ARE ALREADY DISCONNECTED",
      baseMemeId: "base-robot-kente",
      title: "Disconnected Frequency",
      tag: "#DigitalAncestry"
    };

    const responseMeme1 = {
      title: matchedSlang.title,
      caption: matchedSlang.line1 + "\n" + matchedSlang.line2,
      tag: matchedSlang.tag,
      description: `Deciphered from keywords in your pasted thread. ${matchedSlang.explanation}`,
      imageUrl: matchedSlang.baseMemeId === "base-danfo"
        ? "https://lh3.googleusercontent.com/aida-public/AB6AXuBpFUmL9pHouHx8uBlExwoCyfCKSNU5Gi-ix3XEjNPr4mnsHxLpmkYhru_7SWYpeCrmSma0VSvOkM9Ie7SxivSWcv3SM_199ZvW5251WfcYPdxrKZYiQUoVkL18tbHf4rl4VRrJ3pSNC8ArKetfquhfP3Qn0w7oz6lfNvGvWFAeFMXSl2GbHxu9nRT7RS0MF0I-2XTBgooANeczLHT9XsWFPaSA3SEdhDT8KxtPhMN8leSjaNoxeXeRlZl2NggHMoatLiOZdNseOQ8H"
        : matchedSlang.baseMemeId === "base-grandma"
          ? "https://lh3.googleusercontent.com/aida-public/AB6AXuA_Z6P7rbprgPhhBj56Rws4vPQvqyVmh5mOAFe2Yy-Nx9I1U8m_kiYJn_5UFPX-4dW7AhbMrNzE39aT8xQN00yXaDLjpe39ZyTdKyevlf0fSBVQ7Nwr9KonfPxCnu1XQZw-Ee_6F9n0iv9Uq_uAqe1otrrB5a0mQnEqXCFm-TXyNlbTjJWxVOSdKK1Dg1fJzPPCZxVipD6WLI-RwEJZrAp9VK2NOmtO81c6BiWeCAX8VUqd91v_rXByReAPAZY7zNlatRvykzcvGlc2"
          : matchedSlang.baseMemeId === "base-lion"
            ? "https://lh3.googleusercontent.com/aida-public/AB6AXuCbu_fZos68kbiMBweZPraiCBef1HeDQzb2KbbVhEthSjC2iVIlwpKLk2TLf4OcgVs36IW-rGy2gEYhO14Ughm8on9ZSJzKBJmBxQJ_tyzEpUiqZt2rnaPLkBVCGD4zSVX3zKwWH2lhroqZZWVK4-HbtMkt95MSJmDmS4C5aS_3P6o8rJUO3QGKbE2u1TjLEtXHhPZ3kNxikxdH4O-ksJ0N8XJP28jcea-WT6IbyLQWHVWKwb1uLseyOngDCr7FS1A1ggWYYG8V_geW"
            : "https://lh3.googleusercontent.com/aida-public/AB6AXuC-07x5ZFN2CJNOmYHEKaHi8AfSCVriEaBiN4w0jr9BD4RKC2YhU9D9FGz1QWkxWa-Vf7gyJCH7nQHCecdsC_3ELibqIzg0xtzinSjhZujxVSwM-J9hzdr9hCp0AF6tI78LPjbeCcOa1LFrWw5taq8J8KFPVgy6wE6ACevG8NFcj9Um47wvQ7YvzPTjgJk8uTuij3_S-FMxF5aLO-rJaRMeEQm0ZbZK7X_ruDIJsdfDgRgUc_b3iDKSzbwhu_HQQImYQOx3MUd8d51p"
    };

    // Extra suggestions
    const extraMeme1 = {
      title: "The Auntie Side-Eye",
      caption: "WE SEE EVERYTHING BUT WE KEEP QUIET AND CHOP BANANAS",
      tag: "#AuntieVibes",
      description: "Fallback recommendation warning against overcomplicating things.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_Z6P7rbprgPhhBj56Rws4vPQvqyVmh5mOAFe2Yy-Nx9I1U8m_kiYJn_5UFPX-4dW7AhbMrNzE39aT8xQN00yXaDLjpe39ZyTdKyevlf0fSBVQ7Nwr9KonfPxCnu1XQZw-Ee_6F9n0iv9Uq_uAqe1otrrB5a0mQnEqXCFm-TXyNlbTjJWxVOSdKK1Dg1fJzPPCZxVipD6WLI-RwEJZrAp9VK2NOmtO81c6BiWeCAX8VUqd91v_rXByReAPAZY7zNlatRvykzcvGlc2"
    };

    const extraMeme2 = {
      title: "The 'Eweee' Reaction",
      caption: "ME DECYPHERING WHO PASTED WATER THREADS AT THREE AM",
      tag: "#LocalVibes",
      description: "Reaction placeholder generated dynamically as fallback.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpFUmL9pHouHx8uBlExwoCyfCKSNU5Gi-ix3XEjNPr4mnsHxLpmkYhru_7SWYpeCrmSma0VSvOkM9Ie7SxivSWcv3SM_199ZvW5251WfcYPdxrKZYiQUoVkL18tbHf4rl4VRrJ3pSNC8ArKetfquhfP3Qn0w7oz6lfNvGvWFAeFMXSl2GbHxu9nRT7RS0MF0I-2XTBgooANeczLHT9XsWFPaSA3SEdhDT8KxtPhMN8leSjaNoxeXeRlZl2NggHMoatLiOZdNseOQ8H"
    };

    return res.json({
      summary: `Found accents of ${matchedSlang.theme} context.`,
      sentiment: "Intense Chill",
      culturalBreakdown: `Analyzed slang cues with our offline rulebook. ${matchedSlang.explanation}`,
      suggestedMemes: [responseMeme1, extraMeme1, extraMeme2]
    });
  }
});

// 2. Voice-to-Meme & Text Caption Generator API
app.post("/api/generate-meme", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || String(prompt).trim().length < 2) {
    return res.status(400).json({ error: "Voice prompt descriptions must have length." });
  }

  const rawPrompt = String(prompt);
  console.log("Generating meme parameters for prompt:", rawPrompt);

  try {
    const ai = getAi();
    const systemPrompt = `You are a creative, elite meme architect for MemeAfrica. 
The user describes a visual or verbal vibe (e.g. "when your manager tells you to print a website", "eating too much plantain", "Lagos bus driver speed").
You must synthesize two witty meme lines (Line 1 for top, Line 2 for bottom), write a funny cultural breakdown explaining the joke, and suggest a visualPrompt description.
Return a clean JSON object defined exactly as:
{
  "captionLine1": "Witty upper meme caption (all-caps)",
  "captionLine2": "Punchline lower meme caption (all-caps)",
  "culturalExplanation": "A brief funny sentence explaining why this joke hits the spot.",
  "visualPrompt": "Detailed visual layout instructions describing the scene",
  "recommendedBaseImageId": "Match the prompt theme to one of: 'base-lion', 'base-danfo', 'base-grandma', 'base-baobab', 'base-robot-kente'"
}
Output only JSON. Do not include markdown wraps.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Prompt reference: "${rawPrompt}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json"
      }
    });

    const parsedData = JSON.parse(response.text ? response.text.trim() : "{}");
    return res.json(parsedData);

  } catch (error: any) {
    console.warn("Using localized meme caption engine fallbacks. Reason:", error.message);

    // Dynamic heuristic parser for offline caption generation
    const cleanPrompt = rawPrompt.toLowerCase();
    let bestMatch = SLANG_LIBRARY[0];

    // Scan library
    for (const item of SLANG_LIBRARY) {
      if (item.keywords.some(k => cleanPrompt.includes(k))) {
        bestMatch = item;
        break;
      }
    }

    // Adapt to their words slightly
    const upperText = `WHEN YOU DESCRIBE "${rawPrompt.toUpperCase().slice(0, 30)}..."`;
    const lowerText = `BUT ${bestMatch.line2}`;

    return res.json({
      captionLine1: upperText,
      captionLine2: lowerText,
      culturalExplanation: `Derived offline from your prompt. Matches best with ${bestMatch.theme} themes!`,
      visualPrompt: `An beautiful high-fidelity render corresponding to: ${rawPrompt}`,
      recommendedBaseImageId: bestMatch.baseMemeId
    });
  }
});

// 3. Voice-to-Meme API (Member 4)
app.post("/api/voice-to-meme", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No audio file uploaded." });
  }

  console.log("Processing voice-to-meme for file:", req.file.path);

  try {
    const ai = getAi();
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);
    const base64Audio = fileBuffer.toString("base64");

    const systemPrompt = `You are a high-fidelity meme architect. You will receive an audio clip.
Your tasks:
1. Transcribe the audio accurately, including regional nuances/slang.
2. Analyze the emotion and cultural context of the speech.
3. Generate a hilarious 2-line meme (top/bottom captions) based on the transcription.
4. Provide a witty cultural explanation for the meme.

Output a JSON object exactly as:
{
  "transcription": "The transcribed text",
  "emotion": "Dominant emotion detected",
  "captionLine1": "WITTY TOP CAPTION (ALL-CAPS)",
  "captionLine2": "PUNCHLINE BOTTOM CAPTION (ALL-CAPS)",
  "culturalExplanation": "Funny cultural context explanation.",
  "recommendedBaseImageId": "One of: 'base-lion', 'base-danfo', 'base-grandma', 'base-baobab', 'base-robot-kente'"
}
Output only JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Audio,
                mimeType: req.file.mimetype
              }
            },
            { text: systemPrompt }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const bodyText = response.text ? response.text.trim() : "{}";
    const parsedData = JSON.parse(bodyText);

    // Clean up temporary file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.json(parsedData);

  } catch (error: any) {
    console.error("Voice-to-Meme error:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      error: "Failed to process voice-to-meme",
      details: error.message
    });
  }
});

// Serve files FIRST
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Configure Vite middleware or static delivery
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MemeAfrica full-stack server running on http://localhost:${PORT}`);
  });
}

setupServer();
