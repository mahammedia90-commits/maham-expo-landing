'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useInvestorBookings, useUpdateBookingStatus } from '../hooks/useInvestorData';
import { EmptyState } from '@/features/merchant-dashboard/components/EmptyState';
import { LoadingSkeleton } from '@/features/merchant-dashboard/components/LoadingSkeleton';
import type { InvestorBooking } from '@/shared/types';

function BookingCard({ booking }: { booking: InvestorBooking }) {
  const { t } = useLanguageStore();
  const updateStatus = useUpdateBookingStatus();

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: t.investorDashboard.pending, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
    approved: { label: t.investorDashboard.approved, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
    rejected: { label: t.investorDashboard.rejected, color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
    active: { label: t.investorDashboard.active, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
    completed: { label: t.investorDashboard.completed, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
    cancelled: { label: t.investorDashboard.cancelled, color: 'bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-400' },
  };

  const { label, color } = statusMap[booking.status] || statusMap.pending;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">{booking.merchantName}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{booking.spaceName}</p>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>{label}</span>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t.investorDashboard.bookingDates}</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t.investorDashboard.totalAmount}</span>
          <span className="font-medium text-[#987012] dark:text-[#D4B85A]">{booking.totalAmount.toLocaleString()} {t.investorDashboard.sar}</span>
        </div>
        {booking.notes && (
          <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">{booking.notes}</p>
        )}
      </div>

      {booking.status === 'pending' && (
        <div className="flex gap-2">
          <button
            onClick={() => updateStatus.mutate({ id: booking.id, status: 'approved' })}
            disabled={updateStatus.isPending}
            className="flex-1 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {t.investorDashboard.approve}
          </button>
          <button
            onClick={() => updateStatus.mutate({ id: booking.id, status: 'rejected' })}
            disabled={updateStatus.isPending}
            className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {t.investorDashboard.reject}
          </button>
        </div>
      )}
    </div>
  );
}

export function InvestorBookingsSection() {
  const { t } = useLanguageStore();
  const { data, isLoading } = useInvestorBookings();
  const bookings = data?.data ?? [];

  if (isLoading) return <LoadingSkeleton type="card" count={4} />;

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {t.investorDashboard.bookingsTitle}
      </motion.h1>

      {bookings.length === 0 ? (
        <EmptyState
          icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          title={t.investorDashboard.bookingsEmpty}
          description={t.investorDashboard.bookingsEmptyDesc}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <BookingCard booking={booking} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
