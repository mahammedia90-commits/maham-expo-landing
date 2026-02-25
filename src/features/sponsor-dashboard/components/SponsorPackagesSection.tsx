'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useSponsorPackages } from '../hooks/useSponsorData';
import { EmptyState } from '@/features/merchant-dashboard/components/EmptyState';
import { LoadingSkeleton } from '@/features/merchant-dashboard/components/LoadingSkeleton';
import type { SponsorPackage, SponsorLevel } from '@/shared/types';

const levelColors: Record<SponsorLevel, string> = {
  platinum: 'from-gray-700 to-gray-500',
  gold: 'from-[#987012] to-[#D4B85A]',
  silver: 'from-gray-400 to-gray-300',
  official_partner: 'from-blue-600 to-blue-400',
  media_partner: 'from-purple-600 to-purple-400',
  strategic_alliance: 'from-green-600 to-green-400',
};

const levelBadgeColors: Record<SponsorLevel, string> = {
  platinum: 'bg-gray-700 text-white',
  gold: 'bg-[#987012] text-white',
  silver: 'bg-gray-400 text-white',
  official_partner: 'bg-blue-600 text-white',
  media_partner: 'bg-purple-600 text-white',
  strategic_alliance: 'bg-green-600 text-white',
};

function PackageCard({ pkg }: { pkg: SponsorPackage }) {
  const { t } = useLanguageStore();

  const levelLabel = t.sponsorDashboard[pkg.level as keyof typeof t.sponsorDashboard] as string;
  const statusLabel = pkg.status === 'active' ? t.sponsorDashboard.active : pkg.status === 'available' ? t.sponsorDashboard.available : t.sponsorDashboard.ended;
  const statusColor = pkg.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : pkg.status === 'available' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header gradient */}
      <div className={`h-2 bg-gradient-to-r ${levelColors[pkg.level]}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">{pkg.name}</h3>
            <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${levelBadgeColors[pkg.level]}`}>
              {levelLabel}
            </span>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor}`}>
            {statusLabel}
          </span>
        </div>

        <p className="text-2xl font-bold text-[#987012] dark:text-[#D4B85A] mb-4">
          {pkg.price.toLocaleString()} <span className="text-sm font-normal">{t.sponsorDashboard.sar}</span>
        </p>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>{t.sponsorDashboard.screens}</span>
            <span className="font-medium text-gray-900 dark:text-white">{pkg.screens}</span>
          </div>
          <div className="flex justify-between">
            <span>{t.sponsorDashboard.banners}</span>
            <span className="font-medium text-gray-900 dark:text-white">{pkg.banners}</span>
          </div>
          <div className="flex justify-between">
            <span>{t.sponsorDashboard.mediaAppearances}</span>
            <span className="font-medium text-gray-900 dark:text-white">{pkg.mediaAppearances}</span>
          </div>
          <div className="flex justify-between">
            <span>{t.sponsorDashboard.vipInvitations}</span>
            <span className="font-medium text-gray-900 dark:text-white">{pkg.vipInvitations}</span>
          </div>
          <div className="flex justify-between">
            <span>{t.sponsorDashboard.boothArea}</span>
            <span className="font-medium text-gray-900 dark:text-white">{pkg.boothArea}</span>
          </div>
          {pkg.canSponsorSession && (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t.sponsorDashboard.sponsorSession}
            </div>
          )}
          {pkg.canSponsorZone && (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t.sponsorDashboard.sponsorZone}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SponsorPackagesSection() {
  const { t } = useLanguageStore();
  const { data, isLoading } = useSponsorPackages();
  const packages = data?.data ?? [];

  if (isLoading) return <LoadingSkeleton type="card" count={4} />;

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {t.sponsorDashboard.packagesTitle}
      </motion.h1>

      {packages.length === 0 ? (
        <EmptyState
          icon="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          title={t.sponsorDashboard.packagesEmpty}
          description={t.sponsorDashboard.packagesEmptyDesc}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PackageCard pkg={pkg} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
