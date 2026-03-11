'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useUnifiedLogin } from '@/features/auth/hooks/useUnifiedLogin';
import { ROUTES } from '@/shared/constants';

type LoginMethod = 'email' | 'phone';

export default function LoginPage() {
  const { t, isRtl } = useLanguageStore();
  const login = useUnifiedLogin();
  const [method, setMethod] = useState<LoginMethod>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!identifier.trim()) {
      newErrors.identifier = method === 'email'
        ? t.merchantAuth.emailRequired
        : t.merchantAuth.phoneRequired;
    }
    if (!password.trim()) newErrors.password = t.merchantAuth.passwordRequired;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    login.mutate({ email: identifier, password });
  };

  const switchMethod = (newMethod: LoginMethod) => {
    setMethod(newMethod);
    setIdentifier('');
    setErrors({});
  };

  return (
    <section
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-20 pb-12 px-4"
    >
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#987012] to-[#D4B85A] flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t.login.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {t.merchantAuth.loginSubtitle}
            </p>
          </div>

          {/* Error message */}
          {login.isError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center"
            >
              {(login.error as { response?: { data?: { message?: string } } })?.response?.data?.message || t.merchantAuth.invalidCredentials}
            </motion.div>
          )}

          {/* Login method tabs */}
          <div className="flex rounded-xl bg-gray-100 dark:bg-gray-700/50 p-1 mb-5">
            <button
              type="button"
              onClick={() => switchMethod('email')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                method === 'email'
                  ? 'bg-white dark:bg-gray-600 text-[#987012] dark:text-[#D4B85A] shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t.merchantAuth.loginWithEmail}
            </button>
            <button
              type="button"
              onClick={() => switchMethod('phone')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                method === 'phone'
                  ? 'bg-white dark:bg-gray-600 text-[#987012] dark:text-[#D4B85A] shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t.merchantAuth.loginWithPhone}
            </button>
          </div>

          {/* Form fields */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {method === 'email' ? t.merchantAuth.email : t.merchantAuth.phone}
              </label>
              <input
                type={method === 'email' ? 'text' : 'tel'}
                value={identifier}
                onChange={(e) => { setIdentifier(e.target.value); setErrors(prev => ({ ...prev, identifier: undefined })); }}
                placeholder={method === 'email' ? 'email@example.com' : '+966 5x xxx xxxx'}
                className={`w-full px-4 py-3 rounded-xl border ${errors.identifier ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#987012] focus:border-transparent outline-none transition-all`}
                dir="ltr"
                autoComplete="off"
              />
              {errors.identifier && <p className="text-red-500 text-xs mt-1">{errors.identifier}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t.merchantAuth.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })); }}
                className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#987012] focus:border-transparent outline-none transition-all`}
                dir="ltr"
                autoComplete="new-password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end mt-3">
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="text-sm text-[#987012] dark:text-[#D4B85A] hover:underline font-medium"
            >
              {t.merchantAuth.forgotPassword}
            </Link>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={login.isPending}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[#987012] to-[#D4B85A] hover:from-[#B8860B] hover:to-[#E8C860] text-white font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {login.isPending ? t.merchantAuth.loggingIn : t.merchantAuth.login}
          </motion.button>

          {/* Register link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">{t.merchantAuth.noAccount} </span>
            <Link href={ROUTES.REGISTER} className="text-[#987012] dark:text-[#D4B85A] font-medium hover:underline">
              {t.merchantAuth.createAccount}
            </Link>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#987012] dark:hover:text-[#D4B85A] transition-colors font-medium text-sm"
          >
            <svg className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t.common.back}
          </Link>
        </div>
      </motion.form>
    </section>
  );
}
