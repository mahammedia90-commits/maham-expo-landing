'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { servicesApi, type Service } from '@/services/adminService';

export function ServicesSection() {
  const { t, isRtl } = useLanguageStore();
  const a = t.admin || {} as Record<string, string>;

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: '', base_url: '', description: '', is_active: true });
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await servicesApi.list();
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch { setServices([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => { setEditingService(null); setForm({ name: '', base_url: '', description: '', is_active: true }); setApiError(''); setShowModal(true); };
  const openEdit = (s: Service) => { setEditingService(s); setForm({ name: s.name, base_url: s.base_url, description: s.description || '', is_active: s.is_active }); setApiError(''); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.base_url.trim()) return;
    setSaving(true); setApiError('');
    try {
      if (editingService) { await servicesApi.update(editingService.id, form); }
      else { await servicesApi.create(form); }
      setShowModal(false); fetchData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setApiError(error?.response?.data?.message || 'Error');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deletingService) return;
    setSaving(true);
    try { await servicesApi.delete(deletingService.id); setShowDeleteModal(false); fetchData(); }
    catch { /* ignore */ } finally { setSaving(false); }
  };

  const handleRegenToken = async (service: Service) => {
    try {
      await servicesApi.regenerateToken(service.id);
      fetchData();
    } catch { /* ignore */ }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{a.servicesList || 'Services'}</h1>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#987012] to-[#D4B85A] text-white font-medium text-sm shadow-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          {a.addService || 'Add Service'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-[#987012] border-t-transparent rounded-full animate-spin" /></div>
      ) : services.length === 0 ? (
        <p className="text-center py-12 text-gray-500">{a.noResults || 'No results'}</p>
      ) : (
        <div className="grid gap-4">
          {services.map(service => (
            <div key={service.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${service.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {service.is_active ? (a.serviceActive || 'Active') : (a.serviceInactive || 'Inactive')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate" dir="ltr">{service.base_url}</p>
                  {service.description && <p className="text-sm text-gray-500 mt-1">{service.description}</p>}
                  {service.token && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400">{a.serviceToken || 'Token'}</p>
                      <code className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded block mt-0.5 truncate" dir="ltr">{service.token}</code>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0 ms-4">
                  <button onClick={() => handleRegenToken(service)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-orange-500 transition-colors" title={a.regenerateToken || 'Regenerate Token'}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </button>
                  <button onClick={() => openEdit(service)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-[#987012] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => { setDeletingService(service); setShowDeleteModal(true); }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
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
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editingService ? (a.editService || 'Edit') : (a.addService || 'Add')}</h2>
              </div>
              <div className="p-6 space-y-4">
                {apiError && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">{apiError}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{a.serviceName || 'Name'}</label>
                  <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#987012]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{a.serviceUrl || 'URL'}</label>
                  <input type="url" value={form.base_url} onChange={e => setForm(p => ({ ...p, base_url: e.target.value }))} dir="ltr" placeholder="https://..." className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#987012]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{a.serviceDescription || 'Description'}</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#987012] resize-none" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{a.userStatus || 'Status'}</label>
                  <button type="button" onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))} className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? 'bg-[#987012]' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <span className={`absolute top-0.5 ${form.is_active ? 'ltr:left-5 rtl:right-5' : 'ltr:left-0.5 rtl:right-0.5'} w-5 h-5 rounded-full bg-white shadow transition-all`} />
                  </button>
                  <span className="text-sm text-gray-500">{form.is_active ? (a.serviceActive || 'Active') : (a.serviceInactive || 'Inactive')}</span>
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
