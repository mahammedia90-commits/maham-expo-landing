'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import {
  staggerContainer,
  staggerItem,
  galleryItemVariants,
  galleryHover,
  imageZoom,
  fadeInUp,
  viewportSettings,
  springPresets,
} from '@/shared/utils/animations';

// Event types for filtering
const eventCategories = {
  ar: ['الكل', 'تجاري', 'طعام وشراب', 'تقنية', 'موسمي'],
  en: ['All', 'Commercial', 'Food & Beverage', 'Technology', 'Seasonal'],
};

// Sample events data - would come from API in production
const eventsData = [
  {
    id: 1,
    title: { ar: 'على خطاه', en: 'Ala Khutah' },
    location: { ar: 'المملكة العربية السعودية', en: 'Saudi Arabia' },
    date: { ar: '٢٠٢٥', en: '2025' },
    spaces: { available: 100, total: 100 },
    category: 'موسمي',
    image: '/ala-khutah.png',
    featured: false,
    price: { ar: 'مجاني', en: 'Free' },
    profilePdf: '/Alla Khotah.pdf',
  },
  {
    id: 2,
    title: { ar: 'معرض الرياض الدولي للتجارة', en: 'Riyadh International Trade Fair' },
    location: { ar: 'مركز الرياض للمعارض والمؤتمرات', en: 'Riyadh Exhibitions Center' },
    date: { ar: '٢٦ سبتمبر - ٦ أكتوبر ٢٠٢٥', en: 'Sep 26 - Oct 6, 2025' },
    spaces: { available: 87, total: 150 },
    category: 'تجاري',
    image: '/hero-slide-1.jpg',
    featured: true,
    price: { ar: 'يبدأ من ٥,٠٠٠ ريال', en: 'From 5,000 SAR' },
  },
  {
    id: 3,
    title: { ar: 'مهرجان جدة الغذائي', en: 'Jeddah Food Festival' },
    location: { ar: 'كورنيش جدة', en: 'Jeddah Corniche' },
    date: { ar: '١٥ - ٢٥ أكتوبر ٢٠٢٥', en: 'Oct 15 - 25, 2025' },
    spaces: { available: 45, total: 100 },
    category: 'طعام وشراب',
    image: '/hero-slide-1.jpg',
    featured: false,
    price: { ar: 'يبدأ من ٣,٠٠٠ ريال', en: 'From 3,000 SAR' },
  },
  {
    id: 4,
    title: { ar: 'معرض التقنية والابتكار', en: 'Tech & Innovation Expo' },
    location: { ar: 'مركز الملك عبدالعزيز', en: 'King Abdulaziz Center' },
    date: { ar: '١ - ١٠ نوفمبر ٢٠٢٥', en: 'Nov 1 - Nov 10, 2025' },
    spaces: { available: 120, total: 200 },
    category: 'تقنية',
    image: '/hero-slide-1.jpg',
    featured: true,
    price: { ar: 'يبدأ من ٧,٠٠٠ ريال', en: 'From 7,000 SAR' },
  },
  {
    id: 5,
    title: { ar: 'سوق الدمام الموسمي', en: 'Dammam Seasonal Market' },
    location: { ar: 'الواجهة البحرية - الدمام', en: 'Dammam Waterfront' },
    date: { ar: '١ - ١٥ ديسمبر ٢٠٢٥', en: 'Dec 1 - Dec 15, 2025' },
    spaces: { available: 65, total: 80 },
    category: 'موسمي',
    image: '/hero-slide-1.jpg',
    featured: false,
    price: { ar: 'يبدأ من ٢,٥٠٠ ريال', en: 'From 2,500 SAR' },
  },
  {
    id: 6,
    title: { ar: 'معرض المجوهرات والساعات', en: 'Jewelry & Watches Exhibition' },
    location: { ar: 'فندق الريتز كارلتون - الرياض', en: 'Ritz Carlton Hotel - Riyadh' },
    date: { ar: '٢٠ - ٣٠ نوفمبر ٢٠٢٥', en: 'Nov 20 - 30, 2025' },
    spaces: { available: 30, total: 50 },
    category: 'تجاري',
    image: '/hero-slide-1.jpg',
    featured: true,
    price: { ar: 'يبدأ من ١٥,٠٠٠ ريال', en: 'From 15,000 SAR' },
  },
  {
    id: 7,
    title: { ar: 'مهرجان القهوة السعودية', en: 'Saudi Coffee Festival' },
    location: { ar: 'بوليفارد الرياض', en: 'Riyadh Boulevard' },
    date: { ar: '٥ - ١٢ ديسمبر ٢٠٢٥', en: 'Dec 5 - 12, 2025' },
    spaces: { available: 55, total: 75 },
    category: 'طعام وشراب',
    image: '/hero-slide-1.jpg',
    featured: false,
    price: { ar: 'يبدأ من ٤,٠٠٠ ريال', en: 'From 4,000 SAR' },
  },
];

