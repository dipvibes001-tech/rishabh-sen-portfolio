import React, { useEffect } from 'react';
import { X, Clock, User, Film as FilmIcon, Sparkles } from 'lucide-react';
import { Film } from '../../types';
import { extractYouTubeId, buildYouTubeEmbedUrl } from '../../utils/youtube';

interface VideoModalProps {
  film: Film | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ film, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (film) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [film, onClose]);

  if (!film) return null;

  // Extract video ID safely
  const videoId = film.youtubeId || extractYouTubeId(film.youtubeUrl);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Video player for ${film?.title || 'Film'}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-black/92 backdrop-blur-2xl animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#12181C] border border-white/15 rounded-2xl overflow-hidden shadow-[0_0_90px_rgba(0,0,0,0.95),0_0_40px_rgba(101,230,234,0.15)] flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-[#0D1215]">
          <div className="flex items-center gap-2.5 sm:gap-3 pr-3 min-w-0">
            <span className="px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#65E6EA]/15 text-[#65E6EA] border border-[#65E6EA]/30 shrink-0">
              {film.category || 'Film'}
            </span>
            <h3 className="text-sm sm:text-xl font-bold text-white font-display truncate">
              {film.title || 'Untitled Film'}
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Close video player"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#9CA7AD] hover:text-white transition-colors border border-white/10 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Video Player (16:9 Aspect Ratio) */}
        <div className="relative aspect-video w-full bg-black">
          {videoId ? (
            <iframe
              src={buildYouTubeEmbedUrl(videoId)}
              title={film.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-[#9CA7AD]">
              <FilmIcon className="w-12 h-12 text-[#65E6EA] mb-3 opacity-60" />
              <p className="text-white font-medium">Unable to load video stream</p>
              <p className="text-xs mt-1 text-[#9CA7AD]">Invalid or unavailable YouTube link.</p>
            </div>
          )}
        </div>

        {/* Modal Footer Info */}
        <div className="px-6 py-4 bg-[#0D1215] flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
          <div className="flex items-center gap-4 text-xs sm:text-sm text-[#9CA7AD] flex-wrap">
            {film.clientName && (
              <span className="flex items-center gap-1.5 text-white/90">
                <User className="w-4 h-4 text-[#65E6EA]" />
                <span className="font-medium">{film.clientName}</span>
              </span>
            )}
            {film.duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#8B7CFF]" />
                <span>{film.duration}</span>
              </span>
            )}
            <span className="text-xs text-[#65E6EA] flex items-center gap-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> 4K Master Grade
            </span>
          </div>

          {film.description && (
            <p className="text-xs text-[#9CA7AD] font-light max-w-lg line-clamp-2">
              {film.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
