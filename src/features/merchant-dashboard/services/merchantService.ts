import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/shared/constants';
import type {
  DashboardStats,
  Booth,
  Payment,
  PaymentSummary,
  MerchantDocument,
  MerchantEvent,
  ApiResponse,
} from '@/shared/types';

// Set to true to use mock data (no backend needed)
const USE_MOCK = true;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Mock Data ──────────────────────────────────────────────

const mockStats: DashboardStats = {
  totalBooths: 5,
  activeBooths: 3,
  totalPaid: 45000,
  totalRemaining: 15000,
  pendingDocuments: 2,
  upcomingEvents: 3,
};

const mockBooths: Booth[] = [
  { id: 'b1', name: 'بوث A-12', zone: 'الجحفة', size: '3×3 م', type: 'food', status: 'active', eventName: 'فعالية على خطاه', startDate: '2026-03-01', endDate: '2026-03-30', price: 15000, },
  { id: 'b2', name: 'بوث C-05', zone: 'الريم', size: '4×4 م', type: 'retail', status: 'active', eventName: 'فعالية على خطاه', startDate: '2026-03-01', endDate: '2026-03-30', price: 20000, },
  { id: 'b3', name: 'بوث D-08', zone: 'أم معبد', size: '2×3 م', type: 'services', status: 'pending', eventName: 'فعالية على خطاه', startDate: '2026-04-01', endDate: '2026-04-30', price: 10000, },
  { id: 'b4', name: 'بوث B-03', zone: 'الأعرج', size: '3×3 م', type: 'food', status: 'active', eventName: 'معرض الرياض التجاري', startDate: '2026-02-15', endDate: '2026-03-15', price: 12000, },
  { id: 'b5', name: 'بوث A-01', zone: 'غار ثور', size: '5×5 م', type: 'retail', status: 'expired', eventName: 'موسم الرياض 2025', startDate: '2025-10-01', endDate: '2025-12-31', price: 25000, },
];

const mockPayments: Payment[] = [
  { id: 'p1', boothId: 'b1', boothName: 'بوث A-12', amount: 15000, paidAmount: 15000, remainingAmount: 0, status: 'paid', dueDate: '2026-02-15', paidDate: '2026-02-10', method: 'تحويل بنكي' },
  { id: 'p2', boothId: 'b2', boothName: 'بوث C-05', amount: 20000, paidAmount: 12000, remainingAmount: 8000, status: 'partial', dueDate: '2026-03-01', paidDate: '2026-02-20', method: 'بطاقة ائتمان' },
  { id: 'p3', boothId: 'b3', boothName: 'بوث D-08', amount: 10000, paidAmount: 0, remainingAmount: 10000, status: 'pending', dueDate: '2026-03-15' },
  { id: 'p4', boothId: 'b4', boothName: 'بوث B-03', amount: 12000, paidAmount: 12000, remainingAmount: 0, status: 'paid', dueDate: '2026-02-01', paidDate: '2026-01-28', method: 'تحويل بنكي' },
  { id: 'p5', boothId: 'b5', boothName: 'بوث A-01', amount: 25000, paidAmount: 6000, remainingAmount: 19000, status: 'overdue', dueDate: '2026-01-15' },
];

const mockPaymentSummary: PaymentSummary = {
  totalAmount: 82000,
  totalPaid: 45000,
  totalRemaining: 37000,
  totalPayments: 5,
  paidPayments: 2,
  pendingPayments: 3,
};

const mockDocuments: MerchantDocument[] = [
  { id: 'd1', name: 'السجل التجاري', type: 'commercial_register', status: 'approved', fileUrl: '#', uploadedAt: '2025-12-01', expiryDate: '2027-12-01' },
  { id: 'd2', name: 'بطاقة الهوية الوطنية', type: 'id_card', status: 'approved', fileUrl: '#', uploadedAt: '2025-12-01' },
  { id: 'd3', name: 'عقد إيجار بوث A-12', type: 'contract', status: 'pending', fileUrl: '#', uploadedAt: '2026-02-10' },
  { id: 'd4', name: 'رخصة البلدية', type: 'license', status: 'pending', fileUrl: '#', uploadedAt: '2026-02-12', expiryDate: '2027-02-12' },
];

