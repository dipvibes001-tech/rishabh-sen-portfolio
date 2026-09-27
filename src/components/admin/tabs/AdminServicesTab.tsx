import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Eye, EyeOff, X, Save } from 'lucide-react';
import { ServiceItem } from '../../../types';
import {
  fetchAdminServices,
  createService,
  updateService,
  deleteService,
} from '../../../services/api';

interface AdminServicesTabProps {
  onRefresh?: () => void;
}

export const AdminServicesTab: React.FC<AdminServicesTabProps> = ({ onRefresh }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<ServiceItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminServices();
      setServices(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem({
      title: '',
      description: '',
      icon: 'Camera',
      tag: 'Bespoke Package',
      active: true,
      order: services.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv: ServiceItem) => {
    setEditingItem({ ...srv });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (srv: ServiceItem) => {
    try {
      await updateService(srv.id, { active: !srv.active });
      setServices((prev) =>
        prev.map((s) => (s.id === srv.id ? { ...s, active: !s.active } : s))
      );
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle service.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this service?')) {
      return;
    }
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      setSuccess('Service deleted successfully.');
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete service.');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.description) {
      setError('Title and description are required.');
      return;
    }

    try {
      if (editingItem.id) {
        // Edit existing
        const updated = await updateService(editingItem.id, editingItem);
        setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        setSuccess('Service updated successfully.');
      } else {
        // Create new
        const created = await createService(editingItem);
        setServices((prev) => [...prev, created]);
        setSuccess('Service created successfully.');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save service.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e1e2d] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-mono block mb-1">
            Offerings & Packages
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-[#F4F3ED]">
            Services Management
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 text-xs uppercase tracking-wider font-semibold bg-[#E5C158] hover:bg-[#F0D078] text-[#08080a] rounded-xs flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
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

      {/* Services List Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#71717A] animate-pulse">
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div className="p-8 text-center bg-[#0b0b10] border border-[#1e1e2d] rounded-xs text-[#71717A] text-sm">
          No services defined yet. Click "Add New Service" above.
        </div>
      ) : (
        <div className="bg-[#0b0b10] border border-[#1e1e2d] rounded-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e0e16] border-b border-[#1b1b26] text-[10px] uppercase tracking-wider text-[#A1A1AA]">
              <tr>
                <th className="px-6 py-3.5">Order</th>
                <th className="px-6 py-3.5">Title & Tag</th>
                <th className="px-6 py-3.5">Description</th>
                <th className="px-6 py-3.5">Icon</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181824] text-[#EDEBE4]">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-[#111119] transition-colors">
                  <td className="px-6 py-4 font-mono text-[#71717A]">{srv.order}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-sm text-[#F4F3ED]">{srv.title}</div>
                    <div className="text-[10px] uppercase font-mono text-[#C5A059]">{srv.tag}</div>
                  </td>
                  <td className="px-6 py-4 max-w-xs text-[#A1A1AA] line-clamp-2">
                    {srv.description}
                  </td>
                  <td className="px-6 py-4 font-mono text-[#C5A059]">{srv.icon}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(srv)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer ${
                        srv.active
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {srv.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{srv.active ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(srv)}
                      className="p-1.5 text-[#A1A1AA] hover:text-[#E5C158] hover:bg-[#1a1a26] rounded-xs transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(srv.id)}
                      className="p-1.5 text-[#A1A1AA] hover:text-red-400 hover:bg-red-950/30 rounded-xs transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && editingItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#070709]/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#0c0c12] border border-[#272738] max-w-lg w-full p-6 sm:p-8 rounded-xs shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#1e1e2d]">
              <h3 className="text-lg font-display text-[#EDEBE4]">
                {editingItem.id ? 'Edit Service' : 'Add New Service'}
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
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wedding Photography"
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                    Tag / Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fine Art Documentary"
                    value={editingItem.tag || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, tag: e.target.value })}
                    className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                    Icon Name
                  </label>
                  <select
                    value={editingItem.icon || 'Camera'}
                    onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                    className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden"
                  >
                    <option value="Camera">Camera</option>
                    <option value="Film">Film</option>
                    <option value="Heart">Heart</option>
                    <option value="Calendar">Calendar</option>
                    <option value="Sun">Sun</option>
                    <option value="Briefcase">Briefcase</option>
                    <option value="Sparkles">Sparkles</option>
                    <option value="Clapperboard">Clapperboard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[#A1A1AA] block mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the aesthetic and scope of this service..."
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-[#12121b] border border-[#262638] focus:border-[#C5A059] px-4 py-2 text-sm text-[#EDEBE4] rounded-xs outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={editingItem.active !== false}
                  onChange={(e) => setEditingItem({ ...editingItem, active: e.target.checked })}
                  className="w-4 h-4 rounded-xs accent-[#C5A059]"
                />
                <label htmlFor="activeCheck" className="text-xs text-[#EDEBE4]">
                  Publish this service on public website
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
                  <span>Save Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
