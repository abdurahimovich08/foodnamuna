-- Update admin user with Telegram ID
-- This links the admin user to Telegram account (ID: 5584607975, username: @mdra088)

-- First, try to update existing admin user
UPDATE admin_users 
SET telegram_id = 5584607975
WHERE username = '123456789'
  AND (telegram_id IS NULL OR telegram_id != 5584607975);

-- If admin user doesn't exist, create it with telegram_id
INSERT INTO admin_users (id, username, password_hash, role, is_active, must_change_password, telegram_id) VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  '123456789',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- bcrypt hash for '123456789'
  'owner',
  true,
  true,
  5584607975  -- Telegram ID (@mdra088)
)
ON CONFLICT (username) DO UPDATE SET telegram_id = 5584607975;
