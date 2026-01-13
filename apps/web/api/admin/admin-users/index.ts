import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { requireAdminAuth, hashPassword } from '../../utils/admin-auth';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only owner can manage admin users
  const session = requireAdminAuth(req, res, ['owner']);
  if (!session) return;

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, username, role, is_active, must_change_password, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data || []);
    } catch (error) {
      console.error('Admin users fetch error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { username, password, role } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      if (!['owner', 'manager', 'operator'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const passwordHash = await hashPassword(password);

      const { data, error } = await supabase
        .from('admin_users')
        .insert({
          username,
          password_hash: passwordHash,
          role,
          is_active: true,
          must_change_password: true,
        })
        .select('id, username, role, is_active, must_change_password, created_at')
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return res.status(400).json({ error: 'Username already exists' });
        }
        throw error;
      }

      return res.status(201).json(data);
    } catch (error) {
      console.error('Admin user create error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
