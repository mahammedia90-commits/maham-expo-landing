'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useDashboardStats } from '../hooks/useMerchantData';
import { StatCard } from './StatCard';
import { LoadingSkeleton } from './LoadingSkeleton';

export function DashboardOverview() {
  const { t } = useLanguageStore();
  const { data, isLoading } = useDashboardStats();
  const stats = data?.data;

  if (isLoading) return <LoadingSkeleton type="stat" count={6} />;

  const statCards = [
    { title: t.dashboard.totalBooths, value: stats?.totalBooths ?? 0, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'bg-blue-500' },
    { title: t.dashboard.activeBooths, value: stats?.activeBooths ?? 0, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-green-500' },
    { title: t.dashboard.totalPaid, value: stats?.totalPaid?.toLocaleString() ?? '0', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-[#987012]', suffix: t.dashboard.sar },
    { title: t.dashboard.totalRemaining, value: stats?.totalRemaining?.toLocaleString() ?? '0', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-orange-500', suffix: t.dashboard.sar },
    { title: t.dashboard.pendingDocuments, value: stats?.pendingDocuments ?? 0, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'bg-yellow-500' },
    { title: t.dashboard.upcomingEvents, value: stats?.upcomingEvents ?? 0, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-purple-500' },
  ];

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {t.dashboard.overview}
      </motion.h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
