import { Telegraf } from 'telegraf';

const botToken = process.env.BOT_TOKEN;
const miniAppUrl = process.env.MINI_APP_URL || 'https://your-app.vercel.app';

if (!botToken) {
  console.error('BOT_TOKEN is not set');
  process.exit(1);
}

const bot = new Telegraf(botToken);

// Start command
bot.command('start', (ctx) => {
  ctx.reply(
    '👋 Salom! Zahratun Food botiga xush kelibsiz!\n\n' +
      'Buyurtma berish uchun quyidagi tugmani bosing:',
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🍽️ Menyuni ko\'rish',
              web_app: { url: miniAppUrl },
            },
          ],
        ],
      },
    }
  );
});

// Help command
bot.command('help', (ctx) => {
  ctx.reply(
    '📱 Zahratun Food Bot\n\n' +
      'Buyurtma berish uchun /start buyrug\'ini bosing va "Menyuni ko\'rish" tugmasini bosing.\n\n' +
      'Buyurtmalaringizni kuzatish va boshqarish uchun Mini App ichida "Buyurtmalar" bo\'limiga o\'ting.'
  );
});

// Handle errors
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
});

// Start bot
bot.launch().then(() => {
  console.log('Bot started successfully');
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
