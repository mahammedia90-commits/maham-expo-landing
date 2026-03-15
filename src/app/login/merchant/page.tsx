'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useAuthStore } from '@/shared/store/useAuthStore';

// ─── Translations ────────────────────────────────────────────────
const t = {
  ar: {
    brand: 'مهام إكسبو',
    tagline: 'منصة تنظيم المعارض والمؤتمرات',
    back: 'رجوع',
    // Step labels
    stepPhone: 'رقم الجوال',
    stepOtp: 'رمز التحقق',
    stepInfo: 'البيانات',
    // Step 1 – Phone
    loginTitle: 'مرحباً بك',
    loginSubtitle: 'سجّل دخولك للوصول إلى لوحة التحكم',
    phoneLabel: 'رقم الجوال',
    phonePlaceholder: '5XXXXXXXX',
    sendOtp: 'إرسال رمز التحقق',
    // Step 2 – OTP
    otpTitle: 'رمز التحقق',
    otpSubtitle: 'أدخل الرمز المرسل إلى',
    resend: 'إعادة إرسال الرمز',
    resendIn: 'إعادة الإرسال بعد',
    seconds: 'ثانية',
    codeResent: 'تم إعادة إرسال الرمز',
    // Step 3 – Info
    infoTitle: 'بيانات التاجر',
    infoSubtitle: 'أكمل بياناتك للمتابعة',
    nameLabel: 'اسم التاجر',
    companyLabel: 'اسم المؤسسة أو الشركة',
    activityLabel: 'نوع النشاط',
    regionLabel: 'المنطقة',
    submit: 'إنشاء الحساب',
    // Activities
    activities: [
      { value: 'restaurants', label: 'مطاعم وكافيهات' },
      { value: 'retail', label: 'تجارة تجزئة' },
      { value: 'fashion', label: 'أزياء وموضة' },
      { value: 'electronics', label: 'إلكترونيات' },
      { value: 'tech', label: 'تقنية وابتكار' },
      { value: 'health', label: 'صحة وجمال' },
      { value: 'tourism', label: 'سياحة وسفر' },
      { value: 'realestate', label: 'عقارات' },
      { value: 'education', label: 'تعليم وتدريب' },
      { value: 'other', label: 'أخرى' },
    ],
    // Regions
    regions: [
      { value: 'riyadh', label: 'الرياض' },
      { value: 'makkah', label: 'مكة المكرمة' },
      { value: 'madinah', label: 'المدينة المنورة' },
      { value: 'eastern', label: 'المنطقة الشرقية' },
      { value: 'qassim', label: 'القصيم' },
      { value: 'asir', label: 'عسير' },
      { value: 'tabuk', label: 'تبوك' },
      { value: 'hail', label: 'حائل' },
      { value: 'jouf', label: 'الجوف' },
      { value: 'najran', label: 'نجران' },
      { value: 'baha', label: 'الباحة' },
      { value: 'jazan', label: 'جازان' },
      { value: 'northern', label: 'الحدود الشمالية' },
    ],
  },
  en: {
    brand: 'Maham Expo',
    tagline: 'Expo & Conference Management Platform',
    back: 'Back',
    stepPhone: 'Phone',
    stepOtp: 'OTP',
    stepInfo: 'Info',
    loginTitle: 'Welcome',
    loginSubtitle: 'Sign in to access your dashboard',
    phoneLabel: 'Phone Number',
    phonePlaceholder: '5XXXXXXXX',
    sendOtp: 'Send OTP',
    otpTitle: 'Verification Code',
    otpSubtitle: 'Enter the code sent to',
    resend: 'Resend Code',
    resendIn: 'Resend in',
    seconds: 'sec',
    codeResent: 'Code resent',
    infoTitle: 'Trader Info',
    infoSubtitle: 'Complete your details to continue',
    nameLabel: 'Trader Name',
    companyLabel: 'Company / Business Name',
    activityLabel: 'Activity Type',
    regionLabel: 'Region',
    submit: 'Create Account',
    activities: [
      { value: 'restaurants', label: 'Restaurants & Cafes' },
      { value: 'retail', label: 'Retail' },
      { value: 'fashion', label: 'Fashion' },
      { value: 'electronics', label: 'Electronics' },
      { value: 'tech', label: 'Technology & Innovation' },
      { value: 'health', label: 'Health & Beauty' },
      { value: 'tourism', label: 'Tourism & Travel' },
      { value: 'realestate', label: 'Real Estate' },
      { value: 'education', label: 'Education & Training' },
      { value: 'other', label: 'Other' },
    ],
    regions: [
      { value: 'riyadh', label: 'Riyadh' },
      { value: 'makkah', label: 'Makkah' },
      { value: 'madinah', label: 'Madinah' },
      { value: 'eastern', label: 'Eastern Province' },
      { value: 'qassim', label: 'Qassim' },
      { value: 'asir', label: 'Asir' },
      { value: 'tabuk', label: 'Tabuk' },
      { value: 'hail', label: 'Hail' },
      { value: 'jouf', label: 'Al Jouf' },
      { value: 'najran', label: 'Najran' },
      { value: 'baha', label: 'Al Baha' },
      { value: 'jazan', label: 'Jazan' },
      { value: 'northern', label: 'Northern Borders' },
    ],
  },
};

