'use client';

import { useLanguageStore } from '@/shared/store/useLanguageStore';
import type { PaymentSummary } from '@/shared/types';

interface PaymentSummaryCardProps {
  summary: PaymentSummary;
}

export function PaymentSummaryCard({ summary }: PaymentSummaryCardProps) {
  const { t } = useLanguageStore();

  const items = [
    { label: t.dashboard.amount, value: summary.totalAmount, color: 'text-gray-900 dark:text-white' },
    { label: t.dashboard.paidAmount, value: summary.totalPaid, color: 'text-green-600 dark:text-green-400' },
    { label: t.dashboard.remaining, value: summary.totalRemaining, color: 'text-orange-600 dark:text-orange-400' },
  ];

  const paidPercentage = summary.totalAmount > 0
    ? Math.round((summary.totalPaid / summary.totalAmount) * 100)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t.dashboard.paymentSummary}</h3>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500 dark:text-gray-400">{paidPercentage}%</span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#987012] to-[#D4B85A] rounded-full transition-all duration-500"
            style={{ width: `${paidPercentage}%` }}
          />
        </div>
      </div>

      {/* Summary items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
            <span className={`font-semibold ${item.color}`}>
              {item.value.toLocaleString()} <span className="text-xs font-normal">{t.dashboard.sar}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Payment counts */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-400">
          {summary.paidPayments}/{summary.totalPayments} {t.dashboard.paid}
        </span>
        <span className="text-orange-500">
          {summary.pendingPayments} {t.dashboard.pending}
        </span>
      </div>
    </div>
  );
}
