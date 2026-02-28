'use client';

import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { MiniBarChart } from './MiniBarChart';
import type { RevenueSummary } from '@/shared/types';

interface RevenueCardProps {
  revenue: RevenueSummary;
}

export function RevenueCard({ revenue }: RevenueCardProps) {
  const { t } = useLanguageStore();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {t.dashboard.revenueSummary}
      </h3>
      <p className="text-2xl font-bold text-[#987012] dark:text-[#D4B85A] mb-4">
        {revenue.totalRevenue.toLocaleString()} <span className="text-sm font-normal">{t.dashboard.sar}</span>
      </p>

      <MiniBarChart
        data={revenue.monthlyData.map((m) => ({ label: m.month, value: m.amount }))}
        height={100}
      />

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-500 dark:text-gray-400">{t.dashboard.goalProgress}</span>
          <span className="font-medium text-gray-900 dark:text-white">{revenue.goalProgress}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#987012] to-[#D4B85A] rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${revenue.goalProgress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {t.dashboard.revenueGoal}: {revenue.revenueGoal.toLocaleString()} {t.dashboard.sar}
        </p>
      </div>
    </div>
  );
}
