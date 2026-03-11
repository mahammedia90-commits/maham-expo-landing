'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { authService } from '../services/authService';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { t, isRtl } = useLanguageStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errors, setErrors] = useState<{ currentPassword?: string; newPassword?: string; confirmNewPassword?: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  const mutation = useMutation({
    mutationFn: () => authService.changePassword(currentPassword, newPassword, confirmNewPassword),
    onSuccess: () => {
      setSuccessMessage(t.merchantAuth.changePasswordSuccess);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setErrors({});
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 2000);
    },
  });

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!currentPassword.trim()) newErrors.currentPassword = t.merchantAuth.currentPasswordRequired;
    if (!newPassword.trim()) {
      newErrors.newPassword = t.merchantAuth.newPasswordRequired;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = t.merchantAuth.newPasswordMin;
    }
    if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = t.merchantAuth.passwordMismatch;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate();
  };

  const serverError = mutation.isError
    ? (mutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message || String(mutation.error)
    : '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8"
        dir={isRtl ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-6">
          {t.merchantAuth.changePasswordTitle}
        </h2>

        {/* Success message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm text-center"
          >
            {successMessage}
          </motion.div>
        )}

        {/* Server error */}
        {serverError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center"
          >
            {serverError}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t.merchantAuth.currentPassword}
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); setErrors(prev => ({ ...prev, currentPassword: undefined })); }}
              className={`w-full px-4 py-3 rounded-xl border ${errors.currentPassword ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#987012] focus:border-transparent outline-none transition-all`}
              dir="ltr"
              autoComplete="current-password"
            />
            {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t.merchantAuth.newPassword}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setErrors(prev => ({ ...prev, newPassword: undefined })); }}
              className={`w-full px-4 py-3 rounded-xl border ${errors.newPassword ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#987012] focus:border-transparent outline-none transition-all`}
              dir="ltr"
              autoComplete="new-password"
            />
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t.merchantAuth.confirmNewPassword}
            </label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => { setConfirmNewPassword(e.target.value); setErrors(prev => ({ ...prev, confirmNewPassword: undefined })); }}
              className={`w-full px-4 py-3 rounded-xl border ${errors.confirmNewPassword ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#987012] focus:border-transparent outline-none transition-all`}
              dir="ltr"
              autoComplete="new-password"
            />
            {errors.confirmNewPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#987012] to-[#D4B85A] hover:from-[#B8860B] hover:to-[#E8C860] text-white font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {mutation.isPending ? '...' : t.merchantAuth.changePasswordTitle}
            </motion.button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              {t.common.cancel}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
