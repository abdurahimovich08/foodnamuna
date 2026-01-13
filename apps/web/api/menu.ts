import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const restaurantId = req.query.restaurant_id as string || process.env.RESTAURANT_ID || '00000000-0000-0000-0000-000000000001';

    // Fetch categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true)
      .order('sort', { ascending: true });

    if (categoriesError) {
      throw categoriesError;
    }

    // Fetch products for each category
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true)
      .order('sort', { ascending: true });

    if (productsError) {
      throw productsError;
    }

    // Fetch addons for all products
    const productIds = products.map((p) => p.id);
    const { data: addons, error: addonsError } = await supabase
      .from('product_addons')
      .select('*')
      .in('product_id', productIds)
      .eq('is_active', true)
      .order('sort', { ascending: true });

    if (addonsError) {
      throw addonsError;
    }

    // Group addons by product_id
    const addonsByProduct = (addons || []).reduce((acc, addon) => {
      if (!acc[addon.product_id]) {
        acc[addon.product_id] = [];
      }
      acc[addon.product_id].push(addon);
      return acc;
    }, {} as Record<string, any[]>);

    // Group products by category_id
    const productsByCategory = (products || []).reduce((acc, product) => {
      if (!acc[product.category_id]) {
        acc[product.category_id] = [];
      }
      acc[product.category_id].push({
        ...product,
        addons: addonsByProduct[product.id] || [],
      });
      return acc;
    }, {} as Record<string, any[]>);

    // Build response
    const menu = (categories || []).map((category) => ({
      ...category,
      products: productsByCategory[category.id] || [],
    }));

    return res.status(200).json(menu);
  } catch (error) {
    console.error('Menu fetch error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
