'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useSponsorPayments, useSponsorPaymentSummary } from '../hooks/useSponsorData';
import { EmptyState } from '@/features/merchant-dashboard/components/EmptyState';
import { LoadingSkeleton } from '@/features/merchant-dashboard/components/LoadingSkeleton';
import type { SponsorPayment, PaymentSummary } from '@/shared/types';

function SponsorPaymentSummaryCard({ summary }: { summary: PaymentSummary }) {
  const { t } = useLanguageStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.sponsorDashboard.amount}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{summary.totalAmount.toLocaleString()} <span className="text-sm font-normal">{t.sponsorDashboard.sar}</span></p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.sponsorDashboard.paidAmount}</p>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{summary.totalPaid.toLocaleString()} <span className="text-sm font-normal">{t.sponsorDashboard.sar}</span></p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.sponsorDashboard.remaining}</p>
        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">{summary.totalRemaining.toLocaleString()} <span className="text-sm font-normal">{t.sponsorDashboard.sar}</span></p>
      </div>
    </div>
  );
}

function PaymentRow({ payment }: { payment: SponsorPayment }) {
  const { t } = useLanguageStore();

  const statusMap: Record<string, { label: string; color: string }> = {
    paid: { label: t.sponsorDashboard.paid, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
    partial: { label: t.sponsorDashboard.partial, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
    pending: { label: t.sponsorDashboard.pending, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
    overdue: { label: t.sponsorDashboard.overdue, color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
  };

  const { label, color } = statusMap[payment.status] || statusMap.pending;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="flex-1">
        <p className="font-medium text-gray-900 dark:text-white">{payment.contractName}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t.sponsorDashboard.dueDate}: {new Date(payment.dueDate).toLocaleDateString()}
          {payment.method && ` | ${payment.method}`}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-bold text-gray-900 dark:text-white">{payment.amount.toLocaleString()} {t.sponsorDashboard.sar}</p>
          {payment.remainingAmount > 0 && (
            <p className="text-xs text-orange-600 dark:text-orange-400">{t.sponsorDashboard.remaining}: {payment.remainingAmount.toLocaleString()}</p>
          )}
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${color}`}>{label}</span>
      </div>
    </div>
  );
}

export function SponsorPaymentsSection() {
  const { t } = useLanguageStore();
  const { data: paymentsData, isLoading: paymentsLoading } = useSponsorPayments();
  const { data: summaryData, isLoading: summaryLoading } = useSponsorPaymentSummary();

  const payments = paymentsData?.data ?? [];
  const summary = summaryData?.data;

  if (paymentsLoading || summaryLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="stat" count={3} />
        <LoadingSkeleton type="table" count={4} />
      </div>
    );
  }

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {t.sponsorDashboard.paymentsTitle}
      </motion.h1>

      {payments.length === 0 ? (
        <EmptyState
          icon="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          title={t.sponsorDashboard.paymentsEmpty}
          description={t.sponsorDashboard.paymentsEmptyDesc}
        />
      ) : (
        <div className="space-y-6">
          {summary && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <SponsorPaymentSummaryCard summary={summary} />
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {payments.map((payment) => (
              <PaymentRow key={payment.id} payment={payment} />
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}
