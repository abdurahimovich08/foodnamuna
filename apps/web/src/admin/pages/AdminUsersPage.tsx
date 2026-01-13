import { useState, useEffect } from 'react';
import { adminUsersAPI } from '../api/adminClient';
import AdminUserModal from '../components/AdminUserModal';
import ResetPasswordModal from '../components/ResetPasswordModal';
import { getRoleLabel } from '../utils/format';
import type { AdminUserListItem } from '../types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminUsersAPI.list();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load admin users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user: AdminUserListItem) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleResetPassword = (user: AdminUserListItem) => {
    setSelectedUser(user);
    setResetPasswordModalOpen(true);
  };

  const handleSave = async () => {
    await loadUsers();
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleResetPasswordComplete = async () => {
    await loadUsers();
    setResetPasswordModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Adminlar</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark"
        >
          + Yangi admin
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Yuklanmoqda...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Foydalanuvchi nomi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parol o'zgartirish</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harakatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.username}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{getRoleLabel(user.role)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.is_active ? 'Faol' : 'Nofaol'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {user.must_change_password && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Majburiy
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-primary hover:text-primary-dark font-medium"
                      >
                        Tahrirlash
                      </button>
                      <button
                        onClick={() => handleResetPassword(user)}
                        className="text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Parolni tiklash
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <AdminUserModal
          user={selectedUser}
          onClose={() => {
            setModalOpen(false);
            setSelectedUser(null);
          }}
          onSave={handleSave}
        />
      )}

      {resetPasswordModalOpen && selectedUser && (
        <ResetPasswordModal
          userId={selectedUser.id}
          username={selectedUser.username}
          onClose={() => {
            setResetPasswordModalOpen(false);
            setSelectedUser(null);
          }}
          onComplete={handleResetPasswordComplete}
        />
      )}
    </div>
  );
}
