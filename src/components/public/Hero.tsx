import React, { useState, MouseEvent } from 'react';
import { ArrowDown, Calendar, Aperture, Sparkles, Film, ArrowRight } from 'lucide-react';
import { SiteSettings } from '../../types';
import { Card3D } from '../common/Card3D';

interface HeroProps {
  hero?: SiteSettings['hero'];
}

export const Hero: React.FC<HeroProps> = ({ hero }) => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMouseOffset({ x, y });
  };

  const headline = String(hero?.headline || 'Visual Poetry in Motion & Stillness').trim();
  const subheadline = String(hero?.subheadline || 'Rishabh Sen · Cinematographer & Photographer').trim();
  const tagline = String(hero?.tagline || 'Crafting timeless cinematic wedding films, editorial imagery, and high-impact visual stories across the globe.').trim();
  const primaryCtaText = String(hero?.primaryCtaText || 'View Portfolio').trim();
  const primaryCtaLink = String(hero?.primaryCtaLink || '#portfolio').trim();
  const secondaryCtaText = String(hero?.secondaryCtaText || 'Book a Session').trim();
  const secondaryCtaLink = String(hero?.secondaryCtaLink || '#contact').trim();

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center pt-24 sm:pt-28 pb-14 sm:pb-20 overflow-hidden bg-[#080B0D] z-10 w-full"
    >
      {/* 3D Background Lighting Spheres */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden max-w-full">
        <div
          style={{
            transform: `translate(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px)`,
            transition: 'transform 0.2s ease-out',
          }}
          className="absolute -top-[15%] left-[10%] sm:left-[20%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-gradient-to-br from-[#65E6EA]/15 via-[#8B7CFF]/15 to-transparent rounded-full blur-[100px] sm:blur-[140px]"
        />
        <div
          style={{
            transform: `translate(${-mouseOffset.x * 0.4}px, ${-mouseOffset.y * 0.4}px)`,
            transition: 'transform 0.2s ease-out',
          }}
          className="absolute bottom-[5%] right-[5%] sm:right-[10%] w-[380px] sm:w-[650px] h-[380px] sm:h-[650px] bg-gradient-to-tl from-[#8B7CFF]/20 via-[#C56CFF]/15 to-transparent rounded-full blur-[100px] sm:blur-[150px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B0D] via-[#080B0D]/75 to-[#080B0D]/90" />
      </div>

      {/* Main Grid: Left Narrative + CTAs, Right 3D Visual Viewport */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-2 sm:mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Badges, Title, Subtitle, Dual CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            {/* Studio Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12181C]/90 border border-[#65E6EA]/30 text-[11px] sm:text-xs font-semibold tracking-wider text-[#65E6EA] shadow-[0_0_20px_rgba(101,230,234,0.15)] backdrop-blur-md max-w-full">
              <span className="w-2 h-2 rounded-full bg-[#65E6EA] animate-ping shrink-0" />
              <span className="font-mono uppercase truncate">{subheadline}</span>
            </div>

            {/* Display Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-white leading-tight sm:leading-[1.12] tracking-tight break-words">
              {headline}
            </h1>

            {/* Subtitle / Tagline */}
            <p className="text-sm sm:text-base md:text-lg font-editorial italic text-[#9CA7AD] max-w-xl leading-relaxed font-light">
              &ldquo;{tagline}&rdquo;
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <a
                href={primaryCtaLink}
                className="min-h-[48px] px-6 sm:px-8 py-3.5 sm:py-4 text-xs uppercase tracking-[0.2em] font-bold text-[#080B0D] bg-gradient-to-r from-[#65E6EA] via-[#8B7CFF] to-[#C56CFF] hover:opacity-95 transition-all rounded-xl shadow-[0_0_30px_rgba(101,230,234,0.35)] hover:shadow-[0_0_45px_rgba(139,124,255,0.55)] flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.98]"
              >
                <span>{primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href={secondaryCtaLink}
                className="min-h-[48px] px-6 sm:px-8 py-3.5 sm:py-4 text-xs uppercase tracking-[0.2em] font-semibold text-white border border-white/15 hover:border-[#65E6EA] bg-[#12181C]/70 hover:bg-[#12181C] transition-all rounded-xl flex items-center justify-center gap-2 backdrop-blur-md shadow-lg cursor-pointer active:scale-[0.98]"
              >
                <Calendar className="w-3.5 h-3.5 text-[#65E6EA]" />
                <span>{secondaryCtaText}</span>
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-5 sm:pt-6 border-t border-white/5 max-w-md">
              <div>
                <div className="text-lg sm:text-2xl font-display font-bold text-white tabular-nums">4K DCI</div>
                <div className="text-[10px] sm:text-[11px] text-[#9CA7AD] uppercase tracking-wider font-semibold">Cinema Primes</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-display font-bold text-[#65E6EA] tabular-nums">11+</div>
                <div className="text-[10px] sm:text-[11px] text-[#9CA7AD] uppercase tracking-wider font-semibold">Years Craft</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-display font-bold text-[#8B7CFF] tabular-nums">100%</div>
                <div className="text-[10px] sm:text-[11px] text-[#9CA7AD] uppercase tracking-wider font-semibold">5-Star Reviews</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Creative Visual Viewport */}
          <div className="lg:col-span-5 relative">
            <Card3D maxTilt={8} glareOpacity={0.25}>
              <div className="relative aspect-[4/5] rounded-3xl bg-gradient-to-b from-[#12181C] via-[#0D1215] to-[#080B0D] border border-white/15 overflow-hidden shadow-2xl p-6 flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B0D] via-[#080B0D]/50 to-transparent" />

                {/* Top Viewport HUD */}
                <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#9CA7AD]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-white font-bold">REC 4K</span>
                  </div>
                  <span className="text-[#65E6EA]">ARRI LOG-C3</span>
                </div>

                {/* Center Creative Visual Hologram */}
                <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-8">
                  <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-[#12181C]/90 border border-[#65E6EA]/50 shadow-[0_0_40px_rgba(101,230,234,0.4)] backdrop-blur-md mb-4 group-hover:scale-110 transition-transform">
                    <Aperture className="w-12 h-12 text-[#65E6EA] animate-spin-slow" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white drop-shadow-md">
                    Rishabh Sen Cinema
                  </h3>
                  <p className="text-xs text-[#9CA7AD] max-w-xs mt-1 font-light">
                    Organic 35mm grain curve, high dynamic range color grading & bespoke scoring.
                  </p>
                </div>

                {/* Bottom Floating Glass Badge Cards */}
                <div className="relative z-10 grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                  <div className="p-3 rounded-xl bg-[#0D1215]/80 backdrop-blur-md border border-white/10">
                    <div className="text-[10px] uppercase text-[#65E6EA] font-semibold">Framerate</div>
                    <div className="text-xs font-mono text-white">24.00 FPS / 180°</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0D1215]/80 backdrop-blur-md border border-white/10">
                    <div className="text-[10px] uppercase text-[#8B7CFF] font-semibold">Optics</div>
                    <div className="text-xs font-mono text-white">Cooke Anamorphic /i</div>
                  </div>
                </div>
              </div>
            </Card3D>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-14 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#9CA7AD]/60">
          <span>Scroll to Explore</span>
          <a
            href="#about"
            aria-label="Scroll to About"
            className="p-2 text-[#65E6EA] hover:text-white transition-colors animate-bounce"
          >
            <ArrowDown className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
