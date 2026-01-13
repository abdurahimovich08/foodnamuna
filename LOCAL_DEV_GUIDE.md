# Local Development Guide

## ⚠️ Muhim: API Endpoint'lar Local'da Ishlashi

Vercel Serverless Functions faqat Vercel'da deploy qilinganda yoki `vercel dev` ishlatilganda ishlaydi.

## ✅ To'g'ri Usul: Vercel Dev

### 1. Vercel CLI O'rnatish

```bash
npm install -g vercel
```

### 2. Vercel Dev Ishga Tushirish

```bash
cd apps/web
vercel dev
```

Bu quyidagilarni qiladi:
- ✅ Frontend'ni serve qiladi (http://localhost:3000)
- ✅ API endpoint'larni local'da ishga tushiradi
- ✅ Environment variables'ni `.env.local` dan o'qiydi

### 3. Birinchi Marta

Birinchi marta `vercel dev` ishga tushirganda:
1. Vercel account'ga login qilish so'raladi
2. Project link qilish so'raladi (yangi yoki mavjud)
3. Environment variables so'raladi

**Tavsiya**: Yangi project yarating va keyin environment variables'ni `.env.local` faylida saqlang.

## 🔧 Environment Variables

`apps/web/.env.local` faylida quyidagilar bo'lishi kerak:

```env
# Frontend
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_RESTAURANT_ID=00000000-0000-0000-0000-000000000001
VITE_API_BASE=

# Backend (Vercel dev uchun)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
BOT_TOKEN=your_telegram_bot_token_here
ADMIN_CHAT_ID=your_telegram_chat_id_here
RESTAURANT_ID=00000000-0000-0000-0000-000000000001
ADMIN_JWT_SECRET=your_random_secret_key_here
```

**Eslatma**: `vercel dev` `.env.local` faylidagi barcha environment variables'ni o'qiydi.

## 🚀 Ishga Tushirish

### Terminal 1: Frontend + API

```bash
cd apps/web
vercel dev
```

Server quyidagi port'larda ishga tushadi:
- Frontend: `http://localhost:3000`
- API: `http://localhost:3000/api/*`

### Terminal 2: Bot (ixtiyoriy)

```bash
cd apps/bot
npm run dev
```

## ✅ Tekshirish

1. **Frontend**: Browser'da `http://localhost:3000` ni oching
2. **Admin Panel**: `http://localhost:3000/admin/login`
3. **API Test**: `http://localhost:3000/api/menu?restaurant_id=00000000-0000-0000-0000-000000000001`

## ❌ Xatoliklar

### "Request failed: Not Found"

**Sabab**: `npm run dev` ishlatilgan (faqat Vite dev server)

**Yechim**: `vercel dev` ishlatish kerak

### "Cannot find module"

**Sabab**: Dependencies o'rnatilmagan

**Yechim**: 
```bash
cd apps/web
npm install
```

### "Environment variable not found"

**Sabab**: `.env.local` faylida o'zgaruvchi yo'q

**Yechim**: `.env.local` faylini to'ldiring

## 📝 Qo'shimcha Ma'lumot

- `vercel dev` hot reload'ni qo'llab-quvvatlaydi
- API endpoint'lar `apps/web/api/` papkasida
- Frontend `apps/web/src/` papkasida
- Build fayllar `apps/web/dist/` papkasida

## 🔄 Production Deploy

Production'da:
1. Vercel'ga deploy qiling: `vercel --prod`
2. Environment variables'ni Vercel Dashboard'da sozlang
3. API endpoint'lar avtomatik ishlaydi
