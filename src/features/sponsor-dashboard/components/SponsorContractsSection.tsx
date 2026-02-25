'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useSponsorContracts } from '../hooks/useSponsorData';
import { EmptyState } from '@/features/merchant-dashboard/components/EmptyState';
import { LoadingSkeleton } from '@/features/merchant-dashboard/components/LoadingSkeleton';
import type { SponsorContract } from '@/shared/types';

function ContractCard({ contract }: { contract: SponsorContract }) {
  const { t } = useLanguageStore();

  const statusMap: Record<string, { label: string; color: string }> = {
    active: { label: t.sponsorDashboard.active, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
    pending: { label: t.sponsorDashboard.pending, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
    completed: { label: t.sponsorDashboard.completed, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
    cancelled: { label: t.sponsorDashboard.cancelled, color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
  };

  const { label, color } = statusMap[contract.status] || statusMap.pending;
  const progress = contract.totalValue > 0 ? (contract.paidAmount / contract.totalValue) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">{contract.packageName}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{contract.eventName}</p>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>{label}</span>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t.sponsorDashboard.contractValue}</span>
          <span className="font-medium text-gray-900 dark:text-white">{contract.totalValue.toLocaleString()} {t.sponsorDashboard.sar}</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t.sponsorDashboard.paidAmount}</span>
          <span className="font-medium text-green-600 dark:text-green-400">{contract.paidAmount.toLocaleString()} {t.sponsorDashboard.sar}</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t.sponsorDashboard.remaining}</span>
          <span className="font-medium text-orange-600 dark:text-orange-400">{contract.remainingAmount.toLocaleString()} {t.sponsorDashboard.sar}</span>
        </div>
        {contract.signedDate && (
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>{t.sponsorDashboard.signedDate}</span>
            <span className="font-medium text-gray-900 dark:text-white">{new Date(contract.signedDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-[#987012] to-[#D4B85A] h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">{Math.round(progress)}%</p>
    </div>
  );
}

export function SponsorContractsSection() {
  const { t } = useLanguageStore();
  const { data, isLoading } = useSponsorContracts();
  const contracts = data?.data ?? [];

  if (isLoading) return <LoadingSkeleton type="card" count={3} />;

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {t.sponsorDashboard.contractsTitle}
      </motion.h1>

      {contracts.length === 0 ? (
        <EmptyState
          icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          title={t.sponsorDashboard.contractsEmpty}
          description={t.sponsorDashboard.contractsEmptyDesc}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contracts.map((contract, index) => (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ContractCard contract={contract} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
