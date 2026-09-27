import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, MessageSquare, Sparkles } from 'lucide-react';
import { SiteSettings } from '../../types';
import { submitEnquiry } from '../../services/api';
import { Card3D } from '../common/Card3D';

interface ContactSectionProps {
  contact?: SiteSettings['contact'];
  initialService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ contact, initialService = '' }) => {
  const safeContact = contact || {
    email: 'studio@rishabhsen.com',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    location: 'Mumbai & Worldwide',
    workingHours: 'Monday to Saturday: 10:00 AM – 7:00 PM IST',
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: initialService || 'Wedding Photography & Film',
    eventDate: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage('Please provide your name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setErrorMessage('Please describe your requirements (minimum 10 characters).');
      return;
    }

    setLoading(true);
    try {
      const res = await submitEnquiry(formData);
      setSuccessMessage(res.message || 'Your inquiry has been received. Rishabh Sen will personally review it.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: 'Wedding Photography & Film',
        eventDate: '',
        message: '',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit inquiry. Please try again.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 lg:py-28 bg-[#080B0D] relative border-t border-white/10 z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12181C] border border-[#65E6EA]/30 text-xs font-semibold tracking-wider text-[#65E6EA] uppercase mb-3 sm:mb-4 shadow-[0_0_15px_rgba(101,230,234,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" />
            <span>08. Commission A Work</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display leading-tight break-words">
            Book a <span className="gradient-studio-text">Session</span>
          </h2>
          <p className="text-xs sm:text-base text-[#9CA7AD] max-w-xl font-sans-clean font-light mt-2 sm:mt-3 leading-relaxed">
            We accept a limited number of destination weddings and cinematic commissions annually to ensure uncompromising artistic dedication.
          </p>
        </div>

        {/* Form and Contact Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left Column: Public Contact Form */}
          <div className="lg:col-span-7 bg-[#12181C] border border-white/10 p-5 sm:p-10 rounded-2xl shadow-xl">
            {successMessage ? (
              <div className="py-12 text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#65E6EA]/15 border border-[#65E6EA]/40 flex items-center justify-center mx-auto text-[#65E6EA] shadow-[0_0_25px_rgba(101,230,234,0.3)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white">
                  Inquiry Received
                </h3>
                <p className="text-sm text-[#9CA7AD] font-sans-clean max-w-md mx-auto leading-relaxed">
                  {successMessage}
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSuccessMessage(null)}
                    className="min-h-[44px] px-6 py-2.5 text-xs uppercase tracking-[0.18em] text-[#080B0D] bg-gradient-to-r from-[#65E6EA] to-[#8B7CFF] rounded-xl font-bold transition-opacity hover:opacity-90 shadow-md cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {errorMessage && (
                  <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center gap-3 text-red-300 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Name */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs uppercase tracking-wider text-white/80 block font-semibold">
                      Full Name <span className="text-[#65E6EA]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Rostova"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full min-h-[48px] bg-[#080B0D] border border-white/10 focus:border-[#65E6EA] px-4 py-3 text-base sm:text-sm text-white placeholder-[#9CA7AD]/50 rounded-xl outline-none transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs uppercase tracking-wider text-white/80 block font-semibold">
                      Email Address <span className="text-[#65E6EA]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="elena@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full min-h-[48px] bg-[#080B0D] border border-white/10 focus:border-[#65E6EA] px-4 py-3 text-base sm:text-sm text-white placeholder-[#9CA7AD]/50 rounded-xl outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Phone */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs uppercase tracking-wider text-white/80 block font-semibold">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full min-h-[48px] bg-[#080B0D] border border-white/10 focus:border-[#65E6EA] px-4 py-3 text-base sm:text-sm text-white placeholder-[#9CA7AD]/50 rounded-xl outline-none transition-colors"
                    />
                  </div>

                  {/* Event Date */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs uppercase tracking-wider text-white/80 block font-semibold">
                      Estimated Event Date
                    </label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full min-h-[48px] bg-[#080B0D] border border-white/10 focus:border-[#65E6EA] px-4 py-3 text-base sm:text-sm text-white rounded-xl outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Event Type */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs uppercase tracking-wider text-white/80 block font-semibold">
                    Type of Commission
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full min-h-[48px] bg-[#080B0D] border border-white/10 focus:border-[#65E6EA] px-4 py-3 text-base sm:text-sm text-white rounded-xl outline-none transition-colors cursor-pointer"
                  >
                    <option value="Wedding Photography & Film" className="bg-[#12181C]">Wedding Photography & Film</option>
                    <option value="Pre-Wedding Film & Shoot" className="bg-[#12181C]">Pre-Wedding Film & Shoot</option>
                    <option value="Cinematography Only" className="bg-[#12181C]">Cinematography Only</option>
                    <option value="Editorial Fashion Shoot" className="bg-[#12181C]">Editorial Fashion Shoot</option>
                    <option value="Commercial Campaign" className="bg-[#12181C]">Commercial Campaign</option>
                    <option value="Maternity Portraiture" className="bg-[#12181C]">Maternity Portraiture</option>
                    <option value="Short Film / Music Video" className="bg-[#12181C]">Short Film / Music Video</option>
                    <option value="Other Bespoke Commission" className="bg-[#12181C]">Other Bespoke Commission</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs uppercase tracking-wider text-white/80 block font-semibold">
                    Vision, Venues & Desired Scope <span className="text-[#65E6EA]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your celebration or production, locations, dates, and what draws you to our aesthetic..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#080B0D] border border-white/10 focus:border-[#65E6EA] px-4 py-3 text-base sm:text-sm text-white placeholder-[#9CA7AD]/50 rounded-xl outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full min-h-[50px] py-4 text-xs uppercase tracking-[0.2em] font-bold text-[#080B0D] bg-gradient-to-r from-[#65E6EA] via-[#8B7CFF] to-[#C56CFF] hover:opacity-95 disabled:opacity-50 transition-all rounded-xl shadow-[0_0_25px_rgba(101,230,234,0.3)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="animate-pulse">Transmitting Inquiry...</span>
                  ) : (
                    <>
                      <span>Transmit Official Inquiry</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Studio Information & Direct Channels */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            <Card3D maxTilt={6} glareOpacity={0.15}>
              <div className="p-8 bg-[#12181C] border border-white/10 rounded-2xl space-y-5 shadow-xl">
                <span className="text-xs uppercase tracking-[0.25em] text-[#65E6EA] font-bold block">
                  Studio Headquarters
                </span>
                <h3 className="text-2xl font-display font-bold text-white">
                  Atelier Rishabh Sen
                </h3>

                <div className="space-y-4 pt-2 text-sm text-[#9CA7AD] font-sans-clean font-light">
                  <div className="flex items-start gap-3.5">
                    <MapPin className="w-5 h-5 text-[#65E6EA] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white block font-semibold">Location</span>
                      <span>{safeContact.location}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Mail className="w-5 h-5 text-[#65E6EA] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white block font-semibold">Inquiries Email</span>
                      <a href={`mailto:${safeContact.email}`} className="hover:text-[#65E6EA] transition-colors">
                        {safeContact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Phone className="w-5 h-5 text-[#65E6EA] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white block font-semibold">Direct Telephone</span>
                      <a href={`tel:${safeContact.phone}`} className="hover:text-[#65E6EA] transition-colors">
                        {safeContact.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Consultation Hours & Direct WhatsApp Prompt */}
                <div className="pt-6 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#9CA7AD]">Consultation Hours</span>
                    <span className="font-mono text-[#65E6EA]">IST (UTC+5:30)</span>
                  </div>
                  <p className="text-xs text-[#9CA7AD] font-light">
                    {safeContact.workingHours || 'Monday to Saturday: 10:00 AM – 7:00 PM IST'}
                  </p>

                  <a
                    href={`https://wa.me/${safeContact.whatsapp?.replace(/[^0-9]/g, '') || '919876543210'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#65E6EA] border border-[#65E6EA]/30 hover:bg-[#65E6EA]/10 rounded-xl flex items-center justify-center gap-2 transition-colors mt-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Direct WhatsApp Concierge</span>
                  </a>
                </div>
              </div>
            </Card3D>

            {/* Quote of Integrity */}
            <div className="p-6 bg-[#0D1215] border-l-4 border-[#65E6EA] rounded-r-xl text-xs font-editorial italic text-[#9CA7AD] leading-relaxed">
              &ldquo;We believe your wedding film should feel like a timeless piece of cinema, not a predictable highlight reel.&rdquo;
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
