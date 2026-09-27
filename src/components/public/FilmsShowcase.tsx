import React, { useState } from 'react';
import { Play, Clock, User, Film as FilmIcon, Sparkles, Search, Star, Clapperboard } from 'lucide-react';
import { Film } from '../../types';
import { Card3D } from '../common/Card3D';
import { VideoModal } from '../common/VideoModal';

interface FilmsShowcaseProps {
  films: Film[];
}

export const FilmsShowcase: React.FC<FilmsShowcaseProps> = ({ films }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilm, setActiveFilm] = useState<Film | null>(null);

  // Extract dynamic categories from available films
  const safeFilms = Array.isArray(films) ? films.filter(Boolean) : [];
  const availableCategories = [
    'All',
    ...Array.from(
      new Set(
        safeFilms
          .map((f) => String(f?.category || '').trim())
          .filter(Boolean)
      )
    ),
  ];

  // Filter films by search and category
  const normalizedSearch = String(searchQuery || '').toLowerCase().trim();
  const normalizedSelectedCat = String(selectedCategory || 'All').toLowerCase().trim();

  const filteredFilms = safeFilms.filter((film) => {
    if (!film) return false;
    const filmCat = String(film.category || '').toLowerCase().trim();
    const matchesCategory = normalizedSelectedCat === 'all' || filmCat === normalizedSelectedCat;

    if (!normalizedSearch) return matchesCategory;

    const filmTitle = String(film.title || '').toLowerCase().trim();
    const filmClient = String(film.clientName || '').toLowerCase().trim();
    const filmDesc = String(film.description || '').toLowerCase().trim();

    const matchesSearch =
      filmTitle.includes(normalizedSearch) ||
      filmCat.includes(normalizedSearch) ||
      filmClient.includes(normalizedSearch) ||
      filmDesc.includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  const featuredFilms = filteredFilms.filter((f) => f.featured);
  const moreFilms = filteredFilms.filter((f) => !f.featured);

  return (
    <section id="films" className="relative py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 overflow-hidden">
      {/* 17. FILM SECTION HERO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12181C] border border-[#65E6EA]/30 text-xs font-semibold tracking-wider text-[#65E6EA] uppercase mb-3 sm:mb-4 shadow-[0_0_20px_rgba(101,230,234,0.2)] backdrop-blur-md">
            <FilmIcon className="w-3.5 h-3.5" />
            <span>Cinematography & Motion</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display leading-tight break-words">
            Stories <span className="gradient-studio-text">That Move</span>
          </h2>

          <p className="mt-2 sm:mt-3 text-[#9CA7AD] max-w-xl text-sm sm:text-base lg:text-lg font-light leading-relaxed">
            Watch our cinematic films, wedding stories and creative productions. Captured with 4K anamorphic cinema primes and bespoke symphonic sound design.
          </p>
        </div>

        {/* 18. Instant Search & Category Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search films, clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[44px] pl-9 pr-4 py-2.5 rounded-xl bg-[#12181C] border border-white/10 text-white text-base sm:text-xs placeholder-[#9CA7AD]/60 focus:outline-none focus:border-[#65E6EA] transition-colors"
            />
            <Search className="w-4 h-4 text-[#9CA7AD] absolute left-3 top-3.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 sm:mb-12 scrollbar-none max-w-full">
        {availableCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`min-h-[40px] px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 shrink-0 cursor-pointer active:scale-95 ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#65E6EA] to-[#8B7CFF] text-[#080B0D] shadow-[0_0_25px_rgba(101,230,234,0.35)]'
                : 'bg-[#12181C] text-[#9CA7AD] hover:text-white hover:bg-white/5 border border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* If no films found */}
      {filteredFilms.length === 0 ? (
        <div className="text-center py-20 bg-[#12181C] rounded-2xl border border-dashed border-white/10 p-8">
          <Clapperboard className="w-10 h-10 text-[#65E6EA]/40 mx-auto mb-3" />
          <h3 className="text-white font-bold text-lg">No Films Found</h3>
          <p className="text-xs text-[#9CA7AD] mt-1">Try selecting another category or clearing your search.</p>
        </div>
      ) : (
        <>
          {/* 15. FEATURED FILMS SECTION */}
          {featuredFilms.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-4 h-4 text-[#8B7CFF] fill-[#8B7CFF]" />
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Featured <span className="text-[#8B7CFF]">Spotlights</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredFilms.filter(Boolean).map((film) => (
                  <Card3D key={film.id} maxTilt={6} glareOpacity={0.2}>
                    <div
                      onClick={() => setActiveFilm(film)}
                      className="group relative cursor-pointer rounded-2xl bg-[#12181C] border border-white/10 hover:border-[#65E6EA]/60 overflow-hidden shadow-2xl transition-all duration-500 flex flex-col"
                    >
                      {/* Movie Poster Aspect Frame */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0D1215]">
                        <img
                          src={film.thumbnail || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop'}
                          alt={film.title || 'Cinematic Film'}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#12181C] via-[#12181C]/40 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#8B7CFF]/20 border border-[#8B7CFF]/40 text-[#8B7CFF] backdrop-blur-md flex items-center gap-1 shadow-sm">
                            <Star className="w-3 h-3 fill-[#8B7CFF]" /> Featured Spotlight
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#12181C]/80 border border-white/10 text-white/90 backdrop-blur-md">
                            {film.category}
                          </span>
                        </div>

                        {/* Duration Badge */}
                        {film.duration && (
                          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#080B0D]/85 border border-white/10 text-white backdrop-blur-md">
                            <Clock className="w-3.5 h-3.5 text-[#65E6EA]" />
                            <span>{film.duration}</span>
                          </div>
                        )}

                        {/* 16. Circular Glass Play Button with Pulse Glow */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative flex items-center justify-center w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#080B0D]/80 border border-[#65E6EA] shadow-[0_0_35px_rgba(101,230,234,0.4)] backdrop-blur-md group-hover:scale-115 group-hover:border-[#8B7CFF] group-hover:shadow-[0_0_50px_rgba(139,124,255,0.65)] transition-all duration-400">
                            <div className="absolute inset-0 rounded-full border border-[#65E6EA]/50 animate-ping opacity-35" />
                            <Play className="w-8 h-8 text-[#65E6EA] fill-[#65E6EA] ml-1 transition-transform group-hover:scale-110" />
                          </div>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-6">
                        {film.clientName && (
                          <div className="flex items-center gap-1.5 text-xs text-[#65E6EA] font-semibold uppercase tracking-wider mb-1">
                            <User className="w-3.5 h-3.5" />
                            <span>{film.clientName}</span>
                          </div>
                        )}
                        <h4 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#65E6EA] transition-colors font-display line-clamp-1">
                          {film.title}
                        </h4>
                        {film.description && (
                          <p className="mt-2 text-xs sm:text-sm text-[#9CA7AD] line-clamp-2 font-light leading-relaxed">
                            {film.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card3D>
                ))}
              </div>
            </div>
          )}

          {/* MORE FILMS SECTION */}
          {moreFilms.length > 0 && (
            <div>
              {featuredFilms.length > 0 && (
                <div className="flex items-center gap-2 mb-6 pt-4 border-t border-white/5">
                  <FilmIcon className="w-4 h-4 text-[#65E6EA]" />
                  <h3 className="text-lg sm:text-xl font-bold text-white font-display">
                    More <span className="gradient-studio-text">Films & Stories</span>
                  </h3>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {moreFilms.filter(Boolean).map((film) => (
                  <Card3D key={film.id} maxTilt={8} glareOpacity={0.16}>
                    <div
                      onClick={() => setActiveFilm(film)}
                      className="group relative cursor-pointer rounded-2xl bg-[#12181C] border border-white/10 hover:border-[#65E6EA]/40 overflow-hidden flex flex-col h-full transition-all duration-400 shadow-xl"
                    >
                      {/* Movie poster card thumbnail */}
                      <div className="relative aspect-video w-full overflow-hidden bg-[#0D1215]">
                        <img
                          src={film.thumbnail || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop'}
                          alt={film.title || 'Cinematic Film'}
                          className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-108"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#12181C] via-transparent to-black/30" />

                        {/* Duration indicator */}
                        {film.duration && (
                          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-[#080B0D]/85 border border-white/10 text-white backdrop-blur-md">
                            <Clock className="w-3 h-3 text-[#65E6EA]" />
                            <span>{film.duration}</span>
                          </div>
                        )}

                        {/* Category tag */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#12181C]/90 border border-white/10 text-white/90 backdrop-blur-md">
                            {film.category}
                          </span>
                        </div>

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#080B0D]/80 border border-[#65E6EA]/60 shadow-[0_0_20px_rgba(101,230,234,0.3)] backdrop-blur-sm group-hover:scale-115 group-hover:border-[#65E6EA] group-hover:shadow-[0_0_35px_rgba(101,230,234,0.5)] transition-all duration-300">
                            <Play className="w-6 h-6 text-[#65E6EA] fill-[#65E6EA] ml-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Card Meta Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          {film.clientName && (
                            <div className="flex items-center gap-1.5 text-xs text-[#65E6EA] font-semibold mb-1">
                              <User className="w-3.5 h-3.5" />
                              <span>{film.clientName}</span>
                            </div>
                          )}
                          <h4 className="text-lg font-bold text-white group-hover:text-[#65E6EA] transition-colors line-clamp-1 font-display">
                            {film.title}
                          </h4>
                          {film.description && (
                            <p className="mt-2 text-xs sm:text-sm text-[#9CA7AD] line-clamp-2 font-light leading-relaxed">
                              {film.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#9CA7AD]">
                          <span className="group-hover:text-white transition-colors flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" />
                            <span>Watch Inside Website</span>
                          </span>
                          <span className="text-[#65E6EA] font-mono text-[11px] font-semibold">4K DCI</span>
                        </div>
                      </div>
                    </div>
                  </Card3D>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* 10. REUSABLE VIDEO MODAL PLAYER */}
      <VideoModal film={activeFilm} onClose={() => setActiveFilm(null)} />
    </section>
  );
};
