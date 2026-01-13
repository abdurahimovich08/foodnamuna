import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const telegramId = req.query.telegram_id as string;
    
    if (!telegramId) {
      return res.status(400).json({ error: 'telegram_id is required' });
    }

    const telegramIdNum = typeof telegramId === 'string' ? parseInt(telegramId, 10) : telegramId;
    
    if (isNaN(telegramIdNum)) {
      return res.status(400).json({ error: 'Invalid telegram_id format' });
    }

    console.log('Checking admin for telegram_id:', telegramIdNum);

    // Check if telegram_id exists in admin_users
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, username, role, is_active')
      .eq('telegram_id', telegramIdNum)
      .eq('is_active', true)
      .single();

    console.log('Admin check result:', { data, error: error?.message });

    if (error || !data) {
      return res.status(200).json({ is_admin: false });
    }

    return res.status(200).json({
      is_admin: true,
      admin: {
        id: data.id,
        username: data.username,
        role: data.role,
      },
    });
  } catch (error) {
    console.error('Check telegram admin error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
