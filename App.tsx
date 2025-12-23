
import React, { useState, useRef, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import SubtitleEditor from './components/SubtitleEditor';
import StylingPanel from './components/StylingPanel';
import Auth from './components/Auth';
import { Subtitle, SubtitleStyle, AppLanguage, User } from './types';
import { DEFAULT_STYLE, LANGUAGES } from './constants';
import { generateSubtitles } from './services/geminiService';

type TabType = 'video' | 'subtitles' | 'styling';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyle>(DEFAULT_STYLE);
  const [currentTime, setCurrentTime] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<AppLanguage>('English');
  const [activeTab, setActiveTab] = useState<TabType>('video');
  const srtInputRef = useRef<HTMLInputElement>(null);

  // Persistence for user login
  useEffect(() => {
    const savedUser = localStorage.getItem('lopin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('lopin_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('lopin_user');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  const parseSRT = (text: string): Subtitle[] => {
    const blocks = text.trim().split(/\n\s*\n/);
    return blocks.map((block, index) => {
      const lines = block.split('\n').map(l => l.trim());
      if (lines.length < 3) return null;
      
      const timeMatch = lines[1].match(/(\d{2}:\d{2}:\d{2}[.,]\d{3}) --> (\d{2}:\d{2}:\d{2}[.,]\d{3})/);
      if (!timeMatch) return null;

      const parseTime = (timeStr: string): number => {
        const [hms, ms] = timeStr.replace(',', '.').split('.');
        const [h, m, s] = hms.split(':').map(Number);
        return h * 3600 + m * 60 + s + Number(ms) / 1000;
      };

      const startTime = parseTime(timeMatch[1]);
      const endTime = parseTime(timeMatch[2]);
      const textContent = lines.slice(2).join('\n');

      return {
        id: `srt-${index}-${Date.now()}`,
        startTime,
        endTime,
        text: textContent
      };
    }).filter((s): s is Subtitle => s !== null);
  };

  const handleSRTImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const importedSubtitles = parseSRT(content);
        if (importedSubtitles.length > 0) {
          setSubtitles(importedSubtitles);
          alert(`Successfully imported ${importedSubtitles.length} subtitles.`);
          if (window.innerWidth < 1024) setActiveTab('subtitles');
        } else {
          alert("Could not find any valid subtitles in the file.");
        }
      } catch (err) {
        alert("Error parsing SRT file. Please ensure it's a valid .srt format.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleGenerate = async () => {
    if (!videoFile) return;
    setIsGenerating(true);
    try {
      const generated = await generateSubtitles(videoFile, selectedLanguage);
      setSubtitles(generated);
      if (window.innerWidth < 1024) setActiveTab('subtitles');
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate subtitles. Please check your connection or file.');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatSRTTime = (seconds: number): string => {
    const date = new Date(0);
    date.setSeconds(seconds);
    const hh = date.getUTCHours().toString().padStart(2, '0');
    const mm = date.getUTCMinutes().toString().padStart(2, '0');
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    const ms = Math.floor((seconds % 1) * 1000).toString().padStart(3, '0');
    return `${hh}:${mm}:${ss},${ms}`;
  };

  const exportSRT = () => {
    if (subtitles.length === 0) {
      alert("No subtitles to export!");
      return;
    }
    const srtContent = subtitles
      .sort((a, b) => a.startTime - b.startTime)
      .map((sub, index) => {
        return `${index + 1}\n${formatSRTTime(sub.startTime)} --> ${formatSRTTime(sub.endTime)}\n${sub.text}\n`;
      })
      .join('\n');
    
    const blob = new Blob([srtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${videoFile?.name.split('.')[0] || 'subtitles'}.srt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050510] text-slate-100 overflow-hidden h-screen font-['Inter']">
      <input 
        type="file" 
        accept=".srt" 
        ref={srtInputRef} 
        onChange={handleSRTImport} 
        className="hidden" 
      />

      <header className="h-14 lg:h-16 border-b border-white/5 flex items-center justify-between px-4 lg:px-8 bg-black/40 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-9 h-9 lg:w-10 lg:h-10 bg-[#0a0a1a] rounded-lg border border-white/10 flex items-center justify-center shadow-2xl">
              <svg viewBox="0 0 24 24" className="w-6 h-6 lg:w-7 lg:h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12V22L22 10H13V2Z" fill="url(#logo-grad)" stroke="url(#logo-grad)" strokeWidth="1" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="logo-grad" x1="3" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7c3aed"/>
                    <stop offset="1" stopColor="#22d3ee"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg lg:text-xl font-black tracking-tighter text-white uppercase hidden xs:flex items-center gap-2">
              Lopin
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gradient-to-r from-violet-600 to-cyan-500 font-bold tracking-normal">PRO</span>
            </h1>
            <span className="text-[8px] text-slate-500 font-bold tracking-[0.3em] uppercase hidden xs:block -mt-1">Creative Suite</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5 shrink-0">
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as AppLanguage)}
              className="bg-transparent text-xs font-bold outline-none px-3 py-1.5 text-slate-300 cursor-pointer"
            >
              {LANGUAGES.map(lang => <option key={lang} value={lang} className="bg-[#0a0a1a]">{lang}</option>)}
            </select>
          </div>
          
          <button 
            disabled={!videoFile || isGenerating}
            onClick={handleGenerate}
            className={`px-4 py-2 lg:px-6 lg:py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-xl shrink-0 group ${
              !videoFile || isGenerating 
              ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5' 
              : 'bg-white text-black hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isGenerating ? (
              <svg className="animate-spin h-3 w-3 lg:h-4 lg:w-4 text-black" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg className="w-3 h-3 lg:w-4 lg:w-4 text-violet-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
            )}
            <span className="hidden sm:inline">Generate AI</span>
            <span className="sm:hidden">Generate</span>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => srtInputRef.current?.click()}
              className="p-2 bg-white/5 hover:bg-white/10 text-cyan-400 rounded-xl border border-white/10 transition-colors"
              title="Import SRT"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            </button>
            <div className="h-6 w-[1px] bg-white/10 mx-1"></div>
            
            {/* User Profile & Logout */}
            <div className="flex items-center gap-3 bg-white/5 pl-1 pr-3 py-1 rounded-xl border border-white/10 group cursor-pointer relative">
               <img src={user?.avatar} className="w-7 h-7 rounded-lg border border-white/20" alt="Avatar" />
               <div className="hidden sm:flex flex-col">
                 <span className="text-[9px] font-black text-white leading-tight uppercase tracking-tighter truncate max-w-[80px]">{user?.name}</span>
                 <button onClick={handleLogout} className="text-[7px] text-violet-400 font-bold uppercase tracking-widest hover:text-white transition-colors text-left leading-tight">Log Out</button>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <div className="lg:hidden flex bg-[#0a0a1a] border-b border-white/5">
          {(['video', 'subtitles', 'styling'] as TabType[]).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab ? 'border-violet-500 text-violet-400 bg-violet-500/5' : 'border-transparent text-slate-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <aside className={`${activeTab === 'subtitles' ? 'flex' : 'hidden'} lg:flex w-full lg:w-96 border-r border-white/5 bg-black/20 p-4 lg:p-6 overflow-hidden flex-col h-full`}>
          <SubtitleEditor 
            subtitles={subtitles} 
            onUpdate={setSubtitles} 
            currentTime={currentTime} 
          />
        </aside>

        <section className={`${activeTab === 'video' ? 'flex' : 'hidden'} lg:flex flex-1 p-4 lg:p-8 bg-[#050510] flex flex-col items-center justify-center relative overflow-y-auto`}>
          {!videoSrc ? (
            <div className="text-center p-4">
              <div className="mb-8 relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 to-cyan-500/20 rounded-full blur-3xl group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative inline-flex p-8 lg:p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl">
                  <svg className="w-16 h-16 lg:w-20 lg:h-20 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-black text-white mb-3 tracking-tighter">AI Subtitle Studio</h2>
              <p className="text-sm lg:text-base text-slate-400 mb-10 max-w-sm mx-auto leading-relaxed">Precision transcription and high-end styling for creators. Supports Bangla, Hindi, and more.</p>
              <label className="group relative cursor-pointer inline-block">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative bg-white text-black px-10 py-4 lg:px-12 lg:py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-colors flex items-center gap-3">
                  Upload Media
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                </div>
                <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          ) : (
            <div className="w-full max-w-4xl mx-auto">
              <VideoPlayer 
                src={videoSrc} 
                subtitles={subtitles} 
                style={subtitleStyle} 
                onTimeUpdate={setCurrentTime}
                currentTime={currentTime}
              />
              <div className="mt-6 lg:mt-10 grid grid-cols-2 gap-4 lg:gap-6 w-full">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-6 backdrop-blur-md">
                  <span className="text-[10px] lg:text-xs text-slate-500 font-black uppercase tracking-[0.2em] block mb-2">Timeline Position</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl lg:text-4xl font-black text-violet-400 tabular-nums">{currentTime.toFixed(2)}</span>
                    <span className="text-sm font-bold text-slate-600">seconds</span>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-6 backdrop-blur-md">
                  <span className="text-[10px] lg:text-xs text-slate-500 font-black uppercase tracking-[0.2em] block mb-2">Captions Count</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl lg:text-4xl font-black text-cyan-400 tabular-nums">{subtitles.length}</span>
                    <span className="text-sm font-bold text-slate-600">segments</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <aside className={`${activeTab === 'styling' ? 'flex' : 'hidden'} lg:flex w-full lg:w-80 border-l border-white/5 bg-black/20 p-4 lg:p-6 overflow-y-auto custom-scroll h-full`}>
          <div className="w-full">
            <StylingPanel 
              style={subtitleStyle} 
              onUpdate={setSubtitleStyle} 
            />
            <button 
              onClick={exportSRT}
              className="w-full mt-6 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export Subtitles
            </button>
          </div>
        </aside>
      </main>

      <footer className="hidden lg:flex h-10 bg-[#0a0a1a] border-t border-white/5 px-8 items-center justify-between text-[10px] text-slate-500 font-bold tracking-widest uppercase">
        <div className="flex gap-6">
          <span className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${videoSrc ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div> {videoSrc ? 'Engine Active' : 'Ready'}</span>
          <span className="text-slate-400">Target: {selectedLanguage}</span>
        </div>
        <div className="flex gap-8">
          <span className="text-violet-500/80">Lopin Pro Suite v2.5</span>
          <span className="opacity-50">Experimental AI Transcription</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
