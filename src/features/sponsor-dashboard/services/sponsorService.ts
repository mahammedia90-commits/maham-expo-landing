import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/shared/constants';
import type {
  SponsorDashboardStats,
  SponsorPackage,
  SponsorContract,
  SponsorPayment,
  PaymentSummary,
  SponsorExposure,
  SponsorROIReport,
  MerchantEvent,
  MerchantDocument,
  ApiResponse,
} from '@/shared/types';

const USE_MOCK = true;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Mock Data ──────────────────────────────────────────────

const mockStats: SponsorDashboardStats = {
  activeContracts: 3,
  totalInvestment: 250000,
  totalExposure: 1250000,
  leadsGenerated: 847,
  roiPercentage: 320,
  upcomingEvents: 8,
};

const mockPackages: SponsorPackage[] = [
  { id: 'pkg1', name: 'الباقة البلاتينية', level: 'platinum', price: 150000, duration: '12 شهر', screens: 10, banners: 20, mediaAppearances: 15, vipInvitations: 50, logoPlacement: 'الصفحة الرئيسية + جميع الشاشات', unitArea: '10×10 م', canSponsorSession: true, canSponsorZone: true, status: 'active' },
  { id: 'pkg2', name: 'الباقة الذهبية', level: 'gold', price: 80000, duration: '6 أشهر', screens: 5, banners: 10, mediaAppearances: 8, vipInvitations: 25, logoPlacement: 'الشاشات الرئيسية', unitArea: '6×6 م', canSponsorSession: true, canSponsorZone: false, status: 'active' },
  { id: 'pkg3', name: 'الباقة الفضية', level: 'silver', price: 40000, duration: '3 أشهر', screens: 2, banners: 5, mediaAppearances: 3, vipInvitations: 10, logoPlacement: 'شاشات المنطقة', unitArea: '4×4 م', canSponsorSession: false, canSponsorZone: false, status: 'available' },
  { id: 'pkg4', name: 'شريك إعلامي', level: 'media_partner', price: 25000, duration: '3 أشهر', screens: 1, banners: 3, mediaAppearances: 10, vipInvitations: 5, logoPlacement: 'المواد الإعلامية', unitArea: '3×3 م', canSponsorSession: false, canSponsorZone: false, status: 'available' },
];

const mockContracts: SponsorContract[] = [
  { id: 'c1', packageId: 'pkg1', packageName: 'الباقة البلاتينية', eventName: 'فعالية على خطاه', startDate: '2026-03-01', endDate: '2027-03-01', totalValue: 150000, paidAmount: 100000, remainingAmount: 50000, status: 'active', signedDate: '2026-02-15' },
  { id: 'c2', packageId: 'pkg2', packageName: 'الباقة الذهبية', eventName: 'معرض الرياض التجاري', startDate: '2026-04-10', endDate: '2026-10-10', totalValue: 80000, paidAmount: 80000, remainingAmount: 0, status: 'active', signedDate: '2026-02-01' },
  { id: 'c3', packageId: 'pkg3', packageName: 'الباقة الفضية', eventName: 'مهرجان الطعام السعودي', startDate: '2026-05-01', endDate: '2026-08-01', totalValue: 40000, paidAmount: 20000, remainingAmount: 20000, status: 'pending', signedDate: '2026-02-20' },
];

const mockPayments: SponsorPayment[] = [
  { id: 'sp1', contractId: 'c1', contractName: 'الباقة البلاتينية - على خطاه', amount: 75000, paidAmount: 75000, remainingAmount: 0, status: 'paid', dueDate: '2026-02-15', paidDate: '2026-02-15', method: 'تحويل بنكي' },
  { id: 'sp2', contractId: 'c1', contractName: 'الباقة البلاتينية - على خطاه', amount: 75000, paidAmount: 25000, remainingAmount: 50000, status: 'partial', dueDate: '2026-05-15', paidDate: '2026-03-01', method: 'بطاقة ائتمان' },
  { id: 'sp3', contractId: 'c2', contractName: 'الباقة الذهبية - الرياض التجاري', amount: 80000, paidAmount: 80000, remainingAmount: 0, status: 'paid', dueDate: '2026-02-01', paidDate: '2026-02-01', method: 'تحويل بنكي' },
  { id: 'sp4', contractId: 'c3', contractName: 'الباقة الفضية - مهرجان الطعام', amount: 40000, paidAmount: 20000, remainingAmount: 20000, status: 'pending', dueDate: '2026-04-01' },
];

const mockPaymentSummary: PaymentSummary = {
  totalAmount: 270000,
  totalPaid: 200000,
  totalRemaining: 70000,
  totalPayments: 4,
  paidPayments: 2,
  pendingPayments: 2,
};

const mockExposure: SponsorExposure[] = [
  { id: 'ex1', channel: 'الشاشات الرقمية', type: 'screen', impressions: 450000, clicks: 0, date: '2026-02-20', status: 'active' },
  { id: 'ex2', channel: 'تذاكر الدخول', type: 'ticket', impressions: 120000, clicks: 0, date: '2026-02-20', status: 'active' },
  { id: 'ex3', channel: 'تطبيق المعرض', type: 'app', impressions: 280000, clicks: 15600, date: '2026-02-20', status: 'active' },
  { id: 'ex4', channel: 'موقع المعرض', type: 'website', impressions: 350000, clicks: 28000, date: '2026-02-20', status: 'active' },
  { id: 'ex5', channel: 'حملات البريد الإلكتروني', type: 'email', impressions: 45000, clicks: 8200, date: '2026-02-18', status: 'completed' },
  { id: 'ex6', channel: 'إشعارات التطبيق', type: 'push_notification', impressions: 85000, clicks: 12400, date: '2026-03-01', status: 'scheduled' },
];

