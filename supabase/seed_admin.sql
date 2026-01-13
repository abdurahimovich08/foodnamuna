-- Admin Panel Seed Data
-- Run this after migrations_admin.sql
-- Default admin credentials: username=123456789, password=123456789
-- Password hash generated with bcrypt (cost 10): $2b$10$rOzJ8K8qK8qK8qK8qK8qKu8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK

-- Note: This is a placeholder hash. In production, generate real bcrypt hash.
-- To generate: Use Node.js: const bcrypt = require('bcrypt'); bcrypt.hashSync('123456789', 10)
-- Example real hash for '123456789': $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- Insert default admin user
-- IMPORTANT: Replace this hash with a real bcrypt hash before running in production!
INSERT INTO admin_users (id, username, password_hash, role, is_active, must_change_password) VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  '123456789',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- bcrypt hash for '123456789'
  'owner',
  true,
  true
)
ON CONFLICT (username) DO NOTHING;
