import React from 'react';
import { Film, Volume2, Sparkles } from 'lucide-react';
import { SiteSettings } from '../../types';
import { Card3D } from '../common/Card3D';

interface HighlightsProps {
  highlights: SiteSettings['highlights'];
}

export const Highlights: React.FC<HighlightsProps> = ({ highlights }) => {
  const getIcon = (iconName: string, index: number) => {
    switch (String(iconName || '').toLowerCase().trim()) {
      case 'film':
        return Film;
      case 'volume2':
      case 'sound':
        return Volume2;
      case 'sparkles':
      case 'detail':
        return Sparkles;
      default:
        return index === 0 ? Film : index === 1 ? Volume2 : Sparkles;
    }
  };

  const safeHighlights = Array.isArray(highlights) ? highlights.filter(Boolean) : [];

  return (
    <section id="highlights" className="py-16 sm:py-24 lg:py-28 bg-[#080B0D] relative border-t border-white/10 z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12181C] border border-[#65E6EA]/30 text-xs font-semibold tracking-wider text-[#65E6EA] uppercase mb-3 sm:mb-4 shadow-[0_0_15px_rgba(101,230,234,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" />
            <span>05. The Pillars of Excellence</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display mb-3 sm:mb-4 leading-tight break-words">
            Artistic <span className="gradient-studio-text">Distinctions</span>
          </h2>
          <p className="text-xs sm:text-base text-[#9CA7AD] font-sans-clean font-light leading-relaxed">
            The three non-negotiable principles guiding every frame, soundscape, and heirloom film we create.
          </p>
        </div>

        {/* 3 Premium 3D Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          {safeHighlights.filter(Boolean).map((hl, index) => {
            if (!hl) return null;
            const Icon = getIcon(hl.icon, index);
            const isPurple = index === 1;

            return (
              <Card3D key={hl.id || index} maxTilt={8} glareOpacity={0.18}>
                <div className="group relative bg-[#12181C] border border-white/10 hover:border-[#65E6EA]/40 p-6 sm:p-10 rounded-2xl transition-all duration-300 flex flex-col justify-between h-full shadow-xl">
                  {/* Visual Corner Indicator */}
                  <div className="absolute top-5 sm:top-6 right-5 sm:right-6 text-xs font-mono tracking-widest text-[#9CA7AD]/60">
                    0{index + 1}
                  </div>

                  <div>
                    {/* Icon */}
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${isPurple ? 'bg-[#8B7CFF]/10 text-[#8B7CFF]' : 'bg-[#65E6EA]/10 text-[#65E6EA]'} border border-white/10 flex items-center justify-center mb-5 sm:mb-6 transition-transform group-hover:scale-110 shadow-inner`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    {/* Subtitle / Kicker */}
                    <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#65E6EA] font-bold block mb-2">
                      {hl.subtitle}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg sm:text-2xl font-display font-bold text-white group-hover:text-[#65E6EA] transition-colors mb-3 sm:mb-4">
                      {hl.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#9CA7AD] font-sans-clean font-light leading-relaxed">
                      {hl.description}
                    </p>
                  </div>

                  {/* Bottom Line */}
                  <div className="pt-6 mt-6 border-t border-white/5 group-hover:border-[#65E6EA]/20 transition-colors flex items-center justify-between text-xs text-[#9CA7AD]">
                    <span className="uppercase tracking-wider font-semibold text-[10px]">Uncompromising Standard</span>
                    <span className={`w-2 h-2 rounded-full ${isPurple ? 'bg-[#8B7CFF]' : 'bg-[#65E6EA]'} shadow-sm`} />
                  </div>
                </div>
              </Card3D>
            );
          })}
        </div>
      </div>
    </section>
  );
};
