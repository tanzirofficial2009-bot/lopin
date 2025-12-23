
import React from 'react';
import { Subtitle } from '../types';

interface SubtitleEditorProps {
  subtitles: Subtitle[];
  onUpdate: (updated: Subtitle[]) => void;
  currentTime: number;
}

const SubtitleEditor: React.FC<SubtitleEditorProps> = ({ subtitles, onUpdate, currentTime }) => {
  const handleChange = (id: string, field: keyof Subtitle, value: string | number) => {
    const updated = subtitles.map(s => s.id === id ? { ...s, [field]: value } : s);
    onUpdate(updated);
  };

  const removeSubtitle = (id: string) => {
    onUpdate(subtitles.filter(s => s.id !== id));
  };

  const addSubtitle = () => {
    const lastSub = subtitles[subtitles.length - 1];
    const newStart = lastSub ? lastSub.endTime + 0.5 : currentTime;
    const newSub: Subtitle = {
      id: `sub-${Date.now()}`,
      startTime: newStart,
      endTime: newStart + 2,
      text: 'New segment...'
    };
    onUpdate([...subtitles, newSub].sort((a, b) => a.startTime - b.startTime));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-black text-white uppercase tracking-tighter">Timeline</h3>
        <button 
          onClick={addSubtitle}
          className="bg-white hover:bg-slate-100 text-black text-[10px] font-black px-4 py-2 rounded-xl transition-all flex items-center gap-2 uppercase tracking-widest shadow-lg"
        >
          <svg className="w-3.5 h-3.5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
          New Sub
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scroll space-y-3 pr-2 pb-10">
        {subtitles.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
              <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest italic">Timeline Empty</p>
          </div>
        ) : (
          subtitles.map((sub) => {
            const isActive = currentTime >= sub.startTime && currentTime <= sub.endTime;
            return (
              <div 
                key={sub.id} 
                className={`p-4 rounded-2xl border transition-all duration-300 group ${
                  isActive 
                  ? 'bg-violet-600/10 border-violet-500/50 shadow-2xl shadow-violet-900/10 ring-1 ring-violet-500/20' 
                  : 'bg-white/5 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex gap-4 mb-3">
                  <div className="flex-1">
                    <label className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-1">In</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={sub.startTime}
                      onChange={(e) => handleChange(sub.id, 'startTime', parseFloat(e.target.value))}
                      className="w-full bg-[#0a0a1a] border border-white/5 rounded-lg px-2 py-1.5 text-[11px] font-bold text-white focus:ring-1 focus:ring-violet-500 outline-none tabular-nums"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-1">Out</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={sub.endTime}
                      onChange={(e) => handleChange(sub.id, 'endTime', parseFloat(e.target.value))}
                      className="w-full bg-[#0a0a1a] border border-white/5 rounded-lg px-2 py-1.5 text-[11px] font-bold text-white focus:ring-1 focus:ring-violet-500 outline-none tabular-nums"
                    />
                  </div>
                  <button 
                    onClick={() => removeSubtitle(sub.id)}
                    className="self-end p-2 text-slate-600 hover:text-rose-400 transition-colors bg-white/5 rounded-lg border border-white/5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <textarea 
                  value={sub.text}
                  onChange={(e) => handleChange(sub.id, 'text', e.target.value)}
                  className="w-full bg-[#0a0a1a] border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white focus:ring-1 focus:ring-violet-500 outline-none resize-none h-20 transition-all placeholder:text-slate-800"
                  placeholder="Enter content..."
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SubtitleEditor;
