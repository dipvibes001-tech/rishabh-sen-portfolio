import React from 'react';
import { Camera, Globe, Heart, Sparkles, Sliders, Film } from 'lucide-react';
import { SiteSettings } from '../../types';
import { Card3D } from '../common/Card3D';

interface AboutProps {
  about?: SiteSettings['about'];
}

export const About: React.FC<AboutProps> = ({ about }) => {
  const name = String(about?.name || 'Rishabh Sen').trim();
  const introduction = String(
    about?.introduction ||
      'I document raw human emotion, light, and unspoken connection through an uncompromising cinematic lens.'
  ).trim();
  const story = String(
    about?.story ||
      'With over a decade behind cinema cameras, I transitioned from narrative filmmaking into luxury destination weddings and editorial portraiture. My work is informed by 35mm celluloid aesthetics, delicate play of shadows, and an instinct for moments that happen in fractions of a second.'
  ).trim();
  const philosophy = String(
    about?.philosophy ||
      'A great photograph or film is never about equipment—it is about stillness in chaos, the breath before a spoken vow, and honoring the dignity of human celebration.'
  ).trim();
  const portraitUrl = about?.portraitUrl || '';
  const stats = Array.isArray(about?.stats) && about.stats.length > 0
    ? about.stats.filter(Boolean)
    : [
        { label: 'Years Experience', value: '11', suffix: '+' },
        { label: 'Cinematic Projects', value: '380', suffix: '+' },
        { label: 'Happy Clients', value: '520', suffix: '+' },
        { label: 'Destinations Covered', value: '28', suffix: ' Countries' },
      ];

  return (
    <section id="about" className="py-16 sm:py-24 lg:py-28 bg-[#080B0D] relative border-t border-white/10 z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12181C] border border-[#65E6EA]/30 text-xs font-semibold tracking-wider text-[#65E6EA] uppercase mb-3 sm:mb-4 shadow-[0_0_15px_rgba(101,230,234,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" />
            <span>01. The Visual Storyteller</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display leading-tight break-words">
            About <span className="gradient-studio-text">{name}</span>
          </h2>
        </div>

        {/* Grid: Story on Left, 3D Portrait on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Narrative Prose */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-2xl font-editorial italic text-white font-normal leading-relaxed">
                &ldquo;{introduction}&rdquo;
              </h3>
              <p className="text-sm sm:text-base text-[#9CA7AD] leading-relaxed font-sans-clean font-light">
                {story}
              </p>
            </div>

            {/* Creative Philosophy Box */}
            <div className="p-5 sm:p-8 bg-[#12181C] border-l-4 border-[#65E6EA] border-y border-r border-white/10 rounded-2xl relative shadow-lg">
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#65E6EA] font-bold block mb-2">
                Creative Philosophy
              </span>
              <p className="text-sm sm:text-base font-editorial text-white/90 italic leading-relaxed">
                &ldquo;{philosophy}&rdquo;
              </p>
            </div>

            {/* Craft Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-1 sm:pt-2">
              <div className="p-5 bg-[#12181C] border border-white/10 rounded-xl hover:border-[#65E6EA]/40 transition-colors">
                <div className="text-[#65E6EA] mb-2.5">
                  <Film className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-1">
                  Cinema Aesthetics
                </h4>
                <p className="text-xs text-[#9CA7AD] leading-relaxed">
                  Prime optics, organic film curve & authentic colors.
                </p>
              </div>

              <div className="p-5 bg-[#12181C] border border-white/10 rounded-xl hover:border-[#8B7CFF]/40 transition-colors">
                <div className="text-[#8B7CFF] mb-2.5">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-1">
                  Candid Intimacy
                </h4>
                <p className="text-xs text-[#9CA7AD] leading-relaxed">
                  Documenting raw, authentic emotion without artificial posing.
                </p>
              </div>

              <div className="p-5 bg-[#12181C] border border-white/10 rounded-xl hover:border-[#65E6EA]/40 transition-colors">
                <div className="text-[#65E6EA] mb-2.5">
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

          {/* Right Column: 3D Portrait & Stats */}
          <div className="lg:col-span-5 space-y-8">
            <Card3D maxTilt={7} glareOpacity={0.25} className="border border-white/15 shadow-2xl">
              <div className="relative aspect-[4/5] bg-gradient-to-b from-[#12181C] via-[#0D1215] to-[#080B0D] overflow-hidden">
                {portraitUrl ? (
                  <img
                    src={portraitUrl}
                    alt={`${name} Portrait`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col justify-end p-8 relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <div className="w-48 h-48 rounded-full border border-[#65E6EA]/40 flex items-center justify-center">
                        <Camera className="w-16 h-16 text-[#65E6EA]" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Overlaid artist credit */}
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#080B0D] via-[#080B0D]/80 to-transparent">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#65E6EA] font-bold">
                    Cinematographer & Photographer
                  </div>
                  <h4 className="text-2xl font-display font-bold text-white mt-0.5">
                    {name}
                  </h4>
                  <p className="text-xs text-[#9CA7AD] mt-0.5 font-light">
                    Based in Mumbai · Available Worldwide
                  </p>
                </div>
              </div>
            </Card3D>

            {/* Statistics Row: 3D Cards */}
            <div className="grid grid-cols-2 gap-4 p-5 bg-[#12181C] border border-white/10 rounded-2xl shadow-xl">
              {stats.map((stat, idx) => (
                <div key={idx} className="p-3 border-b border-white/5 last:border-b-0 sm:last:border-b">
                  <div className="text-2xl sm:text-3xl font-display font-bold text-[#65E6EA] tabular-nums">
                    {stat.value}
                    <span className="text-sm font-sans-clean font-light text-[#9CA7AD] ml-0.5">
                      {stat.suffix}
                    </span>
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-[#9CA7AD] mt-1 font-semibold">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
