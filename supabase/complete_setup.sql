-- ============================================
-- COMPLETE DATABASE SETUP FOR FOODNAMUNA
-- Barcha migration va seed ma'lumotlar bitta faylda
-- Supabase SQL Editor'da ishga tushiring
-- ============================================

-- ============================================
-- PART 1: EXTENSIONS
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PART 2: TABLES CREATION
-- ============================================

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url TEXT,
  phone VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  sort INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for categories (safe)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_categories_restaurant') THEN
    CREATE INDEX idx_categories_restaurant ON categories(restaurant_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_categories_sort') THEN
    CREATE INDEX idx_categories_sort ON categories(sort);
  END IF;
END $$;

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- Price in UZS (so'm)
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort INTEGER DEFAULT 0,
  tags TEXT[], -- Array of tags: 'best_seller', 'new', 'spicy', 'cheesy', 'chicken'
  rating NUMERIC(3,2) DEFAULT 5.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for products (safe)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_products_restaurant') THEN
    CREATE INDEX idx_products_restaurant ON products(restaurant_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_products_category') THEN
    CREATE INDEX idx_products_category ON products(category_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_products_active') THEN
    CREATE INDEX idx_products_active ON products(is_active);
  END IF;
END $$;

-- Product addons table
CREATE TABLE IF NOT EXISTS product_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL DEFAULT 0, -- Additional price in UZS
  type VARCHAR(20) NOT NULL DEFAULT 'single', -- 'single' or 'multi'
  max_select INTEGER DEFAULT 1, -- For multi type
  is_active BOOLEAN DEFAULT true,
  sort INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for product_addons (safe)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_addons_product') THEN
    CREATE INDEX idx_addons_product ON product_addons(product_id);
  END IF;
END $$;

-- Telegram users table
CREATE TABLE IF NOT EXISTS tg_users (
  tg_id BIGINT PRIMARY KEY,
  username VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Branches table (optional, for pickup locations)
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  address TEXT,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  phone VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for branches (safe)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_branches_restaurant') THEN
    CREATE INDEX idx_branches_restaurant ON branches(restaurant_id);
  END IF;
END $$;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  tg_id BIGINT NOT NULL REFERENCES tg_users(tg_id),
  status VARCHAR(50) NOT NULL DEFAULT 'new', -- 'new', 'preparing', 'ready', 'delivered', 'cancelled'
  delivery_mode VARCHAR(20) NOT NULL, -- 'delivery' or 'pickup'
  phone VARCHAR(50) NOT NULL,
  address TEXT, -- For delivery
  pickup_branch_id UUID, -- For pickup (optional, references branches)
  comment TEXT, -- General order comment
  total INTEGER NOT NULL, -- Total in UZS
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for orders (safe)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_restaurant') THEN
    CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_tg_user') THEN
    CREATE INDEX idx_orders_tg_user ON orders(tg_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_status') THEN
    CREATE INDEX idx_orders_status ON orders(status);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_created') THEN
    CREATE INDEX idx_orders_created ON orders(created_at DESC);
  END IF;
END $$;

-- Add foreign key for pickup_branch_id in orders (safe)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_orders_pickup_branch'
  ) THEN
    ALTER TABLE orders 
    ADD CONSTRAINT fk_orders_pickup_branch 
    FOREIGN KEY (pickup_branch_id) REFERENCES branches(id);
  END IF;
END $$;

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  title VARCHAR(255) NOT NULL, -- Snapshot of product title
  price INTEGER NOT NULL, -- Snapshot of price at order time
  qty INTEGER NOT NULL DEFAULT 1,
  addons_json JSONB, -- Array of selected addon IDs and titles
  item_comment TEXT, -- Comment for this specific item
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for order_items (safe)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_order_items_order') THEN
    CREATE INDEX idx_order_items_order ON order_items(order_id);
  END IF;
END $$;

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

-- Indexes for admin_users (safe)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_users_username') THEN
    CREATE INDEX idx_admin_users_username ON admin_users(username);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_users_role') THEN
    CREATE INDEX idx_admin_users_role ON admin_users(role);
  END IF;
END $$;

-- Add telegram_id column to admin_users table
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

-- Order status logs table (audit trail)
CREATE TABLE IF NOT EXISTS order_status_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES admin_users(id),
  from_status VARCHAR(50),
  to_status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for order_status_logs (safe)
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

-- ============================================
-- PART 3: SEED DATA
-- ============================================

-- Insert default restaurant
INSERT INTO restaurants (id, name, description, phone, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'Zahratun Food', 'Zahratun Food restorani', '+998901234567', true)
ON CONFLICT DO NOTHING;

-- Insert categories
INSERT INTO categories (id, restaurant_id, title, sort, is_active) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Lavash', 1, true),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Hot-dog', 2, true),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Pitsa', 3, true),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Doner', 4, true),
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Gazaklar', 5, true),
('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Burger', 6, true),
('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'Ichimliklar', 7, true),
('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 'Shirinliklar', 8, true),
('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001', 'Souslar', 9, true)
ON CONFLICT DO NOTHING;

-- Insert products for Lavash category
INSERT INTO products (id, restaurant_id, category_id, title, description, price, image_url, is_active, sort, tags, rating) VALUES
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Lavash klassik', 'Tovuq go''shti, pomidor, piyoz, sous', 35000, 'https://via.placeholder.com/300x300?text=Lavash+Klassik', true, 1, ARRAY['best_seller'], 5.0),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Lavash pishloqli', 'Tovuq go''shti, pishloq, pomidor, piyoz', 40000, 'https://via.placeholder.com/300x300?text=Lavash+Pishloqli', true, 2, ARRAY['best_seller', 'cheesy'], 5.0),
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Lavash achchiq', 'Tovuq go''shti, achchiq sous, pomidor', 38000, 'https://via.placeholder.com/300x300?text=Lavash+Achchiq', true, 3, ARRAY['spicy', 'chicken'], 4.8),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Lavash mini', 'Kichik lavash', 25000, 'https://via.placeholder.com/300x300?text=Lavash+Mini', true, 4, ARRAY['new'], 4.9)
ON CONFLICT DO NOTHING;

-- Insert products for Hot-dog category
INSERT INTO products (id, restaurant_id, category_id, title, description, price, image_url, is_active, sort, tags, rating) VALUES
('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Hot-dog klassik', 'Sosiska, non, sous', 20000, 'https://via.placeholder.com/300x300?text=Hot-dog+Klassik', true, 1, ARRAY['best_seller'], 5.0),
('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Hot-dog pishloqli', 'Sosiska, pishloq, non, sous', 25000, 'https://via.placeholder.com/300x300?text=Hot-dog+Pishloqli', true, 2, ARRAY['cheesy'], 4.9)
ON CONFLICT DO NOTHING;

-- Insert products for Pitsa category
INSERT INTO products (id, restaurant_id, category_id, title, description, price, image_url, is_active, sort, tags, rating) VALUES
('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Pitsa Margarita', 'Pomidor, pishloq, bazilik', 65000, 'https://via.placeholder.com/300x300?text=Pitsa+Margarita', true, 1, ARRAY['best_seller', 'cheesy'], 5.0),
('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Pitsa Pepperoni', 'Pepperoni, pishloq, pomidor', 75000, 'https://via.placeholder.com/300x300?text=Pitsa+Pepperoni', true, 2, ARRAY['cheesy'], 4.8),
('20000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Pitsa tovuq', 'Tovuq go''shti, pishloq, qo''ziqorin', 70000, 'https://via.placeholder.com/300x300?text=Pitsa+Tovuq', true, 3, ARRAY['chicken', 'cheesy'], 4.9)
ON CONFLICT DO NOTHING;

-- Insert products for Doner category
INSERT INTO products (id, restaurant_id, category_id, title, description, price, image_url, is_active, sort, tags, rating) VALUES
('20000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'Doner klassik', 'Tovuq doner, pomidor, piyoz, sous', 30000, 'https://via.placeholder.com/300x300?text=Doner+Klassik', true, 1, ARRAY['best_seller', 'chicken'], 5.0),
('20000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'Doner pishloqli', 'Tovuq doner, pishloq, pomidor', 35000, 'https://via.placeholder.com/300x300?text=Doner+Pishloqli', true, 2, ARRAY['cheesy', 'chicken'], 4.9)
ON CONFLICT DO NOTHING;

-- Insert products for Ichimliklar category
INSERT INTO products (id, restaurant_id, category_id, title, description, price, image_url, is_active, sort, tags, rating) VALUES
('20000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000007', 'Coca-Cola 0.5L', 'Sovuq ichimlik', 8000, 'https://via.placeholder.com/300x300?text=Coca-Cola', true, 1, ARRAY[]::text[], 5.0),
('20000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000007', 'Pepsi 0.5L', 'Sovuq ichimlik', 8000, 'https://via.placeholder.com/300x300?text=Pepsi', true, 2, ARRAY[]::text[], 5.0),
('20000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000007', 'Fanta 0.5L', 'Sovuq ichimlik', 8000, 'https://via.placeholder.com/300x300?text=Fanta', true, 3, ARRAY[]::text[], 5.0)
ON CONFLICT DO NOTHING;

-- Insert product addons
INSERT INTO product_addons (id, product_id, title, price, type, max_select, is_active, sort) VALUES
-- Addons for Lavash
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Pishloq 100 gr', 5000, 'single', 1, true, 1),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Achchiq sous', 2000, 'single', 1, true, 2),
-- Addons for Pitsa
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000007', 'Qo''shimcha pishloq', 10000, 'single', 1, true, 1),
('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000007', 'Qo''shimcha go''sht', 15000, 'single', 1, true, 2)
ON CONFLICT DO NOTHING;

-- Insert sample branches
INSERT INTO branches (id, restaurant_id, title, address, phone, is_active) VALUES
('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Filial 1 - Chilonzor', 'Chilonzor tumani, Amir Temur ko''chasi', '+998901234567', true),
('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Filial 2 - Yunusobod', 'Yunusobod tumani, Bunyodkor ko''chasi', '+998901234568', true)
ON CONFLICT DO NOTHING;

-- Insert default admin user with Telegram ID
-- Default credentials: username=123456789, password=123456789
-- Telegram ID: 5584607975 (@mdra088)
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

-- ============================================
-- PART 4: VERIFICATION
-- ============================================

-- Verify restaurant
SELECT 'Restaurant' as table_name, COUNT(*) as count FROM restaurants;

-- Verify categories
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories;

-- Verify products
SELECT 'Products' as table_name, COUNT(*) as count FROM products;

-- Verify addons
SELECT 'Addons' as table_name, COUNT(*) as count FROM product_addons;

-- Verify branches
SELECT 'Branches' as table_name, COUNT(*) as count FROM branches;

-- Verify admin user
SELECT 
  'Admin User' as table_name,
  id, 
  username, 
  role, 
  telegram_id, 
  is_active 
FROM admin_users 
WHERE telegram_id = 5584607975;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- 
-- Database tayyor!
-- 
-- Admin Panel kirish:
--   Username: 123456789
--   Password: 123456789
--   Telegram ID: 5584607975 (@mdra088)
-- 
-- Birinchi kirishda parolni o'zgartirish talab qilinadi.
-- ============================================
