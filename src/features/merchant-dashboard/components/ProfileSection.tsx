'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { authService } from '@/features/auth/services/authService';
import { ChangePasswordModal } from '@/features/auth/components/ChangePasswordModal';
import { EmailVerificationForm } from '@/features/auth/components/EmailVerificationForm';

export function ProfileSection() {
  const { t, isRtl } = useLanguageStore();
  const { user, setAuth } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    businessName: user?.businessName || '',
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const updateProfile = useMutation({
    mutationFn: (data: typeof form) => authService.updateProfile(data),
    onSuccess: (response) => {
      if (response.data && user) {
        setAuth({ ...user, ...response.data }, useAuthStore.getState().token!);
      }
      setIsEditing(false);
      setSuccessMsg(t.dashboard.profileUpdated);
      setTimeout(() => setSuccessMsg(''), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(form);
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {t.dashboard.profileTitle}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Profile header */}
        <div className="bg-gradient-to-r from-[#987012] to-[#D4B85A] p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'M'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-white/80 text-sm">{user?.businessName}</p>
              {user?.createdAt && (
                <p className="text-white/60 text-xs mt-1">
                  {t.dashboard.memberSince} {new Date(user.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Success message */}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm text-center">
            {successMsg}
          </div>
        )}

        {/* Profile form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {[
            { key: 'name' as const, label: t.merchantAuth.name, type: 'text' },
            { key: 'email' as const, label: t.merchantAuth.email, type: 'email' },
            { key: 'phone' as const, label: t.merchantAuth.phone, type: 'tel' },
            { key: 'businessName' as const, label: t.merchantAuth.businessName, type: 'text' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {label}
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-none transition-all ${
                  isEditing
                    ? 'bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-[#987012] focus:border-transparent'
                    : 'bg-gray-100 dark:bg-gray-700/50 cursor-not-allowed'
                }`}
                dir={key === 'email' || key === 'phone' ? 'ltr' : undefined}
              />
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            {isEditing ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#987012] to-[#D4B85A] text-white font-medium disabled:opacity-60 transition-all"
                >
                  {updateProfile.isPending ? t.dashboard.saving : t.dashboard.saveChanges}
                </motion.button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setForm({
                      name: user?.name || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      businessName: user?.businessName || '',
                    });
                  }}
                  className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  {t.common.cancel}
                </button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#987012] to-[#D4B85A] text-white font-medium transition-all"
              >
                {t.dashboard.editProfile}
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t.dashboard.securitySettings}
        </h3>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{t.dashboard.changePassword}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.dashboard.changePasswordDesc}</p>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {t.dashboard.changePassword}
          </button>
        </div>
      </motion.div>

      {/* Email Verification Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <EmailVerificationForm />
      </motion.div>

      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </div>
  );
}
