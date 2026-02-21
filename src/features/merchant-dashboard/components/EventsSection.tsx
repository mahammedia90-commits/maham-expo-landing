'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useEvents } from '../hooks/useMerchantData';
import { EventCard } from './EventCard';
import { EmptyState } from './EmptyState';
import { LoadingSkeleton } from './LoadingSkeleton';

export function EventsSection() {
  const { t } = useLanguageStore();
  const { data, isLoading } = useEvents();
  const events = data?.data ?? [];

  if (isLoading) return <LoadingSkeleton type="card" count={6} />;

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {t.dashboard.eventsTitle}
      </motion.h1>

      {events.length === 0 ? (
        <EmptyState
          icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          title={t.dashboard.eventsEmpty}
          description={t.dashboard.eventsEmptyDesc}
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
