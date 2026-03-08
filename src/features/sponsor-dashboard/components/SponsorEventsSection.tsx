'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useSponsorEvents } from '../hooks/useSponsorData';
import { EventDetailModal } from '@/features/merchant-dashboard/components/EventDetailModal';
import { LoadingSkeleton } from '@/features/merchant-dashboard/components/LoadingSkeleton';
import type { EventType, MerchantEvent } from '@/shared/types';

function toHijriShort(d: string) { try { return new Date(d).toLocaleDateString('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long' }); } catch { return d; } }
function toHijriYear(d: string) { try { return new Date(d).toLocaleDateString('ar-SA-u-ca-islamic-umalqura', { year: 'numeric' }); } catch { return ''; } }
function fmt12(t: string) { const [h, m] = t.split(':').map(Number); return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${h >= 12 ? 'م' : 'ص'}`; }

type CatKey = 'all' | 'festivals' | 'exhibitions' | 'sports' | 'cultural';
const cats: { key: CatKey; ar: string; en: string; types: EventType[]; d: string }[] = [
  { key: 'all', ar: 'كل الفعاليات', en: 'All', types: [], d: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { key: 'festivals', ar: 'مهرجانات واحتفالات', en: 'Festivals', types: ['entertainment'], d: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
  { key: 'exhibitions', ar: 'معارض ومؤتمرات', en: 'Exhibitions', types: ['exhibition', 'conference', 'technology'], d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { key: 'sports', ar: 'ترفيه ورياضة', en: 'Sports', types: ['sports'], d: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { key: 'cultural', ar: 'ثقافة ومجتمع', en: 'Culture', types: ['cultural'], d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
];

type StatusKey = 'all' | 'active' | 'upcoming' | 'ended';
const statuses: { key: StatusKey; ar: string; en: string; dot: string }[] = [
  { key: 'all', ar: 'الكل', en: 'All', dot: 'bg-gray-400' },
  { key: 'active', ar: 'جارية', en: 'Active', dot: 'bg-emerald-500' },
  { key: 'upcoming', ar: 'قادمة', en: 'Upcoming', dot: 'bg-blue-500' },
  { key: 'ended', ar: 'منتهية', en: 'Ended', dot: 'bg-gray-400' },
];

type CityKey = 'all' | 'riyadh' | 'jeddah' | 'makkah';
const cities: { key: CityKey; ar: string; en: string; match: string[] }[] = [
  { key: 'all', ar: 'كل المدن', en: 'All Cities', match: [] },
  { key: 'riyadh', ar: 'الرياض', en: 'Riyadh', match: ['الرياض'] },
  { key: 'jeddah', ar: 'جدة', en: 'Jeddah', match: ['جدة'] },
  { key: 'makkah', ar: 'مكة المكرمة', en: 'Makkah', match: ['مكة المكرمة', 'مكة'] },
];

function FilterDropdown<T extends string>({ icon, items, value, onChange, en }: { label?: string; icon: React.ReactNode; items: { key: T; ar: string; en: string; dot?: string }[]; value: T; onChange: (v: T) => void; en: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, []);
  const cur = items.find(i => i.key === value);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-200 text-[13px] font-medium ${value !== 'all' ? 'border-[#987012]/30 bg-[#987012]/5 dark:bg-[#987012]/10 text-[#987012] dark:text-[#D4B85A]' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}`}>
        {icon}<span>{en ? cur?.en : cur?.ar}</span>
        <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
      </button>
      <AnimatePresence>{open && (
        <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.15 }} className="absolute top-full mt-2 right-0 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl shadow-black/10 dark:shadow-black/30 border border-gray-100 dark:border-gray-700 py-1.5 min-w-[180px]">
          {items.map(item => (<button key={item.key} onClick={() => { onChange(item.key); setOpen(false); }} className={`flex items-center gap-2.5 w-full text-right px-4 py-2.5 text-[13px] transition-colors ${value === item.key ? 'bg-[#987012]/10 dark:bg-[#987012]/20 text-[#987012] dark:text-[#D4B85A] font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>{item.dot && <span className={`w-2 h-2 rounded-full ${item.dot} shrink-0`} />}<span>{en ? item.en : item.ar}</span></button>))}
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}

function EventCard({ event, onSelect }: { event: MerchantEvent; onSelect: (e: MerchantEvent) => void }) {
  const [err, setErr] = useState(false);
  const src = event.images?.[0] || event.image;
  const ok = src && !err;
  const d1 = toHijriShort(event.startDate), d2 = toHijriShort(event.endDate), yr = toHijriYear(event.endDate);
  let dl = `${d1} - ${d2}`; if (yr) dl += ` ${yr}`;
  let tl = ''; if (event.startTime && event.endTime) tl = `${fmt12(event.startTime)} - ${fmt12(event.endTime)}`;
  const badge = event.status === 'active' ? { l: 'جارية', c: 'bg-emerald-500/90 text-white' } : event.status === 'ended' ? { l: 'منتهية', c: 'bg-gray-500/80 text-white' } : null;
  return (
    <div onClick={() => onSelect(event)} className="relative overflow-hidden rounded-lg cursor-pointer group h-[240px] sm:h-[280px] lg:h-[320px]">
      {ok ? <img src={src!} alt={event.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[600ms] ease-out will-change-transform group-hover:scale-[1.06]" onError={() => setErr(true)} loading="lazy" /> : <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-900 flex items-center justify-center"><svg className="w-14 h-14 text-gray-500/25" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
      {badge && <div className="absolute top-3 left-3"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${badge.c}`}>{badge.l}</span></div>}
      {event.priceType === 'free' && <div className="absolute top-3 right-3"><span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#987012] text-white">مجاني</span></div>}
      <div className="absolute bottom-0 right-0 left-0 p-4 sm:p-5 transition-transform duration-300 group-hover:translate-y-[-2px]">
        <h3 className="font-bold text-white text-sm sm:text-[15px] lg:text-base leading-snug mb-1.5 line-clamp-2">{event.name}</h3>
        <p className="text-white/75 text-[10.5px] sm:text-[11px] leading-relaxed">{dl}{tl && <><span className="text-white/35 mx-1">،</span>{tl}</>}</p>
      </div>
    </div>
  );
}

export function SponsorEventsSection() {
  const { t, language } = useLanguageStore();
  const { data, isLoading } = useSponsorEvents();
  const events = data?.data ?? [];
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState<CatKey>('all');
  const [status, setStatus] = useState<StatusKey>('all');
  const [city, setCity] = useState<CityKey>('all');
  const [free, setFree] = useState(false);
  const [sel, setSel] = useState<MerchantEvent | null>(null);
  const [pg, setPg] = useState(1);
  const pp = 12; const en = language === 'en';

  const list = useMemo(() => {
    const c = cats.find(x => x.key === cat);
    const ci = cities.find(x => x.key === city);
    const q = search.trim().toLowerCase();
    return events.filter(e => {
      if (q && !e.name.toLowerCase().includes(q) && !e.location.toLowerCase().includes(q) && !(e.organizer || '').toLowerCase().includes(q)) return false;
      if (c && c.types.length > 0 && !c.types.includes(e.type)) return false;
      if (status !== 'all' && e.status !== status) return false;
      if (ci && ci.match.length > 0 && !ci.match.some(m => (e.city || '').includes(m))) return false;
      if (free && e.priceType !== 'free') return false;
      return true;
    });
  }, [events, cat, free, search, status, city]);

  useEffect(() => { setPg(1); }, [cat, free, search, status, city]);
  const tp = Math.ceil(list.length / pp);
  const page = list.slice((pg - 1) * pp, pg * pp);
  const activeFilters = (cat !== 'all' ? 1 : 0) + (status !== 'all' ? 1 : 0) + (city !== 'all' ? 1 : 0) + (free ? 1 : 0) + (search ? 1 : 0);
  const clearAll = () => { setSearch(''); setCat('all'); setStatus('all'); setCity('all'); setFree(false); };

  if (isLoading) return <LoadingSkeleton type="card" count={6} />;

  return (
    <div className="min-h-screen" dir="rtl">
      <div className="mb-5 sm:mb-7"><h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-black text-gray-900 dark:text-white text-right leading-tight">{en ? 'Sponsorship Events ' : 'فعاليات الرعاية '}<span className="text-[#987012]">{list.length}</span></h1></div>

      {/* Search & Filters */}
      <div className="mb-6 sm:mb-8 space-y-4">
        <div className="relative">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={en ? 'Search events by name, location, or organizer...' : 'ابحث عن فعالية بالاسم، الموقع، أو المنظم...'} className="w-full pr-12 pl-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#987012]/40 focus:border-[#987012]/50 transition-all duration-200 shadow-sm" />
          {search && <button onClick={() => setSearch('')} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>}
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <FilterDropdown label={en ? 'Status' : 'الحالة'} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} items={statuses} value={status} onChange={setStatus} en={en} />
          <FilterDropdown label={en ? 'City' : 'المدينة'} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} items={cities} value={city} onChange={setCity} en={en} />
          <FilterDropdown label={en ? 'Category' : 'التصنيف'} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} items={cats.map(c => ({ key: c.key, ar: c.ar, en: c.en }))} value={cat} onChange={setCat} en={en} />
          <button onClick={() => setFree(!free)} className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-200 text-[13px] font-medium ${free ? 'border-[#987012]/30 bg-[#987012]/5 dark:bg-[#987012]/10 text-[#987012] dark:text-[#D4B85A]' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
            <span>{en ? 'Free' : 'مجاني'}</span>{free && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
          </button>
          {activeFilters > 0 && <button onClick={clearAll} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-[#987012] dark:text-[#D4B85A] hover:bg-[#987012]/5 dark:hover:bg-[#987012]/10 transition-colors"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg><span>{en ? `Clear all (${activeFilters})` : `مسح الكل (${activeFilters})`}</span></button>}
        </div>
        {activeFilters > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {search && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#987012]/8 dark:bg-[#987012]/15 text-[#987012] dark:text-[#D4B85A] text-[11px] font-semibold"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>&ldquo;{search}&rdquo;<button onClick={() => setSearch('')}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button></span>}
            {status !== 'all' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#987012]/8 dark:bg-[#987012]/15 text-[#987012] dark:text-[#D4B85A] text-[11px] font-semibold"><span className={`w-1.5 h-1.5 rounded-full ${statuses.find(s => s.key === status)?.dot}`} />{en ? statuses.find(s => s.key === status)?.en : statuses.find(s => s.key === status)?.ar}<button onClick={() => setStatus('all')}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button></span>}
            {city !== 'all' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#987012]/8 dark:bg-[#987012]/15 text-[#987012] dark:text-[#D4B85A] text-[11px] font-semibold"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>{en ? cities.find(c => c.key === city)?.en : cities.find(c => c.key === city)?.ar}<button onClick={() => setCity('all')}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button></span>}
            {cat !== 'all' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#987012]/8 dark:bg-[#987012]/15 text-[#987012] dark:text-[#D4B85A] text-[11px] font-semibold">{en ? cats.find(c => c.key === cat)?.en : cats.find(c => c.key === cat)?.ar}<button onClick={() => setCat('all')}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button></span>}
            {free && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#987012]/8 dark:bg-[#987012]/15 text-[#987012] dark:text-[#D4B85A] text-[11px] font-semibold">{en ? 'Free' : 'مجاني'}<button onClick={() => setFree(false)}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button></span>}
          </div>
        )}
      </div>

      <div className="flex gap-0">
        <div className="flex-1 min-w-0">
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4"><svg className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{en ? 'No events found' : 'لا توجد فعاليات'}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{en ? 'Try adjusting your search or filters' : 'حاول تعديل البحث أو الفلاتر'}</p>
              <button onClick={clearAll} className="px-4 py-2 rounded-xl bg-[#987012] text-white text-sm font-medium hover:bg-[#87630f] transition-colors">{en ? 'Clear all filters' : 'مسح جميع الفلاتر'}</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">{page.map((ev, i) => (<motion.div key={ev.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: i * 0.03 }}><EventCard event={ev} onSelect={setSel} /></motion.div>))}</div>
              {tp > 1 && (<div className="flex items-center justify-center gap-1 mt-8 sm:mt-10" dir="ltr"><button onClick={() => { setPg(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} disabled={pg === 1} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></button>{Array.from({ length: tp }, (_, i) => i + 1).map(p => (<button key={p} onClick={() => { setPg(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`w-9 h-9 rounded-lg text-xs font-bold transition-all duration-200 ${p === pg ? 'bg-[#987012] text-white shadow-md shadow-[#987012]/30 scale-105' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700'}`}>{p}</button>))}<button onClick={() => { setPg(p => Math.min(tp, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} disabled={pg === tp} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg></button></div>)}
            </>
          )}
        </div>
        <div className="hidden xl:flex flex-col items-center gap-0.5 w-20 shrink-0 mr-4 sticky top-20 self-start bg-gray-100/80 dark:bg-gray-800/60 rounded-2xl py-2 px-1">
          {cats.map(c => { const on = cat === c.key; return (<button key={c.key} onClick={() => setCat(c.key)} className={`flex flex-col items-center gap-1.5 w-full py-3.5 px-1.5 rounded-xl transition-all duration-200 ${on ? 'bg-[#987012]/10 dark:bg-[#987012]/15' : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'}`}><div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${on ? 'bg-[#987012] text-white shadow-md shadow-[#987012]/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={c.d} /></svg></div><span className={`text-[10px] sm:text-[11px] leading-tight text-center font-semibold transition-colors max-w-full ${on ? 'text-[#987012] dark:text-[#D4B85A]' : 'text-gray-400 dark:text-gray-500'}`}>{en ? c.en : c.ar}</span></button>); })}
        </div>
      </div>
      {sel && <EventDetailModal event={sel} onClose={() => setSel(null)} variant="sponsor" />}
    </div>
  );
}