const mockEvents: MerchantEvent[] = [
  { id: 'e1', name: 'فعالية على خطاه', description: 'رحلة من مكة المكرمة إلى المدينة المنورة عبر 8 مناطق استراتيجية. احجز بوثك في أكبر فعاليات الرياض الموسمية.', location: 'الرياض', startDate: '2026-03-01', endDate: '2026-03-30', availableBooths: 24, totalBooths: 120, status: 'upcoming' },
  { id: 'e2', name: 'معرض الرياض التجاري', description: 'معرض تجاري شامل يضم أفضل العلامات التجارية المحلية والدولية في قلب الرياض.', location: 'الرياض - مركز المعارض', startDate: '2026-04-10', endDate: '2026-04-20', availableBooths: 50, totalBooths: 200, status: 'upcoming' },
  { id: 'e3', name: 'مهرجان الطعام السعودي', description: 'مهرجان يجمع أشهر المطاعم والطهاة لتقديم أفضل الأطباق السعودية والعالمية.', location: 'جدة - الواجهة البحرية', startDate: '2026-05-01', endDate: '2026-05-15', availableBooths: 35, totalBooths: 80, status: 'upcoming' },
];

// ── Service ────────────────────────────────────────────────

export const merchantService = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    if (USE_MOCK) { await delay(600); return { success: true, data: mockStats }; }
    return api.get<ApiResponse<DashboardStats>>(API_ENDPOINTS.MERCHANT_STATS);
  },

  getBooths: async (): Promise<ApiResponse<Booth[]>> => {
    if (USE_MOCK) { await delay(700); return { success: true, data: mockBooths }; }
    return api.get<ApiResponse<Booth[]>>(API_ENDPOINTS.MERCHANT_BOOTHS);
  },

  getPayments: async (): Promise<ApiResponse<Payment[]>> => {
    if (USE_MOCK) { await delay(600); return { success: true, data: mockPayments }; }
    return api.get<ApiResponse<Payment[]>>(API_ENDPOINTS.MERCHANT_PAYMENTS);
  },

  getPaymentSummary: async (): Promise<ApiResponse<PaymentSummary>> => {
    if (USE_MOCK) { await delay(500); return { success: true, data: mockPaymentSummary }; }
    return api.get<ApiResponse<PaymentSummary>>(API_ENDPOINTS.MERCHANT_PAYMENT_SUMMARY);
  },

  getDocuments: async (): Promise<ApiResponse<MerchantDocument[]>> => {
    if (USE_MOCK) { await delay(600); return { success: true, data: mockDocuments }; }
    return api.get<ApiResponse<MerchantDocument[]>>(API_ENDPOINTS.MERCHANT_DOCUMENTS);
  },

  uploadDocument: async (formData: FormData): Promise<ApiResponse<MerchantDocument>> => {
    if (USE_MOCK) {
      await delay(1500);
      const newDoc: MerchantDocument = {
        id: 'd' + Date.now(),
        name: (formData.get('file') as File)?.name || 'مستند جديد',
        type: 'other',
        status: 'pending',
        fileUrl: '#',
        uploadedAt: new Date().toISOString(),
      };
      mockDocuments.push(newDoc);
      return { success: true, data: newDoc };
    }
    return api.post<ApiResponse<MerchantDocument>>(API_ENDPOINTS.MERCHANT_UPLOAD_DOCUMENT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getEvents: async (): Promise<ApiResponse<MerchantEvent[]>> => {
    if (USE_MOCK) { await delay(700); return { success: true, data: mockEvents }; }
    return api.get<ApiResponse<MerchantEvent[]>>(API_ENDPOINTS.MERCHANT_EVENTS);
  },
};
