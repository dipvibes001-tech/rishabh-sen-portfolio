import React, { useState } from 'react';
import {
  Film as FilmIcon,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  Eye,
  EyeOff,
  Star,
  Clock,
  Play,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Film } from '../../../types';
import {
  createFilm,
  updateFilm,
  deleteFilm,
  reorderFilms,
} from '../../../services/api';

interface AdminFilmsTabProps {
  films: Film[];
  onRefresh: () => Promise<void>;
}

export const AdminFilmsTab: React.FC<AdminFilmsTabProps> = ({ films, onRefresh }) => {
  const [editingFilm, setEditingFilm] = useState<Partial<Film> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewFilm, setPreviewFilm] = useState<Film | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const categories = [
    'Wedding Films',
    'Pre-Wedding Cinema',
    'Teasers & Highlights',
    'Commercial Films',
    'Fashion Films',
    'Short Films & Documentaries',
    'Drone & Aerial Reels',
  ];

  const normalizedSearch = String(search || '').toLowerCase().trim();
  const safeFilms = Array.isArray(films) ? films.filter(Boolean) : [];

  const filteredFilms = safeFilms.filter(
    (f) => {
      if (!f) return false;
      if (!normalizedSearch) return true;
      return (
        String(f.title || '').toLowerCase().trim().includes(normalizedSearch) ||
        String(f.category || '').toLowerCase().trim().includes(normalizedSearch) ||
        String(f.clientName || '').toLowerCase().trim().includes(normalizedSearch)
      );
    }
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFilm?.title || !editingFilm?.youtubeUrl) {
      setStatusMsg({ type: 'error', text: 'Film title and YouTube URL are required.' });
      return;
    }

    setLoading(true);
    setStatusMsg(null);
    try {
      if (isCreating) {
        await createFilm(editingFilm);
        setStatusMsg({ type: 'success', text: 'Film added to showcase successfully.' });
      } else if (editingFilm.id) {
        await updateFilm(editingFilm.id, editingFilm);
        setStatusMsg({ type: 'success', text: 'Film details updated successfully.' });
      }
      setIsCreating(false);
      setEditingFilm(null);
      await onRefresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save film.';
      setStatusMsg({ type: 'error', text: message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the film "${title}"?`)) return;

    setLoading(true);
    try {
      await deleteFilm(id);
      setStatusMsg({ type: 'success', text: 'Film deleted successfully.' });
      await onRefresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete film.';
      setStatusMsg({ type: 'error', text: message });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublished = async (film: Film) => {
    try {
      await updateFilm(film.id, { published: !film.published });
      await onRefresh();
    } catch {
      setStatusMsg({ type: 'error', text: 'Failed to toggle published status.' });
    }
  };

  const handleToggleFeatured = async (film: Film) => {
    try {
      await updateFilm(film.id, { featured: !film.featured });
      await onRefresh();
    } catch {
      setStatusMsg({ type: 'error', text: 'Failed to toggle featured status.' });
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= films.length) return;

    const reordered = [...films];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const items = reordered.map((f, i) => ({ id: f.id, order: i + 1 }));
    try {
      await reorderFilms(items);
      await onRefresh();
    } catch {
      setStatusMsg({ type: 'error', text: 'Failed to update order.' });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white font-display flex items-center gap-3">
            <FilmIcon className="w-6 h-6 text-[#65E6EA]" />
            <span>Films & Cinematography Manager</span>
          </h2>
          <p className="text-sm text-[#9CA7AD] mt-1">
            Manage your 4K video showcase, YouTube embeds, featured films, and category tags.
          </p>
        </div>

        <button
          onClick={() => {
            setIsCreating(true);
            setEditingFilm({
              title: '',
              youtubeUrl: '',
              category: 'Wedding Films',
              duration: '',
              clientName: '',
              description: '',
              featured: false,
              published: true,
            });
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#65E6EA] to-[#8B7CFF] text-[#080B0D] font-bold text-sm shadow-[0_0_20px_rgba(101,230,234,0.3)] hover:opacity-95 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Film</span>
        </button>
      </div>

      {/* Status feedback */}
      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between border ${
            statusMsg.type === 'success'
              ? 'bg-[#65E6EA]/10 border-[#65E6EA]/30 text-[#65E6EA]'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="p-1 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#12181C] p-4 rounded-xl border border-white/5">
        <input
          type="text"
          placeholder="Search films by title, client, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 rounded-lg bg-[#080B0D] border border-white/10 text-white text-sm placeholder-[#9CA7AD]/60 focus:outline-none focus:border-[#65E6EA]"
        />

        <div className="flex items-center gap-6 text-xs text-[#9CA7AD] w-full sm:w-auto justify-end">
          <div>
            Total: <span className="font-semibold text-white">{films.length}</span>
          </div>
          <div>
            Published:{' '}
            <span className="font-semibold text-[#65E6EA]">
              {films.filter((f) => f.published).length}
            </span>
          </div>
          <div>
            Featured:{' '}
            <span className="font-semibold text-[#8B7CFF]">
              {films.filter((f) => f.featured).length}
            </span>
          </div>
        </div>
      </div>

      {/* Films List */}
      <div className="space-y-4">
        {filteredFilms.length === 0 ? (
          <div className="text-center py-16 bg-[#12181C] rounded-2xl border border-dashed border-white/10">
            <FilmIcon className="w-12 h-12 text-[#9CA7AD]/40 mx-auto mb-3" />
            <p className="text-white font-medium">No films found</p>
            <p className="text-xs text-[#9CA7AD] mt-1">
              Add your first cinema reel or film by clicking &quot;Add New Film&quot;.
            </p>
          </div>
        ) : (
          filteredFilms.map((film, index) => (
            <div
              key={film.id}
              className={`p-4 rounded-2xl bg-[#12181C] border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                film.published ? 'border-white/10 hover:border-[#65E6EA]/30' : 'border-white/5 opacity-60'
              }`}
            >
              {/* Left: Thumbnail & Info */}
              <div className="flex items-start sm:items-center gap-4">
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-1 text-[#9CA7AD]">
                  <button
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    className="p-1 rounded hover:bg-white/5 disabled:opacity-20 hover:text-white"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={index === films.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="p-1 rounded hover:bg-white/5 disabled:opacity-20 hover:text-white"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Thumbnail with quick play preview trigger */}
                <div
                  onClick={() => setPreviewFilm(film)}
                  className="relative w-28 sm:w-36 aspect-video rounded-lg overflow-hidden bg-[#0D1215] shrink-0 cursor-pointer group border border-white/10"
                >
                  <img
                    src={film.thumbnail}
                    alt={film.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                    <Play className="w-5 h-5 text-[#65E6EA] fill-[#65E6EA]" />
                  </div>
                </div>

                {/* Title & Metadata */}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#65E6EA]/15 text-[#65E6EA] border border-[#65E6EA]/30">
                      {film.category}
                    </span>
                    {film.featured && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#8B7CFF]/15 text-[#8B7CFF] border border-[#8B7CFF]/30 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#8B7CFF]" /> Featured
                      </span>
                    )}
                    {film.duration && (
                      <span className="text-xs text-[#9CA7AD] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {film.duration}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white mt-1 font-display">
                    {film.title}
                  </h4>

                  {film.clientName && (
                    <p className="text-xs text-[#9CA7AD] mt-0.5">
                      Client: <span className="text-white/80">{film.clientName}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 justify-end pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                {/* Featured toggle */}
                <button
                  onClick={() => handleToggleFeatured(film)}
                  title={film.featured ? 'Remove from featured spotlight' : 'Make featured spotlight'}
                  className={`p-2 rounded-lg border transition-colors ${
                    film.featured
                      ? 'bg-[#8B7CFF]/20 border-[#8B7CFF]/50 text-[#8B7CFF]'
                      : 'bg-white/5 border-white/10 text-[#9CA7AD] hover:text-white'
                  }`}
                >
                  <Star className={`w-4 h-4 ${film.featured ? 'fill-[#8B7CFF]' : ''}`} />
                </button>

                {/* Published toggle */}
                <button
                  onClick={() => handleTogglePublished(film)}
                  title={film.published ? 'Unpublish film' : 'Publish film'}
                  className={`p-2 rounded-lg border transition-colors ${
                    film.published
                      ? 'bg-[#65E6EA]/20 border-[#65E6EA]/50 text-[#65E6EA]'
                      : 'bg-white/5 border-white/10 text-[#9CA7AD] hover:text-white'
                  }`}
                >
                  {film.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Edit */}
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingFilm(film);
                  }}
                  title="Edit film"
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#9CA7AD] hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(film.id, film.title)}
                  title="Delete film"
                  className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      {(isCreating || editingFilm) && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        >
          <div
            className="w-full max-w-2xl bg-[#12181C] border border-white/15 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0D1215]">
              <h3 className="text-lg font-bold text-white font-display">
                {isCreating ? 'Add New Film / Video' : 'Edit Film Details'}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingFilm(null);
                }}
                className="p-1 rounded-lg text-[#9CA7AD] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                  Film Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Royal Udaipur Affair"
                  value={editingFilm?.title || ''}
                  onChange={(e) => setEditingFilm({ ...editingFilm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080B0D] border border-white/10 text-white text-sm focus:outline-none focus:border-[#65E6EA]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                  YouTube URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  value={editingFilm?.youtubeUrl || ''}
                  onChange={(e) => setEditingFilm({ ...editingFilm, youtubeUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080B0D] border border-white/10 text-white text-sm focus:outline-none focus:border-[#65E6EA]"
                />
                <p className="text-[11px] text-[#9CA7AD] mt-1">
                  The video ID is automatically extracted and thumbnail will be auto-generated if left blank.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={editingFilm?.category || 'Wedding Films'}
                    onChange={(e) => setEditingFilm({ ...editingFilm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080B0D] border border-white/10 text-white text-sm focus:outline-none focus:border-[#65E6EA]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-[#12181C] text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Duration (e.g. 04:32)
                  </label>
                  <input
                    type="text"
                    placeholder="04:15"
                    value={editingFilm?.duration || ''}
                    onChange={(e) => setEditingFilm({ ...editingFilm, duration: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080B0D] border border-white/10 text-white text-sm focus:outline-none focus:border-[#65E6EA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Client Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kabir & Rhea"
                    value={editingFilm?.clientName || ''}
                    onChange={(e) => setEditingFilm({ ...editingFilm, clientName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080B0D] border border-white/10 text-white text-sm focus:outline-none focus:border-[#65E6EA]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Custom Thumbnail URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Leave empty for auto YouTube thumbnail"
                    value={editingFilm?.thumbnail || ''}
                    onChange={(e) => setEditingFilm({ ...editingFilm, thumbnail: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080B0D] border border-white/10 text-white text-sm focus:outline-none focus:border-[#65E6EA]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                  Film Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Cinematic overview, lenses used, atmosphere..."
                  value={editingFilm?.description || ''}
                  onChange={(e) => setEditingFilm({ ...editingFilm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080B0D] border border-white/10 text-white text-sm focus:outline-none focus:border-[#65E6EA]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-white">
                  <input
                    type="checkbox"
                    checked={editingFilm?.featured || false}
                    onChange={(e) => setEditingFilm({ ...editingFilm, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8B7CFF] bg-[#080B0D] border-white/20 focus:ring-0"
                  />
                  <span>Feature in Spotlight Banner</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm text-white">
                  <input
                    type="checkbox"
                    checked={editingFilm?.published !== false}
                    onChange={(e) => setEditingFilm({ ...editingFilm, published: e.target.checked })}
                    className="w-4 h-4 rounded text-[#65E6EA] bg-[#080B0D] border-white/20 focus:ring-0"
                  />
                  <span>Published on Public Site</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingFilm(null);
                  }}
                  className="px-4 py-2 rounded-xl text-sm text-[#9CA7AD] hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#65E6EA] to-[#8B7CFF] text-[#080B0D] font-bold text-sm shadow-[0_0_20px_rgba(101,230,234,0.3)] hover:opacity-95 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Film'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Preview Modal */}
      {previewFilm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setPreviewFilm(null)}
        >
          <div
            className="w-full max-w-4xl bg-[#12181C] border border-white/15 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0D1215]">
              <span className="text-sm font-bold text-white font-display">
                Preview: {previewFilm.title}
              </span>
              <button
                onClick={() => setPreviewFilm(null)}
                className="p-1 rounded text-[#9CA7AD] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${previewFilm.youtubeId}?autoplay=1`}
                title={previewFilm.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
