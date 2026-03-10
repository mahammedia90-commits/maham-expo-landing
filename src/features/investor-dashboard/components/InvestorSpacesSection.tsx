'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { LoadingSkeleton } from '@/features/merchant-dashboard/components/LoadingSkeleton';

// ── Real Event Spaces Data ──────────────────────────────────
const realEventSpaces = [
  {
    id: 'ala-khutah',
    name: { ar: 'فعالية على خطاه', en: 'Ala Khutah Event' },
    description: {
      ar: 'رحلة إيمانية من مكة المكرمة إلى المدينة المنورة عبر 8 مناطق استراتيجية مع فرص استثمارية في المطاعم والتجزئة',
      en: 'A spiritual journey from Makkah to Madinah across 8 strategic zones with investment opportunities in food & retail',
    },
    location: { ar: 'من مكة المكرمة إلى المدينة المنورة', en: 'From Makkah to Madinah' },
    image: '/ala-khutah.png',
    profilePdf: '/Alla Khotah.pdf',
    totalSpaces: 100,
    bookedSpaces: 34,
    monthlyRevenue: 450000,
    totalRevenue: 2700000,
    rating: 4.9,
    status: 'active' as const,
    zones: [
      { name: { ar: 'الجحفة', en: 'Al-Juhfah' }, spaces: 15, booked: 6, priceRange: { ar: '٤,٠٠٠ - ٨,٠٠٠ ريال', en: '4,000 - 8,000 SAR' } },
      { name: { ar: 'الريم', en: 'Al-Reem' }, spaces: 12, booked: 5, priceRange: { ar: '٥,٠٠٠ - ١٠,٠٠٠ ريال', en: '5,000 - 10,000 SAR' } },
      { name: { ar: 'العرج', en: 'Al-Araj' }, spaces: 14, booked: 4, priceRange: { ar: '٤,٠٠٠ - ٧,٠٠٠ ريال', en: '4,000 - 7,000 SAR' } },
      { name: { ar: 'القاهة', en: 'Al-Qahah' }, spaces: 10, booked: 3, priceRange: { ar: '٣,٥٠٠ - ٦,٠٠٠ ريال', en: '3,500 - 6,000 SAR' } },
      { name: { ar: 'غار ثور', en: 'Ghar Thawr' }, spaces: 13, booked: 5, priceRange: { ar: '٥,٠٠٠ - ٩,٠٠٠ ريال', en: '5,000 - 9,000 SAR' } },
      { name: { ar: 'الجثاثة', en: 'Al-Juthathah' }, spaces: 12, booked: 4, priceRange: { ar: '٤,٠٠٠ - ٧,٥٠٠ ريال', en: '4,000 - 7,500 SAR' } },
      { name: { ar: 'أسفل عسفان', en: 'Asfal Usfan' }, spaces: 12, booked: 4, priceRange: { ar: '٣,٥٠٠ - ٦,٥٠٠ ريال', en: '3,500 - 6,500 SAR' } },
      { name: { ar: 'أم معبد', en: 'Um Maabad' }, spaces: 12, booked: 3, priceRange: { ar: '٤,٥٠٠ - ٨,٠٠٠ ريال', en: '4,500 - 8,000 SAR' } },
    ],
    amenities: { ar: ['كهرباء', 'مياه', 'إنارة', 'أمن 24/7', 'مواقف', 'نظافة'], en: ['Electricity', 'Water', 'Lighting', '24/7 Security', 'Parking', 'Cleaning'] },
    spaceTypes: { ar: ['مطاعم', 'تجزئة', 'خدمات', 'ترفيه'], en: ['Restaurants', 'Retail', 'Services', 'Entertainment'] },
  },
  {
    id: 'blvd-world',
    name: { ar: 'بوليفارد وورلد', en: 'Boulevard World' },
    description: {
      ar: 'وجهة ترفيهية عالمية في قلب الرياض تضم مساحات تجارية متنوعة في بيئة ترفيهية فريدة',
      en: 'A world-class entertainment destination in Riyadh featuring diverse commercial spaces in a unique setting',
    },
    location: { ar: 'الرياض، المملكة العربية السعودية', en: 'Riyadh, Saudi Arabia' },
    image: '/blvd.png',
    profilePdf: '/BLVD Available Sites.pdf',
    totalSpaces: 234,
    bookedSpaces: 156,
    monthlyRevenue: 890000,
    totalRevenue: 5340000,
    rating: 4.8,
    status: 'active' as const,
    zones: [
      { name: { ar: 'المنطقة الأمريكية', en: 'American Zone' }, spaces: 35, booked: 28, priceRange: { ar: '٢,٥٠٠ - ١٢,٠٠٠ ريال', en: '2,500 - 12,000 SAR' } },
      { name: { ar: 'المنطقة الآسيوية', en: 'Asian Zone' }, spaces: 40, booked: 30, priceRange: { ar: '٢,٥٠٠ - ١٠,٠٠٠ ريال', en: '2,500 - 10,000 SAR' } },
      { name: { ar: 'المنطقة الأوروبية', en: 'European Zone' }, spaces: 38, booked: 25, priceRange: { ar: '٣,٠٠٠ - ١٥,٠٠٠ ريال', en: '3,000 - 15,000 SAR' } },
      { name: { ar: 'المنطقة العربية', en: 'Arabian Zone' }, spaces: 45, booked: 32, priceRange: { ar: '٢,٥٠٠ - ٨,٠٠٠ ريال', en: '2,500 - 8,000 SAR' } },
      { name: { ar: 'منطقة الترفيه', en: 'Entertainment Zone' }, spaces: 30, booked: 18, priceRange: { ar: '٥,٠٠٠ - ٢٠,٠٠٠ ريال', en: '5,000 - 20,000 SAR' } },
      { name: { ar: 'الساحة الرئيسية', en: 'Main Plaza' }, spaces: 46, booked: 23, priceRange: { ar: '٤,٠٠٠ - ١٨,٠٠٠ ريال', en: '4,000 - 18,000 SAR' } },
    ],
    amenities: { ar: ['تكييف مركزي', 'إنترنت عالي السرعة', 'شاشات عرض', 'أمن', 'مواقف VIP', 'نظافة', 'كهرباء صناعية'], en: ['Central AC', 'High-speed WiFi', 'Display Screens', 'Security', 'VIP Parking', 'Cleaning', 'Industrial Power'] },
    spaceTypes: { ar: ['مطاعم', 'تجزئة', 'ترفيه', 'خدمات', 'معارض'], en: ['Restaurants', 'Retail', 'Entertainment', 'Services', 'Exhibitions'] },
  },
];

