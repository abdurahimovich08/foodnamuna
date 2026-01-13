-- Complete setup for Admin Telegram Integration
-- Run this in Supabase SQL Editor

-- Step 1: Add telegram_id column to admin_users table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_users' AND column_name = 'telegram_id'
  ) THEN
    ALTER TABLE admin_users 
    ADD COLUMN telegram_id BIGINT;
    
    -- Add unique constraint (allowing NULL)
    CREATE UNIQUE INDEX IF NOT EXISTS admin_users_telegram_id_unique 
    ON admin_users(telegram_id) WHERE telegram_id IS NOT NULL;
  END IF;
END $$;

-- Step 2: Create index for telegram_id
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_users_telegram_id') THEN
    CREATE INDEX idx_admin_users_telegram_id ON admin_users(telegram_id);
  END IF;
END $$;

-- Step 3: Add comment
COMMENT ON COLUMN admin_users.telegram_id IS 'Telegram user ID for admin access via bot';

-- Step 4: Update existing admin user with Telegram ID (5584607975)
UPDATE admin_users 
SET telegram_id = 5584607975
WHERE username = '123456789'
  AND (telegram_id IS NULL OR telegram_id != 5584607975);

-- Step 5: If admin user doesn't exist, create it with telegram_id
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

-- Step 6: Verify
SELECT 
  id, 
  username, 
  role, 
  telegram_id, 
  is_active 
FROM admin_users 
WHERE telegram_id = 5584607975;
