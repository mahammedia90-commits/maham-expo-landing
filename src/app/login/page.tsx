'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguageStore } from '@/shared/store/useLanguageStore';

const loginOptions = [
  {
    key: 'loginToSystem' as const,
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    gradient: 'from-[#987012] to-[#B8860B]',
    hoverGradient: 'hover:from-[#B8860B] hover:to-[#D4A017]',
    href: 'https://onemay.sa:8081/ar/auth/sign-in-1',
    comingSoon: false,
  },
  {
    key: 'loginAsInvestor' as const,
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    gradient: 'from-[#D4B85A] to-[#987012]',
    hoverGradient: 'hover:from-[#E8C860] hover:to-[#B8860B]',
    href: null,
    comingSoon: true,
  },
  {
    key: 'loginAsDealer' as const,
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    gradient: 'from-[#B8860B] to-[#D4B85A]',
    hoverGradient: 'hover:from-[#D4A017] hover:to-[#E8C860]',
    href: null,
    comingSoon: true,
  },
];

export default function LoginPage() {
  const { t, isRtl } = useLanguageStore();

  const handleClick = (option: typeof loginOptions[number]) => {
    if (option.href) {
      window.open(option.href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-20 pb-12 px-4"
    >
      <div className="w-full max-w-4xl">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {loginOptions.map((option, index) => (
            <motion.div
              key={option.key}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * index + 0.3, duration: 0.5, ease: 'easeOut' }}
            >
              <motion.button
                whileHover={option.comingSoon ? {} : { scale: 1.03, y: -4 }}
                whileTap={option.comingSoon ? {} : { scale: 0.98 }}
                onClick={() => handleClick(option)}
                disabled={option.comingSoon}
                className={`w-full group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 shadow-lg transition-all duration-300 p-8 flex flex-col items-center text-center ${
                  option.comingSoon
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:shadow-2xl cursor-pointer'
                }`}
              >
                {/* Gradient top accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${option.gradient}`} />

                {/* Coming Soon Badge */}
                {option.comingSoon && (
                  <div className="absolute top-4 left-4 right-4 flex justify-center">
                    <span className="bg-gradient-to-r from-[#987012] to-[#D4B85A] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                      {t.login.comingSoon}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${option.gradient} ${option.comingSoon ? '' : option.hoverGradient} flex items-center justify-center text-white mb-6 shadow-lg ${option.comingSoon ? '' : 'group-hover:shadow-xl'} transition-all duration-300 ${option.comingSoon ? 'mt-4' : ''}`}>
                  {option.icon}
                </div>

                {/* Label */}
                <h3 className={`text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300 ${
                  option.comingSoon ? '' : 'group-hover:text-[#987012] dark:group-hover:text-[#D4B85A]'
                }`}>
                  {t.login[option.key]}
                </h3>

                {/* Arrow (only for active options) */}
                {!option.comingSoon && (
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
                )}
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
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#987012] dark:hover:text-[#D4B85A] transition-colors font-medium"
          >
            <svg
              className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t.common.back}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
