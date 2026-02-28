'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';

interface AnalyticsSummaryCardsProps {
  totalSales: number;
  totalVisitors: number;
  avgOrderValue: number;
  conversionRate: number;
  salesGrowth: number;
  visitorsGrowth: number;
}

export function AnalyticsSummaryCards({
  totalSales,
  totalVisitors,
  avgOrderValue,
  conversionRate,
  salesGrowth,
  visitorsGrowth,
}: AnalyticsSummaryCardsProps) {
  const { t } = useLanguageStore();

  const cards = [
    {
      title: t.dashboard.totalSales,
      value: `${totalSales.toLocaleString()} ${t.dashboard.sar}`,
      growth: salesGrowth,
      color: 'from-[#987012] to-[#D4B85A]',
    },
    {
      title: t.dashboard.totalVisitors,
      value: totalVisitors.toLocaleString(),
      growth: visitorsGrowth,
      color: 'from-blue-500 to-blue-400',
    },
    {
      title: t.dashboard.avgOrderValue,
      value: `${avgOrderValue.toLocaleString()} ${t.dashboard.sar}`,
      growth: null,
      color: 'from-green-500 to-green-400',
    },
    {
      title: t.dashboard.conversionRate,
      value: `${conversionRate}%`,
      growth: null,
      color: 'from-purple-500 to-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{card.title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
          {card.growth !== null && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${card.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={card.growth >= 0 ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'}
                />
              </svg>
              {Math.abs(card.growth)}% {t.dashboard.growth}
            </div>
          )}
          <div className={`w-full h-1 rounded-full bg-gradient-to-r ${card.color} mt-3 opacity-60`} />
        </motion.div>
      ))}
    </div>
  );
}
