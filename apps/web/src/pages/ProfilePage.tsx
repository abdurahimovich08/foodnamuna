import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const menuItems = [
  { path: '/about', label: 'Biz haqimizda', icon: 'ℹ️' },
  { path: '/promos', label: 'Aksiyalar', icon: '🎁' },
  { path: '/branches', label: 'Filiallar', icon: '📍' },
  { path: '/contacts', label: 'Kontaktlar', icon: '📞' },
  { path: '/language', label: 'Til', icon: '🌐' },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, authStatus } = useUserStore();

  const displayName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.first_name || user?.username || 'Foydalanuvchi';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        {authStatus === 'authenticated' && user ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {displayName}
            </h2>
            {user.username && (
              <p className="text-sm text-gray-500">@{user.username}</p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">Telegram orqali kirish talab qilinadi</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium"
            >
              Kirish
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium text-gray-900">{item.label}</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </button>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        Powered by Delever
      </div>
    </div>
  );
}
