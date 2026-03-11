'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { authService } from '../services/authService';

interface EmailVerificationFormProps {
  onVerified?: () => void;
}

export function EmailVerificationForm({ onVerified }: EmailVerificationFormProps) {
  const { t, isRtl } = useLanguageStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const sendCode = useMutation({
    mutationFn: () => authService.sendVerificationEmail(),
    onSuccess: () => {
      setSuccessMessage(t.merchantAuth.codeSent);
      setError('');
      setStep(2);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      setError(err.response?.data?.message || '');
      setSuccessMessage('');
    },
  });

  const verifyCode = useMutation({
    mutationFn: (verificationCode: string) => authService.verifyEmail(verificationCode),
    onSuccess: () => {
      setSuccessMessage(t.merchantAuth.codeVerified);
      setError('');
      onVerified?.();
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      setError(err.response?.data?.message || '');
      setSuccessMessage('');
    },
  });

  const handleVerify = () => {
    setError('');
    if (!code.trim()) {
      setError(t.merchantAuth.codeRequired);
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setError(t.merchantAuth.codeRequired);
      return;
    }
    verifyCode.mutate(code);
  };

  const handleResend = () => {
    setError('');
    setSuccessMessage('');
    sendCode.mutate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#987012] to-[#D4B85A] flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.merchantAuth.verifyEmailTitle}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {t.merchantAuth.verifyEmailSubtitle}
          </p>
        </div>

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

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {step === 1 && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            disabled={sendCode.isPending}
            onClick={() => sendCode.mutate()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#987012] to-[#D4B85A] hover:from-[#B8860B] hover:to-[#E8C860] text-white font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {sendCode.isPending ? t.merchantAuth.sendingCode : t.merchantAuth.sendVerificationCode}
          </motion.button>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t.merchantAuth.verificationCode}
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(val);
                  setError('');
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#987012] focus:border-transparent outline-none transition-all text-center text-2xl tracking-[0.5em] font-mono"
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
                dir="ltr"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="button"
              disabled={verifyCode.isPending}
              onClick={handleVerify}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#987012] to-[#D4B85A] hover:from-[#B8860B] hover:to-[#E8C860] text-white font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {verifyCode.isPending ? t.merchantAuth.verifyingCode : t.merchantAuth.verifyCode}
            </motion.button>

            <button
              type="button"
              disabled={sendCode.isPending}
              onClick={handleResend}
              className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-[#987012] dark:hover:text-[#D4B85A] transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sendCode.isPending ? t.merchantAuth.sendingCode : t.merchantAuth.resendCode}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
