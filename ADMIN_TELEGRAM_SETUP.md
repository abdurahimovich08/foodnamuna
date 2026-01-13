# Admin Panel Telegram Integration

## ✅ Qo'shilgan Funksiyalar

1. **Database Migration**: `admin_users` jadvaliga `telegram_id` qo'shildi
2. **Admin Check API**: Telegram ID orqali admin user'ni tekshirish
3. **Profile Page**: Admin user uchun "Admin Panel" link ko'rsatiladi
4. **Bot Integration**: Bot `/start` buyrug'ida admin user uchun "Admin Panel" tugmasi

## 🔧 Setup Qadamlari

### 1. Database Migration

Supabase SQL Editor'da quyidagi fayllarni ishga tushiring:

```sql
-- 1. Migration
-- supabase/migrations_admin_telegram.sql

-- 2. Seed
-- supabase/seed_admin_telegram.sql
```

Yoki bitta SQL sifatida:

```sql
-- Add telegram_id column
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS telegram_id BIGINT UNIQUE;

-- Create index
CREATE INDEX IF NOT EXISTS idx_admin_users_telegram_id ON admin_users(telegram_id);

-- Update admin user with Telegram ID (10)
UPDATE admin_users 
SET telegram_id = 10
WHERE username = '123456789';

-- If doesn't exist, insert
INSERT INTO admin_users (id, username, password_hash, role, is_active, must_change_password, telegram_id) VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  '123456789',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'owner',
  true,
  true,
  10
)
ON CONFLICT (username) DO UPDATE SET telegram_id = 10;
```

### 2. Environment Variables

`.env.local` faylida quyidagilar bo'lishi kerak:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Test Qilish

1. **Bot orqali**:
   - Telegram'da botingizga `/start` yuboring
   - Admin user (ID: 10) uchun "Admin Panel" tugmasi ko'rinadi
   - Tugmani bosib admin panelga o'ting

2. **Mini App orqali**:
   - Bot orqali Mini App'ni oching
   - Profil sahifasiga o'ting
   - Admin user uchun "Admin Panel" link ko'rinadi

## 🔐 Xavfsizlik

- Faqat `telegram_id = 10` bo'lgan user admin panelga kirishi mumkin
- Admin panel hali ham JWT authentication talab qiladi
- Telegram ID tekshiruvi faqat link ko'rsatish uchun

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

## 🐛 Muammo Bo'lsa

1. **Admin Panel link ko'rinmaydi**:
   - Database'da `telegram_id = 10` bo'lishini tekshiring
   - Browser console'da xatoliklar bor-yo'qligini tekshiring
   - API endpoint `/api/admin/check-telegram` ishlayotganini tekshiring

2. **Bot'da tugma ko'rinmaydi**:
   - Bot kodini qayta build qiling: `cd apps/bot && npm run build`
   - Bot'ni qayta ishga tushiring

3. **API xatolik**:
   - `.env.local` faylida `SUPABASE_SERVICE_ROLE_KEY` borligini tekshiring
   - Vercel dev ishga tushganini tekshiring: `vercel dev`
