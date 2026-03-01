'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useInvestorEvents } from '../hooks/useInvestorData';
import { EventCard } from '@/features/merchant-dashboard/components/EventCard';
import { EventDetailModal } from '@/features/merchant-dashboard/components/EventDetailModal';
import { EmptyState } from '@/features/merchant-dashboard/components/EmptyState';
import { LoadingSkeleton } from '@/features/merchant-dashboard/components/LoadingSkeleton';
import type { EventType, MerchantEvent } from '@/shared/types';

export function InvestorEventsSection() {
  const { t, language } = useLanguageStore();
  const { data, isLoading } = useInvestorEvents();
  const events = data?.data ?? [];

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<MerchantEvent['status'] | 'all'>('all');
  const [selectedEvent, setSelectedEvent] = useState<MerchantEvent | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 20;

  const isEn = language === 'en';

  const cities = useMemo(() => {
    const set = new Set(events.map((e) => e.city).filter(Boolean));
    return Array.from(set);
  }, [events]);

  const filtered = useMemo(() => {
    setPage(1);
    return events.filter((e) => {
      const q = search.toLowerCase();
      if (search && !e.name.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q) && !(e.nameEn?.toLowerCase().includes(q))) return false;
      if (typeFilter !== 'all' && e.type !== typeFilter) return false;
      if (cityFilter !== 'all' && e.city !== cityFilter) return false;
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      return true;
    });
  }, [events, search, typeFilter, cityFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const stats = useMemo(() => ({
    total: events.length,
    active: events.filter((e) => e.status === 'active').length,
    upcoming: events.filter((e) => e.status === 'upcoming').length,
    ended: events.filter((e) => e.status === 'ended').length,
  }), [events]);

  if (isLoading) return <LoadingSkeleton type="card" count={6} />;

  const eventTypes: { value: EventType | 'all'; label: string }[] = [
    { value: 'all', label: t.dashboard.allTypes },
    { value: 'exhibition', label: t.dashboard.exhibition },
    { value: 'conference', label: t.dashboard.conference },
    { value: 'entertainment', label: t.dashboard.entertainment },
    { value: 'cultural', label: t.dashboard.cultural },
    { value: 'sports', label: t.dashboard.sports },
    { value: 'technology', label: t.dashboard.technology },
  ];

  const statusOptions: { value: MerchantEvent['status'] | 'all'; label: string }[] = [
    { value: 'all', label: t.dashboard.allStatuses },
    { value: 'active', label: t.dashboard.active },
    { value: 'upcoming', label: t.dashboard.upcoming },
    { value: 'ended', label: t.dashboard.ended },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEn ? 'Investment Opportunities' : 'فرص الفعاليات الكبرى'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isEn ? `${stats.total} events with space leasing opportunities` : `${stats.total} فعالية بفرص تأجير مساحات`}
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-xs px-3 py-1.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">
              {stats.active} {t.dashboard.active}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">
              {stats.upcoming} {t.dashboard.upcoming}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 font-medium">
              {stats.ended} {t.dashboard.ended}
            </span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.dashboard.searchEvents}
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#987012]/30 focus:border-[#987012] outline-none transition-all text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as EventType | 'all')}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-[#987012]/30 focus:border-[#987012] outline-none"
            >
              {eventTypes.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-[#987012]/30 focus:border-[#987012] outline-none"
            >
              <option value="all">{t.dashboard.allCities}</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as MerchantEvent['status'] | 'all')}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-[#987012]/30 focus:border-[#987012] outline-none"
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {(search || typeFilter !== 'all' || cityFilter !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={() => { setSearch(''); setTypeFilter('all'); setCityFilter('all'); setStatusFilter('all'); }}
                className="px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                ✕
              </button>
            )}

            <span className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
              {filtered.length} {t.dashboard.eventsCount}
            </span>
          </div>
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          title={t.investorDashboard.eventsEmpty}
          description={t.investorDashboard.eventsEmptyDesc}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.5) }}
              >
                <EventCard event={event} onViewDetails={setSelectedEvent} />
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isEn ? 'Previous' : 'السابق'}
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-[#987012] text-white shadow-md'
                      : 'border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isEn ? 'Next' : 'التالي'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          variant="investor"
        />
      )}
    </div>
  );
}
