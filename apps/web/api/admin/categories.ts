import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { requireAdminAuth } from '../utils/admin-auth';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const session = requireAdminAuth(req, res, ['owner', 'manager']);
  if (!session) return;

  // Check role (owner or manager only)
  if (session.role !== 'owner' && session.role !== 'manager') {
    return res.status(403).json({ error: 'Forbidden: Owner or Manager role required' });
  }

  const restaurantId = process.env.RESTAURANT_ID || '00000000-0000-0000-0000-000000000001';
  const categoryId = req.query.id as string | undefined;

  try {
    if (req.method === 'GET') {
      // List all categories or get single category
      if (categoryId) {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('id', categoryId)
          .eq('restaurant_id', restaurantId)
          .single();

        if (error) throw error;
        return res.status(200).json(data);
      } else {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('sort', { ascending: true });

        if (error) throw error;
        return res.status(200).json(data || []);
      }
    }

    if (req.method === 'POST') {
      // Create category
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
    }

    if (req.method === 'PATCH' && categoryId) {
      // Update category
      const { title, sort, is_active, image_url } = req.body;

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (sort !== undefined) updateData.sort = sort;
      if (is_active !== undefined) updateData.is_active = is_active;
      if (image_url !== undefined) updateData.image_url = image_url;

      const { data, error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', categoryId)
        .eq('restaurant_id', restaurantId)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE' && categoryId) {
      // Delete category (soft delete by setting is_active=false)
      const { data, error } = await supabase
        .from('categories')
        .update({ is_active: false })
        .eq('id', categoryId)
        .eq('restaurant_id', restaurantId)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ message: 'Category deleted', data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Categories error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