// ─── Icons (inline SVGs matching Manus: Phone, Lock/Shield, User) ──
function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ArrowIcon({ className, direction }: { className?: string; direction: 'left' | 'right' }) {
  return direction === 'right' ? (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ) : (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────
export default function MerchantLoginPage() {
  const { language, isRtl } = useLanguageStore();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const lang = language === 'ar' ? t.ar : t.en;

  // State
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [traderName, setTraderName] = useState('');
  const [company, setCompany] = useState('');
  const [activity, setActivity] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [activityOpen, setActivityOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // ─── Handlers ────────────────────
  const handleSendOtp = useCallback(async () => {
    if (phone.length !== 9 || loading) return;
    setLoading(true);
    // Simulate OTP send
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setCountdown(60);
    setStep(2);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  }, [phone, loading]);

  const handleOtpChange = useCallback((index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
    // Auto-verify when all digits filled
    if (value && index === 3 && newOtp.every(d => d)) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(3);
      }, 1000);
    }
  }, [otp]);

  const handleOtpKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handleSubmit = useCallback(async () => {
    if (loading || !traderName) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    // Create mock user and redirect
    setAuth(
      {
        id: 'merchant-' + Date.now(),
        name: traderName,
        email: '',
        phone: '+966' + phone,
        role: 'merchant',
        roles: ['merchant'],
        permissions: [],
        status: 'active',
        createdAt: new Date().toISOString(),
      },
      'mock-token-' + Date.now()
    );
    setLoading(false);
    router.push('/dashboard');
  }, [loading, traderName, phone, setAuth, router]);

  // Step icons config
  const steps = [
    { icon: PhoneIcon, label: lang.stepPhone },
    { icon: LockIcon, label: lang.stepOtp },
    { icon: UserIcon, label: lang.stepInfo },
  ];

  return (
    <div className="min-h-screen flex" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ─── Left Side: Background Image ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/BeyRxPscLHa6nLyozGwKZU/login-bg-AEGz6Y4dg8JP5PVy6uhtii.webp"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A12] via-[#0A0A12]/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <h2
            className="text-3xl font-bold mb-3"
            style={{
              fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif",
              background: 'linear-gradient(135deg, #C5A55A, #E8D5A3, #C5A55A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {lang.brand}
          </h2>
          <p className="text-white/50">{lang.tagline}</p>
        </div>
      </div>

      {/* ─── Right Side: Login Form ─── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#0A0A12] relative">
        {/* Back button */}
        <button
          onClick={() => router.push('/login')}
          className={`absolute top-6 ${isRtl ? 'right-6' : 'left-6'} flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors`}
        >
          {isRtl ? (
            <ArrowIcon className="w-4 h-4" direction="right" />
          ) : (
            <ArrowIcon className="w-4 h-4" direction="left" />
          )}
          {lang.back}
        </button>

        <div className="w-full max-w-md">
          {/* ─── Step Indicator ─── */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step > i + 1
                      ? 'bg-[#C5A55A] text-[#0A0A12]'
                      : step === i + 1
                      ? 'bg-[#C5A55A]/20 text-[#C5A55A] ring-2 ring-[#C5A55A]/50'
                      : 'bg-white/5 text-white/30'
                  }`}
                >
                  {step > i + 1 ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <s.icon className="w-4 h-4" />
                  )}
                </div>
                {i < 2 && (
                  <div
                    className={`w-12 h-0.5 rounded-full transition-colors duration-300 ${
                      step > i + 1 ? 'bg-[#C5A55A]' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ─── Animated Steps ─── */}
          <AnimatePresence mode="wait">
            {/* ────── Step 1: Phone ────── */}
            {step === 1 && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1
                    className="text-2xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}
                  >
                    {lang.loginTitle}
                  </h1>
                  <p className="text-white/50 text-sm">{lang.loginSubtitle}</p>
                </div>

                <div>
                  <label className="text-sm text-white/60 mb-2 block">{lang.phoneLabel}</label>
                  <div className="flex gap-2">
                    <div
                      className="w-20 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm text-white/60 shrink-0"
                      dir="ltr"
                    >
                      +966
                    </div>
                    <input
                      type="tel"
                      dir="ltr"
                      placeholder={lang.phonePlaceholder}
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                      onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                      className="flex-1 h-11 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 px-3 outline-none focus:border-[#C5A55A] focus:ring-1 focus:ring-[#C5A55A]/50 transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={loading || phone.length !== 9}
                  className="w-full bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] hover:opacity-90 font-semibold h-12 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <SpinnerIcon className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    lang.sendOtp
                  )}
                </button>
              </motion.div>
            )}

            {/* ────── Step 2: OTP ────── */}
            {step === 2 && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1
                    className="text-2xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}
                  >
                    {lang.otpTitle}
                  </h1>
                  <p className="text-white/50 text-sm">
                    {lang.otpSubtitle}{' '}
                    <span dir="ltr" className="text-[#C5A55A]">
                      +966{phone}
                    </span>
                  </p>
                </div>

                <div className="flex justify-center gap-3" dir="ltr">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className="w-14 h-14 text-center text-2xl font-bold rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#C5A55A] focus:ring-1 focus:ring-[#C5A55A]/50 outline-none transition-all"
                    />
                  ))}
                </div>

                {loading && (
                  <div className="flex justify-center">
                    <SpinnerIcon className="w-6 h-6 animate-spin text-[#C5A55A]" />
                  </div>
                )}

                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-white/40">
                      {lang.resendIn}{' '}
                      <span className="text-[#C5A55A]">{countdown}</span>{' '}
                      {lang.seconds}
                    </p>
                  ) : (
                    <button
                      onClick={() => setCountdown(60)}
                      className="text-sm text-[#C5A55A] hover:underline"
                    >
                      {lang.resend}
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* ────── Step 3: Trader Info ────── */}
            {step === 3 && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
                className="space-y-5"
              >
                <div className="text-center mb-6">
                  <h1
                    className="text-2xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}
                  >
                    {lang.infoTitle}
                  </h1>
                  <p className="text-white/50 text-sm">{lang.infoSubtitle}</p>
                </div>

                {/* Name */}
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">{lang.nameLabel}</label>
                  <input
                    value={traderName}
                    onChange={e => setTraderName(e.target.value)}
                    className="w-full h-11 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 px-3 outline-none focus:border-[#C5A55A] focus:ring-1 focus:ring-[#C5A55A]/50 transition-all"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">{lang.companyLabel}</label>
                  <input
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className="w-full h-11 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 px-3 outline-none focus:border-[#C5A55A] focus:ring-1 focus:ring-[#C5A55A]/50 transition-all"
                  />
                </div>

                {/* Activity Type - Custom Select */}
                <div className="relative">
                  <label className="text-sm text-white/60 mb-1.5 block">{lang.activityLabel}</label>
                  <button
                    type="button"
                    onClick={() => { setActivityOpen(!activityOpen); setRegionOpen(false); }}
                    className="w-full h-11 rounded-lg bg-white/5 border border-white/10 text-white px-3 outline-none flex items-center justify-between hover:border-white/20 transition-all"
                  >
                    <span className={activity ? 'text-white' : 'text-white/30'}>
                      {activity
                        ? lang.activities.find(a => a.value === activity)?.label
                        : lang.activityLabel}
                    </span>
                    <ChevronDownIcon className={`w-4 h-4 text-white/40 transition-transform ${activityOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {activityOpen && (
                    <div className="absolute z-50 top-full mt-1 w-full bg-[#1a1d27] border border-white/10 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                      {lang.activities.map(a => (
                        <button
                          key={a.value}
                          type="button"
                          onClick={() => { setActivity(a.value); setActivityOpen(false); }}
                          className="w-full text-start px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Region - Custom Select */}
                <div className="relative">
                  <label className="text-sm text-white/60 mb-1.5 block">{lang.regionLabel}</label>
                  <button
                    type="button"
                    onClick={() => { setRegionOpen(!regionOpen); setActivityOpen(false); }}
                    className="w-full h-11 rounded-lg bg-white/5 border border-white/10 text-white px-3 outline-none flex items-center justify-between hover:border-white/20 transition-all"
                  >
                    <span className={region ? 'text-white' : 'text-white/30'}>
                      {region
                        ? lang.regions.find(r => r.value === region)?.label
                        : lang.regionLabel}
                    </span>
                    <ChevronDownIcon className={`w-4 h-4 text-white/40 transition-transform ${regionOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {regionOpen && (
                    <div className="absolute z-50 top-full mt-1 w-full bg-[#1a1d27] border border-white/10 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                      {lang.regions.map(r => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => { setRegion(r.value); setRegionOpen(false); }}
                          className="w-full text-start px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] hover:opacity-90 font-semibold h-12 rounded-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <SpinnerIcon className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    lang.submit
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
