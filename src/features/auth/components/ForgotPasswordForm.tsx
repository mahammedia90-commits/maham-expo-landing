'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { authService } from '../services/authService';
import { ROUTES } from '@/shared/constants';

export function ForgotPasswordForm() {
  const { t, isRtl } = useLanguageStore();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});

  const forgotPassword = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = t.merchantAuth.emailRequired;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    forgotPassword.mutate(email);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#987012] to-[#D4B85A] flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.merchantAuth.forgotPasswordTitle}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {t.merchantAuth.forgotPasswordSubtitle}
          </p>
        </div>

        {/* Success message */}
        {forgotPassword.isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm text-center"
          >
            {t.merchantAuth.resetLinkSent}
          </motion.div>
        )}

        {/* Error message */}
        {forgotPassword.isError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center"
          >
            {(forgotPassword.error as { response?: { data?: { message?: string } } })?.response?.data?.message || t.merchantAuth.forgotPasswordTitle}
          </motion.div>
        )}

        {/* Form fields - hidden on success */}
        {!forgotPassword.isSuccess && (
          <>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t.merchantAuth.email}
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#987012] focus:border-transparent outline-none transition-all`}
                  dir="ltr"
                  autoComplete="off"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={forgotPassword.isPending}
              className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-[#987012] to-[#D4B85A] hover:from-[#B8860B] hover:to-[#E8C860] text-white font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {forgotPassword.isPending ? t.merchantAuth.sendingResetLink : t.merchantAuth.sendResetLink}
            </motion.button>
          </>
        )}
      </div>

      {/* Back link */}
      <div className="text-center mt-6">
        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#987012] dark:hover:text-[#D4B85A] transition-colors font-medium text-sm"
        >
          <svg className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t.merchantAuth.backToLogin}
        </Link>
      </div>
    </motion.form>
  );
}
