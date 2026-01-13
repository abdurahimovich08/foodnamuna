# Test Qadamlari - Admin Panel Telegram Integration

## ✅ Bajarilgan

1. ✅ Bot build qilindi
2. ✅ Barcha kodlar GitHub'ga push qilindi
3. ✅ Database migration fayllari tayyor

## 🔧 Keyingi Qadamlar

### 1. Database Migration Ishga Tushirish

**Supabase SQL Editor'da:**

1. [Supabase Dashboard](https://supabase.com/dashboard) ga kiring
2. SQL Editor'ni oching
3. `supabase/setup_admin_telegram.sql` faylini ochib, barcha SQL kodini nusxalang
4. SQL Editor'ga yopishtiring va **Run** tugmasini bosing

**Yoki alohida:**

1. `supabase/migrations_admin_telegram.sql` ni ishga tushiring
2. `supabase/seed_admin_telegram.sql` ni ishga tushiring

**Tekshirish:**
```sql
SELECT id, username, role, telegram_id, is_active 
FROM admin_users 
WHERE telegram_id = 10;
```

Natija: 1 qator ko'rinishi kerak (username: 123456789, telegram_id: 10)

---

### 2. Bot'ni Ishga Tushirish

**Terminal 1:**
```bash
cd apps/bot
npm run dev
```

Yoki production uchun:
```bash
cd apps/bot
npm start
```

**Tekshirish:**
- Bot ishga tushganini terminal'da ko'ring
- "Bot started successfully" xabari ko'rinishi kerak

---

### 3. Frontend + API Ishga Tushirish

**Terminal 2:**
```bash
cd apps/web
vercel dev
```

**Yoki oddiy dev server (API'siz):**
```bash
cd apps/web
npm run dev
```

**Eslatma:** `vercel dev` ishlatish tavsiya etiladi, chunki API endpoint'lar ham ishlaydi.

---

### 4. Test Qilish

#### Test 1: Bot orqali Admin Panel

1. Telegram'da botingizga `/start` yuboring
2. **Admin user (ID: 10) uchun:**
   - "⚙️ Admin Panel" tugmasi ko'rinishi kerak
   - Tugmani bosing
   - Admin panel ochilishi kerak

3. **Oddiy user uchun:**
   - Faqat "🍽️ Menyuni ko'rish" tugmasi ko'rinadi
   - Admin Panel tugmasi ko'rinmaydi

#### Test 2: Mini App orqali Admin Panel

1. Bot orqali Mini App'ni oching
2. Pastki navigatsiyada "Profil" ni bosing
3. **Admin user (ID: 10) uchun:**
   - "⚙️ Admin Panel" link ko'rinishi kerak
   - Linkni bosing
   - Admin panelga o'tish kerak

4. **Oddiy user uchun:**
   - Admin Panel link ko'rinmaydi

#### Test 3: Admin Panel Login

1. Admin panelga kirgandan keyin
2. Login sahifasida:
   - Username: `123456789`
   - Password: `123456789`
3. Birinchi kirishda parolni o'zgartirish talab qilinadi

#### Test 4: API Endpoint Test

Browser'da yoki Postman'da:

```
GET http://localhost:3000/api/admin/check-telegram?telegram_id=10
```

**Kutilayotgan javob:**
```json
{
  "is_admin": true,
  "admin": {
    "id": "...",
    "username": "123456789",
    "role": "owner"
  }
}
```

---

## 🐛 Muammo Bo'lsa

### Bot'da Admin Panel tugmasi ko'rinmaydi

**Sabab:** Bot kodini qayta build qilmagan yoki bot ishga tushmagan

**Yechim:**
```bash
cd apps/bot
npm run build
npm run dev
```

### Profil sahifasida Admin Panel link ko'rinmaydi

**Sabablar:**
1. Database'da `telegram_id = 10` bo'lmagan
2. API endpoint ishlamayapti
3. Frontend'da xatolik bor

**Yechim:**
1. Database'ni tekshiring:
   ```sql
   SELECT * FROM admin_users WHERE telegram_id = 10;
   ```

2. Browser console'ni ochib xatoliklarni tekshiring
3. Network tab'da `/api/admin/check-telegram` so'rovini tekshiring

### API "Not Found" xatolik

**Sabab:** `vercel dev` ishga tushmagan

**Yechim:**
```bash
cd apps/web
vercel dev
```

### Database Migration xatolik

**Sabab:** Column allaqachon mavjud

**Yechim:** Migration faylida `IF NOT EXISTS` tekshiruvi bor, xatolik bo'lmasligi kerak. Agar bo'lsa, avval column'ni o'chirib, keyin migration'ni ishga tushiring:

```sql
ALTER TABLE admin_users DROP COLUMN IF EXISTS telegram_id;
```

Keyin migration'ni qayta ishga tushiring.

---

## ✅ Muvaffaqiyatli Test

Agar barcha testlar o'tgan bo'lsa:

1. ✅ Bot'da Admin Panel tugmasi ko'rinadi (faqat ID: 10 uchun)
2. ✅ Mini App'da Profil sahifasida Admin Panel link ko'rinadi
3. ✅ Admin Panelga kirish mumkin
4. ✅ API endpoint to'g'ri ishlaydi

---

## 📝 Qo'shimcha Admin User Qo'shish

Agar boshqa admin user qo'shmoqchi bo'lsangiz:

```sql
UPDATE admin_users 
SET telegram_id = YOUR_TELEGRAM_ID
WHERE username = 'admin_username';
```

Yoki yangi admin user yaratish:

```sql
INSERT INTO admin_users (username, password_hash, role, is_active, telegram_id) VALUES
(
  'new_admin',
  '$2b$10$...', -- bcrypt hash
  'manager',
  true,
  YOUR_TELEGRAM_ID
);
```
