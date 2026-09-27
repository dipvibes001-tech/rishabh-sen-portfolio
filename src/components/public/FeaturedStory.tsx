import React, { useState } from 'react';
import { Film, Play, MapPin, Clock, ArrowRight, X, Sparkles } from 'lucide-react';
import { SiteSettings } from '../../types';
import { CinematicImage } from '../common/CinematicImage';
import { Card3D } from '../common/Card3D';

interface FeaturedStoryProps {
  story?: SiteSettings['featuredStory'];
}

export const FeaturedStory: React.FC<FeaturedStoryProps> = ({ story }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const title = String(story?.title || 'The Eternal Mirage of Udaipur');
  const subtitle = String(story?.subtitle || 'A Royal Destination Wedding Film');
  const location = String(story?.location || 'Jagmandir Island Palace, Udaipur');
  const description = String(story?.description || '');
  const fullStory = String(story?.fullStory || description);
  const imageUrl = story?.imageUrl || '';
  const filmDuration = story?.filmDuration || '14 min Cinema Cut';

  return (
    <section id="story" className="py-16 sm:py-24 lg:py-28 bg-[#080B0D] relative border-t border-white/10 overflow-hidden z-10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-[#8B7CFF]/10 blur-[100px] sm:blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12181C] border border-[#65E6EA]/30 text-xs font-semibold tracking-wider text-[#65E6EA] uppercase mb-3 sm:mb-4 shadow-[0_0_15px_rgba(101,230,234,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" />
            <span>04. Cinematic Narrative</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display leading-tight break-words">
            Featured <span className="gradient-studio-text">Film Story</span>
          </h2>
        </div>

        {/* Featured Story Showcase 3D Card */}
        <Card3D maxTilt={5} glareOpacity={0.15}>
          <div className="bg-[#12181C] border border-white/10 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
            {/* Left / Media Column */}
            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[500px] overflow-hidden group">
              <CinematicImage
                src={imageUrl}
                alt={title}
                category="Cinematography"
                title={title}
                client={location}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Central Glowing Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#080B0D]/85 border border-[#65E6EA] text-[#65E6EA] flex items-center justify-center pl-1 shadow-[0_0_35px_rgba(101,230,234,0.4)] backdrop-blur-md hover:scale-110 active:scale-95 hover:border-[#8B7CFF] hover:shadow-[0_0_50px_rgba(139,124,255,0.6)] transition-all duration-300 cursor-pointer"
                  aria-label="Explore Story"
                >
                  <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
                </button>
              </div>

              {/* Bottom Scrim Badge */}
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between text-xs text-white bg-[#080B0D]/80 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/10">
                <span className="flex items-center gap-1.5 font-medium truncate max-w-[60%] sm:max-w-none">
                  <MapPin className="w-3.5 h-3.5 text-[#65E6EA] shrink-0" />
                  <span className="truncate">{location}</span>
                </span>
                <span className="flex items-center gap-1.5 text-[#9CA7AD] font-mono text-[10px] sm:text-[11px] shrink-0">
                  <Clock className="w-3.5 h-3.5 text-[#8B7CFF]" />
                  {filmDuration}
                </span>
              </div>
            </div>

            {/* Right / Story Text Column */}
            <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <span className="text-xs uppercase tracking-[0.25em] text-[#65E6EA] font-bold block">
                  {subtitle}
                </span>

                <h3 className="text-xl sm:text-3xl font-display font-bold text-white leading-tight">
                  {title}
                </h3>

                <p className="text-xs sm:text-sm text-[#9CA7AD] font-sans-clean font-light leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="pt-4 sm:pt-6 border-t border-white/10">
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full sm:w-auto min-h-[44px] px-6 py-3.5 text-xs uppercase tracking-[0.2em] font-bold text-[#080B0D] bg-gradient-to-r from-[#65E6EA] to-[#8B7CFF] rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(101,230,234,0.3)] hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Explore Full Story</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Card3D>
      </div>

      {/* Story Detail Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-fadeIn"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative max-w-3xl w-full bg-[#12181C] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0D1215]">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#65E6EA] font-semibold">
                  Featured Master Story
                </span>
                <h3 className="text-xl font-display font-bold text-white mt-1">
                  {title}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-[#9CA7AD] hover:text-white hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div className="prose prose-invert max-w-none text-[#9CA7AD] text-sm sm:text-base leading-relaxed space-y-4">
                <p className="text-white font-medium italic border-l-2 border-[#65E6EA] pl-4">
                  {description}
                </p>
                <p>
                  {fullStory ||
                    'Captured across four days in Rajasthan, this documentary wedding film captures the royal grandeur of historic forts alongside intimate vows exchanged under starlit courtyard arches. Using vintage anamorphic glass and live orchestral accompaniment, every sequence was graded to preserve skin tones in desert noon sun and torchlit dusk.'}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#9CA7AD]">
                <span>Location: <strong className="text-white">{location}</strong></span>
                <a
                  href="#contact"
                  onClick={() => setModalOpen(false)}
                  className="text-[#65E6EA] font-semibold hover:underline"
                >
                  Commission Similar Story →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
