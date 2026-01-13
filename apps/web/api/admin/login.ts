import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { verifyPassword, generateAdminToken, setAdminCookie, getAdminUser } from '../utils/admin-auth';

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    
    // Rate limiting
    if (!checkRateLimit(ip as string)) {
      return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Get admin user
    const adminUser = await getAdminUser(username);
    if (!adminUser) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get password hash from database
    const { data: adminData, error } = await supabase
      .from('admin_users')
      .select('password_hash')
      .eq('username', username)
      .single();

    if (error || !adminData) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await verifyPassword(password, adminData.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const session = {
      adminId: adminUser.id,
      username: adminUser.username,
      role: adminUser.role,
    };

    const token = generateAdminToken(session);

    // Set cookie
    setAdminCookie(res, token);

    return res.status(200).json({
      admin: {
        id: adminUser.id,
        username: adminUser.username,
        role: adminUser.role,
        must_change_password: adminUser.must_change_password,
      },
      token, // Also return token for header-based auth
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
