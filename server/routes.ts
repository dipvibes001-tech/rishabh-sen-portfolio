import express, { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import {
  getDb,
  saveDb,
  ServiceItem,
  PortfolioItem,
  Film,
  TestimonialItem,
  EnquiryItem,
  SiteSettings,
} from './db.js';
import {
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginRateLimit,
  createSessionToken,
  revokeSessionToken,
  requireAdminAuth,
  AuthenticatedRequest,
} from './auth.js';

const router = Router();
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const cleaned = url.trim();
  const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = cleaned.match(regExp);
  return match ? match[1] : null;
}

/* ==========================================================================
   PUBLIC ROUTES
   ========================================================================== */

// 1. Get all public content
router.get('/public/content', (_req: Request, res: Response) => {
  const db = getDb();
  const activeServices = (db.services || [])
    .filter((s) => s.active)
    .sort((a, b) => a.order - b.order);

  const activePortfolio = (db.portfolio || [])
    .filter((p) => p.active)
    .sort((a, b) => a.order - b.order);

  const publishedFilms = (db.films || [])
    .filter((f) => f.published)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  res.json({
    siteSettings: db.siteSettings,
    services: activeServices,
    portfolio: activePortfolio,
    films: publishedFilms,
    testimonials: db.testimonials || [],
  });
});

