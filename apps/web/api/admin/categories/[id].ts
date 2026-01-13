import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { requireAdminAuth } from '../../utils/admin-auth';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const session = requireAdminAuth(req, res, ['owner', 'manager']);
  if (!session) return;

  const id = req.query.id as string;

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    } catch (error) {
      return res.status(404).json({ error: 'Category not found' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { title, sort, is_active, image_url } = req.body;

      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (title !== undefined) updateData.title = title;
      if (sort !== undefined) updateData.sort = sort;
      if (is_active !== undefined) updateData.is_active = is_active;
      if (image_url !== undefined) updateData.image_url = image_url;

      const { data, error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    } catch (error) {
      console.error('Category update error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Soft delete: set is_active to false
      const { error } = await supabase
        .from('categories')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Category delete error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
