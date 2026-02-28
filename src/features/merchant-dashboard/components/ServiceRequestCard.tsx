'use client';

import { useLanguageStore } from '@/shared/store/useLanguageStore';
import type { ServiceRequest } from '@/shared/types';

const statusStyles: Record<ServiceRequest['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

interface ServiceRequestCardProps {
  request: ServiceRequest;
}

export function ServiceRequestCard({ request }: ServiceRequestCardProps) {
  const { t } = useLanguageStore();

  const statusLabel: Record<ServiceRequest['status'], string> = {
    pending: t.dashboard.pending,
    approved: t.dashboard.approved,
    rejected: t.dashboard.rejected,
    completed: t.dashboard.paid,
  };

  const categoryLabel: Record<string, string> = {
    furniture: t.dashboard.furniture,
    internet: t.dashboard.internet,
    electricity: t.dashboard.electricity,
    hospitality: t.dashboard.hospitality,
    staffing: t.dashboard.staffing,
    security: t.dashboard.security,
    cleaning: t.dashboard.cleaning,
    decoration: t.dashboard.decoration,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{request.serviceName}</h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {categoryLabel[request.category]}
          </span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[request.status]}`}>
          {statusLabel[request.status]}
        </span>
      </div>

      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">{t.dashboard.eventName}</span>
          <span className="text-gray-900 dark:text-white">{request.eventName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">{t.dashboard.booths}</span>
          <span className="text-gray-900 dark:text-white">{request.boothName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">{t.dashboard.quantity}</span>
          <span className="text-gray-900 dark:text-white">{request.quantity}</span>
        </div>
        <div className="flex justify-between pt-1.5 border-t border-gray-100 dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400 font-medium">{t.dashboard.totalPrice}</span>
          <span className="font-bold text-[#987012] dark:text-[#D4B85A]">
            {request.totalPrice.toLocaleString()} {t.dashboard.sar}
          </span>
        </div>
      </div>
    </div>
  );
}
