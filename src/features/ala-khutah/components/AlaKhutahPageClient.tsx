'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { alaKhutahData, getTotalBoothCount } from '@/data/alaKhutahData';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  springPresets,
} from '@/shared/utils/animations';

export function AlaKhutahPageClient() {
  const { language, isRtl } = useLanguageStore();
  const lang = language as 'ar' | 'en';
  const totalBooths = getTotalBoothCount();

  return (
    <section
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-[#FFFDF9] via-[#FBF8F0] to-[#F5ECD4] dark:from-[#1A1610] dark:via-[#1F1A12] dark:to-[#2A2313] relative overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#E6B830]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#987012]/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E6B830]/3 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#987012] dark:text-[#E6B830] hover:text-[#E6B830] dark:hover:text-white transition-colors duration-300 font-medium"
          >
            <svg
              className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </Link>
        </motion.div>

        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-12 md:mb-16"
        >
          {/* Event Badge */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#987012]/10 to-[#E6B830]/10 text-[#987012] dark:text-[#E6B830] rounded-full text-sm font-bold mb-6 border border-[#987012]/20"
          >
            <span className="text-lg">🕌</span>
            {lang === 'ar' ? 'فعالية على خطاه' : 'Ala Khutah Event'}
          </motion.span>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#2A2313] dark:text-white mb-6"
          >
            {alaKhutahData.title[lang]}{' '}
            <span className="bg-gradient-to-r from-[#E6B830] to-[#987012] bg-clip-text text-transparent">
              {lang === 'ar' ? 'المناطق' : 'Zones'}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-8"
          >
            {alaKhutahData.description[lang]}
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 md:gap-10"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#E6B830]">
                {alaKhutahData.zones.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {lang === 'ar' ? 'مناطق' : 'Zones'}
              </div>
            </div>
            <div className="w-px h-12 bg-[#987012]/20 hidden md:block" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#E6B830]">{totalBooths}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {lang === 'ar' ? 'مساحة متاحة' : 'Available Spaces'}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Overview Video */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-[#987012]/10 border border-[#987012]/20">
            <video
              className="w-full aspect-video object-cover"
              controls
              playsInline
              preload="metadata"
            >
              <source src="/على خطاه/شامل.mp4" type="video/mp4" />
              {lang === 'ar' ? 'متصفحك لا يدعم تشغيل الفيديو.' : 'Your browser does not support the video tag.'}
            </video>
          </div>
        </motion.div>

        {/* Zones Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {alaKhutahData.zones.map((zone, index) => (
            <motion.div key={zone.id} variants={staggerItem} custom={index}>
              <Link href={`/ala-khutah/${zone.slug}`}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springPresets.snappy}
                  className="group relative bg-gradient-to-br from-white/80 to-white/40 dark:from-[#2A2313]/90 dark:to-[#1A1610]/90 backdrop-blur-xl border border-white/20 dark:border-[#987012]/20 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#E6B830]/10 transition-all duration-500"
                >
                  {/* Zone Preview Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={zone.booths[0]?.image || '/ala-khutah.png'}
                        alt={`${zone.name[lang]} - ${lang === 'ar' ? 'منطقة في فعالية على خطاه' : 'Zone in Ala Khutah event'}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </motion.div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Zone Icon */}
                    <div className="absolute top-4 right-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#E6B830]/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <svg
                          className="w-6 h-6 text-[#1A1A1A]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Booth Count Badge */}
                    <div className="absolute bottom-4 left-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-[#2A2313]/90 backdrop-blur-sm text-[#987012] dark:text-[#E6B830] rounded-full text-sm font-bold shadow-lg">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        {zone.booths.length} {lang === 'ar' ? 'مساحة' : 'spaces'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl font-bold text-[#2A2313] dark:text-white mb-2 group-hover:text-[#987012] dark:group-hover:text-[#E6B830] transition-colors duration-300">
                      {zone.name[lang]}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {lang === 'ar'
                        ? `${zone.booths.length} مساحة متاحة للحجز`
                        : `${zone.booths.length} spaces available for booking`}
                    </p>

                    {/* View Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-[#987012] dark:text-[#E6B830] font-semibold text-sm group-hover:underline">
                        {lang === 'ar' ? 'عرض المساحات' : 'View Spaces'}
                      </span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className={`${isRtl ? 'rotate-180' : ''}`}
                      >
                        <svg
                          className="w-5 h-5 text-[#987012] dark:text-[#E6B830]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Download Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <a
            href="/Alla Khotah.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#2A2313] to-[#3F341C] dark:from-[#E6B830] dark:to-[#D4A628] text-white dark:text-[#1A1A1A] font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-[#987012]/20 transition-all duration-300 hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>{lang === 'ar' ? 'تحميل الملف التعريفي' : 'Download Profile PDF'}</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
