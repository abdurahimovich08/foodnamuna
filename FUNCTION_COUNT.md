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
5. `api/admin/auth.ts` (birlashtirilgan: login, logout, me, change-password)
6. `api/admin/check-telegram.ts`
7. `api/admin/categories.ts` (birlashtirilgan)
8. `api/admin/products.ts` (birlashtirilgan)
9. `api/admin/admin-users.ts` (birlashtirilgan)
10. `api/admin/orders.ts` (birlashtirilgan)

**Jami: 10 ta function** ✅ (Hobby plan limiti: 12 ta)

## ✅ Muammo Hal Qilindi!

Admin auth endpoint'lari birlashtirildi:
- ✅ `api/admin/login.ts` + `api/admin/logout.ts` + `api/admin/me.ts` + `api/admin/change-password.ts` → `api/admin/auth.ts`

**Natija: 13 → 10 ta function** ✅ (Hobby plan limiti: 12 ta)

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

### Admin Auth
- `/api/admin/auth?action=login` - Login (POST)
- `/api/admin/auth?action=logout` - Logout (POST)
- `/api/admin/auth?action=me` - Get Current Admin (GET)
- `/api/admin/auth?action=change-password` - Change Password (POST)
