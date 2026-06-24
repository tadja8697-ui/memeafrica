export interface MemeItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  likes: number;
  category: string;
  creator?: string;
}

export interface StickerItem {
  id: string;
  name: string;
  imageUrl: string;
  category: 'STICKERS' | 'TEXT' | 'FILTERS' | 'BACKGROUNDS' | '3D OBJECTS';
}

export interface PlacedSticker {
  id: string;
  stickerId: string;
  imageUrl: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  isUppercase: boolean;
  fontWeight: string;
}

export interface AnalysisMemeSuggestion {
  title: string;
  caption: string;
  tag: string;
  description: string;
  imageUrl: string;
}

export interface AnalysisResponse {
  summary: string;
  sentiment: string;
  culturalBreakdown: string;
  suggestedMemes: AnalysisMemeSuggestion[];
}

export interface GeneratorResponse {
  captionLine1: string;
  captionLine2: string;
  culturalExplanation: string;
  visualPrompt: string;
  suggestedBackend?: string;
}
