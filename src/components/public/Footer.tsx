import React, { useState } from 'react';
import { Lock, ArrowUp, Instagram, Youtube, Facebook, Mail, Phone, MapPin, X, Film } from 'lucide-react';
import { SiteSettings } from '../../types';

interface FooterProps {
  footer?: SiteSettings['footer'];
  contact?: SiteSettings['contact'];
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ footer, contact, onAdminClick }) => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  const safeFooter = footer || {
    bio: 'Master of light, shadow, and emotive documentary. Crafting timeless visual legacies for discerning couples, brands, and editorial productions globally.',
    copyrightText: `© ${new Date().getFullYear()} Rishabh Sen. All rights reserved.`,
  };

  const safeContact = contact || {
    email: 'studio@rishabhsen.com',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    location: 'Mumbai & Worldwide',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    facebook: 'https://facebook.com',
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080B0D] border-t border-white/10 text-[#9CA7AD] pt-14 sm:pt-20 pb-10 sm:pb-12 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-12 pb-10 sm:pb-14 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2 text-xl font-display font-bold tracking-[0.16em] text-white uppercase">
              <span>Rishabh Sen</span>
              <span className="w-2 h-2 rounded-full bg-[#65E6EA] shadow-[0_0_8px_#65E6EA]" />
            </div>

            <p className="text-xs sm:text-sm text-[#9CA7AD] font-sans-clean font-light leading-relaxed max-w-sm">
              {safeFooter.bio ||
                'Master of light, shadow, and emotive documentary. Crafting timeless visual legacies for discerning couples, brands, and editorial productions globally.'}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={safeContact.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-[#12181C] border border-white/10 flex items-center justify-center text-[#65E6EA] hover:text-white hover:border-[#65E6EA] transition-all hover:scale-105"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={safeContact.youtube || 'https://youtube.com'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-xl bg-[#12181C] border border-white/10 flex items-center justify-center text-[#8B7CFF] hover:text-white hover:border-[#8B7CFF] transition-all hover:scale-105"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={safeContact.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-xl bg-[#12181C] border border-white/10 flex items-center justify-center text-[#65E6EA] hover:text-white hover:border-[#65E6EA] transition-all hover:scale-105"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#65E6EA] font-bold block">
              Exploration
            </span>
            <ul className="space-y-2.5 text-xs font-sans-clean">
              <li>
                <a href="#about" className="hover:text-white transition-colors">About the Artist</a>
              </li>
              <li>
                <a href="#films" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Film className="w-3 h-3 text-[#65E6EA]" />
                  <span>Cinematography & Films</span>
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-white transition-colors">Visual Archive (Photography)</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">Bespoke Services</a>
              </li>
              <li>
                <a href="#story" className="hover:text-white transition-colors">Featured Film Story</a>
              </li>
              <li>
                <a href="#highlights" className="hover:text-white transition-colors">Artistic Distinctions</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Book a Session</a>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#65E6EA] font-bold block">
              Atelier Contact
            </span>
            <div className="space-y-3 text-xs font-sans-clean">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#65E6EA] shrink-0" />
                <span className="text-white/80">{safeContact.location || 'Mumbai & Worldwide'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#65E6EA] shrink-0" />
                <a href={`mailto:${safeContact.email || 'studio@rishabhsen.com'}`} className="text-white/80 hover:text-[#65E6EA] transition-colors">
                  {safeContact.email || 'studio@rishabhsen.com'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#65E6EA] shrink-0" />
                <a href={`tel:${safeContact.phone || '+919876543210'}`} className="text-white/80 hover:text-[#65E6EA] transition-colors">
                  {safeContact.phone || '+91 98765 43210'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9CA7AD]">
          <div className="text-center sm:text-left">
            {safeFooter.copyrightText || `© ${new Date().getFullYear()} Rishabh Sen. All rights reserved.`}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => setModalType('privacy')}
              className="min-h-[44px] py-2 px-1 hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setModalType('terms')}
              className="min-h-[44px] py-2 px-1 hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="min-h-[44px] py-2 px-1 hover:text-[#65E6EA] flex items-center gap-1 transition-colors cursor-pointer"
                title="Admin Login"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>CMS Admin</span>
              </button>
            )}
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl bg-[#12181C] border border-white/10 hover:border-[#65E6EA] hover:text-white transition-all cursor-pointer active:scale-95"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Absolute Bottom Design Credit */}
        <div className="mt-8 pt-6 pb-2 border-t border-white/5 flex items-center justify-center">
          <a
            href="https://wa.me/message/MWKLGMHWBIIIA1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Design by DipVibe.S · 7880236703 (Opens WhatsApp conversation in new tab)"
            className="group relative inline-flex items-center justify-center gap-1.5 min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-[13px] font-sans-clean transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65E6EA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080B0D] hover:scale-[1.03] active:scale-[0.98] select-none text-center cursor-pointer animate-credit-reveal overflow-hidden shadow-sm"
          >
            {/* Ambient subtle cyan/purple glow background */}
            <span
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#65E6EA]/5 via-[#8B7CFF]/5 to-[#65E6EA]/5 opacity-60 group-hover:opacity-100 group-hover:from-[#65E6EA]/15 group-hover:via-[#8B7CFF]/15 group-hover:to-[#65E6EA]/15 transition-opacity duration-300 pointer-events-none blur-sm"
              aria-hidden="true"
            />

            {/* Subtle glass border */}
            <span
              className="absolute inset-0 rounded-xl border border-white/5 group-hover:border-[#65E6EA]/30 transition-colors duration-300 pointer-events-none"
              aria-hidden="true"
            />

            {/* Smooth animated light sweep shimmer across the credit on hover */}
            <span
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none rounded-xl"
              aria-hidden="true"
            />

            {/* Segment 1: "Design by" -> muted/light text */}
            <span className="relative z-10 text-[#9CA7AD] group-hover:text-white/90 transition-colors duration-200 font-light">
              Design by
            </span>

            {/* Segment 2: "DipVibe.S" -> cyan/purple premium accent */}
            <span className="relative z-10 font-bold bg-gradient-to-r from-[#65E6EA] via-[#8B7CFF] to-[#C56CFF] bg-clip-text text-transparent group-hover:drop-shadow-[0_0_8px_rgba(101,230,234,0.6)] group-hover:scale-[1.02] transition-all duration-200 inline-block">
              DipVibe.S
            </span>

            {/* Separator dot */}
            <span className="relative z-10 text-[#9CA7AD]/60 font-medium">·</span>

            {/* Segment 3: "7880236703" -> clean white/muted text */}
            <span className="relative z-10 text-white/80 group-hover:text-white font-mono tracking-wider transition-colors duration-200">
              7880236703
            </span>

            {/* Thin animated gradient underline LEFT -> RIGHT underneath COMPLETE credit */}
            <span
              className="absolute bottom-1 left-4 right-4 h-[1.5px] bg-gradient-to-r from-[#65E6EA] via-[#8B7CFF] to-[#C56CFF] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out pointer-events-none shadow-[0_0_6px_#65E6EA]"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>

      {/* Legal Modals */}
      {modalType && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-fadeIn"
          onClick={() => setModalType(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#12181C] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0D1215]">
              <h3 className="text-xl font-display font-bold text-white">
                {modalType === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1.5 text-[#9CA7AD] hover:text-white rounded-lg border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#9CA7AD] leading-relaxed">
              {modalType === 'privacy' ? (
                <>
                  <p>
                    At Atelier Rishabh Sen, we maintain utmost confidentiality regarding client imagery, private venues, and personal contact inquiries.
                  </p>
                  <p>
                    Information collected via booking inquiries (including name, email, dates, and locations) is exclusively utilized to deliver bespoke photography and cinematography services. We never sell, lease, or distribute private client data to third parties.
                  </p>
                  <p>
                    High-resolution photographs and film master files are archived on encrypted off-site RAID storage vaults to safeguard intellectual property.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    All cinematographic films, teaser cuts, editorial photographs, and master color grades produced by Rishabh Sen remain protected by international copyright laws.
                  </p>
                  <p>
                    Commission dates are secured solely upon execution of a formal production agreement and receipt of the requisite retainer deposit.
                  </p>
                  <p>
                    Licensing rights granted to clients encompass private, non-commercial heirloom exhibition unless commercial editorial buyout terms are specified in the commission contract.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
