import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Upload, Film, Sparkles, User } from 'lucide-react';
import { SiteSettings } from '../../../types';
import { updateSiteSection, uploadImage } from '../../../services/api';

interface AdminContentTabProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export const AdminContentTab: React.FC<AdminContentTabProps> = ({ settings, onRefresh }) => {
  const [activeSection, setActiveSection] = useState<'about' | 'highlights' | 'featuredStory' | 'hero'>('about');
  const [heroForm, setHeroForm] = useState({ ...settings.hero });
  const [aboutForm, setAboutForm] = useState({ ...settings.about });
  const [highlightsForm, setHighlightsForm] = useState([...settings.highlights]);
  const [storyForm, setStoryForm] = useState({ ...settings.featuredStory });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // File upload for hero background or about portrait or story
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'heroBg' | 'aboutPortrait' | 'storyImage'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUri = reader.result as string;
      try {
        const res = await uploadImage(dataUri, file.name);
        if (target === 'heroBg') {
          setHeroForm((prev) => ({ ...prev, backgroundImageUrl: res.fileUrl }));
        } else if (target === 'aboutPortrait') {
          setAboutForm((prev) => ({ ...prev, portraitUrl: res.fileUrl }));
        } else if (target === 'storyImage') {
          setStoryForm((prev) => ({ ...prev, imageUrl: res.fileUrl }));
        }
        setSuccess('Image uploaded successfully! Remember to click Save.');
      } catch (err: any) {
        setError(err.message || 'Image upload failed.');
      }
    };
    reader.readAsDataURL(file);
  };

  const saveHero = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateSiteSection('hero', heroForm);
      setSuccess('Hero section settings saved successfully.');
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save Hero section.');
    } finally {
      setSaving(false);
    }
  };

  const saveAbout = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateSiteSection('about', aboutForm);
      setSuccess('About section settings saved successfully.');
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save About section.');
    } finally {
      setSaving(false);
    }
  };

  const saveHighlights = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateSiteSection('highlights', highlightsForm);
      setSuccess('Highlights saved successfully.');
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save highlights.');
    } finally {
      setSaving(false);
    }
  };

  const saveStory = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateSiteSection('featuredStory', storyForm);
      setSuccess('Featured story saved successfully.');
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save featured story.');
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
            Visual Storytelling
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-[#F4F3ED]">
            Website Content Editor
          </h1>
        </div>

        {/* Section switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#101017] rounded-xs border border-[#222233]">
          {(['about', 'highlights', 'featuredStory'] as const).map((sec) => (
            <button
              key={sec}
              onClick={() => {
                setActiveSection(sec);
                setSuccess(null);
                setError(null);
              }}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer ${
                activeSection === sec
                  ? 'bg-[#65E6EA] text-[#080B0D] font-bold shadow-[0_0_15px_rgba(101,230,234,0.3)]'
                  : 'text-[#9CA7AD] hover:text-white'
              }`}
            >
              {sec === 'featuredStory' ? 'Featured Story' : sec === 'about' ? 'About Story' : 'Highlights'}
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

      {/* HERO SECTION FORM */}
      {activeSection === 'hero' && (
        <div className="bg-[#0b0b10] border border-[#1e1e2d] p-6 sm:p-8 rounded-xs space-y-6">
          <h3 className="text-lg font-display text-[#EDEBE4] border-b border-[#1b1b26] pb-3">
            Hero Headline & Tagline
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                Sub-Headline / Positioning
              </label>
              <input
                type="text"
                value={heroForm.subheadline}
                onChange={(e) => setHeroForm({ ...heroForm, subheadline: e.target.value })}
                className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-4 py-2.5 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                Main Dramatic Headline
              </label>
              <input
                type="text"
                value={heroForm.headline}
                onChange={(e) => setHeroForm({ ...heroForm, headline: e.target.value })}
                className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-4 py-2.5 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                Cinematic Tagline / Statement
              </label>
              <textarea
                rows={3}
                value={heroForm.tagline}
                onChange={(e) => setHeroForm({ ...heroForm, tagline: e.target.value })}
                className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-4 py-2.5 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                  Primary CTA Text
                </label>
                <input
                  type="text"
                  value={heroForm.primaryCtaText}
                  onChange={(e) => setHeroForm({ ...heroForm, primaryCtaText: e.target.value })}
                  className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                  Secondary CTA Text
                </label>
                <input
                  type="text"
                  value={heroForm.secondaryCtaText}
                  onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaText: e.target.value })}
                  className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                />
              </div>
            </div>

            {/* Custom Background Image upload */}
            <div className="pt-4 border-t border-[#1b1b26]">
              <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-2">
                Custom Hero Background Photo (Optional)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="URL or uploaded path (/uploads/...)"
                  value={heroForm.backgroundImageUrl}
                  onChange={(e) => setHeroForm({ ...heroForm, backgroundImageUrl: e.target.value })}
                  className="flex-1 bg-[#12121b] border border-[#262638] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                />
                <label className="px-4 py-2 bg-[#1c1c28] hover:bg-[#252536] text-[#C5A059] border border-[#2b2b3d] text-xs uppercase tracking-wider rounded-xs cursor-pointer flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'heroBg')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={saveHero}
              disabled={saving}
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold bg-[#E5C158] hover:bg-[#F0D078] text-[#08080a] rounded-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Hero Settings'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ABOUT SECTION FORM */}
      {activeSection === 'about' && (
        <div className="bg-[#0b0b10] border border-[#1e1e2d] p-6 sm:p-8 rounded-xs space-y-6">
          <h3 className="text-lg font-display text-[#EDEBE4] border-b border-[#1b1b26] pb-3">
            About Rishabh Sen & Narrative Philosophy
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                  Artist Full Name
                </label>
                <input
                  type="text"
                  value={aboutForm.name}
                  onChange={(e) => setAboutForm({ ...aboutForm, name: e.target.value })}
                  className="w-full bg-[#12121b] border border-[#262638] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                  Role Title
                </label>
                <input
                  type="text"
                  value={aboutForm.role}
                  onChange={(e) => setAboutForm({ ...aboutForm, role: e.target.value })}
                  className="w-full bg-[#12121b] border border-[#262638] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                Introductory Statement
              </label>
              <input
                type="text"
                value={aboutForm.introduction}
                onChange={(e) => setAboutForm({ ...aboutForm, introduction: e.target.value })}
                className="w-full bg-[#12121b] border border-[#262638] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                Personal Artistic Story & Background
              </label>
              <textarea
                rows={4}
                value={aboutForm.story}
                onChange={(e) => setAboutForm({ ...aboutForm, story: e.target.value })}
                className="w-full bg-[#12121b] border border-[#262638] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                Creative Philosophy
              </label>
              <textarea
                rows={3}
                value={aboutForm.philosophy}
                onChange={(e) => setAboutForm({ ...aboutForm, philosophy: e.target.value })}
                className="w-full bg-[#12121b] border border-[#262638] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
              />
            </div>

            {/* Portrait Image */}
            <div className="pt-2">
              <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-2">
                Photographer Portrait Photo
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="URL or uploaded path (/uploads/...)"
                  value={aboutForm.portraitUrl}
                  onChange={(e) => setAboutForm({ ...aboutForm, portraitUrl: e.target.value })}
                  className="flex-1 bg-[#12121b] border border-[#262638] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                />
                <label className="px-4 py-2 bg-[#1c1c28] hover:bg-[#252536] text-[#C5A059] border border-[#2b2b3d] text-xs uppercase tracking-wider rounded-xs cursor-pointer flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Portrait</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'aboutPortrait')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Animated Statistics Editor */}
            <div className="pt-4 border-t border-[#1b1b26]">
              <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-3">
                Key Achievement Metrics (4 Stats)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(aboutForm.stats || []).map((st, i) => (
                  <div key={i} className="p-3 bg-[#111118] border border-[#20202e] rounded-xs space-y-2">
                    <input
                      type="text"
                      placeholder="Label (e.g. Years Experience)"
                      value={st.label}
                      onChange={(e) => {
                        const updated = [...aboutForm.stats];
                        updated[i].label = e.target.value;
                        setAboutForm({ ...aboutForm, stats: updated });
                      }}
                      className="w-full bg-[#181824] px-3 py-1.5 text-xs text-[#EDEBE4] rounded-xs outline-hidden"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Value (e.g. 11)"
                        value={st.value}
                        onChange={(e) => {
                          const updated = [...aboutForm.stats];
                          updated[i].value = e.target.value;
                          setAboutForm({ ...aboutForm, stats: updated });
                        }}
                        className="bg-[#181824] px-3 py-1.5 text-xs text-[#EDEBE4] rounded-xs outline-hidden font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Suffix (e.g. +)"
                        value={st.suffix}
                        onChange={(e) => {
                          const updated = [...aboutForm.stats];
                          updated[i].suffix = e.target.value;
                          setAboutForm({ ...aboutForm, stats: updated });
                        }}
                        className="bg-[#181824] px-3 py-1.5 text-xs text-[#EDEBE4] rounded-xs outline-hidden"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={saveAbout}
              disabled={saving}
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold bg-[#E5C158] hover:bg-[#F0D078] text-[#08080a] rounded-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save About Settings'}</span>
            </button>
          </div>
        </div>
      )}

      {/* HIGHLIGHTS FORM */}
      {activeSection === 'highlights' && (
        <div className="bg-[#0b0b10] border border-[#1e1e2d] p-6 sm:p-8 rounded-xs space-y-6">
          <h3 className="text-lg font-display text-[#EDEBE4] border-b border-[#1b1b26] pb-3">
            Three Highlights: Storytelling, Sound & Music, Attention to Detail
          </h3>

          <div className="space-y-6">
            {highlightsForm.map((hl, i) => (
              <div key={hl.id || i} className="p-5 bg-[#101016] border border-[#1f1f2e] rounded-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono text-[#C5A059]">
                    Highlight 0{i + 1}
                  </span>
                  <input
                    type="text"
                    placeholder="Icon (Film, Volume2, Sparkles)"
                    value={hl.icon}
                    onChange={(e) => {
                      const updated = [...highlightsForm];
                      updated[i].icon = e.target.value;
                      setHighlightsForm(updated);
                    }}
                    className="bg-[#181824] px-3 py-1 text-xs text-[#EDEBE4] rounded-xs outline-hidden font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-[#A1A1AA] uppercase block mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={hl.title}
                      onChange={(e) => {
                        const updated = [...highlightsForm];
                        updated[i].title = e.target.value;
                        setHighlightsForm(updated);
                      }}
                      className="w-full bg-[#181824] px-3 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#A1A1AA] uppercase block mb-1">
                      Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      value={hl.subtitle}
                      onChange={(e) => {
                        const updated = [...highlightsForm];
                        updated[i].subtitle = e.target.value;
                        setHighlightsForm(updated);
                      }}
                      className="w-full bg-[#181824] px-3 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#A1A1AA] uppercase block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={hl.description}
                    onChange={(e) => {
                      const updated = [...highlightsForm];
                      updated[i].description = e.target.value;
                      setHighlightsForm(updated);
                    }}
                    className="w-full bg-[#181824] px-3 py-2 text-xs sm:text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={saveHighlights}
              disabled={saving}
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold bg-[#E5C158] hover:bg-[#F0D078] text-[#08080a] rounded-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Highlights'}</span>
            </button>
          </div>
        </div>
      )}

      {/* FEATURED STORY FORM */}
      {activeSection === 'featuredStory' && (
        <div className="bg-[#0b0b10] border border-[#1e1e2d] p-6 sm:p-8 rounded-xs space-y-6">
          <h3 className="text-lg font-display text-[#EDEBE4] border-b border-[#1b1b26] pb-3">
            Cinematic Featured Story Showcase
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                  Story Title
                </label>
                <input
                  type="text"
                  value={storyForm.title}
                  onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                  className="w-full bg-[#12121b] border border-[#262638] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                  Location / Palace
                </label>
                <input
                  type="text"
                  value={storyForm.location}
                  onChange={(e) => setStoryForm({ ...storyForm, location: e.target.value })}
                  className="w-full bg-[#12121b] border border-[#262638] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={storyForm.subtitle}
                  onChange={(e) => setStoryForm({ ...storyForm, subtitle: e.target.value })}
                  className="w-full bg-[#12121b] border border-[#262638] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                  Film Duration / Optics Tag
                </label>
                <input
                  type="text"
                  value={storyForm.filmDuration || ''}
                  onChange={(e) => setStoryForm({ ...storyForm, filmDuration: e.target.value })}
                  className="w-full bg-[#12121b] border border-[#262638] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                Summary Description
              </label>
              <textarea
                rows={3}
                value={storyForm.description}
                onChange={(e) => setStoryForm({ ...storyForm, description: e.target.value })}
                className="w-full bg-[#12121b] border border-[#262638] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                Full Story In-Depth Text (Opened in Explore Modal)
              </label>
              <textarea
                rows={4}
                value={storyForm.fullStory}
                onChange={(e) => setStoryForm({ ...storyForm, fullStory: e.target.value })}
                className="w-full bg-[#12121b] border border-[#262638] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
              />
            </div>

            {/* Story Image upload */}
            <div className="pt-2">
              <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-2">
                Featured Cover Image
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="URL or uploaded path (/uploads/...)"
                  value={storyForm.imageUrl}
                  onChange={(e) => setStoryForm({ ...storyForm, imageUrl: e.target.value })}
                  className="flex-1 bg-[#12121b] border border-[#262638] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                />
                <label className="px-4 py-2 bg-[#1c1c28] hover:bg-[#252536] text-[#C5A059] border border-[#2b2b3d] text-xs uppercase tracking-wider rounded-xs cursor-pointer flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'storyImage')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={saveStory}
              disabled={saving}
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold bg-[#E5C158] hover:bg-[#F0D078] text-[#08080a] rounded-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Featured Story'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
