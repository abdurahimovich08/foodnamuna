-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
