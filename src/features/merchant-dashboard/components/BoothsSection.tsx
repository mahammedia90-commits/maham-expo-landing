'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useBooths } from '../hooks/useMerchantData';
import { BoothCard } from './BoothCard';
import { EmptyState } from './EmptyState';
import { LoadingSkeleton } from './LoadingSkeleton';

export function BoothsSection() {
  const { t } = useLanguageStore();
  const { data, isLoading } = useBooths();
  const booths = data?.data ?? [];

  if (isLoading) return <LoadingSkeleton type="card" count={6} />;

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {t.dashboard.boothsTitle}
      </motion.h1>

      {booths.length === 0 ? (
        <EmptyState
          icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          title={t.dashboard.boothsEmpty}
          description={t.dashboard.boothsEmptyDesc}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {booths.map((booth) => (
            <BoothCard key={booth.id} booth={booth} />
          ))}
        </div>
      )}
    </div>
  );
}
