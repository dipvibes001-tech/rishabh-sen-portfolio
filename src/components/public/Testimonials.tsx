import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';
import { TestimonialItem } from '../../types';
import { Card3D } from '../common/Card3D';

interface TestimonialsProps {
  testimonials: TestimonialItem[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-[#080B0D] relative border-t border-white/10 z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12181C] border border-[#65E6EA]/30 text-xs font-semibold tracking-wider text-[#65E6EA] uppercase mb-3 sm:mb-4 shadow-[0_0_15px_rgba(101,230,234,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" />
            <span>06. Client Endorsements</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display mb-3 sm:mb-4 leading-tight break-words">
            Words of <span className="gradient-studio-text">Appreciation</span>
          </h2>
          <p className="text-xs sm:text-base text-[#9CA7AD] font-sans-clean font-light leading-relaxed">
            Unfiltered reflections from royal couples, editorial directors, and luxury brand patrons.
          </p>
        </div>

        {/* 3D Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          {(Array.isArray(testimonials) ? testimonials : []).filter(Boolean).map((test, index) => {
            if (!test) return null;
            return (
              <Card3D key={test.id || index} maxTilt={7} glareOpacity={0.15}>
              <div className="bg-[#12181C] border border-white/10 hover:border-[#65E6EA]/40 p-6 sm:p-9 rounded-2xl transition-all duration-300 flex flex-col justify-between h-full relative group shadow-xl">
                <div>
                  {/* Top: Star Rating & Quote Glyph */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1 text-[#65E6EA]">
                      {Array.from({ length: test.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(101,230,234,0.5)]" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-white/10 group-hover:text-[#65E6EA]/40 transition-colors" />
                  </div>

                  {/* Review Text */}
                  <p className="text-sm sm:text-base font-editorial italic text-white/90 leading-relaxed mb-6 font-light">
                    &ldquo;{test.review}&rdquo;
                  </p>
                </div>

                {/* Client Info */}
                <div className="pt-6 border-t border-white/5 flex items-center gap-3.5">
                  {test.avatarUrl ? (
                    <img
                      src={test.avatarUrl}
                      alt={test.name || 'Client'}
                      className="w-11 h-11 rounded-full object-cover border border-[#65E6EA]/40"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-[#0D1215] border border-white/10 flex items-center justify-center text-xs font-display font-bold text-[#65E6EA] uppercase shadow-inner">
                      {String(test.name || 'Client')
                        .split(' ')
                        .filter(Boolean)
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-display font-bold text-white">
                      {test.name || 'Anonymous Client'}
                    </h4>
                    <div className="text-xs text-[#9CA7AD] flex items-center gap-1.5 font-sans-clean font-light">
                      <span>{test.eventType}</span>
                      {test.location && (
                        <>
                          <span className="text-white/20">·</span>
                          <span>{test.location}</span>
                        </>
                      )}
                    </div>
                  </div>
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
