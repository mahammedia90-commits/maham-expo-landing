'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { rolesApi, permissionsApi, type Role, type Permission } from '@/services/adminService';

export function RolesSection() {
  const { t, isRtl } = useLanguageStore();
  const a = t.admin || {} as Record<string, string>;

  const [roles, setRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPermsModal, setShowPermsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [form, setForm] = useState({ name: '', display_name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([rolesApi.list(), permissionsApi.list()]);
      setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : []);
      setAllPermissions(Array.isArray(permsRes.data) ? permsRes.data : []);
    } catch { setRoles([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditingRole(null);
    setForm({ name: '', display_name: '', description: '' });
    setApiError('');
    setShowModal(true);
  };

  const openEdit = (role: Role) => {
    setEditingRole(role);
    setForm({ name: role.name, display_name: role.display_name || '', description: role.description || '' });
    setApiError('');
    setShowModal(true);
  };

  const openPermissions = (role: Role) => {
    setEditingRole(role);
    setSelectedPerms(role.permissions?.map(p => p.name) || []);
    setShowPermsModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    setApiError('');
    try {
      if (editingRole) {
        await rolesApi.update(editingRole.id, form);
      } else {
        await rolesApi.create(form);
      }
      setShowModal(false);
      fetchData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setApiError(error?.response?.data?.message || 'Error');
    } finally { setSaving(false); }
  };

  const handleSyncPermissions = async () => {
    if (!editingRole) return;
    setSaving(true);
    try {
      await rolesApi.syncPermissions(editingRole.id, selectedPerms);
      setShowPermsModal(false);
      fetchData();
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deletingRole) return;
    setSaving(true);
    try {
      await rolesApi.delete(deletingRole.id);
      setShowDeleteModal(false);
      fetchData();
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  const togglePerm = (name: string) => {
    setSelectedPerms(prev => prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]);
  };

  // Group permissions by resource (e.g., users.view -> users)
  const groupedPermissions = allPermissions.reduce((acc, perm) => {
    const group = perm.name.split('.')[0] || 'other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{a.rolesList || 'Roles'}</h1>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#987012] to-[#D4B85A] text-white font-medium text-sm shadow-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          {a.addRole || 'Add Role'}
        </button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-[#987012] border-t-transparent rounded-full animate-spin" /></div>
        ) : roles.length === 0 ? (
          <p className="text-center py-12 text-gray-500">{a.noResults || 'No results'}</p>
        ) : roles.map((role) => (
          <div key={role.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{role.display_name || role.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{role.name}</p>
                {role.description && <p className="text-sm text-gray-500 mt-1">{role.description}</p>}
                {role.permissions && role.permissions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {role.permissions.slice(0, 5).map(p => (
                      <span key={p.id} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{p.name}</span>
                    ))}
                    {role.permissions.length > 5 && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-500">+{role.permissions.length - 5}</span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openPermissions(role)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-purple-600 transition-colors" title={a.syncPermissions || 'Permissions'}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                </button>
                <button onClick={() => openEdit(role)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-[#987012] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => { setDeletingRole(role); setShowDeleteModal(true); }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md" dir={isRtl ? 'rtl' : 'ltr'}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editingRole ? (a.editRole || 'Edit Role') : (a.addRole || 'Add Role')}</h2>
              </div>
              <div className="p-6 space-y-4">
                {apiError && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{apiError}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{a.roleName || 'Role Name'}</label>
                  <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#987012]" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{a.roleDisplayName || 'Display Name'}</label>
                  <input type="text" value={form.display_name} onChange={e => setForm(p => ({ ...p, display_name: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#987012]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{a.roleDescription || 'Description'}</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#987012] resize-none" />
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium">{a.cancel || 'Cancel'}</button>
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#987012] to-[#D4B85A] text-white text-sm font-medium disabled:opacity-60">{saving ? (a.saving || 'Saving...') : (a.save || 'Save')}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Permissions Sync Modal */}
      <AnimatePresence>
        {showPermsModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPermsModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col" dir={isRtl ? 'rtl' : 'ltr'}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{a.rolePermissions || 'Role Permissions'} — {editingRole?.display_name || editingRole?.name}</h2>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {Object.entries(groupedPermissions).map(([group, perms]) => (
                  <div key={group}>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 capitalize">{group}</h4>
                    <div className="flex flex-wrap gap-2">
                      {perms.map(p => (
                        <button key={p.id} type="button" onClick={() => togglePerm(p.name)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedPerms.includes(p.name) ? 'border-[#987012] bg-[#987012]/10 text-[#987012] dark:border-[#D4B85A] dark:bg-[#D4B85A]/10 dark:text-[#D4B85A]' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'}`}>
                          {p.display_name || p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button onClick={() => setShowPermsModal(false)} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium">{a.cancel || 'Cancel'}</button>
                <button onClick={handleSyncPermissions} disabled={saving} className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#987012] to-[#D4B85A] text-white text-sm font-medium disabled:opacity-60">{saving ? (a.saving || 'Saving...') : (a.syncPermissions || 'Sync')}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6" dir={isRtl ? 'rtl' : 'ltr'}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{a.confirmDelete || 'Confirm Delete'}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{a.confirmDeleteDesc || 'This cannot be undone'}</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium">{a.cancel || 'Cancel'}</button>
                <button onClick={handleDelete} disabled={saving} className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium disabled:opacity-60">{saving ? (a.deleting || 'Deleting...') : (a.delete || 'Delete')}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
