# Vercel Deploy Muammolari va Yechimlar

## ✅ Tuzatilgan Muammolar

### 1. Runtime Version Xatosi

**Xatolik**: `Error: Function Runtimes must have a valid version`

**Yechim**: `vercel.json` faylida `functions` bo'limini olib tashladik. Vercel avtomatik ravishda `api/` papkasidagi fayllarni serverless functions sifatida aniqlaydi.

**Hozirgi `vercel.json`**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### 2. Vercel Deploy Qadamlari

1. **Root Directory Sozlash**:
   - Vercel Dashboard > Project Settings > General
   - **Root Directory**: `apps/web` (agar root'dan deploy qilsangiz)
   - Yoki `apps/web` papkasidan to'g'ridan-to'g'ri deploy qiling

2. **Build Settings**:
   - Build Command: `npm run build` (avtomatik)
   - Output Directory: `dist` (avtomatik)
   - Install Command: `npm install` (avtomatik)

3. **Environment Variables**:
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   BOT_TOKEN
   ADMIN_CHAT_ID
   RESTAURANT_ID
   VITE_RESTAURANT_ID
   ```

## 🔧 Qo'shimcha Sozlamalar

### Agar Root Directory Muammosi Bo'lsa

**Variant 1**: Root'dan deploy (tavsiya etiladi)
```bash
cd apps/web
vercel
```

**Variant 2**: Root'dan deploy, lekin Root Directory belgilash
1. Vercel Dashboard > Settings > General
2. Root Directory: `apps/web`
3. Save

### API Routes Tekshirish

Deploy qilgandan keyin API routes'ni tekshiring:
```
https://your-app.vercel.app/api/menu?restaurant_id=00000000-0000-0000-0000-000000000001
```

Agar 404 qaytsa:
- `api/` papkasi `apps/web/api/` da ekanligini tekshiring
- Vercel Dashboard > Functions tab'da API functions ko'rinishini tekshiring

## 📝 To'liq Deploy Qadamlari

1. **GitHub'ga Push**:
   ```bash
   git add .
   git commit -m "Fix Vercel config"
   git push
   ```

2. **Vercel'da Deploy**:
   ```bash
   cd apps/web
   vercel --prod
   ```

3. **Environment Variables Qo'shish** (Vercel Dashboard):
   - Settings > Environment Variables
   - Barcha o'zgaruvchilarni qo'shing
   - Redeploy qiling

4. **Tekshirish**:
   - Frontend: `https://your-app.vercel.app`
   - API: `https://your-app.vercel.app/api/menu?restaurant_id=...`

## ⚠️ Muhim Eslatmalar

1. **Root Directory**: Agar monorepo struktura bo'lsa, Root Directory ni `apps/web` ga o'rnating
2. **Build Command**: `npm run build` avtomatik ishlaydi
3. **API Routes**: Vercel avtomatik ravishda `api/` papkasidagi `.ts` fayllarni serverless functions sifatida aniqlaydi
4. **Environment Variables**: `VITE_` prefiksli o'zgaruvchilar frontend'ga, qolganlari backend'ga

## 🆘 Muammo Bo'lsa

1. **Build Logs'ni tekshiring**: Vercel Dashboard > Deployments > Latest > Build Logs
2. **Functions Logs'ni tekshiring**: Vercel Dashboard > Functions tab
3. **Local Test**: `npm run build` va `npm run preview` bilan test qiling
