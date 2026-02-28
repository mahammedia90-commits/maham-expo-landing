'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useServices, useServiceRequests } from '../hooks/useMerchantData';
import { ServiceCard } from './ServiceCard';
import { ServiceRequestCard } from './ServiceRequestCard';
import { ServiceRequestModal } from './ServiceRequestModal';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import type { MarketplaceService, ServiceCategory } from '@/shared/types';

const categories: (ServiceCategory | 'all')[] = ['all', 'furniture', 'internet', 'electricity', 'hospitality', 'staffing', 'security', 'cleaning', 'decoration'];

export function ServicesSection() {
  const { t } = useLanguageStore();
  const { data: servicesData, isLoading: loadingServices } = useServices();
  const { data: requestsData, isLoading: loadingRequests } = useServiceRequests();

  const [activeTab, setActiveTab] = useState<'catalog' | 'requests'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [selectedService, setSelectedService] = useState<MarketplaceService | null>(null);

  const services = servicesData?.data || [];
  const requests = requestsData?.data || [];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter((s) => s.category === selectedCategory);

  const categoryLabels: Record<string, string> = {
    all: t.dashboard.allCategories,
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
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {t.dashboard.serviceMarketplace}
      </motion.h1>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6 w-fit">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'catalog'
              ? 'bg-white dark:bg-gray-700 text-[#987012] dark:text-[#D4B85A] shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
          }`}
        >
          {t.dashboard.serviceCatalog}
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'requests'
              ? 'bg-white dark:bg-gray-700 text-[#987012] dark:text-[#D4B85A] shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
          }`}
        >
          {t.dashboard.myRequests} ({requests.length})
        </button>
      </div>

      {activeTab === 'catalog' ? (
        <>
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#987012] text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          {loadingServices ? (
            <LoadingSkeleton type="stat" count={4} />
          ) : filteredServices.length === 0 ? (
            <EmptyState
              icon="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              title={t.dashboard.noServices}
              description=""
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ServiceCard service={service} onRequest={setSelectedService} />
                </motion.div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {loadingRequests ? (
            <LoadingSkeleton type="stat" count={3} />
          ) : requests.length === 0 ? (
            <EmptyState
              icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              title={t.dashboard.noRequests}
              description={t.dashboard.noRequestsDesc}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.map((request, i) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ServiceRequestCard request={request} />
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Request Modal */}
      {selectedService && (
        <ServiceRequestModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}
