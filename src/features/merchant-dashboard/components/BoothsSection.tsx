'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useUnits } from '../hooks/useMerchantData';
import { BoothCard } from './BoothCard';
import { LoadingSkeleton } from './LoadingSkeleton';

// ── Real Event Spaces (Merchant View) ───────────────────────
const merchantEventSpaces = [
  {
    id: 'ala-khutah',
    name: { ar: 'فعالية على خطاه', en: 'Ala Khutah Event' },
    description: {
      ar: 'احجز وحدتك في رحلة إيمانية من مكة المكرمة إلى المدينة المنورة - مساحات للمطاعم والتجزئة والخدمات في 8 مناطق',
      en: 'Book your unit in a spiritual journey from Makkah to Madinah - spaces for restaurants, retail & services across 8 zones',
    },
    location: { ar: 'من مكة المكرمة إلى المدينة المنورة', en: 'From Makkah to Madinah' },
    image: '/ala-khutah.png',
    profilePdf: '/Alla Khotah.pdf',
    bookingLink: '/ala-khutah',
    totalSpaces: 100,
    availableSpaces: 66,
    priceFrom: { ar: 'يبدأ من ٤,٠٠٠ ريال', en: 'From 4,000 SAR' },
    rating: 4.9,
    zones: [
      { name: { ar: 'الجحفة', en: 'Al-Juhfah' }, available: 9, total: 15, priceRange: { ar: '٤,٠٠٠ - ٨,٠٠٠ ريال', en: '4,000 - 8,000 SAR' }, types: { ar: ['مطاعم', 'تجزئة'], en: ['Food', 'Retail'] } },
      { name: { ar: 'الريم', en: 'Al-Reem' }, available: 7, total: 12, priceRange: { ar: '٥,٠٠٠ - ١٠,٠٠٠ ريال', en: '5,000 - 10,000 SAR' }, types: { ar: ['مطاعم', 'خدمات'], en: ['Food', 'Services'] } },
      { name: { ar: 'العرج', en: 'Al-Araj' }, available: 10, total: 14, priceRange: { ar: '٤,٠٠٠ - ٧,٠٠٠ ريال', en: '4,000 - 7,000 SAR' }, types: { ar: ['تجزئة', 'ترفيه'], en: ['Retail', 'Entertainment'] } },
      { name: { ar: 'القاهة', en: 'Al-Qahah' }, available: 7, total: 10, priceRange: { ar: '٣,٥٠٠ - ٦,٠٠٠ ريال', en: '3,500 - 6,000 SAR' }, types: { ar: ['مطاعم', 'تجزئة'], en: ['Food', 'Retail'] } },
      { name: { ar: 'غار ثور', en: 'Ghar Thawr' }, available: 8, total: 13, priceRange: { ar: '٥,٠٠٠ - ٩,٠٠٠ ريال', en: '5,000 - 9,000 SAR' }, types: { ar: ['مطاعم', 'خدمات'], en: ['Food', 'Services'] } },
      { name: { ar: 'الجثاثة', en: 'Al-Juthathah' }, available: 8, total: 12, priceRange: { ar: '٤,٠٠٠ - ٧,٥٠٠ ريال', en: '4,000 - 7,500 SAR' }, types: { ar: ['تجزئة', 'خدمات'], en: ['Retail', 'Services'] } },
      { name: { ar: 'أسفل عسفان', en: 'Asfal Usfan' }, available: 8, total: 12, priceRange: { ar: '٣,٥٠٠ - ٦,٥٠٠ ريال', en: '3,500 - 6,500 SAR' }, types: { ar: ['مطاعم', 'تجزئة'], en: ['Food', 'Retail'] } },
      { name: { ar: 'أم معبد', en: 'Um Maabad' }, available: 9, total: 12, priceRange: { ar: '٤,٥٠٠ - ٨,٠٠٠ ريال', en: '4,500 - 8,000 SAR' }, types: { ar: ['مطاعم', 'ترفيه'], en: ['Food', 'Entertainment'] } },
    ],
    amenities: { ar: ['كهرباء', 'مياه', 'إنارة', 'أمن 24/7', 'مواقف', 'نظافة'], en: ['Electricity', 'Water', 'Lighting', '24/7 Security', 'Parking', 'Cleaning'] },
  },
  {
    id: 'blvd-world',
    name: { ar: 'بوليفارد وورلد', en: 'Boulevard World' },
    description: {
      ar: 'استثمر في قلب الرياض - مساحات تجارية متنوعة في أكبر وجهة ترفيهية عالمية بالمملكة',
      en: 'Invest in the heart of Riyadh - diverse commercial spaces in the Kingdom\'s largest entertainment destination',
    },
    location: { ar: 'الرياض، المملكة العربية السعودية', en: 'Riyadh, Saudi Arabia' },
    image: '/blvd.png',
    profilePdf: '/BLVD Available Sites.pdf',
    bookingLink: undefined,
    totalSpaces: 234,
    availableSpaces: 78,
    priceFrom: { ar: 'يبدأ من ٢,٥٠٠ ريال', en: 'From 2,500 SAR' },
    rating: 4.8,
    zones: [
      { name: { ar: 'المنطقة الأمريكية', en: 'American Zone' }, available: 7, total: 35, priceRange: { ar: '٢,٥٠٠ - ١٢,٠٠٠ ريال', en: '2,500 - 12,000 SAR' }, types: { ar: ['مطاعم', 'ترفيه'], en: ['Food', 'Entertainment'] } },
      { name: { ar: 'المنطقة الآسيوية', en: 'Asian Zone' }, available: 10, total: 40, priceRange: { ar: '٢,٥٠٠ - ١٠,٠٠٠ ريال', en: '2,500 - 10,000 SAR' }, types: { ar: ['مطاعم', 'تجزئة'], en: ['Food', 'Retail'] } },
      { name: { ar: 'المنطقة الأوروبية', en: 'European Zone' }, available: 13, total: 38, priceRange: { ar: '٣,٠٠٠ - ١٥,٠٠٠ ريال', en: '3,000 - 15,000 SAR' }, types: { ar: ['مطاعم', 'تجزئة', 'خدمات'], en: ['Food', 'Retail', 'Services'] } },
      { name: { ar: 'المنطقة العربية', en: 'Arabian Zone' }, available: 13, total: 45, priceRange: { ar: '٢,٥٠٠ - ٨,٠٠٠ ريال', en: '2,500 - 8,000 SAR' }, types: { ar: ['مطاعم', 'تجزئة'], en: ['Food', 'Retail'] } },
      { name: { ar: 'منطقة الترفيه', en: 'Entertainment Zone' }, available: 12, total: 30, priceRange: { ar: '٥,٠٠٠ - ٢٠,٠٠٠ ريال', en: '5,000 - 20,000 SAR' }, types: { ar: ['ترفيه', 'خدمات'], en: ['Entertainment', 'Services'] } },
      { name: { ar: 'الساحة الرئيسية', en: 'Main Plaza' }, available: 23, total: 46, priceRange: { ar: '٤,٠٠٠ - ١٨,٠٠٠ ريال', en: '4,000 - 18,000 SAR' }, types: { ar: ['مطاعم', 'تجزئة', 'معارض'], en: ['Food', 'Retail', 'Exhibitions'] } },
    ],
    amenities: { ar: ['تكييف مركزي', 'إنترنت عالي السرعة', 'شاشات عرض', 'أمن', 'مواقف VIP', 'نظافة'], en: ['Central AC', 'High-speed WiFi', 'Display Screens', 'Security', 'VIP Parking', 'Cleaning'] },
  },
];

