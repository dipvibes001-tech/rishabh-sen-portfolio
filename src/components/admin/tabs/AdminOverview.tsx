import React from 'react';
import {
  Image as ImageIcon,
  Film as FilmIcon,
  Briefcase,
  MessageSquare,
  Inbox,
  ArrowRight,
  Plus,
  Clock,
  Sparkles,
} from 'lucide-react';
import { DashboardStats } from '../../../types';
import { AdminTab } from '../AdminSidebar';

interface AdminOverviewProps {
  stats: DashboardStats | null;
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ stats, onNavigateTab }) => {
  const cards = [
    {
      title: 'Films & Videos',
      value: stats?.totalFilms ?? 4,
      subvalue: `${stats?.publishedFilms ?? 4} Published · ${stats?.featuredFilms ?? 1} Featured`,
      icon: FilmIcon,
      tab: 'films' as AdminTab,
      accent: 'cyan',
    },
    {
      title: 'Portfolio Works',
      value: stats?.totalPortfolio ?? 0,
      subvalue: `${stats?.activePortfolio ?? 0} Active Live`,
      icon: ImageIcon,
      tab: 'portfolio' as AdminTab,
      accent: 'purple',
    },
    {
      title: 'Active Services',
      value: stats?.activeServices ?? 0,
      subvalue: `${stats?.totalServices ?? 0} Configured`,
      icon: Briefcase,
      tab: 'services' as AdminTab,
      accent: 'cyan',
    },
    {
      title: 'Testimonials',
      value: stats?.totalTestimonials ?? 0,
      subvalue: '100% 5-Star Average',
      icon: MessageSquare,
      tab: 'testimonials' as AdminTab,
      accent: 'purple',
    },
    {
      title: 'Client Inquiries',
      value: stats?.totalEnquiries ?? 0,
      subvalue: `${stats?.unreadEnquiries ?? 0} Unread / Action Needed`,
      highlight: (stats?.unreadEnquiries ?? 0) > 0,
      icon: Inbox,
      tab: 'enquiries' as AdminTab,
      accent: 'cyan',
    },
  ];

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#65E6EA] font-mono block mb-1">
            Studio Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Dashboard Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('films')}
            className="px-4 py-2.5 text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-[#65E6EA] to-[#8B7CFF] text-[#080B0D] rounded-xl flex items-center gap-1.5 shadow-[0_0_20px_rgba(101,230,234,0.3)] hover:opacity-95 transition-opacity cursor-pointer"
          >
            <FilmIcon className="w-3.5 h-3.5" />
            <span>Manage Films</span>
          </button>
          <button
            onClick={() => onNavigateTab('enquiries')}
            className="px-4 py-2.5 text-xs uppercase tracking-wider font-medium border border-white/10 hover:border-[#65E6EA] bg-[#12181C] text-white rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Inbox className="w-3.5 h-3.5 text-[#65E6EA]" />
            <span>View Inquiries</span>
          </button>
        </div>
      </div>

      {/* Primary Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              onClick={() => onNavigateTab(c.tab)}
              className={`p-5 bg-[#12181C] border ${
                c.highlight
                  ? 'border-[#65E6EA] shadow-[0_0_25px_rgba(101,230,234,0.2)]'
                  : 'border-white/10 hover:border-[#65E6EA]/50'
              } rounded-2xl transition-all duration-300 cursor-pointer group flex flex-col justify-between hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase tracking-wider text-[#9CA7AD] font-medium">
                  {c.title}
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#080B0D] border border-white/10 flex items-center justify-center text-[#65E6EA] group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-white tabular-nums mb-1">
                  {c.value}
                </div>
                <div className={`text-[11px] leading-tight ${c.highlight ? 'text-[#65E6EA] font-semibold' : 'text-[#9CA7AD]'}`}>
                  {c.subvalue}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-[#65E6EA] uppercase tracking-wider font-semibold">
                <span>Manage</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Enquiries & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries */}
        <div className="lg:col-span-8 bg-[#12181C] border border-white/10 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h3 className="text-base font-display font-bold text-white">
              Recent Contact Inquiries
            </h3>
            <button
              onClick={() => onNavigateTab('enquiries')}
              className="text-xs text-[#65E6EA] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({stats?.totalEnquiries ?? 0})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {(!stats?.recentEnquiries || stats.recentEnquiries.length === 0) ? (
            <div className="py-12 text-center text-[#9CA7AD] text-xs">
              No inquiries received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  onClick={() => onNavigateTab('enquiries')}
                  className="p-4 bg-[#0D1215] border border-white/5 hover:border-[#65E6EA]/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {enq.name}
                      </span>
                      {enq.status === 'unread' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#65E6EA]/20 border border-[#65E6EA]/40 text-[#65E6EA] font-bold">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#9CA7AD]">
                      <span>{enq.eventType}</span>
                      <span>·</span>
                      <span>{enq.email}</span>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-[#9CA7AD] flex items-center gap-1.5 shrink-0">
                    <Clock className="w-3 h-3 text-[#65E6EA]" />
                    <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Help & Publishing Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#12181C] border border-white/10 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#65E6EA]" />
              <span>Studio Engine Status</span>
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-[#9CA7AD]">
                <span>Public Port</span>
                <span className="font-mono text-white">3000 (Active)</span>
              </div>
              <div className="flex items-center justify-between text-[#9CA7AD]">
                <span>Theme Engine</span>
                <span className="text-[#65E6EA] font-semibold">3D Dark Cinematic</span>
              </div>
              <div className="flex items-center justify-between text-[#9CA7AD]">
                <span>Video Showcase</span>
                <span className="text-[#8B7CFF] font-semibold">YouTube 4K Embeds</span>
              </div>
              <div className="flex items-center justify-between text-[#9CA7AD]">
                <span>Data Storage</span>
                <span className="text-emerald-400">Atomic Disk Persistence</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#0D1215] border border-white/10 rounded-2xl space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#65E6EA] font-bold">
              Instant CMS Sync
            </h4>
            <p className="text-xs text-[#9CA7AD] leading-relaxed font-light">
              Any updates to films, portfolio photographs, services, about copy, or contact details reflect instantly on the public website without restarting or rebuilding the server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
