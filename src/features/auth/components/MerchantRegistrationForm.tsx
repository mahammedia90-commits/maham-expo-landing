'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useRegister } from '../hooks/useAuth';
import { ROUTES } from '@/shared/constants';

export function MerchantRegistrationForm() {
  const { t, isRtl } = useLanguageStore();
  const register = useRegister();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    commercialRegister: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = t.merchantAuth.nameRequired;
    if (!form.email.trim()) newErrors.email = t.merchantAuth.emailRequired;
    if (!form.phone.trim()) newErrors.phone = t.merchantAuth.phoneRequired;
    if (!form.password.trim()) newErrors.password = t.merchantAuth.passwordRequired;
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = t.merchantAuth.passwordMismatch;
    if (!form.businessName.trim()) newErrors.businessName = t.merchantAuth.businessNameRequired;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    register.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      businessName: form.businessName,
      commercialRegister: form.commercialRegister,
    });
  };

  const fields: { key: string; label: string; type: string; dir: string; placeholder?: string }[] = [
    { key: 'name', label: t.merchantAuth.name, type: 'text', dir: isRtl ? 'rtl' : 'ltr' },
    { key: 'email', label: t.merchantAuth.email, type: 'email', dir: 'ltr', placeholder: 'email@example.com' },
    { key: 'phone', label: t.merchantAuth.phone, type: 'tel', dir: 'ltr', placeholder: '+966 5x xxx xxxx' },
    { key: 'businessName', label: t.merchantAuth.businessName, type: 'text', dir: isRtl ? 'rtl' : 'ltr' },
    { key: 'commercialRegister', label: t.merchantAuth.commercialRegister, type: 'text', dir: 'ltr' },
    { key: 'password', label: t.merchantAuth.password, type: 'password', dir: 'ltr', placeholder: '••••••••' },
    { key: 'confirmPassword', label: t.merchantAuth.confirmPassword, type: 'password', dir: 'ltr', placeholder: '••••••••' },
  ];

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#987012] to-[#D4B85A] flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.merchantAuth.registerTitle}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {t.merchantAuth.registerSubtitle}
          </p>
        </div>

        {/* Error message */}
        {register.isError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center"
          >
            {t.common.error}
          </motion.div>
        )}

        {/* Form fields */}
        <div className="space-y-4">
          {fields.map(({ key, label, type, dir, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {label}
              </label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={(e) => updateField(key, e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${errors[key] ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#987012] focus:border-transparent outline-none transition-all`}
                placeholder={placeholder}
                dir={dir}
              />
              {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
            </div>
          ))}
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={register.isPending}
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-[#987012] to-[#D4B85A] hover:from-[#B8860B] hover:to-[#E8C860] text-white font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {register.isPending ? t.merchantAuth.registering : t.merchantAuth.register}
        </motion.button>

        {/* Links */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">{t.merchantAuth.hasAccount} </span>
          <Link href={ROUTES.MERCHANT_LOGIN} className="text-[#987012] dark:text-[#D4B85A] font-medium hover:underline">
            {t.merchantAuth.loginHere}
          </Link>
        </div>
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
          {t.common.back}
        </Link>
      </div>
    </motion.form>
  );
}
