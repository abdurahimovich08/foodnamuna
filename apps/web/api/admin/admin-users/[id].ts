import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { requireAdminAuth } from '../../utils/admin-auth';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only owner can manage admin users
  const session = requireAdminAuth(req, res, ['owner']);
  if (!session) return;

  const id = req.query.id as string;

  if (req.method === 'PATCH') {
    try {
      const { role, is_active } = req.body;

      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

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
        .eq('id', id)
        .select('id, username, role, is_active, must_change_password, created_at')
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    } catch (error) {
      console.error('Admin user update error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