// 2. Submit new enquiry from public contact form
router.post('/enquiries', (req: Request, res: Response) => {
  const { name, email, phone, eventType, eventDate, message } = req.body || {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    res.status(400).json({ error: 'Please provide your full name.' });
    return;
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'Please provide a valid email address.' });
    return;
  }
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    res.status(400).json({ error: 'Please describe your vision or requirements (minimum 10 characters).' });
    return;
  }

  const db = getDb();
  const newEnquiry: EnquiryItem = {
    id: `enq_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    name: name.trim().substring(0, 100),
    email: email.trim().toLowerCase().substring(0, 150),
    phone: phone ? String(phone).trim().substring(0, 30) : '',
    eventType: eventType ? String(eventType).trim().substring(0, 80) : 'General Inquiry',
    eventDate: eventDate ? String(eventDate).trim().substring(0, 30) : '',
    message: message.trim().substring(0, 3000),
    status: 'unread',
    createdAt: new Date().toISOString(),
  };

  if (!db.enquiries) db.enquiries = [];
  db.enquiries.unshift(newEnquiry);
  saveDb(db);

  res.status(201).json({
    success: true,
    message: 'Thank you. Your message has been received. Rishabh Sen will review your details and contact you personally.',
    enquiryId: newEnquiry.id,
  });
});

/* ==========================================================================
   ADMIN AUTHENTICATION ROUTES (सीधा मास्टर पासवर्ड सपोर्ट)
   ========================================================================== */

// Admin Login
router.post('/admin/login', (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
  const rateLimit = checkLoginRateLimit(ip);

  if (!rateLimit.allowed) {
    res.status(429).json({
      error: `Too many failed login attempts. Please wait ${rateLimit.waitSeconds} seconds before trying again.`,
    });
    return;
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const inputPassword = String(password).trim();

  // 1. मास्टर पासवर्ड चेक (यह बिना डेटाबेस के भी सीधा लॉगिन कराएगा)
  const isMasterLogin =
    (normalizedEmail === 'admin@rishabhsen.com' || normalizedEmail === 'contact@cinematicrishabh.site') &&
    (inputPassword === 'Rishabh@2026' || inputPassword === 'Admin@123' || inputPassword === 'admin123');

  const db = getDb();
  let admin = (db.admins || []).find((a) => a.email.toLowerCase() === normalizedEmail);

  if (isMasterLogin) {
    resetLoginRateLimit(ip);
    const adminId = admin ? admin.id : 'admin_super_1';
    const token = createSessionToken(adminId);

    res.json({
      success: true,
      token,
      admin: {
        id: adminId,
        email: normalizedEmail,
        name: admin ? admin.name : 'Rishabh Sen',
        mustChangePassword: false,
      },
    });
    return;
  }

  // 2. डेटाबेस Bcrypt चेक (सामान्य लॉगिन)
  if (!admin) {
    recordFailedLogin(ip);
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  let isPasswordValid = false;
  try {
    isPasswordValid = bcrypt.compareSync(inputPassword, admin.passwordHash);
  } catch {
    isPasswordValid = false;
  }

  if (!isPasswordValid) {
    recordFailedLogin(ip);
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  resetLoginRateLimit(ip);
  const token = createSessionToken(admin.id);

  res.json({
    success: true,
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      mustChangePassword: !!admin.mustChangePassword,
    },
  });
});

// Admin Verify / Me
router.get('/admin/me', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    admin: {
      id: req.admin!.id,
      email: req.admin!.email,
      name: req.admin!.name,
      mustChangePassword: !!req.admin!.mustChangePassword,
    },
  });
});

// Admin Logout
router.post('/admin/logout', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  if (req.token) {
    revokeSessionToken(req.token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Change Admin Password / Security
router.post('/admin/change-password', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword, email, name } = req.body || {};

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Current password and new password are required.' });
    return;
  }

  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    return;
  }

  const db = getDb();
  const admin = (db.admins || []).find((a) => a.id === req.admin!.id);
  if (!admin) {
    res.status(404).json({ error: 'Admin record not found.' });
    return;
  }

  const isValid =
    currentPassword === 'Rishabh@2026' ||
    currentPassword === 'Admin@123' ||
    bcrypt.compareSync(String(currentPassword), admin.passwordHash);

  if (!isValid) {
    res.status(401).json({ error: 'Current password is incorrect.' });
    return;
  }

  admin.passwordHash = bcrypt.hashSync(String(newPassword), 10);
  admin.mustChangePassword = false;
  if (email && typeof email === 'string' && email.includes('@')) {
    admin.email = email.trim().toLowerCase();
  }
  if (name && typeof name === 'string' && name.trim()) {
    admin.name = name.trim();
  }
  admin.updatedAt = new Date().toISOString();

  saveDb(db);
  res.json({
    success: true,
    message: 'Admin security settings updated successfully.',
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      mustChangePassword: false,
    },
  });
});

/* ==========================================================================
   ADMIN DASHBOARD STATS & OVERVIEW
   ========================================================================== */

router.get('/admin/dashboard-stats', requireAdminAuth, (_req: Request, res: Response) => {
  const db = getDb();
  const unreadEnquiries = (db.enquiries || []).filter((e) => e.status === 'unread').length;
  const films = db.films || [];

  res.json({
    totalPortfolio: (db.portfolio || []).length,
    activePortfolio: (db.portfolio || []).filter((p) => p.active).length,
    totalServices: (db.services || []).length,
    activeServices: (db.services || []).filter((s) => s.active).length,
    totalFilms: films.length,
    publishedFilms: films.filter((f) => f.published).length,
    featuredFilms: films.filter((f) => f.featured && f.published).length,
    filmCategories: Array.from(new Set(films.map((f) => f.category).filter(Boolean))),
    totalTestimonials: (db.testimonials || []).length,
    totalEnquiries: (db.enquiries || []).length,
    unreadEnquiries,
    recentEnquiries: (db.enquiries || []).slice(0, 5),
  });
});

/* ==========================================================================
   ADMIN SITE CONTENT CRUD
   ========================================================================== */

router.get('/admin/site-settings', requireAdminAuth, (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.siteSettings);
});

router.put('/admin/site-settings/:section', requireAdminAuth, (req: Request, res: Response) => {
  const { section } = req.params;
  const db = getDb();

  const validSections: Array<keyof SiteSettings> = [
    'hero',
    'about',
    'highlights',
    'featuredStory',
    'contact',
    'seo',
    'footer',
  ];

  if (!validSections.includes(section as keyof SiteSettings)) {
    res.status(400).json({ error: `Invalid content section: ${section}` });
    return;
  }

  (db.siteSettings as any)[section] = req.body;
  saveDb(db);

  res.json({
    success: true,
    message: `Updated ${section} settings successfully.`,
    updated: (db.siteSettings as any)[section],
  });
});

/* ==========================================================================
   ADMIN SERVICES MANAGEMENT
   ========================================================================== */

router.get('/admin/services', requireAdminAuth, (_req: Request, res: Response) => {
  const db = getDb();
  res.json((db.services || []).sort((a, b) => a.order - b.order));
});

router.post('/admin/services', requireAdminAuth, (req: Request, res: Response) => {
  const { title, description, icon, tag, active } = req.body || {};

  if (!title || !description) {
    res.status(400).json({ error: 'Title and description are required.' });
    return;
  }

  const db = getDb();
  if (!db.services) db.services = [];

  const newService: ServiceItem = {
    id: `srv_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
    title: String(title).trim(),
    description: String(description).trim(),
    icon: icon ? String(icon).trim() : 'Camera',
    tag: tag ? String(tag).trim() : 'Specialty',
    active: active !== undefined ? Boolean(active) : true,
    order: db.services.length + 1,
  };

  db.services.push(newService);
  saveDb(db);
  res.status(201).json(newService);
});

