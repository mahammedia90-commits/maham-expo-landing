'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import type { MerchantEvent } from '@/shared/types';

interface EventCardProps {
  event: MerchantEvent;
}

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Image placeholder */}
      <div className="h-40 bg-gradient-to-br from-[#987012]/20 to-[#D4B85A]/20 dark:from-[#987012]/10 dark:to-[#D4B85A]/10 flex items-center justify-center relative">
        <svg className="w-14 h-14 text-[#987012]/40 dark:text-[#D4B85A]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[event.status]}`}>
          {statusLabels[event.status]}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">{event.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{event.description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location}
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span dir="ltr">{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {t.dashboard.availableBooths}: <span className="font-semibold text-gray-900 dark:text-white">{event.availableBooths}/{event.totalBooths}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
