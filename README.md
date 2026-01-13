# Zahratun Food - Telegram Mini App

Telegram Mini App va Bot orqali restoran buyurtma tizimi.

## Tech Stack

- **Frontend**: React + Vite + TypeScript + TailwindCSS
- **Backend**: Vercel Serverless Functions (Node.js/TS)
- **Database**: Supabase Postgres
- **Bot**: Telegraf (Node.js)
- **State Management**: Zustand
- **UI Components**: Headless UI

## Project Structure

```
foodnamuna/
├── apps/
│   ├── web/          # React frontend + Vercel API
│   └── bot/          # Telegram bot
├── packages/
│   └── shared/       # Shared TypeScript types
└── supabase/
    ├── migrations.sql
    └── seed.sql
```

## Setup

### 1. Database Setup (Supabase)

1. Create a new Supabase project
2. Run migrations:
   ```sql
   -- Copy and run supabase/migrations.sql in Supabase SQL Editor
   ```
3. Seed data:
   ```sql
   -- Copy and run supabase/seed.sql in Supabase SQL Editor
   ```

### 2. Environment Variables

#### Frontend (apps/web/.env.local)

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RESTAURANT_ID=00000000-0000-0000-0000-000000000001
VITE_API_BASE=
```

#### Backend (Vercel Environment Variables)

```env
VITE_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
BOT_TOKEN=your_telegram_bot_token
ADMIN_CHAT_ID=your_telegram_chat_id
RESTAURANT_ID=00000000-0000-0000-0000-000000000001
```

#### Bot (apps/bot/.env)

```env
BOT_TOKEN=your_telegram_bot_token
MINI_APP_URL=https://your-app.vercel.app
ADMIN_CHAT_ID=your_telegram_chat_id
```

### 3. Install Dependencies

```bash
# Root
npm install

# Web app
cd apps/web
npm install

# Bot
cd apps/bot
npm install
```

### 4. Run Locally

#### Frontend
```bash
cd apps/web
npm run dev
```

#### Bot
```bash
cd apps/bot
npm run dev
```

## Deployment

### Frontend + API (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy:
   ```bash
   cd apps/web
   vercel
   ```
3. Set environment variables in Vercel dashboard
4. Update `MINI_APP_URL` in bot `.env` with your Vercel URL

### Bot (Render/Fly.io/VPS)

#### Render
1. Create new Web Service
2. Connect GitHub repo
3. Set:
   - Build Command: `cd apps/bot && npm install && npm run build`
   - Start Command: `cd apps/bot && npm start`
4. Add environment variables

#### Fly.io
```bash
cd apps/bot
fly launch
fly secrets set BOT_TOKEN=... MINI_APP_URL=... ADMIN_CHAT_ID=...
fly deploy
```

## Telegram Bot Setup

1. Create bot via [@BotFather](https://t.me/botfather)
2. Get bot token
3. Set web app:
   ```
   /newapp
   Select your bot
   Enter app title: Zahratun Food
   Enter short description: Restoran buyurtma tizimi
   Upload photo (optional)
   Enter web app URL: https://your-app.vercel.app
   ```

## Features

- ✅ Telegram Mini App integration
- ✅ Telegram authentication (initData verification)
- ✅ Product catalog with categories
- ✅ Shopping cart with addons
- ✅ Order placement (delivery/pickup)
- ✅ Order history
- ✅ Admin notifications via Telegram
- ✅ Responsive UI with TailwindCSS

## API Endpoints

- `POST /api/auth/telegram` - Verify Telegram initData and upsert user
- `GET /api/menu?restaurant_id=...` - Get menu (categories + products + addons)
- `POST /api/orders/create` - Create order (requires initData)
- `POST /api/orders/list` - Get user orders (requires initData)
- `POST /api/orders/:id` - Get order detail (requires initData)
- `GET /api/branches?restaurant_id=...` - Get branches

## Security

- All protected endpoints verify Telegram initData using HMAC SHA256
- Order totals calculated server-side (not trusted from client)
- Product prices fetched from database on order creation

## License

MIT
