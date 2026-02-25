'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import type { MerchantPermit } from '@/shared/types';

interface PermitCardProps {
  permit: MerchantPermit;
}

export function PermitCard({ permit }: PermitCardProps) {
  const { t } = useLanguageStore();

  const isInactive = permit.status === 'expired' || permit.status === 'rejected';

  const statusColors = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    expired: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const statusLabels = {
    active: t.dashboard.active,
    expired: t.dashboard.expired,
    pending: t.dashboard.pending,
    rejected: t.dashboard.rejected,
  };

  const typeLabels = {
    entry_permit: t.dashboard.entryPermit,
    booth_permit: t.dashboard.boothPermit,
    operational_permit: t.dashboard.operationalPermit,
    vehicle_permit: t.dashboard.vehiclePermit,
  };

  const typeIcons = {
    entry_permit: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',
    booth_permit: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    operational_permit: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    vehicle_permit: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10 M17 16V9a1 1 0 00-.553-.894l-3-1.5A1 1 0 0013 6.5V16',
  };

  // Calculate days remaining for active permits
  const now = new Date();
  const expiresAt = new Date(permit.expiresAt);
  const issuedAt = new Date(permit.issuedAt);
  const totalDays = Math.max(1, Math.ceil((expiresAt.getTime() - issuedAt.getTime()) / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const progress = permit.status === 'active' ? Math.min(100, Math.max(0, (daysRemaining / totalDays) * 100)) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-shadow ${
        isInactive ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#987012]/10 dark:bg-[#D4B85A]/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#987012] dark:text-[#D4B85A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={typeIcons[permit.type]} />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{typeLabels[permit.type]}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{permit.permitNumber}</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[permit.status]}`}>
          {statusLabels[permit.status]}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">{t.dashboard.eventsTitle.replace('المتاحة', '').replace('Available ', '').trim()}</span>
          <span className="text-gray-900 dark:text-white font-medium">{permit.eventName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">{t.dashboard.issuedAt}</span>
          <span className="text-gray-900 dark:text-white font-medium" dir="ltr">
            {new Date(permit.issuedAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">{t.dashboard.expiryDate}</span>
          <span className="text-gray-900 dark:text-white font-medium" dir="ltr">
            {new Date(permit.expiresAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {permit.status === 'active' && (
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">{t.dashboard.daysRemaining}</span>
            <span className="text-xs font-semibold text-[#987012] dark:text-[#D4B85A]">{daysRemaining}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                progress > 50
                  ? 'bg-green-500'
                  : progress > 25
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
