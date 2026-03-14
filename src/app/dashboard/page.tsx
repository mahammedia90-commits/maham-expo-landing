'use client';

/**
 * Dashboard — Main overview with real stats, recent activity, quick actions
 * Adapted from reference Dashboard.tsx for Next.js App Router
 */
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CalendarCheck, FileText, CreditCard, TrendingUp, MapPin,
  Clock, ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, XCircle,
  Star, Users, Calendar,
  Sparkles, Rocket, Eye,
} from 'lucide-react';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { events2026, eventStats } from '@/features/merchant-dashboard/data/events2026';

const statusIcon = (s: string) => {
  if (s === 'confirmed' || s === 'active') return <CheckCircle size={13} style={{ color: 'var(--status-green)' }} />;
  if (s === 'pending_payment' || s === 'pending_review') return <AlertTriangle size={13} style={{ color: 'var(--status-yellow)' }} />;
  return <XCircle size={13} style={{ color: 'var(--status-red)' }} />;
};

// Mock data (no backend for bookings/contracts/payments yet)
const mockBookings: Array<{
  id: string;
  status: string;
  unitAr: string;
  unitEn: string;
  expoNameAr: string;
  expoNameEn: string;
}> = [];

const mockContracts: Array<{ id: string }> = [];

const mockPayments: Array<{ status: string; amount: number }> = [];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { language, isRtl } = useLanguageStore();

  const isAr = language === 'ar';

  const bookings = mockBookings;
  const contracts = mockContracts;
  const payments = mockPayments;

  const isFirstVisit = bookings.length === 0 && contracts.length === 0;

  const totalPaid = payments.filter(p => p.status === 'completed').reduce((a, p) => a + p.amount, 0);
  const activeBookings = bookings.filter(b => b.status !== 'cancelled').length;
  const signedContracts = contracts.length;

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      pending_payment: isAr ? 'قيد الدفع' : 'Pending Payment',
      confirmed: isAr ? 'مؤكد' : 'Confirmed',
      active: isAr ? 'نشط' : 'Active',
      cancelled: isAr ? 'ملغي' : 'Cancelled',
    };
    return map[s] || s;
  };

  const stats = [
    { icon: CalendarCheck, value: String(activeBookings), label: isAr ? 'الحجوزات النشطة' : 'Active Bookings', color: 'var(--status-green)' },
    { icon: FileText, value: String(signedContracts), label: isAr ? 'العقود' : 'Contracts', color: 'var(--gold-accent)' },
    { icon: CreditCard, value: totalPaid > 0 ? `${(totalPaid / 1000).toFixed(0)}K` : '0', label: isAr ? 'المدفوعات' : 'Total Paid', color: 'var(--status-blue)' },
    { icon: TrendingUp, value: `${eventStats.openEvents}`, label: isAr ? 'الفعاليات المتاحة' : 'Open Events', color: 'var(--gold-light)' },
  ];

  const quickActions = [
    { label: isAr ? 'حجز جديد' : 'Book New', path: '/dashboard/expos', icon: MapPin },
    { label: isAr ? 'عرض العقود' : 'View Contracts', path: '/dashboard/contracts', icon: FileText },
    { label: isAr ? 'إجراء دفعة' : 'Make Payment', path: '/dashboard/payments', icon: CreditCard },
    { label: isAr ? 'طلب تصريح' : 'Request Permit', path: '/dashboard/services', icon: Clock },
  ];

  const upcomingEvents = events2026
    .filter(e => e.status === 'open' || e.status === 'upcoming' || e.status === 'closing_soon')
    .slice(0, 3);

  const needsVerification = user && !(user as any).email_verified;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* FEAT-06: Welcome Screen for first-time users */}
      {isFirstVisit && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl p-6 sm:p-8 text-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(139,105,20,0.06), rgba(139,105,20,0.01))', border: '1px solid var(--gold-border)' }}>
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-accent), transparent)' }} />
          <div className="w-14 h-14 rounded-2xl bg-gold-subtle flex items-center justify-center mx-auto mb-4">
            <Sparkles size={24} className="t-gold" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold t-primary mb-2 tracking-tight">
            {isAr ? `مرحباً ${user?.name || ''}!` : `Welcome ${user?.name || ''}!`}
          </h2>
          <p className="text-xs sm:text-sm t-tertiary mb-6 max-w-md mx-auto leading-relaxed">
            {isAr ? 'ابدأ رحلتك مع Maham Expo — تصفح المعارض واحجز وحدتك في دقائق' : 'Start your journey with Maham Expo — browse exhibitions and book your unit in minutes'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard/expos">
              <button className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 mx-auto sm:mx-0">
                <Rocket size={14} />
                {isAr ? 'تصفح المعارض والفعاليات' : 'Browse Exhibitions & Events'}
              </button>
            </Link>
            {needsVerification && (
              <Link href="/dashboard/kyc">
                <button className="glass-card px-6 py-2.5 rounded-xl text-xs font-medium t-secondary flex items-center gap-2 mx-auto sm:mx-0 hover:border-[var(--gold-border)] transition-all">
                  <Eye size={14} />
                  {isAr ? 'وثّق حسابك أولاً' : 'Verify Your Account First'}
                </button>
              </Link>
            )}
          </div>
        </motion.div>
      )}

      {/* KYC Verification Banner */}
      {needsVerification && !isFirstVisit && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl sm:rounded-2xl p-3 sm:p-5 flex items-center gap-3 sm:gap-4"
          style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(251,191,36,0.02))', border: '1px solid var(--gold-border)' }}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(251,191,36,0.15)' }}>
            <AlertTriangle size={20} style={{ color: 'var(--status-yellow)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-bold t-primary">{isAr ? 'يجب التحقق من حسابك أولاً' : 'Account Verification Required'}</p>
            <p className="text-[12px] sm:text-xs t-tertiary mt-0.5">{isAr ? 'أكمل التحقق من هويتك للوصول إلى جميع الميزات' : 'Complete identity verification to access all features'}</p>
          </div>
          <Link href="/dashboard/kyc">
            <button className="btn-gold px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs whitespace-nowrap shrink-0">
              {isAr ? 'إكمال التحقق' : 'Complete KYC'}
            </button>
          </Link>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
            className="glass-card stat-strip p-3.5 sm:p-5 cursor-default" style={{ '--strip-color': s.color } as React.CSSProperties}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--gold-bg)' }}>
                <s.icon size={16} style={{ color: s.color }} strokeWidth={1.8} />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold t-primary font-['Inter'] tracking-tight">{s.value}</p>
            <p className="text-[12px] sm:text-xs t-tertiary mt-1 font-medium">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="lg:col-span-2 glass-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h3 className="text-sm sm:text-base font-bold t-primary tracking-tight">{isAr ? 'أحدث الحجوزات' : 'Recent Bookings'}</h3>
            <Link href="/dashboard/bookings">
              <span className="text-[11px] sm:text-xs t-gold flex items-center gap-1 cursor-pointer font-medium hover:underline">
                {isAr ? 'عرض الكل' : 'View All'} <ArrowIcon size={11} />
              </span>
            </Link>
          </div>
          <div className="space-y-2 sm:space-y-2.5">
            {bookings.length > 0 ? bookings.slice(0, 4).map((b, i) => (
              <Link key={i} href="/dashboard/bookings">
                <div className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-all cursor-pointer inner-card">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    {statusIcon(b.status)}
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm t-primary truncate font-medium">{isAr ? b.unitAr : b.unitEn} — {isAr ? b.expoNameAr : b.expoNameEn}</p>
                      <p className="text-[11px] sm:text-[12px] t-muted font-['Inter'] truncate">{isAr ? b.unitEn : b.unitAr}</p>
                    </div>
                  </div>
                  <div className={`${isRtl ? 'text-left' : 'text-right'} shrink-0 ${isRtl ? 'mr-2' : 'ml-2'}`}>
                    <p className="text-[12px] sm:text-[11px] t-secondary font-['Inter']">{b.id}</p>
                    <p className="text-[11px] sm:text-[12px] font-medium" style={{ color: b.status === 'confirmed' ? 'var(--status-green)' : 'var(--status-yellow)' }}>{statusLabel(b.status)}</p>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="text-center py-8 sm:py-10">
                <div className="w-12 h-12 rounded-2xl bg-gold-subtle flex items-center justify-center mx-auto mb-3">
                  <CalendarCheck size={20} className="t-gold" style={{ opacity: 0.6 }} />
                </div>
                <p className="text-sm t-primary font-medium mb-1">{isAr ? 'لا توجد حجوزات حالياً' : 'No bookings yet'}</p>
                <Link href="/dashboard/expos">
                  <span className="text-[12px] t-gold cursor-pointer font-medium hover:underline">{isAr ? 'تصفح المعارض وابدأ' : 'Browse expos to get started'}</span>
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-bold t-primary mb-4 sm:mb-5 tracking-tight">{isAr ? 'إجراءات سريعة' : 'Quick Actions'}</h3>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-3">
            {quickActions.map((a, i) => (
              <Link key={i} href={a.path}>
                <div className="flex items-center gap-2.5 sm:gap-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl cursor-pointer transition-all inner-card group">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gold-subtle flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
                    <a.icon size={14} className="t-gold" strokeWidth={1.8} />
                  </div>
                  <p className="text-[12px] sm:text-sm t-secondary truncate font-medium">{a.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Upcoming Events */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="glass-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h3 className="text-sm sm:text-base font-bold t-primary tracking-tight">{isAr ? 'الفعاليات القادمة' : 'Upcoming Events'}</h3>
          <Link href="/dashboard/expos">
            <span className="text-[11px] sm:text-xs t-gold flex items-center gap-1 cursor-pointer font-medium hover:underline">
              {isAr ? 'عرض الكل' : 'View All'} <ArrowIcon size={11} />
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {upcomingEvents.map((e, i) => (
            <Link key={i} href="/dashboard/expos">
              <div className="p-3.5 sm:p-4 rounded-xl cursor-pointer transition-all group inner-card">
                <div className="flex items-start gap-3 mb-3">
                  <img src={e.image} alt={e.nameAr} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 ring-1 ring-[var(--glass-border)]" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold t-primary truncate">{isAr ? e.nameAr : e.nameEn}</p>
                    <p className="text-[11px] sm:text-[12px] t-tertiary font-['Inter'] truncate mt-0.5">{isAr ? e.nameEn : e.nameAr}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-[12px] t-tertiary">
                    <Calendar size={11} strokeWidth={1.8} />
                    <span className="font-['Inter'] font-medium">{e.dateStart}</span>
                  </div>
                  <span className="text-[11px] sm:text-[12px] font-medium" style={{ color: 'var(--status-green)' }}>
                    {e.availableUnits} {isAr ? 'وحدة' : 'units'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] t-muted">
                  <span className="flex items-center gap-1"><MapPin size={11} strokeWidth={1.8} />{isAr ? e.city : e.cityEn}</span>
                  <span className="flex items-center gap-1"><Star size={11} strokeWidth={1.8} style={{ color: 'var(--gold-accent)' }} />{e.rating}</span>
                  <span className="flex items-center gap-1"><Users size={11} strokeWidth={1.8} />{e.footfall.split(' ')[0]}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
