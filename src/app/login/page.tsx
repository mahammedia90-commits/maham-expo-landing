'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useUnifiedLogin } from '@/features/auth/hooks/useUnifiedLogin';
import { ROUTES } from '@/shared/constants';

type LoginMethod = 'email' | 'phone';
type UserType = 'merchant' | 'investor' | 'sponsor' | null;

const loginOptions = [
  {
    key: 'loginAsDealer' as const,
    type: 'merchant' as const,
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    gradient: 'from-[#B8860B] to-[#D4B85A]',
    hoverGradient: 'hover:from-[#D4A017] hover:to-[#E8C860]',
  },
  {
    key: 'loginAsInvestor' as const,
    type: 'investor' as const,
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    gradient: 'from-[#D4B85A] to-[#987012]',
    hoverGradient: 'hover:from-[#E8C860] hover:to-[#B8860B]',
  },
  {
    key: 'loginAsSponsor' as const,
    type: 'sponsor' as const,
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    gradient: 'from-[#987012] to-[#B8860B]',
    hoverGradient: 'hover:from-[#B8860B] hover:to-[#D4A017]',
  },
];

export default function LoginPage() {
  const { t, isRtl } = useLanguageStore();
  const login = useUnifiedLogin();
  const [selectedType, setSelectedType] = useState<UserType>(null);
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

  const handleBack = () => {
    setSelectedType(null);
    setIdentifier('');
    setPassword('');
    setErrors({});
    login.reset();
  };

  return (
    <section
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-20 pb-12 px-4"
    >
      <div className="w-full max-w-6xl">
        <AnimatePresence mode="wait">
          {!selectedType ? (
            /* ── Card Selection View ── */
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-center mb-12"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  {t.login.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {t.login.subtitle}
                </p>
              </motion.div>

              {/* Login Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
                {loginOptions.map((option, index) => (
                  <motion.div
                    key={option.key}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 * index + 0.3, duration: 0.5, ease: 'easeOut' }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedType(option.type)}
                      className="w-full h-full min-h-[260px] group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center justify-center text-center cursor-pointer"
                    >
                      {/* Gradient top accent */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${option.gradient}`} />

                      {/* Icon */}
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${option.gradient} ${option.hoverGradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        {option.icon}
                      </div>

                      {/* Label */}
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#987012] dark:group-hover:text-[#D4B85A] transition-colors duration-300">
                        {t.login[option.key]}
                      </h3>

                      {/* Arrow */}
                      <div className="mt-6 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center group-hover:bg-[#987012]/10 dark:group-hover:bg-[#D4B85A]/20 transition-all duration-300">
                        <svg
                          className={`w-5 h-5 text-gray-400 group-hover:text-[#987012] dark:group-hover:text-[#D4B85A] transition-all duration-300 ${isRtl ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              {/* Back link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="text-center mt-10"
              >
                <Link
                  href={ROUTES.HOME}
                  className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#987012] dark:hover:text-[#D4B85A] transition-colors font-medium"
                >
                  <svg className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {t.common.back}
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            /* ── Login Form View ── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md mx-auto"
            >
              <form onSubmit={handleSubmit}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#987012] to-[#D4B85A] flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {t.login[loginOptions.find(o => o.type === selectedType)!.key]}
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
              </form>

              {/* Back to cards */}
              <div className="text-center mt-6">
                <button
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#987012] dark:hover:text-[#D4B85A] transition-colors font-medium text-sm"
                >
                  <svg className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {t.common.back}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
