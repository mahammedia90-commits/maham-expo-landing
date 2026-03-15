'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CalendarCheck, FileText, CreditCard, Building2, MapPin,
  BarChart3, TrendingUp, Zap, Sparkles, Bell, ArrowUpRight,
  Package, Clock, CheckCircle, XCircle, AlertTriangle,
} from 'lucide-react';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { events2026 } from '@/features/merchant-dashboard/data/events2026';

// ── Animation variants ──
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

// ── Mock data (no backend yet) ──
const mockBookings: Array<{
  id: string;
  status: string;
  expoNameAr: string;
  expoNameEn: string;
  boothAr: string;
  boothEn: string;
  price: number;
}> = [];

const mockContracts: Array<{ id: string; signed: boolean }> = [];
const mockPayments: Array<{ status: string; amount: number }> = [];
const mockNotifications: Array<{
  id: string;
  type: 'booking' | 'payment' | 'contract';
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  read: boolean;
}> = [];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { language, isRtl } = useLanguageStore();
  const isAr = language === 'ar';

  // ── Derived data ──
  const bookings = mockBookings;
  const contracts = mockContracts;
  const payments = mockPayments;
  const notifications = mockNotifications;

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending_review').length;
  const totalContracts = contracts.length;
  const unsignedContracts = contracts.filter(c => !c.signed).length;
  const totalPaid = payments.filter(p => p.status === 'completed').reduce((a, p) => a + p.amount, 0);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const activeExpos = events2026.filter(e => e.status === 'open' || e.status === 'closing_soon');
  const upcomingExpos = events2026
    .filter(e => e.status === 'open' || e.status === 'upcoming' || e.status === 'closing_soon')
    .slice(0, 4);

  const hasPendingActions = unsignedContracts > 0 || pendingBookings > 0;

  // ── Stats cards ──
  const stats = [
    {
      icon: CalendarCheck,
      label: isAr ? 'حجوزاتي' : 'My Bookings',
      value: String(totalBookings),
      sub: isAr ? `${pendingBookings} قيد المراجعة` : `${pendingBookings} pending`,
      color: '#C5A55A',
      href: '/dashboard/bookings',
    },
    {
      icon: FileText,
      label: isAr ? 'عقودي' : 'My Contracts',
      value: String(totalContracts),
      sub: isAr ? `${unsignedContracts} بانتظار التوقيع` : `${unsignedContracts} unsigned`,
      color: '#38BDF8',
      href: '/dashboard/contracts',
    },
    {
      icon: CreditCard,
      label: isAr ? 'إجمالي المدفوعات' : 'Total Spent',
      value: totalPaid > 0 ? `${(totalPaid / 1000).toFixed(0)}K` : '0',
      sub: isAr ? 'ر.س' : 'SAR',
      color: '#4ADE80',
      href: '/dashboard/payments',
    },
    {
      icon: Building2,
      label: isAr ? 'المعارض المتاحة' : 'Available Expos',
      value: String(activeExpos.length),
      sub: isAr ? 'معرض نشط' : 'active expos',
      color: '#A78BFA',
      href: '/dashboard/expos',
    },
  ];

  // ── Smart recommendations ──
  const recommendations = [
    {
      icon: TrendingUp,
      title: isAr ? 'أجنحة ذات حركة عالية' : 'High Traffic Booths',
      desc: isAr ? 'الأجنحة القريبة من المدخل تحقق 40% زيارات أكثر' : 'Booths near the entrance get 40% more visits',
      color: '#4ADE80',
    },
    {
      icon: Zap,
      title: isAr ? 'عرض الحجز المبكر' : 'Early Bird Offer',
      desc: isAr ? 'احجز قبل 30 يوم واحصل على خصم 15%' : 'Book 30 days early and get 15% off',
      color: '#F59E0B',
    },
    {
      icon: BarChart3,
      title: isAr ? 'تحليل المنافسين' : 'Competitor Analysis',
      desc: isAr ? '3 منافسين حجزوا في نفس المعرض' : '3 competitors booked at the same expo',
      color: '#38BDF8',
    },
    {
      icon: MapPin,
      title: isAr ? 'معارض مقترحة' : 'Suggested Expos',
      desc: isAr ? 'معارض تناسب نشاطك التجاري' : 'Expos that match your business',
      color: '#A78BFA',
    },
  ];

  // ── Quick actions ──
  const quickActions = [
    { icon: Building2, label: isAr ? 'تصفح المعارض' : 'Browse Expos', href: '/dashboard/expos', color: '#C5A55A' },
    { icon: MapPin, label: isAr ? 'الخريطة التفاعلية' : 'Interactive Map', href: '/dashboard/map', color: '#38BDF8' },
    { icon: Package, label: isAr ? 'خدمات العارضين' : 'Exhibitor Services', href: '/dashboard/services', color: '#4ADE80' },
    { icon: BarChart3, label: isAr ? 'التحليلات' : 'Analytics', href: '/dashboard/analytics', color: '#A78BFA' },
  ];

  // ── Status helpers ──
  const statusIcon = (s: string) => {
    if (s === 'confirmed' || s === 'active') return <CheckCircle size={14} className="text-green-500" />;
    if (s === 'pending_review' || s === 'pending_payment') return <Clock size={14} className="text-yellow-500" />;
    return <XCircle size={14} className="text-red-500" />;
  };

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      pending_review: isAr ? 'قيد المراجعة' : 'Pending Review',
      pending_payment: isAr ? 'قيد الدفع' : 'Pending Payment',
      confirmed: isAr ? 'مؤكد' : 'Confirmed',
      active: isAr ? 'نشط' : 'Active',
      cancelled: isAr ? 'ملغي' : 'Cancelled',
    };
    return map[s] || s;
  };

  const notificationTypeIcon = (type: string) => {
    if (type === 'booking') return { icon: CalendarCheck, color: '#C5A55A' };
    if (type === 'payment') return { icon: CreditCard, color: '#4ADE80' };
    return { icon: FileText, color: '#A78BFA' };
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-20 lg:pb-6">
      {/* ═══ Welcome Header ═══ */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}
          >
            {isAr ? 'مرحباً' : 'Welcome'}، <span className="gold-gradient-text">{user?.name}</span>
          </h1>
          <p className="text-sm t-muted mt-1">{isAr ? 'نظرة عامة على لوحة التحكم' : 'Dashboard overview'}</p>
        </div>
        <Link href="/dashboard/notifications">
          <button className="relative p-2 rounded-lg border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] transition-colors bg-[var(--glass-bg)]">
            <Bell className="w-4 h-4 t-secondary" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
                {unreadNotifications}
              </span>
            )}
          </button>
        </Link>
      </motion.div>

      {/* ═══ Stats Grid ═══ */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Link key={i} href={s.href}>
            <motion.div
              whileHover={{ y: -2, scale: 1.01 }}
              className="p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${s.color}15` }}
                >
                  <s.icon size={18} style={{ color: s.color }} strokeWidth={1.8} />
                </div>
                <ArrowUpRight size={14} className="t-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-2xl font-bold t-primary">{s.value}</p>
              <p className="text-xs t-tertiary font-medium mt-0.5">{s.label}</p>
              <p className="text-[11px] t-muted mt-1">{s.sub}</p>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* ═══ 3-Column Grid ═══ */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Left 2 Columns ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Required */}
          {hasPendingActions && (
            <motion.div variants={item} className="p-4 rounded-xl bg-[#C5A55A]/5 border border-[#C5A55A]/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} style={{ color: '#C5A55A' }} />
                <h3 className="text-sm font-bold t-primary">
                  {isAr ? 'إجراءات مطلوبة' : 'Action Required'}
                </h3>
              </div>
              <div className="space-y-2">
                {unsignedContracts > 0 && (
                  <Link href="/dashboard/contracts">
                    <div className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#C5A55A]/5 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <FileText size={14} style={{ color: '#FBBF24' }} />
                        <span className="text-sm t-secondary">
                          {isAr ? `${unsignedContracts} عقد بانتظار التوقيع` : `${unsignedContracts} contracts awaiting signature`}
                        </span>
                      </div>
                      <ArrowUpRight size={14} className="t-muted" />
                    </div>
                  </Link>
                )}
                {pendingBookings > 0 && (
                  <Link href="/dashboard/bookings">
                    <div className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#C5A55A]/5 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <Clock size={14} style={{ color: '#38BDF8' }} />
                        <span className="text-sm t-secondary">
                          {isAr ? `${pendingBookings} حجز قيد المراجعة` : `${pendingBookings} bookings pending review`}
                        </span>
                      </div>
                      <ArrowUpRight size={14} className="t-muted" />
                    </div>
                  </Link>
                )}
              </div>
            </motion.div>
          )}

          {/* Recent Activity */}
          <motion.div variants={item} className="p-5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell size={16} className="t-gold" />
                <h3 className="text-sm font-bold t-primary">{isAr ? 'النشاط الأخير' : 'Recent Activity'}</h3>
              </div>
              <Link href="/dashboard/notifications">
                <span className="text-xs t-gold hover:underline cursor-pointer font-medium">
                  {isAr ? 'عرض الكل' : 'View All'}
                </span>
              </Link>
            </div>
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell size={24} className="t-muted mx-auto mb-2 opacity-40" />
                <p className="text-sm t-muted">{isAr ? 'لا توجد بيانات' : 'No data available'}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.slice(0, 5).map((n) => {
                  const typeInfo = notificationTypeIcon(n.type);
                  return (
                    <div key={n.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[var(--dash-bg-subtle)] transition-colors">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: `${typeInfo.color}15` }}
                      >
                        <typeInfo.icon size={14} style={{ color: typeInfo.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm t-primary font-medium truncate">{isAr ? n.titleAr : n.titleEn}</p>
                        <p className="text-xs t-muted truncate mt-0.5">{isAr ? n.messageAr : n.messageEn}</p>
                      </div>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#C5A55A] shrink-0 mt-2" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Smart Recommendations */}
          <motion.div variants={item} className="p-5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="t-gold" />
              <h3 className="text-sm font-bold t-primary">{isAr ? 'توصيات ذكية لك' : 'Smart Recommendations'}</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {recommendations.map((r, i) => (
                <div key={i} className="p-3 rounded-lg bg-[var(--dash-bg-subtle)] hover:bg-[var(--glass-bg-hover)] transition-colors cursor-pointer">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${r.color}15` }}
                    >
                      <r.icon size={14} style={{ color: r.color }} />
                    </div>
                    <p className="text-sm font-semibold t-primary">{r.title}</p>
                  </div>
                  <p className="text-xs t-muted leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Bookings Table */}
          {bookings.length > 0 && (
            <motion.div variants={item} className="p-5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CalendarCheck size={16} className="t-gold" />
                  <h3 className="text-sm font-bold t-primary">{isAr ? 'آخر الحجوزات' : 'Recent Bookings'}</h3>
                </div>
                <Link href="/dashboard/bookings">
                  <span className="text-xs t-gold hover:underline cursor-pointer font-medium">
                    {isAr ? 'عرض الكل' : 'View All'}
                  </span>
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--glass-border)]">
                      <th className="text-start pb-2 text-xs t-muted font-medium">{isAr ? 'رقم الطلب' : 'Order'}</th>
                      <th className="text-start pb-2 text-xs t-muted font-medium">{isAr ? 'المعرض' : 'Expo'}</th>
                      <th className="text-start pb-2 text-xs t-muted font-medium">{isAr ? 'الجناح' : 'Booth'}</th>
                      <th className="text-start pb-2 text-xs t-muted font-medium">{isAr ? 'السعر' : 'Price'}</th>
                      <th className="text-start pb-2 text-xs t-muted font-medium">{isAr ? 'الحالة' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((b, i) => (
                      <tr key={i} className="border-b border-[var(--glass-border)] last:border-b-0 hover:bg-[var(--table-row-hover)]">
                        <td className="py-2.5 text-xs t-secondary font-mono">{b.id}</td>
                        <td className="py-2.5 text-xs t-primary">{isAr ? b.expoNameAr : b.expoNameEn}</td>
                        <td className="py-2.5 text-xs t-secondary">{isAr ? b.boothAr : b.boothEn}</td>
                        <td className="py-2.5 text-xs t-secondary">
                          {b.price.toLocaleString()} {isAr ? 'ر.س' : 'SAR'}
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-1.5">
                            {statusIcon(b.status)}
                            <span className="text-xs">{statusLabel(b.status)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Right Column ── */}
        <div className="space-y-6">
          {/* Upcoming Expos */}
          <motion.div variants={item} className="p-5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="t-gold" />
                <h3 className="text-sm font-bold t-primary">{isAr ? 'معارض قادمة' : 'Upcoming Expos'}</h3>
              </div>
              <Link href="/dashboard/expos">
                <span className="text-xs t-gold hover:underline cursor-pointer font-medium">
                  {isAr ? 'الكل' : 'All'}
                </span>
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingExpos.map((expo, i) => (
                <Link key={i} href={`/dashboard/expos/${expo.id}`}>
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-[var(--dash-bg-subtle)] transition-colors cursor-pointer">
                    <img
                      src={expo.image}
                      alt={isAr ? expo.nameAr : expo.nameEn}
                      className="w-14 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium t-primary truncate">{isAr ? expo.nameAr : expo.nameEn}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin size={11} className="t-muted shrink-0" />
                        <span className="text-[11px] t-muted truncate">{isAr ? expo.city : expo.cityEn}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <CalendarCheck size={11} className="t-muted shrink-0" />
                        <span className="text-[11px] t-muted">{expo.dateStart}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={item} className="p-5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
            <h3 className="text-sm font-bold t-primary mb-4">{isAr ? 'إجراءات سريعة' : 'Quick Actions'}</h3>
            <div className="space-y-2">
              {quickActions.map((a, i) => (
                <Link key={i} href={a.href}>
                  <div className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[var(--dash-bg-subtle)] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${a.color}15` }}
                      >
                        <a.icon size={14} style={{ color: a.color }} />
                      </div>
                      <span className="text-sm t-secondary font-medium">{a.label}</span>
                    </div>
                    <ArrowUpRight size={14} className="t-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* AI Assistant Card */}
          <motion.div
            variants={item}
            className="p-5 rounded-xl bg-gradient-to-br from-[#C5A55A]/10 to-[#E8D5A3]/5 border border-[#C5A55A]/20"
          >
            <Sparkles className="w-8 h-8 text-[#C5A55A] mb-3" />
            <h3
              className="text-base font-bold t-primary mb-1"
              style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}
            >
              {isAr ? 'المساعد الذكي' : 'AI Assistant'}
            </h3>
            <p className="text-xs t-muted leading-relaxed mb-4">
              {isAr
                ? 'اسأل MAHAM AI عن أفضل الأجنحة والتوصيات المخصصة لنشاطك'
                : 'Ask MAHAM AI about the best booths and personalized recommendations for your business'}
            </p>
            <Link href="/dashboard/ai-assistant">
              <button className="btn-gold px-4 py-2 rounded-xl text-xs font-bold w-full">
                {isAr ? 'ابدأ المحادثة' : 'Start Chat'}
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
