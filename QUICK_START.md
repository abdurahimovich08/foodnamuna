# Quick Start Guide

## 5 daqiqada ishga tushirish

### 1. Dependencies O'rnatish ✅

```bash
npm install
cd apps/web && npm install
cd ../bot && npm install
```

### 2. Supabase Setup (5 daqiqa)

1. [supabase.com](https://supabase.com) - Yangi project
2. SQL Editor > `supabase/migrations.sql` ni run qiling
3. SQL Editor > `supabase/seed.sql` ni run qiling
4. Settings > API > URL va keys ni ko'chirib oling

### 3. Telegram Bot (2 daqiqa)

1. [@BotFather](https://t.me/botfather) > `/newbot`
2. Token ni saqlang
3. `/newapp` > Mini App yarating (URL keyin)

### 4. Environment Variables

**apps/web/.env.local**:
```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_RESTAURANT_ID=00000000-0000-0000-0000-000000000001
```

**apps/bot/.env**:
```env
BOT_TOKEN=your_token
MINI_APP_URL=https://your-app.vercel.app
ADMIN_CHAT_ID=your_chat_id
```

### 5. Local Test

**Terminal 1** (Frontend):
```bash
cd apps/web
npm run dev
```

**Terminal 2** (Bot):
```bash
cd apps/bot
npm run dev
```

### 6. Deploy

**Vercel** (Frontend):
```bash
cd apps/web
vercel
# Environment variables qo'shing
```

**Render** (Bot):
- GitHub repo ulash
- Build: `cd apps/bot && npm install && npm run build`
- Start: `cd apps/bot && npm start`

### 7. Mini App URL Yangilash

BotFather > `/newapp` > URL ni yangilang

---

## Tekshirish

1. ✅ Bot `/start` javob beradi
2. ✅ Mini App ochiladi
3. ✅ Mahsulotlar ko'rinadi
4. ✅ Savatga qo'shish ishlaydi
5. ✅ Buyurtma yaratiladi
6. ✅ Admin'ga xabar keladi

---

**Batafsil**: `SETUP.md` va `DEPLOYMENT.md` fayllarini ko'ring.
