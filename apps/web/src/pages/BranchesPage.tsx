import { useState, useEffect } from 'react';
import { getBranches } from '../utils/api';
import { Branch } from '../types';
import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';

const RESTAURANT_ID = import.meta.env.VITE_RESTAURANT_ID || '00000000-0000-0000-0000-000000000001';

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      setLoading(true);
      const data = await getBranches(RESTAURANT_ID);
      setBranches(data);
    } catch (error) {
      console.error('Failed to load branches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Filiallar</h1>
      {branches.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Filiallar mavjud emas
        </div>
      ) : (
        branches.map((branch) => (
          <div key={branch.id} className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">{branch.title}</h3>
            {branch.address && (
              <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                <MapPinIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{branch.address}</span>
              </div>
            )}
            {branch.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <PhoneIcon className="w-5 h-5" />
                <a href={`tel:${branch.phone}`} className="text-primary hover:underline">
                  {branch.phone}
                </a>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
