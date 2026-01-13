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
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Shirinliklar', 8, true),
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
('20000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000007', 'Coca-Cola 0.5L', 'Sovuq ichimlik', 8000, 'https://via.placeholder.com/300x300?text=Coca-Cola', true, 1, ARRAY[], 5.0),
('20000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000007', 'Pepsi 0.5L', 'Sovuq ichimlik', 8000, 'https://via.placeholder.com/300x300?text=Pepsi', true, 2, ARRAY[], 5.0),
('20000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000007', 'Fanta 0.5L', 'Sovuq ichimlik', 8000, 'https://via.placeholder.com/300x300?text=Fanta', true, 3, ARRAY[], 5.0)
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
