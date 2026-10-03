import React from 'react';
import { Sparkles, Film, Heart, Globe, Camera } from 'lucide-react';
import { SiteAbout } from '../../types';

interface AboutProps {
  about?: SiteAbout;
}

export const About: React.FC<AboutProps> = ({ about }) => {
  // Aapki uploaded camera photo default set kar di gayi hai
  const portraitImg =
    about?.imageUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80';

  return (
    <section id="about" className="py-24 sm:py-32 bg-[#080B0D] relative border-t border-white/10 z-10">
      {/* Subtle Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#65E6EA]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Narrative Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12181C] border border-[#65E6EA]/30 text-xs font-semibold tracking-wider text-[#65E6EA] uppercase shadow-[0_0_15px_rgba(101,230,234,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" />
              <span>01. The Visual Storyteller</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight leading-tight">
              About <span className="bg-gradient-to-r from-[#65E6EA] to-[#B388FF] bg-clip-text text-transparent">Rishabh Sen</span>
            </h2>

            <blockquote className="text-base sm:text-xl font-serif italic text-white/90 border-l-2 border-[#65E6EA] pl-6 leading-relaxed">
              &ldquo;I document raw human emotion, light, and unspoken connection through an uncompromising cinematic lens.&rdquo;
            </blockquote>

            <p className="text-sm sm:text-base text-[#9CA7AD] leading-relaxed font-light">
              {about?.story ||
                'With over a decade behind cinema cameras, I transitioned from narrative filmmaking into luxury destination weddings and editorial portraiture. My work is informed by 35mm celluloid aesthetics, delicate play of shadows, and an instinct for moments that happen in fractions of a second.'}
            </p>

            {/* Creative Philosophy Box */}
            <div className="p-6 rounded-2xl bg-[#0D1215] border border-white/10 space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-[#65E6EA] font-semibold">
                Creative Philosophy
              </div>
              <p className="text-xs sm:text-sm text-gray-300 font-serif italic leading-relaxed">
                &ldquo;A great photograph or film is never about equipment—it is about stillness in chaos, the breath before a spoken vow, and honoring the dignity of human celebration.&rdquo;
              </p>
            </div>

            {/* 3 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#12181C]/70 border border-white/5 space-y-2">
                <Film className="w-5 h-5 text-[#65E6EA]" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Cinema Aesthetics</h4>
                <p className="text-[11px] text-[#9CA7AD] leading-relaxed">
                  Prime optics, organic film curve & authentic colors.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#12181C]/70 border border-white/5 space-y-2">
                <Heart className="w-5 h-5 text-[#B388FF]" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Candid Intimacy</h4>
                <p className="text-[11px] text-[#9CA7AD] leading-relaxed">
                  Documenting raw, authentic emotion without artificial posing.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#12181C]/70 border border-white/5 space-y-2">
                <Globe className="w-5 h-5 text-[#65E6EA]" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Global Reach</h4>
                <p className="text-[11px] text-[#9CA7AD] leading-relaxed">
                  Ready for destination weddings and remote international sets.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Photographer Portrait Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#0D1215] shadow-2xl group">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/50">
                <img
                  src={portraitImg}
                  alt="Rishabh Sen - Cinematographer"
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to unsplash portrait if link breaks
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B0D] via-[#080B0D]/40 to-transparent" />
              </div>

              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8">
                <div className="text-[11px] uppercase tracking-[0.25em] text-[#65E6EA] font-mono font-semibold">
                  Cinematographer & Photographer
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mt-1">
                  Rishabh Sen
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 font-light">
                  Based in Mumbai · Available Worldwide
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
