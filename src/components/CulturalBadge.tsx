// src/components/CulturalBadge.tsx
// Membre 3 — Badge d'adaptation culturelle camerounaise
// Usage : importer dans les onglets Analyze et Voice de App.tsx

import React, { useState } from 'react';
import { CulturalContext } from '../data/cameroon-culture';

interface CulturalBadgeProps {
  context: CulturalContext;
  compact?: boolean; // version petite pour le feed
}

export default function CulturalBadge({ context, compact = false }: CulturalBadgeProps) {
  const [expanded, setExpanded] = useState(false);

  if (!context.detected) return null;

  // ── Version compacte (une seule ligne) ──────
  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full 
                      bg-green-900/30 border border-green-500/30 text-[10px] font-mono">
        <span>🇨🇲</span>
        <span className="text-green-400 font-bold">Adapté Kamer</span>
        <span className="text-green-300/60">·{context.culturalScore}%</span>
      </div>
    );
  }

  // ── Version complète ─────────────────────────
  return (
    <div className="rounded-xl border border-green-500/25 bg-green-950/20 overflow-hidden">
      
      {/* Header cliquable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 
                   hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🇨🇲</span>
          <div className="text-left">
            <p className="text-xs font-bold text-green-400 font-mono uppercase tracking-wide">
              Adaptation Culturelle Camerounaise
            </p>
            <p className="text-[10px] text-green-300/60 font-mono">
              {context.expressions.length} expression(s) détectée(s) · 
              Mood : {context.moodTag} {context.suggestedEmoji}
            </p>
          </div>
        </div>

        {/* Barre de score */}
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 rounded-full transition-all duration-700"
              style={{ width: `${context.culturalScore}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-green-300">
            {context.culturalScore}%
          </span>
          <span className="text-green-400 text-xs ml-1">
            {expanded ? '▲' : '▼'}
          </span>
        </div>
      </button>

      {/* Panel dépliable — détail des expressions */}
      {expanded && context.expressions.length > 0 && (
        <div className="border-t border-green-500/15 px-4 py-3 space-y-2">
          <p className="text-[10px] text-on-surface-variant font-mono uppercase mb-2">
            Expressions camfranglais détectées :
          </p>
          {context.expressions.map((expr, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-2 rounded-lg bg-white/5"
            >
              <span className="text-green-400 font-mono font-bold text-xs 
                               bg-green-900/40 px-2 py-0.5 rounded shrink-0">
                {expr.original}
              </span>
              <div className="min-w-0">
                <p className="text-xs text-on-surface font-medium">
                  {expr.meaning}
                </p>
                <p className="text-[10px] text-tertiary/80 font-mono mt-0.5 italic">
                  💬 "{expr.memeCaption}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}