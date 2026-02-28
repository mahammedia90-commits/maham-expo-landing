'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useInvestorRevenue } from '../hooks/useInvestorData';
import { EmptyState } from '@/features/merchant-dashboard/components/EmptyState';
import { LoadingSkeleton } from '@/features/merchant-dashboard/components/LoadingSkeleton';

export function InvestorRevenueSection() {
  const { t } = useLanguageStore();
  const { data, isLoading } = useInvestorRevenue();
  const revenue = data?.data ?? [];

  if (isLoading) return <LoadingSkeleton type="stat" count={3} />;

  const totalRevenue = revenue.reduce((sum, r) => sum + r.amount, 0);
  const totalBookings = revenue.reduce((sum, r) => sum + r.bookingsCount, 0);
  const avgMonthly = revenue.length > 0 ? Math.round(totalRevenue / revenue.length) : 0;
  const maxAmount = Math.max(...revenue.map(r => r.amount), 1);

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {t.investorDashboard.revenueTitle}
      </motion.h1>

      {revenue.length === 0 ? (
        <EmptyState
          icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          title={t.investorDashboard.revenueEmpty}
          description={t.investorDashboard.revenueEmptyDesc}
        />
      ) : (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.investorDashboard.totalRevenue}</p>
              <p className="text-2xl font-bold text-[#987012] dark:text-[#D4B85A]">{totalRevenue.toLocaleString()} <span className="text-sm">{t.investorDashboard.sar}</span></p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.investorDashboard.monthlyRevenue}</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{avgMonthly.toLocaleString()} <span className="text-sm">{t.investorDashboard.sar}</span></p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.investorDashboard.bookingsCount}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalBookings}</p>
            </motion.div>
          </div>

          {/* Monthly breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t.investorDashboard.monthlyBreakdown}</h3>
            <div className="space-y-3">
              {revenue.map((r) => (
                <div key={r.id} className="flex items-center gap-4">
                  <div className="w-28 text-sm text-gray-600 dark:text-gray-400 shrink-0">{r.month}</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-[#987012] to-[#D4B85A] h-4 rounded-full transition-all"
                        style={{ width: `${(r.amount / maxAmount) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-28 text-sm font-medium text-gray-900 dark:text-white text-left shrink-0">{r.amount.toLocaleString()} {t.investorDashboard.sar}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
