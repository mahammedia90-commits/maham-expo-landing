'use client';

import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useDocuments } from '../hooks/useMerchantData';
import { DocumentCard } from './DocumentCard';
import { DocumentUploader } from './DocumentUploader';
import { EmptyState } from './EmptyState';
import { LoadingSkeleton } from './LoadingSkeleton';

export function DocumentsSection() {
  const { t } = useLanguageStore();
  const { data, isLoading } = useDocuments();
  const documents = data?.data ?? [];

  if (isLoading) return <LoadingSkeleton type="card" count={4} />;

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {t.dashboard.documentsTitle}
      </motion.h1>

      {/* Upload area */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <DocumentUploader />
      </motion.div>

      {/* Documents list */}
      {documents.length === 0 ? (
        <EmptyState
          icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          title={t.dashboard.documentsEmpty}
          description={t.dashboard.documentsEmptyDesc}
        />
      ) : (
        <div className="space-y-3">
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <DocumentCard document={doc} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
