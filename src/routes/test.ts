import { Router } from "express";
import { model } from "../config/gemini";

const router = Router();

router.get("/", (req, res) => {
  res.json({ success: true, message: "Backend fonctionnel ✅" });
});

router.post("/analyze", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Texte requis" });

    const prompt = Analyse le ton de ce texte et propose un meme humoristique : "";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ success: true, meme: response.text() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
