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
  const productId = req.query.id as string | undefined;

  try {
    if (req.method === 'GET') {
      // List all products or get single product
      if (productId) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .eq('restaurant_id', restaurantId)
          .single();

        if (error) throw error;
        return res.status(200).json(data);
      } else {
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
      }
    }

    if (req.method === 'POST') {
      // Create product
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
    }

    if (req.method === 'PATCH' && productId) {
      // Update product
      const { title, description, price, category_id, image_url, is_active, sort, tags } = req.body;

      const updateData: any = { updated_at: new Date().toISOString() };
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = parseInt(price);
      if (category_id !== undefined) updateData.category_id = category_id;
      if (image_url !== undefined) updateData.image_url = image_url;
      if (is_active !== undefined) updateData.is_active = is_active;
      if (sort !== undefined) updateData.sort = sort;
      if (tags !== undefined) updateData.tags = tags;

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId)
        .eq('restaurant_id', restaurantId)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE' && productId) {
      // Delete product (soft delete)
      const { data, error } = await supabase
        .from('products')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', productId)
        .eq('restaurant_id', restaurantId)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ message: 'Product deleted', data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Products error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
