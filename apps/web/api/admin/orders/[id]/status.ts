import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { requireAdminAuth } from '../../../utils/admin-auth';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const botToken = process.env.BOT_TOKEN;

const supabase = createClient(supabaseUrl, supabaseKey);

const VALID_STATUSES = ['new', 'preparing', 'ready', 'delivered', 'cancelled'];
const STATUS_TRANSITIONS: Record<string, string[]> = {
  new: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['delivered'],
  delivered: [],
  cancelled: [],
};

async function notifyCustomer(tgId: number, status: string) {
  if (!botToken) return;

  const statusMessages: Record<string, string> = {
    preparing: '✅ Buyurtmangiz qabul qilindi va tayyorlanmoqda.',
    ready: '🎉 Buyurtmangiz tayyor! Tez orada yetkazib beramiz.',
    delivered: '🎊 Buyurtmangiz yetkazildi! Yana buyurtma berishingiz mumkin.',
    cancelled: '❌ Buyurtmangiz bekor qilindi. Qo\'shimcha ma\'lumot uchun biz bilan bog\'laning.',
  };

  const message = statusMessages[status];
  if (!message) return;

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: tgId,
        text: message,
      }),
    });
  } catch (error) {
    console.error('Telegram notification error:', error);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = requireAdminAuth(req, res);
    if (!session) return;

    const orderId = req.query.id as string;
    const { to_status } = req.body;

    if (!to_status || !VALID_STATUSES.includes(to_status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Get current order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('status, tg_id')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const fromStatus = order.status;

    // Validate transition
    const allowedTransitions = STATUS_TRANSITIONS[fromStatus] || [];
    if (!allowedTransitions.includes(to_status)) {
      return res.status(400).json({ 
        error: `Cannot transition from ${fromStatus} to ${to_status}` 
      });
    }

    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: to_status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      throw updateError;
    }

    // Log status change
    await supabase
      .from('order_status_logs')
      .insert({
        order_id: orderId,
        admin_id: session.adminId,
        from_status: fromStatus,
        to_status: to_status,
      });

    // Notify customer
    await notifyCustomer(order.tg_id, to_status);

    return res.status(200).json({ 
      message: 'Order status updated successfully',
      order_id: orderId,
      from_status: fromStatus,
      to_status: to_status,
    });
  } catch (error) {
    console.error('Status update error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
