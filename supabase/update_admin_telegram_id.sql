-- Update Admin Telegram ID to 5584607975 (@mdra088)
-- Run this in Supabase SQL Editor

-- Update existing admin user
UPDATE admin_users 
SET telegram_id = 5584607975
WHERE username = '123456789';

-- Verify
SELECT 
  id, 
  username, 
  role, 
  telegram_id, 
  is_active 
FROM admin_users 
WHERE telegram_id = 5584607975;

-- Expected result: 1 row with telegram_id = 5584607975
