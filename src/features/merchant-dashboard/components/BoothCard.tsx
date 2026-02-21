'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import type { Booth } from '@/shared/types';

interface BoothCardProps {
  booth: Booth;
}

export function BoothCard({ booth }: BoothCardProps) {
  const { t } = useLanguageStore();

  const statusColors = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    expired: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const typeLabels = {
    food: t.dashboard.food,
    retail: t.dashboard.retail,
    services: t.dashboard.services,
    other: t.dashboard.other,
  };

  const statusLabels = {
    active: t.dashboard.active,
    pending: t.dashboard.pending,
    expired: t.dashboard.expired,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Image placeholder */}
      <div className="h-36 bg-gradient-to-br from-[#987012]/20 to-[#D4B85A]/20 dark:from-[#987012]/10 dark:to-[#D4B85A]/10 flex items-center justify-center">
        <svg className="w-12 h-12 text-[#987012]/40 dark:text-[#D4B85A]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">{booth.name}</h3>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[booth.status]}`}>
            {statusLabels[booth.status]}
          </span>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{booth.eventName}</p>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t.dashboard.zone}</span>
            <span className="text-gray-900 dark:text-white font-medium">{booth.zone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t.dashboard.size}</span>
            <span className="text-gray-900 dark:text-white font-medium">{booth.size}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t.dashboard.type}</span>
            <span className="text-gray-900 dark:text-white font-medium">{typeLabels[booth.type]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t.dashboard.period}</span>
            <span className="text-gray-900 dark:text-white font-medium text-xs" dir="ltr">
              {new Date(booth.startDate).toLocaleDateString()} - {new Date(booth.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <span className="text-lg font-bold text-[#987012] dark:text-[#D4B85A]">
            {booth.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.sar}</span>
        </div>
      </div>
    </motion.div>
  );
}
