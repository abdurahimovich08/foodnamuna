import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { getTelegramUserId } from '../utils/telegram-auth';
import { validateOrderRequest } from './utils/validators';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const orderId = req.query.id as string | undefined;

  try {
    if (req.method === 'GET') {
      // List orders or get single order
      const { initData } = req.query;

      if (!initData) {
        return res.status(401).json({ error: 'initData is required' });
      }

      const tgUserId = getTelegramUserId(initData as string);
      if (!tgUserId) {
        return res.status(401).json({ error: 'Invalid initData' });
      }

      if (orderId) {
        // Get single order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .eq('tg_id', tgUserId)
          .single();

        if (orderError || !order) {
          return res.status(404).json({ error: 'Order not found' });
        }

        // Get order items
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderId);

        if (itemsError) throw itemsError;

        return res.status(200).json({
          ...order,
          items: items || [],
        });
      } else {
        // List orders
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*')
          .eq('tg_id', tgUserId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return res.status(200).json(orders || []);
      }
    }

    if (req.method === 'POST' && !orderId) {
      // Create order
      const { initData, ...orderData } = req.body;

      if (!initData) {
        return res.status(401).json({ error: 'initData is required' });
      }

      const tgUserId = getTelegramUserId(initData);
      if (!tgUserId) {
        return res.status(401).json({ error: 'Invalid initData' });
      }

      if (!validateOrderRequest(orderData)) {
        return res.status(400).json({ error: 'Invalid order data' });
      }

      const restaurantId = process.env.RESTAURANT_ID || '00000000-0000-0000-0000-000000000001';

      // Fetch product prices from DB
      const productIds = orderData.items.map((item: any) => item.product_id);
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, price')
        .in('id', productIds);

      if (productsError) throw productsError;

      const productPriceMap = (products || []).reduce((acc, p) => {
        acc[p.id] = p.price;
        return acc;
      }, {} as Record<string, number>);

      // Calculate total
      let total = 0;
      for (const item of orderData.items) {
        const basePrice = productPriceMap[item.product_id] || item.price;
        total += basePrice * item.qty;
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          restaurant_id: restaurantId,
          tg_id: tgUserId,
          status: 'new',
          delivery_mode: orderData.delivery_mode,
          phone: orderData.phone,
          address: orderData.address,
          pickup_branch_id: orderData.pickup_branch_id,
          comment: orderData.comment,
          total,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = orderData.items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        title: item.title,
        price: productPriceMap[item.product_id] || item.price,
        qty: item.qty,
        addons_json: item.selected_addons || [],
        item_comment: item.item_comment,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Notify admin
      const adminChatId = process.env.ADMIN_CHAT_ID;
      const botToken = process.env.BOT_TOKEN;
      if (adminChatId && botToken) {
        try {
          const itemsText = orderData.items
            .map((item: any) => `  • ${item.title} x${item.qty} - ${item.price * item.qty} UZS`)
            .join('\n');
          
          const message = `🆕 Yangi buyurtma!\n\n` +
            `ID: ${order.id}\n` +
            `Foydalanuvchi: ${tgUserId}\n` +
            `Telefon: ${orderData.phone}\n` +
            `Rejim: ${orderData.delivery_mode === 'delivery' ? 'Yetkazish' : 'Olib ketish'}\n` +
            (orderData.address ? `Manzil: ${orderData.address}\n` : '') +
            (orderData.comment ? `Izoh: ${orderData.comment}\n` : '') +
            `\nMahsulotlar:\n${itemsText}\n\n` +
            `Jami: ${total} UZS`;

          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: adminChatId,
              text: message,
            }),
          });
        } catch (notifyError) {
          console.error('Admin notification error:', notifyError);
        }
      }

      return res.status(201).json(order);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Orders error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
