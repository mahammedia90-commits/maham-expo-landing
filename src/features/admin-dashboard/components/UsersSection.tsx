'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { usersApi, rolesApi, type AdminUser, type Role } from '@/services/adminService';

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  status: string;
  roles: string[];
}

const emptyForm: UserFormData = { name: '', email: '', phone: '', password: '', password_confirmation: '', status: 'active', roles: [] };

export function UsersSection() {
  const { t, isRtl } = useLanguageStore();
  const a = t.admin || {} as Record<string, string>;

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<UserFormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        usersApi.list({ search: search || undefined }),
        rolesApi.list(),
      ]);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setErrors({});
    setApiError('');
    setShowModal(true);
  };

  const openEdit = (user: AdminUser) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      password: '',
      password_confirmation: '',
      status: user.status,
      roles: user.roles || [],
    });
    setErrors({});
    setApiError('');
    setShowModal(true);
  };

  const openDelete = (user: AdminUser) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = a.userName + ' required';
    if (!form.email.trim()) newErrors.email = a.userEmail + ' required';
    if (!editingUser) {
      if (!form.password) newErrors.password = a.userPassword + ' required';
      if (form.password !== form.password_confirmation) newErrors.password_confirmation = 'Passwords do not match';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSaving(true);
    setApiError('');
    try {
      if (editingUser) {
        await usersApi.update(editingUser.id, {
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          status: form.status,
          roles: form.roles,
        });
      } else {
        await usersApi.create({
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
          phone: form.phone || undefined,
          status: form.status,
          roles: form.roles,
        });
      }
      setShowModal(false);
      fetchUsers();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setApiError(error?.response?.data?.message || 'Error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setSaving(true);
    try {
      await usersApi.delete(deletingUser.id);
      setShowDeleteModal(false);
      setDeletingUser(null);
      fetchUsers();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const toggleRole = (roleName: string) => {
    setForm(prev => ({
      ...prev,
      roles: prev.roles.includes(roleName)
        ? prev.roles.filter(r => r !== roleName)
        : [...prev.roles, roleName],
    }));
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'suspended': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'blocked': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'active': return a.statusActive || 'Active';
      case 'suspended': return a.statusSuspended || 'Suspended';
      case 'blocked': return a.statusBlocked || 'Blocked';
      default: return status;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{a.usersList || 'Users'}</h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#987012] to-[#D4B85A] text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {a.addUser || 'Add User'}
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={a.search || 'Search...'}
          className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#987012] outline-none"
          dir={isRtl ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{a.userName || 'Name'}</th>
                <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{a.userEmail || 'Email'}</th>
                <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">{a.userPhone || 'Phone'}</th>
                <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{a.userStatus || 'Status'}</th>
                <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400 hidden lg:table-cell">{a.userRoles || 'Roles'}</th>
                <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{a.actions || 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">
                  <div className="w-8 h-8 border-3 border-[#987012] border-t-transparent rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500 dark:text-gray-400">{a.noResults || 'No results'}</td></tr>
              ) : users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300" dir="ltr">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell" dir="ltr">{user.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(user.status)}`}>
                      {statusLabel(user.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {user.roles?.map(r => (
                        <span key={r} className="px-2 py-0.5 rounded-full text-xs bg-[#987012]/10 text-[#987012] dark:bg-[#D4B85A]/10 dark:text-[#D4B85A]">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(user)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-[#987012] transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => openDelete(user)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingUser ? (a.editUser || 'Edit User') : (a.addUser || 'Add User')}
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {apiError && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                    {apiError}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{a.userName || 'Name'}</label>
                  <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={`w-full px-3 py-2.5 rounded-xl border ${errors.name ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#987012]`} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{a.userEmail || 'Email'}</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} dir="ltr" className={`w-full px-3 py-2.5 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#987012]`} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{a.userPhone || 'Phone'}</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} dir="ltr" className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#987012]" />
                </div>

                {/* Password (only for create) */}
                {!editingUser && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{a.userPassword || 'Password'}</label>
                      <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} dir="ltr" className={`w-full px-3 py-2.5 rounded-xl border ${errors.password ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#987012]`} />
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{a.userConfirmPassword || 'Confirm Password'}</label>
                      <input type="password" value={form.password_confirmation} onChange={e => setForm(p => ({ ...p, password_confirmation: e.target.value }))} dir="ltr" className={`w-full px-3 py-2.5 rounded-xl border ${errors.password_confirmation ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#987012]`} />
                      {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                    </div>
                  </>
                )}

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{a.userStatus || 'Status'}</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#987012]">
                    <option value="active">{a.statusActive || 'Active'}</option>
                    <option value="suspended">{a.statusSuspended || 'Suspended'}</option>
                    <option value="blocked">{a.statusBlocked || 'Blocked'}</option>
                  </select>
                </div>

                {/* Roles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{a.userRoles || 'Roles'}</label>
                  <div className="flex flex-wrap gap-2">
                    {roles.map(role => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => toggleRole(role.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          form.roles.includes(role.name)
                            ? 'border-[#987012] bg-[#987012]/10 text-[#987012] dark:border-[#D4B85A] dark:bg-[#D4B85A]/10 dark:text-[#D4B85A]'
                            : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                        }`}
                      >
                        {role.display_name || role.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  {a.cancel || 'Cancel'}
                </button>
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#987012] to-[#D4B85A] text-white text-sm font-medium disabled:opacity-60 transition-all">
                  {saving ? (a.saving || 'Saving...') : (a.save || 'Save')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6" dir={isRtl ? 'rtl' : 'ltr'}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{a.confirmDelete || 'Confirm Delete'}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{a.confirmDeleteDesc || 'This action cannot be undone'}</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                  {a.cancel || 'Cancel'}
                </button>
                <button onClick={handleDelete} disabled={saving} className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium disabled:opacity-60 hover:bg-red-600">
                  {saving ? (a.deleting || 'Deleting...') : (a.delete || 'Delete')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
