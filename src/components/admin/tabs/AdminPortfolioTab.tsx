import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Image as ImageIcon,
} from 'lucide-react';
import { PortfolioItem, PortfolioCategory } from '../../../types';
import {
  fetchAdminPortfolio,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  reorderPortfolio,
  uploadImage,
} from '../../../services/api';
import { CinematicImage } from '../../common/CinematicImage';

const CATEGORIES: PortfolioCategory[] = [
  'Weddings',
  'Pre-Weddings',
  'Cinematography',
  'Events',
  'Portraits',
  'Commercial',
];

interface AdminPortfolioTabProps {
  onRefresh?: () => void;
}

export const AdminPortfolioTab: React.FC<AdminPortfolioTabProps> = ({ onRefresh }) => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<PortfolioItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminPortfolio();
      setPortfolio(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load portfolio.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setImagePreview('');
    setEditingItem({
      title: '',
      category: 'Weddings',
      description: '',
      imageUrl: '',
      client: '',
      year: String(new Date().getFullYear()),
      aspect: 'landscape',
      featured: false,
      active: true,
      order: portfolio.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PortfolioItem) => {
    setImagePreview(item.imageUrl || '');
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Selected image exceeds the 10MB limit.');
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUri = reader.result as string;
      setImagePreview(dataUri);

      // Upload to server immediately
      setUploadingImage(true);
      setError(null);
      try {
        const res = await uploadImage(dataUri, file.name);
        setEditingItem((prev) => (prev ? { ...prev, imageUrl: res.fileUrl } : prev));
        setSuccess('Image uploaded and optimized successfully.');
      } catch (err: any) {
        setError(err.message || 'Upload failed.');
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleActive = async (item: PortfolioItem) => {
    try {
      await updatePortfolioItem(item.id, { active: !item.active });
      setPortfolio((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, active: !p.active } : p))
      );
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle active state.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this portfolio project permanently?')) return;
    try {
      await deletePortfolioItem(id);
      setPortfolio((prev) => prev.filter((p) => p.id !== id));
      setSuccess('Portfolio item deleted.');
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete portfolio item.');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= portfolio.length) return;

    const copy = [...portfolio];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    // Recalculate order numbers
    const updates = copy.map((item, idx) => ({ id: item.id, order: idx + 1 }));
    setPortfolio(copy.map((item, idx) => ({ ...item, order: idx + 1 })));

    try {
      await reorderPortfolio(updates);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to persist order.');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.category || !editingItem?.description) {
      setError('Title, category, and description are required.');
      return;
    }

    try {
      if (editingItem.id) {
        const updated = await updatePortfolioItem(editingItem.id, editingItem);
        setPortfolio((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setSuccess('Portfolio project saved successfully.');
      } else {
        const created = await createPortfolioItem(editingItem);
        setPortfolio((prev) => [...prev, created]);
        setSuccess('New portfolio project added.');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save portfolio project.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e1e2d] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-mono block mb-1">
            Media Archive
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-[#F4F3ED]">
            Portfolio Works
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 text-xs uppercase tracking-wider font-semibold bg-[#E5C158] hover:bg-[#F0D078] text-[#08080a] rounded-xs flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Portfolio Item</span>
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

      {/* Grid of Portfolio Works */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#71717A] animate-pulse">
          Loading portfolio works...
        </div>
      ) : portfolio.length === 0 ? (
        <div className="p-8 text-center bg-[#0b0b10] border border-[#1e1e2d] rounded-xs text-[#71717A] text-sm">
          No portfolio items yet. Click "Add Portfolio Item" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item, index) => (
            <div
              key={item.id}
              className="bg-[#0b0b10] border border-[#1e1e2d] hover:border-[#C5A059]/40 rounded-xs overflow-hidden flex flex-col justify-between group transition-colors"
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-[#07070a] overflow-hidden">
                <CinematicImage
                  src={item.imageUrl}
                  alt={item.title}
                  category={item.category}
                  title={item.title}
                  client={item.client}
                  className="w-full h-full"
                />

                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-xs bg-black/80 text-[#C5A059] border border-[#C5A059]/30">
                    {item.category}
                  </span>
                  {item.featured && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-xs bg-[#C5A059] text-black font-bold">
                      Featured
                    </span>
                  )}
                </div>

                {/* Move order buttons */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/80 p-1 rounded-xs border border-[#272738]">
                  <button
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    className="p-1 text-[#A1A1AA] hover:text-[#EDEBE4] disabled:opacity-30 cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={index === portfolio.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="p-1 text-[#A1A1AA] hover:text-[#EDEBE4] disabled:opacity-30 cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Info & Meta */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-display font-medium text-[#F4F3ED] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#8A8992] font-sans-clean line-clamp-2 mb-2">
                    {item.description}
                  </p>
                  <div className="text-[11px] text-[#A1A1AA] font-mono flex items-center gap-2">
                    <span>Client: {item.client || 'None'}</span>
                    <span>·</span>
                    <span>{item.year || '2026'}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="pt-3 border-t border-[#181824] flex items-center justify-between">
                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer ${
                      item.active
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {item.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{item.active ? 'Visible Live' : 'Hidden'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-[#A1A1AA] hover:text-[#C5A059] hover:bg-[#161622] rounded-xs cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-[#A1A1AA] hover:text-red-400 hover:bg-red-950/30 rounded-xs cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && editingItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#070709]/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#0c0c12] border border-[#272738] max-w-xl w-full p-6 sm:p-8 rounded-xs shadow-2xl space-y-5 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1e1e2d]">
              <h3 className="text-lg font-display text-[#EDEBE4]">
                {editingItem.id ? 'Edit Portfolio Work' : 'Add New Portfolio Work'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#A1A1AA] hover:text-[#EDEBE4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              {/* Image Preview & Upload */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block">
                  Project Image (Upload or URL)
                </label>
                
                {imagePreview ? (
                  <div className="relative h-44 bg-[#08080a] border border-[#262638] rounded-xs overflow-hidden mb-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setEditingItem({ ...editingItem, imageUrl: '' });
                      }}
                      className="absolute top-2 right-2 p-1 bg-black/80 text-white rounded-full hover:bg-red-900 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="h-32 border-2 border-dashed border-[#262638] rounded-xs flex flex-col items-center justify-center text-[#71717A] p-4 text-center">
                    <ImageIcon className="w-6 h-6 mb-1 text-[#C5A059]" />
                    <span className="text-xs">Drag and drop or choose file below</span>
                    <span className="text-[10px] text-[#52525B]">PNG, JPEG, WEBP up to 10MB</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Direct Image URL or uploaded path"
                    value={editingItem.imageUrl || ''}
                    onChange={(e) => {
                      setEditingItem({ ...editingItem, imageUrl: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    className="flex-1 bg-[#12121b] border border-[#262638] px-3 py-2 text-xs text-[#EDEBE4] rounded-xs outline-hidden"
                  />
                  <label className="px-4 py-2 bg-[#1c1c28] hover:bg-[#252536] text-[#C5A059] border border-[#2b2b3d] text-xs uppercase tracking-wider rounded-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Choose File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Palace of Mirrors"
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-3 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                    Category *
                  </label>
                  <select
                    value={editingItem.category || 'Weddings'}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value as PortfolioCategory,
                      })
                    }
                    className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-3 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Client & Year */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                    Client / Production
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aanya & Devendra"
                    value={editingItem.client || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, client: e.target.value })}
                    className="w-full bg-[#12121b] border border-[#262638] px-3 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    placeholder="2026"
                    value={editingItem.year || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                    className="w-full bg-[#12121b] border border-[#262638] px-3 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the mood, lighting, optics, and emotion..."
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-3 py-2 text-xs sm:text-sm text-[#EDEBE4] rounded-xs outline-hidden resize-none"
                />
              </div>

              {/* Featured & Active checkboxes */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-xs text-[#EDEBE4] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.featured || false}
                    onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                    className="w-4 h-4 rounded-xs accent-[#C5A059]"
                  />
                  <span>Mark as Featured (Expands in Bento Grid)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-[#EDEBE4] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.active !== false}
                    onChange={(e) => setEditingItem({ ...editingItem, active: e.target.checked })}
                    className="w-4 h-4 rounded-xs accent-[#C5A059]"
                  />
                  <span>Active Live</span>
                </label>
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
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
