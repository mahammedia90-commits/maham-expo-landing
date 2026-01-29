'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { UserIcon, BuildingIcon, ArrowRightIcon } from '@/shared/components/Icons';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  viewportSettings,
} from '@/shared/utils/animations';

export function HowItWorks() {
  const { t, isRtl } = useLanguageStore();

  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={fadeInUp}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3 md:mb-4">
            {t.about.howItWorksTitle}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            {t.about.howItWorksDesc}
          </p>
        </motion.div>

        {/* For Dealers */}
        <div className="mb-10 md:mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-lg sm:text-xl md:text-2xl font-bold text-[#1e5f74] text-center mb-6 md:mb-10 flex items-center justify-center gap-2 md:gap-3"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-[#B8973A] rounded-full flex items-center justify-center text-white"
            >
              <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </motion.span>
            {t.about.forDealers}
          </motion.h3>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          >
            {t.about.dealerSteps.map((item, index) => (
              <motion.div key={index} variants={staggerItem} className="relative">
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-xl md:rounded-2xl shadow-md text-center h-full"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, delay: index * 0.15 }}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 gradient-sand rounded-full flex items-center justify-center text-white text-sm sm:text-base md:text-xl font-bold mx-auto mb-2 sm:mb-3 md:mb-4"
                  >
                    {item.step}
                  </motion.div>
                  <h4 className="font-bold text-gray-800 dark:text-white mb-1 md:mb-2 text-xs sm:text-sm md:text-base">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-[10px] sm:text-xs md:text-sm">
                    {item.description}
                  </p>
                </motion.div>
                {index < t.about.dealerSteps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.3 }}
                    className={`hidden lg:block absolute top-1/2 transform -translate-y-1/2 ${
                      isRtl ? '-left-3' : '-right-3'
                    }`}
                  >
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowRightIcon
                        className={`w-6 h-6 text-[#D4B85A] ${isRtl ? 'rotate-180' : ''}`}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* For Investors */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-lg sm:text-xl md:text-2xl font-bold text-[#1e5f74] text-center mb-6 md:mb-10 flex items-center justify-center gap-2 md:gap-3"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-[#1e5f74] rounded-full flex items-center justify-center text-white"
            >
              <BuildingIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </motion.span>
            {t.about.forInvestors}
          </motion.h3>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          >
            {t.about.investorSteps.map((item, index) => (
              <motion.div key={index} variants={staggerItem} className="relative">
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-xl md:rounded-2xl shadow-md text-center h-full"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, delay: index * 0.15 }}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 gradient-primary rounded-full flex items-center justify-center text-white text-sm sm:text-base md:text-xl font-bold mx-auto mb-2 sm:mb-3 md:mb-4"
                  >
                    {item.step}
                  </motion.div>
                  <h4 className="font-bold text-gray-800 dark:text-white mb-1 md:mb-2 text-xs sm:text-sm md:text-base">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-[10px] sm:text-xs md:text-sm">
                    {item.description}
                  </p>
                </motion.div>
                {index < t.about.investorSteps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.3 }}
                    className={`hidden lg:block absolute top-1/2 transform -translate-y-1/2 ${
                      isRtl ? '-left-3' : '-right-3'
                    }`}
                  >
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowRightIcon
                        className={`w-6 h-6 text-[#1e5f74]/30 ${isRtl ? 'rotate-180' : ''}`}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
