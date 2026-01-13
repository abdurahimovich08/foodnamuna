# Development Mode Authentication Fix

## Muammo

Development mode'da (browser'da ochilganda) Telegram WebApp yo'q, shuning uchun user authenticate qilinmayapti va admin panel link ko'rinmayapti.

## Yechim

Development mode uchun mock user qo'shildi. Agar `.env` faylida `VITE_DEV_TELEGRAM_ID` o'rnatilsa, development mode'da shu ID bilan mock user yaratiladi.

## Qo'llash

### 1. `.env` fayl yaratish

`apps/web` papkasida `.env` fayl yarating:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_RESTAURANT_ID=00000000-0000-0000-0000-000000000001
VITE_API_BASE=
VITE_DEV_TELEGRAM_ID=5584607975
```

### 2. Development Server'ni Qayta Ishga Tushirish

```bash
cd apps/web
npm run dev
```

### 3. Tekshirish

1. Browser'da `http://localhost:5173` ni oching
2. Console'ni oching (F12)
3. Quyidagi log'larni ko'ring:
   - `[App] Development mode: Telegram WebApp not found`
   - `[App] Development mode: Using mock user with telegram_id: 5584607975`
4. Profil sahifasiga o'ting
5. Admin Panel link ko'rinishi kerak

## Production Mode

Production mode'da (Telegram Mini App ichida) bu funksiya ishlamaydi, chunki Telegram WebApp mavjud bo'ladi va haqiqiy authentication ishlaydi.

## Qo'shimcha Ma'lumot

- Mock user faqat development mode'da (`import.meta.env.DEV === true`) ishlaydi
- `VITE_DEV_TELEGRAM_ID` o'rnatilmasa, mock user yaratilmaydi
- Mock user database'ga saqlanmaydi, faqat frontend'da ishlaydi