router.put('/admin/services/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const service = (db.services || []).find((s) => s.id === id);

  if (!service) {
    res.status(404).json({ error: 'Service not found.' });
    return;
  }

  const { title, description, icon, tag, active, order } = req.body;
  if (title !== undefined) service.title = String(title).trim();
  if (description !== undefined) service.description = String(description).trim();
  if (icon !== undefined) service.icon = String(icon).trim();
  if (tag !== undefined) service.tag = String(tag).trim();
  if (active !== undefined) service.active = Boolean(active);
  if (order !== undefined) service.order = Number(order);

  saveDb(db);
  res.json(service);
});

router.delete('/admin/services/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const index = (db.services || []).findIndex((s) => s.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Service not found.' });
    return;
  }

  db.services.splice(index, 1);
  saveDb(db);
  res.json({ success: true, message: 'Service removed successfully.' });
});

/* ==========================================================================
   ADMIN PORTFOLIO MANAGEMENT
   ========================================================================== */

router.get('/admin/portfolio', requireAdminAuth, (_req: Request, res: Response) => {
  const db = getDb();
  res.json((db.portfolio || []).sort((a, b) => a.order - b.order));
});

router.post('/admin/portfolio', requireAdminAuth, (req: Request, res: Response) => {
  const { title, category, description, imageUrl, client, year, aspect, featured, active } = req.body || {};

  if (!title || !category || !description) {
    res.status(400).json({ error: 'Title, category, and description are required.' });
    return;
  }

  const db = getDb();
  if (!db.portfolio) db.portfolio = [];

  const newPortfolioItem: PortfolioItem = {
    id: `port_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
    title: String(title).trim(),
    category: category,
    description: String(description).trim(),
    imageUrl: imageUrl ? String(imageUrl).trim() : '',
    client: client ? String(client).trim() : '',
    year: year ? String(year).trim() : String(new Date().getFullYear()),
    aspect: aspect || 'landscape',
    featured: Boolean(featured),
    active: active !== undefined ? Boolean(active) : true,
    order: db.portfolio.length + 1,
  };

  db.portfolio.push(newPortfolioItem);
  saveDb(db);
  res.status(201).json(newPortfolioItem);
});

router.put('/admin/portfolio/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const item = (db.portfolio || []).find((p) => p.id === id);

  if (!item) {
    res.status(404).json({ error: 'Portfolio item not found.' });
    return;
  }

  const { title, category, description, imageUrl, client, year, aspect, featured, active, order } = req.body;
  if (title !== undefined) item.title = String(title).trim();
  if (category !== undefined) item.category = category;
  if (description !== undefined) item.description = String(description).trim();
  if (imageUrl !== undefined) item.imageUrl = String(imageUrl).trim();
  if (client !== undefined) item.client = String(client).trim();
  if (year !== undefined) item.year = String(year).trim();
  if (aspect !== undefined) item.aspect = aspect;
  if (featured !== undefined) item.featured = Boolean(featured);
  if (active !== undefined) item.active = Boolean(active);
  if (order !== undefined) item.order = Number(order);

  saveDb(db);
  res.json(item);
});

router.delete('/admin/portfolio/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const index = (db.portfolio || []).findIndex((p) => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Portfolio item not found.' });
    return;
  }

  db.portfolio.splice(index, 1);
  saveDb(db);
  res.json({ success: true, message: 'Portfolio item deleted successfully.' });
});

router.put('/admin/portfolio-reorder', requireAdminAuth, (req: Request, res: Response) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    res.status(400).json({ error: 'Items array expected.' });
    return;
  }

  const db = getDb();
  for (const update of items) {
    const p = (db.portfolio || []).find((item) => item.id === update.id);
    if (p && typeof update.order === 'number') {
      p.order = update.order;
    }
  }

  saveDb(db);
  res.json({ success: true, message: 'Portfolio items reordered.' });
});

/* ==========================================================================
   ADMIN FILMS / VIDEOS MANAGEMENT
   ========================================================================== */

router.get('/admin/films', requireAdminAuth, (_req: Request, res: Response) => {
  const db = getDb();
  res.json((db.films || []).sort((a, b) => (a.order || 0) - (b.order || 0)));
});

router.post('/admin/films', requireAdminAuth, (req: Request, res: Response) => {
  const {
    title,
    youtubeUrl,
    thumbnail,
    category,
    description,
    clientName,
    duration,
    featured,
    published,
  } = req.body || {};

  if (!title || !youtubeUrl) {
    res.status(400).json({ error: 'Film title and YouTube URL are required.' });
    return;
  }

  const videoId = extractYouTubeId(youtubeUrl);
  if (!videoId) {
    res.status(400).json({ error: 'Please provide a valid YouTube URL.' });
    return;
  }

  const db = getDb();
  if (!db.films) db.films = [];

  const autoThumb = thumbnail && thumbnail.trim()
    ? thumbnail.trim()
    : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const newFilm: Film = {
    id: `film_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
    title: String(title).trim(),
    youtubeUrl: String(youtubeUrl).trim(),
    youtubeId: videoId,
    thumbnail: autoThumb,
    category: category ? String(category).trim() : 'Wedding Films',
    description: description ? String(description).trim() : '',
    clientName: clientName ? String(clientName).trim() : '',
    duration: duration ? String(duration).trim() : '',
    featured: Boolean(featured),
    published: published !== undefined ? Boolean(published) : true,
    order: db.films.length + 1,
    createdAt: new Date().toISOString(),
  };

  db.films.push(newFilm);
  saveDb(db);
  res.status(201).json(newFilm);
});

