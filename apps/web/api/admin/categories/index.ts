import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { requireAdminAuth } from '../../utils/admin-auth';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const session = requireAdminAuth(req, res, ['owner', 'manager']);
  if (!session) return;

  const restaurantId = process.env.RESTAURANT_ID || '00000000-0000-0000-0000-000000000001';

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('sort', { ascending: true });

      if (error) throw error;
      return res.status(200).json(data || []);
    } catch (error) {
      console.error('Categories fetch error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, sort, is_active, image_url } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const { data, error } = await supabase
        .from('categories')
        .insert({
          restaurant_id: restaurantId,
          title,
          sort: sort || 0,
          is_active: is_active !== undefined ? is_active : true,
          image_url,
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    } catch (error) {
      console.error('Category create error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
