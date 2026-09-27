import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Globe, Share2, Phone } from 'lucide-react';
import { SiteSettings } from '../../../types';
import { updateSiteSection } from '../../../services/api';

interface AdminSettingsTabProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({ settings, onRefresh }) => {
  const [subTab, setSubTab] = useState<'contact' | 'seo' | 'footer'>('contact');
  const [contactForm, setContactForm] = useState({ ...settings.contact });
  const [seoForm, setSeoForm] = useState({ ...settings.seo });
  const [footerForm, setFooterForm] = useState({ ...settings.footer });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const saveContact = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateSiteSection('contact', contactForm);
      setSuccess('Contact & social media details updated successfully.');
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update contact settings.');
    } finally {
      setSaving(false);
    }
  };

  const saveSeo = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateSiteSection('seo', seoForm);
      setSuccess('SEO and meta information saved successfully.');
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update SEO settings.');
    } finally {
      setSaving(false);
    }
  };

  const saveFooter = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateSiteSection('footer', footerForm);
      setSuccess('Footer details updated successfully.');
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update footer.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e1e2d] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-mono block mb-1">
            Global Configuration
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-[#F4F3ED]">
            Contact, SEO & Footer
          </h1>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#101017] rounded-xs border border-[#222233]">
          {(['contact', 'seo', 'footer'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setSubTab(tab);
                setSuccess(null);
                setError(null);
              }}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer ${
                subTab === tab
                  ? 'bg-[#E5C158] text-[#08080a] font-semibold'
                  : 'text-[#A1A1AA] hover:text-[#EDEBE4]'
              }`}
            >
              {tab === 'contact' ? 'Contact & Social' : tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xs flex items-center gap-2 text-emerald-300 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xs flex items-center gap-2 text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* CONTACT & SOCIAL */}
      {subTab === 'contact' && (
        <div className="bg-[#0b0b10] border border-[#1e1e2d] p-6 sm:p-8 rounded-xs space-y-6">
          <h3 className="text-lg font-display text-[#EDEBE4] border-b border-[#1b1b26] pb-3">
            Atelier Contact Details & Social Handles
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                  Public Email Address
                </label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                  Direct Phone Number
                </label>
                <input
                  type="text"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                  Studio Location
                </label>
                <input
                  type="text"
                  value={contactForm.location}
                  onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                  className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                  Working / Consultation Hours
                </label>
                <input
                  type="text"
                  value={contactForm.workingHours}
                  onChange={(e) => setContactForm({ ...contactForm, workingHours: e.target.value })}
                  className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-[#1b1b26] space-y-4">
              <h4 className="text-xs uppercase tracking-wider text-[#C5A059] font-medium">
                Social Media URLs
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-[#A1A1AA] uppercase block mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={contactForm.instagram}
                    onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                    className="w-full bg-[#12121b] border border-[#262638] px-4 py-2 text-xs text-[#EDEBE4] rounded-xs outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#A1A1AA] uppercase block mb-1">
                    YouTube Channel URL
                  </label>
                  <input
                    type="url"
                    value={contactForm.youtube}
                    onChange={(e) => setContactForm({ ...contactForm, youtube: e.target.value })}
                    className="w-full bg-[#12121b] border border-[#262638] px-4 py-2 text-xs text-[#EDEBE4] rounded-xs outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-[#A1A1AA] uppercase block mb-1">
                    Facebook Page URL
                  </label>
                  <input
                    type="url"
                    value={contactForm.facebook}
                    onChange={(e) => setContactForm({ ...contactForm, facebook: e.target.value })}
                    className="w-full bg-[#12121b] border border-[#262638] px-4 py-2 text-xs text-[#EDEBE4] rounded-xs outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#A1A1AA] uppercase block mb-1">
                    WhatsApp Direct Number
                  </label>
                  <input
                    type="text"
                    value={contactForm.whatsapp}
                    onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                    className="w-full bg-[#12121b] border border-[#262638] px-4 py-2 text-xs text-[#EDEBE4] rounded-xs outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={saveContact}
              disabled={saving}
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold bg-[#E5C158] hover:bg-[#F0D078] text-[#08080a] rounded-xs flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Contact Settings'}</span>
            </button>
          </div>
        </div>
      )}

      {/* SEO SETTINGS */}
      {subTab === 'seo' && (
        <div className="bg-[#0b0b10] border border-[#1e1e2d] p-6 sm:p-8 rounded-xs space-y-6">
          <h3 className="text-lg font-display text-[#EDEBE4] border-b border-[#1b1b26] pb-3">
            Search Engine Optimization (SEO) & Meta Data
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                Website Meta Title (Browser & Search Results)
              </label>
              <input
                type="text"
                value={seoForm.siteTitle}
                onChange={(e) => setSeoForm({ ...seoForm, siteTitle: e.target.value })}
                className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                Meta Description (120 - 160 characters)
              </label>
              <textarea
                rows={3}
                value={seoForm.metaDescription}
                onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-4 py-2 text-xs sm:text-sm text-[#EDEBE4] rounded-xs outline-hidden resize-none"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                Search Engine Keywords (Comma separated)
              </label>
              <input
                type="text"
                value={seoForm.keywords}
                onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                className="w-full bg-[#12121b] border border-[#262638] px-4 py-2 text-xs text-[#EDEBE4] rounded-xs outline-hidden font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={saveSeo}
              disabled={saving}
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold bg-[#E5C158] hover:bg-[#F0D078] text-[#08080a] rounded-xs flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save SEO Settings'}</span>
            </button>
          </div>
        </div>
      )}

      {/* FOOTER SETTINGS */}
      {subTab === 'footer' && (
        <div className="bg-[#0b0b10] border border-[#1e1e2d] p-6 sm:p-8 rounded-xs space-y-6">
          <h3 className="text-lg font-display text-[#EDEBE4] border-b border-[#1b1b26] pb-3">
            Website Footer & Legal Notice
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                Footer Brand Manifesto / Bio
              </label>
              <textarea
                rows={3}
                value={footerForm.bio}
                onChange={(e) => setFooterForm({ ...footerForm, bio: e.target.value })}
                className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                Copyright Notice
              </label>
              <input
                type="text"
                value={footerForm.copyrightText}
                onChange={(e) => setFooterForm({ ...footerForm, copyrightText: e.target.value })}
                className="w-full bg-[#12121b] border border-[#262638] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={saveFooter}
              disabled={saving}
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold bg-[#E5C158] hover:bg-[#F0D078] text-[#08080a] rounded-xs flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Footer Settings'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
