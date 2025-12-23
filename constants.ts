
import { SubtitleStyle, AppLanguage } from './types';

export const DEFAULT_STYLE: SubtitleStyle = {
  fontFamily: 'Inter',
  fontSize: 24,
  color: '#ffffff',
  backgroundColor: '#000000',
  backgroundOpacity: 0.5,
  backgroundPadding: 8,
  borderRadius: 4,
  position: 'bottom',
  fontWeight: 'bold',
  strokeColor: '#000000',
  strokeWidth: 0,
  shadowColor: 'rgba(0,0,0,0.5)',
  shadowBlur: 4,
  letterSpacing: 0,
  showOverlay: false,
};

export const FONTS = [
  { name: 'Inter (Modern)', family: "'Inter', sans-serif" },
  { name: 'Hind Siliguri (Bangla Clean)', family: "'Hind Siliguri', sans-serif" },
  { name: 'Noto Sans Bengali (Bold)', family: "'Noto Sans Bengali', sans-serif" },
  { name: 'Noto Sans Devanagari (Hindi)', family: "'Noto Sans Devanagari', sans-serif" },
  { name: 'Poppins (Stylized)', family: "'Poppins', sans-serif" },
  { name: 'Serif (Classic)', family: "serif" },
  { name: 'Monospace (Code)', family: "monospace" },
];

export const LANGUAGES: AppLanguage[] = ['Bangla', 'Hindi', 'Banglish', 'Hindilish', 'English'];
