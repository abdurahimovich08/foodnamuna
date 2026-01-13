# Deployment Guide

## Prerequisites

1. Supabase account and project
2. Telegram Bot Token (from @BotFather)
3. Vercel account (for frontend + API)
4. Render/Fly.io/VPS account (for bot)

## Step 1: Database Setup (Supabase)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run `supabase/migrations.sql` to create tables
4. Run `supabase/seed.sql` to insert sample data
5. Note down your:
   - Project URL
   - Anon key
   - Service role key

## Step 2: Create Telegram Bot

1. Open [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` and follow instructions
3. Save your bot token
4. Send `/newapp` to create Mini App
   - Select your bot
   - Enter app title: "Zahratun Food"
   - Enter description: "Restoran buyurtma tizimi"
   - Upload photo (optional)
   - Enter web app URL: (you'll update this after deploying)

## Step 3: Deploy Frontend + API (Vercel)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Navigate to web app:
   ```bash
   cd apps/web
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
   - `BOT_TOKEN` - Your Telegram bot token
   - `ADMIN_CHAT_ID` - Your Telegram chat ID (for order notifications)
   - `RESTAURANT_ID` - Default: `00000000-0000-0000-0000-000000000001`
   - `VITE_RESTAURANT_ID` - Same as RESTAURANT_ID

5. Get your deployment URL (e.g., `https://your-app.vercel.app`)

6. Update Telegram Mini App URL in BotFather:
   - Send `/newapp` to BotFather
   - Select your bot
   - Update web app URL with your Vercel URL

## Step 4: Deploy Bot

### Option A: Render

1. Create new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Name**: `zahratun-bot`
   - **Environment**: `Node`
   - **Build Command**: `cd apps/bot && npm install && npm run build`
   - **Start Command**: `cd apps/bot && npm start`
   - **Root Directory**: (leave empty)

4. Add environment variables:
   - `BOT_TOKEN` - Your Telegram bot token
   - `MINI_APP_URL` - Your Vercel deployment URL
   - `ADMIN_CHAT_ID` - Your Telegram chat ID

5. Deploy

### Option B: Fly.io

1. Install Fly CLI:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. Login:
   ```bash
   fly auth login
   ```

3. Navigate to bot directory:
   ```bash
   cd apps/bot
   ```

4. Launch:
   ```bash
   fly launch
   ```

5. Set secrets:
   ```bash
   fly secrets set BOT_TOKEN=your_token
   fly secrets set MINI_APP_URL=https://your-app.vercel.app
   fly secrets set ADMIN_CHAT_ID=your_chat_id
   ```

6. Deploy:
   ```bash
   fly deploy
   ```

### Option C: VPS (Ubuntu/Debian)

1. SSH into your VPS
2. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. Clone repository:
   ```bash
   git clone your-repo-url
   cd foodnamuna
   ```

4. Install dependencies:
   ```bash
   cd apps/bot
   npm install
   npm run build
   ```

5. Create `.env` file:
   ```env
   BOT_TOKEN=your_token
   MINI_APP_URL=https://your-app.vercel.app
   ADMIN_CHAT_ID=your_chat_id
   ```

6. Install PM2:
   ```bash
   npm install -g pm2
   ```

7. Start bot:
   ```bash
   pm2 start dist/index.js --name zahratun-bot
   pm2 save
   pm2 startup
   ```

## Step 5: Get Admin Chat ID

1. Start a chat with your bot
2. Send any message
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Find your chat ID in the response (look for `"chat":{"id":...}`)
5. Use this ID as `ADMIN_CHAT_ID`

## Step 6: Testing

1. Open your bot on Telegram
2. Send `/start`
3. Click "Menyuni ko'rish" button
4. Test the flow:
   - Browse products
   - Add to cart
   - Place order
   - Check order history

5. Verify admin notification:
   - Check your admin chat for order notifications

## Troubleshooting

### Bot not responding
- Check bot token is correct
- Verify bot is running (check logs)
- Ensure webhook is not set (for polling mode)

### Mini App not loading
- Verify Vercel deployment is live
- Check environment variables are set
- Verify Telegram Mini App URL is correct in BotFather

### Orders not creating
- Check Supabase connection
- Verify initData is being sent
- Check server logs for errors
- Ensure BOT_TOKEN is set in Vercel

### Admin notifications not working
- Verify ADMIN_CHAT_ID is correct
- Check BOT_TOKEN is set in Vercel
- Test bot API: `https://api.telegram.org/bot<TOKEN>/getMe`

## Environment Variables Summary

### Vercel (Frontend + API)
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
BOT_TOKEN
ADMIN_CHAT_ID
RESTAURANT_ID
VITE_RESTAURANT_ID
```

### Bot (Render/Fly.io/VPS)
```
BOT_TOKEN
MINI_APP_URL
ADMIN_CHAT_ID
```