const mockROIReports: SponsorROIReport[] = [
  { id: 'roi1', eventName: 'فعالية على خطاه', totalVisitors: 45000, leadsGenerated: 520, unitScans: 3200, avgVisitorDuration: '12 دقيقة', conversionRate: 11.5, mediaValueEquivalent: 480000, period: 'مارس 2026' },
  { id: 'roi2', eventName: 'معرض الرياض التجاري', totalVisitors: 28000, leadsGenerated: 327, unitScans: 1800, avgVisitorDuration: '8 دقائق', conversionRate: 8.2, mediaValueEquivalent: 290000, period: 'أبريل 2026' },
];

// Sponsor events derived from shared database
import { saudiEventsDatabase } from '@/shared/constants/eventsData';
const mockEvents: MerchantEvent[] = saudiEventsDatabase.map((event) => ({
  ...event,
  id: `sp-${event.id}`,
  description: `${event.name} - فرص رعاية مميزة مع ظهور إعلامي واسع وجمهور ضخم. باقات رعاية حصرية تشمل حقوق التسمية والظهور على الشاشات واللوحات الإعلانية.`,
  descriptionEn: `${event.nameEn || event.name} - Premium sponsorship opportunities with extensive media exposure and massive audience. Exclusive packages including naming rights, screen displays, and billboard placements.`,
  availableUnits: Math.max(3, Math.floor(event.availableUnits * 0.3)),
  totalUnits: Math.max(5, Math.floor(event.totalUnits * 0.15)),
}));

const mockDocuments: MerchantDocument[] = [
  { id: 'sd1', name: 'السجل التجاري', type: 'commercial_register', status: 'approved', fileUrl: '#', uploadedAt: '2025-12-01', expiryDate: '2027-12-01' },
  { id: 'sd2', name: 'عقد رعاية بلاتينية', type: 'contract', status: 'approved', fileUrl: '#', uploadedAt: '2026-02-15' },
  { id: 'sd3', name: 'عقد رعاية ذهبية', type: 'contract', status: 'pending', fileUrl: '#', uploadedAt: '2026-02-20' },
];

// ── Service ────────────────────────────────────────────────

export const sponsorService = {
  getStats: async (): Promise<ApiResponse<SponsorDashboardStats>> => {
    if (USE_MOCK) { await delay(600); return { success: true, data: mockStats }; }
    return api.get<ApiResponse<SponsorDashboardStats>>(API_ENDPOINTS.SPONSOR_STATS);
  },

  getPackages: async (): Promise<ApiResponse<SponsorPackage[]>> => {
    if (USE_MOCK) { await delay(700); return { success: true, data: mockPackages }; }
    return api.get<ApiResponse<SponsorPackage[]>>(API_ENDPOINTS.SPONSOR_PACKAGES);
  },

  getContracts: async (): Promise<ApiResponse<SponsorContract[]>> => {
    if (USE_MOCK) { await delay(600); return { success: true, data: mockContracts }; }
    return api.get<ApiResponse<SponsorContract[]>>(API_ENDPOINTS.SPONSOR_CONTRACTS);
  },

  getPayments: async (): Promise<ApiResponse<SponsorPayment[]>> => {
    if (USE_MOCK) { await delay(600); return { success: true, data: mockPayments }; }
    return api.get<ApiResponse<SponsorPayment[]>>(API_ENDPOINTS.SPONSOR_PAYMENTS);
  },

  getPaymentSummary: async (): Promise<ApiResponse<PaymentSummary>> => {
    if (USE_MOCK) { await delay(500); return { success: true, data: mockPaymentSummary }; }
    return api.get<ApiResponse<PaymentSummary>>(API_ENDPOINTS.SPONSOR_PAYMENT_SUMMARY);
  },

  getExposure: async (): Promise<ApiResponse<SponsorExposure[]>> => {
    if (USE_MOCK) { await delay(700); return { success: true, data: mockExposure }; }
    return api.get<ApiResponse<SponsorExposure[]>>(API_ENDPOINTS.SPONSOR_EXPOSURE);
  },

  getROIReports: async (): Promise<ApiResponse<SponsorROIReport[]>> => {
    if (USE_MOCK) { await delay(800); return { success: true, data: mockROIReports }; }
    return api.get<ApiResponse<SponsorROIReport[]>>(API_ENDPOINTS.SPONSOR_ROI);
  },

  getEvents: async (): Promise<ApiResponse<MerchantEvent[]>> => {
    if (USE_MOCK) { await delay(700); return { success: true, data: mockEvents }; }
    return api.get<ApiResponse<MerchantEvent[]>>(API_ENDPOINTS.SPONSOR_EVENTS);
  },

  getDocuments: async (): Promise<ApiResponse<MerchantDocument[]>> => {
    if (USE_MOCK) { await delay(600); return { success: true, data: mockDocuments }; }
    return api.get<ApiResponse<MerchantDocument[]>>(API_ENDPOINTS.SPONSOR_DOCUMENTS);
  },

  uploadDocument: async (formData: FormData): Promise<ApiResponse<MerchantDocument>> => {
    if (USE_MOCK) {
      await delay(1500);
      const newDoc: MerchantDocument = {
        id: 'sd' + Date.now(),
        name: (formData.get('file') as File)?.name || 'مستند جديد',
        type: 'other',
        status: 'pending',
        fileUrl: '#',
        uploadedAt: new Date().toISOString(),
      };
      return { success: true, data: newDoc };
    }
    return api.post<ApiResponse<MerchantDocument>>(API_ENDPOINTS.SPONSOR_UPLOAD_DOCUMENT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
