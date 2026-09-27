import React, { useEffect, useState } from 'react';
import { Sparkles, Film } from 'lucide-react';

interface LoadingScreenProps {
  onFinished: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinished }) => {
  const [progress, setProgress] = useState(10);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(45), 100);
    const timer2 = setTimeout(() => setProgress(85), 250);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setIsFading(true);
    }, 450);
    const timer4 = setTimeout(() => {
      onFinished();
    }, 700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onFinished]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080B0D] transition-opacity duration-300 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient background glows */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-r from-[#65E6EA]/20 via-[#8B7CFF]/20 to-transparent blur-[120px] pointer-events-none animate-pulse-glow" />

      {/* Brand Monogram & Name */}
      <div className="relative z-10 flex flex-col items-center space-y-6 text-center px-4">
        {/* Glowing 3D Logo Crest */}
        <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-[#12181C] border border-[#65E6EA]/40 shadow-[0_0_40px_rgba(101,230,234,0.35)]">
          <div className="absolute inset-0 rounded-2xl border border-[#8B7CFF]/30 animate-ping opacity-25" />
          <Film className="w-9 h-9 text-[#65E6EA]" />
        </div>

        {/* DipVibe.S Studio Branding */}
        <div>
          <div className="text-3xl sm:text-4xl font-display font-extrabold tracking-[0.18em] text-white uppercase drop-shadow-md">
            DipVibe<span className="text-[#65E6EA]">.S</span>
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#8B7CFF] font-mono mt-1">
            Cinema & Creative Studio · Rishabh Sen
          </p>
        </div>

        {/* Cinematic Loading Line */}
        <div className="w-56 sm:w-72 h-[3px] bg-white/10 rounded-full overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#65E6EA] via-[#8B7CFF] to-[#C56CFF] transition-all duration-300 ease-out rounded-full shadow-[0_0_15px_#65E6EA]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-[11px] font-mono text-[#9CA7AD] tracking-widest uppercase">
          Initializing 4K Viewport...
        </div>
      </div>
    </div>
  );
};
