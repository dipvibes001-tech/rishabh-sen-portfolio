import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  Clock,
  X,
  Filter,
} from 'lucide-react';
import { EnquiryItem } from '../../../types';
import {
  fetchAdminEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from '../../../services/api';

interface AdminEnquiriesTabProps {
  onStatusChange?: () => void;
}

export const AdminEnquiriesTab: React.FC<AdminEnquiriesTabProps> = ({ onStatusChange }) => {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminEnquiries({
        status: statusFilter,
        search,
      });
      setEnquiries(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load enquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleToggleStatus = async (item: EnquiryItem) => {
    const newStatus = item.status === 'unread' ? 'read' : 'unread';
    try {
      await updateEnquiryStatus(item.id, newStatus);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === item.id ? { ...e, status: newStatus } : e))
      );
      if (selectedEnquiry && selectedEnquiry.id === item.id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
      if (onStatusChange) onStatusChange();
    } catch (err: any) {
      setError(err.message || 'Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this inquiry?')) return;
    try {
      await deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(null);
      }
      setSuccess('Inquiry deleted successfully.');
      if (onStatusChange) onStatusChange();
    } catch (err: any) {
      setError(err.message || 'Failed to delete inquiry.');
    }
  };

  const handleViewDetails = (item: EnquiryItem) => {
    setSelectedEnquiry(item);
    // Auto mark as read if it was unread
    if (item.status === 'unread') {
      handleToggleStatus(item);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e1e2d] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-mono block mb-1">
            Client Inbound
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-[#F4F3ED]">
            Contact Enquiries
          </h1>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          {(['all', 'unread', 'read'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer ${
                statusFilter === filter
                  ? 'bg-[#E5C158] text-[#08080a] font-semibold'
                  : 'bg-[#101016] text-[#A1A1AA] hover:text-[#EDEBE4] border border-[#20202e]'
              }`}
            >
              {filter === 'all' ? 'All Inquiries' : filter}
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

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by client name, email, phone, or inquiry notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#101016] border border-[#222232] focus:border-[#C5A059] px-4 py-2.5 text-xs text-[#EDEBE4] rounded-xs outline-hidden pl-10"
          />
          <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3" />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 text-xs uppercase tracking-wider font-semibold bg-[#1a1a26] hover:bg-[#252536] text-[#C5A059] border border-[#2b2b3d] rounded-xs cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Enquiries List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#71717A] animate-pulse">
          Loading client enquiries...
        </div>
      ) : enquiries.length === 0 ? (
        <div className="p-12 text-center bg-[#0b0b10] border border-[#1e1e2d] rounded-xs text-[#71717A] text-xs space-y-2">
          <Inbox className="w-8 h-8 mx-auto text-[#C5A059]/40 mb-2" />
          <p className="text-sm text-[#A1A1AA]">No enquiries found matching your criteria.</p>
          <p className="text-[11px] text-[#52525B]">Public inquiries submitted through the contact form appear here in real-time.</p>
        </div>
      ) : (
        <div className="bg-[#0b0b10] border border-[#1e1e2d] rounded-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e0e16] border-b border-[#1b1b26] text-[10px] uppercase tracking-wider text-[#A1A1AA]">
              <tr>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Client & Email</th>
                <th className="px-6 py-3.5">Commission Type</th>
                <th className="px-6 py-3.5">Event Date</th>
                <th className="px-6 py-3.5">Received Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181824] text-[#EDEBE4]">
              {enquiries.map((enq) => (
                <tr
                  key={enq.id}
                  className={`hover:bg-[#111119] transition-colors ${
                    enq.status === 'unread' ? 'bg-[#12121b]' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(enq)}
                      className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded-full cursor-pointer ${
                        enq.status === 'unread'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {enq.status === 'unread' ? 'UNREAD' : 'READ'}
                    </button>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium text-sm text-[#F4F3ED]">{enq.name}</div>
                    <div className="text-[11px] text-[#A1A1AA]">{enq.email}</div>
                  </td>

                  <td className="px-6 py-4 text-[#C5A059] font-medium">
                    {enq.eventType}
                  </td>

                  <td className="px-6 py-4 font-mono text-[#A1A1AA]">
                    {enq.eventDate || 'Not Specified'}
                  </td>

                  <td className="px-6 py-4 font-mono text-[#71717A]">
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleViewDetails(enq)}
                      className="px-3 py-1 bg-[#1a1a26] hover:bg-[#252538] text-[#C5A059] rounded-xs text-[11px] font-medium cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDelete(enq.id)}
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

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#070709]/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="bg-[#0c0c12] border border-[#272738] max-w-xl w-full p-6 sm:p-8 rounded-xs shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1e1e2d]">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#C5A059]">
                  Commission Inquiry Record
                </span>
                <h3 className="text-xl font-display text-[#EDEBE4]">
                  {selectedEnquiry.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 text-[#A1A1AA] hover:text-[#EDEBE4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#111118] border border-[#1e1e2c] rounded-xs space-y-1">
                <span className="text-[#71717A] text-[10px] uppercase block">Email Address</span>
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="text-[#EDEBE4] font-medium hover:text-[#C5A059] flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{selectedEnquiry.email}</span>
                </a>
              </div>

              <div className="p-3 bg-[#111118] border border-[#1e1e2c] rounded-xs space-y-1">
                <span className="text-[#71717A] text-[10px] uppercase block">Phone / WhatsApp</span>
                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="text-[#EDEBE4] font-medium hover:text-[#C5A059] flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{selectedEnquiry.phone || 'None provided'}</span>
                </a>
              </div>

              <div className="p-3 bg-[#111118] border border-[#1e1e2c] rounded-xs space-y-1">
                <span className="text-[#71717A] text-[10px] uppercase block">Commission Type</span>
                <span className="text-[#C5A059] font-medium">{selectedEnquiry.eventType}</span>
              </div>

              <div className="p-3 bg-[#111118] border border-[#1e1e2c] rounded-xs space-y-1">
                <span className="text-[#71717A] text-[10px] uppercase block">Target Event Date</span>
                <span className="text-[#EDEBE4] font-mono">{selectedEnquiry.eventDate || 'Flexible / TBD'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#A1A1AA] block">
                Message & Vision Description
              </span>
              <div className="p-4 bg-[#111118] border border-[#1e1e2c] rounded-xs text-xs sm:text-sm text-[#D4D2CD] font-sans-clean font-light leading-relaxed whitespace-pre-wrap">
                {selectedEnquiry.message}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#71717A] font-mono pt-2 border-t border-[#1e1e2d]">
              <span>Inquiry ID: {selectedEnquiry.id}</span>
              <span>Logged: {new Date(selectedEnquiry.createdAt).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleToggleStatus(selectedEnquiry)}
                className="text-xs uppercase tracking-wider text-[#C5A059] hover:underline cursor-pointer"
              >
                Mark as {selectedEnquiry.status === 'unread' ? 'Read' : 'Unread'}
              </button>

              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Re: Inquiry with Rishabh Sen Atelier`}
                  className="px-5 py-2 text-xs uppercase tracking-wider font-semibold bg-[#E5C158] hover:bg-[#F0D078] text-[#08080a] rounded-xs cursor-pointer"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
