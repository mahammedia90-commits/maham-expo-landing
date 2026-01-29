'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  viewportSettings,
} from '@/shared/utils/animations';

export function PrivacyContent() {
  const { t, isRtl } = useLanguageStore();

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-8 md:mb-12"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4"
          >
            {t.privacy.title}
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-sm sm:text-base md:text-lg text-gray-600"
          >
            {t.privacy.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={staggerContainer}
          className={`bg-white rounded-xl md:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 space-y-6 md:space-y-8 ${
            isRtl ? '' : 'ltr'
          }`}
        >
          {/* Data We Collect */}
          <motion.div variants={staggerItem}>
            <motion.h2
              initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-lg md:text-xl font-bold text-[#1e5f74] mb-3"
            >
              {t.privacy.dataWeCollect}
            </motion.h2>
            <p className="text-gray-600 text-sm md:text-base mb-3">{t.privacy.dataWeCollectDesc}</p>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`text-gray-600 text-sm md:text-base list-disc ${
                isRtl ? 'pr-6' : 'pl-6'
              } space-y-1`}
            >
              {t.privacy.dataWeCollectItems.map((item, index) => (
                <motion.li key={index} variants={staggerItem}>{item}</motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* How We Use Data */}
          <motion.div variants={staggerItem}>
            <motion.h2
              initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-lg md:text-xl font-bold text-[#1e5f74] mb-3"
            >
              {t.privacy.howWeUseData}
            </motion.h2>
            <p className="text-gray-600 text-sm md:text-base mb-3">{t.privacy.howWeUseDataDesc}</p>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`text-gray-600 text-sm md:text-base list-disc ${
                isRtl ? 'pr-6' : 'pl-6'
              } space-y-1`}
            >
              {t.privacy.howWeUseDataItems.map((item, index) => (
                <motion.li key={index} variants={staggerItem}>{item}</motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Data Sharing */}
          <motion.div variants={staggerItem}>
            <motion.h2
              initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-lg md:text-xl font-bold text-[#1e5f74] mb-3"
            >
              {t.privacy.dataSharing}
            </motion.h2>
            <p className="text-gray-600 text-sm md:text-base mb-3">{t.privacy.dataSharingDesc}</p>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`text-gray-600 text-sm md:text-base list-disc ${
                isRtl ? 'pr-6' : 'pl-6'
              } space-y-1`}
            >
              {t.privacy.dataSharingItems.map((item, index) => (
                <motion.li key={index} variants={staggerItem}>{item}</motion.li>
              ))}
            </motion.ul>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 text-sm md:text-base mt-3 font-medium"
            >
              {t.privacy.noSellData}
            </motion.p>
          </motion.div>

          {/* Your Rights */}
          <motion.div variants={staggerItem}>
            <motion.h2
              initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-lg md:text-xl font-bold text-[#1e5f74] mb-3"
            >
              {t.privacy.yourRights}
            </motion.h2>
            <p className="text-gray-600 text-sm md:text-base mb-3">{t.privacy.yourRightsDesc}</p>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`text-gray-600 text-sm md:text-base list-disc ${
                isRtl ? 'pr-6' : 'pl-6'
              } space-y-1`}
            >
              {t.privacy.yourRightsItems.map((item, index) => (
                <motion.li key={index} variants={staggerItem}>{item}</motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Data Security */}
          <motion.div variants={staggerItem}>
            <motion.h2
              initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-lg md:text-xl font-bold text-[#1e5f74] mb-3"
            >
              {t.privacy.dataSecurity}
            </motion.h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {t.privacy.dataSecurityDesc}
            </p>
          </motion.div>

          {/* Cookies */}
          <motion.div variants={staggerItem}>
            <motion.h2
              initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-lg md:text-xl font-bold text-[#1e5f74] mb-3"
            >
              {t.privacy.cookies}
            </motion.h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {t.privacy.cookiesDesc}
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div variants={staggerItem}>
            <motion.h2
              initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-lg md:text-xl font-bold text-[#1e5f74] mb-3"
            >
              {t.privacy.contactUs}
            </motion.h2>
            <p className="text-gray-600 text-sm md:text-base mb-4">{t.privacy.contactUsDesc}</p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.01 }}
              className="bg-gray-50 p-4 rounded-xl space-y-2"
            >
              <p className="text-gray-700 text-sm md:text-base">
                <strong>{t.contact.emailLabel}</strong> info@maham.com.sa
              </p>
              <p className="text-gray-700 text-sm md:text-base">
                <strong>{t.contact.phoneLabel}</strong> <span dir="ltr">+966 53 555 5900</span>
              </p>
              <p className="text-gray-700 text-sm md:text-base">
                <strong>{t.contact.addressLabel}</strong> {t.footer.saudiArabia}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center pt-6 border-t"
          >
            <p className="text-gray-500 text-sm">{t.privacy.lastUpdated}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
