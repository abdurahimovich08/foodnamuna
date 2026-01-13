import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { getTelegramUserId } from '../../utils/telegram-auth';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { initData } = req.body;
    const orderId = req.query.id as string;

    if (!initData) {
      return res.status(401).json({ error: 'initData is required' });
    }

    const tgUserId = getTelegramUserId(initData);
    if (!tgUserId) {
      return res.status(401).json({ error: 'Invalid initData' });
    }

    // Fetch order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('tg_id', tgUserId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Fetch order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) {
      throw itemsError;
    }

    return res.status(200).json({
      ...order,
      items: items || [],
    });
  } catch (error) {
    console.error('Order fetch error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
