# Admin Panel Debug Guide

## Muammo: Profil sahifasida Admin Panel link ko'rinmayapti

## Tekshirish Qadamlari

### 1. Browser Console'ni Ochish

1. Browser'da F12 bosing
2. Console tab'ni oching
3. Profil sahifasiga o'ting
4. Quyidagi log'larni ko'ring:
   - `Checking admin status for tg_id: ...`
   - `Admin check response status: ...`
   - `Admin check response data: ...`

### 2. Database Tekshirish

Supabase SQL Editor'da:

```sql
-- Tekshirish: Admin user'da telegram_id bor-yo'qligini
SELECT id, username, role, telegram_id, is_active 
FROM admin_users 
WHERE telegram_id = 5584607975;
```

**Kutilayotgan natija:** 1 qator ko'rinishi kerak (telegram_id = 5584607975)

### 3. API Endpoint Test

Browser'da yoki Postman'da:

```
GET http://localhost:3000/api/admin/check-telegram?telegram_id=5584607975
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

### 4. User Object Tekshirish

Console'da:

```javascript
// User object'ni ko'rish
console.log('User object:', user);
console.log('User tg_id:', user?.tg_id);
```

**Kutilayotgan:** `user.tg_id` = 10 bo'lishi kerak

## Muammo Sabablari

### 1. Database'da telegram_id yo'q

**Yechim:** `supabase/setup_admin_telegram.sql` ni ishga tushiring

### 2. User object'da tg_id yo'q

**Sabab:** Telegram auth ishlamayapti yoki user to'g'ri set qilinmagan

**Yechim:** 
- Browser console'da xatoliklar bor-yo'qligini tekshiring
- `/api/auth/telegram` endpoint ishlayotganini tekshiring

### 3. API Endpoint ishlamayapti

**Sabab:** `vercel dev` ishga tushmagan yoki endpoint noto'g'ri

**Yechim:**
- `vercel dev` ishga tushirilganini tekshiring
- API endpoint URL to'g'ri ekanligini tekshiring

### 4. CORS yoki Network xatolik

**Yechim:**
- Browser Network tab'da `/api/admin/check-telegram` so'rovini tekshiring
- Xatoliklar bor-yo'qligini ko'ring

## Qo'shimcha Debug

ProfilePage.tsx da console.log'lar qo'shildi. Browser console'da quyidagilarni ko'rasiz:

1. `Checking admin status for tg_id: 5584607975`
2. `Admin check response status: 200`
3. `Admin check response data: { is_admin: true, ... }`

Agar bular ko'rinmasa, muammo:
- User object'da `tg_id` yo'q
- API endpoint ishlamayapti
- Network xatolik
