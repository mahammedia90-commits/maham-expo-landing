'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useContactForm } from '../hooks/useContact';
import {
  MailIcon,
  PhoneIcon,
  LocationIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
} from '@/shared/components/Icons';
import {
  fadeInUp,
  scaleIn,
  staggerContainer,
  staggerItem,
  viewportSettings,
} from '@/shared/utils/animations';

export function ContactForm() {
  const { t, isRtl } = useLanguageStore();
  const contactMutation = useContactForm();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await contactMutation.mutateAsync(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact form submission failed:', error);
    }
  };

  const contactInfo = [
    {
      icon: MailIcon,
      label: t.contact.emailLabel,
      value: 'info@maham.com.sa',
      href: 'mailto:info@maham.com.sa',
    },
    {
      icon: PhoneIcon,
      label: t.contact.phoneLabel,
      value: '+966 53 555 5900',
      href: 'tel:+966535555900',
    },
    {
      icon: LocationIcon,
      label: t.contact.addressLabel,
      value: t.contact.address,
      href: '#',
    },
  ];

  const socialLinks = [
    { href: '#', icon: TwitterIcon, label: 'Twitter' },
    { href: '#', icon: InstagramIcon, label: 'Instagram' },
    { href: '#', icon: LinkedInIcon, label: 'LinkedIn' },
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={isRtl ? { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } } : { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
            className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg dark:shadow-gray-900/30 p-6 md:p-8"
          >
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-6"
            >
              {t.contact.formTitle}
            </motion.h2>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <motion.svg
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="w-8 h-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-green-600 font-medium text-lg"
                  >
                    {t.contact.successMessage}
                  </motion.p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  onSubmit={handleSubmit}
                  className="space-y-4 md:space-y-6"
                >
                  <motion.div variants={staggerItem}>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      {t.contact.name} *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#1e5f74] focus:border-transparent outline-none transition ${
                        isRtl ? 'text-right' : 'text-left'
                      }`}
                    />
                  </motion.div>

                  <motion.div variants={staggerItem} className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                      >
                        {t.contact.email} *
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#1e5f74] focus:border-transparent outline-none transition ${
                          isRtl ? 'text-right' : 'text-left'
                        }`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                      >
                        {t.contact.phone}
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#1e5f74] focus:border-transparent outline-none transition ${
                          isRtl ? 'text-right' : 'text-left'
                        }`}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      {t.contact.subject} *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#1e5f74] focus:border-transparent outline-none transition ${
                        isRtl ? 'text-right' : 'text-left'
                      }`}
                    />
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      {t.contact.message} *
                    </label>
                    <motion.textarea
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#1e5f74] focus:border-transparent outline-none transition resize-none ${
                        isRtl ? 'text-right' : 'text-left'
                      }`}
                    />
                  </motion.div>

                  <motion.button
                    variants={staggerItem}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full btn-primary text-white py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {contactMutation.isPending ? (
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        {t.contact.sending}
                      </motion.span>
                    ) : (
                      t.contact.send
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {contactMutation.isError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-sm text-center"
                      >
                        {t.contact.errorMessage}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={isRtl ? { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } } } : { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } } }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-6"
            >
              {t.contact.contactInfo}
            </motion.h2>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6 mb-8"
            >
              {contactInfo.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  variants={staggerItem}
                  whileHover={{ scale: 1.02, x: isRtl ? -5 : 5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', delay: index * 0.1 }}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    className="w-12 h-12 bg-[#1e5f74]/10 rounded-lg flex items-center justify-center text-[#1e5f74] flex-shrink-0"
                  >
                    <item.icon className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                    <p className="text-gray-800 dark:text-white font-medium">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{t.contact.followUs}</h3>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex gap-3"
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    variants={staggerItem}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 bg-[#1e5f74] rounded-lg flex items-center justify-center text-white hover:bg-[#133b5c] transition"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
