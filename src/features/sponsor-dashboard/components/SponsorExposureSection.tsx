'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useSponsorExposure } from '../hooks/useSponsorData';
import { EmptyState } from '@/features/merchant-dashboard/components/EmptyState';
import { LoadingSkeleton } from '@/features/merchant-dashboard/components/LoadingSkeleton';
import type { SponsorExposure } from '@/shared/types';

const typeIcons: Record<string, string> = {
  screen: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  ticket: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
  app: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
  website: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
  email: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  push_notification: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
};

function ExposureCard({ exposure }: { exposure: SponsorExposure }) {
  const { t } = useLanguageStore();

  const statusMap: Record<string, { label: string; color: string }> = {
    active: { label: t.sponsorDashboard.active, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
    scheduled: { label: t.sponsorDashboard.scheduled, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
    completed: { label: t.sponsorDashboard.completed, color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400' },
  };

  const { label, color } = statusMap[exposure.status] || statusMap.active;
  const icon = typeIcons[exposure.type] || typeIcons.screen;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#987012]/10 dark:bg-[#D4B85A]/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#987012] dark:text-[#D4B85A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">{exposure.channel}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(exposure.date).toLocaleDateString()}</p>
          </div>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>{label}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.sponsorDashboard.impressions}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{exposure.impressions.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.sponsorDashboard.clicks}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{exposure.clicks.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export function SponsorExposureSection() {
  const { t } = useLanguageStore();
  const { data, isLoading } = useSponsorExposure();
  const exposures = data?.data ?? [];

  if (isLoading) return <LoadingSkeleton type="card" count={6} />;

  // Calculate totals
  const totalImpressions = exposures.reduce((sum, e) => sum + e.impressions, 0);
  const totalClicks = exposures.reduce((sum, e) => sum + e.clicks, 0);

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {t.sponsorDashboard.exposureTitle}
      </motion.h1>

      {exposures.length === 0 ? (
        <EmptyState
          icon="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          title={t.sponsorDashboard.exposureEmpty}
          description={t.sponsorDashboard.exposureEmptyDesc}
        />
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.sponsorDashboard.impressions}</p>
              <p className="text-3xl font-bold text-[#987012] dark:text-[#D4B85A] mt-1">{totalImpressions.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.sponsorDashboard.clicks}</p>
              <p className="text-3xl font-bold text-[#987012] dark:text-[#D4B85A] mt-1">{totalClicks.toLocaleString()}</p>
            </div>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exposures.map((exposure, index) => (
              <motion.div
                key={exposure.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ExposureCard exposure={exposure} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
