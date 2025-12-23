
import React from 'react';
import { SubtitleStyle } from '../types';
import { FONTS } from '../constants';
import StylePreview from './StylePreview';

interface StylingPanelProps {
  style: SubtitleStyle;
  onUpdate: (style: SubtitleStyle) => void;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-2 mb-4 mt-6 first:mt-0">
    <div className="h-[1px] flex-1 bg-white/5"></div>
    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">{children}</span>
    <div className="h-[1px] flex-1 bg-white/5"></div>
  </div>
);

const StylingPanel: React.FC<StylingPanelProps> = ({ style, onUpdate }) => {
  const updateField = <K extends keyof SubtitleStyle>(field: K, value: SubtitleStyle[K]) => {
    onUpdate({ ...style, [field]: value });
  };

  return (
    <div className="space-y-4 pb-8">
      <h3 className="text-lg font-black text-white mb-4 tracking-tighter uppercase">Appearance</h3>
      
      <StylePreview style={style} />

      {/* TYPOGRAPHY */}
      <SectionTitle>Typography</SectionTitle>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Font Family</label>
          <select 
            value={style.fontFamily}
            onChange={(e) => updateField('fontFamily', e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:ring-2 focus:ring-violet-500 outline-none appearance-none"
          >
            {FONTS.map(f => (
              <option key={f.name} value={f.family} className="bg-[#0a0a1a]">{f.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Size</label>
            <input 
              type="number"
              value={style.fontSize}
              onChange={(e) => updateField('fontSize', parseInt(e.target.value) || 0)}
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Weight</label>
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/5 h-10">
              <button 
                onClick={() => updateField('fontWeight', 'normal')}
                className={`flex-1 text-[9px] font-black rounded-lg transition-all ${style.fontWeight === 'normal' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-500'}`}
              >REG</button>
              <button 
                onClick={() => updateField('fontWeight', 'bold')}
                className={`flex-1 text-[9px] font-black rounded-lg transition-all ${style.fontWeight === 'bold' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-500'}`}
              >BOLD</button>
            </div>
          </div>
        </div>
      </div>

      {/* COLORS */}
      <SectionTitle>Colors</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Text</label>
          <input 
            type="color"
            value={style.color}
            onChange={(e) => updateField('color', e.target.value)}
            className="h-10 w-full rounded-xl cursor-pointer bg-white/5 border border-white/5 p-1"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Background</label>
          <input 
            type="color"
            value={style.backgroundColor}
            onChange={(e) => updateField('backgroundColor', e.target.value)}
            className="h-10 w-full rounded-xl cursor-pointer bg-white/5 border border-white/5 p-1"
          />
        </div>
      </div>

      {/* CONTAINER */}
      <SectionTitle>Container</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Opacity</label>
          <input 
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={style.backgroundOpacity}
            onChange={(e) => updateField('backgroundOpacity', parseFloat(e.target.value))}
            className="w-full h-10 bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Radius</label>
          <input 
            type="number"
            value={style.borderRadius}
            onChange={(e) => updateField('borderRadius', parseInt(e.target.value) || 0)}
            className="w-full h-10 bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none"
          />
        </div>
      </div>

      {/* SPECIAL EFFECTS */}
      <SectionTitle>Special</SectionTitle>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-violet-600/5 rounded-2xl border border-violet-500/10">
          <div>
            <span className="text-xs font-black text-white block uppercase tracking-tighter">Cinematic Depth</span>
            <span className="text-[9px] text-slate-500 font-bold uppercase">Dynamic Darkening</span>
          </div>
          <button 
            onClick={() => updateField('showOverlay', !style.showOverlay)}
            className={`w-11 h-6 rounded-full transition-all relative ${style.showOverlay ? 'bg-violet-600' : 'bg-white/10'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md ${style.showOverlay ? 'left-6' : 'left-1'}`} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Outline</label>
            <div className="flex gap-2">
              <input 
                type="color"
                value={style.strokeColor}
                onChange={(e) => updateField('strokeColor', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer bg-white/5 border border-white/5 p-1 shrink-0"
              />
              <input 
                type="number"
                value={style.strokeWidth}
                onChange={(e) => updateField('strokeWidth', parseInt(e.target.value) || 0)}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                placeholder="0"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Shadow</label>
            <div className="flex gap-2">
              <input 
                type="color"
                value={style.shadowColor}
                onChange={(e) => updateField('shadowColor', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer bg-white/5 border border-white/5 p-1 shrink-0"
              />
              <input 
                type="number"
                value={style.shadowBlur}
                onChange={(e) => updateField('shadowBlur', parseInt(e.target.value) || 0)}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button 
          onClick={() => window.alert('Burn-in feature is available for Enterprise users.')}
          className="w-full group relative overflow-hidden bg-white text-black font-black text-xs uppercase tracking-[0.2em] py-4 rounded-2xl shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-cyan-500/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          Render Final Media
        </button>
      </div>
    </div>
  );
};

export default StylingPanel;
