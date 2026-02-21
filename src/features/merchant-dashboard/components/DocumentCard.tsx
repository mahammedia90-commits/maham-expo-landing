'use client';

import { useLanguageStore } from '@/shared/store/useLanguageStore';
import type { MerchantDocument } from '@/shared/types';

interface DocumentCardProps {
  document: MerchantDocument;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const { t } = useLanguageStore();

  const statusColors = {
    approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const statusLabels = {
    approved: t.dashboard.approved,
    pending: t.dashboard.pending,
    rejected: t.dashboard.rejected,
  };

  const typeLabels: Record<string, string> = {
    commercial_register: t.dashboard.commercialRegisterDoc,
    id_card: t.dashboard.idCard,
    contract: t.dashboard.contract,
    license: t.dashboard.license,
    other: t.dashboard.other,
  };

  const typeIcons: Record<string, string> = {
    commercial_register: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    id_card: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2',
    contract: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    license: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    other: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={typeIcons[document.type] || typeIcons.other} />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white truncate">{document.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{typeLabels[document.type] || typeLabels.other}</p>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${statusColors[document.status]}`}>
              {statusLabels[document.status]}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
            <span>{t.dashboard.uploadedAt}: {new Date(document.uploadedAt).toLocaleDateString()}</span>
            {document.expiryDate && (
              <span>{t.dashboard.expiryDate}: {new Date(document.expiryDate).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
