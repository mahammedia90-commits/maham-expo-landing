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
  unit,
  index,
  isRtl,
  language,
  onImageClick,
}: {
  unit: Booth;
  index: number;
  isRtl: boolean;
  language: 'ar' | 'en';
  onImageClick: (unit: Booth) => void;
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
          onClick={() => onImageClick(unit)}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <Image
              src={unit.image}
              alt={unit.name}
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

        {/* Booth Info */}
        <div className="p-4 text-center space-y-3">
          <h3 className="font-bold text-[#2A2313] dark:text-white text-lg group-hover:text-[#987012] dark:group-hover:text-[#E6B830] transition-colors duration-300">
            {unit.name}
          </h3>
          <div className="flex items-center justify-center gap-3 text-lg text-gray-600 dark:text-gray-300">
            <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#987012]/10 text-[#987012] dark:text-[#E6B830] font-bold text-base">
              {unit.type === 'F&B' ? (language === 'ar' ? 'أغذية ومشروبات' : 'F&B') : (language === 'ar' ? 'تجزئة' : 'Retail')}
            </span>
            <span className="font-bold text-base">{unit.area} {language === 'ar' ? 'م²' : 'm²'}</span>
          </div>
          {unit.status === 'rented' ? (
            <p className="text-base text-red-500 dark:text-red-400 font-bold">
              {language === 'ar' ? 'تم التأجير' : 'Rented'}
            </p>
          ) : (
            <a
              href={`https://wa.me/966535555900?text=${encodeURIComponent(language === 'ar' ? `أرغب في حجز الموقع ${unit.name}` : `I want to book space ${unit.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#1fb855] text-white font-bold text-base rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#25D366]/30"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {language === 'ar' ? 'احجز الآن' : 'Book Now'}
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Image Modal Component
function ImageModal({
  unit,
  isOpen,
  onClose,
  language,
}: {
  unit: Booth | null;
  isOpen: boolean;
  onClose: () => void;
  language: 'ar' | 'en';
}) {
  if (!unit) return null;

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
                src={unit.image}
                alt={unit.name}
                fill
                className="object-contain bg-white dark:bg-[#1A1610]"
                sizes="(max-width: 1024px) 100vw, 80vw"
                priority
              />
            </div>

            {/* Booth Info */}
            <div className="p-6 border-t border-gray-200 dark:border-[#987012]/20">
              <h3 className="text-2xl font-bold text-[#2A2313] dark:text-white mb-2">
                {unit.name}
              </h3>
              <div className="flex items-center gap-4 mb-3 text-lg text-gray-600 dark:text-gray-300">
                <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#987012]/10 text-[#987012] dark:text-[#E6B830] font-bold text-base">
                  {unit.type === 'F&B' ? (language === 'ar' ? 'أغذية ومشروبات' : 'F&B') : (language === 'ar' ? 'تجزئة' : 'Retail')}
                </span>
                <span className="font-semibold">{unit.area} {language === 'ar' ? 'م²' : 'm²'}</span>
              </div>
              {unit.status === 'rented' ? (
                <p className="text-lg text-red-500 dark:text-red-400 font-bold">
                  {language === 'ar' ? 'تم التأجير' : 'Rented'}
                </p>
              ) : (
                <a
                  href={`https://wa.me/966535555900?text=${encodeURIComponent(language === 'ar' ? `أرغب في حجز الموقع ${unit.name}` : `I want to book space ${unit.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-[#25D366] hover:bg-[#1fb855] text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#25D366]/30"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {language === 'ar' ? 'احجز الآن' : 'Book Now'}
                </a>
              )}
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

  const handleImageClick = (unit: Booth) => {
    setSelectedBooth(unit);
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
              {zone.name[lang]}
              <span className="block mt-3">
                <span className="bg-gradient-to-r from-[#E6B830] to-[#987012] bg-clip-text text-transparent">
                  {lang === 'ar' ? 'المساحات' : 'Spaces'}
                </span>
              </span>
            </motion.h1>

            {/* Zone Description */}
            {zone.description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[#2A2313]/80 dark:text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-4"
              >
                {zone.description[lang]}
              </motion.p>
            )}

            {/* Spaces Count */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto"
            >
              {(() => {
                const availableCount = zone.units.filter(b => b.status !== 'rented').length;
                return lang === 'ar'
                  ? `تصفح ${availableCount} مساحة متاحة للحجز من أصل ${zone.units.length} في منطقة ${zone.name.ar}`
                  : `Browse ${availableCount} of ${zone.units.length} spaces available for booking in ${zone.name.en}`;
              })()}
            </motion.p>
          </motion.div>

          {/* Zone Video */}
          {zone.video && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-12 md:mb-16"
            >
              <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-[#987012]/10 border border-[#987012]/20">
                <video
                  className="w-full aspect-video object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  poster=""
                >
                  <source src={zone.video} type="video/mp4" />
                  {lang === 'ar' ? 'متصفحك لا يدعم تشغيل الفيديو.' : 'Your browser does not support the video tag.'}
                </video>
              </div>
            </motion.div>
          )}

          {/* Units Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {zone.units.map((unit, index) => (
              <BoothCard
                key={unit.id}
                unit={unit}
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
        unit={selectedBooth}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        language={lang}
      />
    </>
  );
}
