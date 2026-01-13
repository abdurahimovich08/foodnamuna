# ⚡ Tezkor Test Qo'llanmasi

## 1️⃣ Database Setup (5 daqiqa)

Supabase SQL Editor'da:

```sql
-- Copy and paste supabase/setup_admin_telegram.sql
-- Click Run
```

**Tekshirish:**
```sql
SELECT * FROM admin_users WHERE telegram_id = 10;
```

---

## 2️⃣ Bot Ishga Tushirish

```bash
cd apps/bot
npm run dev
```

**Tekshirish:** Terminal'da "Bot started successfully" ko'rinishi kerak

---

## 3️⃣ Frontend + API Ishga Tushirish

```bash
cd apps/web
vercel dev
```

**Tekshirish:** Browser'da `http://localhost:3000` ochilishi kerak

---

## 4️⃣ Test

### Bot Test:
1. Telegram'da bot'ga `/start` yuboring
2. **ID: 10** uchun "⚙️ Admin Panel" tugmasi ko'rinishi kerak
3. Tugmani bosing → Admin panel ochilishi kerak

### Mini App Test:
1. Bot orqali Mini App'ni oching
2. Profil → "⚙️ Admin Panel" link ko'rinishi kerak
3. Linkni bosing → Admin panelga o'tish kerak

### API Test:
```
GET http://localhost:3000/api/admin/check-telegram?telegram_id=10
```

**Javob:**
```json
{"is_admin": true, "admin": {...}}
```

---

## ✅ Muvaffaqiyatli!

Agar barchasi ishlayotgan bo'lsa, tizim tayyor! 🎉
