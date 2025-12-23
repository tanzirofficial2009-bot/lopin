
import React, { useRef, useEffect, useState } from 'react';
import { Subtitle, SubtitleStyle } from '../types';

interface VideoPlayerProps {
  src: string;
  subtitles: Subtitle[];
  style: SubtitleStyle;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, subtitles, style, onTimeUpdate, currentTime }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeSubtitle, setActiveSubtitle] = useState<Subtitle | null>(null);

  useEffect(() => {
    const sub = subtitles.find(s => currentTime >= s.startTime && currentTime <= s.endTime);
    setActiveSubtitle(sub || null);
  }, [currentTime, subtitles]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  const getPositionClass = () => {
    switch (style.position) {
      case 'top': return 'top-8';
      case 'middle': return 'top-1/2 -translate-y-1/2';
      default: return 'bottom-12';
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group border border-slate-800">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        controls
      />
      
      {/* Cinematic Overlay Effect */}
      {style.showOverlay && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 transition-opacity duration-500" />
      )}
      
      {activeSubtitle && (
        <div 
          className={`absolute left-0 right-0 flex justify-center pointer-events-none transition-all duration-200 ${getPositionClass()}`}
        >
          <div 
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
              maxWidth: '85%',
              wordWrap: 'break-word',
              lineHeight: '1.4',
            }}
          >
            {activeSubtitle.text}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
