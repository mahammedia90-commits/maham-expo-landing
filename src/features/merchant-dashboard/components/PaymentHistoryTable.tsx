'use client';

import { useLanguageStore } from '@/shared/store/useLanguageStore';
import type { Payment } from '@/shared/types';

interface PaymentHistoryTableProps {
  payments: Payment[];
}

export function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
  const { t } = useLanguageStore();

  const statusColors = {
    paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    partial: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    pending: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const statusLabels = {
    paid: t.dashboard.paid,
    partial: t.dashboard.partial,
    pending: t.dashboard.pending,
    overdue: t.dashboard.overdue,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{t.dashboard.booths}</th>
              <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{t.dashboard.amount}</th>
              <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{t.dashboard.paidAmount}</th>
              <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{t.dashboard.remaining}</th>
              <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{t.dashboard.dueDate}</th>
              <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{t.dashboard.status}</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{payment.boothName}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{payment.amount.toLocaleString()} {t.dashboard.sar}</td>
                <td className="px-4 py-3 text-green-600 dark:text-green-400">{payment.paidAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-orange-600 dark:text-orange-400">{payment.remainingAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400" dir="ltr">{new Date(payment.dueDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[payment.status]}`}>
                    {statusLabels[payment.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
