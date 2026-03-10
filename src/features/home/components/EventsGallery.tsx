'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { fadeInUp, viewportSettings } from '@/shared/utils/animations';

// ── Featured real events (على خطاه + بوليفارد وورلد) ────────
const featuredEvents = [
  {
    id: 'ala-khutah',
    title: { ar: 'على خطاه', en: 'Ala Khutah' },
    location: { ar: 'من مكة المكرمة إلى المدينة المنورة', en: 'From Makkah to Madinah' },
    spaces: { available: 100, total: 100 },
    image: '/ala-khutah.png',
    price: { ar: 'يبدأ من ٤,٠٠٠ ريال', en: 'From 4,000 SAR' },
    profilePdf: '/Alla Khotah.pdf',
    bookingLink: '/ala-khutah',
    badge: { ar: 'فعالية حقيقية', en: 'Live Event' },
  },
  {
    id: 'blvd-world',
    title: { ar: 'بوليفارد وورلد', en: 'Boulevard World' },
    location: { ar: 'الرياض، المملكة العربية السعودية', en: 'Riyadh, Saudi Arabia' },
    spaces: { available: 234, total: 234 },
    image: '/blvd.png',
    price: { ar: 'يبدأ من ٢,٥٠٠ ريال', en: 'From 2,500 SAR' },
    profilePdf: '/BLVD Available Sites.pdf',
    badge: { ar: 'فعالية حقيقية', en: 'Live Event' },
  },
];

// ── Featured Card ───────────────────────────────────────────
function FeaturedCard({ event, lang, isRtl }: { event: typeof featuredEvents[0]; lang: 'ar' | 'en'; isRtl: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="group relative rounded-3xl overflow-hidden bg-white dark:bg-[#1F1A12] border border-[#987012]/15 dark:border-[#987012]/25 shadow-xl hover:shadow-2xl hover:shadow-[#987012]/15 transition-all duration-500"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={event.image} alt={event.title[lang]} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'}`}>
          <span className="px-4 py-2 bg-gradient-to-r from-[#987012] to-[#D4B85A] text-white rounded-full text-xs font-bold shadow-lg">{event.badge[lang]}</span>
        </div>
        <div className={`absolute bottom-4 ${isRtl ? 'left-4' : 'right-4'}`}>
          <span className="px-4 py-2 bg-white/90 dark:bg-[#2A2313]/90 backdrop-blur-sm text-[#987012] rounded-xl text-sm font-bold shadow-lg">{event.price[lang]}</span>
        </div>
        <div className="absolute bottom-4 right-4 left-4">
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-1">{event.title[lang]}</h3>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="w-8 h-8 rounded-lg bg-[#987012]/10 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#987012]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <span>{event.location[lang]}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">{lang === 'ar' ? 'المساحات المتاحة' : 'Available Spaces'}</span>
          <span className="font-bold text-[#987012]">{event.spaces.available} / {event.spaces.total}</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="h-full rounded-full bg-gradient-to-r from-[#987012] to-[#D4B85A]" />
        </div>

        <div className="flex gap-3 pt-2">
          {event.profilePdf && (
            <a href={event.profilePdf} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-gradient-to-r from-[#D4B85A] to-[#987012] text-white font-bold rounded-xl text-center text-sm hover:shadow-lg hover:shadow-[#987012]/20 transition-all">
              {lang === 'ar' ? 'الملف التعريفي' : 'View Profile'}
            </a>
          )}
          {event.bookingLink && (
            <Link href={event.bookingLink} className="flex-1 py-3 bg-gradient-to-r from-[#987012] to-[#7A5A0E] text-white font-bold rounded-xl text-center text-sm hover:shadow-lg hover:shadow-[#987012]/20 transition-all">
              {lang === 'ar' ? 'احجز وحدتك' : 'Book Your Unit'}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ──────────────────────────────────────────
export function EventsGallery() {
  const { isRtl, language } = useLanguageStore();
  const lang = language as 'ar' | 'en';
  const en = lang === 'en';

  return (
    <section dir={isRtl ? 'rtl' : 'ltr'} className="py-20 md:py-28 bg-gradient-to-b from-[#FFFDF9] via-[#FBF8F0] to-[#F5ECD4] dark:from-[#1A1610] dark:via-[#1F1A12] dark:to-[#2A2313] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#987012]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#D4B85A]/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportSettings} variants={fadeInUp} className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#987012]/10 to-[#D4B85A]/10 text-[#987012] dark:text-[#D4B85A] rounded-full text-sm font-bold mb-6 border border-[#987012]/20">
            <span className="text-lg">⭐</span>
            {en ? 'Live Events — Book Now' : 'فعاليات حقيقية — احجز الآن'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#2A2313] dark:text-white">
            {en ? 'Featured ' : 'الفعاليات '}
            <span className="bg-gradient-to-r from-[#987012] to-[#D4B85A] bg-clip-text text-transparent">{en ? 'Events' : 'المميزة'}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {featuredEvents.map(e => <FeaturedCard key={e.id} event={e} lang={lang} isRtl={isRtl} />)}
        </div>
      </div>
    </section>
  );
}
