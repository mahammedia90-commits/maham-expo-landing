'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { ChevronDownIcon } from '@/shared/components/Icons';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  viewportSettings,
} from '@/shared/utils/animations';

interface FAQItemProps {
  question: string;
  answer: string;
  isRtl: boolean;
  index: number;
}

function FAQItem({ question, answer, isRtl, index }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      variants={staggerItem}
      className="faq-item py-3 md:py-4"
    >
      <motion.button
        className={`flex justify-between items-center w-full gap-3 ${
          isRtl ? 'text-right' : 'text-left'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ x: isRtl ? -5 : 5 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-white">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDownIcon />
        </motion.span>
      </motion.button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <motion.p
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-gray-600 dark:text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base mt-2 md:mt-3"
            >
              {answer}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection() {
  const { t, isRtl } = useLanguageStore();

  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={fadeInUp}
          className="text-center mb-6 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3 md:mb-4">
            {t.about.faqTitle}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">{t.about.faqDesc}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={staggerContainer}
          className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg dark:shadow-gray-900/30 p-4 sm:p-6 md:p-8"
        >
          {t.about.faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isRtl={isRtl}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
