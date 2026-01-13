import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  UserIcon as UserIconSolid,
} from '@heroicons/react/24/solid';
import { useCartStore } from '../stores/useCartStore';

export default function BottomNav() {
  const location = useLocation();
  const itemCount = useCartStore((state) => state.getItemCount());

  const navItems = [
    { path: '/', icon: HomeIcon, iconSolid: HomeIconSolid, label: 'Bosh sahifa' },
    {
      path: '/cart',
      icon: ShoppingBagIcon,
      iconSolid: ShoppingBagIconSolid,
      label: 'Savat',
      badge: itemCount > 0 ? itemCount : undefined,
    },
    {
      path: '/orders',
      icon: ClipboardDocumentListIcon,
      iconSolid: ClipboardDocumentListIconSolid,
      label: 'Buyurtmalar',
    },
    { path: '/profile', icon: UserIcon, iconSolid: UserIconSolid, label: 'Profil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = isActive ? item.iconSolid : item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center relative px-4 py-2"
              >
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                <Icon
                  className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-gray-500'}`}
                />
                <span
                  className={`text-xs mt-1 ${isActive ? 'text-primary font-medium' : 'text-gray-500'}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
