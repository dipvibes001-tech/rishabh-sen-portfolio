import React from 'react';
import {
  LayoutDashboard,
  FileEdit,
  Briefcase,
  Image as ImageIcon,
  Film as FilmIcon,
  MessageSquare,
  Inbox,
  Sliders,
  Shield,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { AdminUser } from '../../types';

export type AdminTab =
  | 'overview'
  | 'content'
  | 'services'
  | 'portfolio'
  | 'films'
  | 'testimonials'
  | 'enquiries'
  | 'settings'
  | 'security';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  admin: AdminUser | null;
  unreadCount?: number;
  onLogout: () => void;
  onViewPublicSite: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  admin,
  unreadCount = 0,
  onLogout,
  onViewPublicSite,
}) => {
  const menuItems: Array<{
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'overview', label: 'Overview & Enquiries', icon: LayoutDashboard, badge: unreadCount },
    { id: 'films', label: 'Films / Videos', icon: FilmIcon },
    { id: 'portfolio', label: 'Portfolio Gallery', icon: ImageIcon },
    { id: 'services', label: 'Services & Pricing', icon: Briefcase },
    { id: 'content', label: 'About & Highlights', icon: FileEdit },
    { id: 'testimonials', label: 'Reviews', icon: MessageSquare },
    { id: 'enquiries', label: 'Inquiries Inbox', icon: Inbox, badge: unreadCount },
    { id: 'settings', label: 'Contact & Socials', icon: Sliders },
    { id: 'security', label: 'Security & Settings', icon: Shield },
  ];

  return (
    <aside className="w-64 bg-[#0D1215] border-r border-white/10 flex flex-col justify-between h-screen sticky top-0 shrink-0 z-20">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 bg-[#080B0D]/50 backdrop-blur-md">
          <div className="flex items-center gap-2 text-base font-display font-bold tracking-[0.14em] text-white uppercase">
            <span>Rishabh Sen</span>
            <span className="w-2 h-2 rounded-full bg-[#65E6EA] shadow-[0_0_8px_#65E6EA]" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[#65E6EA] font-mono block mt-1">
            Studio CMS Console
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#65E6EA] to-[#8B7CFF] text-[#080B0D] shadow-[0_0_20px_rgba(101,230,234,0.35)]'
                    : 'text-[#9CA7AD] hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#080B0D]' : 'text-[#65E6EA]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold tabular-nums ${
                      isActive ? 'bg-[#080B0D] text-[#65E6EA]' : 'bg-red-500 text-white shadow-sm'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer User Info & Actions */}
      <div className="p-4 border-t border-white/10 space-y-2 bg-[#080B0D]">
        {/* Logged in info */}
        <div className="px-2 py-1">
          <div className="text-xs font-semibold text-white truncate">
            {admin?.name || 'Administrator'}
          </div>
          <div className="text-[10px] text-[#9CA7AD] truncate font-mono">
            {admin?.email || 'admin@rishabhsen.com'}
          </div>
        </div>

        <button
          onClick={onViewPublicSite}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#65E6EA] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Public Website</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

