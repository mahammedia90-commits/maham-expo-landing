'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import {
  SearchIcon,
  MapIcon,
  ClipboardIcon,
  ShieldIcon,
  ChartIcon,
  BellIcon,
} from '@/shared/components/Icons';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  viewportSettings,
} from '@/shared/utils/animations';

const featureIcons = [
  SearchIcon,
  MapIcon,
  ClipboardIcon,
  ShieldIcon,
  ChartIcon,
  BellIcon,
];

export function FeaturesSection() {
  const { t } = useLanguageStore();

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={fadeInUp}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3 md:mb-4">
            {t.about.featuresTitle}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            {t.about.featuresDesc}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8"
        >
          {t.about.features.map((feature, index) => {
            const IconComponent = featureIcons[index];
            return (
              <motion.div
                key={index}
                variants={staggerItem}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-lg dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-[#987012]/10 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center text-[#987012] mb-3 md:mb-4 lg:mb-6"
                >
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                </motion.div>
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2 md:mb-3">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
