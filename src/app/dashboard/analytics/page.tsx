'use client';

/**
 * Analytics — AI-powered analytics dashboard with real data
 * Adapted from reference project for Next.js App Router
 */
import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Download, Brain, Sparkles, Target, Building2, Calendar } from "lucide-react";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { useLanguageStore } from "@/shared/store/useLanguageStore";
import { useThemeStore } from "@/shared/store/useThemeStore";
import { events2026, eventStats } from "@/features/merchant-dashboard/data/events2026";

// Use empty arrays since we don't have the full auth context for bookings/payments/contracts
const bookings: any[] = [];
const payments: any[] = [];

export default function AnalyticsPage() {
  const { language, isRtl } = useLanguageStore();
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const isAr = language === 'ar';

  const totalPaid = payments.filter((p: any) => p.status === "completed").reduce((a: number, p: any) => a + p.amount, 0);
  const totalBookingValue = bookings.reduce((a: number, b: any) => a + b.price, 0);
  const confirmedBookings = bookings.filter((b: any) => b.status === "confirmed").length;
  const occupancyRate = eventStats.totalUnits > 0 ? Math.round(((eventStats.totalUnits - eventStats.availableUnits) / eventStats.totalUnits) * 100) : 0;

  const categoryDist = useMemo(() => {
    const map = new Map<string, number>();
    events2026.forEach(e => { map.set(e.category, (map.get(e.category) || 0) + 1); });
    const colors = ["#C5A55A", "#E8D5A3", "#60A5FA", "#4ADE80", "#F472B6", "#A78BFA", "#FB923C"];
    return Array.from(map.entries()).map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }));
  }, []);

  const eventTimeline = useMemo(() => {
    const monthKeysAr = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
    const monthKeysEn = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const months = isAr ? monthKeysAr : monthKeysEn;
    const counts = new Array(12).fill(0);
    events2026.forEach(e => { const m = new Date(e.dateStart).getMonth(); if (!isNaN(m)) counts[m]++; });
    return months.map((month, i) => ({ month, value: counts[i] }));
  }, [isAr]);

  const cityDist = useMemo(() => {
    const map = new Map<string, number>();
    events2026.forEach(e => { map.set(e.city, (map.get(e.city) || 0) + e.totalUnits); });
    return Array.from(map.entries()).map(([day, visitors]) => ({ day, visitors }));
  }, []);

  const aiInsights = useMemo(() => {
    const insights: { icon: any; text: string; type: "success" | "warning" | "info" }[] = [];
    const closingSoon = events2026.filter(e => e.status === "closing_soon");
    if (closingSoon.length > 0) {
      insights.push({ icon: Target, text: `${closingSoon.length} ${isAr ? 'فعاليات ستُغلق قريبًا — بادر بالحجز' : 'events closing soon — book now'}`, type: "warning" });
    }
    const pendingPayments = bookings.filter((b: any) => b.paymentStatus !== "fully_paid");
    if (pendingPayments.length > 0) {
      insights.push({ icon: DollarSign, text: `${pendingPayments.length} ${isAr ? 'مدفوعات معلقة تحتاج إلى إكمال' : 'pending payments need completion'}`, type: "warning" });
    }
    const topEvent = events2026.reduce((a, b) => a.rating > b.rating ? a : b);
    const eName = isAr ? topEvent.nameAr : topEvent.nameEn;
    insights.push({ icon: Sparkles, text: `${isAr ? 'الأعلى تقييمًا' : 'Top Rated'}: ${eName} (${topEvent.rating}/5) — ${topEvent.availableUnits} ${isAr ? 'وحدة متاحة' : 'units available'}`, type: "info" });
    insights.push({ icon: Building2, text: `${isAr ? 'الإجمالي' : 'Total'} ${eventStats.totalUnits.toLocaleString()} ${isAr ? 'وحدة عبر' : 'units across'} ${eventStats.totalEvents} ${isAr ? 'فعالية' : 'events'} — ${occupancyRate}% ${isAr ? 'إشغال' : 'occupancy'}`, type: "success" });
    return insights;
  }, [occupancyRate, isAr]);

  const kpis = [
    { label: isAr ? "إجمالي المدفوعات" : "Total Paid", value: totalPaid > 0 ? `${(totalPaid / 1000).toFixed(0)}K` : "0", change: "+23%", up: true, icon: DollarSign, color: "#4ADE80" },
    { label: isAr ? "عدد الحجوزات" : "Bookings Count", value: String(bookings.length), change: bookings.length > 0 ? "+100%" : "0%", up: bookings.length > 0, icon: BarChart3, color: "#C5A55A" },
    { label: isAr ? "نسبة الإشغال" : "Occupancy Rate", value: `${occupancyRate}%`, change: "+5%", up: true, icon: TrendingUp, color: "#60A5FA" },
    { label: isAr ? "فعاليات مفتوحة" : "Open Events", value: String(eventStats.openEvents), change: `${eventStats.totalEvents} ${isAr ? 'إجمالي' : 'total'}`, up: true, icon: Calendar, color: "#E8D5A3" },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gold-gradient" style={{ fontFamily: "'Playfair Display', 'IBM Plex Sans Arabic', serif" }}>{isAr ? 'التحليلات' : 'Analytics'}</h2>
          <p className="text-[10px] t-gold/50 font-['Inter']">AI-Powered Analytics & Reports</p>
        </div>
        <button
          onClick={() => {
            alert(isAr ? 'جاري إنشاء التقرير...' : 'Generating report...');
          }}
          className="glass-card px-3 py-2 rounded-xl text-[11px] t-gold flex items-center gap-1.5"
          style={{ border: "1px solid var(--gold-border)" }}
        >
          <Download size={13} />
          <span className="hidden sm:inline">{isAr ? 'تصدير التقرير' : 'Export Report'}</span>
          <span className="sm:hidden">PDF</span>
        </button>
      </div>

      {/* AI Insights */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5" style={{ borderColor: "var(--gold-border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Brain size={16} className="t-gold" />
          <h3 className="text-xs sm:text-sm font-bold t-primary">{isAr ? 'رؤى الذكاء الاصطناعي' : 'AI Insights'}</h3>
        </div>
        <div className="space-y-2">
          {aiInsights.map((ins, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ backgroundColor: "var(--glass-bg)" }}>
              <ins.icon size={13} className={ins.type === "success" ? "text-[var(--status-green)]" : ins.type === "warning" ? "text-[var(--status-yellow)]" : "t-gold"} style={{ flexShrink: 0, marginTop: 2 }} />
              <p className="text-[11px] t-secondary">{ins.text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {kpis.map((k, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center" style={{ backgroundColor: `${k.color}12` }}>
                <k.icon size={14} style={{ color: k.color }} />
              </div>
              <span className={`text-[10px] font-medium flex items-center gap-0.5 ${k.up ? "text-[var(--status-green)]" : "text-[var(--status-red)]"}`}>
                {k.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {k.change}
              </span>
            </div>
            <p className="text-lg sm:text-xl font-bold t-primary font-['Inter']">{k.value}</p>
            <p className="text-[10px] sm:text-xs t-secondary mt-0.5">{k.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Event Timeline Chart — CSS-based bars */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6">
        <h3 className="text-xs sm:text-sm font-bold t-primary mb-1">{isAr ? 'التوزيع الشهري للفعاليات' : 'Monthly Event Distribution'}</h3>
        <div className="mt-3 flex items-end gap-1 sm:gap-2" style={{ height: 220 }}>
          {eventTimeline.map((item, i) => {
            const maxVal = Math.max(...eventTimeline.map(e => e.value), 1);
            const heightPct = (item.value / maxVal) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] t-gold font-['Inter']">{item.value || ''}</span>
                <div className="w-full rounded-t-sm" style={{ height: `${Math.max(heightPct, 2)}%`, backgroundColor: "#C5A55A", minHeight: item.value > 0 ? 8 : 2 }} />
                <span className="text-[8px] sm:text-[9px] t-muted truncate w-full text-center">{item.month}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Revenue Breakdown */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6">
        <h3 className="text-xs sm:text-sm font-bold t-primary mb-3">{isAr ? "تفاصيل الإيرادات" : "Revenue Breakdown"}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: isAr ? "حجوزات الأجنحة" : "Booth Bookings", value: `${(totalBookingValue / 1000).toFixed(0)}K`, pct: "65%", color: "#C5A55A" },
            { label: isAr ? "خدمات تشغيلية" : "Operations", value: "12K", pct: "18%", color: "#4ADE80" },
            { label: isAr ? "رعايات" : "Sponsorships", value: "8K", pct: "12%", color: "#60A5FA" },
            { label: isAr ? "خدمات إضافية" : "Add-ons", value: "3K", pct: "5%", color: "#F472B6" },
          ].map((r, i) => (
            <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: "var(--glass-bg)" }}>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="text-[10px] t-tertiary">{r.label}</span>
              </div>
              <p className="text-base font-bold t-primary font-['Inter']">{r.value}</p>
              <div className="w-full h-1 rounded-full mt-2" style={{ backgroundColor: "var(--glass-bg)" }}>
                <div className="h-full rounded-full" style={{ width: r.pct, backgroundColor: r.color }} />
              </div>
              <p className="text-[9px] t-muted mt-1 font-['Inter']">{r.pct}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Category + City */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Category Distribution — CSS donut */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6">
          <h3 className="text-xs sm:text-sm font-bold t-primary mb-3">{isAr ? 'حسب الفئة' : 'By Category'}</h3>
          <div className="flex justify-center mb-4" style={{ height: 160 }}>
            <div className="relative w-[130px] h-[130px] sm:w-[150px] sm:h-[150px]">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {(() => {
                  const total = categoryDist.reduce((a, c) => a + c.value, 0);
                  let cumulative = 0;
                  return categoryDist.map((cat, i) => {
                    const pct = (cat.value / total) * 100;
                    const dashArray = `${pct * 2.51327} ${251.327}`;
                    const dashOffset = -(cumulative / 100) * 251.327;
                    cumulative += pct;
                    return (
                      <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={cat.color} strokeWidth="15"
                        strokeDasharray={dashArray} strokeDashoffset={dashOffset} />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs t-muted font-['Inter']">{categoryDist.reduce((a, c) => a + c.value, 0)}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {categoryDist.map((z, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: z.color }} />
                <span className="text-[10px] t-secondary truncate">{z.name}</span>
                <span className="text-[10px] t-muted font-['Inter']">{z.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* City Distribution — CSS horizontal bars */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6">
          <h3 className="text-xs sm:text-sm font-bold t-primary mb-3">{isAr ? 'حسب المدينة' : 'By City'}</h3>
          <div className="space-y-2" style={{ minHeight: 180 }}>
            {(() => {
              const maxVal = Math.max(...cityDist.map(c => c.visitors), 1);
              return cityDist.map((city, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[10px] t-secondary w-16 sm:w-20 truncate text-end">{city.day}</span>
                  <div className="flex-1 h-5 rounded-sm overflow-hidden" style={{ backgroundColor: "var(--glass-bg)" }}>
                    <div className="h-full rounded-sm" style={{ width: `${(city.visitors / maxVal) * 100}%`, background: "linear-gradient(90deg, #C5A55A33, #C5A55A)" }} />
                  </div>
                  <span className="text-[9px] t-muted font-['Inter'] w-8 text-end">{city.visitors}</span>
                </div>
              ));
            })()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
