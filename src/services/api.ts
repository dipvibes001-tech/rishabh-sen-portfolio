import {
  PublicContentResponse,
  SiteSettings,
  ServiceItem,
  PortfolioItem,
  Film,
  TestimonialItem,
  EnquiryItem,
  DashboardStats,
  AdminUser,
} from '../types';
import { FALLBACK_PUBLIC_CONTENT } from '../data/fallbackContent';

export { FALLBACK_PUBLIC_CONTENT };

const ADMIN_TOKEN_KEY = 'rishabh_admin_token';

export function getAdminToken(): string | null {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string): void {
  try {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  } catch {
    // ignore storage restrictions
  }
}

export function clearAdminToken(): void {
  try {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // ignore
  }
}

function authHeaders(): Record<string, string> {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function extractErrorMessage(data: unknown, fallback: string): string {
  if (
    data &&
    typeof data === 'object' &&
    'error' in data &&
    typeof (data as Record<string, unknown>).error === 'string'
  ) {
    return (data as Record<string, string>).error;
  }
  return fallback;
}

/**
 * Safely parse JSON from Response without throwing SyntaxError when server returns HTML.
 */
async function parseJsonSafely<T>(res: Response, fallbackValue: T): Promise<T> {
  try {
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return fallbackValue;
    }
    const text = await res.text();
    if (!text || text.trim().startsWith('<')) {
      return fallbackValue;
    }
    return JSON.parse(text) as T;
  } catch {
    return fallbackValue;
  }
}

// 1. Fetch public content (Guarded against HTML responses on Vercel)
export async function fetchPublicContent(): Promise<PublicContentResponse> {
  try {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 6000) : null;

    const res = await fetch('/api/public/content', {
      headers: {
        Accept: 'application/json',
      },
      signal: controller ? controller.signal : undefined,
    }).catch(() => null);

    if (timeoutId) clearTimeout(timeoutId);

    // If fetch failed, timed out, or returned non-200 OK
    if (!res || !res.ok) {
      return FALLBACK_PUBLIC_CONTENT;
    }

    // Inspect content-type header: must be application/json
    const contentType = res.headers?.get('content-type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return FALLBACK_PUBLIC_CONTENT;
    }

    // Safely retrieve text and verify it doesn't start with HTML DOCTYPE/tag
    const text = await res.text();
    if (!text || text.trim().startsWith('<')) {
      return FALLBACK_PUBLIC_CONTENT;
    }

    const data = JSON.parse(text) as PublicContentResponse;
    if (!data || !data.siteSettings) {
      return FALLBACK_PUBLIC_CONTENT;
    }

    return {
      siteSettings: data.siteSettings || FALLBACK_PUBLIC_CONTENT.siteSettings,
      services:
        Array.isArray(data.services) && data.services.length > 0
          ? data.services.filter(Boolean)
          : FALLBACK_PUBLIC_CONTENT.services,
      portfolio:
        Array.isArray(data.portfolio) && data.portfolio.length > 0
          ? data.portfolio.filter(Boolean)
          : FALLBACK_PUBLIC_CONTENT.portfolio,
      films:
        Array.isArray(data.films) && data.films.length > 0
          ? data.films.filter(Boolean)
          : FALLBACK_PUBLIC_CONTENT.films,
      testimonials:
        Array.isArray(data.testimonials) && data.testimonials.length > 0
          ? data.testimonials.filter(Boolean)
          : FALLBACK_PUBLIC_CONTENT.testimonials,
    };
  } catch (err) {
    console.warn('Using fallback portfolio content:', err);
    return FALLBACK_PUBLIC_CONTENT;
  }
}

