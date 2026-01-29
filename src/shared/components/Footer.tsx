'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguageStore } from '../store/useLanguageStore';
import { TwitterIcon, InstagramIcon, LinkedInIcon } from './Icons';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  viewportSettings,
} from '../utils/animations';

export function Footer() {
  const { t } = useLanguageStore();

  const quickLinks = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contacts },
    { href: '/terms', label: t.nav.terms },
    { href: '/privacy', label: t.nav.privacy },
  ];

  const socialLinks = [
    { href: '#', icon: TwitterIcon, label: 'Twitter' },
    { href: '#', icon: InstagramIcon, label: 'Instagram' },
    { href: '#', icon: LinkedInIcon, label: 'LinkedIn' },
  ];

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={staggerContainer}
      className="bg-gray-900 text-white py-8 md:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Logo & Description */}
          <motion.div variants={staggerItem} className="col-span-2 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="mb-3 md:mb-4 bg-white p-2 md:p-3 rounded-lg md:rounded-xl inline-block"
            >
              <Image
                src="/logo.png"
                alt="Maham Expo"
                width={200}
                height={80}
                className="h-10 md:h-14 w-auto object-contain"
                unoptimized
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 leading-relaxed max-w-md text-xs sm:text-sm md:text-base"
            >
              {t.footer.description}
            </motion.p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={staggerItem}>
            <h4 className="font-bold text-sm sm:text-base md:text-lg mb-2 md:mb-4">
              {t.footer.quickLinks}
            </h4>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-1 md:space-y-2"
            >
              {quickLinks.map((link, index) => (
                <motion.li key={link.href} variants={staggerItem}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm md:text-base inline-block"
                  >
                    <motion.span
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                      className="inline-block"
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={staggerItem}>
            <h4 className="font-bold text-sm sm:text-base md:text-lg mb-2 md:mb-4">
              {t.footer.contactUs}
            </h4>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-1 md:space-y-2 text-gray-400 text-xs sm:text-sm md:text-base"
            >
              <motion.li variants={staggerItem}>info@maham.com.sa</motion.li>
              <motion.li variants={staggerItem} dir="ltr" className="text-right">+966 53 555 5900</motion.li>
              <motion.li variants={staggerItem}>{t.footer.saudiArabia}</motion.li>
            </motion.ul>

            {/* Social Links */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex gap-2 md:gap-4 mt-3 md:mt-4"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  variants={staggerItem}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-md md:rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 md:w-5 md:h-5" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="border-t border-gray-800 pt-4 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4"
        >
          <p className="text-gray-400 text-xs md:text-sm">
            {t.footer.allRightsReserved}
          </p>
          <motion.p
            whileHover={{ scale: 1.05 }}
            className="text-gray-400 text-xs md:text-sm"
          >
            <a href="https://maham.com.sa" className="hover:text-white transition-colors">
              maham.com.sa
            </a>
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