// ── Investor Space Card ─────────────────────────────────────
function InvestorSpaceCard({ event, lang, isRtl }: { event: typeof realEventSpaces[0]; lang: 'ar' | 'en'; isRtl: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const occupancy = Math.round((event.bookedSpaces / event.totalSpaces) * 100);

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
          <span className="px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg">
            {lang === 'ar' ? 'نشط' : 'Active'}
          </span>
        </div>
        <div className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2.5 py-1 rounded-lg`}>
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{event.rating}</span>
        </div>
        <div className="absolute bottom-3 right-3 left-3">
          <h3 className="text-xl font-black text-white mb-0.5">{event.name[lang]}</h3>
          <div className="flex items-center gap-1.5 text-white/80 text-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span>{event.location[lang]}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-5">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{event.description[lang]}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gradient-to-br from-[#987012]/5 to-[#D4B85A]/5 dark:from-[#987012]/10 dark:to-[#D4B85A]/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-[#987012] dark:text-[#D4B85A]">{event.totalSpaces}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{lang === 'ar' ? 'إجمالي المواقع' : 'Total Spaces'}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/10 dark:to-green-800/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-green-600 dark:text-green-400">{event.bookedSpaces}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{lang === 'ar' ? 'محجوزة' : 'Booked'}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-800/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{event.monthlyRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{lang === 'ar' ? 'إيراد شهري (ر.س)' : 'Monthly (SAR)'}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/10 dark:to-purple-800/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{(event.totalRevenue / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</p>
          </div>
        </div>

        {/* Occupancy Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-gray-600 dark:text-gray-400">{lang === 'ar' ? 'نسبة الإشغال' : 'Occupancy Rate'}</span>
            <span className="font-bold text-[#987012] dark:text-[#D4B85A]">{occupancy}%</span>
          </div>
          <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${occupancy}%` }} transition={{ duration: 1, delay: 0.3 }} className="h-full rounded-full bg-gradient-to-r from-[#987012] to-[#D4B85A]" />
          </div>
        </div>

        {/* Space Types */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {event.spaceTypes[lang].map((type) => (
            <span key={type} className="text-xs px-2.5 py-1 rounded-lg bg-[#987012]/10 text-[#987012] dark:text-[#D4B85A] font-medium">{type}</span>
          ))}
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
          <span>{lang === 'ar' ? (expanded ? 'إخفاء المناطق' : `عرض المناطق (${event.zones.length})`) : (expanded ? 'Hide Zones' : `View Zones (${event.zones.length})`)}</span>
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
                {event.zones.map((zone) => {
                  const zoneOccupancy = Math.round((zone.booked / zone.spaces) * 100);
                  return (
                    <div key={zone.name[lang]} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{zone.name[lang]}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{zone.booked}/{zone.spaces} {lang === 'ar' ? 'محجوزة' : 'booked'}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mb-1.5">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#987012] to-[#D4B85A]" style={{ width: `${zoneOccupancy}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{zone.priceRange[lang]}</p>
                    </div>
                  );
                })}
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
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Section ────────────────────────────────────────────
export function InvestorSpacesSection() {
  const { language, isRtl } = useLanguageStore();
  const lang = language as 'ar' | 'en';
  const [isLoading] = useState(false);

  if (isLoading) return <LoadingSkeleton type="card" count={2} />;

  // Summary stats
  const totalSpaces = realEventSpaces.reduce((s, e) => s + e.totalSpaces, 0);
  const totalBooked = realEventSpaces.reduce((s, e) => s + e.bookedSpaces, 0);
  const totalMonthlyRevenue = realEventSpaces.reduce((s, e) => s + e.monthlyRevenue, 0);
  const avgOccupancy = Math.round((totalBooked / totalSpaces) * 100);

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
      >
        {lang === 'ar' ? 'المواقع التجارية' : 'Commercial Spaces'}
      </motion.h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {lang === 'ar' ? 'إدارة ومتابعة مواقعك الاستثمارية والمساحات التجارية' : 'Manage and monitor your investment sites and commercial spaces'}
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
          <p className="text-2xl font-black text-[#987012] dark:text-[#D4B85A]">{totalSpaces}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{lang === 'ar' ? 'إجمالي المواقع' : 'Total Spaces'}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
          <p className="text-2xl font-black text-green-600 dark:text-green-400">{totalBooked}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{lang === 'ar' ? 'محجوزة' : 'Booked'}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{avgOccupancy}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{lang === 'ar' ? 'نسبة الإشغال' : 'Occupancy'}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{(totalMonthlyRevenue / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{lang === 'ar' ? 'إيراد شهري (ر.س)' : 'Monthly (SAR)'}</p>
        </div>
      </div>

      {/* Event Spaces */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {realEventSpaces.map((event) => (
          <InvestorSpaceCard key={event.id} event={event} lang={lang} isRtl={isRtl} />
        ))}
      </div>
    </div>
  );
}
