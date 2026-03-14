'use client';

/**
 * Profile — Trader Profile & Account Settings
 * Adapted from reference project for Next.js App Router
 */
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Shield, CheckCircle, Building2, Phone, Mail, Globe, MapPin, Lock, Eye, EyeOff, LogOut, Award, Calendar, Hash, Briefcase, ArrowRight, Edit3, ShieldCheck, AlertTriangle, ChevronLeft } from "lucide-react";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { useLanguageStore } from "@/shared/store/useLanguageStore";
import { useThemeStore } from "@/shared/store/useThemeStore";

export default function ProfilePage() {
  const { language, isRtl } = useLanguageStore();
  const { theme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const isAr = language === 'ar';
  const isRTL = isRtl;

  const [showSensitive, setShowSensitive] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const traderName = user?.name || "—";
  const traderCompany = "—";
  const traderPhone = user?.phone || "—";
  const traderActivity = "—";
  const traderRegion = "—";
  const traderKYC: string = "none";
  const traderRegistered = user?.createdAt ? new Date(user.createdAt).toLocaleDateString(isAr ? "ar-SA" : "en-US") : "—";
  const isVerified = traderKYC === "verified";

  const kycStatusMap: Record<string, { label: string; color: string; icon: any }> = {
    none: { label: isAr ? "غير مكتمل" : "Not Started", color: "var(--status-red)", icon: AlertTriangle },
    pending: { label: isAr ? "قيد المراجعة" : "Under Review", color: "var(--status-yellow)", icon: Shield },
    verified: { label: isAr ? "موثّق" : "Verified", color: "var(--status-green)", icon: ShieldCheck },
    rejected: { label: isAr ? "مرفوض" : "Rejected", color: "var(--status-red)", icon: AlertTriangle },
  };

  const kycInfo = kycStatusMap[traderKYC] || kycStatusMap.none;
  const KYCIcon = kycInfo.icon;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gold-gradient" style={{ fontFamily: "'Playfair Display', 'IBM Plex Sans Arabic', serif" }}>{isAr ? 'الملف الشخصي' : 'Profile'}</h2>
          <p className="text-[10px] sm:text-xs t-gold/50 font-['Inter']">Trader Profile & Account Settings</p>
        </div>
        <button onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors"
          style={{ color: "var(--status-red)", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.15)" }}>
          <LogOut size={14} />
          <span className="hidden sm:inline">{isAr ? 'تسجيل الخروج' : 'Logout'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-light)] flex items-center justify-center mb-4">
              <User size={32} style={{ color: "var(--btn-gold-text)" }} />
            </div>
            <h3 className="text-base font-bold t-primary">{traderName}</h3>
            <p className="text-xs t-gold/60 font-['Inter'] mt-0.5">{traderCompany}</p>
            <div className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full" style={{ background: `color-mix(in srgb, ${kycInfo.color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${kycInfo.color} 20%, transparent)` }}>
              <KYCIcon size={12} style={{ color: kycInfo.color }} />
              <span className="text-[10px] font-medium" style={{ color: kycInfo.color }}>{kycInfo.label}</span>
            </div>
            {isVerified && (
              <div className="flex items-center gap-1 mt-2">
                <Award size={12} className="t-gold" />
                <span className="text-[10px] t-gold font-bold">{isAr ? 'تاجر موثّق' : 'Verified Trader'}</span>
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            {[
              { icon: Phone, label: isAr ? 'الجوال' : 'Phone', value: showSensitive ? traderPhone : "•••• •••• ••••" },
              { icon: MapPin, label: isAr ? 'المنطقة' : 'Region', value: traderRegion },
              { icon: Briefcase, label: isAr ? 'النشاط' : 'Activity', value: traderActivity },
              { icon: Calendar, label: isAr ? 'تاريخ التسجيل' : 'Registered At', value: traderRegistered },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[var(--glass-border)]">
                <item.icon size={14} className="t-gold/60 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] t-muted">{item.label}</p>
                  <p className="text-xs t-secondary truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setShowSensitive(!showSensitive)}
            className="w-full mt-4 glass-card py-2.5 rounded-xl text-xs t-secondary hover:t-gold flex items-center justify-center gap-2 transition-colors">
            {showSensitive ? <EyeOff size={14} /> : <Eye size={14} />}
            {showSensitive ? (isAr ? 'إخفاء البيانات الحساسة' : 'Hide Sensitive Data') : (isAr ? 'إظهار البيانات الحساسة' : 'Show Sensitive Data')}
          </button>
        </motion.div>

        <div className="lg:col-span-2 space-y-5">
          {/* KYC Status */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold t-primary">{isAr ? 'حالة التوثيق' : 'KYC Status'}</h3>
              {!isVerified && (
                <Link href="/dashboard/kyc">
                  <button className="btn-gold px-4 py-2 rounded-xl text-[11px] flex items-center gap-1.5">
                    <Shield size={12} />
                    {isAr ? 'إكمال التوثيق' : 'Complete KYC'}
                  </button>
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: isAr ? 'التسجيل' : 'Registration', done: true },
                { label: isAr ? 'المستندات' : 'Documents', done: false },
                { label: isAr ? 'التوثيق' : 'KYC', done: isVerified },
                { label: isAr ? 'التفعيل' : 'Verified', done: false },
              ].map((step, i) => (
                <div key={i} className="p-3 rounded-xl text-center" style={{ background: step.done ? "color-mix(in srgb, var(--status-green) 8%, transparent)" : "var(--glass-bg)", border: `1px solid ${step.done ? "color-mix(in srgb, var(--status-green) 20%, transparent)" : "var(--glass-border)"}` }}>
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${step.done ? "bg-[var(--status-green)]/15" : "bg-[var(--glass-bg)]"}`}>
                    {step.done ? <CheckCircle size={14} style={{ color: "var(--status-green)" }} /> : <span className="text-xs t-muted">{i + 1}</span>}
                  </div>
                  <p className="text-[10px] font-medium" style={{ color: step.done ? "var(--status-green)" : "var(--text-tertiary)" }}>{step.label}</p>
                </div>
              ))}
            </div>

            <div className="h-2 rounded-full bg-[var(--glass-bg)] overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${isVerified ? 100 : 25}%` }}
                transition={{ duration: 1, ease: "easeOut" }} className="h-full rounded-full"
                style={{ background: isVerified ? "var(--status-green)" : "linear-gradient(90deg, var(--gold-accent), var(--gold-light))" }} />
            </div>

            {!isVerified && (
              <div className="mt-3 p-3 rounded-xl bg-[var(--status-yellow)]/5 border border-[var(--status-yellow)]/10">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={12} style={{ color: "var(--status-yellow)" }} />
                  <p className="text-[10px] sm:text-xs" style={{ color: "var(--status-yellow)" }}>{isAr ? 'يجب إكمال التوثيق قبل الحجز' : 'KYC verification required before booking'}</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Business Details */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold t-primary">{isAr ? 'تفاصيل العمل' : 'Business Details'}</h3>
              <Link href="/dashboard/kyc">
                <button className="glass-card px-3 py-1.5 rounded-lg text-[10px] t-tertiary hover:t-gold flex items-center gap-1 transition-colors">
                  <Edit3 size={10} />
                  {isAr ? 'تعديل' : 'Edit'}
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: isAr ? 'اسم التاجر' : 'Trader Name', value: traderName, icon: User },
                { label: isAr ? 'اسم الشركة' : 'Company Name', value: traderCompany, icon: Building2 },
                { label: isAr ? 'النشاط' : 'Activity', value: traderActivity, icon: Briefcase },
                { label: isAr ? 'المنطقة' : 'Region', value: traderRegion, icon: MapPin },
                { label: isAr ? 'الجوال' : 'Phone', value: showSensitive ? traderPhone : "•••• •••• ••••", icon: Phone },
                { label: isAr ? 'تاريخ التسجيل' : 'Registered At', value: traderRegistered, icon: Calendar },
              ].map((d, i) => (
                <div key={i} className="p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <d.icon size={10} className="t-gold/50" />
                    <p className="text-[9px] t-muted">{d.label}</p>
                  </div>
                  <p className="text-sm t-secondary font-medium">{d.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: isAr ? 'تصفح المعارض' : 'Browse Expos', icon: Building2, path: "/dashboard/expos", color: "var(--gold-accent)" },
              { label: isAr ? 'الحجوزات' : 'Bookings', icon: Calendar, path: "/dashboard/bookings", color: "var(--status-blue)" },
              { label: isAr ? 'المساعدة' : 'Help', icon: Globe, path: "/dashboard/help", color: "var(--status-green)" },
              { label: isAr ? 'التوثيق' : 'KYC', icon: Shield, path: "/dashboard/kyc", color: "var(--status-yellow)" },
            ].map((action, i) => (
              <Link key={i} href={action.path}>
                <div className="glass-card rounded-xl p-3 sm:p-4 text-center cursor-pointer hover:border-[var(--gold-border)] transition-all">
                  <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: `color-mix(in srgb, ${action.color} 10%, transparent)` }}>
                    <action.icon size={18} style={{ color: action.color }} />
                  </div>
                  <p className="text-[11px] t-secondary font-medium">{action.label}</p>
                </div>
              </Link>
            ))}
          </motion.div>

          {/* Security Notice */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 border-[var(--gold-border)]/20">
            <div className="flex items-center gap-2 mb-2">
              <Lock size={14} className="t-gold" />
              <h4 className="text-xs font-bold t-gold">{isAr ? 'حماية البيانات' : 'Data Protection'}</h4>
            </div>
            <p className="text-[11px] t-tertiary leading-relaxed">{isAr ? 'بياناتك محمية بأعلى معايير الأمان والتشفير. لن يتم مشاركة معلوماتك مع أي طرف ثالث دون موافقتك.' : 'Your data is protected with the highest security and encryption standards. Your information will not be shared with any third party without your consent.'}</p>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center" style={{ backgroundColor: "var(--modal-overlay)" }}>
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl"
            style={{ background: "var(--modal-bg)", border: "1px solid var(--glass-border)", paddingBottom: "max(env(safe-area-inset-bottom, 0px), 20px)" }}>
            <div className="flex justify-center pb-2 sm:hidden">
              <div className="w-10 h-1 rounded-full" style={{ background: "var(--glass-border)" }} />
            </div>
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: "rgba(248,113,113,0.1)" }}>
                <LogOut size={24} style={{ color: "var(--status-red)" }} />
              </div>
              <h3 className="text-base font-bold t-primary mb-1">{isAr ? 'تسجيل الخروج' : 'Logout'}</h3>
              <p className="text-xs t-tertiary">{isAr ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are you sure you want to logout?'}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-secondary)" }}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button onClick={handleLogout}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                style={{ background: "var(--status-red)", color: "#fff" }}>
                <LogOut size={14} />
                {isAr ? 'تسجيل الخروج' : 'Logout'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
