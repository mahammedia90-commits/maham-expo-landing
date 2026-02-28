'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useEnhancedDashboardStats } from '../hooks/useMerchantData';
import { StatCard } from './StatCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { RevenueCard } from './RevenueCard';
import { QuickActionsGrid } from './QuickActionsGrid';
import { RecentActivityFeed } from './RecentActivityFeed';
import { UpcomingEventsTimeline } from './UpcomingEventsTimeline';

export function DashboardOverview() {
  const { t } = useLanguageStore();
  const { data, isLoading } = useEnhancedDashboardStats();
  const stats = data?.data;

  if (isLoading) return <LoadingSkeleton type="stat" count={8} />;

  const primaryStats = [
    { title: t.dashboard.totalBooths, value: stats?.totalBooths ?? 0, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'bg-blue-500' },
    { title: t.dashboard.activeBooths, value: stats?.activeBooths ?? 0, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-green-500' },
    { title: t.dashboard.totalPaid, value: stats?.totalPaid?.toLocaleString() ?? '0', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-[#987012]', suffix: t.dashboard.sar },
    { title: t.dashboard.totalRemaining, value: stats?.totalRemaining?.toLocaleString() ?? '0', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-orange-500', suffix: t.dashboard.sar },
  ];

  const secondaryStats = [
    { title: t.dashboard.totalOrders, value: stats?.totalOrders ?? 0, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', color: 'bg-indigo-500' },
    { title: t.dashboard.activePermits, value: stats?.activePermits ?? 0, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', color: 'bg-teal-500' },
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

      {/* Row 1: Primary stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {primaryStats.map((card, index) => (
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

      {/* Row 2: Revenue + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {stats?.revenueSummary && <RevenueCard revenue={stats.revenueSummary} />}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <QuickActionsGrid />
        </motion.div>
      </div>

      {/* Row 3: Recent Activity + Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          {stats?.recentActivities && <RecentActivityFeed activities={stats.recentActivities} />}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          {stats?.upcomingTimeline && <UpcomingEventsTimeline events={stats.upcomingTimeline} />}
        </motion.div>
      </div>

      {/* Row 4: Secondary stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryStats.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
          >
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