// ── Merchant Space Card ─────────────────────────────────────
function MerchantSpaceCard({ event, lang, isRtl }: { event: typeof merchantEventSpaces[0]; lang: 'ar' | 'en'; isRtl: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const availabilityPercent = Math.round((event.availableSpaces / event.totalSpaces) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Image Header */}
      <div className="relative h-52 overflow-hidden">
        <Image src={event.image} alt={event.name[lang]} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'}`}>
          <span className="px-3 py-1.5 bg-gradient-to-r from-[#987012] to-[#D4B85A] text-white rounded-full text-xs font-bold shadow-lg">
            {lang === 'ar' ? 'فعالية حقيقية' : 'Live Event'}
          </span>
        </div>
        <div className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'}`}>
          <span className="px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-[#987012] rounded-xl text-sm font-bold shadow-lg">
            {event.priceFrom[lang]}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 left-3">
          <h3 className="text-xl font-black text-white mb-0.5">{event.name[lang]}</h3>
          <div className="flex items-center gap-1.5 text-white/80 text-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span>{event.location[lang]}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{event.description[lang]}</p>

        {/* Availability Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/10 dark:to-green-800/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-green-600 dark:text-green-400">{event.availableSpaces}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{lang === 'ar' ? 'متاحة' : 'Available'}</p>
          </div>
          <div className="bg-gradient-to-br from-[#987012]/5 to-[#D4B85A]/5 dark:from-[#987012]/10 dark:to-[#D4B85A]/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-[#987012] dark:text-[#D4B85A]">{event.totalSpaces}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{lang === 'ar' ? 'إجمالي' : 'Total'}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-800/10 rounded-xl p-3 text-center flex flex-col items-center justify-center">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <span className="text-lg font-black text-gray-900 dark:text-white">{event.rating}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{lang === 'ar' ? 'التقييم' : 'Rating'}</p>
          </div>
        </div>

        {/* Availability Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-gray-600 dark:text-gray-400">{lang === 'ar' ? 'المساحات المتاحة' : 'Available Spaces'}</span>
            <span className="font-bold text-green-600 dark:text-green-400">{availabilityPercent}%</span>
          </div>
          <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${availabilityPercent}%` }} transition={{ duration: 1, delay: 0.3 }} className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400" />
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {event.amenities[lang].slice(0, 4).map((a) => (
            <span key={a} className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{a}</span>
          ))}
          {event.amenities[lang].length > 4 && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">+{event.amenities[lang].length - 4}</span>
          )}
        </div>

        {/* Expand Zones */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2.5 text-sm font-medium text-[#987012] dark:text-[#D4B85A] hover:bg-[#987012]/5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <span>{lang === 'ar' ? (expanded ? 'إخفاء المناطق' : `استعرض المناطق (${event.zones.length})`) : (expanded ? 'Hide Zones' : `Browse Zones (${event.zones.length})`)}</span>
          <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2">
                {event.zones.map((zone) => (
                  <div key={zone.name[lang]} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{zone.name[lang]}</span>
                      <span className={`text-xs font-bold ${zone.available > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                        {zone.available > 0 ? `${zone.available} ${lang === 'ar' ? 'متاحة' : 'available'}` : (lang === 'ar' ? 'مكتملة' : 'Full')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{zone.priceRange[lang]}</p>
                    <div className="flex flex-wrap gap-1">
                      {zone.types[lang].map((t) => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-[#987012]/10 text-[#987012] dark:text-[#D4B85A]">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          {event.profilePdf && (
            <a href={event.profilePdf} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 bg-gradient-to-r from-[#D4B85A] to-[#987012] text-white font-bold rounded-xl text-center text-sm hover:shadow-lg hover:shadow-[#987012]/20 transition-all">
              {lang === 'ar' ? 'الملف التعريفي' : 'View Profile'}
            </a>
          )}
          {event.bookingLink && (
            <Link href={event.bookingLink} className="flex-1 py-2.5 bg-gradient-to-r from-[#987012] to-[#7A5A0E] text-white font-bold rounded-xl text-center text-sm hover:shadow-lg hover:shadow-[#987012]/20 transition-all">
              {lang === 'ar' ? 'احجز وحدتك' : 'Book Your Unit'}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Section ────────────────────────────────────────────
export function BoothsSection() {
  const { language, isRtl } = useLanguageStore();
  const lang = language as 'ar' | 'en';
  const { data, isLoading } = useUnits();
  const units = data?.data ?? [];

  if (isLoading) return <LoadingSkeleton type="card" count={4} />;

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Section: Available Spaces */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
      >
        {lang === 'ar' ? 'المواقع التجارية المتاحة' : 'Available Commercial Spaces'}
      </motion.h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {lang === 'ar' ? 'استعرض الفعاليات الحقيقية واحجز وحدتك في أفضل المواقع التجارية' : 'Browse live events and book your unit in the best commercial locations'}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {merchantEventSpaces.map((event) => (
          <MerchantSpaceCard key={event.id} event={event} lang={lang} isRtl={isRtl} />
        ))}
      </div>

      {/* Section: My Booked Units */}
      {units.length > 0 && (
        <>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-gray-900 dark:text-white mb-4 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            {lang === 'ar' ? 'وحداتي المحجوزة' : 'My Booked Units'}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {units.map((unit) => (
              <BoothCard key={unit.id} unit={unit} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
