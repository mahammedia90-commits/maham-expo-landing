'use client';

import { useLanguageStore } from '@/shared/store/useLanguageStore';

interface CSSBarChartProps {
  data: { label: string; value: number }[];
  title: string;
  height?: number;
  barColor?: string;
  suffix?: string;
}

export function CSSBarChart({ data, title, height = 200, barColor = '#987012', suffix = '' }: CSSBarChartProps) {
  const { isRtl } = useLanguageStore();
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{title}</h3>
      <div className={`flex items-end gap-2 sm:gap-4 ${isRtl ? 'flex-row-reverse' : ''}`} style={{ height }}>
        {data.map((item, i) => {
          const barHeight = (item.value / maxValue) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="relative group w-full flex justify-center">
                <div
                  className="w-full max-w-[40px] rounded-t-lg transition-all duration-700 ease-out hover:opacity-90"
                  style={{
                    height: `${barHeight}%`,
                    minHeight: 8,
                    backgroundColor: barColor,
                  }}
                />
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-600 text-white text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {item.value.toLocaleString()}{suffix}
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
