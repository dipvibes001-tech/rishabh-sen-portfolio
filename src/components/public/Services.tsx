import React, { useState } from 'react';
import {
  Camera,
  Film,
  Heart,
  Calendar,
  Sun,
  Briefcase,
  Sparkles,
  Clapperboard,
  ArrowRight,
  Check,
  X,
  ShieldCheck,
} from 'lucide-react';
import { ServiceItem } from '../../types';
import { Card3D } from '../common/Card3D';

interface ServicesProps {
  services: ServiceItem[];
  onSelectService?: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ services, onSelectService }) => {
  const [activePackage, setActivePackage] = useState<ServiceItem | null>(null);

  const getIcon = (iconName?: string) => {
    switch (String(iconName || '').toLowerCase().trim()) {
      case 'camera':
        return Camera;
      case 'film':
        return Film;
      case 'heart':
        return Heart;
      case 'calendar':
        return Calendar;
      case 'sun':
        return Sun;
      case 'briefcase':
        return Briefcase;
      case 'sparkles':
        return Sparkles;
      case 'clapperboard':
        return Clapperboard;
      default:
        return Camera;
    }
  };

  const getPackageDeliverables = (title?: string) => {
    const normalizedTitle = String(title || '').toLowerCase().trim();
    if (normalizedTitle.includes('wedding')) {
      return [
        'Master 4K Cinema Heirloom Film (10-15 mins)',
        'Cinematic 60-second Teaser for Socials',
        'Full Ceremony & Speeches Multi-Cam Document',
        'Licensed bespoke musical scoring & audio mastering',
        'Online private heirloom streaming gallery',
      ];
    }
    if (normalizedTitle.includes('cinematography') || normalizedTitle.includes('film')) {
      return [
        'Multi-angle 4K DCI anamorphic camera capture',
        'Drone aerial 4K HDR master reels',
        'Director of Photography + 2 Senior Cinematographers',
        'ARRI Log color grading and studio sound mixing',
        'Archival raw media drive delivery',
      ];
    }
    return [
      'Comprehensive high-resolution editorial delivery',
      'Artistic color curation & skin-tone retouching',
      'Location scouting & custom moodboard prep',
      'Commercial usage & exhibition licensing',
      'High-bandwidth digital archive download',
    ];
  };

  return (
    <section id="services" className="py-16 sm:py-24 lg:py-28 bg-[#080B0D] relative border-t border-white/10 z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12181C] border border-[#65E6EA]/30 text-xs font-semibold tracking-wider text-[#65E6EA] uppercase mb-3 sm:mb-4 shadow-[0_0_15px_rgba(101,230,234,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" />
              <span>02. Disciplines & Packages</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display leading-tight break-words">
              Bespoke <span className="gradient-studio-text">Services</span>
            </h2>
          </div>
          <p className="text-xs sm:text-base text-[#9CA7AD] max-w-md font-sans-clean font-light leading-relaxed">
            Tailored visual storytelling designed for luxury weddings, high-fashion editorials, commercial campaigns, and cinematic short films.
          </p>
        </div>

        {/* Services Grid with 3D Mouse Tilt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {(Array.isArray(services) ? services : []).filter(Boolean).map((service, index) => {
            if (!service) return null;
            const Icon = getIcon(service.icon);
            return (
              <Card3D key={service.id || index} maxTilt={9} glareOpacity={0.16}>
                <div className="group relative bg-[#12181C] border border-white/10 hover:border-[#65E6EA]/50 p-5 sm:p-7 rounded-2xl transition-all duration-300 flex flex-col justify-between h-full shadow-lg">
                  {/* Top: Icon & Category Tag */}
                  <div>
                    <div className="flex items-center justify-between mb-5 sm:mb-6">
                      <div className="w-12 h-12 rounded-xl bg-[#0D1215] group-hover:bg-[#65E6EA]/15 border border-white/10 group-hover:border-[#65E6EA]/40 flex items-center justify-center transition-colors shadow-inner">
                        <Icon className="w-5 h-5 text-[#65E6EA] group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-[#9CA7AD] font-mono">
                        {service.tag || `0${index + 1}`}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold font-display text-white group-hover:text-[#65E6EA] transition-colors mb-2 sm:mb-3">
                      {service.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#9CA7AD] leading-relaxed font-sans-clean font-light mb-5 sm:mb-6">
                      {service.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <button
                      onClick={() => setActivePackage(service)}
                      className="w-full text-left text-xs text-[#9CA7AD] hover:text-white flex items-center justify-between transition-colors cursor-pointer py-1.5 min-h-[38px]"
                    >
                      <span className="underline decoration-white/20 underline-offset-4">View Package Deliverables</span>
                      <ArrowRight className="w-3 h-3 text-[#8B7CFF]" />
                    </button>

                    <a
                      href="#contact"
                      onClick={() => onSelectService && onSelectService(service.title)}
                      className="inline-flex items-center justify-between w-full min-h-[44px] text-xs uppercase tracking-[0.16em] text-[#65E6EA] hover:text-white transition-colors font-bold pt-1"
                    >
                      <span>Inquire Availability</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </Card3D>
            );
          })}
        </div>
      </div>

      {/* 5. Service Details / Package Deliverables Modal */}
      {activePackage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setActivePackage(null)}
        >
          <div
            className="relative max-w-xl w-full bg-[#12181C] border border-white/15 rounded-2xl overflow-hidden shadow-2xl p-5 sm:p-8 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="pr-3 min-w-0">
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#65E6EA] font-semibold">
                  Package Deliverables
                </span>
                <h3 className="text-lg sm:text-xl font-display font-bold text-white mt-1 truncate">
                  {activePackage.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePackage(null)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-[#9CA7AD] hover:text-white rounded-xl border border-white/10 shrink-0 cursor-pointer"
                aria-label="Close package details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 sm:py-6 space-y-4">
              <p className="text-xs sm:text-sm text-[#9CA7AD] leading-relaxed">
                {activePackage.description}
              </p>

              <div className="space-y-2.5 pt-2">
                <span className="text-xs uppercase tracking-wider text-white font-semibold block">
                  Included in Commission:
                </span>
                {getPackageDeliverables(activePackage.title).map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-white/90">
                    <Check className="w-4 h-4 text-[#65E6EA] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-[#9CA7AD]">Custom add-ons available upon inquiry</span>
              <a
                href="#contact"
                onClick={() => {
                  onSelectService && onSelectService(activePackage.title);
                  setActivePackage(null);
                }}
                className="min-h-[44px] px-5 py-2.5 text-xs uppercase tracking-wider font-bold text-[#080B0D] bg-gradient-to-r from-[#65E6EA] to-[#8B7CFF] rounded-xl hover:opacity-95 shadow-md flex items-center justify-center active:scale-[0.98]"
              >
                Book Package
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
