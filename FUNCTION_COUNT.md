# Vercel Function Count

## ✅ Birlashtirilgan Function'lar

### Admin Panel
- ✅ `api/admin/categories.ts` - Categories CRUD (birlashtirilgan)
- ✅ `api/admin/products.ts` - Products CRUD (birlashtirilgan)
- ✅ `api/admin/admin-users.ts` - Admin Users CRUD + Reset Password (birlashtirilgan)
- ✅ `api/admin/orders.ts` - Orders List + Detail + Status Update (birlashtirilgan)

### Orders (User)
- ✅ `api/orders.ts` - Create + List + Detail (birlashtirilgan)

## 📊 Function'lar Ro'yxati

1. `api/auth/telegram.ts`
2. `api/menu.ts`
3. `api/branches.ts`
4. `api/orders.ts` (birlashtirilgan)
5. `api/admin/login.ts`
6. `api/admin/logout.ts`
7. `api/admin/me.ts`
8. `api/admin/change-password.ts`
9. `api/admin/check-telegram.ts`
10. `api/admin/categories.ts` (birlashtirilgan)
11. `api/admin/products.ts` (birlashtirilgan)
12. `api/admin/admin-users.ts` (birlashtirilgan)
13. `api/admin/orders.ts` (birlashtirilgan)

**Jami: 13 ta function** (Hobby plan limiti: 12 ta)

## ⚠️ Qolgan Muammo

Hali ham 1 ta function ko'p. Qo'shimcha birlashtirish kerak:

### Variant 1: Admin Auth'larni Birlashtirish
- `api/admin/login.ts` + `api/admin/logout.ts` + `api/admin/me.ts` + `api/admin/change-password.ts` → `api/admin/auth.ts`
- Bu bilan: 13 → 10 ta function

### Variant 2: Pro Plan'ga O'tish
- Vercel Pro plan'da function limit yo'q
- Team yaratish orqali Pro plan'ga o'tish

## 📝 API Endpoint O'zgarishlari

### Old Format (Dynamic Routes)
- `/api/admin/categories` - List
- `/api/admin/categories/:id` - Get/Update/Delete
- `/api/admin/orders/:id` - Get
- `/api/admin/orders/:id/status` - Update Status

### New Format (Query Parameters)
- `/api/admin/categories` - List
- `/api/admin/categories?id=...` - Get/Update/Delete
- `/api/admin/orders?id=...` - Get
- `/api/admin/orders?id=...&action=status` - Update Status

### Orders (User)
- `/api/orders` - Create (POST)
- `/api/orders?initData=...` - List (GET)
- `/api/orders?id=...&initData=...` - Get (GET)
