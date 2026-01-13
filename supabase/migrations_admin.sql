-- Admin Panel Migrations
-- Run this ONLY if admin tables are NOT in migrations.sql
-- If you already ran migrations.sql, skip this file!

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'operator', -- 'owner', 'manager', 'operator'
  is_active BOOLEAN DEFAULT true,
  must_change_password BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes (safe - check if exists first)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_users_username') THEN
    CREATE INDEX idx_admin_users_username ON admin_users(username);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_users_role') THEN
    CREATE INDEX idx_admin_users_role ON admin_users(role);
  END IF;
END $$;

-- Order status logs table (audit trail)
CREATE TABLE IF NOT EXISTS order_status_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES admin_users(id),
  from_status VARCHAR(50),
  to_status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes (safe)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_order_status_logs_order') THEN
    CREATE INDEX idx_order_status_logs_order ON order_status_logs(order_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_order_status_logs_admin') THEN
    CREATE INDEX idx_order_status_logs_admin ON order_status_logs(admin_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_order_status_logs_created') THEN
    CREATE INDEX idx_order_status_logs_created ON order_status_logs(created_at DESC);
  END IF;
END $$;
