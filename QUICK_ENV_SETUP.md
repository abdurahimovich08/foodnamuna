# ⚡ Tezkor ENV Sozlash

## ✅ Yaratilgan fayllar:
- `apps/web/env.example` - Frontend template
- `apps/bot/env.example` - Bot template
- `apps/web/.env.local` - Frontend (yaratildi, to'ldirish kerak)
- `apps/bot/.env` - Bot (yaratildi, to'ldirish kerak)

## 🔧 Keyingi qadamlar:

### 1. Frontend ENV to'ldirish

Ochish: `apps/web/.env.local`

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_RESTAURANT_ID=00000000-0000-0000-0000-000000000001
VITE_API_BASE=
```

**Qayerdan olish:**
- [Supabase Dashboard](https://supabase.com/dashboard) > Settings > API

### 2. Bot ENV to'ldirish

Ochish: `apps/bot/.env`

```env
BOT_TOKEN=your_telegram_bot_token_here
MINI_APP_URL=https://your-app.vercel.app
ADMIN_CHAT_ID=your_telegram_chat_id_here
```

**Qayerdan olish:**
- **BOT_TOKEN**: [@BotFather](https://t.me/botfather) > `/newbot`
- **ADMIN_CHAT_ID**: [@userinfobot](https://t.me/userinfobot) ga yozing
- **MINI_APP_URL**: Vercel deploy qilgandan keyin

### 3. Vercel Environment Variables

Vercel Dashboard > Settings > Environment Variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
BOT_TOKEN=your_telegram_bot_token
ADMIN_CHAT_ID=your_telegram_chat_id
RESTAURANT_ID=00000000-0000-0000-0000-000000000001
VITE_RESTAURANT_ID=00000000-0000-0000-0000-000000000001
ADMIN_JWT_SECRET=your_random_secret_key
```

**ADMIN_JWT_SECRET yaratish:**
```bash
# Linux/Mac
openssl rand -hex 32

# Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

---

## ✅ Tekshirish

```bash
# Frontend
cd apps/web
npm run dev
# Browser: http://localhost:3000

# Bot
cd apps/bot
npm run dev
# Telegram'da /start yuboring
```

---

**Batafsil**: `ENV_SETUP.md` faylini ko'ring.
