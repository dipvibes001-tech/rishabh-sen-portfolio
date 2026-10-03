import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onFinished: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinished }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // 0.9 second camera 3D display hoga, fir smooth fade out
    const timer1 = setTimeout(() => {
      setIsFading(true);
    }, 900);

    const timer2 = setTimeout(() => {
      onFinished();
    }, 1250);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinished]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#080B0D] transition-opacity duration-300 ease-out select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Cinematic Soft Ambient Glow */}
      <div className="absolute w-[340px] sm:w-[420px] h-[340px] sm:h-[420px] rounded-full bg-[#65E6EA]/15 blur-[100px] pointer-events-none animate-pulse" />

      {/* 3D Camera Viewport */}
      <div className="relative z-10 flex items-center justify-center [perspective:1000px]">
        {/* Soft Lens Flare Ring */}
        <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-[#65E6EA]/25 via-transparent to-[#8B7CFF]/20 blur-xl opacity-70 animate-spin-slow pointer-events-none" />

        {/* Floating 3D FX3 Camera Container */}
        <div className="relative w-48 sm:w-60 md:w-72 aspect-square flex items-center justify-center animate-camera-float">
          <img
            src="/sony-fx3.png"
            alt="Sony FX3 Cinema Camera"
            className="w-full h-auto object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)] drop-shadow-[0_0_20px_rgba(101,230,234,0.3)]"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80';
            }}
          />

          {/* Top Tally Light / Sensor Active Glow */}
          <span className="absolute top-5 right-7 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shadow-[0_0_12px_#ef4444]" />
          <span className="absolute top-5 right-7 w-2.5 h-2.5 rounded-full bg-red-500" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
