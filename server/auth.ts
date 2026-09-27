import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import type { Request, Response, NextFunction } from 'express';
import { getDb, saveDb, AdminUser } from './db.js';

interface RateLimitRecord {
  count: number;
  resetAt: number;
  blockedUntil?: number;
}

const loginRateLimits = new Map<string, RateLimitRecord>();

const MAX_LOGIN_ATTEMPTS = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function checkLoginRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const record = loginRateLimits.get(ip);

  if (!record) {
    loginRateLimits.set(ip, { count: 0, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true };
  }

  if (record.blockedUntil && record.blockedUntil > now) {
    const waitSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + RATE_WINDOW_MS;
    delete record.blockedUntil;
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  let record = loginRateLimits.get(ip);
  if (!record) {
    record = { count: 1, resetAt: now + RATE_WINDOW_MS };
    loginRateLimits.set(ip, record);
    return;
  }

  record.count += 1;
  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
  }
}

export function resetLoginRateLimit(ip: string): void {
  loginRateLimits.delete(ip);
}

export function createSessionToken(adminId: string): string {
  const db = getDb();
  const token = crypto.randomBytes(48).toString('hex');
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

  // Purge expired sessions
  db.sessions = db.sessions.filter((s) => s.expiresAt > Date.now());

  db.sessions.push({
    token,
    adminId,
    expiresAt,
    createdAt: new Date().toISOString(),
  });

  saveDb(db);
  return token;
}

export function validateSessionToken(token: string): AdminUser | null {
  if (!token) return null;
  const db = getDb();
  const session = db.sessions.find((s) => s.token === token && s.expiresAt > Date.now());
  if (!session) return null;

  const admin = db.admins.find((a) => a.id === session.adminId);
  return admin || null;
}

export function revokeSessionToken(token: string): void {
  const db = getDb();
  db.sessions = db.sessions.filter((s) => s.token !== token);
  saveDb(db);
}

export interface AuthenticatedRequest extends Request {
  admin?: AdminUser;
  token?: string;
}

export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.headers['x-admin-token']) {
    token = String(req.headers['x-admin-token']).trim();
  }

  if (!token) {
    res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
    return;
  }

  const admin = validateSessionToken(token);
  if (!admin) {
    res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
    return;
  }

  req.admin = admin;
  req.token = token;
  next();
}