// Category Badge Component
function CategoryBadge({ category, isRtl }: { category: string; isRtl: boolean }) {
  const categoryColors: Record<string, string> = {
    'تجاري': 'from-blue-500/80 to-blue-600/80 text-white',
    'طعام وشراب': 'from-orange-500/80 to-orange-600/80 text-white',
    'تقنية': 'from-purple-500/80 to-purple-600/80 text-white',
    'موسمي': 'from-green-500/80 to-green-600/80 text-white',
  };

  const categoryIcons: Record<string, string> = {
    'تجاري': '🏢',
    'طعام وشراب': '🍽️',
    'تقنية': '💻',
    'موسمي': '🎄',
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r backdrop-blur-md shadow-lg ${categoryColors[category] || 'from-gray-500/80 to-gray-600/80 text-white'}`}
    >
      <span className="text-sm">{categoryIcons[category]}</span>
      {category}
    </motion.span>
  );
}

// Event Card Component
function EventCard({
  event,
  index,
  isRtl,
  language,
  isFeatured = false,
}: {
  event: typeof eventsData[0];
  index: number;
  isRtl: boolean;
  language: 'ar' | 'en';
  isFeatured?: boolean;
}) {
  const availabilityPercent = (event.spaces.available / event.spaces.total) * 100;
  const isLowStock = availabilityPercent < 30;

  return (
    <motion.div
      custom={index}
      variants={galleryItemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`group relative rounded-3xl overflow-hidden ${
        isFeatured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      {/* Card Container with Glassmorphism */}
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={springPresets.snappy}
        className="relative h-full bg-gradient-to-br from-white/10 to-white/5 dark:from-[#2A2313]/90 dark:to-[#1A1610]/90 backdrop-blur-xl border border-white/20 dark:border-[#987012]/20 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#E6B830]/10 transition-shadow duration-500"
      >
        {/* Image Container */}
        <div className={`relative overflow-hidden ${isFeatured ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <Image
              src={event.image}
              alt={event.title[language]}
              fill
              className="object-cover"
              sizes={isFeatured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
              loading="lazy"
            />
          </motion.div>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#E6B830]/10 via-transparent to-[#987012]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Category Badge */}
          <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'}`}>
            <CategoryBadge category={event.category} isRtl={isRtl} />
          </div>

          {/* Featured Badge */}
          {event.featured && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'}`}
            >
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#E6B830] to-[#D4A628] text-[#1A1A1A] rounded-full text-xs font-bold shadow-lg shadow-[#E6B830]/30">
                <span className="animate-pulse">⭐</span>
                {language === 'ar' ? 'مميز' : 'Featured'}
              </span>
            </motion.div>
          )}

          {/* Low Stock Warning */}
          {isLowStock && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/90 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                {language === 'ar' ? 'المساحات محدودة!' : 'Limited Spaces!'}
              </span>
            </motion.div>
          )}

          {/* Price Tag */}
          <div className={`absolute bottom-4 ${isRtl ? 'left-4' : 'right-4'}`}>
            <span className="inline-flex items-center px-4 py-2 bg-white/90 dark:bg-[#2A2313]/90 backdrop-blur-sm text-[#987012] dark:text-[#E6B830] rounded-xl text-sm font-bold shadow-lg">
              {event.price[language]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <h3 className={`font-bold text-[#2A2313] dark:text-white mb-3 line-clamp-2 group-hover:text-[#987012] dark:group-hover:text-[#E6B830] transition-colors duration-300 ${isFeatured ? 'text-xl md:text-2xl' : 'text-lg'}`}>
            {event.title[language]}
          </h3>

          <div className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
            {/* Location */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#987012]/10 dark:bg-[#E6B830]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#987012] dark:text-[#E6B830]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="line-clamp-1">{event.location[language]}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#987012]/10 dark:bg-[#E6B830]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#987012] dark:text-[#E6B830]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span>{event.date[language]}</span>
            </div>
          </div>

          {/* Availability Progress */}
          <div className="mt-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'ar' ? 'المساحات المتاحة' : 'Available Spaces'}
              </span>
              <span className={`text-sm font-bold ${isLowStock ? 'text-red-500' : 'text-[#987012] dark:text-[#E6B830]'}`}>
                {event.spaces.available} / {event.spaces.total}
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-[#3F341C] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${availabilityPercent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`h-full rounded-full ${
                  isLowStock
                    ? 'bg-gradient-to-r from-red-500 to-orange-500'
                    : 'bg-gradient-to-r from-[#E6B830] to-[#987012]'
                }`}
              />
            </div>
          </div>

          {/* Profile PDF Button */}
          {'profilePdf' in event && event.profilePdf && (
            <motion.a
              href={event.profilePdf}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-5 w-full py-3.5 bg-gradient-to-r from-[#E6B830] to-[#D4A628] hover:from-[#D4A628] hover:to-[#987012] text-[#1A1A1A] font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-[#E6B830]/20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{language === 'ar' ? 'عرض الملف التعريفي' : 'View Profile'}</span>
            </motion.a>
          )}

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${'profilePdf' in event && event.profilePdf ? 'mt-3' : 'mt-5'} w-full py-3.5 bg-gradient-to-r from-[#987012] to-[#7A5A0E] hover:from-[#E6B830] hover:to-[#987012] text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-xl hover:shadow-[#987012]/20`}
          >
            <span>{language === 'ar' ? 'احجز مساحتك' : 'Book Your Space'}</span>
            <motion.svg
              className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Filter Button Component
function FilterButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 overflow-hidden ${
        isActive
          ? 'bg-gradient-to-r from-[#E6B830] to-[#987012] text-[#1A1A1A] shadow-lg shadow-[#987012]/30'
          : 'bg-white/80 dark:bg-[#2A2313]/80 text-[#3F341C] dark:text-gray-300 hover:bg-white dark:hover:bg-[#3F341C] border border-[#987012]/20 backdrop-blur-sm'
      }`}
    >
      {isActive && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      )}
      <span className="relative z-10">{label}</span>
    </motion.button>
  );
}

export function EventsGallery() {
  const { t, isRtl, language } = useLanguageStore();
  const [activeFilter, setActiveFilter] = useState('الكل');
  const [filteredEvents, setFilteredEvents] = useState(eventsData);
  const containerRef = useRef<HTMLDivElement>(null);

  const categories = isRtl ? eventCategories.ar : eventCategories.en;
  const lang = language as 'ar' | 'en';

  // Filter events
  useEffect(() => {
    if (activeFilter === 'الكل' || activeFilter === 'All') {
      setFilteredEvents(eventsData);
    } else {
      setFilteredEvents(eventsData.filter((event) => event.category === activeFilter));
    }
  }, [activeFilter]);

  return (
    <section ref={containerRef} dir={isRtl ? 'rtl' : 'ltr'} className="py-20 md:py-32 bg-gradient-to-b from-[#FFFDF9] via-[#FBF8F0] to-[#F5ECD4] dark:from-[#1A1610] dark:via-[#1F1A12] dark:to-[#2A2313] relative overflow-hidden">
      {/* Background Decorations - Hidden on mobile to prevent overflow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#E6B830]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#987012]/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#987012]/10 to-[#E6B830]/10 text-[#987012] dark:text-[#E6B830] rounded-full text-sm font-bold mb-6 border border-[#987012]/20"
          >
            <span className="text-lg">🎪</span>
            {lang === 'ar' ? 'اكتشف الفعاليات' : 'Discover Events'}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#2A2313] dark:text-white mb-6"
          >
            {lang === 'ar' ? 'الفعاليات' : 'Events'}{' '}
            <span className="bg-gradient-to-r from-[#E6B830] to-[#987012] bg-clip-text text-transparent">
              {lang === 'ar' ? 'المميزة' : 'Featured'}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            {lang === 'ar'
              ? 'تصفح أحدث الفعاليات والمعارض في المملكة واحجز مساحتك المثالية بكل سهولة'
              : 'Browse the latest events and exhibitions in the Kingdom and book your ideal space with ease'}
          </motion.p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <FilterButton
                label={category}
                isActive={activeFilter === category}
                onClick={() => setActiveFilter(category)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Events Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {filteredEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                isRtl={isRtl}
                language={lang}
                isFeatured={event.featured && index === 0}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-[#2A2313] dark:text-white mb-2">
              {lang === 'ar' ? 'لا توجد فعاليات' : 'No Events Found'}
            </h3>
            <p className="text-gray-500">
              {lang === 'ar' ? 'جرب تصنيف آخر' : 'Try another category'}
            </p>
          </motion.div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-[#2A2313] to-[#3F341C] dark:from-[#E6B830] dark:to-[#D4A628] text-white dark:text-[#1A1A1A] font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-[#987012]/20 transition-all duration-300"
          >
            <span>{lang === 'ar' ? 'عرض جميع الفعاليات' : 'View All Events'}</span>
            <motion.svg
              className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