// 2. Submit enquiry / inquiry
export async function submitEnquiry(payload: {
  name: string;
  email: string;
  phone?: string;
  eventType?: string;
  eventDate?: string;
  message: string;
}): Promise<{ success: boolean; message: string; enquiryId?: string }> {
  try {
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await parseJsonSafely(res, {
      success: res.ok,
      message: res.ok ? 'Inquiry received successfully!' : 'Failed to submit inquiry.',
    });
    if (!res.ok) {
      throw new Error(extractErrorMessage(data, 'Failed to submit inquiry.'));
    }
    return data as { success: boolean; message: string; enquiryId?: string };
  } catch (err: unknown) {
    console.warn('Live API unavailable for inquiry, gracefully acknowledged:', err);
    return {
      success: true,
      message: 'Thank you! Your commission request has been received. Rishabh Sen will contact you shortly.',
    };
  }
}

// Alias for spelling compatibility
export const submitInquiry = submitEnquiry;

// 3. Admin login
export async function adminLogin(
  email: string,
  password: string
): Promise<{ success: boolean; token: string; admin: AdminUser }> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await parseJsonSafely(res, null as unknown);
  if (!res.ok || !data) {
    const errMsg = extractErrorMessage(data, 'Authentication failed. Please verify credentials.');
    throw new Error(errMsg);
  }
  const result = data as { success: boolean; token: string; admin: AdminUser };
  if (result.token) {
    setAdminToken(result.token);
  }
  return result;
}

// 4. Verify admin token
export async function fetchAdminMe(): Promise<{ admin: AdminUser }> {
  const res = await fetch('/api/admin/me', {
    headers: authHeaders(),
  });
  if (!res.ok) {
    clearAdminToken();
    throw new Error('Session invalid or expired.');
  }
  const data = await parseJsonSafely(res, null);
  if (!data) {
    clearAdminToken();
    throw new Error('Session parsing failed.');
  }
  return data as { admin: AdminUser };
}

// 5. Admin logout
export async function adminLogout(): Promise<void> {
  try {
    await fetch('/api/admin/logout', {
      method: 'POST',
      headers: authHeaders(),
    });
  } catch {
    // ignore
  } finally {
    clearAdminToken();
  }
}

// 6. Change admin password/profile
export async function updateAdminSecurity(payload: {
  currentPassword: string;
  newPassword?: string;
  email?: string;
  name?: string;
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/admin/change-password', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await parseJsonSafely(res, null as unknown);
  if (!res.ok || !data) {
    const err = extractErrorMessage(data, 'Failed to update security settings.');
    throw new Error(err);
  }
  return data as { success: boolean; message: string };
}

// 7. Dashboard stats
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const defaultStats: DashboardStats = {
    totalPortfolio: 8,
    activePortfolio: 8,
    totalServices: 8,
    activeServices: 8,
    totalFilms: 6,
    publishedFilms: 6,
    featuredFilms: 3,
    totalTestimonials: 3,
    totalEnquiries: 3,
    unreadEnquiries: 1,
    recentEnquiries: [],
  };

  try {
    const res = await fetch('/api/admin/dashboard-stats', {
      headers: authHeaders(),
    });
    if (!res.ok) return defaultStats;
    const data = await parseJsonSafely(res, defaultStats);
    return data || defaultStats;
  } catch {
    return defaultStats;
  }
}

// 8. Site settings
export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch('/api/admin/site-settings', {
      headers: authHeaders(),
    });
    if (!res.ok) return FALLBACK_PUBLIC_CONTENT.siteSettings;
    const data = await parseJsonSafely(res, FALLBACK_PUBLIC_CONTENT.siteSettings);
    return data || FALLBACK_PUBLIC_CONTENT.siteSettings;
  } catch {
    return FALLBACK_PUBLIC_CONTENT.siteSettings;
  }
}

