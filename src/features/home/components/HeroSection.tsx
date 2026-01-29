'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { DownloadIcon } from '@/shared/components/Icons';
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleInBounce,
  staggerContainer,
  staggerItem,
  float,
  pulse,
  viewportSettings,
} from '@/shared/utils/animations';

interface HeroSectionProps {
  stats?: {
    activeEvents: number;
    availableSpaces: number;
    totalUsers: string;
  };
}

export function HeroSection({ stats }: HeroSectionProps) {
  const { t, isRtl } = useLanguageStore();

  const defaultStats = {
    activeEvents: 500,
    availableSpaces: 2000,
    totalUsers: '10K',
  };

  const displayStats = stats || defaultStats;

  return (
    <section className="gradient-hero min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-20 right-10 md:right-20 w-48 md:w-72 h-48 md:h-72 bg-white rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="absolute bottom-20 left-10 md:left-20 w-64 md:w-96 h-64 md:h-96 bg-orange-500 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-16 relative z-10 min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex items-center">
        <div className="w-full flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-12 items-center">
          {/* Hero Image - App Screenshot */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={isRtl ? fadeInLeft : fadeInRight}
            className={`flex justify-center order-1 ${isRtl ? 'md:order-2' : 'md:order-2'}`}
          >
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="w-36 h-[280px] xs:w-40 xs:h-[320px] sm:w-48 sm:h-[380px] md:w-64 md:h-[520px] lg:w-72 lg:h-[580px] bg-white/10 rounded-[1.5rem] xs:rounded-[1.75rem] sm:rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] border-2 md:border-4 border-white/20 backdrop-blur-sm p-1 sm:p-1.5 md:p-2 shadow-2xl"
              >
                <div className="w-full h-full rounded-[1.25rem] xs:rounded-[1.5rem] sm:rounded-[1.75rem] md:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden">
                  <Image
                    src="/app-screenshot.png"
                    alt="Maham Expo App"
                    width={280}
                    height={560}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </motion.div>
              {/* Decorative elements */}
              <motion.div
                variants={pulse}
                animate="animate"
                className={`absolute -top-1.5 xs:-top-2 sm:-top-2.5 md:-top-3 lg:-top-4 ${
                  isRtl
                    ? '-right-1.5 xs:-right-2 sm:-right-2.5 md:-right-3 lg:-right-4'
                    : '-left-1.5 xs:-left-2 sm:-left-2.5 md:-left-3 lg:-left-4'
                } w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-orange-500 rounded-md xs:rounded-lg sm:rounded-xl md:rounded-2xl opacity-80`}
              />
              <motion.div
                variants={float}
                animate="animate"
                className={`absolute -bottom-1.5 xs:-bottom-2 sm:-bottom-2.5 md:-bottom-3 lg:-bottom-4 ${
                  isRtl
                    ? '-left-1.5 xs:-left-2 sm:-left-2.5 md:-left-3 lg:-left-4'
                    : '-right-1.5 xs:-right-2 sm:-right-2.5 md:-right-3 lg:-right-4'
                } w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-white/20 rounded-sm xs:rounded-md sm:rounded-lg md:rounded-xl`}
              />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className={`text-white text-center ${isRtl ? 'md:text-right' : 'md:text-left'} order-2 md:order-1`}
          >
            <motion.h1
              variants={fadeInUp}
              className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-3 md:mb-6"
            >
              {t.home.heroTitle}
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-orange-400"
              >
                {t.home.heroTitleHighlight}
              </motion.span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-200 mb-4 md:mb-8 leading-relaxed px-2 md:px-0"
            >
              {t.home.heroDescription}
            </motion.p>
            <motion.div
              variants={staggerContainer}
              className={`flex flex-col xs:flex-row gap-2 xs:gap-3 md:gap-4 justify-center ${
                isRtl ? 'md:justify-start' : 'md:justify-start'
              } px-4 xs:px-0`}
            >
              <motion.div variants={staggerItem}>
                <Link
                  href="#download"
                  className="btn-primary text-white px-4 xs:px-5 sm:px-6 md:px-8 py-2.5 xs:py-3 md:py-4 rounded-full font-semibold text-sm xs:text-base md:text-lg flex items-center justify-center gap-2"
                >
                  <DownloadIcon className="w-4 h-4 xs:w-5 xs:h-5 md:w-6 md:h-6" />
                  {t.home.downloadNow}
                </Link>
              </motion.div>
              <motion.div variants={staggerItem}>
                <Link
                  href="/about"
                  className="btn-secondary text-white px-4 xs:px-5 sm:px-6 md:px-8 py-2.5 xs:py-3 md:py-4 rounded-full font-semibold text-sm xs:text-base md:text-lg text-center block"
                >
                  {t.home.learnMore}
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportSettings}
              variants={staggerContainer}
              className="grid grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-6 mt-6 md:mt-12 pt-4 md:pt-8 border-t border-white/20 mx-2 md:mx-0"
            >
              <motion.div variants={scaleInBounce}>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                  className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-orange-400"
                >
                  +{displayStats.activeEvents}
                </motion.div>
                <div className="text-gray-300 text-[10px] xs:text-xs md:text-sm">
                  {t.home.activeEvents}
                </div>
              </motion.div>
              <motion.div variants={scaleInBounce}>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.4 }}
                  className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-orange-400"
                >
                  +{displayStats.availableSpaces}
                </motion.div>
                <div className="text-gray-300 text-[10px] xs:text-xs md:text-sm">
                  {t.home.availableSpaces}
                </div>
              </motion.div>
              <motion.div variants={scaleInBounce}>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.6 }}
                  className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-orange-400"
                >
                  +{displayStats.totalUsers}
                </motion.div>
                <div className="text-gray-300 text-[10px] xs:text-xs md:text-sm">
                  {t.home.users}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
