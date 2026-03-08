'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import type { MerchantEvent, EventType } from '@/shared/types';

interface EventDetailModalProps {
  event: MerchantEvent | null;
  onClose: () => void;
  variant?: 'merchant' | 'investor' | 'sponsor';
}

function toHijri(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function toGregorian(dateStr: string, lang: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-SA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

const typeLabelsAr: Record<EventType, string> = {
  exhibition: 'معارض ومؤتمرات',
  conference: 'معارض ومؤتمرات',
  entertainment: 'ترفيه',
  cultural: 'ثقافة ومجتمع',
  sports: 'رياضة',
  technology: 'تقنية',
};

const typeLabelsEn: Record<EventType, string> = {
  exhibition: 'Exhibitions & Conferences',
  conference: 'Exhibitions & Conferences',
  entertainment: 'Entertainment',
  cultural: 'Culture & Community',
  sports: 'Sports',
  technology: 'Technology',
};

export function EventDetailModal({ event, onClose, variant = 'merchant' }: EventDetailModalProps) {
  const { language } = useLanguageStore();
  const [imgError, setImgError] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [copied, setCopied] = useState(false);

  const isEn = language === 'en';

  useEffect(() => {
    if (event) {
      document.body.style.overflow = 'hidden';
      setImgError(false);
      setCurrentImg(0);
    }
    return () => { document.body.style.overflow = ''; };
  }, [event]);

  if (!event) return null;

  const allImages = event.images?.length ? event.images : event.image ? [event.image] : [];
  const hasImage = allImages.length > 0 && !imgError;
  const title = isEn && event.nameEn ? event.nameEn : event.name;
  const description = isEn && event.descriptionEn ? event.descriptionEn : event.description;
  const organizer = isEn && event.organizerEn ? event.organizerEn : event.organizer;
  const categoryLabel = isEn ? typeLabelsEn[event.type] : typeLabelsAr[event.type];

  const handleShare = async () => {
    const url = window.location.href;
    const text = title;
    if (navigator.share) {
      try { await navigator.share({ title: text, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const mapUrl = event.lat && event.lon
    ? `https://www.google.com/maps?q=${event.lat},${event.lon}&z=15&output=embed`
    : null;

  const mapLink = event.lat && event.lon
    ? `https://www.google.com/maps?q=${event.lat},${event.lon}`
    : `https://www.google.com/maps/search/${encodeURIComponent(event.location)}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-white dark:bg-gray-950 overflow-y-auto"
        dir={isEn ? 'ltr' : 'rtl'}
      >
        {/* Top navigation bar */}
        <div className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
            >
              <svg className={`w-5 h-5 ${isEn ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">{isEn ? 'Back to Events' : 'العودة للفعاليات'}</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                {copied ? (
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                )}
                <span className="hidden sm:inline">{copied ? (isEn ? 'Copied!' : 'تم النسخ!') : (isEn ? 'Share' : 'مشاركة')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full bg-gray-100 dark:bg-gray-900">
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-[16/7] sm:aspect-[16/6] overflow-hidden">
              {hasImage ? (
                <>
                  <img
                    src={allImages[currentImg]}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                  {/* Image carousel dots */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                      {allImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImg(i)}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            i === currentImg ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Prev/Next arrows */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImg((c) => (c - 1 + allImages.length) % allImages.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setCurrentImg((c) => (c + 1) % allImages.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left (or Right in RTL) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Category & Status */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#987012]/10 text-[#987012] dark:bg-[#987012]/20 dark:text-[#D4B85A]">
                  {categoryLabel}
                </span>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                  event.status === 'active' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                  event.status === 'upcoming' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {event.status === 'active' ? (isEn ? 'Active Now' : 'فعّال الآن') :
                   event.status === 'upcoming' ? (isEn ? 'Upcoming' : 'قادم') :
                   (isEn ? 'Ended' : 'انتهى')}
                </span>
                {event.priceType === 'free' && (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                    {isEn ? 'Free' : 'مجاني'}
                  </span>
                )}
                {event.views !== undefined && (
                  <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {event.views}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                {title}
              </h1>

              {/* Organizer */}
              {organizer && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-sm font-medium">{isEn ? 'Organized by: ' : 'المنظم: '}<strong>{organizer}</strong></span>
                </div>
              )}

              {/* Date & Time Section */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#987012]/15 dark:bg-[#987012]/25 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#987012] dark:text-[#D4B85A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {isEn ? 'Event Date' : 'تاريخ الفعالية'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {toGregorian(event.startDate, language)}
                      {event.startDate !== event.endDate && (
                        <> — {toGregorian(event.endDate, language)}</>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                      {toHijri(event.startDate)}
                      {event.startDate !== event.endDate && (
                        <> — {toHijri(event.endDate)}</>
                      )}
                    </p>
                  </div>
                </div>

                {(event.startTime || event.endTime) && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {isEn ? 'Time' : 'الوقت'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1" dir="ltr">
                        {event.startTime}{event.endTime ? ` — ${event.endTime}` : ''}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {isEn ? 'Location' : 'الموقع'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.location}</p>
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#987012] dark:text-[#D4B85A] hover:underline mt-1"
                    >
                      {isEn ? 'View on Map' : 'عرض على الخريطة'}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {isEn ? 'About the Event' : 'عن الفعالية'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {description}
                </p>
              </div>

              {/* Map */}
              {mapUrl && (
                <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Event Location"
                  />
                </div>
              )}

              {/* Stats */}
              {event.stats && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-center">
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                      {event.stats.expectedVisitors >= 1000000
                        ? `${(event.stats.expectedVisitors / 1000000).toFixed(1)}M`
                        : event.stats.expectedVisitors >= 1000
                        ? `${(event.stats.expectedVisitors / 1000).toFixed(0)}K`
                        : event.stats.expectedVisitors}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{isEn ? 'Expected Visitors' : 'الزوار المتوقعون'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-center">
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{event.stats.exhibitors}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{isEn ? 'Exhibitors' : 'العارضون'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-center">
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                      {event.stats.area >= 1000 ? `${(event.stats.area / 1000).toFixed(0)}K` : event.stats.area}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{isEn ? 'Area (m²)' : 'المساحة (م²)'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Action Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-5 sticky top-20">
                {/* Price */}
                <div className="text-center pb-4 border-b border-gray-100 dark:border-gray-800">
                  {event.priceType === 'free' || !event.priceAmount ? (
                    <p className="text-2xl font-black text-green-600 dark:text-green-400">{isEn ? 'Free' : 'مجاني'}</p>
                  ) : (
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                      {event.priceAmount} <span className="text-sm font-normal text-gray-500">{isEn ? 'SAR' : 'ر.س'}</span>
                    </p>
                  )}
                </div>

                {/* Units Info */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {variant === 'investor'
                        ? (isEn ? 'Available Spaces' : 'المساحات المتاحة')
                        : variant === 'sponsor'
                        ? (isEn ? 'Sponsorship Slots' : 'مواقع الرعاية')
                        : (isEn ? 'Available Units' : 'الوحدات المتاحة')}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {event.availableUnits}/{event.totalUnits}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#987012] to-[#D4B85A] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${event.totalUnits > 0 ? ((event.totalUnits - event.availableUnits) / event.totalUnits) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                    {isEn
                      ? `${Math.round(((event.totalUnits - event.availableUnits) / event.totalUnits) * 100)}% booked`
                      : `${Math.round(((event.totalUnits - event.availableUnits) / event.totalUnits) * 100)}% محجوز`}
                  </p>
                </div>

                {/* CTA Button */}
                {event.status !== 'ended' && (
                  <button className="w-full py-3.5 rounded-xl bg-[#987012] hover:bg-[#7a5a0e] text-white font-bold text-sm transition-colors">
                    {variant === 'investor'
                      ? (isEn ? 'Offer Your Spaces' : 'اعرض مساحاتك')
                      : variant === 'sponsor'
                      ? (isEn ? 'Request Sponsorship' : 'طلب رعاية')
                      : (isEn ? 'Book a Unit' : 'احجز وحدتك')}
                  </button>
                )}

                {/* Contact Info */}
                {(event.website || event.email || event.phone) && (
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {isEn ? 'Contact' : 'التواصل'}
                    </p>
                    {event.website && (
                      <a
                        href={event.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-[#987012] dark:hover:text-[#D4B85A] transition-colors"
                      >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <span className="truncate">{event.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
                      </a>
                    )}
                    {event.email && (
                      <a
                        href={`mailto:${event.email}`}
                        className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-[#987012] dark:hover:text-[#D4B85A] transition-colors"
                      >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{event.email}</span>
                      </a>
                    )}
                    {event.phone && (
                      <a
                        href={`tel:${event.phone}`}
                        className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-[#987012] dark:hover:text-[#D4B85A] transition-colors"
                      >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span dir="ltr">{event.phone}</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Share buttons */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    {isEn ? 'Share Event' : 'مشاركة الفعالية'}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                      className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(title + '\n' + window.location.href)}`, '_blank')}
                      className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
