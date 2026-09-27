import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Star, CheckCircle2, AlertCircle, X, Save } from 'lucide-react';
import { TestimonialItem } from '../../../types';
import {
  fetchAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../../../services/api';

interface AdminTestimonialsTabProps {
  onRefresh?: () => void;
}

export const AdminTestimonialsTab: React.FC<AdminTestimonialsTabProps> = ({ onRefresh }) => {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<TestimonialItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminTestimonials();
      setTestimonials(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load testimonials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem({
      name: '',
      eventType: 'Destination Wedding',
      review: '',
      rating: 5,
      date: 'Recent',
      location: 'India',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tst: TestimonialItem) => {
    setEditingItem({ ...tst });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      setSuccess('Testimonial deleted.');
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete testimonial.');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name || !editingItem?.review) {
      setError('Client name and review text are required.');
      return;
    }

    try {
      if (editingItem.id) {
        const updated = await updateTestimonial(editingItem.id, editingItem);
        setTestimonials((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        setSuccess('Testimonial updated successfully.');
      } else {
        const created = await createTestimonial(editingItem);
        setTestimonials((prev) => [...prev, created]);
        setSuccess('Testimonial created successfully.');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save testimonial.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e1e2d] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-mono block mb-1">
            Social Proof
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-[#F4F3ED]">
            Testimonials Management
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 text-xs uppercase tracking-wider font-semibold bg-[#E5C158] hover:bg-[#F0D078] text-[#08080a] rounded-xs flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
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

      {/* Testimonials List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#71717A] animate-pulse">
          Loading testimonials...
        </div>
      ) : testimonials.length === 0 ? (
        <div className="p-8 text-center bg-[#0b0b10] border border-[#1e1e2d] rounded-xs text-[#71717A] text-sm">
          No testimonials yet. Click "Add Testimonial" above.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((tst) => (
            <div
              key={tst.id}
              className="bg-[#0b0b10] border border-[#1e1e2d] hover:border-[#C5A059]/40 p-6 rounded-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-[#E5C158]">
                    {Array.from({ length: tst.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#71717A] font-mono">{tst.date}</span>
                </div>

                <p className="text-xs sm:text-sm font-editorial italic text-[#D1CFCA] leading-relaxed mb-4">
                  "{tst.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#181824] flex items-center justify-between">
                <div>
                  <div className="text-sm font-display text-[#EDEBE4]">{tst.name}</div>
                  <div className="text-[11px] text-[#A1A1AA]">{tst.eventType} · {tst.location}</div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(tst)}
                    className="p-1.5 text-[#A1A1AA] hover:text-[#C5A059] hover:bg-[#161622] rounded-xs cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(tst.id)}
                    className="p-1.5 text-[#A1A1AA] hover:text-red-400 hover:bg-red-950/30 rounded-xs cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && editingItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#070709]/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#0c0c12] border border-[#272738] max-w-lg w-full p-6 sm:p-8 rounded-xs shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1e1e2d]">
              <h3 className="text-lg font-display text-[#EDEBE4]">
                {editingItem.id ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#A1A1AA] hover:text-[#EDEBE4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyanka & Arjun Singhal"
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-3 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                    Event / Occasion
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Wedding · Udaipur"
                    value={editingItem.eventType || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, eventType: e.target.value })}
                    className="w-full bg-[#12121b] border border-[#262638] px-3 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rajasthan, India"
                    value={editingItem.location || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    className="w-full bg-[#12121b] border border-[#262638] px-3 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                    Star Rating (1 - 5)
                  </label>
                  <select
                    value={editingItem.rating || 5}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                    className="w-full bg-[#12121b] border border-[#262638] px-3 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                  >
                    <option value="5">★★★★★ (5 Stars)</option>
                    <option value="4">★★★★☆ (4 Stars)</option>
                    <option value="3">★★★☆☆ (3 Stars)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                    Date Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. January 2026"
                    value={editingItem.date || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    className="w-full bg-[#12121b] border border-[#262638] px-3 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                  Review Text *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Paste the client's words and reflections..."
                  value={editingItem.review || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, review: e.target.value })}
                  className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-3 py-2 text-xs sm:text-sm text-[#EDEBE4] rounded-xs outline-hidden resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#1e1e2d]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-[#A1A1AA] hover:text-[#EDEBE4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs uppercase tracking-wider font-semibold bg-[#E5C158] hover:bg-[#F0D078] text-[#08080a] rounded-xs flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Testimonial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
