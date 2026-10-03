import React, { useEffect, useState } from 'react';
import { Camera, Aperture, Disc } from 'lucide-react';

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
      {/* Ambient background glow */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-r from-[#65E6EA]/20 via-[#8B7CFF]/20 to-transparent blur-[120px] pointer-events-none animate-pulse" />

      {/* Sony FX3 Camera Centerpiece */}
      <div className="relative z-10 flex flex-col items-center space-y-6 text-center px-4">
        
        {/* FX3 Camera Housing with Sensor Ring & REC Beacon */}
        <div className="relative flex items-center justify-center">
          {/* Outer Lens Mount Ring */}
          <div className="w-24 h-24 rounded-full border border-dashed border-[#65E6EA]/40 animate-spin-slow flex items-center justify-center" />
          
          {/* Inner Camera Body Frame */}
          <div className="absolute w-20 h-20 rounded-2xl bg-gradient-to-br from-[#12181C] to-[#0D1215] border border-[#65E6EA]/50 shadow-[0_0_35px_rgba(101,230,234,0.35)] flex items-center justify-center">
            <Camera className="w-10 h-10 text-[#65E6EA] drop-shadow-[0_0_12px_rgba(101,230,234,0.6)]" />
          </div>

          {/* Sony FX3 Signature Top REC Red Tally Dot */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 animate-ping shadow-[0_0_12px_#ef4444]" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500" />
        </div>

        {/* Sony FX3 Cinema Branding */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12181C] border border-white/10 text-[10px] font-mono tracking-widest text-[#65E6EA] uppercase mb-2">
            <Disc className="w-3 h-3 text-[#65E6EA] animate-spin" />
            <span>SONY FX3 · FULL-FRAME</span>
          </div>

          <div className="text-2xl sm:text-3xl font-serif font-extrabold tracking-[0.2em] text-white uppercase drop-shadow-md">
            Rishabh Sen
          </div>
          
          <p className="text-xs uppercase tracking-[0.25em] text-[#8B7CFF] font-mono">
            Cinema Line · S-Log3 4K 120P
          </p>
        </div>

        {/* Cinematic Loading Progress Bar */}
        <div className="w-56 sm:w-72 h-[3px] bg-white/10 rounded-full overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#65E6EA] via-[#8B7CFF] to-[#C56CFF] transition-all duration-300 ease-out rounded-full shadow-[0_0_15px_#65E6EA]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-[11px] font-mono text-[#9CA7AD] tracking-widest uppercase flex items-center gap-2">
          <span>Initializing Sony FX3 Viewport...</span>
          <span className="text-[#65E6EA] font-bold">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
