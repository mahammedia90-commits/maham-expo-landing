'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useInvestorSpaces } from '../hooks/useInvestorData';
import { EmptyState } from '@/features/merchant-dashboard/components/EmptyState';
import { LoadingSkeleton } from '@/features/merchant-dashboard/components/LoadingSkeleton';
import type { InvestorSpace } from '@/shared/types';

function SpaceCard({ space }: { space: InvestorSpace }) {
  const { t } = useLanguageStore();

  const statusMap: Record<string, { label: string; color: string }> = {
    available: { label: t.investorDashboard.available, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
    booked: { label: t.investorDashboard.booked, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
    maintenance: { label: t.investorDashboard.maintenance, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
    inactive: { label: t.investorDashboard.inactive, color: 'bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-400' },
  };

  const typeMap: Record<string, string> = {
    hall: t.investorDashboard.hall,
    outdoor: t.investorDashboard.outdoor,
    shop: t.investorDashboard.shop,
    booth_area: t.investorDashboard.booth_area,
    warehouse: t.investorDashboard.warehouse,
  };

  const { label, color } = statusMap[space.status] || statusMap.available;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">{space.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{space.location} - {space.city}</p>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>{label}</span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs px-2 py-0.5 rounded-md bg-[#987012]/10 text-[#987012] dark:text-[#D4B85A] font-medium">
          {typeMap[space.type]}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {space.area} {t.investorDashboard.sqm}
        </span>
        {space.capacity > 0 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            • {space.capacity} {t.investorDashboard.persons}
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm mb-3">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t.investorDashboard.pricePerMonth}</span>
          <span className="font-medium text-gray-900 dark:text-white">{space.pricePerMonth.toLocaleString()} {t.investorDashboard.sar}</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t.investorDashboard.pricePerDay}</span>
          <span className="font-medium text-gray-900 dark:text-white">{space.pricePerDay.toLocaleString()} {t.investorDashboard.sar}</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t.investorDashboard.totalBookingsLabel}</span>
          <span className="font-medium text-gray-900 dark:text-white">{space.totalBookings}</span>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-3">
        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-sm font-medium text-gray-900 dark:text-white">{space.rating}</span>
      </div>

      {/* Amenities */}
      {space.amenities.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {space.amenities.slice(0, 3).map((amenity) => (
            <span key={amenity} className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
              {amenity}
            </span>
          ))}
          {space.amenities.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
              +{space.amenities.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function InvestorSpacesSection() {
  const { t } = useLanguageStore();
  const { data, isLoading } = useInvestorSpaces();
  const spaces = data?.data ?? [];

  if (isLoading) return <LoadingSkeleton type="card" count={4} />;

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {t.investorDashboard.spacesTitle}
      </motion.h1>

      {spaces.length === 0 ? (
        <EmptyState
          icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"
          title={t.investorDashboard.spacesEmpty}
          description={t.investorDashboard.spacesEmptyDesc}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {spaces.map((space, index) => (
            <motion.div
              key={space.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <SpaceCard space={space} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
