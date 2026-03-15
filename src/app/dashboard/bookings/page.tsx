'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  CalendarCheck, Search, CheckCircle, XCircle, Clock, CreditCard,
  FileText, Plus, ChevronUp, ChevronDown, Download
} from 'lucide-react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useTraderStore } from '@/features/merchant-dashboard/store/useTraderStore';

interface Booking {
  id: string;
  orderId: string;
  expoTitle: string;
  boothId: string;
  zone: string;
  area: number;
  boothType: string;
  price: number;
  status: 'pending_review' | 'approved' | 'pending_payment' | 'paid' | 'rejected' | 'cancelled';
  createdAt: string;
  reviewerNote?: string;
  contractId?: string;
}

export default function Bookings() {
  const { language, isRtl } = useLanguageStore();
  const isAr = language === 'ar';

  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Read bookings from persistent trader store
  const storeBookings = useTraderStore((s) => s.bookings);

  // Map store bookings to page format
  const bookings: Booking[] = storeBookings.map((b) => ({
    id: b.id,
    orderId: b.id,
    expoTitle: isAr ? b.expoNameAr : b.expoNameEn,
    boothId: b.unitAr || b.unitEn,
    zone: b.zone,
    area: parseInt(b.boothSize) || 0,
    boothType: b.boothType,
    price: b.price,
    status: b.status === 'confirmed' || b.status === 'active' ? 'paid' : b.status as Booking['status'],
    createdAt: b.createdAt,
    contractId: b.contractId ?? undefined,
  }));

  const filtered = useMemo(() =>
    bookings.filter(b => {
      const matchStatus = filterStatus === 'all' || b.status === filterStatus;
      const matchSearch = !search || b.orderId.includes(search) || b.expoTitle.includes(search) || b.boothId.includes(search);
      return matchStatus && matchSearch;
    }),
    [bookings, filterStatus, search]
  );

  const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string }> = {
    pending_review: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    approved: { icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    pending_payment: { icon: CreditCard, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    paid: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
    rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
    cancelled: { icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-500/10' },
  };

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      pending_review: isAr ? 'قيد المراجعة' : 'Under Review',
      approved: isAr ? 'تمت الموافقة' : 'Approved',
      pending_payment: isAr ? 'بانتظار الدفع' : 'Pending Payment',
      paid: isAr ? 'مدفوع' : 'Paid',
      rejected: isAr ? 'مرفوض' : 'Rejected',
      cancelled: isAr ? 'ملغي' : 'Cancelled',
    };
    return map[status] || status;
  };

  const counts = useMemo(() => ({
    all: bookings.length,
    pending_review: bookings.filter(b => b.status === 'pending_review').length,
    approved: bookings.filter(b => b.status === 'approved').length,
    paid: bookings.filter(b => b.status === 'paid').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }), [bookings]);

  const getProgressSteps = (status: string) => {
    const steps = [
      { key: 'submitted', label: isAr ? 'تم الإرسال' : 'Submitted' },
      { key: 'review', label: isAr ? 'قيد المراجعة' : 'Under Review' },
      { key: 'approved', label: isAr ? 'تمت الموافقة' : 'Approved' },
      { key: 'payment', label: isAr ? 'الدفع' : 'Payment' },
      { key: 'confirmed', label: isAr ? 'مؤكد' : 'Confirmed' },
    ];
    const currentStep: Record<string, number> = {
      pending_review: 1, approved: 2, pending_payment: 3, paid: 4, rejected: -1, cancelled: -1,
    };
    return { steps, current: currentStep[status] ?? 0 };
  };

  return (
    <div className="space-y-5 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
            {isAr ? 'الحجوزات' : 'Bookings'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAr ? `${bookings.length} حجز` : `${bookings.length} bookings`}
          </p>
        </div>
        <Link href="/dashboard/expos">
          <button className="bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] hover:opacity-90 font-semibold text-sm px-4 py-2 rounded-lg flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            {isAr ? 'حجز الآن' : 'Book Now'}
          </button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-muted-foreground" />
          <input
            placeholder={isAr ? 'ابحث برقم الطلب أو المعرض...' : 'Search by order ID or expo...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full ps-10 pe-3 py-2.5 rounded-lg text-sm bg-card border border-border/50 t-primary placeholder:text-muted-foreground focus:outline-none focus:border-[#C5A55A]/50"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending_review', 'approved', 'paid', 'rejected', 'cancelled'].map((s) => {
          const config = statusConfig[s];
          const IconComp = config?.icon;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs border transition-all flex items-center gap-1.5 ${
                filterStatus === s
                  ? 'bg-[#C5A55A]/10 text-[#C5A55A] border-[#C5A55A]/30 font-medium'
                  : 'bg-card/30 text-muted-foreground border-border/30 hover:text-foreground'
              }`}
            >
              {s !== 'all' && IconComp && <IconComp className={`w-3 h-3 ${config.color}`} />}
              {s === 'all' ? (isAr ? 'الكل' : 'All') : statusLabel(s)}
              {(counts as any)[s] > 0 && (
                <span className="bg-card/50 text-[10px] h-4 min-w-4 px-1 rounded-full flex items-center justify-center">
                  {(counts as any)[s]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-xl bg-card border border-border/50 text-center">
          <CalendarCheck className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">
            {isAr ? 'لا توجد حجوزات' : 'No bookings found'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isAr ? 'ابدأ بتصفح المعارض وحجز جناحك' : 'Start browsing expos and book your booth'}
          </p>
          <Link href="/dashboard/expos">
            <button className="mt-4 px-4 py-2 rounded-lg text-sm border border-border/50 t-secondary hover:border-[#C5A55A]/30 transition-colors">
              {isAr ? 'حجز الآن' : 'Book Now'}
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking, i) => {
            const config = statusConfig[booking.status] || statusConfig.pending_review;
            const StatusIcon = config.icon;
            const isExpanded = expandedId === booking.id;
            const { steps, current } = getProgressSteps(booking.status);

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl bg-card border border-border/50 hover:border-[#C5A55A]/20 transition-all overflow-hidden"
              >
                {/* Card Header */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                        <StatusIcon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-xs text-muted-foreground">{booking.orderId}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${config.bg} ${config.color}`}>
                            {statusLabel(booking.status)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm t-primary">{booking.expoTitle}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#C5A55A]">
                        {booking.price.toLocaleString()} {isAr ? 'ر.س' : 'SAR'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground block">{isAr ? 'الجناح' : 'Booth'}</span>
                      <span className="font-medium t-primary">{booking.boothId}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">{isAr ? 'المنطقة' : 'Zone'}</span>
                      <span className="font-medium t-primary">{booking.zone}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">{isAr ? 'المساحة' : 'Area'}</span>
                      <span className="font-medium t-primary">{booking.area} m&sup2;</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">{isAr ? 'التاريخ' : 'Date'}</span>
                      <span className="font-medium t-primary" dir="ltr">{booking.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-4 border-t border-border/30 pt-4">
                        {/* Status Tracking */}
                        {current >= 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground mb-3">
                              {isAr ? 'تتبع الحالة' : 'Status Tracking'}
                            </h4>
                            <div className="flex items-center justify-between relative">
                              <div className="absolute top-3 start-0 end-0 h-0.5 bg-border/50" />
                              {steps.map((step, idx) => (
                                <div key={step.key} className="relative flex flex-col items-center z-10">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                    idx < current
                                      ? 'bg-green-500 text-white'
                                      : idx === current
                                      ? 'bg-[#C5A55A] text-[#0A0A12]'
                                      : 'bg-card text-muted-foreground border border-border/50'
                                  }`}>
                                    {idx < current ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                                  </div>
                                  <span className={`text-[9px] mt-1 whitespace-nowrap ${
                                    idx <= current ? 'text-foreground font-medium' : 'text-muted-foreground'
                                  }`}>
                                    {step.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Reviewer Note */}
                        {booking.reviewerNote && (
                          <div className="p-3 rounded-lg bg-card/50 border border-border/30">
                            <span className="text-xs text-muted-foreground block mb-1">
                              {isAr ? 'ملاحظة المشرف' : 'Reviewer Note'}
                            </span>
                            <p className="text-sm t-primary">{booking.reviewerNote}</p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          {booking.status === 'approved' && booking.contractId && (
                            <>
                              <Link href="/dashboard/contracts">
                                <button className="px-3 py-1.5 rounded-lg text-xs border border-border/50 t-secondary flex items-center gap-1 hover:border-[#C5A55A]/30 transition-colors">
                                  <FileText className="w-3 h-3" />
                                  {isAr ? 'عرض العقد' : 'View Contract'}
                                </button>
                              </Link>
                              <Link href="/dashboard/payments">
                                <button className="px-3 py-1.5 rounded-lg text-xs bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] font-semibold flex items-center gap-1">
                                  <CreditCard className="w-3 h-3" />
                                  {isAr ? 'ادفع الآن' : 'Pay Now'}
                                </button>
                              </Link>
                            </>
                          )}
                          {booking.status === 'paid' && (
                            <button className="px-3 py-1.5 rounded-lg text-xs border border-border/50 t-secondary flex items-center gap-1 hover:border-[#C5A55A]/30 transition-colors">
                              <Download className="w-3 h-3" />
                              {isAr ? 'تحميل الإيصال' : 'Download Receipt'}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
