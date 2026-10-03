import React, { useState, MouseEvent } from 'react';
import { ArrowDown, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { SiteSettings } from '../../types';

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
      className="relative min-h-[90vh] flex items-center justify-center pt-28 sm:pt-32 pb-16 sm:pb-20 overflow-hidden bg-[#080B0D] z-10 w-full"
    >
      {/* 3D Ambient Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden max-w-full">
        <div
          style={{
            transform: `translate(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px)`,
            transition: 'transform 0.2s ease-out',
          }}
          className="absolute -top-[15%] left-[20%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-gradient-to-br from-[#65E6EA]/15 via-[#8B7CFF]/15 to-transparent rounded-full blur-[100px] sm:blur-[140px]"
        />
        <div
          style={{
            transform: `translate(${-mouseOffset.x * 0.4}px, ${-mouseOffset.y * 0.4}px)`,
            transition: 'transform 0.2s ease-out',
          }}
          className="absolute bottom-[5%] right-[20%] w-[380px] sm:w-[650px] h-[380px] sm:h-[650px] bg-gradient-to-tl from-[#8B7CFF]/20 via-[#C56CFF]/15 to-transparent rounded-full blur-[100px] sm:blur-[150px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B0D] via-[#080B0D]/75 to-[#080B0D]/90" />
      </div>

      {/* Centered Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center flex flex-col items-center">
        
        {/* Studio Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12181C]/90 border border-[#65E6EA]/30 text-xs font-semibold tracking-wider text-[#65E6EA] shadow-[0_0_20px_rgba(101,230,234,0.15)] backdrop-blur-md mb-8">
          <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" />
          <span className="font-mono uppercase">{subheadline}</span>
        </div>

        {/* Display Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-extrabold text-white leading-tight tracking-tight uppercase max-w-4xl mb-8">
          {headline}
        </h1>

        {/* Subtitle / Tagline */}
        <p className="text-base sm:text-lg md:text-xl font-serif italic text-[#9CA7AD] max-w-2xl leading-relaxed font-light mb-12">
          &ldquo;{tagline}&rdquo;
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full sm:w-auto">
          <a
            href={primaryCtaLink}
            className="w-full sm:w-auto min-h-[48px] px-8 py-4 text-xs uppercase tracking-[0.2em] font-bold text-[#080B0D] bg-gradient-to-r from-[#65E6EA] via-[#8B7CFF] to-[#C56CFF] hover:opacity-95 transition-all rounded-xl shadow-[0_0_30px_rgba(101,230,234,0.35)] hover:shadow-[0_0_45px_rgba(139,124,255,0.55)] flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.98]"
          >
            <span>{primaryCtaText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href={secondaryCtaLink}
            className="w-full sm:w-auto min-h-[48px] px-8 py-4 text-xs uppercase tracking-[0.2em] font-semibold text-white border border-white/15 hover:border-[#65E6EA] bg-[#12181C]/70 hover:bg-[#12181C] transition-all rounded-xl flex items-center justify-center gap-2 backdrop-blur-md shadow-lg cursor-pointer active:scale-[0.98]"
          >
            <Calendar className="w-3.5 h-3.5 text-[#65E6EA]" />
            <span>{secondaryCtaText}</span>
          </a>
        </div>

        {/* Centered Metrics / Stats */}
        <div className="grid grid-cols-3 gap-6 sm:gap-12 pt-8 border-t border-white/10 w-full max-w-2xl">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1 tabular-nums">4K DCI</div>
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#9CA7AD]">Cinema Primes</div>
          </div>
          <div className="text-center border-x border-white/10 px-2 sm:px-4">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#65E6EA] mb-1 tabular-nums">11+</div>
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#9CA7AD]">Years Craft</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#8B7CFF] mb-1 tabular-nums">100%</div>
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#9CA7AD]">5-Star Reviews</div>
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

export default Hero;
