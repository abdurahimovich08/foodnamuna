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
      const categoryId = req.query.category_id as string | undefined;

      let query = supabase
        .from('products')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('sort', { ascending: true });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return res.status(200).json(data || []);
    } catch (error) {
      console.error('Products fetch error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, description, price, category_id, image_url, is_active, sort, tags } = req.body;

      if (!title || !price || !category_id) {
        return res.status(400).json({ error: 'Title, price, and category_id are required' });
      }

      const { data, error } = await supabase
        .from('products')
        .insert({
          restaurant_id: restaurantId,
          title,
          description,
          price: parseInt(price),
          category_id,
          image_url,
          is_active: is_active !== undefined ? is_active : true,
          sort: sort || 0,
          tags: tags || [],
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    } catch (error) {
      console.error('Product create error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
