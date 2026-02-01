'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  viewportSettings,
} from '@/shared/utils/animations';

export function TermsContent() {
  const { t, isRtl } = useLanguageStore();

  return (
    <section className="py-12 md:py-20" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-8 md:mb-12"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3 md:mb-4"
          >
            {t.terms.title}
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300"
          >
            {t.terms.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={staggerContainer}
          className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg dark:shadow-gray-900/30 p-6 sm:p-8 md:p-10 space-y-6 md:space-y-8"
        >
          {t.terms.sections.map((section, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              whileHover={{ x: isRtl ? -5 : 5 }}
              transition={{ duration: 0.2 }}
            >
              <motion.h2
                initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-lg md:text-xl font-bold text-[#987012] mb-3"
              >
                {section.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.1 }}
                className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed"
              >
                {section.content}
              </motion.p>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center pt-6 border-t"
          >
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t.terms.lastUpdated}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
