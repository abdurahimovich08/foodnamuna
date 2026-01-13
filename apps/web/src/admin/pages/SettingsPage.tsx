import { useState, FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAdminAuthStore } from '../stores/useAdminAuthStore';
import { getRoleLabel } from '../utils/format';

export default function SettingsPage() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'password';
  const { admin, changePassword } = useAdminAuthStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError("Yangi parol kamida 6 belgidan iborat bo'lishi kerak");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Parollar mos kelmaydi');
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess("Parol muvaffaqiyatli o'zgartirildi");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      if (err.message.includes('incorrect') || err.message.includes('Current')) {
        setError("Joriy parol noto'g'ri");
      } else {
        setError(err.message || "Parolni o'zgartirishda xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sozlamalar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {tab === 'password' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Parolni o&apos;zgartirish</h2>

              {admin?.must_change_password && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
                  <p className="font-medium">Parolni o&apos;zgartirish majburiy!</p>
                  <p className="text-sm mt-1">Davom etish uchun parolni o&apos;zgartiring.</p>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    {success}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Joriy parol *
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yangi parol *
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">Kamida 6 belgi</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yangi parolni tasdiqlash *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50"
                >
                  {loading ? "O'zgartirilmoqda..." : "Parolni o'zgartirish"}
                </button>
              </form>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hisob ma'lumotlari</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Foydalanuvchi nomi:</span>
                <p className="font-medium text-gray-900">{admin?.username}</p>
              </div>
              <div>
                <span className="text-gray-600">Rol:</span>
                <p className="font-medium text-gray-900">{getRoleLabel(admin?.role || '')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