router.put('/admin/films/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const film = (db.films || []).find((f) => f.id === id);

  if (!film) {
    res.status(404).json({ error: 'Film not found.' });
    return;
  }

  const {
    title,
    youtubeUrl,
    thumbnail,
    category,
    description,
    clientName,
    duration,
    featured,
    published,
    order,
  } = req.body;

  if (title !== undefined) film.title = String(title).trim();
  if (youtubeUrl !== undefined) {
    film.youtubeUrl = String(youtubeUrl).trim();
    const parsedId = extractYouTubeId(film.youtubeUrl);
    if (parsedId) {
      film.youtubeId = parsedId;
      if (!thumbnail && (!film.thumbnail || film.thumbnail.includes('img.youtube.com'))) {
        film.thumbnail = `https://img.youtube.com/vi/${parsedId}/maxresdefault.jpg`;
      }
    }
  }
  if (thumbnail !== undefined) film.thumbnail = String(thumbnail).trim();
  if (category !== undefined) film.category = String(category).trim();
  if (description !== undefined) film.description = String(description).trim();
  if (clientName !== undefined) film.clientName = String(clientName).trim();
  if (duration !== undefined) film.duration = String(duration).trim();
  if (featured !== undefined) film.featured = Boolean(featured);
  if (published !== undefined) film.published = Boolean(published);
  if (order !== undefined) film.order = Number(order);

  saveDb(db);
  res.json(film);
});

router.delete('/admin/films/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  if (!db.films) {
    res.status(404).json({ error: 'Film not found.' });
    return;
  }

  const index = db.films.findIndex((f) => f.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Film not found.' });
    return;
  }

  db.films.splice(index, 1);
  saveDb(db);
  res.json({ success: true, message: 'Film deleted successfully.' });
});

router.put('/admin/films-reorder', requireAdminAuth, (req: Request, res: Response) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    res.status(400).json({ error: 'Items array expected.' });
    return;
  }

  const db = getDb();
  if (!db.films) db.films = [];
  for (const update of items) {
    const f = db.films.find((item) => item.id === update.id);
    if (f && typeof update.order === 'number') {
      f.order = update.order;
    }
  }

  saveDb(db);
  res.json({ success: true, message: 'Films reordered successfully.' });
});

/* ==========================================================================
   ADMIN TESTIMONIALS MANAGEMENT
   ========================================================================== */

router.get('/admin/testimonials', requireAdminAuth, (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.testimonials || []);
});

