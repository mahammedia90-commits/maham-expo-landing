'use client';

/**
 * Bookings — Enhanced Booking Management with Full Flow
 * Uses empty arrays for bookings/payments/contracts since no full auth context
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  CalendarCheck, Search, Eye, Download, Plus, CheckCircle,
  AlertTriangle, XCircle, Clock, CreditCard, FileText, MapPin,
  Shield, ChevronDown, X, Building2, Zap, Lock, Flame, Tag
} from "lucide-react";
import { toast } from "sonner";
import { useLanguageStore } from "@/shared/store/useLanguageStore";
import { useThemeStore } from "@/shared/store/useThemeStore";
import { useAuthStore } from "@/shared/store/useAuthStore";

export default function Bookings() {
  const { language, isRtl } = useLanguageStore();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showGuard, setShowGuard] = useState(false);

  const isAr = language === "ar";

  // Empty arrays since we don't have full auth context
  const bookings: any[] = [];
  const contracts: any[] = [];
  const canBook = true;

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      confirmed: isAr ? "مؤكد" : "Confirmed",
      active: isAr ? "نشط" : "Active",
      pending_payment: isAr ? "بانتظار الدفع" : "Pending Payment",
      pending_review: isAr ? "بانتظار موافقة المشرف" : "Awaiting Supervisor Approval",
      approved: isAr ? "مقبول — بانتظار الدفع" : "Approved — Awaiting Payment",
      rejected: isAr ? "مرفوض" : "Rejected",
      cancelled: isAr ? "ملغي" : "Cancelled",
    };
    return map[status] || status;
  };
  const statusColor: Record<string, string> = {
    confirmed: "#4ADE80", active: "#60A5FA", pending_payment: "#FBBF24",
    pending_review: "#A78BFA", approved: "#34D399", rejected: "#F87171",
    cancelled: "#F87171",
  };
  const StatusIcon: Record<string, any> = {
    confirmed: CheckCircle, active: Zap, pending_payment: Clock,
    pending_review: Clock, approved: CheckCircle, rejected: XCircle,
    cancelled: XCircle,
  };

  const filtered = bookings.filter(b => {
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (search && !b.unitAr.includes(search) && !b.unitEn?.toLowerCase().includes(search.toLowerCase()) && !b.id.includes(search) && !b.expoNameAr.includes(search)) return false;
    return true;
  });

  const totalValue = bookings.filter(b => b.status !== "cancelled").reduce((a: number, b: any) => a + b.price, 0);
  const totalPaid = bookings.reduce((a: number, b: any) => a + b.paidAmount, 0);
  const totalRemaining = bookings.reduce((a: number, b: any) => a + b.remainingAmount, 0);
  const getContract = (bookingId: string) => contracts.find((c: any) => c.bookingId === bookingId);

  const unitLabel = (b: any) => isRtl ? b.unitAr : (b.unitEn || b.unitAr);
  const expoLabel = (b: any) => isRtl ? b.expoNameAr : (b.expoNameEn || b.expoNameAr);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gold-gradient" style={{ fontFamily: "'Playfair Display', 'IBM Plex Sans Arabic', serif" }}>{isAr ? "إدارة الحجوزات" : "Booking Management"}</h2>
          <p className="text-[10px] t-gold/50 font-['Inter']">Booking Management</p>
        </div>
        {canBook ? (
          <Link href="/dashboard/expos">
            <button className="btn-gold px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5">
              <Plus size={14} />
              <span>{isAr ? "حجز جديد" : "New Booking"}</span>
            </button>
          </Link>
        ) : (
          <button onClick={() => setShowGuard(true)} className="btn-gold px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5">
            <Plus size={14} />
            <span>{isAr ? "حجز جديد" : "New Booking"}</span>
          </button>
        )}
      </div>

      {/* Approved Bookings Banner — Pay Now */}
      {bookings.some((b: any) => b.status === "approved") && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ backgroundColor: "rgba(74, 222, 128, 0.08)", border: "1px solid rgba(74, 222, 128, 0.15)" }}>
          <CheckCircle size={14} className="text-[var(--status-green)] shrink-0" />
          <div className="flex-1">
            <p className="text-[11px] text-[var(--status-green)] font-semibold">{isAr ? "تمت الموافقة على طلبك! أكمل الدفع الآن" : "Your request was approved! Complete payment now"}</p>
            <p className="text-[9px] t-muted">{isAr ? "يجب إتمام الدفع خلال فترة التثبيت المؤقت" : "Payment must be completed within the hold period"}</p>
          </div>
          <Link href={`/dashboard/expos/${bookings.find((b: any) => b.status === 'approved')?.expoId || ''}`}>
            <button className="btn-gold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1">
              <CreditCard size={11} /> {isAr ? "ادفع الآن" : "Pay Now"}
            </button>
          </Link>
        </div>
      )}

      {/* Pending Review Banner */}
      {bookings.some((b: any) => b.status === "pending_review") && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ backgroundColor: "rgba(167, 139, 250, 0.08)", border: "1px solid rgba(167, 139, 250, 0.15)" }}>
          <Clock size={14} className="text-purple-400 shrink-0 animate-pulse" />
          <div className="flex-1">
            <p className="text-[11px] text-purple-400 font-semibold">{isAr ? "طلبك قيد المراجعة من المشرف" : "Your request is under supervisor review"}</p>
            <p className="text-[9px] t-muted">{isAr ? "ستتلقى إشعاراً بالنتيجة خلال دقائق" : "You will receive a notification shortly"}</p>
          </div>
        </div>
      )}

      {/* Rejected Booking Banner */}
      {bookings.some((b: any) => b.status === "rejected") && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ backgroundColor: "rgba(248, 113, 113, 0.08)", border: "1px solid rgba(248, 113, 113, 0.15)" }}>
          <XCircle size={14} className="text-red-400 shrink-0" />
          <div className="flex-1">
            <p className="text-[11px] text-red-400 font-semibold">{isAr ? "تم رفض أحد طلباتك" : "One of your requests was rejected"}</p>
            <p className="text-[9px] t-muted">{isAr ? "يمكنك التقدم بطلب جديد لوحدة أخرى" : "You can apply for a different unit"}</p>
          </div>
          <Link href="/dashboard/expos">
            <button className="glass-card px-3 py-1.5 rounded-lg text-[10px] t-secondary flex items-center gap-1">
              <Plus size={11} /> {isAr ? "طلب جديد" : "New Request"}
            </button>
          </Link>
        </div>
      )}

      {/* Price Alert / Incentive Banner */}
      {bookings.some((b: any) => b.status === "pending_payment") && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: "rgba(251, 191, 36, 0.06)", border: "1px solid rgba(251, 191, 36, 0.12)" }}>
          <Flame size={13} className="text-[var(--status-yellow)] shrink-0" />
          <p className="text-[10px] t-secondary flex-1">{isAr ? "هذا الجناح محجوز لك لمدة 30 دقيقة" : "This booth is reserved for you for 30 minutes"}</p>
          <Link href="/dashboard/payments">
            <span className="text-[10px] t-gold underline cursor-pointer">{isAr ? "ادفع الآن" : "Pay Now"}</span>
          </Link>
        </div>
      )}

      {/* KYC Notice */}
      {!canBook && (
        <div className="glass-card rounded-xl p-3 border-[var(--status-yellow)]/20">
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-[var(--status-yellow)] shrink-0" />
            <p className="text-[11px] text-[var(--status-yellow)]">{isAr ? "يجب توثيق حسابك (KYC) قبل إنشاء حجوزات جديدة" : "You must verify your account (KYC) before creating new bookings"}</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        {[
          { label: isAr ? "إدارة الحجوزات" : "Bookings", display: bookings.length.toString(), color: "#C5A55A" },
          { label: isAr ? "نشط" : "Active", display: bookings.filter((b: any) => ["confirmed", "active"].includes(b.status)).length.toString(), color: "#4ADE80" },
          { label: isAr ? "قيمة العقد" : "Contract Value", display: totalValue > 0 ? `${(totalValue / 1000).toFixed(0)}K` : "0", color: "#C5A55A" },
          { label: isAr ? "إجمالي المدفوع" : "Total Paid", display: totalPaid > 0 ? `${(totalPaid / 1000).toFixed(0)}K` : "0", color: "#4ADE80" },
          { label: isAr ? "إجمالي المتبقي" : "Total Remaining", display: totalRemaining > 0 ? `${(totalRemaining / 1000).toFixed(0)}K` : "0", color: "#FBBF24" },
        ].map((s, i) => (
          <div key={i} className={`glass-card rounded-xl p-2 sm:p-3 text-center ${i >= 3 ? "hidden lg:block" : ""}`}>
            <p className="text-base sm:text-xl font-bold font-['Inter']" style={{ color: s.color }}>{s.display}</p>
            <p className="text-[9px] sm:text-[10px] t-tertiary mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="space-y-2 sm:space-y-0 sm:flex sm:gap-3">
        <div className="flex-1 relative">
          <Search size={14} className={`absolute ${isRtl ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 t-tertiary`} />
          <input type="text" placeholder={`${isAr ? "بحث" : "Search"}...`} value={search} onChange={(e) => setSearch(e.target.value)}
            className={`w-full glass-card rounded-xl ${isRtl ? "pr-9 pl-3" : "pl-9 pr-3"} py-2.5 text-xs t-primary placeholder:t-muted gold-focus bg-transparent`} />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {["all", "confirmed", "active", "pending_payment", "pending_review", "approved", "rejected", "cancelled"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-[11px] transition-all whitespace-nowrap shrink-0 ${filterStatus === s ? "btn-gold" : "glass-card t-secondary"}`}>
              {s === "all" ? (isAr ? "الكل" : "All") : statusLabel(s)}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {bookings.length === 0 && (
        <div className="glass-card rounded-xl sm:rounded-2xl p-8 text-center">
          <CalendarCheck size={36} className="mx-auto t-muted mb-3" />
          <p className="text-sm t-secondary mb-1">{isAr ? "لا توجد حجوزات" : "No bookings"}</p>
          <p className="text-[10px] t-muted mb-3">{isAr ? "تصفح المعارض واحجز وحدتك التجارية" : "Browse exhibitions and book your commercial unit"}</p>
          <Link href="/dashboard/expos">
            <button className="btn-gold px-4 py-2 rounded-xl text-xs">{isAr ? "تصفح المعارض" : "Browse Expos"}</button>
          </Link>
        </div>
      )}

      {/* Mobile: Cards View */}
      <div className="lg:hidden space-y-3">
        {filtered.map((b: any, i: number) => {
          const sc = statusColor[b.status] || "#FBBF24";
          const SIcon = StatusIcon[b.status] || Clock;
          const contract = getContract(b.id);
          return (
            <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              onClick={() => setSelectedBooking(b)} className="glass-card rounded-xl p-3 active:scale-[0.98] transition-transform cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold t-primary truncate">{unitLabel(b)}</p>
                  <p className="text-[10px] t-muted font-['Inter']">{b.id} · Zone {b.zone}</p>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] shrink-0"
                  style={{ backgroundColor: `${sc}15`, color: sc, border: `1px solid ${sc}25` }}>
                  <SIcon size={9} /> {statusLabel(b.status)}
                </span>
              </div>
              <p className="text-[11px] t-tertiary truncate mb-2">{expoLabel(b)}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-[9px] t-muted">{isAr ? "السعر" : "Price"}</p>
                    <p className="text-xs font-semibold t-secondary font-['Inter']">{b.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] t-muted">{isAr ? "إجمالي المدفوع" : "Total Paid"}</p>
                    <p className="text-xs font-semibold text-[var(--status-green)] font-['Inter']">{b.paidAmount.toLocaleString()}</p>
                  </div>
                  {b.remainingAmount > 0 && (
                    <div>
                      <p className="text-[9px] t-muted">{isAr ? "إجمالي المتبقي" : "Total Remaining"}</p>
                      <p className="text-xs font-semibold text-[var(--status-yellow)] font-['Inter']">{b.remainingAmount.toLocaleString()}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {contract && <FileText size={12} className="t-gold" />}
                  <Eye size={14} className="t-tertiary" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop: Table View */}
      {filtered.length > 0 && (
        <div className="hidden lg:block glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--glass-border)]">
                  {[
                    isAr ? "رقم الحجز" : "Booking ID",
                    isAr ? "الوحدة" : "Unit",
                    isAr ? "المعرض" : "Exhibition",
                    isAr ? "السعر" : "Price",
                    isAr ? "إجمالي المدفوع" : "Total Paid",
                    isAr ? "إجمالي المتبقي" : "Total Remaining",
                    isAr ? "الحالة" : "Status",
                    isAr ? "العقود والاتفاقيات" : "Contracts",
                    isAr ? "الإجراءات" : "Actions"
                  ].map((h, i) => (
                    <th key={i} className={`${isRtl ? "text-right" : "text-left"} px-4 py-3 text-[11px] t-tertiary font-medium`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b: any, i: number) => {
                  const sc = statusColor[b.status] || "#FBBF24";
                  const SIcon = StatusIcon[b.status] || Clock;
                  const contract = getContract(b.id);
                  return (
                    <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className="border-b border-white/[0.03] hover:bg-[var(--glass-bg)] transition-colors">
                      <td className="px-4 py-3 text-xs t-gold font-['Inter'] font-medium">{b.id}</td>
                      <td className="px-4 py-3">
                        <p className="text-xs t-primary">{unitLabel(b)}</p>
                        <p className="text-[9px] t-tertiary font-['Inter']">Zone {b.zone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs t-secondary line-clamp-1">{expoLabel(b)}</p>
                      </td>
                      <td className="px-4 py-3 text-xs t-secondary font-['Inter']">{b.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-[var(--status-green)] font-['Inter']">{b.paidAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs font-['Inter']">
                        <span className={b.remainingAmount > 0 ? "text-[var(--status-yellow)]" : "text-[var(--status-green)]"}>
                          {b.remainingAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px]"
                          style={{ backgroundColor: `${sc}12`, color: sc, border: `1px solid ${sc}25` }}>
                          <SIcon size={10} /> {statusLabel(b.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {contract ? (
                          <Link href="/dashboard/contracts">
                            <span className="text-[10px] t-gold underline cursor-pointer">{contract.id}</span>
                          </Link>
                        ) : (
                          <span className="text-[10px] t-muted">{isAr ? "بعد الدفع" : "After Payment"}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSelectedBooking(b)} className="p-2 rounded-lg hover:bg-[var(--glass-bg)] t-tertiary hover:t-gold transition-colors">
                            <Eye size={14} />
                          </button>
                          {b.status === "pending_payment" && (
                            <Link href="/dashboard/payments">
                              <button className="p-2 rounded-lg hover:bg-[var(--glass-bg)] text-[var(--status-yellow)] transition-colors">
                                <CreditCard size={14} />
                              </button>
                            </Link>
                          )}
                          {b.status === "approved" && (
                            <Link href={`/dashboard/expos/${b.expoId}`}>
                              <button className="px-2.5 py-1.5 rounded-lg text-[10px] btn-gold flex items-center gap-1" title={isAr ? 'إكمال الدفع' : 'Complete Payment'}>
                                <CreditCard size={12} /> {isAr ? 'ادفع' : 'Pay'}
                              </button>
                            </Link>
                          )}
                          {b.status === "pending_review" && (
                            <span className="px-2 py-1 rounded-lg text-[10px] text-purple-400 animate-pulse flex items-center gap-1">
                              <Clock size={11} /> {isAr ? 'قيد المراجعة' : 'Reviewing'}
                            </span>
                          )}
                          {b.status === "rejected" && (
                            <span className="px-2 py-1 rounded-lg text-[10px] text-red-400 flex items-center gap-1">
                              <XCircle size={11} /> {isAr ? 'مرفوض' : 'Rejected'}
                            </span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm" onClick={() => setSelectedBooking(null)} />
            <motion.div
              initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-h-[92vh] lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[560px] lg:max-h-[85vh] z-50 overflow-y-auto rounded-t-2xl lg:rounded-2xl"
              style={{ background: "var(--modal-bg)", borderTop: "1px solid var(--glass-border)", paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
              dir={isRtl ? "rtl" : "ltr"}>
              <div style={{ background: "var(--modal-bg)" }}>
                <div className="flex justify-center pt-3 pb-1 sm:hidden">
                  <div className="w-10 h-1 rounded-full" style={{ background: "var(--glass-border)" }} />
                </div>
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10"
                  style={{ background: "var(--modal-bg)", borderBottom: "1px solid var(--glass-border)" }}>
                  <div>
                    <h3 className="text-base font-bold t-primary">{isAr ? "تفاصيل الحجز" : "Booking Details"}</h3>
                    <p className="text-[10px] t-gold font-['Inter']">{selectedBooking.id}</p>
                  </div>
                  <button onClick={() => setSelectedBooking(null)} className="p-2 rounded-lg t-tertiary" style={{ background: "var(--glass-bg)" }}>
                    <X size={16} />
                  </button>
                </div>

                <div className="px-4 sm:px-6 py-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold t-primary">{unitLabel(selectedBooking)}</p>
                      <p className="text-[10px] t-muted font-['Inter']">Zone {selectedBooking.zone}</p>
                      <p className="text-xs t-tertiary mt-1">{expoLabel(selectedBooking)}</p>
                    </div>
                    {(() => {
                      const sc = statusColor[selectedBooking.status] || "#FBBF24";
                      const SIcon = StatusIcon[selectedBooking.status] || Clock;
                      return (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] shrink-0"
                          style={{ backgroundColor: `${sc}15`, color: sc, border: `1px solid ${sc}25` }}>
                          <SIcon size={10} /> {statusLabel(selectedBooking.status)}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: isAr ? "النوع" : "Type", value: selectedBooking.boothType },
                      { label: isAr ? "المساحة" : "Size", value: selectedBooking.boothSize },
                      { label: isAr ? "التاريخ" : "Date", value: selectedBooking.date },
                      { label: isAr ? "العقود والاتفاقيات" : "Contracts", value: getContract(selectedBooking.id)?.id || (isAr ? "بعد الدفع" : "After Payment") },
                    ].map((d, i) => (
                      <div key={i} className="p-2.5 rounded-xl" style={{ background: "var(--modal-inner-bg)", border: "1px solid var(--glass-border)" }}>
                        <p className="text-[9px] t-muted mb-0.5">{d.label}</p>
                        <p className="text-xs t-secondary font-medium">{d.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl p-3" style={{ background: "var(--modal-inner-bg)", border: "1px solid var(--glass-border)" }}>
                    <h4 className="text-[11px] font-bold t-secondary mb-2">{isAr ? "الملخص المالي" : "Financial Summary"}</h4>
                    <div className="space-y-1.5">
                      {[
                        { label: isAr ? "السعر الإجمالي" : "Total Price", value: `${selectedBooking.price.toLocaleString()} ${isAr ? "ر.س" : "SAR"}`, color: "var(--text-secondary)" },
                        { label: isAr ? "العربون (5%)" : "Deposit (5%)", value: `${selectedBooking.deposit.toLocaleString()} ${isAr ? "ر.س" : "SAR"}`, color: "var(--text-secondary)" },
                        { label: isAr ? "إجمالي المدفوع" : "Total Paid", value: `${selectedBooking.paidAmount.toLocaleString()} ${isAr ? "ر.س" : "SAR"}`, color: "var(--status-green)" },
                      ].map((f, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="t-tertiary">{f.label}</span>
                          <span className="font-['Inter']" style={{ color: f.color }}>{f.value}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-xs pt-1.5 mt-1.5" style={{ borderTop: "1px solid var(--glass-border)" }}>
                        <span className="t-secondary font-bold">{isAr ? "إجمالي المتبقي" : "Total Remaining"}</span>
                        <span className={`font-bold font-['Inter'] ${selectedBooking.remainingAmount > 0 ? "text-[var(--status-yellow)]" : "text-[var(--status-green)]"}`}>
                          {selectedBooking.remainingAmount.toLocaleString()} {isAr ? "ر.س" : "SAR"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {(() => {
                    const contract = getContract(selectedBooking.id);
                    if (contract) {
                      return (
                        <div className="rounded-xl p-3 bg-[var(--status-green)]/5 border border-[var(--status-green)]/10">
                          <div className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-[var(--status-green)]" />
                            <div>
                              <p className="text-[11px] text-[var(--status-green)] font-semibold">{isAr ? "تم إصدار العقد بنجاح" : "Contract issued successfully"}</p>
                              <p className="text-[9px] t-muted font-['Inter']">{contract.id}</p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    if (selectedBooking.status === "pending_payment") {
                      return (
                        <div className="rounded-xl p-3 bg-[var(--status-yellow)]/5 border border-[var(--status-yellow)]/10">
                          <div className="flex items-center gap-2">
                            <Lock size={14} className="text-[var(--status-yellow)]" />
                            <p className="text-[11px] text-[var(--status-yellow)]">{isAr ? "العقد يصدر تلقائياً بعد إتمام الدفع" : "Contract is issued automatically after payment completion"}</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {selectedBooking.services?.length > 0 && (
                    <div>
                      <p className="text-[10px] t-tertiary mb-1.5">{isAr ? "الخدمات" : "Services"}</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {selectedBooking.services.map((s: string, i: number) => (
                          <span key={i} className="px-2 py-1 rounded-lg text-[10px] t-secondary" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 pb-2">
                    {selectedBooking.remainingAmount > 0 && (
                      <Link href="/dashboard/payments" className="flex-1">
                        <button className="w-full btn-gold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5">
                          <CreditCard size={14} /> {isAr ? "ادفع الآن" : "Pay Now"}
                        </button>
                      </Link>
                    )}
                    {getContract(selectedBooking.id) && (
                      <Link href="/dashboard/contracts">
                        <button className="glass-card px-3 py-2.5 rounded-xl text-xs t-secondary flex items-center gap-1.5">
                          <FileText size={13} /> {isAr ? "العقود والاتفاقيات" : "Contracts & Agreements"}
                        </button>
                      </Link>
                    )}
                    <button onClick={() => {
                      toast.info(isAr ? "جاري التحميل..." : "Loading...");
                      toast.success(isAr ? "تم بنجاح" : "Success");
                    }} className="glass-card px-3 py-2.5 rounded-xl text-xs t-secondary flex items-center gap-1.5">
                      <Download size={13} /> {isAr ? "تحميل" : "Download"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
