import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { requireAdminAuth, hashPassword } from '../utils/admin-auth';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only owner can manage admin users
  const session = requireAdminAuth(req, res, ['owner']);
  if (!session) return;

  if (session.role !== 'owner') {
    return res.status(403).json({ error: 'Forbidden: Owner role required' });
  }

  const adminId = req.query.id as string | undefined;
  const action = req.query.action as string | undefined;

  try {
    // Reset password action
    if (action === 'reset-password' && adminId && req.method === 'POST') {
      const { new_password } = req.body;

      if (!new_password || new_password.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }

      const passwordHash = await hashPassword(new_password);

      const { error } = await supabase
        .from('admin_users')
        .update({
          password_hash: passwordHash,
          must_change_password: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', adminId);

      if (error) throw error;
      return res.status(200).json({ message: 'Password reset successfully' });
    }

    if (req.method === 'GET') {
      // List all admin users or get single admin user
      if (adminId) {
        const { data, error } = await supabase
          .from('admin_users')
          .select('id, username, role, is_active, must_change_password, created_at')
          .eq('id', adminId)
          .single();

        if (error) throw error;
        return res.status(200).json(data);
      } else {
        const { data, error } = await supabase
          .from('admin_users')
          .select('id, username, role, is_active, must_change_password, created_at')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return res.status(200).json(data || []);
      }
    }

    if (req.method === 'POST' && !adminId) {
      // Create admin user
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
        if (error.code === '23505') {
          return res.status(400).json({ error: 'Username already exists' });
        }
        throw error;
      }

      return res.status(201).json(data);
    }

    if (req.method === 'PATCH' && adminId) {
      // Update admin user
      const { role, is_active } = req.body;

      const updateData: any = { updated_at: new Date().toISOString() };
      if (role !== undefined) {
        if (!['owner', 'manager', 'operator'].includes(role)) {
          return res.status(400).json({ error: 'Invalid role' });
        }
        updateData.role = role;
      }
      if (is_active !== undefined) {
        updateData.is_active = is_active;
      }

      const { data, error } = await supabase
        .from('admin_users')
        .update(updateData)
        .eq('id', adminId)
        .select('id, username, role, is_active, must_change_password, created_at')
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Admin users error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
