# Environment Variables Setup Guide

## Frontend (apps/web)

### 1. Create `.env.local` file

```bash
cd apps/web
copy env.example .env.local
```

### 2. Fill in the values

Open `.env.local` and update:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_RESTAURANT_ID=00000000-0000-0000-0000-000000000001
VITE_API_BASE=
```

**Where to get these:**
- Go to [Supabase Dashboard](https://supabase.com/dashboard)
- Select your project
- Go to Settings > API
- Copy:
  - **Project URL** → `VITE_SUPABASE_URL`
  - **anon public** key → `VITE_SUPABASE_ANON_KEY`
  - **service_role** key → (for Vercel, not here)

---

## Bot (apps/bot)

### 1. Create `.env` file

```bash
cd apps/bot
copy env.example .env
```

### 2. Fill in the values

Open `.env` and update:

```env
BOT_TOKEN=your_telegram_bot_token_here
MINI_APP_URL=https://your-app.vercel.app
ADMIN_CHAT_ID=your_telegram_chat_id_here
```

**Where to get these:**
- **BOT_TOKEN**: Message [@BotFather](https://t.me/botfather) on Telegram, send `/newbot`
- **MINI_APP_URL**: Your Vercel deployment URL (after deploying)
- **ADMIN_CHAT_ID**: Message [@userinfobot](https://t.me/userinfobot) on Telegram to get your user ID

---

## Backend (Vercel Environment Variables)

These are set in **Vercel Dashboard**, not in `.env` files:

1. Go to your Vercel project dashboard
2. Go to Settings > Environment Variables
3. Add these variables:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Telegram
BOT_TOKEN=your_telegram_bot_token_here
ADMIN_CHAT_ID=your_telegram_chat_id_here

# Restaurant
RESTAURANT_ID=00000000-0000-0000-0000-000000000001
VITE_RESTAURANT_ID=00000000-0000-0000-0000-000000000001

# Admin Panel JWT Secret
ADMIN_JWT_SECRET=your_random_secret_key_here
```

**Important:**
- `SUPABASE_SERVICE_ROLE_KEY` - Get from Supabase Dashboard > Settings > API
- `ADMIN_JWT_SECRET` - Generate a random string (e.g., use `openssl rand -hex 32`)

---

## Quick Setup Commands

### Windows (PowerShell):

```powershell
# Frontend
cd apps/web
Copy-Item env.example .env.local
# Then edit .env.local with your values

# Bot
cd apps/bot
Copy-Item env.example .env
# Then edit .env with your values
```

### Linux/Mac:

```bash
# Frontend
cd apps/web
cp env.example .env.local
# Then edit .env.local with your values

# Bot
cd apps/bot
cp env.example .env
# Then edit .env with your values
```

---

## Verification

After setting up:

1. **Frontend**: Run `npm run dev` - should start without errors
2. **Bot**: Run `npm run dev` - should connect to Telegram
3. **Vercel**: Deploy and check logs for any missing environment variables

---

## Security Notes

- ✅ `.env.local` and `.env` files are in `.gitignore` (won't be committed)
- ✅ Never commit secrets to Git
- ✅ Use different secrets for development and production
- ✅ Rotate secrets regularly in production
