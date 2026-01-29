'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { CheckIcon, WarningIcon, CheckCircleIcon } from '@/shared/components/Icons';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  cardHover,
  viewportSettings,
} from '@/shared/utils/animations';

export function ProblemSolution() {
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
            {t.home.problemSolutionTitle}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            {t.home.problemSolutionDesc}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-12">
          {/* Problem */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={isRtl ? { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } } : { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
            whileHover="hover"
            className={`bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl shadow-lg dark:shadow-gray-900/30 ${
              isRtl ? 'border-r-4' : 'border-l-4'
            } border-red-500`}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-red-100 dark:bg-red-900/30 rounded-lg md:rounded-xl flex items-center justify-center">
                <WarningIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                {t.home.problem}
              </h3>
            </motion.div>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-2 sm:space-y-3 md:space-y-4"
            >
              {t.home.problemItems.map((item, index) => (
                <motion.li
                  key={index}
                  variants={staggerItem}
                  className="flex items-start gap-2 sm:gap-3"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"
                  />
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={isRtl ? { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } } } : { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } } }}
            whileHover="hover"
            className={`bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl shadow-lg dark:shadow-gray-900/30 ${
              isRtl ? 'border-r-4' : 'border-l-4'
            } border-green-500`}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
              className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-green-100 dark:bg-green-900/30 rounded-lg md:rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                {t.home.solution}
              </h3>
            </motion.div>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-2 sm:space-y-3 md:space-y-4"
            >
              {t.home.solutionItems.map((item, index) => (
                <motion.li
                  key={index}
                  variants={staggerItem}
                  className="flex items-start gap-2 sm:gap-3"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', delay: index * 0.1 }}
                    className="flex-shrink-0"
                  >
                    <CheckIcon />
                  </motion.span>
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
