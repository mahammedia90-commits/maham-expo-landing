'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useUploadDocument } from '../hooks/useMerchantData';

export function DocumentUploader() {
  const { t } = useLanguageStore();
  const upload = useUploadDocument();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) return; // 10MB limit
    const formData = new FormData();
    formData.append('file', file);
    upload.mutate(formData);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
        dragActive
          ? 'border-[#987012] bg-[#987012]/5 dark:bg-[#D4B85A]/5'
          : 'border-gray-300 dark:border-gray-600 hover:border-[#987012] dark:hover:border-[#D4B85A]'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
      />
      <svg className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <p className="font-medium text-gray-700 dark:text-gray-300">{t.dashboard.dragDrop}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.dashboard.orBrowse}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{t.dashboard.maxFileSize}</p>
      {upload.isPending && (
        <div className="mt-3">
          <div className="w-8 h-8 border-3 border-[#987012] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      )}
    </motion.div>
  );
}
