import React, { useState, useEffect } from 'react';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminOverview } from './tabs/AdminOverview';
import { AdminFilmsTab } from './tabs/AdminFilmsTab';
import { AdminContentTab } from './tabs/AdminContentTab';
import { AdminServicesTab } from './tabs/AdminServicesTab';
import { AdminPortfolioTab } from './tabs/AdminPortfolioTab';
import { AdminTestimonialsTab } from './tabs/AdminTestimonialsTab';
import { AdminEnquiriesTab } from './tabs/AdminEnquiriesTab';
import { AdminSettingsTab } from './tabs/AdminSettingsTab';
import { AdminSecurityTab } from './tabs/AdminSecurityTab';
import {
  AdminUser,
  DashboardStats,
  SiteSettings,
  Film,
} from '../../types';
import {
  fetchDashboardStats,
  fetchSiteSettings,
  fetchAdminFilms,
  adminLogout,
} from '../../services/api';

interface AdminDashboardProps {
  admin: AdminUser;
  initialTab?: AdminTab;
  onLogout: () => void;
  onViewPublicSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  admin,
  initialTab = 'overview',
  onLogout,
  onViewPublicSite,
}) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>(initialTab);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser>(admin);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync route if initialTab changes or when tab is selected
  const handleSelectTab = (tab: AdminTab) => {
    setCurrentTab(tab);
    if (tab === 'security') {
      window.history.replaceState({}, '', '/admin/security');
    } else {
      window.history.replaceState({}, '', '/admin');
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, settingsData, filmsData] = await Promise.all([
        fetchDashboardStats(),
        fetchSiteSettings(),
        fetchAdminFilms().catch(() => []),
      ]);
      setStats(statsData);
      setSiteSettings(settingsData);
      setFilms(filmsData);
    } catch (err) {
      console.error('Failed to load admin dashboard core data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await adminLogout();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#080B0D] flex text-white font-sans-clean">
      {/* Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        admin={currentAdmin}
        unreadCount={stats?.unreadEnquiries ?? 0}
        onLogout={handleLogout}
        onViewPublicSite={onViewPublicSite}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto max-h-screen p-6 sm:p-10 bg-[#080B0D]">
        <div className="max-w-6xl mx-auto">
          {currentTab === 'overview' && (
            <AdminOverview stats={stats} onNavigateTab={setCurrentTab} />
          )}

          {currentTab === 'films' && (
            <AdminFilmsTab films={films} onRefresh={loadData} />
          )}

          {currentTab === 'content' && siteSettings && (
            <AdminContentTab settings={siteSettings} onRefresh={loadData} />
          )}

          {currentTab === 'services' && (
            <AdminServicesTab onRefresh={loadData} />
          )}

          {currentTab === 'portfolio' && (
            <AdminPortfolioTab onRefresh={loadData} />
          )}

          {currentTab === 'testimonials' && (
            <AdminTestimonialsTab onRefresh={loadData} />
          )}

          {currentTab === 'enquiries' && (
            <AdminEnquiriesTab onStatusChange={loadData} />
          )}

          {currentTab === 'settings' && siteSettings && (
            <AdminSettingsTab settings={siteSettings} onRefresh={loadData} />
          )}

          {currentTab === 'security' && (
            <AdminSecurityTab
              admin={currentAdmin}
              onAdminUpdated={setCurrentAdmin}
            />
          )}
        </div>
      </main>
    </div>
  );
};