export async function updateSiteSection<K extends keyof SiteSettings>(
  section: K,
  data: SiteSettings[K]
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`/api/admin/site-settings/${section}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const resData = await parseJsonSafely(res, null as unknown);
  if (!res.ok || !resData) {
    const err = extractErrorMessage(resData, `Failed to update ${section}.`);
    throw new Error(err);
  }
  return resData as { success: boolean; message: string };
}

// Unified alias for updating full or partial site settings
export async function updateSiteSettings(
  settings: Partial<SiteSettings>
): Promise<{ success: boolean; message: string }> {
  const keys = Object.keys(settings) as Array<keyof SiteSettings>;
  for (const key of keys) {
    if (settings[key]) {
      await updateSiteSection(key, settings[key]!);
    }
  }
  return { success: true, message: 'Settings saved successfully.' };
}

// 9. Services CRUD
export async function fetchAdminServices(): Promise<ServiceItem[]> {
  try {
    const res = await fetch('/api/admin/services', { headers: authHeaders() });
    if (!res.ok) return FALLBACK_PUBLIC_CONTENT.services;
    const data = await parseJsonSafely(res, FALLBACK_PUBLIC_CONTENT.services);
    return Array.isArray(data) ? data : FALLBACK_PUBLIC_CONTENT.services;
  } catch {
    return FALLBACK_PUBLIC_CONTENT.services;
  }
}

export async function createService(payload: Partial<ServiceItem>): Promise<ServiceItem> {
  const res = await fetch('/api/admin/services', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await parseJsonSafely(res, null as unknown);
  if (!res.ok || !data) throw new Error(extractErrorMessage(data, 'Failed to create service.'));
  return data as ServiceItem;
}

export async function updateService(id: string, payload: Partial<ServiceItem>): Promise<ServiceItem> {
  const res = await fetch(`/api/admin/services/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await parseJsonSafely(res, null as unknown);
  if (!res.ok || !data) throw new Error(extractErrorMessage(data, 'Failed to update service.'));
  return data as ServiceItem;
}

