'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { AppleIcon, GooglePlayIcon } from '@/shared/components/Icons';
import { InvestorRegistrationModal } from './InvestorRegistrationModal';
import {
  fadeInUp,
  scaleIn,
  staggerContainer,
  staggerItem,
  viewportSettings,
} from '@/shared/utils/animations';

export function DownloadSection() {
  const { t, isRtl } = useLanguageStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="download" className="py-12 md:py-20 gradient-hero" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={fadeInUp}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6 px-4"
        >
          {t.home.downloadTitle}
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={fadeInUp}
          className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-6 md:mb-10 max-w-2xl mx-auto px-4"
        >
          {t.home.downloadDesc}
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={staggerContainer}
          className="flex flex-col xs:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-12 px-4"
        >
          {/* App Store Button */}
          <motion.a
            href="#"
            variants={staggerItem}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-black text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl flex items-center justify-center gap-2 md:gap-3 hover:bg-gray-900 transition-colors"
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
            >
              <AppleIcon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" />
            </motion.div>
            <div className={isRtl ? 'text-right' : 'text-left'}>
              <div className="text-[10px] sm:text-xs opacity-80">{t.home.downloadFrom}</div>
              <div className="text-sm sm:text-base md:text-lg font-semibold" dir="ltr">App Store</div>
            </div>
          </motion.a>

          {/* Google Play Button */}
          <motion.a
            href="#"
            variants={staggerItem}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-black text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl flex items-center justify-center gap-2 md:gap-3 hover:bg-gray-900 transition-colors"
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
            >
              <GooglePlayIcon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" />
            </motion.div>
            <div className={isRtl ? 'text-right' : 'text-left'}>
              <div className="text-[10px] sm:text-xs opacity-80">{t.home.getItOn}</div>
              <div className="text-sm sm:text-base md:text-lg font-semibold" dir="ltr">Google Play</div>
            </div>
          </motion.a>
        </motion.div>

        {/* Registration CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={scaleIn}
          whileHover={{ scale: 1.02 }}
          className="glass rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 max-w-xl mx-auto"
        >
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl font-bold text-[#3F341C] dark:text-white mb-2 md:mb-4"
          >
            {t.home.areYouInvestor}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-[#5A4D2E] dark:text-white mb-4 md:mb-6 text-sm md:text-base"
          >
            {t.home.investorCTA}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: 'spring' }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="inline-block btn-primary text-white px-5 sm:px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold text-sm md:text-base cursor-pointer"
            >
              {t.home.registerAsInvestor}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Investor Registration Modal */}
      <InvestorRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
