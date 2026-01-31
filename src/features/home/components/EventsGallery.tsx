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
    title: { ar: 'معرض الرياض الدولي للتجارة', en: 'Riyadh International Trade Fair' },
    location: { ar: 'مركز الرياض للمعارض والمؤتمرات', en: 'Riyadh Exhibitions Center' },
    date: { ar: '١٤٤٧/٩/٢٦ هـ - ١٤٤٧/١٠/٦ هـ', en: 'Sep 26 - Oct 6, 2025' },
    spaces: { available: 87, total: 150 },
    category: 'تجاري',
    image: '/app-screenshot.png',
    featured: true,
  },
  {
    id: 2,
    title: { ar: 'مهرجان جدة الغذائي', en: 'Jeddah Food Festival' },
    location: { ar: 'كورنيش جدة', en: 'Jeddah Corniche' },
    date: { ar: '١٤٤٧/٩/٢٦ هـ - ١٤٤٧/١٠/٦ هـ', en: 'Sep 26 - Oct 6, 2025' },
    spaces: { available: 45, total: 100 },
    category: 'طعام وشراب',
    image: '/app-screenshot.png',
    featured: false,
  },
  {
    id: 3,
    title: { ar: 'معرض التقنية والابتكار', en: 'Tech & Innovation Expo' },
    location: { ar: 'مركز الملك عبدالعزيز', en: 'King Abdulaziz Center' },
    date: { ar: '١٤٤٧/١١/١ هـ - ١٤٤٧/١١/١٠ هـ', en: 'Nov 1 - Nov 10, 2025' },
    spaces: { available: 120, total: 200 },
    category: 'تقنية',
    image: '/app-screenshot.png',
    featured: true,
  },
  {
    id: 4,
    title: { ar: 'سوق الدمام الموسمي', en: 'Dammam Seasonal Market' },
    location: { ar: 'الواجهة البحرية - الدمام', en: 'Dammam Waterfront' },
    date: { ar: '١٤٤٧/١٢/١ هـ - ١٤٤٧/١٢/١٥ هـ', en: 'Dec 1 - Dec 15, 2025' },
    spaces: { available: 65, total: 80 },
    category: 'موسمي',
    image: '/app-screenshot.png',
    featured: false,
  },
];

// Category Badge Component
function CategoryBadge({ category, isRtl }: { category: string; isRtl: boolean }) {
  const categoryColors: Record<string, string> = {
    'تجاري': 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    'طعام وشراب': 'bg-orange-500/20 text-orange-300 border-orange-400/30',
    'تقنية': 'bg-purple-500/20 text-purple-300 border-purple-400/30',
    'موسمي': 'bg-green-500/20 text-green-300 border-green-400/30',
  };

  const categoryIcons: Record<string, string> = {
    'تجاري': '🏢',
    'طعام وشراب': '🍽️',
    'تقنية': '💻',
    'موسمي': '🎄',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm ${categoryColors[category] || 'bg-gray-500/20 text-gray-300 border-gray-400/30'}`}>
      <span>{categoryIcons[category]}</span>
      {category}
    </span>
  );
}

// Event Card Component
function EventCard({
  event,
  index,
  isRtl,
  isFeatured = false,
}: {
  event: typeof eventsData[0];
  index: number;
  isRtl: boolean;
  isFeatured?: boolean;
}) {
  const language = isRtl ? 'ar' : 'en';

  return (
    <motion.div
      custom={index}
      variants={galleryItemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileHover="hover"
      className={`group relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#2A2313] to-[#3F341C] border border-[#987012]/20 ${
        isFeatured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      {/* Image Container */}
      <motion.div
        variants={galleryHover}
        className="relative aspect-[4/3] overflow-hidden"
      >
        <motion.div variants={imageZoom} className="absolute inset-0">
          <Image
            src={event.image}
            alt={event.title[language]}
            fill
            className="object-cover"
            sizes={isFeatured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
            loading="lazy"
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A2313] via-[#2A2313]/60 to-transparent" />

        {/* Category Badge */}
        <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'}`}>
          <CategoryBadge category={event.category} isRtl={isRtl} />
        </div>

        {/* Featured Badge */}
        {event.featured && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'}`}
          >
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E6B830] text-[#2A2313] rounded-full text-xs font-bold">
              <span>⭐</span>
              مميز
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className={`text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2 ${isFeatured ? 'md:text-2xl' : ''}`}>
          {event.title[language]}
        </h3>

        <div className="space-y-2 text-sm text-gray-400">
          {/* Location */}
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#E6B830] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{event.location[language]}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#E6B830] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span dir="ltr" className={isRtl ? 'text-right' : 'text-left'}>{event.date[language]}</span>
          </div>

          {/* Spaces */}
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#E6B830] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>
              المساحات المتاحة: <span className="text-[#E6B830] font-semibold">{event.spaces.available}</span> / {event.spaces.total}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-1.5 bg-[#3F341C] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(event.spaces.available / event.spaces.total) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#E6B830] to-[#987012] rounded-full"
            />
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 w-full py-3 bg-gradient-to-r from-[#987012] to-[#7A5A0E] hover:from-[#B8891A] hover:to-[#987012] text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          <span>عرض التفاصيل</span>
          <svg
            className={`w-4 h-4 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
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
      className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-[#E6B830] to-[#987012] text-[#2A2313] shadow-lg shadow-[#987012]/30'
          : 'bg-[#3F341C]/50 text-gray-300 hover:bg-[#3F341C] border border-[#987012]/20'
      }`}
    >
      {label}
    </motion.button>
  );
}

export function EventsGallery() {
  const { t, isRtl } = useLanguageStore();
  const [activeFilter, setActiveFilter] = useState('الكل');
  const [filteredEvents, setFilteredEvents] = useState(eventsData);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const categories = isRtl ? eventCategories.ar : eventCategories.en;

  // Filter events
  useEffect(() => {
    if (activeFilter === 'الكل' || activeFilter === 'All') {
      setFilteredEvents(eventsData);
    } else {
      setFilteredEvents(eventsData.filter((event) => event.category === activeFilter));
    }
  }, [activeFilter]);

  return (
    <section ref={containerRef} className="py-16 md:py-24 bg-gradient-to-b from-[#FBF8F0] to-[#F5ECD4] dark:from-[#1A1610] dark:to-[#2A2313]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 bg-[#987012]/10 text-[#987012] rounded-full text-sm font-semibold mb-4"
          >
            🎪 جميع الفعاليات
          </motion.span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2A2313] dark:text-white mb-4">
            اكتشف <span className="text-[#987012]">الفعاليات</span> المميزة
          </h2>

          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            تصفح أحدث الفعاليات والمعارض المتاحة واحجز مساحتك المثالية
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {categories.map((category) => (
            <FilterButton
              key={category}
              label={category}
              isActive={activeFilter === category}
              onClick={() => setActiveFilter(category)}
            />
          ))}
        </motion.div>

        {/* Events Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                isRtl={isRtl}
                isFeatured={event.featured && index === 0}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#2A2313] dark:bg-[#E6B830] text-white dark:text-[#2A2313] font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span>عرض جميع الفعاليات</span>
            <svg
              className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
