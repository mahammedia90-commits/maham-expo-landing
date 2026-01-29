'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { CloseIcon } from '@/shared/components/Icons';

interface InvestorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InvestorRegistrationModal({ isOpen, onClose }: InvestorRegistrationModalProps) {
  const { t, isRtl } = useLanguageStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    commercialRegister: '',
    city: '',
    spacesCount: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would normally send the data to your API
      console.log('Investor registration data:', formData);

      setIsSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        companyName: '',
        commercialRegister: '',
        city: '',
        spacesCount: '',
        message: '',
      });
    } catch (err) {
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError(false);
    onClose();
  };

  const reg = t.home.investorRegistration;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="gradient-hero p-4 sm:p-6 text-white relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors`}
              >
                <CloseIcon className="w-5 h-5 text-white" />
              </motion.button>
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl sm:text-2xl font-bold"
              >
                {reg.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/80 text-sm sm:text-base mt-1"
              >
                {reg.subtitle}
              </motion.p>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <svg
                        className="w-8 h-8 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-green-600 font-medium text-lg mb-4"
                    >
                      {reg.success}
                    </motion.p>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClose}
                      className="btn-primary text-white px-6 py-2 rounded-full"
                    >
                      {reg.close}
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
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {reg.fullName} <span className="text-red-500">*</span>
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e5f74] focus:border-transparent outline-none transition ${
                          isRtl ? 'text-right' : 'text-left'
                        }`}
                      />
                    </div>

                    {/* Email & Phone */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {reg.email} <span className="text-red-500">*</span>
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e5f74] focus:border-transparent outline-none transition ${
                            isRtl ? 'text-right' : 'text-left'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {reg.phone} <span className="text-red-500">*</span>
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e5f74] focus:border-transparent outline-none transition ${
                            isRtl ? 'text-right' : 'text-left'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {reg.companyName} <span className="text-red-500">*</span>
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e5f74] focus:border-transparent outline-none transition ${
                          isRtl ? 'text-right' : 'text-left'
                        }`}
                      />
                    </div>

                    {/* Commercial Register & City */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {reg.commercialRegister}
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="text"
                          name="commercialRegister"
                          value={formData.commercialRegister}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e5f74] focus:border-transparent outline-none transition ${
                            isRtl ? 'text-right' : 'text-left'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {reg.city} <span className="text-red-500">*</span>
                        </label>
                        <motion.select
                          whileFocus={{ scale: 1.01 }}
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e5f74] focus:border-transparent outline-none transition bg-white ${
                            isRtl ? 'text-right' : 'text-left'
                          }`}
                        >
                          <option value="">{reg.city}</option>
                          {reg.cities.map((city, index) => (
                            <option key={index} value={city}>
                              {city}
                            </option>
                          ))}
                        </motion.select>
                      </div>
                    </div>

                    {/* Spaces Count */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {reg.spacesCount}
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="number"
                        name="spacesCount"
                        min="1"
                        value={formData.spacesCount}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e5f74] focus:border-transparent outline-none transition ${
                          isRtl ? 'text-right' : 'text-left'
                        }`}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {reg.message}
                      </label>
                      <motion.textarea
                        whileFocus={{ scale: 1.01 }}
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e5f74] focus:border-transparent outline-none transition resize-none ${
                          isRtl ? 'text-right' : 'text-left'
                        }`}
                      />
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-sm text-center"
                        >
                          {reg.error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary text-white py-3 rounded-lg font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          {reg.submitting}
                        </motion.span>
                      ) : (
                        reg.submit
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
