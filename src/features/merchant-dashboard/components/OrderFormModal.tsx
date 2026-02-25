'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useCreateOrder } from '../hooks/useMerchantData';
import { useEvents } from '../hooks/useMerchantData';
import { modalBackdrop, modalContent } from '@/shared/utils/animations';
import type { MerchantOrder } from '@/shared/types';

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OrderFormModal({ isOpen, onClose }: OrderFormModalProps) {
  const { t, isRtl } = useLanguageStore();
  const createOrder = useCreateOrder();
  const { data: eventsData } = useEvents();
  const events = eventsData?.data ?? [];

  const [form, setForm] = useState({
    type: '' as MerchantOrder['type'] | '',
    eventName: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.type) newErrors.type = t.dashboard.orderTypeRequired;
    if (!form.eventName) newErrors.eventName = t.dashboard.eventRequired;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createOrder.mutateAsync({
        type: form.type as MerchantOrder['type'],
        eventName: form.eventName,
        notes: form.notes || undefined,
      });
      setIsSuccess(true);
    } catch {
      // error handled by mutation state
    }
  };

  const handleClose = () => {
    if (createOrder.isPending) return;
    onClose();
    // Reset after close animation
    setTimeout(() => {
      setForm({ type: '', eventName: '', notes: '' });
      setErrors({});
      setIsSuccess(false);
      createOrder.reset();
    }, 300);
  };

  const orderTypes: { value: MerchantOrder['type']; label: string }[] = [
    { value: 'booth_booking', label: t.dashboard.boothBooking },
    { value: 'service_request', label: t.dashboard.serviceRequest },
    { value: 'space_upgrade', label: t.dashboard.spaceUpgrade },
    { value: 'equipment_rental', label: t.dashboard.equipmentRental },
    { value: 'visit_request', label: t.dashboard.visitRequest },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalBackdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#987012] to-[#D4B85A] p-5 relative">
              <h2 className="text-lg font-bold text-white">{t.dashboard.newOrder}</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors`}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-5">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                      <motion.svg
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-8 h-8 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <motion.path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                      </motion.svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {t.dashboard.orderSubmitted}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                      {t.dashboard.orderSubmittedDesc}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClose}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#987012] to-[#D4B85A] text-white text-sm font-medium"
                    >
                      {t.dashboard.ordersTitle}
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    {/* Order Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        {t.dashboard.orderType}
                      </label>
                      <select
                        value={form.type}
                        onChange={(e) => updateField('type', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.type
                            ? 'border-red-400 dark:border-red-500'
                            : 'border-gray-300 dark:border-gray-600'
                        } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#987012] dark:focus:ring-[#D4B85A] focus:border-transparent outline-none transition-all`}
                      >
                        <option value="">{t.dashboard.selectOrderType}</option>
                        {orderTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {errors.type && (
                        <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                      )}
                    </div>

                    {/* Event Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        {t.dashboard.eventName}
                      </label>
                      <select
                        value={form.eventName}
                        onChange={(e) => updateField('eventName', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.eventName
                            ? 'border-red-400 dark:border-red-500'
                            : 'border-gray-300 dark:border-gray-600'
                        } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#987012] dark:focus:ring-[#D4B85A] focus:border-transparent outline-none transition-all`}
                      >
                        <option value="">{t.dashboard.selectEvent}</option>
                        {events.map((event) => (
                          <option key={event.id} value={event.name}>
                            {event.name}
                          </option>
                        ))}
                      </select>
                      {errors.eventName && (
                        <p className="text-red-500 text-xs mt-1">{errors.eventName}</p>
                      )}
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        {t.dashboard.orderNotes}
                      </label>
                      <textarea
                        value={form.notes}
                        onChange={(e) => updateField('notes', e.target.value)}
                        rows={3}
                        placeholder={t.dashboard.orderNotesPlaceholder}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#987012] dark:focus:ring-[#D4B85A] focus:border-transparent outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                      {createOrder.isError && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-sm text-center"
                        >
                          {t.dashboard.orderError}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={createOrder.isPending}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#987012] to-[#D4B85A] text-white font-medium hover:from-[#B8860B] hover:to-[#E8C860] disabled:opacity-60 transition-all"
                    >
                      {createOrder.isPending ? (
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          {t.dashboard.submitting}
                        </motion.span>
                      ) : (
                        t.dashboard.submitOrder
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
