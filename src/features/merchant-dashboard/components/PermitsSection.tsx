'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { usePermits } from '../hooks/useMerchantData';
import { PermitCard } from './PermitCard';
import { EmptyState } from './EmptyState';
import { LoadingSkeleton } from './LoadingSkeleton';

type FilterTab = 'all' | 'active' | 'inactive';

export function PermitsSection() {
  const { t } = useLanguageStore();
  const { data, isLoading } = usePermits();
  const permits = data?.data ?? [];
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filteredPermits = permits.filter((permit) => {
    if (activeTab === 'active') return permit.status === 'active';
    if (activeTab === 'inactive') return permit.status === 'expired' || permit.status === 'rejected';
    return true;
  });

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: t.dashboard.allPermits },
    { key: 'active', label: t.dashboard.activeOnly },
    { key: 'inactive', label: t.dashboard.inactiveOnly },
  ];

  if (isLoading) return <LoadingSkeleton type="card" count={6} />;

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {t.dashboard.permitsTitle}
      </motion.h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-[#987012] dark:bg-[#D4B85A] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredPermits.length === 0 ? (
        <EmptyState
          icon="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          title={t.dashboard.permitsEmpty}
          description={t.dashboard.permitsEmptyDesc}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPermits.map((permit) => (
            <PermitCard key={permit.id} permit={permit} />
          ))}
        </div>
      )}
    </div>
  );
}
