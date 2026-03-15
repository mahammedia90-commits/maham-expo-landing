'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight,
  BarChart3, Users, Eye, ShoppingBag, Calendar, Download, Zap, Award
} from 'lucide-react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';

export default function AnalyticsPage() {
  const { language, isRtl } = useLanguageStore();
  const isAr = language === 'ar';

  const kpis = [
    { label: isAr ? 'إجمالي الإيرادات' : 'Total Revenue', value: '245,000', unit: isAr ? 'ر.س' : 'SAR', change: '+23%', up: true, icon: DollarSign, color: '#4ADE80' },
    { label: isAr ? 'الحجوزات' : 'Bookings', value: '18', change: '+12%', up: true, icon: ShoppingBag, color: '#C5A55A' },
    { label: isAr ? 'الزوار' : 'Visitors', value: '3,420', change: '+8%', up: true, icon: Users, color: '#60A5FA' },
    { label: isAr ? 'معدل التحويل' : 'Conversion Rate', value: '4.2%', change: '-1.5%', up: false, icon: TrendingUp, color: '#F472B6' },
  ];

  const monthlyRevenue = useMemo(() => {
    const monthsAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const values = [12000, 19000, 28000, 35000, 22000, 41000, 38000, 45000, 32000, 50000, 0, 0];
    return (isAr ? monthsAr : monthsEn).map((month, i) => ({ month, value: values[i] }));
  }, [isAr]);

  const bookingsOverTime = useMemo(() => {
    const weeks = isAr
      ? ['أسبوع 1', 'أسبوع 2', 'أسبوع 3', 'أسبوع 4', 'أسبوع 5', 'أسبوع 6', 'أسبوع 7', 'أسبوع 8']
      : ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'];
    const values = [2, 5, 3, 7, 4, 8, 6, 9];
    return weeks.map((w, i) => ({ week: w, value: values[i] }));
  }, [isAr]);

  const visitorSources = [
    { source: isAr ? 'بحث مباشر' : 'Direct Search', value: 42, color: '#C5A55A' },
    { source: isAr ? 'وسائل التواصل' : 'Social Media', value: 28, color: '#60A5FA' },
    { source: isAr ? 'إعلانات مدفوعة' : 'Paid Ads', value: 18, color: '#4ADE80' },
    { source: isAr ? 'إحالات' : 'Referrals', value: 12, color: '#F472B6' },
  ];

  const topExpos = [
    { name: isAr ? 'معرض الرياض للتقنية' : 'Riyadh Tech Expo', revenue: 85000, bookings: 6, rating: 4.9 },
    { name: isAr ? 'معرض الغذاء والضيافة' : 'Food & Hospitality Expo', revenue: 62000, bookings: 4, rating: 4.7 },
    { name: isAr ? 'معرض العقارات' : 'Real Estate Expo', revenue: 48000, bookings: 3, rating: 4.5 },
    { name: isAr ? 'معرض السيارات' : 'Auto Expo', revenue: 50000, bookings: 5, rating: 4.8 },
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.value), 1);
  const maxBooking = Math.max(...bookingsOverTime.map(b => b.value), 1);

  return (
    <div className="space-y-5 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
            {isAr ? 'التحليلات' : 'Analytics'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAr ? 'لوحة التحليلات والتقارير' : 'Analytics & Reports Dashboard'}
          </p>
        </div>
        <button
          onClick={() => alert(isAr ? 'جاري إنشاء التقرير...' : 'Generating report...')}
          className="px-4 py-2 rounded-lg text-sm border border-border/50 bg-card hover:bg-accent/50 transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          {isAr ? 'تصدير' : 'Export'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-4 rounded-xl bg-card border border-border/50"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${k.color}15` }}>
                <k.icon className="w-4 h-4" style={{ color: k.color }} />
              </div>
              <span className={`text-xs font-medium flex items-center gap-0.5 ${k.up ? 'text-green-400' : 'text-red-400'}`}>
                {k.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {k.change}
              </span>
            </div>
            <p className="text-xl font-bold">{k.value} {k.unit && <span className="text-sm font-normal text-muted-foreground">{k.unit}</span>}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-5 rounded-xl bg-card border border-border/50"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#C5A55A]" />
            {isAr ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
          </h3>
          <span className="text-xs text-muted-foreground">2026</span>
        </div>
        <div className="flex items-end gap-1 sm:gap-2" style={{ height: 200 }}>
          {monthlyRevenue.map((item, i) => {
            const heightPct = (item.value / maxRevenue) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                {item.value > 0 && (
                  <span className="text-[10px] text-[#C5A55A] font-medium">{(item.value / 1000).toFixed(0)}K</span>
                )}
                <div
                  className="w-full rounded-t-sm transition-all hover:opacity-80"
                  style={{ height: `${Math.max(heightPct, 2)}%`, background: 'linear-gradient(to top, #C5A55A, #E8D5A3)', minHeight: item.value > 0 ? 8 : 2, opacity: item.value > 0 ? 1 : 0.2 }}
                />
                <span className="text-[10px] text-muted-foreground truncate w-full text-center">{item.month}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Bookings Over Time */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="p-5 rounded-xl bg-card border border-border/50"
      >
        <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-[#C5A55A]" />
          {isAr ? 'الحجوزات عبر الزمن' : 'Bookings Over Time'}
        </h3>
        <div className="flex items-end gap-2 sm:gap-3" style={{ height: 160 }}>
          {bookingsOverTime.map((item, i) => {
            const heightPct = (item.value / maxBooking) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground font-medium">{item.value}</span>
                <div
                  className="w-full rounded-t-sm"
                  style={{ height: `${heightPct}%`, backgroundColor: '#60A5FA', minHeight: 4 }}
                />
                <span className="text-[9px] text-muted-foreground truncate w-full text-center">{item.week}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Visitor Sources */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-xl bg-card border border-border/50"
        >
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
            <Eye className="w-4 h-4 text-[#C5A55A]" />
            {isAr ? 'مصادر الزوار' : 'Visitor Sources'}
          </h3>
          <div className="flex justify-center mb-4">
            <div className="relative w-[130px] h-[130px]">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {(() => {
                  const total = visitorSources.reduce((a, c) => a + c.value, 0);
                  let cumulative = 0;
                  return visitorSources.map((src, i) => {
                    const pct = (src.value / total) * 100;
                    const dashArray = `${pct * 2.51327} ${251.327}`;
                    const dashOffset = -(cumulative / 100) * 251.327;
                    cumulative += pct;
                    return <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={src.color} strokeWidth="15" strokeDasharray={dashArray} strokeDashoffset={dashOffset} />;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">{visitorSources.reduce((a, c) => a + c.value, 0)}%</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {visitorSources.map((src, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: src.color }} />
                  <span className="text-xs">{src.source}</span>
                </div>
                <span className="text-xs font-bold">{src.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Performing Expos */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="p-5 rounded-xl bg-card border border-border/50"
        >
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-[#C5A55A]" />
            {isAr ? 'أفضل المعارض أداءً' : 'Top Performing Expos'}
          </h3>
          <div className="space-y-3">
            {topExpos.map((expo, i) => (
              <div key={i} className="p-3 rounded-lg bg-accent/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#C5A55A]/10 text-[#C5A55A] text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{expo.name}</p>
                    <p className="text-[10px] text-muted-foreground">{expo.bookings} {isAr ? 'حجوزات' : 'bookings'} | {expo.rating} <Star className="w-2.5 h-2.5 inline text-yellow-400 fill-yellow-400" /></p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#C5A55A]">{(expo.revenue / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-5 rounded-xl bg-card border border-border/50"
      >
        <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-[#C5A55A]" />
          {isAr ? 'مؤشرات الأداء' : 'Performance Metrics'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: isAr ? 'متوسط قيمة الحجز' : 'Avg Booking Value', value: '13,600', suffix: isAr ? 'ر.س' : 'SAR', color: '#C5A55A' },
            { label: isAr ? 'رضا العملاء' : 'Customer Satisfaction', value: '4.7/5', suffix: '', color: '#4ADE80' },
            { label: isAr ? 'معدل الإشغال' : 'Occupancy Rate', value: '78%', suffix: '', color: '#60A5FA' },
            { label: isAr ? 'معدل التكرار' : 'Repeat Rate', value: '34%', suffix: '', color: '#A78BFA' },
          ].map((m, i) => (
            <div key={i} className="p-3 rounded-lg bg-accent/30 text-center">
              <p className="text-lg font-bold" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{m.suffix && <span className="text-xs">{m.suffix} </span>}{m.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function Star(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
