import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { 
  getAdminUser, 
  verifyPassword, 
  hashPassword, 
  generateAdminToken, 
  setAdminCookie, 
  clearAdminCookie,
  getAdminFromRequest,
  getAdminUserById
} from '../utils/admin-auth';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Simple rate limiting (in-memory, for production use Redis)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt || attempt.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (attempt.count >= MAX_ATTEMPTS) {
    return false;
  }

  attempt.count++;
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = req.query.action as string | undefined;

  try {
    // Login
    if (action === 'login' && req.method === 'POST') {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      
      // Rate limiting
      if (!checkRateLimit(ip as string)) {
        return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
      }
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const adminUser = await getAdminUser(username);
      if (!adminUser) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Get password hash from database
      const { data: adminData, error: fetchError } = await supabase
        .from('admin_users')
        .select('password_hash')
        .eq('username', username)
        .single();

      if (fetchError || !adminData) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValid = await verifyPassword(password, adminData.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateAdminToken({
        adminId: adminUser.id,
        username: adminUser.username,
        role: adminUser.role,
      });

      setAdminCookie(res, token);

      return res.status(200).json({
        admin: {
          id: adminUser.id,
          username: adminUser.username,
          role: adminUser.role,
          must_change_password: adminUser.must_change_password,
        },
        token,
      });
    }

    // Logout
    if (action === 'logout' && req.method === 'POST') {
      clearAdminCookie(res);
      return res.status(200).json({ message: 'Logged out successfully' });
    }

    // Me (get current admin)
    if (action === 'me' && req.method === 'GET') {
      const session = getAdminFromRequest(req);
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const adminUser = await getAdminUserById(session.adminId);
      if (!adminUser) {
        return res.status(401).json({ error: 'Admin user not found' });
      }

      return res.status(200).json({
        admin: {
          id: adminUser.id,
          username: adminUser.username,
          role: adminUser.role,
          must_change_password: adminUser.must_change_password,
        },
      });
    }

    // Change password
    if (action === 'change-password' && req.method === 'POST') {
      const session = getAdminFromRequest(req);
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { current_password, new_password } = req.body;

      if (!current_password || !new_password) {
        return res.status(400).json({ error: 'Current password and new password are required' });
      }

      if (new_password.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }

      const adminUser = await getAdminUserById(session.adminId);
      if (!adminUser) {
        return res.status(401).json({ error: 'Admin user not found' });
      }

      // Get current password hash
      const { data: adminData, error: fetchError } = await supabase
        .from('admin_users')
        .select('password_hash')
        .eq('id', session.adminId)
        .single();

      if (fetchError || !adminData) {
        return res.status(404).json({ error: 'Admin user not found' });
      }

      const isValid = await verifyPassword(current_password, adminData.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      const newPasswordHash = await hashPassword(new_password);

      const { error } = await supabase
        .from('admin_users')
        .update({
          password_hash: newPasswordHash,
          must_change_password: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.adminId);

      if (error) throw error;

      return res.status(200).json({ message: 'Password changed successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
