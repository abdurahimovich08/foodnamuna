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

    const { data: branches, error } = await supabase
      .from('branches')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true)
      .order('title', { ascending: true });

    if (error) {
      throw error;
    }

    return res.status(200).json(branches || []);
  } catch (error) {
    console.error('Branches fetch error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
