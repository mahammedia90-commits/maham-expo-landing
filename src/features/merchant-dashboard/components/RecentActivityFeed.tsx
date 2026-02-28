'use client';

import { useLanguageStore } from '@/shared/store/useLanguageStore';
import type { RecentActivity } from '@/shared/types';

const activityColors: Record<RecentActivity['type'], string> = {
  payment: 'bg-green-500',
  booking: 'bg-blue-500',
  document: 'bg-yellow-500',
  order: 'bg-indigo-500',
  permit: 'bg-teal-500',
};

interface RecentActivityFeedProps {
  activities: RecentActivity[];
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  const { t, isRtl } = useLanguageStore();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t.dashboard.recentActivity}
      </h3>
      <div className="space-y-0">
        {activities.map((activity, index) => (
          <div key={activity.id} className={`flex items-start gap-3 ${index < activities.length - 1 ? 'pb-4' : ''}`}>
            {/* Timeline dot and line */}
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full shrink-0 ${activityColors[activity.type]}`} />
              {index < activities.length - 1 && (
                <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-1" style={{ minHeight: 32 }} />
              )}
            </div>
            {/* Content */}
            <div className={`flex-1 min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{activity.description}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {new Date(activity.timestamp).toLocaleDateString('ar-SA', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
