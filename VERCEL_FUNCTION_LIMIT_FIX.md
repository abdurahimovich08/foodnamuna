# Vercel Function Limit Fix

## Muammo
Vercel Hobby plan'da maksimal **12 ta Serverless Function** bo'lishi mumkin. Hozirda **24 ta** function bor.

## Yechimlar

### Variant 1: Pro Plan'ga O'tish (Tavsiya)
- Vercel Pro plan'da function limit yo'q
- Team yaratish orqali Pro plan'ga o'tish mumkin

### Variant 2: Function'larni Birlashtirish
Ba'zi function'larni bitta faylga birlashtirish:

1. **Admin CRUD'larni birlashtirish:**
   - `api/admin/categories/index.ts` + `api/admin/categories/[id].ts` → `api/admin/categories.ts`
   - `api/admin/products/index.ts` + `api/admin/products/[id].ts` → `api/admin/products.ts`
   - `api/admin/admin-users/index.ts` + `api/admin/admin-users/[id].ts` → `api/admin/admin-users.ts`

2. **Orders CRUD'ni birlashtirish:**
   - `api/admin/orders/index.ts` + `api/admin/orders/[id].ts` + `api/admin/orders/[id]/status.ts` → `api/admin/orders.ts`

Bu yondashuv bilan function'lar soni **12 taga** kamayadi.

## Hozirgi Function'lar Ro'yxati

1. `api/auth/telegram.ts`
2. `api/menu.ts`
3. `api/branches.ts`
4. `api/orders/create.ts`
5. `api/orders/list.ts`
6. `api/orders/[id].ts`
7. `api/admin/login.ts`
8. `api/admin/logout.ts`
9. `api/admin/me.ts`
10. `api/admin/change-password.ts`
11. `api/admin/check-telegram.ts`
12. `api/admin/orders/index.ts`
13. `api/admin/orders/[id].ts`
14. `api/admin/orders/[id]/status.ts`
15. `api/admin/categories/index.ts`
16. `api/admin/categories/[id].ts`
17. `api/admin/products/index.ts`
18. `api/admin/products/[id].ts`
19. `api/admin/admin-users/index.ts`
20. `api/admin/admin-users/[id].ts`
21. `api/admin/admin-users/[id]/reset-password.ts`
22. `api/utils/admin-auth.ts` (utility, function emas)
23. `api/utils/bcrypt.ts` (utility, function emas)
24. `api/utils/validators.ts` (utility, function emas)

**Jami Function'lar:** 21 ta (utility'lar function emas)

## Tekshirish

Vercel faqat `api/` papkasidagi `.ts` fayllarni function sifatida qabul qiladi. `utils/` papkasidagi fayllar function emas.

**Haqiqiy function'lar soni:** 21 ta (12 tadan ko'p)

## Qaror

1. **Pro Plan'ga o'tish** (eng oson)
2. **Function'larni birlashtirish** (kod o'zgarishi kerak)
