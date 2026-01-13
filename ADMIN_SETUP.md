# Admin Panel Setup Guide

## Database Setup

### 1. Run Admin Migrations

1. Go to Supabase Dashboard > SQL Editor
2. Run `supabase/migrations_admin.sql` (or the admin tables section from `migrations.sql`)
3. This creates:
   - `admin_users` table
   - `order_status_logs` table

### 2. Seed Default Admin

1. **Generate bcrypt hash for password**:
   ```bash
   node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('123456789', 10));"
   ```

2. Update `supabase/seed_admin.sql` with the generated hash

3. Run `supabase/seed_admin.sql` in Supabase SQL Editor

**OR** use this pre-generated hash (for '123456789'):
```
$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

### 3. Environment Variables

Add to Vercel environment variables:
```
ADMIN_JWT_SECRET=your-secret-key-here (use a strong random string)
```

## Default Admin Credentials

- **Username**: `123456789`
- **Password**: `123456789`
- **Role**: `owner`
- **Must Change Password**: `true` (will prompt on first login)

## Admin Roles

- **owner**: Full access (menu, orders, admin users, settings)
- **manager**: Menu CRUD + Orders management
- **operator**: Orders view + status updates only

## API Endpoints

### Auth
- `POST /api/admin/login` - Login with username/password
- `POST /api/admin/logout` - Logout
- `GET /api/admin/me` - Get current admin user
- `POST /api/admin/change-password` - Change password

### Orders
- `GET /api/admin/orders?status=new` - List orders (filter by status)
- `GET /api/admin/orders/:id` - Get order details
- `POST /api/admin/orders/:id/status` - Update order status

### Categories (owner/manager only)
- `GET /api/admin/categories` - List categories
- `POST /api/admin/categories` - Create category
- `GET /api/admin/categories/:id` - Get category
- `PATCH /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category (soft)

### Products (owner/manager only)
- `GET /api/admin/products` - List products
- `POST /api/admin/products` - Create product
- `GET /api/admin/products/:id` - Get product
- `PATCH /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product (soft)

### Admin Users (owner only)
- `GET /api/admin/admin-users` - List admin users
- `POST /api/admin/admin-users` - Create admin user
- `PATCH /api/admin/admin-users/:id` - Update admin user
- `POST /api/admin/admin-users/:id/reset-password` - Reset password

## Authentication

Admin API uses JWT tokens:
- Sent via `Authorization: Bearer <token>` header
- OR via `admin_token` cookie (HttpOnly, SameSite=Strict)

## Rate Limiting

Login endpoint has rate limiting:
- 5 attempts per minute per IP
- Returns 429 if exceeded

## Security Notes

1. **Password Hashing**: Uses bcryptjs (10 rounds)
2. **JWT Secret**: Set `ADMIN_JWT_SECRET` in environment variables
3. **Cookie Security**: HttpOnly, SameSite=Strict
4. **Role-Based Access**: All endpoints check admin role
5. **No Hardcoded Credentials**: All credentials in database

## Next Steps

1. ✅ Database migrations
2. ✅ Seed default admin
3. ✅ Auth API endpoints
4. ✅ Orders API endpoints
5. ⏳ Frontend admin panel (coming next)
6. ⏳ Menu CRUD API endpoints
7. ⏳ Admin Users CRUD API endpoints
