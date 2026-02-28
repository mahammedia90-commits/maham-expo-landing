'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useInvestorEvents } from '../hooks/useInvestorData';
import { EventCard } from '@/features/merchant-dashboard/components/EventCard';
import { EmptyState } from '@/features/merchant-dashboard/components/EmptyState';
import { LoadingSkeleton } from '@/features/merchant-dashboard/components/LoadingSkeleton';

export function InvestorEventsSection() {
  const { t } = useLanguageStore();
  const { data, isLoading } = useInvestorEvents();
  const events = data?.data ?? [];

  if (isLoading) return <LoadingSkeleton type="card" count={3} />;

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {t.investorDashboard.eventsTitle}
      </motion.h1>

      {events.length === 0 ? (
        <EmptyState
          icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          title={t.investorDashboard.eventsEmpty}
          description={t.investorDashboard.eventsEmptyDesc}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
