
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Subtitle {
  id: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  text: string;
}

export interface SubtitleStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
  backgroundOpacity: number;
  backgroundPadding: number;
  borderRadius: number;
  position: 'top' | 'middle' | 'bottom';
  fontWeight: 'normal' | 'bold';
  strokeColor: string;
  strokeWidth: number;
  shadowColor: string;
  shadowBlur: number;
  letterSpacing: number;
  showOverlay: boolean;
}

export type AppLanguage = 'Bangla' | 'Hindi' | 'Banglish' | 'Hindilish' | 'English';

export interface GenerationConfig {
  language: AppLanguage;
}
