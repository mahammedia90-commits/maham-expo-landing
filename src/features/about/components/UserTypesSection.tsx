'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { UserIcon, BuildingIcon, CogIcon, CheckIcon } from '@/shared/components/Icons';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  viewportSettings,
} from '@/shared/utils/animations';

const userTypeIcons = [UserIcon, BuildingIcon, CogIcon];
const userTypeColors = ['bg-orange-500', 'bg-[#1e5f74]', 'bg-green-600'];

export function UserTypesSection() {
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
            {t.about.userTypesTitle}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            {t.about.userTypesDesc}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
        >
          {t.about.userTypes.map((user, index) => {
            const IconComponent = userTypeIcons[index];
            return (
              <motion.div
                key={index}
                variants={staggerItem}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`${userTypeColors[index]} p-4 md:p-6 text-white text-center`}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, delay: index * 0.15 + 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4"
                  >
                    <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{user.title}</h3>
                  <p className="text-white/80 text-xs sm:text-sm">{user.subtitle}</p>
                </motion.div>
                <div className="p-3 sm:p-4 md:p-6">
                  <p className="text-gray-600 mb-3 md:mb-6 text-center text-xs sm:text-sm md:text-base">
                    {user.description}
                  </p>
                  <motion.ul
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="space-y-2 md:space-y-3"
                  >
                    {user.benefits.map((benefit, i) => (
                      <motion.li
                        key={i}
                        variants={staggerItem}
                        className="flex items-center gap-2 md:gap-3"
                      >
                        <motion.span
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ type: 'spring', delay: i * 0.1 }}
                          className="flex-shrink-0"
                        >
                          <CheckIcon />
                        </motion.span>
                        <span className="text-gray-700 text-xs sm:text-sm md:text-base">
                          {benefit}
                        </span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
