import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  Grid3x3, 
  Brain, 
  Mic2, 
  VolumeX,
  Volume2,
  Sparkles, 
  Settings, 
  Search, 
  Download, 
  Share2, 
  Heart, 
  Bookmark, 
  Plus, 
  Check, 
  ArrowRight, 
  Trash2, 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  RefreshCw, 
  ChevronUp, 
  ChevronDown, 
  X,
  Languages,
  MicOff,
  AlertCircle,
  Image,
  ExternalLink,
  Send,
  Moon,
  Sun,
  History,
  Type
} from 'lucide-react';

import { 
  MemeItem, 
  StickerItem, 
  PlacedSticker, 
  TextOverlay, 
  AnalysisMemeSuggestion,
  AnalysisResponse,
  GeneratorResponse
} from './types';

import { 
  BASE_MEMES, 
  STICKERS, 
  OTHER_SUGGESTED_MEMES 
} from './data/assets';

const API_URL = (import.meta as any).env?.VITE_API_URL || '';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'feed' | 'analyze' | 'voice' | 'studio' | 'share' | 'history'>('feed');

  // Dark/Light mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Historique des memes générés
  const [memeHistory, setMemeHistory] = useState<Array<{id: string; image: string; caption: string; date: string}>>([]);

  // Texte sur image importée
  const [overlayText, setOverlayText] = useState<string>('');
  const [overlayFont, setOverlayFont] = useState<string>('Impact');
  const [overlaySize, setOverlaySize] = useState<number>(32);
  const [overlayColor, setOverlayColor] = useState<string>('#ffffff');
  const [showOverlayEditor, setShowOverlayEditor] = useState<boolean>(false);

  // Share & Generate Image states (Membre 6)
  const [generatePrompt, setGeneratePrompt] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [shareLinks, setShareLinks] = useState<Record<string, string> | null>(null);
  const [shareMemeText, setShareMemeText] = useState<string>("");

  // Unified global editor parameters
  const [currentBackdrop, setCurrentBackdrop] = useState<MemeItem>(BASE_MEMES[4]); // default is Robot in Kente
  const [captionTop, setCaptionTop] = useState<string>("When the AI hits");
  const [captionBottom, setCaptionBottom] = useState<string>("JUST RIGHT");
  const [captionColor, setCaptionColor] = useState<string>("#ffba20"); // default is Gold
  const [captionSize, setCaptionSize] = useState<number>(32);
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  // Sticker manipulation coordinates
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDraggingSticker, setIsDraggingSticker] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Voice recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceText, setVoiceText] = useState<string>("");
  const [voiceStatus, setVoiceStatus] = useState<string>("Click to start recording...");
  const [recordingProgress, setRecordingProgress] = useState<number>(0);
  const [audioLevelArray, setAudioLevelArray] = useState<number[]>([10, 20, 40, 60, 40, 20, 10]);

  // Audio synther feedback
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // Context analyzer states
  const [pastedContextText, setPastedContextText] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Editor prompt state
  const [remixPromptText, setRemixPromptText] = useState<string>("");
  const [isRemixLoading, setIsRemixLoading] = useState<boolean>(false);
  const [studioStatusMessage, setStudioStatusMessage] = useState<string>("Lagos-1 AI Engine Ready");

  // App ratings / likes tracker
  const [likedMemeIds, setLikedMemeIds] = useState<Record<string, boolean>>({});
  const [customMemesList, setCustomMemesList] = useState<MemeItem[]>(BASE_MEMES);

  // Load preset sample text into Context Reader
  const presets = [
    "Abeg, tell that oga that power grid went unstable again, we can't submit code today chale!",
    "Oga don arrive with vex, looking over his spectacles like an auntie checking our papers...",
    "POV: Landing in JKIA with the morning sun, Nairobi coffee hitting, about to chop life like a chief."
  ];

  // Génération d'image via Gemini (Membre 6)
  const handleGenerateImage = async () => {
    if (!generatePrompt.trim()) return;
    setIsGeneratingImage(true);
    setGenerateError(null);
    setGeneratedImage(null);
    try {
      const res = await fetch(`${API_URL}/api/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: generatePrompt, style: "cartoon african" }),
      });
      const data = await res.json();
      if (data.imageBase64) {
        setGeneratedImage(data.imageBase64);
        // Ajouter à l'historique
        setMemeHistory(prev => [{
          id: Date.now().toString(),
          image: data.imageBase64,
          caption: generatePrompt,
          date: new Date().toLocaleTimeString()
        }, ...prev.slice(0, 9)]);
        playDjembeSound(440, 'sine');
      } else {
        setGenerateError(data.error || "Erreur inconnue");
      }
    } catch {
      setGenerateError("Impossible de contacter le serveur.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Génération des liens de partage (Membre 6)
  const handleGetShareLinks = async () => {
    if (!shareMemeText.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/share-links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: shareMemeText, imageUrl: generatedImage || "" }),
      });
      const data = await res.json();
      setShareLinks(data.shareLinks);
      playDjembeSound(330, 'triangle');
    } catch (err) {
      console.error("Erreur share links:", err);
    }
  };

  // HTML Audio Synthesis
  const playDjembeSound = (pitch: number = 220, type: OscillatorType = 'triangle') => {
    if (isAudioMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(pitch, audioCtx.currentTime); 
      // pitch envelope decay
      osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.15);
      
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      console.warn("AudioContext block by frame constraints", e);
    }
  };

  // Browser WebSpeech API recognition
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startSpeechRecognition = () => {
    // Essayer d'abord Web Speech API (fonctionne sur Chrome Android sans backend)
    const SpeechClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechClass) {
      try {
        const recognition = new SpeechClass();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'fr-FR';

        recognition.onstart = () => {
          setVoiceStatus("🎙️ Parle maintenant...");
          playDjembeSound(260, 'sine');
        };

        recognition.onresult = (e: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const transcript = e.results[i][0].transcript;
            if (e.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          // Afficher en temps réel (interim + final)
          const displayText = finalTranscript || interimTranscript;
          if (displayText) {
            setVoiceText(displayText);
            setVoiceStatus(`✍️ ${displayText}`);
          }
          
          // Quand c'est final, mettre à jour les captions
          if (finalTranscript) {
            setCaptionTop("POV: WHEN THEY SAID");
            setCaptionBottom(finalTranscript.toUpperCase());
            playDjembeSound(440, 'sine');
            setIsRecording(false);
            setRecordingProgress(0);
          }
        };

        recognition.onerror = (e: any) => {
          if (e.error === 'not-allowed') {
            setVoiceStatus("❌ Micro bloqué. Autorise le micro dans les paramètres.");
          } else {
            setVoiceStatus("⚠️ Erreur micro. Essaie encore !");
          }
          setIsRecording(false);
          setRecordingProgress(0);
        };

        recognition.onend = () => {
          if (isRecording) {
            setIsRecording(false);
            setRecordingProgress(0);
          }
        };

        recognition.start();
        return;
      } catch {
        // Fallback vers MediaRecorder si Web Speech API échoue
      }
    }

    // Fallback : MediaRecorder → backend
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        audioChunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        setVoiceStatus("🎙️ Enregistrement en cours...");
        playDjembeSound(260, 'sine');

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach(t => t.stop());
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setVoiceStatus("🤖 Analyse IA en cours...");

          try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'voice.webm');
            const res = await fetch(`${API_URL}/api/voice-to-meme`, { method: 'POST', body: formData });
            const data = await res.json();

            if (data.transcription) {
              setVoiceText(data.transcription);
              setVoiceStatus(`✅ "${data.transcription}"`);
              setCaptionTop(data.captionLine1 || "POV: WHEN THEY SAID");
              setCaptionBottom(data.captionLine2 || data.transcription.toUpperCase());
              playDjembeSound(440, 'sine');
            } else {
              setVoiceStatus("⚠️ Erreur IA.");
              generateMockTranscript();
            }
          } catch {
            setVoiceStatus("📵 Serveur indisponible.");
            generateMockTranscript();
          }
          setIsRecording(false);
          setRecordingProgress(0);
        };

        mediaRecorder.start();
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') mediaRecorder.stop();
        }, 8000);
      })
      .catch(() => {
        setVoiceStatus("❌ Microphone bloqué.");
        generateMockTranscript();
      });
  };

  const generateMockTranscript = () => {
    const mockPhrases = [
      "Me eating perfect sweet jollof on a hot afternoon",
      "That feeling when you find a perfect matatu with no traffic",
      "Oga says submit by nine AM but the server is sleeping",
      "When the Afrobeat bass drop is too sweet to resist"
    ];
    const phrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
    setTimeout(() => {
      setVoiceText(phrase);
      setVoiceStatus(`Auto Transcript: "${phrase}"`);
      setCaptionTop("POV: THAT MOMENT");
      setCaptionBottom(phrase.toUpperCase());
      playDjembeSound(330, 'triangle');
      setIsRecording(false);
      setRecordingProgress(0);
    }, 1800);
  };

  // Simulate audio level visualizer waving
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingProgress((prev) => (prev + 4) % 100);
        setAudioLevelArray(Array.from({ length: 9 }, () => Math.floor(Math.random() * 80) + 15));
        playDjembeSound(Math.floor(Math.random() * 120) + 90, 'triangle');
      }, 100);
    } else {
      setAudioLevelArray([8, 12, 10, 8, 10, 15, 8]);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleMicTap = () => {
    if (!isRecording) {
      setIsRecording(true);
      setVoiceText("");
      setVoiceStatus("🎙️ Initialisation...");
      startSpeechRecognition();
    } else {
      // Stopper Web Speech API
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      // Stopper MediaRecorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      setVoiceStatus("Click to start recording...");
    }
  };

  // Analyze Tone calling actual server or Fallback
  const analyzeToneOfChatText = async () => {
    if (!pastedContextText.trim()) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    playDjembeSound(180, 'sawtooth');

    try {
      const response = await fetch(`${API_URL}/api/analyze-context`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pastedContextText })
      });

      if (!response.ok) {
        throw new Error("API analysis failed");
      }

      const data: AnalysisResponse = await response.json();
      setAnalysisResult(data);
      playDjembeSound(350, 'sine');
    } catch (err: any) {
      setAnalysisError("Network slow down. Dynamic offline engine loaded standard backups.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Describe a remix on Studio Canvas calling API or Fallback
  const runRemixAiEngine = async () => {
    if (!remixPromptText.trim()) return;
    setIsRemixLoading(true);
    setStudioStatusMessage("Querying Lagos-1 Core...");
    playDjembeSound(220, 'triangle');

    try {
      const response = await fetch(`${API_URL}/api/generate-meme`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: remixPromptText })
      });

      if (!response.ok) {
        throw new Error("Server generation failed");
      }

      const data = await response.json();
      setCaptionTop(data.captionLine1 || "POV: REMIX ACTIVE");
      setCaptionBottom(data.captionLine2 || remixPromptText.toUpperCase());
      setStudioStatusMessage(`Ready: ${data.culturalExplanation || "Processed successfully!"}`);
      
      // Select recommended backdrop if matched
      if (data.recommendedBaseImageId) {
        const matchingBackdrop = BASE_MEMES.find(b => b.id === data.recommendedBaseImageId);
        if (matchingBackdrop) {
          setCurrentBackdrop(matchingBackdrop);
        }
      }
      playDjembeSound(380, 'sine');
    } catch (error) {
      // Fallback in-app calculations
      setCaptionTop("POV: WHEN YOU REMIX");
      setCaptionBottom(remixPromptText.toUpperCase());
      setStudioStatusMessage("Standard prompt applied offline.");
      playDjembeSound(200, 'triangle');
    } finally {
      setIsRemixLoading(false);
      setRemixPromptText("");
    }
  };

  // Handle placing a sticker
  const placeStickerOnCanvas = (sticker: StickerItem) => {
    const newPlaced: PlacedSticker = {
      id: `placed-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      stickerId: sticker.id,
      imageUrl: sticker.imageUrl,
      x: 35 + Math.random() * 10,
      y: 20 + Math.random() * 10,
      scale: 1.0,
      rotation: 0
    };
    setPlacedStickers([...placedStickers, newPlaced]);
    setSelectedStickerId(newPlaced.id);
    playDjembeSound(300, 'sine');
  };

  // Sticker adjustments
  const adjustSelectedSticker = (action: 'scale-up' | 'scale-down' | 'rotate-cw' | 'rotate-ccw' | 'delete') => {
    if (!selectedStickerId) return;
    
    if (action === 'delete') {
      setPlacedStickers(placedStickers.filter(s => s.id !== selectedStickerId));
      setSelectedStickerId(null);
      playDjembeSound(150, 'sawtooth');
      return;
    }

    setPlacedStickers(placedStickers.map(s => {
      if (s.id !== selectedStickerId) return s;
      switch (action) {
        case 'scale-up':
          return { ...s, scale: Math.min(s.scale + 0.1, 3.0) };
        case 'scale-down':
          return { ...s, scale: Math.max(s.scale - 0.1, 0.2) };
        case 'rotate-cw':
          return { ...s, rotation: (s.rotation + 15) % 360 };
        case 'rotate-ccw':
          return { ...s, rotation: (s.rotation - 15) % 360 };
        default:
          return s;
      }
    }));
    playDjembeSound(280, 'sine');
  };

  // Dragging stickers inside container
  const handleStickerMouseDown = (e: React.MouseEvent, stickerId: string) => {
    e.stopPropagation();
    setSelectedStickerId(stickerId);
    setIsDraggingSticker(true);

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const currentSticker = placedStickers.find(s => s.id === stickerId);
      if (currentSticker) {
        // Find percentage offset
        const xPx = (currentSticker.x / 100) * rect.width;
        const yPx = (currentSticker.y / 100) * rect.height;
        setDragOffset({
          x: clientX - rect.left - xPx,
          y: clientY - rect.top - yPx
        });
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingSticker || !selectedStickerId || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const xPx = e.clientX - rect.left - dragOffset.x;
    const yPx = e.clientY - rect.top - dragOffset.y;

    // Convert back to percentages
    const xPct = Math.max(0, Math.min(100, (xPx / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, (yPx / rect.height) * 100));

    setPlacedStickers(placedStickers.map(s => {
      if (s.id === selectedStickerId) {
        return { ...s, x: xPct, y: yPct };
      }
      return s;
    }));
  };

  const handleCanvasMouseUp = () => {
    setIsDraggingSticker(false);
  };

  // Handle Likes state
  const toggleLikeMeme = (id: string) => {
    const wasLiked = likedMemeIds[id];
    setLikedMemeIds({ ...likedMemeIds, [id]: !wasLiked });
    
    setCustomMemesList(customMemesList.map(item => {
      if (item.id === id) {
        return { ...item, likes: item.likes + (wasLiked ? -1 : 1) };
      }
      return item;
    }));
    playDjembeSound(wasLiked ? 140 : 440, 'sine');
  };

  // Load selected suggested meme into Studio Editor
  const loadMemeIntoStudio = (title: string, tag: string, desc: string, img: string) => {
    const chosenMeme: MemeItem = {
      id: `custom-${Date.now()}`,
      title,
      description: desc,
      imageUrl: img,
      tags: [tag],
      likes: 1,
      category: 'Remix'
    };
    
    setCurrentBackdrop(chosenMeme);
    setCaptionTop("POV: CONTEXT DETECTED");
    setCaptionBottom(title.toUpperCase());
    setPlacedStickers([]);
    setSelectedStickerId(null);
    setActiveTab('studio');
    playDjembeSound(400, 'sine');
  };

  // Capture le canvas en dessinant chaque élément manuellement (CORS-safe)
  const captureCanvas = (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!canvasRef.current) { resolve(null); return; }

      const container = canvasRef.current;
      const rect = container.getBoundingClientRect();
      const W = rect.width || 400;
      const H = rect.height || 400;
      const SCALE = 2;

      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = W * SCALE;
      outputCanvas.height = H * SCALE;
      const ctx = outputCanvas.getContext('2d');
      if (!ctx) { resolve(null); return; }
      ctx.scale(SCALE, SCALE);

      // 1. Dessiner le backdrop
      const backdropImg = new window.Image();
      backdropImg.crossOrigin = 'anonymous';

      const drawEverythingElse = () => {
        // 2. Dessiner les stickers placés
        let stickerPromises = placedStickers.map(sticker => {
          return new Promise<void>((res) => {
            const sImg = new window.Image();
            sImg.crossOrigin = 'anonymous';
            sImg.onload = () => {
              ctx.save();
              const px = (sticker.x / 100) * W;
              const py = (sticker.y / 100) * H;
              const sw = 80 * sticker.scale;
              const sh = 80 * sticker.scale;
              ctx.translate(px, py);
              ctx.rotate((sticker.rotation * Math.PI) / 180);
              ctx.drawImage(sImg, -sw / 2, -sh / 2, sw, sh);
              ctx.restore();
              res();
            };
            sImg.onerror = () => res();
            sImg.src = sticker.imageUrl;
          });
        });

        Promise.all(stickerPromises).then(() => {
          // 3. Dessiner captionTop
          if (captionTop) {
            ctx.save();
            ctx.font = `bold ${captionSize}px Impact, Arial`;
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.textAlign = 'center';
            ctx.strokeText(captionTop, W / 2, captionSize + 10);
            ctx.fillText(captionTop, W / 2, captionSize + 10);
            ctx.restore();
          }

          // 4. Dessiner captionBottom
          if (captionBottom) {
            ctx.save();
            ctx.font = `bold ${captionSize + 4}px Impact, Arial`;
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.textAlign = 'center';
            ctx.strokeText(captionBottom, W / 2, H - 20);
            ctx.fillText(captionBottom, W / 2, H - 20);
            ctx.restore();
          }

          // 5. Dessiner overlayText personnalisé
          if (overlayText) {
            ctx.save();
            ctx.font = `${overlaySize}px ${overlayFont}`;
            ctx.fillStyle = overlayColor;
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.textAlign = 'center';
            ctx.strokeText(overlayText, W / 2, H - 70);
            ctx.fillText(overlayText, W / 2, H - 70);
            ctx.restore();
          }

          resolve(outputCanvas.toDataURL('image/png'));
        });
      };

      backdropImg.onload = () => {
        ctx.drawImage(backdropImg, 0, 0, W, H);
        drawEverythingElse();
      };
      backdropImg.onerror = () => {
        // Si le backdrop ne charge pas, fond noir
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, W, H);
        drawEverythingElse();
      };
      backdropImg.src = currentBackdrop.imageUrl;
    });
  };

  // Export → partager le sticker dans Share
  const simulateMemeExport = async () => {
    playDjembeSound(480, 'sine');
    const imageDataUrl = await captureCanvas();
    const finalImage = imageDataUrl || currentBackdrop.imageUrl;
    setGeneratedImage(finalImage);
    setShareMemeText(`${captionTop} ${captionBottom} #MemeAfrica`);
    // Ajouter à l'historique
    setMemeHistory(prev => [{
      id: Date.now().toString(),
      image: finalImage,
      caption: `${captionTop} ${captionBottom}`,
      date: new Date().toLocaleTimeString()
    }, ...prev.slice(0, 9)]);
    setActiveTab('share');
    playDjembeSound(440, 'sine');
  };

  // Créer Sticker → sauvegarder dans galerie + mettre à jour historique
  const createSticker = async () => {
    playDjembeSound(300, 'triangle');
    setStudioStatusMessage('⏳ Création du sticker...');
    
    const stickerDate = new Date().toLocaleTimeString();
    const stickerCaption = `${captionTop} ${captionBottom}`.trim() || 'Mon Sticker';
    const stickerId = Date.now().toString();

    const imageDataUrl = await captureCanvas();
    const finalDataUrl = imageDataUrl || currentBackdrop.imageUrl;

    // Créer un canvas carré 512x512
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    
    const processSave = (dataUrl: string) => {
      const img2 = new window.Image();
      img2.onload = async () => {
        const stickerCanvas = document.createElement('canvas');
        stickerCanvas.width = 512;
        stickerCanvas.height = 512;
        const ctx = stickerCanvas.getContext('2d');
        if (ctx) {
          const minDim = Math.min(img2.width, img2.height);
          const sx = (img2.width - minDim) / 2;
          const sy = (img2.height - minDim) / 2;
          ctx.drawImage(img2, sx, sy, minDim, minDim, 0, 0, 512, 512);
          const stickerDataUrl = stickerCanvas.toDataURL('image/png');

          // Sauvegarder avec Capacitor si disponible (APK)
          try {
            const { Filesystem, Directory } = await import('@capacitor/filesystem');
            const { Share } = await import('@capacitor/share');
            const base64Data = stickerDataUrl.split(',')[1];
            const fileName = `sticker-memeafrica-${stickerId}.png`;
            
            await Filesystem.writeFile({
              path: fileName,
              data: base64Data,
              directory: Directory.Documents,
            });

            // Partager vers les apps (ouvre le menu natif Android)
            await Share.share({
              title: 'Mon Sticker MemeAfrica',
              text: stickerCaption,
              url: `file://${fileName}`,
              dialogTitle: 'Partager le sticker',
            });

          } catch {
            // Fallback navigateur web : téléchargement direct
            const link = document.createElement('a');
            link.download = `sticker-memeafrica-${stickerId}.png`;
            link.href = stickerDataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }

          // Mettre à jour l'historique
          setMemeHistory(prev => [{
            id: stickerId,
            image: stickerDataUrl,
            caption: `🎭 ${stickerCaption}`,
            date: stickerDate
          }, ...prev.slice(0, 9)]);

          setStudioStatusMessage('✅ Sticker sauvegardé dans la galerie !');
          playDjembeSound(440, 'sine');
          setTimeout(() => setStudioStatusMessage('Studio prêt'), 3000);
        }
      };
      img2.onerror = () => {
        // Si l'image ne charge pas, utiliser directement le backdrop
        const link = document.createElement('a');
        link.download = `sticker-memeafrica-${stickerId}.png`;
        link.href = currentBackdrop.imageUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setStudioStatusMessage('✅ Sticker téléchargé !');
        setTimeout(() => setStudioStatusMessage('Studio prêt'), 3000);
      };
      img2.src = dataUrl;
    };

    processSave(finalDataUrl);
  };

  return (
    <div id="memeafrica-app" className={`kente-pattern min-h-screen select-none relative pb-28 md:pb-20 overflow-x-hidden ${isDarkMode ? 'text-on-surface' : 'bg-gray-100 text-gray-900'}`}>
      
      {/* HEADER SECTION */}
      <header className="flex justify-between items-center px-4 md:px-12 h-16 w-full fixed top-0 z-50 bg-surface/30 backdrop-blur-xl border-b border-tertiary/20">
        <div className="flex items-center gap-3">
          {/* Main profile picture illustrating digital gold makeup */}
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary shadow-lg shadow-primary/10">
            <img 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover" 
              alt="Meme creator avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDew8t9B402E2KKejKjQLRcFzQZ2RentTe2B_a_HbmQakNT-mgqwgszOZMyfWPTjpxPxvDTz4AUXXna-iF38GBJyicOFar7fyljb7wqaMzK0ayDKAbWGKY_TC_1DLv0xcXAZV14v9JWzDhLDrgcCT7TEBN6AMAP7T3CoAw4c1eEbp6TwLQRhbc7QrglyfOBCIphkHyg1Yem45sxkDXA2rs5OHDWx2cd2zizF1YF9xcoA4c-Fefux7CK7C6aDAC9pOt2ELchHiGK1PQl"
            />
          </div>
          <h1 className="font-syne text-xl md:text-2xl font-extrabold text-primary tracking-tight">MemeAfrica<span className="text-tertiary ml-1 font-sans text-xs uppercase px-1.5 py-0.5 bg-tertiary/10 border border-tertiary/30 rounded-md">AI</span></h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Sound Synthesizer Mutone */}
          <button 
            id="synth-mute-toggle"
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="p-2 rounded-full hover:bg-white/5 text-primary-fixed-dim/75 transition-colors"
            title={isAudioMuted ? "Unmute Djembe Beeps" : "Mute Djembe Beeps"}
          >
            {isAudioMuted ? <VolumeX className="w-5 h-5 text-error" /> : <Volume2 className="w-5 h-5 text-tertiary" />}
          </button>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-white/5 text-on-surface-variant transition-colors"
            title={isDarkMode ? "Mode Clair" : "Mode Sombre"}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
          </button>
          <button className="p-2 rounded-full hover:bg-white/5 text-on-surface-variant transition-colors">
            <Search className="w-5 h-5 text-on-surface" />
          </button>
          <button className="p-2 rounded-full hover:bg-white/5 text-primary transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* CORE CANVAS WORKSPACE MARGIN ADAPTING */}
      <main className="pt-20 px-4 md:px-12 max-w-7xl mx-auto z-10 relative">
        <AnimatePresence mode="wait">
          
          {/* FEED TAB */}
          {activeTab === 'feed' && (
            <motion.div 
              key="feed-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              
              {/* Afro-Futurist Floating Mask Section */}
              <section className="relative mt-4 rounded-3xl overflow-hidden glass-card min-h-[360px] md:min-h-[460px] flex items-center royal-gold-border">
                <div className="absolute inset-0 z-0">
                  <img 
                    className="w-full h-full object-cover opacity-60" 
                    alt="Ancestral Futuristic Floating Mask"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuChahvquzRqWpgLpbZ7UKjJvqOnJfbi7T8B4C-jxHPl93GzvbSAxD6749yHXULID_mLjjxvXKQfQ4Xu-vI9JNu2WmcaYflOoROCS-wZKyrusqop6RdAMORR3TPkmddy-xOOJuTg216eh3mhExC41Gp1Sl_PuoL7TDa76zFkwOOkIIwDWHMtb-iMI9hu-FZ0dMtcUKJy68PS4V_6b6muslGo7yg8_Fw50b3rHJns0DG_dfH3uHxipVd8jfPrikqwJynXizi8RutkTgq"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent"></div>
                </div>

                <div className="relative z-10 p-6 md:p-12 max-w-2xl balance-y">
                  <span className="font-mono text-xs text-tertiary block mb-3 uppercase tracking-widest leading-none font-bold">THE FUTURE OF EXPRESSION</span>
                  <h2 className="font-syne text-3xl md:text-5xl font-extrabold text-on-surface leading-tight mb-4">
                    Unleash Your Inner <span className="text-tertiary">Ancestral</span> Wit
                  </h2>
                  <p className="font-sans text-sm md:text-base text-on-surface-variant max-w-md leading-relaxed mb-6">
                    Our AI deciphers the soul of African humor. Create high-fidelity 3D memes that blend tradition with tech.
                  </p>
                  <button 
                    onClick={() => {
                      setCurrentBackdrop(BASE_MEMES[4]);
                      playDjembeSound(220, 'triangle');
                      setActiveTab('studio');
                    }}
                    className="bg-secondary-container hover:bg-secondary-container/80 text-on-surface font-bold px-6 py-3.5 rounded-full flex items-center gap-3 border border-tertiary/35 transition-all active:scale-95 shadow-lg shadow-black/40 text-sm md:text-base"
                  >
                    <Sparkles className="w-5 h-5 text-tertiary" />
                    <span>Create Your Meme</span>
                  </button>
                </div>
              </section>

              {/* Connected Active Chips */}
              <div className="flex flex-wrap gap-3">
                <div className="px-5 py-2.5 rounded-full glass-card flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                  <span className="font-mono text-xs text-on-surface-variant">1.2k Active Now</span>
                </div>
                <div className="px-5 py-2.5 rounded-full glass-card flex items-center gap-2 border-tertiary/20">
                  <span className="material-symbols-outlined text-xs text-tertiary">🔥</span>
                  <span className="font-mono text-xs text-tertiary font-bold uppercase">Trending: #SafariVibes</span>
                </div>
              </div>

              {/* Trending Gallery Grid */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <h3 className="font-syne text-xl md:text-2xl font-bold text-on-surface">Trending Memes</h3>
                  <button 
                    onClick={() => setActiveTab('studio')} 
                    className="font-mono text-xs text-primary hover:text-tertiary hover:underline transition-all"
                  >
                    Visit Studio &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {customMemesList.slice(0, 4).map((meme) => (
                    <div 
                      key={meme.id}
                      className="group relative aspect-[3/4] rounded-2xl overflow-hidden glass-card glass-card-hover transition-all duration-300 border border-white/5 flex flex-col justify-end"
                    >
                      <img 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 z-0" 
                        alt={meme.title}
                        src={meme.imageUrl}
                        referrerPolicy="no-referrer"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                      
                      {/* Interactive cards metadata */}
                      <div className="relative z-20 p-4 shrink-0 space-y-2">
                        <p className="font-syne text-sm font-bold text-on-surface drop-shadow-md">
                          {meme.title}
                        </p>
                        <p className="text-xs text-on-surface-variant line-clamp-1">{meme.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-tertiary">{meme.tags[0]}</span>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => toggleLikeMeme(meme.id)}
                              className="text-on-surface hover:text-error transition-colors p-1"
                            >
                              <Heart className={`w-4 h-4 ${likedMemeIds[meme.id] ? 'fill-error text-error' : 'text-on-surface'}`} />
                            </button>
                            <button 
                              onClick={() => {
                                setCaptionTop("POV: CURRENT MOOD");
                                setCaptionBottom(meme.title.toUpperCase());
                                setCurrentBackdrop(meme);
                                setPlacedStickers([]);
                                setActiveTab('studio');
                              }}
                              className="text-primary hover:text-tertiary p-1"
                              title="Edit in Studio"
                            >
                              <Sparkles className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Floating tag showing likes count */}
                      <div className="absolute top-3 left-3 z-20 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg flex items-center gap-1">
                        <Heart className="w-3 h-3 text-error fill-error" />
                        <span className="font-mono text-[10px] font-bold">{meme.likes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Voice Prompt Section embedded in Feed */}
              <section className="mt-8 glass-card rounded-3xl p-6 md:p-8 royal-gold-border overflow-hidden relative">
                <div className="absolute -top-6 -right-6 opacity-5 pointer-events-none">
                  <Mic2 className="w-48 h-48 text-tertiary" />
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="font-syne text-lg md:text-xl font-bold">Voice-to-Meme</h4>
                    <span className="bg-primary/20 text-primary uppercase font-mono text-[10px] px-2 py-0.5 border border-primary/30 rounded-full font-bold">Beta</span>
                  </div>
                  <p className="font-sans text-sm text-on-surface-variant max-w-lg leading-relaxed">
                    Say a visual phrase or vibe. We process the speech cadence and cultural accent and forge corresponding high-fidelity top/bottom captions dynamically!
                  </p>

                  <div className="bg-surface-container-low rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6 border border-white/5">
                    <button 
                      id="voice-mic-feed-btn"
                      onClick={handleMicTap}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-error animate-pulse' : 'bg-primary'} shadow-lg text-black`}
                    >
                      <Mic2 className="w-6 h-6" />
                    </button>
                    <div className="flex-1 w-full space-y-2">
                      <p className="font-mono text-xs text-primary font-semibold">{voiceStatus}</p>
                      {voiceText && (
                        <p className="font-sans text-sm text-on-surface bg-white/5 p-2 rounded border border-white/10 italic">
                          "{voiceText}"
                        </p>
                      )}
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${isRecording ? recordingProgress : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    {voiceText && (
                      <button 
                        onClick={() => {
                          setActiveTab('studio');
                          playDjembeSound(400, 'sine');
                        }}
                        className="bg-primary/15 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg font-mono text-xs flex items-center gap-1 transition-colors self-end md:self-center"
                      >
                        <span>Edit Canvas</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </section>

            </motion.div>
          )}

          {/* ANALYZE / CONTEXT READER TAB */}
          {activeTab === 'analyze' && (
            <motion.div 
              key="analyze-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8 mt-4"
            >
              
              <div className="space-y-2">
                <h1 className="font-syne text-2xl md:text-4xl font-extrabold text-on-surface">Context Reader</h1>
                <p className="font-sans text-sm md:text-base text-on-surface-variant max-w-2xl leading-relaxed">
                  Paste your chat transcripts, WhatsApp threads, or tweets. Our neural engine deciphers the layered humor, local subtext, and slang to recommend the ultimate meme responses.
                </p>
              </div>

              {/* Analysis Textarea Container */}
              <div className="glass-card rounded-2xl p-6 border border-tertiary/20 space-y-4">
                <div className="flex items-center gap-2 text-tertiary font-mono">
                  <Brain className="w-4 h-4" />
                  <span className="text-xs uppercase font-bold tracking-widest text-tertiary">NEURAL ANALYSIS ENGINE</span>
                </div>

                <div className="relative">
                  <textarea 
                    value={pastedContextText}
                    onChange={(e) => setPastedContextText(e.target.value)}
                    placeholder="Paste WhatsApp thread logs, sheng debates, or tweets here..."
                    className="w-full h-44 bg-surface-container-lowest border border-white/10 text-on-surface p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-tertiary font-sans text-sm resize-none placeholder:text-on-surface-variant/40"
                  />
                  {pastedContextText && (
                    <button 
                      onClick={() => setPastedContextText("")}
                      className="absolute top-3 right-3 p-1.5 bg-white/5 rounded-full text-on-surface-variant hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Quick Presets Loader */}
                <div className="space-y-2">
                  <span className="font-mono text-xs text-on-surface-variant block">Quick Presets:</span>
                  <div className="flex flex-col gap-2">
                    {presets.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setPastedContextText(p);
                          playDjembeSound(240, 'triangle');
                        }}
                        className="text-left py-1.5 px-3 bg-white/5 hover:bg-primary/10 rounded border border-white/5 text-xs text-on-surface-variant truncate hover:text-primary transition-colors"
                      >
                        "{p}"
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center pt-3 gap-3">
                  <span className="font-mono text-xs text-on-surface-variant">
                    {isAnalyzing ? "Processing ancestral frequencies..." : "Awaiting your conversation thread."}
                  </span>
                  
                  <button 
                    onClick={analyzeToneOfChatText}
                    disabled={isAnalyzing || !pastedContextText.trim()}
                    className="w-full sm:w-auto px-6 py-3 bg-secondary-container hover:brightness-110 disabled:opacity-50 text-on-surface text-sm font-bold rounded-full flex items-center justify-center gap-2 border border-tertiary/30 transition-all active:scale-95"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-tertiary" />
                        <span>Calibrating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-tertiary" />
                        <span>Analyze Tone</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* ANALYSIS RESULTS CARD */}
              <AnimatePresence>
                {analysisResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="glass-card rounded-2xl p-6 border border-primary/30 space-y-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
                      <div className="space-y-1">
                        <span className="font-mono text-xs text-on-surface-variant uppercase">Tone Analysis Summary</span>
                        <h4 className="font-syne text-lg font-bold text-primary italic">"{analysisResult.summary}"</h4>
                      </div>
                      <div className="px-3 py-1 bg-tertiary/10 border border-tertiary/40 rounded-full">
                        <span className="font-mono text-xs font-bold text-tertiary uppercase">{analysisResult.sentiment}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm bg-white/5 p-4 rounded-xl border border-white/10">
                      <span className="font-mono text-xs text-tertiary font-bold uppercase leading-none block">Cultural Breakdown:</span>
                      <p className="text-on-surface-variant leading-relaxed">
                        {analysisResult.culturalBreakdown}
                      </p>
                    </div>

                    {/* SUGGESTED MEMES GRID */}
                    <div className="space-y-4 pt-2">
                      <h5 className="font-syne text-base font-bold text-on-surface flex items-center gap-2">
                        <span>Suggested Meme Clapbacks</span>
                        <span className="text-xs font-mono text-primary font-medium">({analysisResult.suggestedMemes.length} available)</span>
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {analysisResult.suggestedMemes.map((item, index) => (
                          <div 
                            key={index}
                            className="glass-card rounded-xl overflow-hidden border border-white/10 flex flex-col justify-between"
                          >
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container shrink-0">
                              <img 
                                className="w-full h-full object-cover" 
                                alt={item.title}
                                src={item.imageUrl}
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            </div>
                            
                            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                              <div className="space-y-1">
                                <span className="font-mono text-[10px] text-tertiary font-bold">{item.tag}</span>
                                <h6 className="font-syne text-sm font-bold text-on-surface leading-tight">{item.title}</h6>
                                <p className="text-xs text-on-surface-variant line-clamp-2">{item.description}</p>
                              </div>

                              <div className="space-y-2 pt-2 border-t border-white/5">
                                <div className="p-1 px-2 bg-black/40 text-[10px] font-mono font-bold text-primary rounded leading-tight text-center">
                                  {item.caption.split('\n')[0]}
                                </div>
                                <button 
                                  onClick={() => loadMemeIntoStudio(item.title, item.tag, item.description, item.imageUrl)}
                                  className="w-full py-1.5 bg-primary hover:bg-primary/80 transition-colors text-black font-semibold rounded font-mono text-[10px] uppercase flex items-center justify-center gap-1"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Load in Studio</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

              {analysisError && (
                <div className="p-4 bg-error-container/20 border border-error/30 text-error rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-xs font-mono">{analysisError}</p>
                </div>
              )}

              {/* Sassy Bottom Context Feed */}
              <div className="space-y-4 pt-4">
                <h4 className="font-syne text-lg font-bold">Standard Regional Clapbacks</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {OTHER_SUGGESTED_MEMES.slice(1, 3).map((item, idx) => (
                    <div 
                      key={idx}
                      className="glass-card rounded-xl p-4 border border-white/5 flex gap-4 items-center"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                        <img 
                          className="w-full h-full object-cover" 
                          alt={item.title} 
                          src={item.imageUrl}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex justify-between items-start">
                          <h5 className="font-syne text-xs font-bold leading-tight">{item.title}</h5>
                          <span className="text-[9px] font-mono text-tertiary">{item.tag}</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant leading-tight line-clamp-2">{item.caption}</p>
                        <button 
                          onClick={() => loadMemeIntoStudio(item.title, item.tag, item.caption, item.imageUrl)}
                          className="text-[10px] font-mono text-primary font-bold hover:underline py-0.5 text-left"
                        >
                          Remix This &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* VOICE MODE TAB (LIVE TRANSCRIPT & DRUM PULSE) */}
          {activeTab === 'voice' && (
            <motion.div 
              key="voice-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-6 mt-4 md:mt-10 pb-12"
            >
              <div className="w-full max-w-xl text-center space-y-2">
                <span className="text-[10px] font-mono text-tertiary uppercase tracking-widest leading-none font-bold">SAVANNAH RHYTHMIC FREQUENCIES</span>
                <h1 className="font-syne text-2xl md:text-4xl font-extrabold text-on-surface">Voice Studio</h1>
                <p className="text-sm text-on-surface-variant leading-relaxed max-w-sm mx-auto">
                  Beats correspond with text. Click or speak directly below to transfigure oral cadence into customized meme concepts.
                </p>
              </div>

              {/* Transcription Area Box */}
              <div className="w-full max-w-xl glass-shard rounded-2xl p-6 md:p-8 border border-tertiary/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                  <div 
                    className="h-full bg-tertiary transition-all duration-300"
                    style={{ width: `${isRecording ? recordingProgress : 0}%` }}
                  ></div>
                </div>

                <div className="space-y-3 text-center">
                  <span className="font-mono text-[10px] text-tertiary uppercase tracking-wider font-bold">Transcription Canvas</span>
                  <p className="font-syne text-xl md:text-2xl font-bold leading-relaxed text-on-surface">
                    {isRecording ? "Listening to the vibe..." : (voiceText ? `"${voiceText}"` : "Speak your mood...")}
                  </p>
                  
                  <div className="flex gap-2 justify-center pt-2">
                    <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono text-on-surface-variant uppercase">#Safari</span>
                    <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono text-on-surface-variant uppercase">#NairobiNight</span>
                  </div>
                </div>
              </div>

              {/* GIGANTIC DRUM SOUND MIC BUTTON */}
              <div className="relative py-8 flex items-center justify-center">
                {/* Glow concentric circles */}
                <div className="absolute w-56 h-56 rounded-full border border-tertiary/10 animate-ping opacity-35"></div>
                <div className="absolute w-72 h-72 rounded-full border border-tertiary/5 animate-pulse opacity-10"></div>

                <button 
                  onClick={handleMicTap}
                  className={`relative w-40 h-40 rounded-full flex items-center justify-center border-4 border-tertiary bg-secondary-container shadow-2xl transition-all select-none cursor-pointer duration-300 ${isRecording ? 'scale-105 border-error' : 'hover:scale-102 active:scale-95'}`}
                >
                  {/* Mahogany Djembe Background Layer */}
                  <div 
                    className="absolute inset-0 rounded-full mix-blend-overlay opacity-30 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCK6I57MiYi2AVwOJjlrSXATGIVbeLrt0StGMfuSzc-aXd_-2o0qKDbDjaSWlJSfq97dmtRAeZk6FMTslaSY8YZ4BgvetT1r_K7bM_SYnqiINspj1VBeQmL-hKChol443sM5XqnZll0YZwj02iRY_8tn3gLFJtrfYjjf9r9yAZVNg4VQ8T_Kj-DV5sS4exQT2neDFWtnLdg1hewW6dm9kV1Leca0u-rhvX5Fp04xRrBS7_3NZh6PPBi129FxOWM_2yMTvEsaMZgcD-5')" }}
                  />

                  <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                    <Mic2 className={`w-10 h-10 ${isRecording ? 'text-error text-scale-110' : 'text-tertiary'}`} />
                    <span className="font-mono text-[9px] font-bold text-on-surface uppercase tracking-widest">TAP FOR BEAT</span>
                  </div>
                </button>
              </div>

              {/* Rhythmic Waveform bar chart */}
              <div className="flex items-end justify-center gap-2 h-16 w-full max-w-xs">
                {audioLevelArray.map((level, idx) => (
                  <div 
                    key={idx}
                    className="w-2.5 bg-tertiary rounded-full transition-all duration-100 opacity-80"
                    style={{ height: `${isRecording ? level : 8}px` }}
                  />
                ))}
              </div>

              <div className="text-center space-y-4 pt-4">
                <span className="font-mono text-xs text-on-surface-variant/70 block animate-pulse">
                  {isRecording ? "Transcribing on-the-fly rhythm..." : "Rhythms ready. Tap djembe to edit concept."}
                </span>

                {voiceText && (
                  <button 
                    onClick={() => {
                      setActiveTab('studio');
                      playDjembeSound(350, 'sine');
                    }}
                    className="px-6 py-2.5 bg-primary text-black font-mono text-xs uppercase font-bold rounded-full flex items-center justify-center gap-2"
                  >
                    <span>Load Studio Canvas</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                )}
              </div>

            </motion.div>
          )}

          {/* STUDIO / EDIT CANVAS TAB */}
          {activeTab === 'studio' && (
            <motion.div 
              key="studio-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4 pb-20 items-start"
            >
              
              {/* Left Column: Canvas Editor Workspace */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                    <span className="font-mono text-xs text-on-surface-variant">{studioStatusMessage}</span>
                  </div>
                  
                  {/* Floating Export + Créer Sticker */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={createSticker}
                      className="px-4 py-2 bg-primary/20 border border-primary/40 text-primary font-mono text-xs font-bold uppercase rounded-full hover:brightness-110 transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Sticker</span>
                    </button>
                    <button 
                      onClick={simulateMemeExport}
                      className="px-5 py-2 bg-tertiary text-black font-mono text-xs font-bold uppercase rounded-full hover:brightness-110 transition-all flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                {/* THE CORE CANVAS INTERACTIVE ELEMENT */}
                <div 
                  ref={canvasRef}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                  className="canvas-container relative w-full aspect-[4/5] glass-panel-heavy rounded-2xl gold-border overflow-hidden select-none"
                >
                  {/* Solid theme illustration backdrop */}
                  <img 
                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" 
                    alt="Active Meme Backdrop"
                    src={currentBackdrop.imageUrl}
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Dynamic Dark Gradient shading for top and bottom text overlay legibility */}
                  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10" />
                  <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/85 to-transparent pointer-events-none z-10" />

                  {/* CAPTION TOP TEXT */}
                  {captionTop && (
                    <div className="absolute top-5 left-0 right-0 px-4 text-center z-20">
                      <h2 
                        className="font-syne font-extrabold uppercase leading-tight select-none cursor-default truncate text-glow"
                        style={{ 
                          color: captionColor,
                          fontSize: `${captionSize}px`,
                          textShadow: '2px 2px 4px rgba(0,0,0,0.9), -2px -2px 4px rgba(0,0,0,0.9)'
                        }}
                      >
                        {captionTop}
                      </h2>
                    </div>
                  )}

                  {/* CAPTION BOTTOM TEXT */}
                  {captionBottom && (
                    <div className="absolute bottom-6 left-0 right-0 px-4 text-center z-20">
                      <h2 
                        className="font-syne font-extrabold uppercase leading-tight select-none cursor-default text-glow"
                        style={{ 
                          color: '#ffffff',
                          fontSize: `${captionSize + 4}px`,
                          textShadow: '2px 2px 4px rgba(0,0,0,0.95), -2px -2px 4px rgba(0,0,0,0.95)'
                        }}
                      >
                        {captionBottom}
                      </h2>
                    </div>
                  )}

                  {/* TEXTE OVERLAY PERSONNALISÉ */}
                  {overlayText && (
                    <div className="absolute bottom-20 left-0 right-0 px-4 text-center z-25 pointer-events-none">
                      <p
                        style={{
                          fontFamily: overlayFont,
                          fontSize: `${overlaySize}px`,
                          color: overlayColor,
                          textShadow: '2px 2px 4px rgba(0,0,0,0.9), -1px -1px 3px rgba(0,0,0,0.9)',
                          lineHeight: 1.2,
                        }}
                      >
                        {overlayText}
                      </p>
                    </div>
                  )}

                  {/* DRAGGABLE PLACED STICKERS OVERLAY CONTAINER */}
                  {placedStickers.map((sticker) => {
                    const isSelected = sticker.id === selectedStickerId;
                    return (
                      <div
                        key={sticker.id}
                        onMouseDown={(e) => handleStickerMouseDown(e, sticker.id)}
                        onTouchStart={(e) => {
                          const touch = e.touches[0];
                          handleStickerMouseDown({
                            clientX: touch.clientX,
                            clientY: touch.clientY,
                            stopPropagation: () => e.stopPropagation()
                          } as any, sticker.id);
                        }}
                        className={`absolute cursor-grab active:cursor-grabbing z-30 transition-shadow ${isSelected ? 'border-2 border-primary/95 ring-2 ring-primary/20 bg-white/5' : ''}`}
                        style={{
                          left: `${sticker.x}%`,
                          top: `${sticker.y}%`,
                          width: `${80 * sticker.scale}px`,
                          height: `${80 * sticker.scale}px`,
                          transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`
                        }}
                      >
                        <img 
                          className="w-full h-full object-contain pointer-events-none" 
                          alt="Placed decoration sticker" 
                          src={sticker.imageUrl}
                          referrerPolicy="no-referrer"
                        />
                        {isSelected && (
                          <div className="absolute -top-6 left-0 right-0 bg-primary text-black text-[9px] font-mono leading-none py-1 text-center font-bold rounded">
                            Active Drag
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Sub-text input for generating captions using Gemini */}
                <div className="space-y-2">
                  <div className="relative">
                    <input 
                      type="text"
                      value={remixPromptText}
                      onChange={(e) => setRemixPromptText(e.target.value)}
                      placeholder="Describe a remix (e.g., 'hungry lion in traffic office')..."
                      className="w-full bg-surface-variant/30 text-on-surface border border-tertiary/20 rounded-xl px-4 py-3 placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-tertiary font-sans text-sm"
                    />
                    <button 
                      onClick={runRemixAiEngine} 
                      disabled={isRemixLoading || !remixPromptText.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary/25 text-primary hover:bg-primary/40 rounded-lg transition-all"
                      title="Generate captions using Gemini AI"
                    >
                      {isRemixLoading ? <RefreshCw className="w-4 h-4 animate-spin text-tertiary" /> : <Sparkles className="w-4 h-4 text-tertiary" />}
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: Editing Drawers & Preset items */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Active selection controls */}
                {selectedStickerId && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="glass-card p-4 rounded-xl border border-primary/30 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-primary font-bold uppercase">Sticker Configurator</span>
                      <button 
                        onClick={() => setSelectedStickerId(null)}
                        className="p-1 hover:bg-white/5 rounded text-on-surface-variant"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-between">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => adjustSelectedSticker('scale-up')}
                          className="p-2 bg-white/5 hover:bg-white/10 text-on-surface rounded text-xs px-3 font-mono"
                          title="Scale Up"
                        >
                          ➕ Larger
                        </button>
                        <button 
                          onClick={() => adjustSelectedSticker('scale-down')}
                          className="p-2 bg-white/5 hover:bg-white/10 text-on-surface rounded text-xs px-3 font-mono"
                          title="Scale Down"
                        >
                          ➖ Smaller
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => adjustSelectedSticker('rotate-cw')}
                          className="p-2 bg-white/5 hover:bg-white/10 text-on-surface rounded text-xs px-3 font-mono"
                          title="Rotate"
                        >
                          🔄 Rotate
                        </button>
                        <button 
                          onClick={() => adjustSelectedSticker('delete')}
                          className="p-2 bg-error/10 hover:bg-error/20 text-error rounded text-xs px-3 font-mono font-bold"
                          title="Delete Sticker"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Text and Typography Editor Card */}
                <div className="glass-card p-4 rounded-xl border border-white/5 space-y-4">
                  <span className="font-mono text-xs text-tertiary font-bold uppercase block">Captioneer Console</span>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-on-surface-variant font-mono block">Top Line Text</label>
                    <input 
                      type="text" 
                      value={captionTop}
                      onChange={(e) => setCaptionTop(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-on-surface-variant font-mono block">Bottom Line Text</label>
                    <input 
                      type="text" 
                      value={captionBottom}
                      onChange={(e) => setCaptionBottom(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm focus:outline-none"
                    />
                  </div>

                  {/* Caption Controls: Size, Color */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-on-surface-variant font-mono block">Top Color Accent</span>
                      <div className="flex gap-1.5">
                        {["#ffba20", "#a1d494", "#ffffff", "#ffb4a5", "#ff4444"].map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              setCaptionColor(c);
                              playDjembeSound(200, 'sine');
                            }}
                            className="w-6 h-6 rounded-full border border-white/10 transition-transform active:scale-90"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-on-surface-variant font-mono block">Font Size ({captionSize}px)</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setCaptionSize(Math.max(16, captionSize - 2))}
                          className="px-2 py-0.5 bg-white/5 select-none rounded text-xs font-mono font-bold"
                        >
                          -
                        </button>
                        <button 
                          onClick={() => setCaptionSize(Math.min(52, captionSize + 2))}
                          className="px-2 py-0.5 bg-white/5 select-none rounded text-xs font-mono font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* IMPORT IMAGE / STICKER depuis le téléphone */}
                <div className="glass-card p-4 rounded-xl border border-white/5 space-y-3">
                  <span className="font-mono text-xs text-tertiary font-bold uppercase block">📁 Importer une image / sticker</span>
                  <p className="text-[10px] text-on-surface-variant font-mono">Importe une image depuis ton téléphone pour l'utiliser comme fond ou sticker</p>
                  <div className="flex gap-2">
                    <label className="flex-1 py-3 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-xl font-mono text-xs font-bold text-primary transition-all flex items-center justify-center gap-2 cursor-pointer">
                      <Image className="w-4 h-4" />
                      Fond
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setCurrentBackdrop({
                              id: 'custom-import',
                              title: file.name,
                              description: 'Image importée',
                              imageUrl: url,
                              tags: ['custom'],
                              likes: 0,
                              category: 'custom',
                            });
                            playDjembeSound(440, 'sine');
                          }
                        }}
                      />
                    </label>
                    <label className="flex-1 py-3 bg-tertiary/20 hover:bg-tertiary/30 border border-tertiary/30 rounded-xl font-mono text-xs font-bold text-tertiary transition-all flex items-center justify-center gap-2 cursor-pointer">
                      <Plus className="w-4 h-4" />
                      Sticker
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            const customSticker: StickerItem = {
                              id: `custom-sticker-${Date.now()}`,
                              name: file.name.slice(0, 12),
                              imageUrl: url,
                              category: 'STICKERS',
                            };
                            placeStickerOnCanvas(customSticker);
                            playDjembeSound(330, 'triangle');
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Éditeur de texte sur image */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowOverlayEditor(!showOverlayEditor)}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-mono text-xs font-bold text-on-surface transition-all flex items-center justify-center gap-2"
                    >
                      <Type className="w-4 h-4" />
                      {showOverlayEditor ? 'Masquer éditeur texte' : 'Ajouter texte sur image'}
                    </button>

                    {showOverlayEditor && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 p-3 bg-black/20 rounded-xl border border-white/5">
                        <input
                          type="text"
                          value={overlayText}
                          onChange={(e) => setOverlayText(e.target.value)}
                          placeholder="Ton texte ici..."
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm font-mono focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <select
                            value={overlayFont}
                            onChange={(e) => setOverlayFont(e.target.value)}
                            className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-xs font-mono focus:outline-none"
                          >
                            <option value="Impact">Impact</option>
                            <option value="Arial">Arial</option>
                            <option value="Comic Sans MS">Comic Sans</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Courier New">Courier</option>
                          </select>
                          <input
                            type="number"
                            value={overlaySize}
                            onChange={(e) => setOverlaySize(Number(e.target.value))}
                            min={12} max={80}
                            className="w-16 bg-black/40 border border-white/10 rounded-lg p-2 text-xs font-mono focus:outline-none"
                          />
                          <input
                            type="color"
                            value={overlayColor}
                            onChange={(e) => setOverlayColor(e.target.value)}
                            className="w-10 h-9 bg-black/40 border border-white/10 rounded-lg cursor-pointer"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Background selector tray */}
                <div className="glass-card p-4 rounded-xl border border-white/5 space-y-3">
                  <span className="font-mono text-xs text-on-surface-variant font-bold uppercase block">Select Base Backdrop</span>
                  <div className="grid grid-cols-5 gap-2">
                    {BASE_MEMES.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => {
                          setCurrentBackdrop(item);
                          playDjembeSound(220, 'sine');
                        }}
                        className={`aspect-[3/4] h-16 rounded-lg overflow-hidden border-2 ${currentBackdrop.id === item.id ? 'border-primary' : 'border-transparent opacity-60'}`}
                      >
                        <img className="w-full h-full object-cover" src={item.imageUrl} alt={item.title} referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* STICKER DRAWER / STICKERS GRID LISTINGS */}
                <div className="glass-card p-4 rounded-xl border border-white/5 space-y-3">
                  <span className="font-mono text-xs text-tertiary font-bold uppercase block">Decorative Stickers Overlay</span>
                  
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
                    {STICKERS.map((sticker) => (
                      <button
                        key={sticker.id}
                        onClick={() => placeStickerOnCanvas(sticker)}
                        className="p-1 px-2 py-2 bg-black/40 hover:bg-white/5 hover:border-primary/45 transition-all text-xs border border-white/10 rounded-lg flex flex-col items-center justify-center space-y-1 shrink-0"
                      >
                        <div className="w-10 h-10 overflow-hidden shrink-0">
                          <img className="w-full h-full object-contain" src={sticker.imageUrl} alt={sticker.name} referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-[9px] font-mono leading-none font-medium truncate w-full text-center text-on-surface-variant">
                          {sticker.name.slice(0, 12)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* ===== SHARE & GENERATE TAB (Membre 6) ===== */}
          {activeTab === 'share' && (
            <motion.div
              key="share"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 space-y-6 pb-24"
            >
              <div className="space-y-1 pt-2">
                <h2 className="font-mono font-bold text-lg text-on-surface">🌍 Share & Generate</h2>
                <p className="text-xs text-on-surface-variant font-mono">Génère un meme IA et partage-le sur tes réseaux</p>
              </div>

              {/* Génération d'image IA */}
              <div className="glass-card p-4 rounded-xl border border-white/5 space-y-4">
                <span className="font-mono text-xs text-tertiary font-bold uppercase block">🎨 Générateur d'Image IA</span>
                <div className="space-y-2">
                  <label className="text-xs text-on-surface-variant font-mono block">Décris ton meme</label>
                  <textarea
                    value={generatePrompt}
                    onChange={(e) => setGeneratePrompt(e.target.value)}
                    placeholder="Ex: Un homme en boubou qui court après un matatu à Lagos..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:outline-none resize-none h-24 font-mono"
                  />
                </div>
                <button
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage || !generatePrompt.trim()}
                  className="w-full py-3 bg-primary/20 hover:bg-primary/30 disabled:opacity-40 border border-primary/30 rounded-xl font-mono text-sm font-bold text-primary transition-all flex items-center justify-center gap-2"
                >
                  {isGeneratingImage ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" />Génération en cours...</>
                  ) : (
                    <><Image className="w-4 h-4" />Générer l'image</>
                  )}
                </button>
                {generateError && (
                  <div className="flex items-center gap-2 text-xs text-error font-mono bg-error/10 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />{generateError}
                  </div>
                )}
                {generatedImage && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
                    <img src={generatedImage ?? undefined} alt="Meme généré" className="w-full rounded-xl border border-white/10" />
                    <a
                      href={generatedImage ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-mono text-xs font-bold text-on-surface transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />Voir / Télécharger l'image
                    </a>
                    <a
                      href={generatedImage ?? undefined}
                      download="memeafrica.png"
                      className="w-full py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl font-mono text-xs font-bold text-green-400 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />💾 Sauvegarder dans la galerie
                    </a>
                  </motion.div>
                )}
              </div>

              {/* Partage sur les réseaux */}
              <div className="glass-card p-4 rounded-xl border border-white/5 space-y-4">
                <span className="font-mono text-xs text-tertiary font-bold uppercase block">📤 Partager sur les réseaux</span>
                <div className="space-y-2">
                  <label className="text-xs text-on-surface-variant font-mono block">Texte du meme à partager</label>
                  <textarea
                    value={shareMemeText}
                    onChange={(e) => setShareMemeText(e.target.value)}
                    placeholder="Ex: POV: QUAND L'OGA DIT SOUMETS AVANT 9H 😂 #MemeAfrica"
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:outline-none resize-none h-20 font-mono"
                  />
                </div>
                <button
                  onClick={handleGetShareLinks}
                  disabled={!shareMemeText.trim()}
                  className="w-full py-3 bg-tertiary/20 hover:bg-tertiary/30 disabled:opacity-40 border border-tertiary/30 rounded-xl font-mono text-sm font-bold text-tertiary transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />Générer les liens de partage
                </button>
                {shareLinks && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <a href={shareLinks?.whatsapp} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl transition-all">
                      <span className="text-xl">📱</span>
                      <span className="font-mono text-sm font-bold text-green-400 flex-1">WhatsApp</span>
                      <ExternalLink className="w-4 h-4 text-green-400" />
                    </a>
                    <a href={shareLinks?.telegram} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl transition-all">
                      <Send className="w-5 h-5 text-blue-400" />
                      <span className="font-mono text-sm font-bold text-blue-400 flex-1">Telegram</span>
                      <ExternalLink className="w-4 h-4 text-blue-400" />
                    </a>
                    <a href={shareLinks?.tiktok} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 rounded-xl transition-all">
                      <span className="text-xl">🎵</span>
                      <div className="flex-1">
                        <span className="font-mono text-sm font-bold text-pink-400 block">TikTok</span>
                        <span className="font-mono text-[10px] text-pink-300/60">Télécharge l'image puis uploade</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-pink-400" />
                    </a>
                    <a href={shareLinks?.instagram} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl transition-all">
                      <span className="text-xl">📸</span>
                      <div className="flex-1">
                        <span className="font-mono text-sm font-bold text-purple-400 block">Instagram</span>
                        <span className="font-mono text-[10px] text-purple-300/60">Télécharge l'image puis poste</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-purple-400" />
                    </a>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* ===== HISTORY TAB ===== */}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 space-y-4 pb-24"
            >
              <div className="space-y-1 pt-2">
                <h2 className="font-mono font-bold text-lg text-on-surface">📜 Historique</h2>
                <p className="text-xs text-on-surface-variant font-mono">Tes derniers memes générés</p>
              </div>
              {memeHistory.length === 0 ? (
                <div className="glass-card p-8 rounded-xl border border-white/5 text-center">
                  <History className="w-12 h-12 text-on-surface-variant mx-auto mb-3 opacity-40" />
                  <p className="font-mono text-sm text-on-surface-variant">Aucun meme généré pour l'instant</p>
                  <p className="font-mono text-xs text-on-surface-variant/60 mt-1">Génère un meme dans l'onglet Share !</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {memeHistory.map((item) => (
                    <div key={item.id} className="glass-card rounded-xl border border-white/5 overflow-hidden">
                      <img src={item.image} alt={item.caption} className="w-full h-48 object-cover" />
                      <div className="p-3 space-y-2">
                        <p className="font-mono text-xs text-on-surface">{item.caption}</p>
                        <p className="font-mono text-[10px] text-on-surface-variant">{item.date}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setGeneratedImage(item.image);
                              setShareMemeText(item.caption + ' #MemeAfrica');
                              setActiveTab('share');
                            }}
                            className="flex-1 py-2 bg-tertiary/20 border border-tertiary/30 rounded-lg font-mono text-xs text-tertiary flex items-center justify-center gap-1"
                          >
                            <Share2 className="w-3 h-3" />Partager
                          </button>
                          <a
                            href={item.image}
                            download={`meme-${item.id}.png`}
                            className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-xs text-on-surface flex items-center justify-center gap-1"
                          >
                            <Download className="w-3 h-3" />Sauvegarder
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FIXED BOTTOM NAV BAR TAB SELECTION */}
      <nav className="fixed bottom-0 w-full h-20 z-50 flex justify-around items-center px-2 pb-2 bg-surface/20 backdrop-blur-md border-t border-tertiary/20">
        <button 
          id="nav-tab-feed"
          onClick={() => {
            setActiveTab('feed');
            playDjembeSound(200, 'triangle');
          }}
          className={`flex flex-col items-center justify-center transition-all ${activeTab === 'feed' ? 'text-tertiary font-bold scale-105' : 'text-on-surface-variant hover:text-tertiary'}`}
        >
          <Grid3x3 className="w-4 h-4 mb-1" />
          <span className="font-mono text-[9px] uppercase tracking-wider">Feed</span>
        </button>

        <button 
          id="nav-tab-analyze"
          onClick={() => {
            setActiveTab('analyze');
            playDjembeSound(220, 'triangle');
          }}
          className={`flex flex-col items-center justify-center transition-all ${activeTab === 'analyze' ? 'text-tertiary font-bold scale-105' : 'text-on-surface-variant hover:text-tertiary'}`}
        >
          <Brain className="w-4 h-4 mb-1" />
          <span className="font-mono text-[9px] uppercase tracking-wider">Analyze</span>
        </button>

        <button 
          id="nav-tab-voice"
          onClick={() => {
            setActiveTab('voice');
            playDjembeSound(240, 'triangle');
          }}
          className={`flex flex-col items-center justify-center transition-all ${activeTab === 'voice' ? 'text-tertiary font-bold scale-105' : 'text-on-surface-variant hover:text-tertiary'}`}
        >
          <Mic2 className="w-4 h-4 mb-1" />
          <span className="font-mono text-[9px] uppercase tracking-wider">Voice</span>
        </button>

        <button 
          id="nav-tab-studio"
          onClick={() => {
            setActiveTab('studio');
            playDjembeSound(260, 'triangle');
          }}
          className={`flex flex-col items-center justify-center transition-all ${activeTab === 'studio' ? 'text-tertiary font-bold scale-105' : 'text-on-surface-variant hover:text-tertiary'}`}
        >
          <Sparkles className="w-4 h-4 mb-1" />
          <span className="font-mono text-[9px] uppercase tracking-wider">Studio</span>
        </button>

        <button
          id="nav-tab-share"
          onClick={() => {
            setActiveTab('share');
            playDjembeSound(280, 'triangle');
          }}
          className={`flex flex-col items-center justify-center transition-all ${activeTab === 'share' ? 'text-tertiary font-bold scale-105' : 'text-on-surface-variant hover:text-tertiary'}`}
        >
          <Share2 className="w-4 h-4 mb-1" />
          <span className="font-mono text-[9px] uppercase tracking-wider">Share</span>
        </button>

        <button
          id="nav-tab-history"
          onClick={() => {
            setActiveTab('history');
            playDjembeSound(300, 'triangle');
          }}
          className={`flex flex-col items-center justify-center transition-all ${activeTab === 'history' ? 'text-tertiary font-bold scale-105' : 'text-on-surface-variant hover:text-tertiary'}`}
        >
          <History className="w-4 h-4 mb-1" />
          <span className="font-mono text-[9px] uppercase tracking-wider">History</span>
        </button>
      </nav>

    </div>
  );
}
