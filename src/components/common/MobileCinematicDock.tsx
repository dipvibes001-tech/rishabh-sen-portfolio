import React, { useEffect, useState } from 'react';
import { Film, MessageCircle, Phone, Calendar, ArrowUp } from 'lucide-react';

interface MobileCinematicDockProps {
  whatsapp?: string;
  phone?: string;
}

export const MobileCinematicDock: React.FC<MobileCinematicDockProps> = ({
  whatsapp = '+919876543210',
  phone = '+919876543210',
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(currentProgress);
        setShowScrollTop(window.scrollY > 400);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanWa = whatsapp.replace(/\D/g, '');
  const cleanPhone = phone.replace(/\s+/g, '');

  return (
    <>
      {/* 1. Top Cinema Laser Scroll Bar (Visible on all screens) */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-white/5 z-[60] pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#65E6EA] via-[#8B7CFF] to-[#C56CFF] shadow-[0_0_12px_#65E6EA] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Floating Quick Action Bottom Dock (Mobile Only) */}
      <div className="lg:hidden fixed bottom-4 inset-x-0 z-50 flex items-center justify-center px-4 pointer-events-none">
        <nav
          aria-label="Mobile Quick Actions"
          className="pointer-events-auto flex items-center gap-1 sm:gap-2 px-3.5 py-2.5 rounded-full bg-[#0D1215]/90 backdrop-blur-xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.85)] border-t-white/25 active:scale-[0.99] transition-transform"
        >
          {/* Quick WhatsApp Inquiry */}
          <a
            href={`https://wa.me/${cleanWa}?text=Hi%20Rishabh,%20I%20would%20like%20to%20inquire%20about%20cinematography%20dates.`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold active:bg-emerald-500/30 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="hidden xs:inline">WhatsApp</span>
          </a>

          {/* Quick Phone Call */}
          <a
            href={`tel:${cleanPhone}`}
            aria-label="Direct Phone Call"
            className="p-2.5 rounded-full bg-white/5 text-gray-300 hover:text-white border border-white/10 active:bg-white/15 transition-colors"
          >
            <Phone className="w-4 h-4 text-[#65E6EA]" />
          </a>

          {/* Jump to Films */}
          <a
            href="#films"
            aria-label="View Cinema Films"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 text-gray-200 border border-white/10 text-xs font-mono uppercase tracking-wider active:bg-white/15 transition-colors"
          >
            <Film className="w-3.5 h-3.5 text-[#8B7CFF]" />
            <span>Films</span>
          </a>

          {/* Book Session CTA */}
          <a
            href="#contact"
            aria-label="Book a Session"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-[#65E6EA] to-[#8B7CFF] text-[#080B0D] text-xs font-bold font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(101,230,234,0.4)] active:opacity-90 transition-opacity"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book</span>
          </a>

          {/* Return to top */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              aria-label="Scroll back to top"
              className="p-2.5 rounded-full bg-white/5 text-[#65E6EA] border border-white/10 active:bg-white/15 transition-all ml-1"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          )}
        </nav>
      </div>
    </>
  );
};
