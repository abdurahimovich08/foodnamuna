import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon, Bars3Icon } from '@heroicons/react/24/outline';

export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = location.pathname !== '/';

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => (showBack ? navigate(-1) : null)}
          className={`p-2 ${showBack ? '' : 'invisible'}`}
        >
          <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Zahratun Food</h1>
        <button className="p-2">
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
