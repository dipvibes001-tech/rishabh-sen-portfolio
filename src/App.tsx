/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { About } from './components/public/About';
import { FilmsShowcase } from './components/public/FilmsShowcase';
import { Services } from './components/public/Services';
import { Portfolio } from './components/public/Portfolio';
import { FeaturedStory } from './components/public/FeaturedStory';
import { Highlights } from './components/public/Highlights';
import { Testimonials } from './components/public/Testimonials';
import { SocialSection } from './components/public/SocialSection';
import { ContactSection } from './components/public/ContactSection';
import { Footer } from './components/public/Footer';
import { CinematicBackground } from './components/common/CinematicBackground';
import { LoadingScreen } from './components/common/LoadingScreen';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import {
  PublicContentResponse,
  AdminUser,
} from './types';
import {
  fetchPublicContent,
  fetchAdminMe,
  getAdminToken,
} from './services/api';
import { FALLBACK_PUBLIC_CONTENT } from './data/fallbackContent';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);
  // Eliminate blank/infinite loading screen with immediate fallback mock data
  const [content, setContent] = useState<PublicContentResponse>(FALLBACK_PUBLIC_CONTENT);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [showLoadingScreen, setShowLoadingScreen] = useState<boolean>(true);

  // Admin authentication state
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Sync with browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Verify Admin Session on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const token = getAdminToken();
      if (!token) {
        setAuthChecking(false);
        return;
      }
      try {
        const { admin } = await fetchAdminMe();
        setAdminUser(admin);
      } catch {
        setAdminUser(null);
      } finally {
        setAuthChecking(false);
      }
    };
    verifyAuth();
  }, []);

  // Fetch Public Content
  const loadPublicContent = async () => {
    try {
      setLoading(true);
      const data = await fetchPublicContent();
      setContent(data);
    } catch (err) {
      console.error('Failed to load public portfolio content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublicContent();
  }, []);

  // Guard: if accessing /admin but not authenticated, redirect to /admin/login
  const isAdminSecurityRoute = currentPath === '/admin/security';
  const isAdminDashboardRoute = currentPath === '/admin' || currentPath.startsWith('/admin/');
  const isAdminLoginRoute = currentPath === '/admin/login';

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#080B0D] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-[#65E6EA] border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_20px_rgba(101,230,234,0.4)]" />
          <p className="text-xs uppercase tracking-[0.25em] text-[#65E6EA] font-mono">
            Rishabh Sen · Initializing Studio...
          </p>
        </div>
      </div>
    );
  }

  // Admin Login Page
  if (isAdminLoginRoute) {
    if (adminUser) {
      navigateTo('/admin');
      return null;
    }
    return (
      <AdminLogin
        onLoginSuccess={(user) => {
          setAdminUser(user);
          navigateTo('/admin');
          loadPublicContent();
        }}
        onBackToSite={() => navigateTo('/')}
      />
    );
  }

  // Admin Dashboard Page (Protected)
  if (isAdminDashboardRoute) {
    if (!adminUser) {
      navigateTo('/admin/login');
      return null;
    }
    return (
      <AdminDashboard
        admin={adminUser}
        initialTab={isAdminSecurityRoute ? 'security' : 'overview'}
        onLogout={() => {
          setAdminUser(null);
          navigateTo('/');
          loadPublicContent();
        }}
        onViewPublicSite={() => {
          navigateTo('/');
          loadPublicContent();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#080B0D] text-white font-sans-clean selection:bg-[#65E6EA] selection:text-[#080B0D] relative overflow-x-hidden w-full max-w-[100vw]">
      {/* Professional initial reveal loading animation (DipVibe.S) */}
      {showLoadingScreen && (
        <LoadingScreen onFinished={() => setShowLoadingScreen(false)} />
      )}

      {/* Dynamic 3D Cinematic Animated Background */}
      <CinematicBackground />

      {/* 1. Premium Sticky Navigation */}
      <Navbar onAdminClick={() => navigateTo(adminUser ? '/admin' : '/admin/login')} />

      {/* 2. Hero Section (Display title, subtitle, badges, dual CTAs) */}
      <Hero hero={content.siteSettings?.hero} />

      {/* 3. About Section (Philosophy, narrative, 4-item stats grid) */}
      <About about={content.siteSettings?.about} />

      {/* 4. Cinematography / Films Showcase (Master video player with YouTube embed) */}
      <FilmsShowcase films={content.films || []} />

      {/* 5. Portfolio Section (Multi-tab filter + full-screen Lightbox) */}
      <Portfolio portfolio={content.portfolio || []} />

      {/* 6. Services Section (8 services with icons and booking links) */}
      <Services
        services={content.services || []}
        onSelectService={(title) => {
          setSelectedService(title);
          const el = document.getElementById('contact');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 7. Featured Story Section (Royal wedding showcase with cover imagery) */}
      <FeaturedStory story={content.siteSettings?.featuredStory} />

      {/* 8. Highlights Section (Craft pillars: Storytelling, Sound & Music, Color Science) */}
      <Highlights highlights={content.siteSettings?.highlights || []} />

      {/* 9. Testimonials Section (Client quotes with star ratings) */}
      <Testimonials testimonials={content.testimonials || []} />

      {/* 10. Social Section (Outbound profile links) */}
      <SocialSection contact={content.siteSettings?.contact} />

      {/* 11. Contact Section (Interactive commission booking form with submission state) */}
      <ContactSection
        contact={content.siteSettings?.contact}
        initialService={selectedService}
      />

      {/* 12. Footer (Studio branding & rights) */}
      <Footer
        footer={content.siteSettings?.footer}
        contact={content.siteSettings?.contact}
        onAdminClick={() => navigateTo(adminUser ? '/admin' : '/admin/login')}
      />
    </div>
  );
}
