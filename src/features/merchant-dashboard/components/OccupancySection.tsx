'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';

// ─── Types ───────────────────────────────────────────────
type StaffDepartment = 'operations' | 'sales' | 'security' | 'cleaning' | 'technical' | 'management';
type StaffStatus = 'onDuty' | 'offDuty' | 'onLeave';
type TenantStatus = 'active' | 'pending' | 'inactive';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: StaffDepartment;
  status: StaffStatus;
  shift: string;
  avatar: string;
}

interface Tenant {
  id: string;
  name: string;
  businessType: string;
  activity: string;
  unit: string;
  zone: string;
  status: TenantStatus;
  employeeCount: number;
  avatar: string;
}

interface ZoneData {
  name: string;
  total: number;
  occupied: number;
  category: string;
}

// ─── Mock Data ───────────────────────────────────────────
const zones: ZoneData[] = [
  { name: 'A', total: 15, occupied: 13, category: 'retail' },
  { name: 'B', total: 12, occupied: 10, category: 'food' },
  { name: 'C', total: 10, occupied: 8, category: 'services' },
  { name: 'D', total: 8, occupied: 5, category: 'entertainment' },
  { name: 'E', total: 5, occupied: 2, category: 'vip' },
];

const totalUnits = zones.reduce((s, z) => s + z.total, 0);
const occupiedUnits = zones.reduce((s, z) => s + z.occupied, 0);
const pendingUnits = 4;
const availableUnits = totalUnits - occupiedUnits - pendingUnits;
const occupancyPercent = Math.round((occupiedUnits / totalUnits) * 100);

const staffMembers: StaffMember[] = [
  { id: '1', name: 'أحمد السعيد', role: 'مدير العمليات', department: 'operations', status: 'onDuty', shift: '08:00 - 16:00', avatar: 'أ' },
  { id: '2', name: 'سعاد المطيري', role: 'مشرفة المبيعات', department: 'sales', status: 'onDuty', shift: '08:00 - 16:00', avatar: 'س' },
  { id: '3', name: 'يوسف الغامدي', role: 'مسؤول الأمن', department: 'security', status: 'onDuty', shift: '06:00 - 14:00', avatar: 'ي' },
  { id: '4', name: 'منى العنزي', role: 'منسقة مبيعات', department: 'sales', status: 'onDuty', shift: '10:00 - 18:00', avatar: 'م' },
  { id: '5', name: 'خالد الحارثي', role: 'فني صيانة', department: 'technical', status: 'onDuty', shift: '08:00 - 16:00', avatar: 'خ' },
  { id: '6', name: 'هند الشهري', role: 'مسؤولة النظافة', department: 'cleaning', status: 'onDuty', shift: '06:00 - 14:00', avatar: 'ه' },
  { id: '7', name: 'عمر الدوسري', role: 'مندوب مبيعات', department: 'sales', status: 'offDuty', shift: '14:00 - 22:00', avatar: 'ع' },
  { id: '8', name: 'ريم القحطاني', role: 'مديرة العلاقات', department: 'management', status: 'onDuty', shift: '09:00 - 17:00', avatar: 'ر' },
  { id: '9', name: 'فهد العتيبي', role: 'حارس أمن', department: 'security', status: 'offDuty', shift: '14:00 - 22:00', avatar: 'ف' },
  { id: '10', name: 'نوف الزهراني', role: 'فنية تقنية', department: 'technical', status: 'onLeave', shift: '-', avatar: 'ن' },
  { id: '11', name: 'ماجد السبيعي', role: 'مشغّل أنظمة', department: 'operations', status: 'onDuty', shift: '08:00 - 16:00', avatar: 'م' },
  { id: '12', name: 'لمى الحربي', role: 'مسؤولة تنظيف', department: 'cleaning', status: 'onDuty', shift: '06:00 - 14:00', avatar: 'ل' },
];

