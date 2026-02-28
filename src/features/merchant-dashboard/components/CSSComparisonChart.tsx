'use client';

import { useLanguageStore } from '@/shared/store/useLanguageStore';

interface CSSComparisonChartProps {
  data: { label: string; actual: number; goal: number }[];
  title: string;
  height?: number;
}

export function CSSComparisonChart({ data, title, height = 200 }: CSSComparisonChartProps) {
  const { t, isRtl } = useLanguageStore();
  const maxValue = Math.max(...data.flatMap((d) => [d.actual, d.goal]), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[#987012]" />
            <span className="text-xs text-gray-500 dark:text-gray-400">{t.dashboard.actual}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gray-300 dark:bg-gray-600" />
            <span className="text-xs text-gray-500 dark:text-gray-400">{t.dashboard.goal}</span>
          </div>
        </div>
      </div>
      <div className={`flex items-end gap-3 sm:gap-5 ${isRtl ? 'flex-row-reverse' : ''}`} style={{ height }}>
        {data.map((item, i) => {
          const actualHeight = (item.actual / maxValue) * 100;
          const goalHeight = (item.goal / maxValue) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="flex items-end gap-1 w-full justify-center group relative">
                <div
                  className="w-[35%] max-w-[18px] rounded-t-md transition-all duration-700 ease-out bg-[#987012]"
                  style={{ height: `${actualHeight}%`, minHeight: 4 }}
                />
                <div
                  className="w-[35%] max-w-[18px] rounded-t-md transition-all duration-700 ease-out bg-gray-300 dark:bg-gray-600"
                  style={{ height: `${goalHeight}%`, minHeight: 4 }}
                />
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {item.actual.toLocaleString()} / {item.goal.toLocaleString()}
                </div>
              </div>
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 text-center leading-tight">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
