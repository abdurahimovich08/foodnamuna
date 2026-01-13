# Admin Panel Frontend - Run Guide

## ✅ Completed Features

- ✅ Admin authentication (login, logout, session management)
- ✅ Must-change-password flow
- ✅ Protected routes with role-based access control
- ✅ Dashboard with order statistics
- ✅ Orders management with polling (10s refresh)
- ✅ Order detail view with status updates
- ✅ Categories CRUD
- ✅ Products CRUD with tags
- ✅ Admin Users management (owner only)
- ✅ Settings page with password change
- ✅ Responsive layout with sidebar

## 🚀 Running Locally

### 1. Install Dependencies

```bash
cd apps/web
npm install
```

### 2. Environment Variables

Create `apps/web/.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_RESTAURANT_ID=00000000-0000-0000-0000-000000000001
VITE_API_BASE=
```

**Note**: Admin panel uses httpOnly cookies, so no frontend env vars needed for auth.

### 3. Run Development Server

```bash
cd apps/web
npm run dev
```

### 4. Access Admin Panel

Open browser: `http://localhost:3000/admin/login`

**Default Credentials**:
- Username: `123456789`
- Password: `123456789`

⚠️ **First login will require password change!**

## 📋 Routes

- `/admin/login` - Login page
- `/admin` - Dashboard
- `/admin/orders` - Orders list
- `/admin/orders/:id` - Order detail
- `/admin/menu/categories` - Categories management (owner/manager)
- `/admin/menu/products` - Products management (owner/manager)
- `/admin/admin-users` - Admin users management (owner only)
- `/admin/settings` - Settings (password change)

## 🔐 Role-Based Access

- **owner**: Full access to all pages
- **manager**: Orders + Menu (Categories/Products) + Settings
- **operator**: Orders (view + status update) + Settings only

## 🎨 Features

### Orders Management
- Real-time polling (10 seconds)
- Filter by status (new, preparing, ready, delivered, cancelled)
- Search by order ID, TG ID, or username
- Status updates with Telegram notifications
- Order detail drawer/modal

### Menu Management
- Categories CRUD with sort order
- Products CRUD with:
  - Category assignment
  - Price, description, image URL
  - Tags (best_seller, new, spicy, cheesy, chicken)
  - Active/inactive toggle
  - Sort order

### Admin Users (Owner Only)
- Create new admin users
- Change roles (owner/manager/operator)
- Enable/disable users
- Reset passwords

### Settings
- Change password (required on first login)
- View account info

## 🐛 Troubleshooting

### Login fails
- Check backend API is running
- Verify `ADMIN_JWT_SECRET` is set in Vercel
- Check browser console for errors
- Verify default admin exists in database

### 401 Unauthorized
- Check cookies are enabled
- Verify JWT token is being sent
- Check backend auth middleware

### 403 Forbidden
- Verify user role has access to the page
- Check `allowedRoles` in ProtectedRoute

### Build Errors
```bash
# Type check
npm run type-check

# Build
npm run build
```

## 📝 Notes

- Admin panel is separate from Mini App routes
- Uses httpOnly cookies for authentication
- All API calls include `credentials: 'include'`
- Polling can be adjusted in `OrdersPage.tsx` (POLL_INTERVAL)
- Image upload: Currently uses URL input. Can be extended with Supabase Storage.

## ✅ Checklist

- [x] Login page
- [x] Must-change-password flow
- [x] Dashboard
- [x] Orders management
- [x] Categories CRUD
- [x] Products CRUD
- [x] Admin Users management
- [x] Settings page
- [x] Role-based access control
- [x] Responsive design
- [x] Error handling
- [x] Loading states

## 🎉 Ready to Use!

Admin panel is fully functional and ready for production use.
