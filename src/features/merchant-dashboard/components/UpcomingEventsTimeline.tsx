'use client';

import { useLanguageStore } from '@/shared/store/useLanguageStore';
import type { UpcomingEventTimeline } from '@/shared/types';

interface UpcomingEventsTimelineProps {
  events: UpcomingEventTimeline[];
}

export function UpcomingEventsTimeline({ events }: UpcomingEventsTimelineProps) {
  const { t } = useLanguageStore();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t.dashboard.upcomingTimeline}
      </h3>
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700"
          >
            {/* Date badge */}
            <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#987012] to-[#D4B85A] flex flex-col items-center justify-center text-white">
              <span className="text-xs font-medium leading-none">
                {new Date(event.date).toLocaleDateString('ar-SA', { month: 'short' })}
              </span>
              <span className="text-lg font-bold leading-none mt-0.5">
                {new Date(event.date).getDate()}
              </span>
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{event.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{event.location}</p>
              <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#987012]/10 dark:bg-[#D4B85A]/10 text-[#987012] dark:text-[#D4B85A]">
                {event.daysUntil} {t.dashboard.daysUntilEvent}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
