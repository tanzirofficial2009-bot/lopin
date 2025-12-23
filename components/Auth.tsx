
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const simulateGoogleLogin = () => {
    setIsLoggingIn(true);
    // Simulate a network delay for the Google Auth popup
    setTimeout(() => {
      onLogin({
        id: 'google-12345',
        name: 'Guest Creator',
        email: 'creator@lopin.pro',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lopin',
      });
      setIsLoggingIn(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050510] overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative w-full max-w-md p-8 mx-4 bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl flex flex-col items-center">
        {/* Logo Section */}
        <div className="mb-8 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-2xl blur opacity-30"></div>
          <div className="relative w-20 h-20 bg-[#0a0a1a] rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl">
            <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12V22L22 10H13V2Z" fill="url(#login-logo-grad)" stroke="url(#login-logo-grad)" strokeWidth="1" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="login-logo-grad" x1="3" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7c3aed"/>
                  <stop offset="1" stopColor="#22d3ee"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase text-center">
          Lopin <span className="text-violet-500">PRO</span>
        </h1>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.3em] mb-12 text-center">
          Unlock the Power of AI
        </p>

        <div className="w-full space-y-4">
          <button 
            onClick={simulateGoogleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-4 bg-white text-black py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isLoggingIn ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>
          
          <button className="w-full text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors py-2">
            Other Login Methods
          </button>
        </div>

        <div className="mt-16 text-center">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed">
            By continuing, you agree to Lopin Pro's <br/>
            <span className="text-slate-400 cursor-pointer hover:underline">Terms of Service</span> and <span className="text-slate-400 cursor-pointer hover:underline">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
