import React from 'react';
import { Sparkles, Cpu, CheckCircle2 } from 'lucide-react';
import { aiService } from '../../services/aiService';

interface AIModeBadgeProps {
  isDemo?: boolean;
  className?: string;
}

export const AIModeBadge: React.FC<AIModeBadgeProps> = ({ isDemo, className = '' }) => {
  const isDemoMode = isDemo !== undefined ? isDemo : !aiService.isConfigured;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-xs transition-all ${
        isDemoMode
          ? 'bg-purple-50 text-purple-700 border border-purple-200'
          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      } ${className}`}
      title={
        isDemoMode
          ? 'Operating in Deterministic Demo Engine mode (No external API key exposed or required)'
          : 'Live Google Gemini AI API Connected via Environment Key'
      }
    >
      {isDemoMode ? (
        <>
          <Cpu className="w-3.5 h-3.5 text-purple-600" />
          <span>Demo AI Engine (Deterministic)</span>
        </>
      ) : (
        <>
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Live Gemini AI API</span>
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
        </>
      )}
    </div>
  );
};
