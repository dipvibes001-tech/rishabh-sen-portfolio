import React from 'react';
import { Instagram, Youtube, Facebook, ArrowUpRight, Sparkles, Radio } from 'lucide-react';
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
    instagram: 'https://instagram.com/rishabhsen_films',
    youtube: 'https://youtube.com/@rishabhsen_cinema',
    facebook: 'https://facebook.com/rishabhsenvisuals',
  };

  const socials = [
    {
      name: 'Instagram',
      handle: '@rishabhsen_films',
      description: 'Daily backstage reels, lighting breakdowns & cinema stills.',
      icon: Instagram,
      url: safeContact.instagram || 'https://instagram.com',
      followers: '85K+',
      accentColor: '#E1306C',
      glowColor: 'rgba(225, 48, 108, 0.25)',
      badgeGlow: 'border-pink-500/30 text-pink-400',
    },
    {
      name: 'YouTube',
      handle: 'Rishabh Sen Cinema',
      description: '4K heirloom wedding films, gear talk & color grading breakdowns.',
      icon: Youtube,
      url: safeContact.youtube || 'https://youtube.com',
      followers: '120K+',
      accentColor: '#FF0000',
      glowColor: 'rgba(255, 0, 0, 0.25)',
      badgeGlow: 'border-red-500/30 text-red-400',
    },
    {
      name: 'Facebook',
      handle: 'Rishabh Sen Visuals',
      description: 'Full ceremony albums, venue spotlight galleries & press features.',
      icon: Facebook,
      url: safeContact.facebook || 'https://facebook.com',
      followers: '45K+',
      accentColor: '#1877F2',
      glowColor: 'rgba(24, 119, 242, 0.25)',
      badgeGlow: 'border-blue-500/30 text-blue-400',
    },
  ];

  return (
    <section id="social" className="py-20 sm:py-28 lg:py-32 bg-[#080B0D] relative border-t border-white/10 z-10 overflow-hidden">
      {/* Background Cinematic Atmosphere */}
      <div className="absolute top-1/3 left-10 w-[450px] h-[450px] bg-[#65E6EA]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#8B7CFF]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Connect & Follow */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12181C] border border-[#65E6EA]/30 text-xs font-semibold tracking-wider text-[#65E6EA] uppercase shadow-[0_0_15px_rgba(101,230,234,0.15)] backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" />
              <span>07. Digital Channels</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight uppercase leading-tight">
              Connect & <span className="bg-gradient-to-r from-[#65E6EA] via-[#8B7CFF] to-[#C56CFF] bg-clip-text text-transparent">Follow</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#9CA7AD] font-light max-w-md leading-relaxed">
            Experience our latest cinematic reels, color studies, and private showcases in real-time across social channels.
          </p>
        </div>

        {/* 3D Social Media Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {socials.map((soc) => {
            const Icon = soc.icon;
            return (
              <Card3D key={soc.name} maxTilt={9} glareOpacity={0.22}>
                <a
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block rounded-3xl p-7 sm:p-8 bg-gradient-to-b from-[#131A1F] via-[#0E1417] to-[#080B0D] border border-white/10 hover:border-white/25 shadow-2xl transition-all duration-300 flex flex-col justify-between h-full overflow-hidden active:scale-[0.99]"
                >
                  {/* Neon Glow Burst on Hover */}
                  <div
                    style={{ backgroundColor: soc.glowColor }}
                    className="absolute -top-14 -right-14 w-40 h-40 rounded-full blur-[65px] opacity-20 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
                  />

                  {/* Top: Icon + Pulsing Community Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#172127] border border-white/10 flex items-center justify-center p-3 text-white shadow-inner group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-7 h-7 transition-colors duration-300" style={{ color: soc.accentColor }} />
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono tracking-wider text-gray-300 group-hover:border-[#65E6EA]/30 transition-colors">
                        <Radio className="w-2.5 h-2.5 text-[#65E6EA] animate-pulse" />
                        <span>{soc.followers} Community</span>
                      </div>
                    </div>

                    {/* Middle: Name, Handle, Description */}
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide uppercase mb-1 group-hover:text-white transition-colors">
                      {soc.name}
                    </h3>

                    <div className="text-xs sm:text-sm font-mono text-[#65E6EA] font-medium tracking-tight mb-3">
                      {soc.handle}
                    </div>

                    <p className="text-xs sm:text-[13px] text-[#9CA7AD] font-light leading-relaxed">
                      {soc.description}
                    </p>
                  </div>

                  {/* Bottom: Visit Channel CTA */}
                  <div className="pt-5 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono font-bold tracking-widest text-[#65E6EA] uppercase group-hover:text-white transition-colors">
                    <span>Visit Channel</span>
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#65E6EA] group-hover:text-[#080B0D] group-hover:border-[#65E6EA] transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
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

export default SocialSection;
