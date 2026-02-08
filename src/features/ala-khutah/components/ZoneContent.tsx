'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { alaKhutahData, getZoneBySlug, type Booth } from '@/data/alaKhutahData';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  springPresets,
  modalBackdrop,
  modalContent,
} from '@/shared/utils/animations';

// Booth Card Component
function BoothCard({
  booth,
  index,
  isRtl,
  language,
  onImageClick,
}: {
  booth: Booth;
  index: number;
  isRtl: boolean;
  language: 'ar' | 'en';
  onImageClick: (booth: Booth) => void;
}) {
  return (
    <motion.div
      variants={staggerItem}
      custom={index}
      className="group"
    >
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={springPresets.snappy}
        className="relative bg-gradient-to-br from-white/80 to-white/40 dark:from-[#2A2313]/90 dark:to-[#1A1610]/90 backdrop-blur-xl border border-white/20 dark:border-[#987012]/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#E6B830]/10 transition-all duration-500"
      >
        {/* Booth Image */}
        <div
          className="relative aspect-square overflow-hidden cursor-pointer"
          onClick={() => onImageClick(booth)}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <Image
              src={booth.image}
              alt={booth.name}
              fill
              className="object-contain bg-white dark:bg-[#1A1610] p-2"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </motion.div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#987012]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span className="text-white font-semibold text-sm flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
              {language === 'ar' ? 'عرض مكبر' : 'View Larger'}
            </span>
          </div>
        </div>

        {/* Booth Name */}
        <div className="p-4 text-center">
          <h3 className="font-bold text-[#2A2313] dark:text-white text-lg group-hover:text-[#987012] dark:group-hover:text-[#E6B830] transition-colors duration-300">
            {booth.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {language === 'ar' ? 'متاح للحجز' : 'Available for booking'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Image Modal Component
function ImageModal({
  booth,
  isOpen,
  onClose,
  language,
}: {
  booth: Booth | null;
  isOpen: boolean;
  onClose: () => void;
  language: 'ar' | 'en';
}) {
  if (!booth) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalBackdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#2A2313] rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-[#1A1610]/90 backdrop-blur-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#987012] dark:hover:text-[#E6B830] transition-colors shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={booth.image}
                alt={booth.name}
                fill
                className="object-contain bg-white dark:bg-[#1A1610]"
                sizes="(max-width: 1024px) 100vw, 80vw"
                priority
              />
            </div>

            {/* Booth Info */}
            <div className="p-6 border-t border-gray-200 dark:border-[#987012]/20">
              <h3 className="text-2xl font-bold text-[#2A2313] dark:text-white mb-2">
                {booth.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {language === 'ar'
                  ? 'هذه المساحة متاحة للحجز. تواصل معنا للمزيد من المعلومات.'
                  : 'This space is available for booking. Contact us for more information.'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ZoneContentProps {
  zoneId: string;
}

export function ZoneContent({ zoneId }: ZoneContentProps) {
  const { language, isRtl } = useLanguageStore();
  const lang = language as 'ar' | 'en';

  const zone = getZoneBySlug(zoneId);

  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (booth: Booth) => {
    setSelectedBooth(booth);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedBooth(null), 200);
  };

  // Handle zone not found
  if (!zone) {
    return (
      <section
        dir={isRtl ? 'rtl' : 'ltr'}
        className="min-h-screen py-20 bg-gradient-to-b from-[#FFFDF9] via-[#FBF8F0] to-[#F5ECD4] dark:from-[#1A1610] dark:via-[#1F1A12] dark:to-[#2A2313]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl font-bold text-[#2A2313] dark:text-white mb-4">
            {lang === 'ar' ? 'المنطقة غير موجودة' : 'Zone Not Found'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            {lang === 'ar'
              ? 'عذراً، لم نتمكن من العثور على المنطقة المطلوبة.'
              : "Sorry, we couldn't find the requested zone."}
          </p>
          <Link
            href="/ala-khutah"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E6B830] to-[#987012] text-[#1A1A1A] font-bold rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <svg
              className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{lang === 'ar' ? 'العودة للمناطق' : 'Back to Zones'}</span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        dir={isRtl ? 'rtl' : 'ltr'}
        className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-[#FFFDF9] via-[#FBF8F0] to-[#F5ECD4] dark:from-[#1A1610] dark:via-[#1F1A12] dark:to-[#2A2313] relative overflow-hidden"
      >
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
          <div className="absolute top-20 right-10 w-96 h-96 bg-[#E6B830]/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#987012]/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb Navigation */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Link
                href="/"
                className="hover:text-[#987012] dark:hover:text-[#E6B830] transition-colors"
              >
                {lang === 'ar' ? 'الرئيسية' : 'Home'}
              </Link>
              <span>/</span>
              <Link
                href="/ala-khutah"
                className="hover:text-[#987012] dark:hover:text-[#E6B830] transition-colors"
              >
                {alaKhutahData.title[lang]}
              </Link>
              <span>/</span>
              <span className="text-[#987012] dark:text-[#E6B830] font-medium">
                {zone.name[lang]}
              </span>
            </nav>
          </motion.div>

          {/* Header Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center mb-12 md:mb-16"
          >
            {/* Zone Badge */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#987012]/10 to-[#E6B830]/10 text-[#987012] dark:text-[#E6B830] rounded-full text-sm font-bold mb-6 border border-[#987012]/20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {lang === 'ar' ? 'منطقة' : 'Zone'}
            </motion.span>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#2A2313] dark:text-white mb-6"
            >
              {zone.name[lang]}{' '}
              <span className="bg-gradient-to-r from-[#E6B830] to-[#987012] bg-clip-text text-transparent">
                {lang === 'ar' ? 'المساحات' : 'Spaces'}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              {lang === 'ar'
                ? `تصفح ${zone.booths.length} مساحة متاحة للحجز في منطقة ${zone.name.ar}`
                : `Browse ${zone.booths.length} available spaces for booking in ${zone.name.en}`}
            </motion.p>
          </motion.div>

          {/* Booths Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {zone.booths.map((booth, index) => (
              <BoothCard
                key={booth.id}
                booth={booth}
                index={index}
                isRtl={isRtl}
                language={lang}
                onImageClick={handleImageClick}
              />
            ))}
          </motion.div>

          {/* Back to Zones Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center"
          >
            <Link
              href="/ala-khutah"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#2A2313] to-[#3F341C] dark:from-[#E6B830] dark:to-[#D4A628] text-white dark:text-[#1A1A1A] font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-[#987012]/20 transition-all duration-300 hover:scale-105"
            >
              <svg
                className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>{lang === 'ar' ? 'العودة لجميع المناطق' : 'Back to All Zones'}</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Image Modal */}
      <ImageModal
        booth={selectedBooth}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        language={lang}
      />
    </>
  );
}
