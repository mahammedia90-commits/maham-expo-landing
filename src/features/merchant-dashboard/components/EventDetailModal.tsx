'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import type { MerchantEvent, EventType } from '@/shared/types';

interface EventDetailModalProps {
  event: MerchantEvent | null;
  onClose: () => void;
  variant?: 'merchant' | 'investor';
}

const typeColors: Record<EventType, string> = {
  exhibition: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  conference: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  entertainment: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  cultural: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  sports: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  technology: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
};

export function EventDetailModal({ event, onClose, variant = 'merchant' }: EventDetailModalProps) {
  const { t, language } = useLanguageStore();
  const [imgError, setImgError] = useState(false);

  if (!event) return null;

  const isEn = language === 'en';
  const eventType = event.type || 'exhibition';
  const hasImage = event.image && !imgError;

  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-400',
    active: 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-400',
    ended: 'bg-gray-100 text-gray-600 dark:bg-gray-700/80 dark:text-gray-300',
  };

  const statusLabels = {
    upcoming: t.dashboard.upcoming,
    active: t.dashboard.active,
    ended: t.dashboard.ended,
  };

  const typeLabels: Record<EventType, string> = {
    exhibition: t.dashboard.exhibition,
    conference: t.dashboard.conference,
    entertainment: t.dashboard.entertainment,
    cultural: t.dashboard.cultural,
    sports: t.dashboard.sports,
    technology: t.dashboard.technology,
  };

  const formatNumber = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toString();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image header */}
          <div className="relative h-56 sm:h-64 overflow-hidden rounded-t-2xl">
            {hasImage ? (
              <>
                <img
                  src={event.image!}
                  alt={event.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#987012]/20 to-[#D4B85A]/20 dark:from-[#987012]/10 dark:to-[#D4B85A]/10 flex items-center justify-center">
                <svg className="w-20 h-20 text-[#987012]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Badges on image */}
            <div className="absolute top-4 right-4 flex gap-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md ${statusColors[event.status]}`}>
                {statusLabels[event.status]}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md ${hasImage ? 'bg-black/40 text-white' : typeColors[eventType]}`}>
                {typeLabels[eventType]}
              </span>
            </div>

            {/* Title on image */}
            {hasImage && (
              <div className="absolute bottom-4 right-4 left-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
                  {isEn && event.nameEn ? event.nameEn : event.name}
                </h2>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title if no image */}
            {!hasImage && (
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {isEn && event.nameEn ? event.nameEn : event.name}
              </h2>
            )}

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              {isEn && event.descriptionEn ? event.descriptionEn : event.description}
            </p>

            {/* Stats */}
            {event.stats && (
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <svg className="w-5 h-5 text-[#987012]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{formatNumber(event.stats.expectedVisitors)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{isEn ? 'Expected Visitors' : 'الزوار المتوقعون'}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <svg className="w-5 h-5 text-[#987012]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{formatNumber(event.stats.exhibitors)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{isEn ? 'Exhibitors' : 'العارضون'}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <svg className="w-5 h-5 text-[#987012]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{formatNumber(event.stats.area)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{isEn ? 'Area (m²)' : 'المساحة (م²)'}</p>
                </div>
              </div>
            )}

            {/* Info grid */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <svg className="w-5 h-5 shrink-0 text-[#987012]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <svg className="w-5 h-5 shrink-0 text-[#987012]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{event.city}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <svg className="w-5 h-5 shrink-0 text-[#987012]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span dir="ltr">
                  {new Date(event.startDate).toLocaleDateString(isEn ? 'en-US' : 'ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
                  {' - '}
                  {new Date(event.endDate).toLocaleDateString(isEn ? 'en-US' : 'ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Booths info */}
            <div className="bg-gradient-to-r from-[#987012]/10 to-[#D4B85A]/10 dark:from-[#987012]/5 dark:to-[#D4B85A]/5 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {variant === 'investor'
                    ? (isEn ? 'Available Spaces' : 'المساحات المتاحة')
                    : t.dashboard.availableBooths}
                </span>
                <span className="text-sm font-bold text-[#987012]">
                  {event.availableBooths}/{event.totalBooths}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-[#987012] to-[#D4B85A] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${event.totalBooths > 0 ? ((event.totalBooths - event.availableBooths) / event.totalBooths) * 100 : 0}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {isEn
                  ? `${Math.round(((event.totalBooths - event.availableBooths) / event.totalBooths) * 100)}% booked`
                  : `${Math.round(((event.totalBooths - event.availableBooths) / event.totalBooths) * 100)}% محجوز`}
              </p>
            </div>

            {/* CTA */}
            {event.status !== 'ended' && (
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#987012] to-[#D4B85A] text-white font-semibold hover:shadow-lg hover:shadow-[#987012]/20 transition-all duration-300">
                {variant === 'investor'
                  ? (isEn ? 'Offer Your Spaces' : 'اعرض مساحاتك')
                  : (isEn ? 'Book a Booth' : 'احجز بوثك')}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
