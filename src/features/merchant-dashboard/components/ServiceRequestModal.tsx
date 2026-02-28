'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useBooths, useEvents, useCreateServiceRequest } from '../hooks/useMerchantData';
import type { MarketplaceService } from '@/shared/types';

interface ServiceRequestModalProps {
  service: MarketplaceService | null;
  onClose: () => void;
}

export function ServiceRequestModal({ service, onClose }: ServiceRequestModalProps) {
  const { t } = useLanguageStore();
  const { data: eventsData } = useEvents();
  const { data: boothsData } = useBooths();
  const createRequest = useCreateServiceRequest();

  const [eventName, setEventName] = useState('');
  const [boothName, setBoothName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  const events = eventsData?.data || [];
  const booths = (boothsData?.data || []).filter((b) => b.status === 'active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !eventName || !boothName) return;

    createRequest.mutate(
      { serviceId: service.id, eventName, boothName, quantity, notes },
      {
        onSuccess: () => setSuccess(true),
      }
    );
  };

  if (!service) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {success ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t.dashboard.requestSubmitted}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t.dashboard.requestSubmittedDesc}</p>
              <button onClick={onClose} className="px-6 py-2 rounded-xl bg-[#987012] text-white font-medium hover:bg-[#876010] transition-colors">
                {t.dashboard.overview}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.dashboard.requestServiceBtn}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{service.name}</p>
              </div>

              <div className="p-6 space-y-4">
                {/* Event */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.dashboard.eventName}
                  </label>
                  <select
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#987012] focus:border-transparent"
                  >
                    <option value="">{t.dashboard.selectEvent}</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.name}>{event.name}</option>
                    ))}
                  </select>
                </div>

                {/* Booth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.dashboard.selectBooth}
                  </label>
                  <select
                    value={boothName}
                    onChange={(e) => setBoothName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#987012] focus:border-transparent"
                  >
                    <option value="">{t.dashboard.selectBooth}</option>
                    {booths.map((booth) => (
                      <option key={booth.id} value={booth.name}>{booth.name}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.dashboard.quantity}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#987012] focus:border-transparent"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.dashboard.requestNotes}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder={t.dashboard.requestNotesPlaceholder}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#987012] focus:border-transparent resize-none"
                  />
                </div>

                {/* Total */}
                <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.dashboard.totalPrice}</span>
                  <span className="text-lg font-bold text-[#987012] dark:text-[#D4B85A]">
                    {(service.price * quantity).toLocaleString()} {t.dashboard.sar}
                  </span>
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t.dashboard.logout === 'تسجيل الخروج' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={createRequest.isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#987012] hover:bg-[#876010] text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {createRequest.isPending ? t.dashboard.submitting : t.dashboard.submitRequest}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
