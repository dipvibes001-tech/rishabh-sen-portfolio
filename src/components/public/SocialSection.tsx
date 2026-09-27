import React from 'react';
import { Instagram, Youtube, Facebook, ArrowUpRight, Sparkles } from 'lucide-react';
import { SiteSettings } from '../../types';
import { Card3D } from '../common/Card3D';

interface SocialSectionProps {
  contact?: SiteSettings['contact'];
}

export const SocialSection: React.FC<SocialSectionProps> = ({ contact }) => {
  const safeContact = contact || {
    email: 'studio@rishabhsen.com',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    location: 'Mumbai & Worldwide',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    facebook: 'https://facebook.com',
  };

  const socials = [
    {
      name: 'Instagram',
      handle: '@rishabhsen_films',
      description: 'Daily backstage reels, lighting breakdowns & cinema stills.',
      icon: Instagram,
      url: safeContact.instagram || 'https://instagram.com',
      followers: '85K+',
      color: 'from-[#65E6EA] to-[#8B7CFF]',
    },
    {
      name: 'YouTube',
      handle: 'Rishabh Sen Cinema',
      description: '4K heirloom wedding films, gear talk & color grading breakdowns.',
      icon: Youtube,
      url: safeContact.youtube || 'https://youtube.com',
      followers: '120K+',
      color: 'from-[#8B7CFF] to-[#C56CFF]',
    },
    {
      name: 'Facebook',
      handle: 'Rishabh Sen Visuals',
      description: 'Full ceremony albums, venue spotlight galleries & press features.',
      icon: Facebook,
      url: safeContact.facebook || 'https://facebook.com',
      followers: '45K+',
      color: 'from-[#65E6EA] to-[#3B82F6]',
    },
  ];

  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-[#080B0D] relative border-t border-white/10 z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12181C] border border-[#65E6EA]/30 text-xs font-semibold tracking-wider text-[#65E6EA] uppercase mb-3 sm:mb-4 shadow-[0_0_15px_rgba(101,230,234,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" />
              <span>07. Digital Channels</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display leading-tight break-words">
              Connect & <span className="gradient-studio-text">Follow</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#9CA7AD] max-w-sm font-sans-clean font-light leading-relaxed">
            Experience our latest cinematic reels, color studies, and private showcases in real-time across social channels.
          </p>
        </div>

        {/* 3D Social Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {socials.map((soc) => {
            const Icon = soc.icon;
            return (
              <Card3D key={soc.name} maxTilt={8} glareOpacity={0.18}>
                <a
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#12181C] border border-white/10 hover:border-[#65E6EA]/40 p-6 sm:p-7 rounded-2xl transition-all duration-300 flex flex-col justify-between h-full shadow-xl active:scale-[0.99]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#0D1215] border border-white/10 flex items-center justify-center text-[#65E6EA] group-hover:scale-110 group-hover:text-white transition-all shadow-inner">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono text-[#9CA7AD]">{soc.followers} Community</span>
                    </div>

                    <h3 className="text-xl font-display font-bold text-white mb-1">
                      {soc.name}
                    </h3>
                    <div className="text-xs font-mono text-[#65E6EA] mb-3">
                      {soc.handle}
                    </div>
                    <p className="text-xs sm:text-sm text-[#9CA7AD] leading-relaxed font-sans-clean font-light">
                      {soc.description}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-white/5 flex items-center justify-between text-xs text-[#65E6EA] uppercase tracking-wider font-bold">
                    <span>Visit Channel</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
              </Card3D>
            );
          })}
        </div>
      </div>
    </section>
  );
};
