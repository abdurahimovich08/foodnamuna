import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const jwtSecret = process.env.ADMIN_JWT_SECRET || process.env.BOT_TOKEN || 'change-this-secret-in-production';

const supabase = createClient(supabaseUrl, supabaseKey);

export interface AdminUser {
  id: string;
  username: string;
  role: 'owner' | 'manager' | 'operator';
  is_active: boolean;
  must_change_password: boolean;
}

export interface AdminSession {
  adminId: string;
  username: string;
  role: 'owner' | 'manager' | 'operator';
}

// Generate JWT token
export function generateAdminToken(session: AdminSession): string {
  return jwt.sign(session, jwtSecret, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyAdminToken(token: string): AdminSession | null {
  try {
    return jwt.verify(token, jwtSecret) as AdminSession;
  } catch {
    return null;
  }
}

// Get admin from request (cookie or header)
export function getAdminFromRequest(req: VercelRequest): AdminSession | null {
  // Check cookie first
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    
    const cookieToken = cookies.admin_token;
    if (cookieToken) {
      const session = verifyAdminToken(cookieToken);
      if (session) return session;
    }
  }

  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return verifyAdminToken(token);
  }

  return null;
}

// Set admin cookie
export function setAdminCookie(res: VercelResponse, token: string): void {
  res.setHeader('Set-Cookie', `admin_token=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}`);
}

// Clear admin cookie
export function clearAdminCookie(res: VercelResponse): void {
  res.setHeader('Set-Cookie', 'admin_token=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Get admin user from database
export async function getAdminUser(username: string): Promise<AdminUser | null> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('username', username)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    username: data.username,
    role: data.role,
    is_active: data.is_active,
    must_change_password: data.must_change_password,
  };
}

// Get admin user by ID
export async function getAdminUserById(id: string): Promise<AdminUser | null> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    username: data.username,
    role: data.role,
    is_active: data.is_active,
    must_change_password: data.must_change_password,
  };
}

// Middleware to require admin auth
export function requireAdminAuth(
  req: VercelRequest,
  res: VercelResponse,
  allowedRoles?: ('owner' | 'manager' | 'operator')[]
): AdminSession | null {
  const session = getAdminFromRequest(req);
  
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    res.status(403).json({ error: 'Forbidden' });
    return null;
  }

  return session;
}
