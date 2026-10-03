import React, { useState, useRef, MouseEvent, TouchEvent } from 'react';
import { Globe, Heart, Sparkles, Film, Compass, Aperture, Eye } from 'lucide-react';
import { SiteSettings } from '../../types';

interface AboutProps {
  about?: SiteSettings['about'];
}

export const About: React.FC<AboutProps> = ({ about }) => {
  const portraitImage =
    about?.portraitUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80';

  const introText = String(
    about?.introduction ||
      'I document raw human emotion, light, and unspoken connection through an uncompromising cinematic lens.'
  ).trim();

  const storyText = String(
    about?.story ||
      'With over a decade behind cinema cameras, I transitioned from narrative filmmaking into luxury destination weddings and editorial portraiture. My work is informed by 35mm celluloid aesthetics, delicate play of shadows, and an instinct for moments that happen in fractions of a second.'
  ).trim();

  const philosophyText = String(
    about?.philosophy ||
      'A great photograph or film is never about equipment—it is about stillness in chaos, the breath before a spoken vow, and honoring the dignity of human celebration.'
  ).trim();

  const artistName = String(about?.name || 'Rishabh Sen').trim();

  // 3D Parallax & Eye Movement State
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [eyeShift, setEyeShift] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Mouse & Touch Tracking Calculation
  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    // Card 3D tilt
    setTilt({
      x: -normY * 12,
      y: normX * 12,
    });

    // Eye gaze translation
    setEyeShift({
      x: normX * 14,
      y: normY * 10,
    });

    // Dynamic light glare position
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.22,
    });
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    handlePointerMove(e.clientX, e.clientY);
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      setIsHovered(true);
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setEyeShift({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <section id="about" className="pt-24 sm:pt-28 pb-20 sm:pb-32 bg-[#080B0D] relative z-10 overflow-hidden select-none">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#65E6EA]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#8B7CFF]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 sm:mb-16 text-center lg:text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12181C] border border-[#65E6EA]/30 text-xs font-semibold tracking-wider text-[#65E6EA] uppercase shadow-[0_0_15px_rgba(101,230,234,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" />
            <span>01. The Visual Storyteller</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display uppercase leading-tight">
            About <span className="gradient-studio-text">{artistName}</span>
          </h2>
        </div>

        {/* Responsive Grid: Mobile me photo sabse upar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* 1. Interactive 3D Eye-Tracking Portrait Card */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6 sm:space-y-8">
            <div
              ref={cardRef}
              onMouseMove={onMouseMove}
              onTouchMove={onTouchMove}
              onMouseLeave={onLeave}
              onTouchEnd={onLeave}
              className="[perspective:1000px] w-full"
            >
              <div
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.025 : 1}, ${isHovered ? 1.025 : 1}, 1)`,
                  transformStyle: 'preserve-3d',
                  transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
                className="relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#12181C] via-[#0D1215] to-[#080B0D] shadow-[0_20px_50px_rgba(0,0,0,0.85)] group cursor-crosshair"
              >
                {/* Specular Light Glare Follower */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-3xl z-30 transition-opacity duration-300"
                  style={{
                    opacity: glare.opacity,
                    background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.7) 0%, transparent 60%)`,
                  }}
                />

                {/* Viewfinder Camera HUD Layer */}
                <div className="absolute inset-0 z-20 pointer-events-none p-5 flex flex-col justify-between text-[10px] font-mono text-[#65E6EA]/70">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 bg-[#080B0D]/70 px-2.5 py-1 rounded-full border border-white/10">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span className="text-white font-bold">REC 4K</span>
                    </span>
                    <span className="flex items-center gap-1 bg-[#080B0D]/70 px-2 py-1 rounded-full border border-white/10">
                      <Eye className="w-3 h-3 text-[#65E6EA]" />
                      <span>EYE-AF LOCK</span>
                    </span>
                  </div>

                  {/* Center Optical Crosshair */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 border border-dashed border-[#65E6EA]/30 rounded-full flex items-center justify-center opacity-60">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#65E6EA]" />
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-gray-400">
                    <span>F/1.4 · 1/250s</span>
                    <span>ISO 800</span>
                  </div>
                </div>

                {/* Image Container with Dynamic Eye/Head Gaze Parallax */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#0A0E11]">
                  <img
                    src={portraitImage}
                    alt={artistName}
                    loading="lazy"
                    style={{
                      transform: `scale(1.1) translate(${eyeShift.x}px, ${eyeShift.y}px)`,
                      transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.5s ease-out',
                    }}
                    className="w-full h-full object-cover object-center filter saturate-[1.05] contrast-[1.02]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080B0D] via-transparent to-transparent opacity-90" />
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#080B0D] via-[#080B0D]/90 to-transparent z-20">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#65E6EA] font-mono font-bold">
                    Cinematographer & Photographer
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mt-0.5">
                    {artistName}
                  </h3>
                  <p className="text-xs text-[#9CA7AD] mt-0.5 font-light">
                    Based in Mumbai · Available Worldwide
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics Row with Neon Micro-Interactions */}
            <div className="grid grid-cols-2 gap-4 p-5 bg-[#12181C]/90 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md">
              {(about?.stats || [
                { value: '10+', suffix: 'Yrs', label: 'Experience' },
                { value: '350+', suffix: 'Films', label: 'Completed' },
                { value: '280+', suffix: 'Clients', label: 'Happy Couples' },
                { value: '400+', suffix: 'Events', label: 'Worldwide' }
              ]).map((stat, idx) => (
                <div key={idx} className="p-3 border-b border-white/5 last:border-b-0 sm:last:border-b group hover:bg-white/[0.02] rounded-xl transition">
                  <div className="text-2xl sm:text-3xl font-display font-bold text-[#65E6EA] tabular-nums group-hover:scale-105 transition-transform origin-left">
                    {stat.value}
                    <span className="text-sm font-sans-clean font-light text-[#9CA7AD] ml-0.5">
                      {stat.suffix}
                    </span>
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-[#9CA7AD] mt-1 font-semibold group-hover:text-white transition-colors">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Narrative Prose & Philosophy Details */}
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-editorial italic text-white font-normal leading-relaxed">
                &ldquo;{introText}&rdquo;
              </h3>
              <p className="text-sm sm:text-base text-[#9CA7AD] leading-relaxed font-sans-clean font-light">
                {storyText}
              </p>
            </div>

            {/* Creative Philosophy Box */}
            <div className="p-6 sm:p-8 bg-[#12181C] border-l-4 border-[#65E6EA] border-y border-r border-white/10 rounded-2xl relative shadow-lg">
              <span className="text-xs uppercase tracking-[0.2em] text-[#65E6EA] font-bold block mb-2 font-mono">
                Creative Philosophy
              </span>
              <p className="text-sm sm:text-base font-editorial text-white/90 italic leading-relaxed">
                &ldquo;{philosophyText}&rdquo;
              </p>
            </div>

            {/* Craft Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 bg-[#12181C] border border-white/10 rounded-2xl hover:border-[#65E6EA]/50 hover:shadow-[0_0_25px_rgba(101,230,234,0.15)] transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#65E6EA] mb-3 group-hover:scale-110 transition-transform">
                  <Film className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-1">
                  Cinema Aesthetics
                </h4>
                <p className="text-xs text-[#9CA7AD] leading-relaxed">
                  Prime optics, organic film curve & authentic colors.
                </p>
              </div>

              <div className="p-5 bg-[#12181C] border border-white/10 rounded-2xl hover:border-[#8B7CFF]/50 hover:shadow-[0_0_25px_rgba(139,124,255,0.15)] transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#8B7CFF] mb-3 group-hover:scale-110 transition-transform">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-1">
                  Candid Intimacy
                </h4>
                <p className="text-xs text-[#9CA7AD] leading-relaxed">
                  Documenting raw, authentic emotion without artificial posing.
                </p>
              </div>

              <div className="p-5 bg-[#12181C] border border-white/10 rounded-2xl hover:border-[#65E6EA]/50 hover:shadow-[0_0_25px_rgba(101,230,234,0.15)] transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#65E6EA] mb-3 group-hover:scale-110 transition-transform">
                  <Globe className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-1">
                  Global Reach
                </h4>
                <p className="text-xs text-[#9CA7AD] leading-relaxed">
                  Ready for destination weddings and remote international sets.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
