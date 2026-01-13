# Setup Qo'llanmasi

## 1. Supabase Database Setup

### 1.1. Supabase Project Yaratish

1. [Supabase](https://supabase.com) ga kiring
2. Yangi project yarating
3. Project Settings > API dan quyidagilarni ko'chirib oling:
   - **Project URL** (misol: `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (secret!)

### 1.2. Database Migrations

1. Supabase Dashboard > SQL Editor ga o'ting
2. `supabase/migrations.sql` faylini ochib, barcha SQL kodini nusxalang
3. SQL Editor ga yopishtiring va **Run** tugmasini bosing
4. Xuddi shunday `supabase/seed.sql` ni ham ishga tushiring

### 1.3. Tekshirish

SQL Editor da quyidagi so'rovni bajaring:
```sql
SELECT COUNT(*) FROM restaurants;
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM products;
```

Agar sonlar ko'rsatilsa, database to'g'ri sozlangan.

---

## 2. Telegram Bot Yaratish

### 2.1. Bot Token Olish

1. Telegram'da [@BotFather](https://t.me/botfather) ga yozing
2. `/newbot` buyrug'ini yuboring
3. Bot nomini kiriting (masalan: "Zahratun Food Bot")
4. Bot username kiriting (masalan: "zahratun_food_bot")
5. Bot token ni saqlang (masalan: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2.2. Mini App Yaratish

1. BotFather'da `/newapp` buyrug'ini yuboring
2. Botingizni tanlang
3. App title: **Zahratun Food**
4. Short description: **Restoran buyurtma tizimi**
5. Photo yuklash (ixtiyoriy)
6. Web App URL: **Hozircha bo'sh qoldiring** (deploy qilgandan keyin to'ldirasiz)

---

## 3. Environment Variables Sozlash

### 3.1. Frontend (apps/web/.env.local)

`.env.local` faylini yarating:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_RESTAURANT_ID=00000000-0000-0000-0000-000000000001
VITE_API_BASE=
```

**Eslatma**: `.env.local` fayl `.gitignore` da, shuning uchun GitHub'ga yuklanmaydi.

### 3.2. Backend (Vercel Environment Variables)

Vercel'ga deploy qilgandan keyin quyidagilarni qo'shing:

- `VITE_SUPABASE_URL` - Supabase Project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service_role key (secret!)
- `BOT_TOKEN` - Telegram bot token
- `ADMIN_CHAT_ID` - Sizning Telegram chat ID (qadam 4 da olasiz)
- `RESTAURANT_ID` - `00000000-0000-0000-0000-000000000001`
- `VITE_RESTAURANT_ID` - Xuddi shu

### 3.3. Bot (apps/bot/.env)

`.env` faylini yarating:

```env
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
MINI_APP_URL=https://your-app.vercel.app
ADMIN_CHAT_ID=123456789
```

**Eslatma**: `MINI_APP_URL` ni deploy qilgandan keyin to'ldirasiz.

---

## 4. Admin Chat ID Olish

1. Botingizga Telegram'da xabar yuboring (har qanday matn)
2. Browser'da quyidagi URL'ni oching (BOT_TOKEN o'rniga o'zingiznikini qo'ying):
   ```
   https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
   ```
3. JSON javobda `"chat":{"id":123456789}` qismini toping
4. Bu raqam sizning `ADMIN_CHAT_ID` ingiz

**Misol**:
```json
{
  "ok": true,
  "result": [
    {
      "update_id": 123456,
      "message": {
        "chat": {
          "id": 987654321,  // <-- Bu sizning ADMIN_CHAT_ID
          "first_name": "Sizning Ismingiz"
        }
      }
    }
  ]
}
```

---

## 5. Local Development

### 5.1. Frontend Ishga Tushirish

```bash
cd apps/web
npm run dev
```

Brauzerda `http://localhost:3000` ni oching.

**Eslatma**: Telegram Mini App faqat Telegram ichida ishlaydi. Local development uchun:
- Telegram Desktop'da bot orqali ochish
- Yoki `window.Telegram?.WebApp` mavjudligini tekshirish

### 5.2. Bot Ishga Tushirish

```bash
cd apps/bot
npm run dev
```

Bot ishga tushganda, Telegram'da `/start` buyrug'ini yuborib test qiling.

---

## 6. Deploy Qilish

### 6.1. Frontend + API (Vercel)

1. Vercel CLI o'rnatish:
   ```bash
   npm i -g vercel
   ```

2. Login qilish:
   ```bash
   vercel login
   ```

3. Deploy qilish:
   ```bash
   cd apps/web
   vercel
   ```

4. Environment variables qo'shish:
   - Vercel Dashboard > Project > Settings > Environment Variables
   - Yuqoridagi barcha o'zgaruvchilarni qo'shing

5. Deployment URL ni oling (masalan: `https://zahratun-food.vercel.app`)

6. BotFather'da Mini App URL ni yangilang:
   - `/newapp` > Botingizni tanlang > Web App URL ni yangilang

### 6.2. Bot (Render)

1. [Render](https://render.com) ga kiring
2. New > Web Service
3. GitHub repository ni ulang
4. Sozlamalar:
   - **Name**: `zahratun-bot`
   - **Environment**: `Node`
   - **Build Command**: `cd apps/bot && npm install && npm run build`
   - **Start Command**: `cd apps/bot && npm start`
5. Environment Variables qo'shing:
   - `BOT_TOKEN`
   - `MINI_APP_URL` (Vercel URL)
   - `ADMIN_CHAT_ID`
6. Deploy qilish

---

## 7. Tekshirish Ro'yxati

- [ ] Supabase database migrations ishladi
- [ ] Supabase seed data yuklandi
- [ ] Telegram bot yaratildi va token olingan
- [ ] Mini App yaratildi (URL keyin to'ldiriladi)
- [ ] Frontend `.env.local` sozlandi
- [ ] Bot `.env` sozlandi
- [ ] Admin Chat ID olingan
- [ ] Frontend local'da ishlaydi
- [ ] Bot local'da ishlaydi
- [ ] Vercel'ga deploy qilindi
- [ ] Vercel environment variables sozlandi
- [ ] Bot Render'ga deploy qilindi
- [ ] Mini App URL yangilandi
- [ ] Telegram'da test qilindi

---

## 8. Muammolarni Hal Qilish

### Bot javob bermayapti
- Bot token to'g'ri ekanligini tekshiring
- Bot ishlamoqda ekanligini tekshiring (logs)
- Webhook o'rnatilmaganligini tekshiring (polling mode)

### Mini App ochilmayapti
- Vercel deployment live ekanligini tekshiring
- Environment variables to'g'ri ekanligini tekshiring
- Browser console'da xatolarni tekshiring

### Buyurtma yaratilmayapti
- Supabase connection tekshiring
- initData yuborilayotganini tekshiring
- Server logs'ni tekshiring
- BOT_TOKEN Vercel'da o'rnatilganini tekshiring

### Admin xabarlar kelmayapti
- ADMIN_CHAT_ID to'g'ri ekanligini tekshiring
- BOT_TOKEN to'g'ri ekanligini tekshiring
- Bot API test: `https://api.telegram.org/bot<TOKEN>/getMe`

---

## 9. Keyingi Qadamlar

1. **Mahsulotlar qo'shish**: Supabase Dashboard > Table Editor > products
2. **Kategoriyalar qo'shish**: categories jadvalida
3. **Rasmlar**: Product rasmlarini yuklash (image_url)
4. **Filiallar**: branches jadvalida
5. **To'lov integratsiyasi**: Hozircha "Naqd", keyinroq payment gateway qo'shish mumkin

---

## Yordam

Agar muammo bo'lsa:
1. Logs'ni tekshiring
2. Browser console'ni tekshiring
3. Supabase logs'ni tekshiring
4. GitHub Issues oching
