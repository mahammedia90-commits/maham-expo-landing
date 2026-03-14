'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { permissionsApi, type Permission } from '@/services/adminService';

export function PermissionsSection() {
  const { t, isRtl } = useLanguageStore();
  const a = t.admin || {} as Record<string, string>;

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPerm, setEditingPerm] = useState<Permission | null>(null);
  const [deletingPerm, setDeletingPerm] = useState<Permission | null>(null);
  const [form, setForm] = useState({ name: '', display_name: '', description: '' });
  const [resourceForm, setResourceForm] = useState({ resource: '', actions: 'view,create,update,delete' });
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await permissionsApi.list();
      // API returns { data: { permissions: [...] } } or { data: [...] }
      const list = (res.data as any)?.permissions ?? (Array.isArray(res.data) ? res.data : []);
      setPermissions(list);
    } catch { setPermissions([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => { setEditingPerm(null); setForm({ name: '', display_name: '', description: '' }); setApiError(''); setShowModal(true); };
  const openEdit = (p: Permission) => { setEditingPerm(p); setForm({ name: p.name, display_name: p.display_name || '', description: p.description || '' }); setApiError(''); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true); setApiError('');
    try {
      if (editingPerm) { await permissionsApi.update(editingPerm.id, form); }
      else { await permissionsApi.create(form); }
      setShowModal(false); fetchData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setApiError(error?.response?.data?.message || 'Error');
    } finally { setSaving(false); }
  };

  const handleCreateResource = async () => {
    if (!resourceForm.resource.trim()) return;
    setSaving(true); setApiError('');
    try {
      await permissionsApi.createResource({
        resource: resourceForm.resource,
        actions: resourceForm.actions.split(',').map(a => a.trim()).filter(Boolean),
      });
      setShowResourceModal(false); setResourceForm({ resource: '', actions: 'view,create,update,delete' }); fetchData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setApiError(error?.response?.data?.message || 'Error');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deletingPerm) return;
    setSaving(true);
    try { await permissionsApi.delete(deletingPerm.id); setShowDeleteModal(false); fetchData(); }
    catch { /* ignore */ } finally { setSaving(false); }
  };

  // Group by resource
  const grouped = permissions.reduce((acc, p) => {
    const group = p.name.split('.')[0] || 'other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(p);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{a.permissionsList || 'Permissions'}</h1>
        <div className="flex gap-2">
          <button onClick={() => { setApiError(''); setShowResourceModal(true); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#987012] text-[#987012] dark:text-[#D4B85A] dark:border-[#D4B85A] font-medium text-sm">
            {a.createResource || 'Create Resource'}
          </button>
          <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#987012] to-[#D4B85A] text-white font-medium text-sm shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            {a.addPermission || 'Add'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-[#987012] border-t-transparent rounded-full animate-spin" /></div>
      ) : Object.keys(grouped).length === 0 ? (
        <p className="text-center py-12 text-gray-500">{a.noResults || 'No results'}</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([group, perms]) => (
            <div key={group} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 capitalize">{group}</h3>
              <div className="flex flex-wrap gap-2">
                {perms.map(p => (
                  <div key={p.id} className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                    <span className="text-xs text-gray-700 dark:text-gray-300">{p.display_name || p.name}</span>
                    <button onClick={() => openEdit(p)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#987012] transition-all">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => { setDeletingPerm(p); setShowDeleteModal(true); }} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md" dir={isRtl ? 'rtl' : 'ltr'}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editingPerm ? (a.editPermission || 'Edit') : (a.addPermission || 'Add')}</h2>
              </div>
              <div className="p-6 space-y-4">
                {apiError && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">{apiError}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{a.permissionName || 'Name'}</label>
                  <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="resource.action" dir="ltr" className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#987012]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{a.permissionDisplayName || 'Display Name'}</label>
                  <input type="text" value={form.display_name} onChange={e => setForm(p => ({ ...p, display_name: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#987012]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{a.permissionDescription || 'Description'}</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#987012] resize-none" />
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

      {/* Resource Modal */}
      <AnimatePresence>
        {showResourceModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowResourceModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md" dir={isRtl ? 'rtl' : 'ltr'}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{a.createResource || 'Create Resource Permissions'}</h2>
              </div>
              <div className="p-6 space-y-4">
                {apiError && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">{apiError}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{a.resourceName || 'Resource Name'}</label>
                  <input type="text" value={resourceForm.resource} onChange={e => setResourceForm(p => ({ ...p, resource: e.target.value }))} placeholder="e.g. reports" dir="ltr" className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#987012]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{a.resourceActions || 'Actions'}</label>
                  <input type="text" value={resourceForm.actions} onChange={e => setResourceForm(p => ({ ...p, actions: e.target.value }))} dir="ltr" className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#987012]" />
                  <p className="text-xs text-gray-400 mt-1">view, create, update, delete</p>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button onClick={() => setShowResourceModal(false)} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium">{a.cancel || 'Cancel'}</button>
                <button onClick={handleCreateResource} disabled={saving} className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#987012] to-[#D4B85A] text-white text-sm font-medium disabled:opacity-60">{saving ? (a.saving || 'Saving...') : (a.save || 'Save')}</button>
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
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{a.confirmDelete || 'Confirm'}</h3>
              <p className="text-gray-500 text-sm mb-6">{a.confirmDeleteDesc || 'This cannot be undone'}</p>
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
