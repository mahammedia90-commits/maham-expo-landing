'use client';

import { motion } from 'framer-motion';
import { ContactForm } from '@/features/contact/components';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { fadeInUp, staggerContainer, viewportSettings } from '@/shared/utils/animations';

export default function ContactPage() {
  const { t } = useLanguageStore();

  return (
    <>
      {/* Page Header */}
      <section className="gradient-hero py-16 md:py-24 overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            {t.contact.title}
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
          >
            {t.contact.subtitle}
          </motion.p>
        </motion.div>
      </section>

      {/* Contact Form */}
      <ContactForm />
    </>
  );
}
