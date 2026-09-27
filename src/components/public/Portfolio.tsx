import React, { useState } from 'react';
import { X, Maximize2, Camera, Sparkles } from 'lucide-react';
import { PortfolioItem, PortfolioCategory } from '../../types';
import { CinematicImage } from '../common/CinematicImage';
import { Card3D } from '../common/Card3D';

interface PortfolioProps {
  portfolio: PortfolioItem[];
}

const CATEGORIES: Array<'All' | PortfolioCategory> = [
  'All',
  'Weddings',
  'Pre-Weddings',
  'Cinematography',
  'Events',
  'Portraits',
  'Commercial',
];

export const Portfolio: React.FC<PortfolioProps> = ({ portfolio }) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | PortfolioCategory>('All');
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);

  const safePortfolio = Array.isArray(portfolio) ? portfolio.filter(Boolean) : [];

  const filteredItems = selectedCategory === 'All'
    ? safePortfolio
    : safePortfolio.filter((item) =>
        item && String(item.category || '').toLowerCase().trim() === String(selectedCategory || '').toLowerCase().trim()
      );

  return (
    <section id="portfolio" className="py-16 sm:py-24 lg:py-28 bg-[#080B0D] relative border-t border-white/10 z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12181C] border border-[#65E6EA]/30 text-xs font-semibold tracking-wider text-[#65E6EA] uppercase mb-3 sm:mb-4 shadow-[0_0_15px_rgba(101,230,234,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" />
              <span>03. Selected Photography</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display leading-tight break-words">
              Visual <span className="gradient-studio-text">Archive</span>
            </h2>
          </div>
          <p className="text-xs sm:text-base text-[#9CA7AD] max-w-sm font-sans-clean font-light leading-relaxed">
            A curated photography portfolio spanning destination royal weddings, fashion editorials, and intimate portraits.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-12 border-b border-white/10 pb-5 sm:pb-6">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[40px] px-3.5 sm:px-4 py-2 rounded-xl text-xs uppercase tracking-[0.16em] font-bold transition-all duration-300 cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#65E6EA] to-[#8B7CFF] text-[#080B0D] shadow-[0_0_20px_rgba(101,230,234,0.35)]'
                    : 'bg-[#12181C] text-[#9CA7AD] hover:text-white hover:bg-white/5 border border-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid with 3D Tilt */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center text-[#9CA7AD] bg-[#12181C] border border-dashed border-white/10 rounded-2xl p-8">
            <Camera className="w-8 h-8 mx-auto mb-3 opacity-40 text-[#65E6EA]" />
            <p className="text-sm text-white font-medium">No items currently available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.filter(Boolean).map((item, index) => {
              const isLarge = item.featured && index % 3 === 0;

              return (
                <div
                  key={item.id || index}
                  className={`w-full ${isLarge ? 'md:col-span-2 md:row-span-1' : ''}`}
                >
                  <Card3D maxTilt={7} glareOpacity={0.2}>
                    <div
                      onClick={() => setLightboxItem(item)}
                      className="group relative overflow-hidden rounded-2xl cursor-pointer border border-white/10 hover:border-[#65E6EA]/50 transition-all duration-500 bg-[#12181C] shadow-xl"
                    >
                      {/* Media container */}
                      <div className={`w-full ${isLarge ? 'h-72 sm:h-80 md:h-96' : 'h-64 sm:h-72 md:h-80'}`}>
                        <CinematicImage
                          src={item.imageUrl}
                          alt={item.title || 'Visual Archive'}
                          category={item.category || 'Weddings'}
                          title={item.title || ''}
                          client={item.client || ''}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                        />
                      </div>

                      {/* Hover Overlay Card */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080B0D] via-[#080B0D]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#65E6EA] font-bold mb-1.5">
                          <span>{item.category || 'Photography'}</span>
                          {item.year && <span>· {item.year}</span>}
                        </div>

                        <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-2 leading-tight">
                          {item.title || 'Visual Artwork'}
                        </h3>

                        <p className="text-xs text-[#9CA7AD] line-clamp-2 font-sans-clean font-light mb-4">
                          {item.description || ''}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-[#65E6EA] uppercase tracking-wider font-semibold">
                          <span>{item.client || 'Commissioned Project'}</span>
                          <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            <span>View Full Work</span>
                            <Maximize2 className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card3D>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 lg:p-10 animate-fadeIn"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#12181C] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-white/10 bg-[#0D1215]">
              <div className="flex items-center gap-2 sm:gap-3 pr-2 min-w-0">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#65E6EA] font-bold shrink-0">
                  {lightboxItem.category || 'Photography'}
                </span>
                <span className="text-white/20">·</span>
                <h3 className="text-xs sm:text-base font-display font-bold text-white truncate">
                  {lightboxItem.title || 'Visual Artwork'}
                </h3>
              </div>
              <button
                onClick={() => setLightboxItem(null)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-[#9CA7AD] hover:text-white hover:bg-white/10 rounded-xl transition-colors border border-white/10 shrink-0 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
              {/* Media viewer */}
              <div className="relative w-full max-h-[55vh] sm:max-h-[65vh] h-64 sm:h-96 md:h-[480px] bg-[#080B0D] rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
                <CinematicImage
                  src={lightboxItem.imageUrl}
                  alt={lightboxItem.title || 'Visual Artwork'}
                  category={lightboxItem.category || 'Weddings'}
                  title={lightboxItem.title || ''}
                  client={lightboxItem.client || ''}
                  className="w-full h-full max-h-[80vh] w-auto object-contain sm:object-cover"
                />
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
                <div className="md:col-span-2 space-y-3">
                  <h4 className="text-xl font-display font-bold text-white">
                    {lightboxItem.title || 'Visual Artwork'}
                  </h4>
                  <p className="text-sm text-[#9CA7AD] font-sans-clean font-light leading-relaxed">
                    {lightboxItem.description || ''}
                  </p>
                </div>

                <div className="bg-[#0D1215] p-5 border border-white/10 rounded-xl space-y-3 text-xs">
                  <div>
                    <span className="text-[#9CA7AD] uppercase tracking-wider block text-[10px] mb-0.5">
                      Client / Commission
                    </span>
                    <span className="text-white font-semibold">
                      {lightboxItem.client || 'Private Commission'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#9CA7AD] uppercase tracking-wider block text-[10px] mb-0.5">
                      Production Year
                    </span>
                    <span className="text-white font-semibold">
                      {lightboxItem.year || '2026'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#9CA7AD] uppercase tracking-wider block text-[10px] mb-0.5">
                      Medium & Grade
                    </span>
                    <span className="text-[#65E6EA] font-mono text-[11px]">
                      Arri Alexa Mini LF · Cooke Anamorphic /i
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