router.post('/admin/testimonials', requireAdminAuth, (req: Request, res: Response) => {
  const { name, eventType, review, rating, date, location } = req.body || {};

  if (!name || !review) {
    res.status(400).json({ error: 'Name and review text are required.' });
    return;
  }

  const db = getDb();
  if (!db.testimonials) db.testimonials = [];

  const newTestimonial: TestimonialItem = {
    id: `tst_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
    name: String(name).trim(),
    eventType: eventType ? String(eventType).trim() : 'Wedding Event',
    review: String(review).trim(),
    rating: Number(rating) || 5,
    date: date ? String(date).trim() : 'Recent',
    location: location ? String(location).trim() : 'India',
  };

  db.testimonials.push(newTestimonial);
  saveDb(db);
  res.status(201).json(newTestimonial);
});

router.put('/admin/testimonials/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const item = (db.testimonials || []).find((t) => t.id === id);

  if (!item) {
    res.status(404).json({ error: 'Testimonial not found.' });
    return;
  }

  const { name, eventType, review, rating, date, location } = req.body;
  if (name !== undefined) item.name = String(name).trim();
  if (eventType !== undefined) item.eventType = String(eventType).trim();
  if (review !== undefined) item.review = String(review).trim();
  if (rating !== undefined) item.rating = Number(rating);
  if (date !== undefined) item.date = String(date).trim();
  if (location !== undefined) item.location = String(location).trim();

  saveDb(db);
  res.json(item);
});

router.delete('/admin/testimonials/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const index = (db.testimonials || []).findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Testimonial not found.' });
    return;
  }

  db.testimonials.splice(index, 1);
  saveDb(db);
  res.json({ success: true, message: 'Testimonial deleted successfully.' });
});

/* ==========================================================================
   ADMIN CONTACT ENQUIRIES MANAGEMENT
   ========================================================================== */

router.get('/admin/enquiries', requireAdminAuth, (req: Request, res: Response) => {
  const { search, status, eventType } = req.query;
  const db = getDb();
  let results = [...(db.enquiries || [])];

  if (status && status !== 'all') {
    results = results.filter((e) => e.status === status);
  }
  if (eventType && eventType !== 'all') {
    results = results.filter((e) => e.eventType.toLowerCase().includes(String(eventType).toLowerCase()));
  }
  if (search && typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase();
    results = results.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q) ||
        e.phone.toLowerCase().includes(q)
    );
  }

  res.json(results);
});

router.patch('/admin/enquiries/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status !== 'read' && status !== 'unread') {
    res.status(400).json({ error: 'Status must be read or unread.' });
    return;
  }

  const db = getDb();
  const enquiry = (db.enquiries || []).find((e) => e.id === id);
  if (!enquiry) {
    res.status(404).json({ error: 'Enquiry not found.' });
    return;
  }

  enquiry.status = status;
  saveDb(db);
  res.json({ success: true, enquiry });
});

router.delete('/admin/enquiries/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const index = (db.enquiries || []).findIndex((e) => e.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Enquiry not found.' });
    return;
  }

  db.enquiries.splice(index, 1);
  saveDb(db);
  res.json({ success: true, message: 'Enquiry deleted successfully.' });
});

/* ==========================================================================
   IMAGE UPLOAD ENDPOINT
   ========================================================================== */

router.post('/upload', requireAdminAuth, (req: Request, res: Response) => {
  const { dataUri, fileName } = req.body || {};

  if (!dataUri || typeof dataUri !== 'string') {
    res.status(400).json({ error: 'No image data provided.' });
    return;
  }

  const match = dataUri.match(/^data:(image\/(jpeg|png|webp|gif|avif));base64,(.+)$/);
  if (!match) {
    res.status(400).json({ error: 'Invalid image format. Allowed formats: JPEG, PNG, WEBP, GIF, AVIF.' });
    return;
  }

  const mimeType = match[1];
  const extension = mimeType.split('/')[1] === 'jpeg' ? 'jpg' : mimeType.split('/')[1];
  const base64Data = match[3];
  const buffer = Buffer.from(base64Data, 'base64');

  if (buffer.length > 10 * 1024 * 1024) {
    res.status(400).json({ error: 'Image exceeds maximum allowed size of 10MB.' });
    return;
  }

  const safeName = (fileName || 'image')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 30);
  const finalFilename = `${Date.now()}_${safeName}.${extension}`;
  const filePath = path.join(UPLOADS_DIR, finalFilename);

  fs.writeFileSync(filePath, buffer);

  const fileUrl = `/uploads/${finalFilename}`;
  res.json({
    success: true,
    fileUrl,
    size: buffer.length,
    fileName: finalFilename,
  });
});

export default router;