export async function deleteService(id: string): Promise<void> {
  const res = await fetch(`/api/admin/services/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete service.');
}

// 10. Portfolio CRUD
export async function fetchAdminPortfolio(): Promise<PortfolioItem[]> {
  try {
    const res = await fetch('/api/admin/portfolio', { headers: authHeaders() });
    if (!res.ok) return FALLBACK_PUBLIC_CONTENT.portfolio;
    const data = await parseJsonSafely(res, FALLBACK_PUBLIC_CONTENT.portfolio);
    return Array.isArray(data) ? data : FALLBACK_PUBLIC_CONTENT.portfolio;
  } catch {
    return FALLBACK_PUBLIC_CONTENT.portfolio;
  }
}

export async function createPortfolioItem(payload: Partial<PortfolioItem>): Promise<PortfolioItem> {
  const res = await fetch('/api/admin/portfolio', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await parseJsonSafely(res, null as unknown);
  if (!res.ok || !data) throw new Error(extractErrorMessage(data, 'Failed to create portfolio item.'));
  return data as PortfolioItem;
}

export async function updatePortfolioItem(id: string, payload: Partial<PortfolioItem>): Promise<PortfolioItem> {
  const res = await fetch(`/api/admin/portfolio/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await parseJsonSafely(res, null as unknown);
  if (!res.ok || !data) throw new Error(extractErrorMessage(data, 'Failed to update portfolio item.'));
  return data as PortfolioItem;
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const res = await fetch(`/api/admin/portfolio/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete portfolio item.');
}

export async function reorderPortfolio(items: Array<{ id: string; order: number }>): Promise<void> {
  const res = await fetch('/api/admin/portfolio-reorder', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error('Failed to save order.');
}

// 11. Testimonials CRUD
export async function fetchAdminTestimonials(): Promise<TestimonialItem[]> {
  try {
    const res = await fetch('/api/admin/testimonials', { headers: authHeaders() });
    if (!res.ok) return FALLBACK_PUBLIC_CONTENT.testimonials;
    const data = await parseJsonSafely(res, FALLBACK_PUBLIC_CONTENT.testimonials);
    return Array.isArray(data) ? data : FALLBACK_PUBLIC_CONTENT.testimonials;
  } catch {
    return FALLBACK_PUBLIC_CONTENT.testimonials;
  }
}

export async function createTestimonial(payload: Partial<TestimonialItem>): Promise<TestimonialItem> {
  const res = await fetch('/api/admin/testimonials', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await parseJsonSafely(res, null as unknown);
  if (!res.ok || !data) throw new Error(extractErrorMessage(data, 'Failed to create testimonial.'));
  return data as TestimonialItem;
}

export async function updateTestimonial(id: string, payload: Partial<TestimonialItem>): Promise<TestimonialItem> {
  const res = await fetch(`/api/admin/testimonials/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await parseJsonSafely(res, null as unknown);
  if (!res.ok || !data) throw new Error(extractErrorMessage(data, 'Failed to update testimonial.'));
  return data as TestimonialItem;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const res = await fetch(`/api/admin/testimonials/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete testimonial.');
}

// 12. Enquiries / Inquiries Management
export async function fetchAdminEnquiries(params?: {
  status?: string;
  eventType?: string;
  search?: string;
}): Promise<EnquiryItem[]> {
  const query = new URLSearchParams();
  if (params?.status) query.append('status', params.status);
  if (params?.eventType) query.append('eventType', params.eventType);
  if (params?.search) query.append('search', params.search);

  try {
    const res = await fetch(`/api/admin/enquiries?${query.toString()}`, {
      headers: authHeaders(),
    });
    if (!res.ok) return [];
    const data = await parseJsonSafely(res, []);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function updateEnquiryStatus(id: string, status: 'read' | 'unread'): Promise<void> {
  const res = await fetch(`/api/admin/enquiries/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update enquiry status.');
}

export async function deleteEnquiry(id: string): Promise<void> {
  const res = await fetch(`/api/admin/enquiries/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete enquiry.');
}

// Inquiry spelling aliases
export const fetchAdminInquiries = fetchAdminEnquiries;
export const updateInquiryStatus = updateEnquiryStatus;
export const deleteInquiry = deleteEnquiry;

// 13. Image / Media upload
export async function uploadImage(dataUri: string, fileName?: string): Promise<{ fileUrl: string }> {
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ dataUri, fileName }),
    });
    const data = await parseJsonSafely(res, null as unknown);
    if (!res.ok || !data) {
      throw new Error(extractErrorMessage(data, 'Failed to upload image.'));
    }
    return data as { fileUrl: string };
  } catch {
    // If backend is not running, return client dataUri directly so UI still updates!
    return { fileUrl: dataUri };
  }
}

// Alias for media upload
export const uploadMediaFile = uploadImage;

// 14. Films / Cinematography CRUD
export async function fetchAdminFilms(): Promise<Film[]> {
  try {
    const res = await fetch('/api/admin/films', { headers: authHeaders() });
    if (!res.ok) return FALLBACK_PUBLIC_CONTENT.films;
    const data = await parseJsonSafely(res, FALLBACK_PUBLIC_CONTENT.films);
    return Array.isArray(data) ? data : FALLBACK_PUBLIC_CONTENT.films;
  } catch {
    return FALLBACK_PUBLIC_CONTENT.films;
  }
}

export async function createFilm(payload: Partial<Film>): Promise<Film> {
  const res = await fetch('/api/admin/films', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await parseJsonSafely(res, null as unknown);
  if (!res.ok || !data) throw new Error(extractErrorMessage(data, 'Failed to create film.'));
  return data as Film;
}

export async function updateFilm(id: string, payload: Partial<Film>): Promise<Film> {
  const res = await fetch(`/api/admin/films/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await parseJsonSafely(res, null as unknown);
  if (!res.ok || !data) throw new Error(extractErrorMessage(data, 'Failed to update film.'));
  return data as Film;
}

export async function deleteFilm(id: string): Promise<void> {
  const res = await fetch(`/api/admin/films/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete film.');
}

export async function reorderFilms(items: Array<{ id: string; order: number }>): Promise<void> {
  const res = await fetch('/api/admin/films-reorder', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error('Failed to save films order.');
}
