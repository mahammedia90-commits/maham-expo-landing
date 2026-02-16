'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  viewportSettings,
} from '@/shared/utils/animations';

export function AlaKhutahSection() {
  const { t, isRtl } = useLanguageStore();
  const s = t.home.alaKhutahSection;

  return (
    <section
      className="py-16 md:py-24 bg-gradient-to-b from-[#FFFDF9] to-[#FBF8F0] dark:from-[#1A1610] dark:to-[#1F1A12] relative overflow-hidden"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute top-10 right-20 w-72 h-72 bg-[#E6B830]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-20 w-60 h-60 bg-[#987012]/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          {/* Badge */}
          <motion.span
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#987012]/10 to-[#E6B830]/10 text-[#987012] dark:text-[#E6B830] rounded-full text-sm font-bold mb-6 border border-[#987012]/20"
          >
            <span className="text-lg">🕌</span>
            {s.badge}
          </motion.span>

          {/* Heading */}
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2A2313] dark:text-white mb-6"
          >
            {s.title}{' '}
            <span className="bg-gradient-to-r from-[#E6B830] to-[#987012] bg-clip-text text-transparent">
              {s.titleHighlight}
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            {s.description}
          </motion.p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12"
        >
          <motion.div
            variants={staggerItem}
            className="bg-white/80 dark:bg-[#2A2313]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#987012]/10 shadow-lg"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E6B830] to-[#987012] flex items-center justify-center mb-4 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#2A2313] dark:text-white mb-2">
              {s.zonesTitle}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {s.zonesDesc}
            </p>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="bg-white/80 dark:bg-[#2A2313]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#987012]/10 shadow-lg"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E6B830] to-[#987012] flex items-center justify-center mb-4 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#2A2313] dark:text-white mb-2">
              {s.investTitle}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {s.investDesc}
            </p>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <Link
            href="/ala-khutah"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#2A2313] to-[#3F341C] dark:from-[#E6B830] dark:to-[#D4A628] text-white dark:text-[#1A1A1A] font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-[#987012]/20 transition-all duration-300 hover:scale-105"
          >
            <span>{s.cta}</span>
            <svg
              className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
