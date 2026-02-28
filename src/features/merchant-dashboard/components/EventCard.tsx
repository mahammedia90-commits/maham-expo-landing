'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import type { MerchantEvent, EventType } from '@/shared/types';

interface EventCardProps {
  event: MerchantEvent;
}

const typeColors: Record<EventType, string> = {
  exhibition: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  conference: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  entertainment: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  cultural: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  sports: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  technology: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
};

const typeIcons: Record<EventType, string> = {
  exhibition: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  conference: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  entertainment: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  cultural: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  sports: 'M13 10V3L4 14h7v7l9-11h-7z',
  technology: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
};

const gradientColors: Record<EventType, string> = {
  exhibition: 'from-purple-500/20 to-indigo-500/20 dark:from-purple-500/10 dark:to-indigo-500/10',
  conference: 'from-indigo-500/20 to-blue-500/20 dark:from-indigo-500/10 dark:to-blue-500/10',
  entertainment: 'from-pink-500/20 to-rose-500/20 dark:from-pink-500/10 dark:to-rose-500/10',
  cultural: 'from-amber-500/20 to-orange-500/20 dark:from-amber-500/10 dark:to-orange-500/10',
  sports: 'from-emerald-500/20 to-green-500/20 dark:from-emerald-500/10 dark:to-green-500/10',
  technology: 'from-cyan-500/20 to-blue-500/20 dark:from-cyan-500/10 dark:to-blue-500/10',
};

const iconColors: Record<EventType, string> = {
  exhibition: 'text-purple-400/60 dark:text-purple-400/30',
  conference: 'text-indigo-400/60 dark:text-indigo-400/30',
  entertainment: 'text-pink-400/60 dark:text-pink-400/30',
  cultural: 'text-amber-400/60 dark:text-amber-400/30',
  sports: 'text-emerald-400/60 dark:text-emerald-400/30',
  technology: 'text-cyan-400/60 dark:text-cyan-400/30',
};

export function EventCard({ event }: EventCardProps) {
  const { t } = useLanguageStore();

  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    ended: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
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

  const eventType = event.type || 'exhibition';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-[#D4B85A]/30 dark:hover:border-[#D4B85A]/20 transition-all duration-300 group"
    >
      {/* Image placeholder with type-specific gradient */}
      <div className={`h-44 bg-gradient-to-br ${gradientColors[eventType]} flex items-center justify-center relative overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-current blur-2xl" />
          <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-current blur-xl" />
        </div>

        <svg className={`w-16 h-16 ${iconColors[eventType]} group-hover:scale-110 transition-transform duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={typeIcons[eventType]} />
        </svg>

        {/* Status badge */}
        <span className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm ${statusColors[event.status]}`}>
          {statusLabels[event.status]}
        </span>

        {/* Type badge */}
        <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm ${typeColors[eventType]}`}>
          {typeLabels[eventType]}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-1 group-hover:text-[#987012] dark:group-hover:text-[#D4B85A] transition-colors">
          {event.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">{event.description}</p>

        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 shrink-0 text-[#987012]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.location}</span>
          </div>
          {event.city && (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4 shrink-0 text-[#987012]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{event.city}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 shrink-0 text-[#987012]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span dir="ltr">{new Date(event.startDate).toLocaleDateString('ar-SA')} - {new Date(event.endDate).toLocaleDateString('ar-SA')}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {t.dashboard.availableBooths}: <span className="font-semibold text-gray-900 dark:text-white">{event.availableBooths}/{event.totalBooths}</span>
          </span>
          {event.status !== 'ended' && (
            <button className="text-xs font-medium text-[#987012] dark:text-[#D4B85A] hover:underline">
              {t.dashboard.viewDetails}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
