# Migration Fix Guide

## Problem
Index already exists error when running migrations.

## Solution

### Option 1: Use Updated migrations.sql (Recommended)

`migrations.sql` fayli allaqachon yangilangan va index'lar `DO` block bilan tekshiriladi. 

**Agar migrations.sql ni allaqachon ishga tushirgan bo'lsangiz:**

1. Index'larni o'chirish (agar kerak bo'lsa):
   ```sql
   DROP INDEX IF EXISTS idx_admin_users_username;
   DROP INDEX IF EXISTS idx_admin_users_role;
   DROP INDEX IF EXISTS idx_order_status_logs_order;
   DROP INDEX IF EXISTS idx_order_status_logs_admin;
   DROP INDEX IF EXISTS idx_order_status_logs_created;
   ```

2. Keyin `migrations.sql` ni qayta ishga tushiring (index'lar endi xavfsiz yaratiladi).

### Option 2: Use migrations_admin_fix.sql

Agar `migrations.sql` ni ishga tushirgan bo'lsangiz va faqat admin qismini qo'shmoqchi bo'lsangiz:

1. `migrations_admin_fix.sql` ni ishga tushiring
2. Bu fayl index'lar mavjudligini tekshiradi va xavfsiz yaratadi

### Option 3: Skip Index Creation

Agar jadvallar allaqachon mavjud bo'lsa, index'larni o'tkazib yuborishingiz mumkin:

```sql
-- Tables already exist, skip index creation
-- Indexes are already created from migrations.sql
```

## Current Status

- ✅ `migrations.sql` - Admin tables + safe indexes
- ✅ `migrations_admin.sql` - Safe version (checks before creating)
- ✅ `migrations_admin_fix.sql` - Alternative safe version

## Recommendation

**Agar migrations.sql ni allaqachon ishga tushirgan bo'lsangiz:**
- `migrations_admin.sql` ni **O'CHIRIB TASHLANG** yoki o'tkazib yuboring
- Faqat `seed_admin.sql` ni ishga tushiring

**Agar migrations.sql ni hali ishga tushirmagan bo'lsangiz:**
- Faqat `migrations.sql` ni ishga tushiring (admin tables allaqachon ichida)
- Keyin `seed_admin.sql` ni ishga tushiring
