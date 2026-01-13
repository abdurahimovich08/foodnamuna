import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { requireAdminAuth } from '../../utils/admin-auth';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = requireAdminAuth(req, res);
    if (!session) return; // Response already sent

    const status = req.query.status as string | undefined;
    const restaurantId = process.env.RESTAURANT_ID || '00000000-0000-0000-0000-000000000001';

    let query = supabase
      .from('orders')
      .select(`
        *,
        tg_users:tg_id (
          tg_id,
          username,
          first_name,
          last_name
        )
      `)
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: orders, error } = await query;

    if (error) {
      throw error;
    }

    return res.status(200).json(orders || []);
  } catch (error) {
    console.error('Orders fetch error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