const tenants: Tenant[] = [
  { id: '1', name: 'محمد العتيبي', businessType: 'تاجر تجزئة', activity: 'بيع الإلكترونيات والأجهزة الذكية', unit: 'A-101', zone: 'A', status: 'active', employeeCount: 4, avatar: 'م' },
  { id: '2', name: 'فاطمة الزهراني', businessType: 'صاحبة مطعم', activity: 'تقديم المأكولات الشعبية والحلويات', unit: 'B-205', zone: 'B', status: 'active', employeeCount: 8, avatar: 'ف' },
  { id: '3', name: 'عبدالله الشمري', businessType: 'مقدم خدمات', activity: 'خدمات التصوير والتصميم الجرافيكي', unit: 'C-310', zone: 'C', status: 'active', employeeCount: 3, avatar: 'ع' },
  { id: '4', name: 'نورة القحطاني', businessType: 'تاجرة أزياء', activity: 'بيع الملابس والإكسسوارات النسائية', unit: 'A-108', zone: 'A', status: 'pending', employeeCount: 5, avatar: 'ن' },
  { id: '5', name: 'خالد المالكي', businessType: 'تاجر عطور', activity: 'بيع العطور الفرنسية والبخور', unit: 'B-212', zone: 'B', status: 'active', employeeCount: 2, avatar: 'خ' },
  { id: '6', name: 'سارة الحربي', businessType: 'صاحبة كافيه', activity: 'تقديم القهوة المختصة والمشروبات الباردة', unit: 'D-401', zone: 'D', status: 'active', employeeCount: 6, avatar: 'س' },
  { id: '7', name: 'بندر الرشيدي', businessType: 'صاحب محل هدايا', activity: 'بيع الهدايا والتحف والتذكارات', unit: 'A-105', zone: 'A', status: 'active', employeeCount: 3, avatar: 'ب' },
  { id: '8', name: 'أمل السالم', businessType: 'صاحبة صالون', activity: 'خدمات التجميل والعناية بالبشرة', unit: 'C-302', zone: 'C', status: 'active', employeeCount: 7, avatar: 'أ' },
];

