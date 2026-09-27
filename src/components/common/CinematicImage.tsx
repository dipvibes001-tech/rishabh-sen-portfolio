import React, { useState } from 'react';
import { Camera, Film, Sparkles, Heart, Sun, Briefcase, Eye } from 'lucide-react';

interface CinematicImageProps {
  src?: string;
  alt: string;
  category?: string;
  className?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square' | 'wide' | 'tall';
  title?: string;
  client?: string;
  overlayText?: boolean;
}

export const CinematicImage: React.FC<CinematicImageProps> = ({
  src,
  alt,
  category = 'Weddings',
  className = '',
  aspectRatio = 'landscape',
  title,
  client,
  overlayText = true,
}) => {
  const [loadError, setLoadError] = useState(false);

  // If a valid image URL is given and has not failed to load
  if (src && !loadError) {
    return (
      <div className={`relative overflow-hidden bg-[#0c0c10] ${className}`}>
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setLoadError(true)}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        {/* Cinematic subtle contrast vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a]/80 via-transparent to-black/20 pointer-events-none" />
      </div>
    );
  }

  // Cinematic Artwork Fallback tailored per category
  const getCategoryStyles = () => {
    const normalizedCategory = String(category || '').toLowerCase().trim();
    switch (normalizedCategory) {
      case 'weddings':
      case 'wedding':
        return {
          gradient: 'from-[#1c140d] via-[#2d1f14] to-[#0c0b0a]',
          accent: '#E5C158',
          icon: Heart,
          subtitle: 'SACRED UNION · CANDLELIT VOWS',
          pattern: 'radial-gradient(circle at 60% 40%, rgba(229,193,88,0.18) 0%, transparent 60%)',
        };
      case 'pre-weddings':
      case 'pre-wedding':
        return {
          gradient: 'from-[#121a1f] via-[#1a252c] to-[#0a0f12]',
          accent: '#A5C9EB',
          icon: Sun,
          subtitle: 'MEDITERRANEAN DUSK · CAPE D’ANTIBES',
          pattern: 'radial-gradient(circle at 40% 30%, rgba(165,201,235,0.15) 0%, transparent 65%)',
        };
      case 'cinematography':
      case 'films':
        return {
          gradient: 'from-[#1a1410] via-[#241a15] to-[#0a0807]',
          accent: '#E6A15C',
          icon: Film,
          subtitle: '35MM CELLULOID · ANAMORPHIC CUT',
          pattern: 'radial-gradient(circle at 50% 50%, rgba(230,161,92,0.16) 0%, transparent 70%)',
        };
      case 'events':
        return {
          gradient: 'from-[#1c131d] via-[#231525] to-[#0d090e]',
          accent: '#D896FF',
          icon: Sparkles,
          subtitle: 'GRAND GALA · ROYAL PAVILIONS',
          pattern: 'radial-gradient(circle at 70% 30%, rgba(216,150,255,0.14) 0%, transparent 60%)',
        };
      case 'portraits':
      case 'portrait':
        return {
          gradient: 'from-[#141416] via-[#1f1f24] to-[#09090b]',
          accent: '#D1D5DB',
          icon: Camera,
          subtitle: 'EDITORIAL CHIAROSCURO · LEICA M',
          pattern: 'radial-gradient(circle at 35% 45%, rgba(255,255,255,0.12) 0%, transparent 55%)',
        };
      case 'commercial':
        return {
          gradient: 'from-[#1e1912] via-[#2a2217] to-[#0c0a07]',
          accent: '#C5A059',
          icon: Briefcase,
          subtitle: 'HAUTE COUTURE & HOROLOGY',
          pattern: 'radial-gradient(circle at 65% 55%, rgba(197,160,89,0.18) 0%, transparent 60%)',
        };
      default:
        return {
          gradient: 'from-[#141417] via-[#1c1c22] to-[#0a0a0c]',
          accent: '#C5A059',
          icon: Camera,
          subtitle: 'CINEMATIC STILL',
          pattern: 'radial-gradient(circle at 50% 50%, rgba(197,160,89,0.12) 0%, transparent 60%)',
        };
    }
  };

  const style = getCategoryStyles();
  const IconComp = style.icon;

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${style.gradient} border border-[#272733]/60 group ${className}`}
      style={{ backgroundImage: style.pattern }}
      role="img"
      aria-label={alt}
    >
      {/* Cinematic Viewfinder Frame Lines */}
      <div className="absolute inset-3 border border-[#C5A059]/15 pointer-events-none transition-opacity duration-500 group-hover:border-[#C5A059]/30" />
      
      {/* Viewfinder crosshairs */}
      <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-[#C5A059]/40 pointer-events-none" />
      <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-[#C5A059]/40 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-[#C5A059]/40 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-[#C5A059]/40 pointer-events-none" />

      {/* Atmospheric center aperture motif */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-full border border-[#C5A059]/25 flex items-center justify-center mb-3 bg-[#0d0d12]/50 backdrop-blur-xs transition-transform duration-500 group-hover:scale-110">
          <IconComp className="w-6 h-6 text-[#E5C158] opacity-80" />
        </div>

        {overlayText && (
          <div className="space-y-1 max-w-[85%]">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059]/90 font-medium">
              {style.subtitle}
            </span>
            {title && (
              <h4 className="text-base sm:text-lg font-serif tracking-tight text-[#EDEBE4] line-clamp-1">
                {title}
              </h4>
            )}
            {client && (
              <p className="text-xs text-[#9E9CA3] font-sans-clean line-clamp-1">
                {client}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Subtle bottom film strip numbers */}
      <div className="absolute bottom-2.5 right-4 text-[9px] font-mono tracking-widest text-[#71717A]/60 flex items-center gap-2 pointer-events-none">
        <span>RAW · 2.39:1</span>
        <span>·</span>
        <span>RS-FILM</span>
      </div>

      {/* Hover illumination sheen */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};
