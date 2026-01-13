# Keyingi Qadamlar - Bosqichma-bosqich

## ✅ Bajarilgan

1. ✅ Loyiha struktura yaratildi
2. ✅ Barcha kodlar yozildi
3. ✅ Dependencies o'rnatildi

## 🔄 Keyingi Qadamlar

### QADAM 1: Supabase Database Setup (10 daqiqa)

1. **Supabase Project Yaratish**
   - [supabase.com](https://supabase.com) ga kiring
   - "New Project" tugmasini bosing
   - Project nomi va parol kiriting
   - Region tanlang (Yaqinroq regionni tanlang)

2. **Database Migrations**
   - Dashboard > SQL Editor
   - `supabase/migrations.sql` faylini oching
   - Barcha SQL kodini nusxalab, SQL Editor ga yopishtiring
   - "Run" tugmasini bosing
   - Xuddi shunday `supabase/seed.sql` ni ham ishga tushiring

3. **Keys Olish**
   - Settings > API
   - Quyidagilarni ko'chirib oling:
     - Project URL
     - anon public key
     - service_role key (secret!)

**Tekshirish**:
```sql
SELECT COUNT(*) FROM restaurants;  -- 1 bo'lishi kerak
SELECT COUNT(*) FROM categories;   -- 9 bo'lishi kerak
SELECT COUNT(*) FROM products;    -- 14+ bo'lishi kerak
```

---

### QADAM 2: Telegram Bot Yaratish (5 daqiqa)

1. **Bot Token Olish**
   - Telegram'da [@BotFather](https://t.me/botfather) ga yozing
   - `/newbot` buyrug'ini yuboring
   - Bot nomi: "Zahratun Food Bot"
   - Username: "zahratun_food_bot" (yoki boshqa)
   - Token ni saqlang (masalan: `123456789:ABC...`)

2. **Mini App Yaratish**
   - `/newapp` buyrug'ini yuboring
   - Botingizni tanlang
   - App title: **Zahratun Food**
   - Description: **Restoran buyurtma tizimi**
   - Photo (ixtiyoriy)
   - Web App URL: **Hozircha bo'sh** (deploy qilgandan keyin)

---

### QADAM 3: Environment Variables (5 daqiqa)

#### Frontend (apps/web/.env.local)

Fayl yaratish:
```bash
cd apps/web
copy .env.local.example .env.local  # Windows
# yoki
cp .env.local.example .env.local    # Linux/Mac
```

`.env.local` faylini ochib, to'ldiring:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_RESTAURANT_ID=00000000-0000-0000-0000-000000000001
VITE_API_BASE=
```

#### Bot (apps/bot/.env)

Fayl yaratish:
```bash
cd apps/bot
copy .env.example .env  # Windows
# yoki
cp .env.example .env   # Linux/Mac
```

`.env` faylini ochib, to'ldiring:
```env
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
MINI_APP_URL=https://your-app.vercel.app
ADMIN_CHAT_ID=123456789
```

**Eslatma**: `MINI_APP_URL` va `ADMIN_CHAT_ID` ni keyinroq to'ldirasiz.

---

### QADAM 4: Admin Chat ID Olish (2 daqiqa)

1. Botingizga Telegram'da xabar yuboring (har qanday matn)
2. Browser'da oching:
   ```
   https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
   ```
   (BOT_TOKEN o'rniga o'zingiznikini qo'ying)

3. JSON javobda `"chat":{"id":123456789}` ni toping
4. Bu raqam sizning `ADMIN_CHAT_ID`

**Misol javob**:
```json
{
  "ok": true,
  "result": [{
    "message": {
      "chat": {
        "id": 987654321  // <-- Bu sizning ADMIN_CHAT_ID
      }
    }
  }]
}
```

---

### QADAM 5: Local Development Test (5 daqiqa)

#### Frontend Test

**Terminal 1**:
```bash
cd apps/web
npm run dev
```

Brauzerda `http://localhost:3000` ni oching.

**Eslatma**: Telegram Mini App faqat Telegram ichida ishlaydi. Local test uchun:
- Telegram Desktop'da bot orqali ochish
- Yoki browser'da ochib, console'da `window.Telegram` mavjudligini tekshirish

#### Bot Test

**Terminal 2**:
```bash
cd apps/bot
npm run dev
```

Telegram'da botingizga `/start` buyrug'ini yuboring. Bot javob berishi kerak.

---

### QADAM 6: Deploy (15 daqiqa)

#### Frontend + API (Vercel)

1. **Vercel CLI O'rnatish**:
   ```bash
   npm i -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd apps/web
   vercel
   ```
   - "Set up and deploy?" → **Y**
   - "Which scope?" → Tanlang
   - "Link to existing project?" → **N**
   - "Project name?" → `zahratun-food` (yoki boshqa)
   - "Directory?" → `./`
   - "Override settings?" → **N**

4. **Environment Variables Qo'shish**:
   - Vercel Dashboard > Your Project > Settings > Environment Variables
   - Quyidagilarni qo'shing:
     ```
     VITE_SUPABASE_URL = your_supabase_url
     VITE_SUPABASE_ANON_KEY = your_anon_key
     SUPABASE_SERVICE_ROLE_KEY = your_service_role_key
     BOT_TOKEN = your_bot_token
     ADMIN_CHAT_ID = your_chat_id
     RESTAURANT_ID = 00000000-0000-0000-0000-000000000001
     VITE_RESTAURANT_ID = 00000000-0000-0000-0000-000000000001
     ```

5. **Redeploy**:
   - Deployments > Latest > "Redeploy"

6. **URL ni oling** (masalan: `https://zahratun-food.vercel.app`)

#### Bot (Render)

1. **GitHub'ga Push** (agar hali qilmagan bo'lsangiz):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Render'da Setup**:
   - [render.com](https://render.com) ga kiring
   - "New" > "Web Service"
   - GitHub repository ni ulang
   - Sozlamalar:
     - **Name**: `zahratun-bot`
     - **Environment**: `Node`
     - **Build Command**: `cd apps/bot && npm install && npm run build`
     - **Start Command**: `cd apps/bot && npm start`
     - **Root Directory**: (bo'sh qoldiring)

3. **Environment Variables**:
   - Environment > Add Environment Variable
   - Quyidagilarni qo'shing:
     ```
     BOT_TOKEN = your_bot_token
     MINI_APP_URL = https://your-app.vercel.app (Vercel URL)
     ADMIN_CHAT_ID = your_chat_id
     ```

4. **Deploy**

---

### QADAM 7: Mini App URL Yangilash (2 daqiqa)

1. BotFather'ga `/newapp` buyrug'ini yuboring
2. Botingizni tanlang
3. "Web App URL" ni yangilang: Vercel URL ni kiriting
4. Saqlang

---

### QADAM 8: Test Qilish (5 daqiqa)

1. **Telegram'da Test**:
   - Botingizga `/start` yuboring
   - "Menyuni ko'rish" tugmasini bosing
   - Mini App ochilishi kerak

2. **Buyurtma Test**:
   - Mahsulot tanlang
   - Savatga qo'shing
   - Buyurtma berish
   - Admin chat'ga xabar kelishi kerak

3. **Buyurtmalar Test**:
   - "Buyurtmalar" bo'limiga o'ting
   - Yaratilgan buyurtmalarni ko'ring

---

## ✅ Tekshirish Ro'yxati

- [ ] Supabase project yaratildi
- [ ] Migrations ishga tushirildi
- [ ] Seed data yuklandi
- [ ] Telegram bot yaratildi
- [ ] Bot token olingan
- [ ] Mini App yaratildi
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
- [ ] Buyurtma yaratildi
- [ ] Admin'ga xabar keldi

---

## 🆘 Muammo Bo'lsa

1. **Logs'ni tekshiring**:
   - Vercel: Dashboard > Deployments > Logs
   - Render: Dashboard > Logs
   - Local: Terminal output

2. **Browser Console**:
   - F12 > Console tab
   - Xatolarni ko'ring

3. **Supabase Logs**:
   - Dashboard > Logs > API Logs

4. **Bot Test**:
   ```
   https://api.telegram.org/bot<TOKEN>/getMe
   ```

---

## 📚 Qo'shimcha Ma'lumot

- **Batafsil Setup**: `SETUP.md`
- **Deployment Guide**: `DEPLOYMENT.md`
- **Quick Start**: `QUICK_START.md`
- **Asosiy README**: `README.md`

---

## 🎉 Tayyor!

Agar barcha qadamlarni bajardiz va test qildiz, loyiha ishga tushdi! 🚀
