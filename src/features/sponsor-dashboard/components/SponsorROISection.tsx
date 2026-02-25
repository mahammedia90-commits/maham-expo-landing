'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useSponsorROI } from '../hooks/useSponsorData';
import { EmptyState } from '@/features/merchant-dashboard/components/EmptyState';
import { LoadingSkeleton } from '@/features/merchant-dashboard/components/LoadingSkeleton';
import type { SponsorROIReport } from '@/shared/types';

function ROICard({ report }: { report: SponsorROIReport }) {
  const { t } = useLanguageStore();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#987012] to-[#D4B85A] p-4">
        <h3 className="font-bold text-white text-lg">{report.eventName}</h3>
        <p className="text-white/80 text-sm">{report.period}</p>
      </div>

      {/* Stats grid */}
      <div className="p-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.sponsorDashboard.totalVisitors}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{report.totalVisitors.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.sponsorDashboard.leadsGeneratedLabel}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{report.leadsGenerated.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.sponsorDashboard.boothScans}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{report.boothScans.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.sponsorDashboard.avgDuration}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{report.avgVisitorDuration}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.sponsorDashboard.conversionRate}</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">{report.conversionRate}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.sponsorDashboard.mediaValue}</p>
          <p className="text-xl font-bold text-[#987012] dark:text-[#D4B85A]">{report.mediaValueEquivalent.toLocaleString()} <span className="text-xs font-normal">{t.sponsorDashboard.sar}</span></p>
        </div>
      </div>
    </div>
  );
}

export function SponsorROISection() {
  const { t } = useLanguageStore();
  const { data, isLoading } = useSponsorROI();
  const reports = data?.data ?? [];

  if (isLoading) return <LoadingSkeleton type="card" count={2} />;

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {t.sponsorDashboard.roiTitle}
      </motion.h1>

      {reports.length === 0 ? (
        <EmptyState
          icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          title={t.sponsorDashboard.roiEmpty}
          description={t.sponsorDashboard.roiEmptyDesc}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ROICard report={report} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
