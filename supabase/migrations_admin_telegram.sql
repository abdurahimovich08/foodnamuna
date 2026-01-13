-- Add telegram_id column to admin_users table
-- This allows linking admin users to their Telegram accounts

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_users' AND column_name = 'telegram_id'
  ) THEN
    ALTER TABLE admin_users 
    ADD COLUMN telegram_id BIGINT;
    
    -- Add unique constraint
    CREATE UNIQUE INDEX IF NOT EXISTS admin_users_telegram_id_unique 
    ON admin_users(telegram_id) WHERE telegram_id IS NOT NULL;
  END IF;
END $$;

-- Create index for telegram_id
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_users_telegram_id') THEN
    CREATE INDEX idx_admin_users_telegram_id ON admin_users(telegram_id);
  END IF;
END $$;

-- Add comment
COMMENT ON COLUMN admin_users.telegram_id IS 'Telegram user ID for admin access via bot';
