import express, { Router, Request, Response } from "express";
import { createCanvas, loadImage, CanvasRenderingContext2D as Ctx } from "canvas";
import { GoogleGenAI } from "@google/genai";
import { parseGIF, decompressFrames, ParsedFrame } from "gifuct-js";
import GIFEncoder from "gif-encoder-2";
import { uploadImage } from "../middlewares/multerConfig";

const router: Router = express.Router();

let ai: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY manquante.");
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

const FALLBACKS = [
  { line1: "QUAND LE STATUT DIT TOUT", line2: "MAIS LA RÉALITÉ DIT AUTRE CHOSE" },
  { line1: "MOI EN TRAIN DE FAIRE SEMBLANT", line2: "QUE TOUT VA BIEN" },
];
const pickFallback = () => FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];

function drawMemeText(ctx: Ctx, text: string, w: number, y: number, size: number) {
  ctx.font = `bold ${size}px Sans-serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#FFF";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = size / 12;

  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > w * 0.9 && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);

  lines.forEach((l, i) => {
    const ly = y + i * size * 1.1;
    ctx.strokeText(l, w / 2, ly);
    ctx.fillText(l, w / 2, ly);
  });
}

function buildFrame(frame: ParsedFrame, w: number, h: number, prev: ReturnType<typeof createCanvas> | null) {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d");
  if (prev) ctx.drawImage(prev, 0, 0);

  const patch = createCanvas(frame.dims.width, frame.dims.height);
  const pctx = patch.getContext("2d");
  const imgData = pctx.createImageData(frame.dims.width, frame.dims.height);
  imgData.data.set(frame.patch);
  pctx.putImageData(imgData, 0, 0);

  ctx.drawImage(patch, frame.dims.left, frame.dims.top);
  return canvas;
}

function decodeGif(buffer: Buffer) {
  const arr = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
  const parsed = parseGIF(arr);
  const frames = decompressFrames(parsed, true);
  if (!frames.length) throw new Error("GIF illisible.");
  return { frames, width: parsed.lsd.width, height: parsed.lsd.height };
}

function processStaticImage(buffer: Buffer, caption: { line1: string; line2: string }) {
  return loadImage(buffer).then((img) => {
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const size = Math.max(24, Math.floor(img.width / 12));
    drawMemeText(ctx, caption.line1.toUpperCase(), img.width, size * 1.2, size);
    drawMemeText(ctx, caption.line2.toUpperCase(), img.width, img.height - size * 0.8, size);
    return canvas.toBuffer("image/png");
  });
}

function processAnimatedGif(buffer: Buffer, caption: { line1: string; line2: string }) {
  const { frames, width, height } = decodeGif(buffer);
  const size = Math.max(18, Math.floor(width / 12));
  const encoder = new GIFEncoder(width, height, "octree", true, frames.length);
  encoder.start();
  encoder.setRepeat(0);

  let prev: ReturnType<typeof createCanvas> | null = null;
  for (const frame of frames) {
    const canvas = buildFrame(frame, width, height, prev);
    const ctx = canvas.getContext("2d");
    drawMemeText(ctx, caption.line1.toUpperCase(), width, size * 1.2, size);
    drawMemeText(ctx, caption.line2.toUpperCase(), width, height - size * 0.8, size);
    encoder.setDelay(frame.delay > 0 ? frame.delay : 100);
    encoder.addFrame(ctx);
    prev = canvas;
  }
  encoder.finish();
  return encoder.out.getData();
}

async function generateDanceGif(buffer: Buffer, mimeType: string) {
  let baseImage: Awaited<ReturnType<typeof loadImage>>;
  if (mimeType === "image/gif") {
    const { frames, width, height } = decodeGif(buffer);
    const firstFrame = buildFrame(frames[0], width, height, null);
    baseImage = await loadImage(firstFrame.toBuffer("image/png"));
  } else {
    baseImage = await loadImage(buffer);
  }

  const FRAMES = 24;
  const w = Math.round(baseImage.width * 1.25);
  const h = Math.round(baseImage.height * 1.25);

  const encoder = new GIFEncoder(w, h, "octree", true, FRAMES);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(60);

  for (let i = 0; i < FRAMES; i++) {
    const angle = (i / FRAMES) * Math.PI * 2;
    const bounce = -Math.abs(Math.sin(angle * 2)) * baseImage.height * 0.08;
    const rotation = Math.sin(angle) * 0.12;
    const scale = 1 + Math.abs(Math.sin(angle * 2)) * 0.08;

    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h / 2 + bounce);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);
    ctx.drawImage(baseImage, -baseImage.width / 2, -baseImage.height / 2, baseImage.width, baseImage.height);
    ctx.restore();
    encoder.addFrame(ctx);
  }
  encoder.finish();
  return encoder.out.getData();
}

router.post("/status-remixer", uploadImage.single("image"), async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Aucune image/GIF reçu (champ 'image')." });

    const buffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    const mode = (req.body.mode || "caption").toLowerCase();
    const isGif = mimeType === "image/gif";

    if (mode === "dance") {
      const gif = await generateDanceGif(buffer, mimeType);
      return res.json({
        success: true,
        imageBase64: `data:image/gif;base64,${gif.toString("base64")}`,
        mode: "dance",
        description: "Effet danse généré (rebond + rotation + zoom en boucle).",
        originalFormat: mimeType,
        outputFormat: "image/gif",
      });
    }

    let caption = pickFallback();
    let description = "Analyse hors-ligne (fallback).";

    try {
      const client = getAi();
      let base64: string;
      if (isGif) {
        const { frames, width, height } = decodeGif(buffer);
        base64 = buildFrame(frames[0], width, height, null).toBuffer("image/png").toString("base64");
      } else {
        base64 = buffer.toString("base64");
      }

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: "Génère une légende de meme drôle (humour camerounais) pour cette image." },
              { inlineData: { mimeType: isGif ? "image/png" : mimeType, data: base64 } },
            ],
          },
        ],
        config: {
          systemInstruction: `Réponds UNIQUEMENT en JSON: {"line1": "texte haut MAJUSCULES", "line2": "punchline MAJUSCULES", "description": "pourquoi c'est drôle"}`,
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text?.trim() || "{}");
      if (parsed.line1 && parsed.line2) {
        caption = { line1: parsed.line1, line2: parsed.line2 };
        description = parsed.description || "Analyse Gemini Vision.";
      }
    } catch (err: any) {
      console.warn("[status-remixer] Gemini indisponible, fallback utilisé:", err.message);
    }

    const outputBuffer = isGif ? await processAnimatedGif(buffer, caption) : await processStaticImage(buffer, caption);
    const outputMimeType = isGif ? "image/gif" : "image/png";

    return res.json({
      success: true,
      imageBase64: `data:${outputMimeType};base64,${outputBuffer.toString("base64")}`,
      caption,
      description,
      originalFormat: mimeType,
      outputFormat: outputMimeType,
    });
  } catch (error: any) {
    console.error("[status-remixer] Erreur:", error);
    return res.status(500).json({ success: false, error: "Erreur de traitement.", details: error.message });
  }
});

export default router;