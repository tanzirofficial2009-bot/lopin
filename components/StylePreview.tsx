
import React, { useState, useEffect } from 'react';
import { SubtitleStyle } from '../types';

interface StylePreviewProps {
  style: SubtitleStyle;
}

const PREVIEW_TEXTS = [
  { lang: 'English', text: 'Professional AI Subtitles' },
  { lang: 'Hindi', text: 'पेशेवर एआई उपशीर्षक' },
  { lang: 'Bangla', text: 'প্রফেশনাল এআই সাবটাইটেল' },
];

const StylePreview: React.FC<StylePreviewProps> = ({ style }) => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % PREVIEW_TEXTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Real-time Engine</span>
        <span className="text-[9px] text-cyan-400 font-black uppercase tracking-widest">{PREVIEW_TEXTS[textIndex].lang}</span>
      </div>
      <div className="relative h-32 w-full bg-[#0a0a1a] rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center group shadow-2xl">
        {/* Mock Video Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 to-cyan-500/30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1 bg-white/5 blur-xl" />
        </div>

        {/* Cinematic Overlay Preview */}
        {style.showOverlay && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        )}

        {/* The Actual Subtitle Preview */}
        <div 
          className="transition-all duration-300 transform scale-[0.85]"
          style={{
            fontFamily: style.fontFamily,
            fontSize: `${style.fontSize}px`,
            color: style.color,
            backgroundColor: `${style.backgroundColor}${Math.round(style.backgroundOpacity * 255).toString(16).padStart(2, '0')}`,
            fontWeight: style.fontWeight,
            WebkitTextStroke: style.strokeWidth > 0 ? `${style.strokeWidth}px ${style.strokeColor}` : 'none',
            textShadow: `${style.shadowBlur}px ${style.shadowBlur}px ${style.shadowBlur}px ${style.shadowColor}`,
            letterSpacing: `${style.letterSpacing}px`,
            padding: `${style.backgroundPadding}px ${style.backgroundPadding * 2}px`,
            borderRadius: `${style.borderRadius}px`,
            textAlign: 'center',
            maxWidth: '90%',
            wordWrap: 'break-word',
            lineHeight: '1.4',
            boxShadow: style.shadowBlur > 0 ? `0 0 ${style.shadowBlur}px ${style.shadowColor}` : 'none'
          }}
        >
          {PREVIEW_TEXTS[textIndex].text}
        </div>
        
        <button 
          onClick={() => setTextIndex((prev) => (prev + 1) % PREVIEW_TEXTS.length)}
          className="absolute bottom-3 right-3 p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-white/5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>
    </div>
  );
};

export default StylePreview;
