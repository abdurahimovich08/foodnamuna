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

    if (!initData) {
      return res.status(401).json({ error: 'initData is required' });
    }

    const tgUserId = getTelegramUserId(initData);
    if (!tgUserId) {
      return res.status(401).json({ error: 'Invalid initData' });
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('tg_id', tgUserId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return res.status(200).json(orders || []);
  } catch (error) {
    console.error('Orders fetch error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
