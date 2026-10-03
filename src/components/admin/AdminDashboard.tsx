import React, { useState, useEffect } from 'react';
import { Menu, X, ExternalLink, LogOut } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // टैब बदलने पर यूआरएल और मोबाइल मेन्यू को सिंक करना
  const handleSelectTab = (tab: AdminTab) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false); // मोबाइल पर टैब चुनते ही साइडबार बंद हो जाएगा
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
      console.error('एडमिन डैशबोर्ड डेटा लोड करने में समस्या:', err);
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
    <div className="min-h-screen bg-[#080B0D] flex flex-col lg:flex-row text-white font-sans-clean w-full max-w-full overflow-x-hidden">
      
      {/* 1. मोबाइल और एंड्रॉइड के लिए टॉप हेडर */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#0D1215]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-gray-300 hover:text-white rounded-xl bg-white/5 border border-white/10 active:scale-95 transition"
            aria-label="नेविगेशन मेन्यू खोलें"
          >
            <Menu className="w-5 h-5 text-[#65E6EA]" />
          </button>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#65E6EA] font-mono font-semibold">
              एडमिन CMS
            </div>
            <div className="text-sm font-bold capitalize text-white truncate max-w-[160px] sm:max-w-xs">
              {currentTab}
            </div>
          </div>
        </div>

        <button
          onClick={onViewPublicSite}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white flex items-center gap-1.5 text-xs font-mono"
        >
          <ExternalLink className="w-4 h-4 text-[#65E6EA]" />
          <span className="hidden sm:inline">साइट देखें</span>
        </button>
      </header>

      {/* 2. मोबाइल मेन्यू का बैकड्रॉप ओवरले */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* 3. साइडबार (कंप्यूटर पर फिक्स, मोबाइल पर स्लाइड-आउट ड्रॉअर) */}
      <div
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <AdminSidebar
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          admin={currentAdmin}
          unreadCount={stats?.unreadEnquiries ?? 0}
          onLogout={handleLogout}
          onViewPublicSite={onViewPublicSite}
        />
      </div>

      {/* 4. मुख्य कंटेंट एरिया (मोबाइल टच स्क्रॉलिंग के साथ) */}
      <main className="flex-1 overflow-y-auto max-h-screen p-4 sm:p-6 lg:p-10 bg-[#080B0D] w-full max-w-full">
        <div className="max-w-6xl mx-auto w-full">
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

export default AdminDashboard;
