'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { usePayments, usePaymentSummary } from '../hooks/useMerchantData';
import { PaymentSummaryCard } from './PaymentSummaryCard';
import { PaymentHistoryTable } from './PaymentHistoryTable';
import { EmptyState } from './EmptyState';
import { LoadingSkeleton } from './LoadingSkeleton';

export function PaymentsSection() {
  const { t } = useLanguageStore();
  const { data: paymentsData, isLoading: paymentsLoading } = usePayments();
  const { data: summaryData, isLoading: summaryLoading } = usePaymentSummary();

  const payments = paymentsData?.data ?? [];
  const summary = summaryData?.data;

  if (paymentsLoading || summaryLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="stat" count={3} />
        <LoadingSkeleton type="table" count={5} />
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
        {t.dashboard.paymentsTitle}
      </motion.h1>

      {payments.length === 0 ? (
        <EmptyState
          icon="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          title={t.dashboard.paymentsEmpty}
          description={t.dashboard.paymentsEmptyDesc}
        />
      ) : (
        <div className="space-y-6">
          {summary && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <PaymentSummaryCard summary={summary} />
            </motion.div>
          )}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <PaymentHistoryTable payments={payments} />
          </motion.div>
        </div>
      )}
    </div>
  );
}
