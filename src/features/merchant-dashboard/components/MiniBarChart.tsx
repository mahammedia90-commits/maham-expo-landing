'use client';

interface MiniBarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  barColor?: string;
}

export function MiniBarChart({ data, height = 120, barColor = '#987012' }: MiniBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((item, i) => {
        const barHeight = (item.value / maxValue) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full relative group">
              <div
                className="w-full rounded-t-sm transition-all duration-700 ease-out"
                style={{
                  height: `${barHeight}%`,
                  minHeight: 4,
                  backgroundColor: barColor,
                  opacity: 0.7 + (barHeight / 100) * 0.3,
                }}
              />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.value.toLocaleString()}
              </div>
            </div>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate w-full text-center">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