// ─── Helpers ─────────────────────────────────────────────
const departmentConfig: Record<StaffDepartment, { color: string; bg: string; darkBg: string }> = {
  operations: { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-100', darkBg: 'dark:bg-blue-900/30' },
  sales: { color: 'text-green-700 dark:text-green-400', bg: 'bg-green-100', darkBg: 'dark:bg-green-900/30' },
  security: { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-100', darkBg: 'dark:bg-red-900/30' },
  cleaning: { color: 'text-cyan-700 dark:text-cyan-400', bg: 'bg-cyan-100', darkBg: 'dark:bg-cyan-900/30' },
  technical: { color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-100', darkBg: 'dark:bg-purple-900/30' },
  management: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100', darkBg: 'dark:bg-amber-900/30' },
};

const statusConfig: Record<StaffStatus, { color: string; dot: string }> = {
  onDuty: { color: 'text-green-600 dark:text-green-400', dot: 'bg-green-500' },
  offDuty: { color: 'text-gray-500 dark:text-gray-400', dot: 'bg-gray-400' },
  onLeave: { color: 'text-yellow-600 dark:text-yellow-400', dot: 'bg-yellow-500' },
};

const tenantStatusColors: Record<TenantStatus, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  inactive: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const avatarGradients = [
  'from-[#987012] to-[#D4B85A]',
  'from-blue-500 to-blue-400',
  'from-green-500 to-emerald-400',
  'from-purple-500 to-violet-400',
  'from-teal-500 to-cyan-400',
  'from-rose-500 to-pink-400',
  'from-orange-500 to-amber-400',
  'from-indigo-500 to-blue-400',
];

type TabKey = 'overview' | 'staff' | 'tenants';

// ─── Component ───────────────────────────────────────────
export function OccupancySection() {
  const { t, isRtl } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [staffFilter, setStaffFilter] = useState<StaffDepartment | 'all'>('all');

  const filteredStaff = staffFilter === 'all'
    ? staffMembers
    : staffMembers.filter(s => s.department === staffFilter);

  const departmentCounts = staffMembers.reduce((acc, s) => {
    acc[s.department] = (acc[s.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const onDutyCount = staffMembers.filter(s => s.status === 'onDuty').length;
  const offDutyCount = staffMembers.filter(s => s.status === 'offDuty').length;
  const onLeaveCount = staffMembers.filter(s => s.status === 'onLeave').length;
  const totalTenantEmployees = tenants.reduce((s, t) => s + t.employeeCount, 0);

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'overview', label: t.dashboard.occupancyOverview, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { key: 'staff', label: t.dashboard.staffMembers, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { key: 'tenants', label: t.dashboard.tenantsList, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  ];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.dashboard.occupancyRate}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.dashboard.occupancyDescription}</p>
      </motion.div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: t.dashboard.occupancyRate, value: `${occupancyPercent}%`, color: 'from-[#987012] to-[#D4B85A]', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
          { label: t.dashboard.totalStaff, value: staffMembers.length, color: 'from-blue-500 to-blue-400', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
          { label: t.dashboard.totalTenants, value: tenants.length, color: 'from-green-500 to-emerald-400', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5' },
          { label: t.dashboard.tenantEmployees, value: totalTenantEmployees, color: 'from-purple-500 to-violet-400', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color}`} />
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-[#987012] to-[#D4B85A] text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
            </svg>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab zones={zones} />}
      {activeTab === 'staff' && (
        <StaffTab
          staff={filteredStaff}
          filter={staffFilter}
          onFilter={setStaffFilter}
          departmentCounts={departmentCounts}
          onDuty={onDutyCount}
          offDuty={offDutyCount}
          onLeave={onLeaveCount}
        />
      )}
      {activeTab === 'tenants' && <TenantsTab tenants={tenants} />}
    </div>
  );
}

// ─── Overview Tab ────────────────────────────────────────
function OverviewTab({ zones }: { zones: ZoneData[] }) {
  const { t } = useLanguageStore();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Occupancy Gauge + Zone Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Circular Gauge */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">{t.dashboard.overallOccupancy}</h3>
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-700" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  strokeWidth="8" strokeLinecap="round"
                  className="text-[#987012]"
                  strokeDasharray={`${occupancyPercent * 3.14} ${314 - occupancyPercent * 3.14}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">{occupancyPercent}%</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.dashboard.occupied}</span>
              </div>
            </div>
            <div className="flex gap-6 mt-6">
              <div className="text-center">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{t.dashboard.occupiedUnits}</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{occupiedUnits}</span>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{t.dashboard.pendingReservations}</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{pendingUnits}</span>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{t.dashboard.availableForRent}</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{availableUnits}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Zone Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">{t.dashboard.occupancyByZone}</h3>
          <div className="space-y-4">
            {zones.map((zone, i) => {
              const pct = Math.round((zone.occupied / zone.total) * 100);
              return (
                <motion.div
                  key={zone.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#987012] to-[#D4B85A] flex items-center justify-center text-white text-xs font-bold">
                        {zone.name}
                      </span>
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{t.dashboard.zone} {zone.name}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 mx-2">·</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{t.dashboard[zone.category as keyof typeof t.dashboard] || zone.category}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{zone.occupied}/{zone.total}</span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className={`h-full rounded-full ${
                        pct >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                        pct >= 50 ? 'bg-gradient-to-r from-[#987012] to-[#D4B85A]' :
                        'bg-gradient-to-r from-orange-500 to-amber-400'
                      }`}
                    />
                  </div>
                  <div className="text-end mt-0.5">
                    <span className={`text-xs font-medium ${
                      pct >= 80 ? 'text-green-600 dark:text-green-400' :
                      pct >= 50 ? 'text-[#987012] dark:text-[#D4B85A]' :
                      'text-orange-600 dark:text-orange-400'
                    }`}>{pct}%</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visual Grid Map */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">{t.dashboard.unitsMap}</h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {Array.from({ length: totalUnits }).map((_, i) => {
            const isOccupied = i < occupiedUnits;
            const isPending = !isOccupied && i < occupiedUnits + pendingUnits;
            return (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.01 }}
                className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold transition-all cursor-default ${
                  isOccupied
                    ? 'bg-gradient-to-br from-[#987012] to-[#D4B85A] text-white shadow-sm'
                    : isPending
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-600'
                }`}
                title={isOccupied ? t.dashboard.occupied : isPending ? t.dashboard.pending : t.dashboard.availableForRent}
              >
                {i + 1}
              </motion.div>
            );
          })}
        </div>
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-gradient-to-br from-[#987012] to-[#D4B85A]" />
            <span className="text-xs text-gray-600 dark:text-gray-400">{t.dashboard.occupied} ({occupiedUnits})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700" />
            <span className="text-xs text-gray-600 dark:text-gray-400">{t.dashboard.pending} ({pendingUnits})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600" />
            <span className="text-xs text-gray-600 dark:text-gray-400">{t.dashboard.availableForRent} ({availableUnits})</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Staff Tab ───────────────────────────────────────────
function StaffTab({
  staff, filter, onFilter, departmentCounts, onDuty, offDuty, onLeave,
}: {
  staff: StaffMember[];
  filter: StaffDepartment | 'all';
  onFilter: (f: StaffDepartment | 'all') => void;
  departmentCounts: Record<string, number>;
  onDuty: number;
  offDuty: number;
  onLeave: number;
}) {
  const { t, isRtl } = useLanguageStore();

  const departments: { key: StaffDepartment | 'all'; label: string }[] = [
    { key: 'all', label: t.dashboard.allDepartments },
    { key: 'operations', label: t.dashboard.deptOperations },
    { key: 'sales', label: t.dashboard.deptSales },
    { key: 'security', label: t.dashboard.deptSecurity },
    { key: 'cleaning', label: t.dashboard.deptCleaning },
    { key: 'technical', label: t.dashboard.deptTechnical },
    { key: 'management', label: t.dashboard.deptManagement },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-center">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{onDuty}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{t.dashboard.onDuty}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-2">
            <span className="w-3 h-3 rounded-full bg-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{offDuty}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{t.dashboard.offDuty}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-center">
          <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{onLeave}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{t.dashboard.onLeave}</div>
        </div>
      </div>

      {/* Department Filter */}
      <div className="flex flex-wrap gap-2">
        {departments.map((dept) => (
          <button
            key={dept.key}
            onClick={() => onFilter(dept.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === dept.key
                ? 'bg-[#987012] text-white shadow-md'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#987012] dark:hover:border-[#D4B85A]'
            }`}
          >
            {dept.label}
            {dept.key !== 'all' && departmentCounts[dept.key] && (
              <span className={`${filter === dept.key ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'} px-1.5 py-0.5 rounded text-[10px] ${isRtl ? 'mr-1.5' : 'ml-1.5'}`}>
                {departmentCounts[dept.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Staff List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {staff.map((member, i) => {
            const deptStyle = departmentConfig[member.department];
            const statusStyle = statusConfig[member.status];
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center text-white font-bold flex-shrink-0 relative`}>
                  {member.avatar}
                  <span className={`absolute -bottom-0.5 ${isRtl ? '-left-0.5' : '-right-0.5'} w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${statusStyle.dot}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{member.name}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${deptStyle.bg} ${deptStyle.darkBg} ${deptStyle.color}`}>
                      {departments.find(d => d.key === member.department)?.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{member.role}</p>
                </div>
                <div className="flex-shrink-0 text-end">
                  <div className={`text-xs font-medium ${statusStyle.color}`}>
                    {t.dashboard[member.status]}
                  </div>
                  <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1 justify-end">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {member.shift}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Tenants Tab ─────────────────────────────────────────
function TenantsTab({ tenants }: { tenants: Tenant[] }) {
  const { t, isRtl } = useLanguageStore();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tenants.map((tenant, i) => (
          <motion.div
            key={tenant.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-[#987012]/30 dark:hover:border-[#D4B85A]/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg`}>
                {tenant.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-900 dark:text-white">{tenant.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tenantStatusColors[tenant.status]}`}>
                    {t.dashboard[tenant.status]}
                  </span>
                </div>
                <p className="text-sm text-[#987012] dark:text-[#D4B85A] font-medium mt-1">{tenant.businessType}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tenant.activity}</p>
              </div>
            </div>

            {/* Tenant Meta */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="text-center">
                <div className="text-xs text-gray-400 dark:text-gray-500">{t.dashboard.unitNumber}</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{tenant.unit}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400 dark:text-gray-500">{t.dashboard.zone}</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{tenant.zone}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400 dark:text-gray-500">{t.dashboard.employees}</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{tenant.employeeCount}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
