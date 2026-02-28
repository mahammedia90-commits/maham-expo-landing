'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useAnalytics } from '../hooks/useMerchantData';
import { LoadingSkeleton } from './LoadingSkeleton';
import { AnalyticsSummaryCards } from './AnalyticsSummaryCards';
import { CSSBarChart } from './CSSBarChart';
import { CSSComparisonChart } from './CSSComparisonChart';
import { CSSHorizontalBar } from './CSSHorizontalBar';

export function AnalyticsSection() {
  const { t } = useLanguageStore();
  const { data, isLoading } = useAnalytics();
  const analytics = data?.data;

  if (isLoading) return <LoadingSkeleton type="stat" count={4} />;
  if (!analytics) return null;

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {t.dashboard.analytics}
      </motion.h1>

      {/* Summary Cards */}
      <div className="mb-6">
        <AnalyticsSummaryCards {...analytics.summary} />
      </div>

      {/* Sales + Visitors Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <CSSBarChart
            title={t.dashboard.salesOverview}
            data={analytics.salesByMonth.map((d) => ({ label: d.month, value: d.amount }))}
            suffix={` ${t.dashboard.sar}`}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <CSSBarChart
            title={t.dashboard.visitorStats}
            data={analytics.visitorsByDay.map((d) => ({ label: d.day, value: d.count }))}
            barColor="#3B82F6"
          />
        </motion.div>
      </div>

      {/* Revenue vs Goals */}
      <div className="mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <CSSComparisonChart
            title={t.dashboard.revenueVsGoals}
            data={analytics.revenueVsGoal.map((d) => ({ label: d.month, actual: d.actual, goal: d.goal }))}
          />
        </motion.div>
      </div>

      {/* Top Booths + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t.dashboard.topBoothsPerformance}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-start py-2 text-gray-500 dark:text-gray-400 font-medium">{t.dashboard.booths}</th>
                    <th className="text-start py-2 text-gray-500 dark:text-gray-400 font-medium">{t.dashboard.revenue}</th>
                    <th className="text-start py-2 text-gray-500 dark:text-gray-400 font-medium">{t.dashboard.visitors}</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topBooths.map((booth, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-750 last:border-0">
                      <td className="py-2.5 text-gray-900 dark:text-white font-medium">{booth.name}</td>
                      <td className="py-2.5 text-[#987012] dark:text-[#D4B85A] font-semibold">
                        {booth.revenue.toLocaleString()} {t.dashboard.sar}
                      </td>
                      <td className="py-2.5 text-gray-600 dark:text-gray-400">{booth.visitors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <CSSHorizontalBar
            title={t.dashboard.categoryBreakdown}
            data={analytics.categoryBreakdown.map((c) => ({
              label: c.category,
              percentage: c.percentage,
              color: c.color,
            }))}
          />
        </motion.div>
      </div>
    </div>
  );
}
