'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  User, Building2, Mail, Phone, MapPin, Lock,
  PenLine, Save, TrendingUp, Star, FileText, CreditCard,
  Shield, Globe, Award, CheckCircle2, ArrowUpRight, Calendar
} from 'lucide-react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { language } = useLanguageStore();
  const isAr = language === 'ar';
  const { user } = useAuthStore();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState(user?.email || '');

  const stats = {
    totalBookings: 5,
    paidBookings: 3,
    totalSpent: 67500,
    totalContracts: 2,
    signedContracts: 1,
  };

  const handleSave = () => {
    setEditing(false);
    toast.success(isAr ? 'تم حفظ التغييرات بنجاح' : 'Changes saved successfully');
  };

  const fields = [
    { icon: User, label: isAr ? 'الاسم الكامل' : 'Full Name', value: name, setter: setName, disabled: false },
    { icon: Building2, label: isAr ? 'اسم الشركة / المؤسسة' : 'Company Name', value: company, setter: setCompany, disabled: false },
    { icon: Mail, label: isAr ? 'البريد الإلكتروني' : 'Email Address', value: email, setter: setEmail, disabled: false },
    { icon: Phone, label: isAr ? 'رقم الجوال' : 'Phone Number', value: user?.phone || '+966 5XX XXX XXX', setter: () => {}, disabled: true },
    { icon: Globe, label: isAr ? 'نوع النشاط' : 'Activity Type', value: isAr ? 'تقنية' : 'Technology', setter: () => {}, disabled: true },
    { icon: MapPin, label: isAr ? 'المنطقة' : 'Region', value: isAr ? 'الرياض' : 'Riyadh', setter: () => {}, disabled: true },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
          {isAr ? 'الملف الشخصي' : 'Profile'}
        </h1>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          className={`px-4 py-2 rounded-lg text-sm flex items-center gap-1 ${editing ? 'bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] hover:opacity-90' : 'border border-border/50 hover:bg-accent/50'}`}
        >
          {editing ? <><Save className="w-4 h-4" />{isAr ? 'حفظ' : 'Save'}</> : <><PenLine className="w-4 h-4" />{isAr ? 'تعديل' : 'Edit'}</>}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Avatar Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-card border border-border/50">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#C5A55A] to-[#E8D5A3] flex items-center justify-center text-[#0A0A12] text-3xl font-bold shadow-lg shadow-[#C5A55A]/20">
                {user?.name?.charAt(0) || 'M'}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{user?.name || (isAr ? 'مستخدم' : 'User')}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{company || (isAr ? 'شركة' : 'Company')}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`text-[10px] border-0 px-2 py-0.5 rounded-full flex items-center gap-0.5 ${(user as any)?.email_verified ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    <Shield className="w-3 h-3" />
                    {(user as any)?.email_verified ? (isAr ? 'موثق' : 'Verified') : (isAr ? 'قيد المراجعة' : 'Pending')}
                  </span>
                  <span className="bg-[#C5A55A]/10 text-[#C5A55A] text-[10px] border-0 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <Globe className="w-3 h-3" />{isAr ? 'تاجر' : 'Trader'}
                  </span>
                  <span className="bg-blue-500/10 text-blue-400 text-[10px] border-0 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <Award className="w-3 h-3" />{isAr ? 'عضو نشط' : 'Active Member'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Fields */}
          <div className="space-y-3">
            {fields.map((field, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-xl bg-card border border-border/50 hover:border-border/80 transition-colors"
              >
                <label className="text-xs text-muted-foreground flex items-center gap-1.5 mb-2">
                  <field.icon className="w-3.5 h-3.5" />
                  {field.label}
                  {field.disabled && (
                    <span className="text-[10px] text-muted-foreground/50 ms-auto flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" />{isAr ? 'غير قابل للتعديل' : 'Read only'}
                    </span>
                  )}
                </label>
                {editing && !field.disabled ? (
                  <input
                    value={field.value}
                    onChange={e => field.setter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-accent/50 border border-border/50 text-sm focus:outline-none focus:border-[#C5A55A]/50"
                  />
                ) : (
                  <p className="font-medium text-sm">{field.value || '-'}</p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Account Date */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-4 rounded-xl bg-accent/30 border border-border/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{isAr ? 'تاريخ إنشاء الحساب:' : 'Account created:'}</span>
              <span className="font-medium text-foreground">
                {new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-5 rounded-xl bg-card border border-border/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#C5A55A]" />
              {isAr ? 'إحصائياتي' : 'My Stats'}
            </h3>
            <div className="space-y-3">
              {[
                { icon: Building2, label: isAr ? 'إجمالي الحجوزات' : 'Total Bookings', value: stats.totalBookings, color: '#C5A55A' },
                { icon: CheckCircle2, label: isAr ? 'حجوزات مكتملة' : 'Completed Bookings', value: stats.paidBookings, color: '#4ADE80' },
                { icon: FileText, label: isAr ? 'العقود الموقعة' : 'Signed Contracts', value: `${stats.signedContracts}/${stats.totalContracts}`, color: '#38BDF8' },
                { icon: CreditCard, label: isAr ? 'إجمالي الإنفاق' : 'Total Spent', value: `${stats.totalSpent.toLocaleString()} ${isAr ? 'ر.س' : 'SAR'}`, color: '#A78BFA' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-accent/30">
                  <div className="flex items-center gap-2">
                    <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                  <span className="text-sm font-bold">{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 rounded-xl bg-card border border-border/50">
            <h3 className="font-semibold mb-3">{isAr ? 'روابط سريعة' : 'Quick Links'}</h3>
            <div className="space-y-2">
              {[
                { icon: Shield, label: isAr ? 'التحقق من الهوية (KYC)' : 'Identity Verification (KYC)', href: '/dashboard/kyc', color: '#F59E0B' },
                { icon: Building2, label: isAr ? 'حجوزاتي' : 'My Bookings', href: '/dashboard/bookings', color: '#C5A55A' },
                { icon: FileText, label: isAr ? 'عقودي' : 'My Contracts', href: '/dashboard/contracts', color: '#38BDF8' },
                { icon: Star, label: isAr ? 'تقييماتي' : 'My Reviews', href: '/dashboard/reviews', color: '#A78BFA' },
              ].map((link, i) => (
                <Link key={i} href={link.href}>
                  <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/30 transition-colors cursor-pointer">
                    <link.icon className="w-4 h-4" style={{ color: link.color }} />
                    <span className="text-sm flex-1">{link.label}</span>
                    <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Verification Status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`p-4 rounded-xl border ${(user as any)?.email_verified ? 'bg-green-500/5 border-green-500/20' : 'bg-yellow-500/5 border-yellow-500/20'}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className={`w-5 h-5 ${(user as any)?.email_verified ? 'text-green-400' : 'text-yellow-400'}`} />
              <span className="font-semibold text-sm">{isAr ? 'حالة التحقق' : 'Verification Status'}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {(user as any)?.email_verified
                ? (isAr ? 'تم التحقق من هويتك بنجاح. يمكنك الآن حجز الأجنحة وتوقيع العقود.' : 'Your identity has been verified. You can now book booths and sign contracts.')
                : (isAr ? 'يرجى إكمال التحقق من الهوية لتتمكن من حجز الأجنحة.' : 'Please complete identity verification to book booths.')
              }
            </p>
            {!(user as any)?.email_verified && (
              <Link href="/dashboard/kyc">
                <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] text-xs font-semibold">
                  {isAr ? 'أكمل التحقق' : 'Complete Verification'}
                </button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
