import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/shared/constants';
import type {
  InvestorDashboardStats,
  InvestorSpace,
  InvestorBooking,
  InvestorRevenue,
  InvestorContract,
  InvestorSettings,
  MerchantEvent,
  ApiResponse,
} from '@/shared/types';

const USE_MOCK = true;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Mock Data ──────────────────────────────────────────────

const mockStats: InvestorDashboardStats = {
  totalSpaces: 5,
  activeBookings: 8,
  monthlyRevenue: 75000,
  totalRevenue: 890000,
  pendingRequests: 3,
  occupancyRate: 78,
  activeContracts: 6,
  upcomingEvents: 9,
};

const mockSpaces: InvestorSpace[] = [
  { id: 'sp1', name: 'قاعة الملتقى الكبرى', location: 'طريق الملك فهد', city: 'الرياض', area: 500, type: 'hall', photos: [], pricePerMonth: 25000, pricePerDay: 1500, status: 'booked', amenities: ['تكييف مركزي', 'إنترنت عالي السرعة', 'مواقف سيارات', 'شاشات عرض'], capacity: 300, rating: 4.8, totalBookings: 24 },
  { id: 'sp2', name: 'ساحة المعارض المفتوحة', location: 'حي العليا', city: 'الرياض', area: 1200, type: 'outdoor', photos: [], pricePerMonth: 15000, pricePerDay: 800, status: 'available', amenities: ['إنارة متكاملة', 'مواقف سيارات', 'دورات مياه', 'منطقة تحميل'], capacity: 500, rating: 4.5, totalBookings: 15 },
  { id: 'sp3', name: 'محلات البوليفارد التجارية', location: 'البوليفارد سيتي', city: 'الرياض', area: 80, type: 'shop', photos: [], pricePerMonth: 8000, pricePerDay: 500, status: 'booked', amenities: ['واجهة زجاجية', 'تكييف', 'كهرباء صناعية'], capacity: 20, rating: 4.6, totalBookings: 32 },
  { id: 'sp4', name: 'منطقة البوثات - مركز المعارض', location: 'مركز الرياض الدولي للمعارض', city: 'الرياض', area: 2000, type: 'booth_area', photos: [], pricePerMonth: 45000, pricePerDay: 3000, status: 'available', amenities: ['كهرباء', 'إنترنت', 'تكييف', 'أمن', 'نظافة'], capacity: 100, rating: 4.9, totalBookings: 18 },
  { id: 'sp5', name: 'مستودع الخدمات اللوجستية', location: 'المنطقة الصناعية الثانية', city: 'جدة', area: 800, type: 'warehouse', photos: [], pricePerMonth: 12000, pricePerDay: 600, status: 'maintenance', amenities: ['باب تحميل كبير', 'كهرباء صناعية', 'نظام أمني'], capacity: 0, rating: 4.2, totalBookings: 8 },
];

const mockBookings: InvestorBooking[] = [
  { id: 'bk1', spaceId: 'sp1', spaceName: 'قاعة الملتقى الكبرى', merchantName: 'شركة أحمد للتجارة', merchantPhone: '+966 50 111 2222', startDate: '2026-03-01', endDate: '2026-03-15', totalAmount: 22500, status: 'active', createdAt: '2026-02-20', notes: 'معرض منتجات غذائية' },
  { id: 'bk2', spaceId: 'sp3', spaceName: 'محلات البوليفارد التجارية', merchantName: 'مؤسسة الأزياء الحديثة', merchantPhone: '+966 50 333 4444', startDate: '2026-03-01', endDate: '2026-06-01', totalAmount: 24000, status: 'active', createdAt: '2026-02-18' },
  { id: 'bk3', spaceId: 'sp4', spaceName: 'منطقة البوثات - مركز المعارض', merchantName: 'شركة الإلكترونيات المتقدمة', merchantPhone: '+966 50 555 6666', startDate: '2026-04-01', endDate: '2026-04-05', totalAmount: 15000, status: 'pending', createdAt: '2026-02-25', notes: 'معرض تقنية - 20 بوث' },
  { id: 'bk4', spaceId: 'sp2', spaceName: 'ساحة المعارض المفتوحة', merchantName: 'مجموعة المهرجانات السعودية', merchantPhone: '+966 50 777 8888', startDate: '2026-05-10', endDate: '2026-05-20', totalAmount: 8000, status: 'pending', createdAt: '2026-02-26' },
  { id: 'bk5', spaceId: 'sp1', spaceName: 'قاعة الملتقى الكبرى', merchantName: 'الشركة السعودية للمعارض', merchantPhone: '+966 50 999 0000', startDate: '2026-01-10', endDate: '2026-01-20', totalAmount: 15000, status: 'completed', createdAt: '2025-12-15' },
  { id: 'bk6', spaceId: 'sp4', spaceName: 'منطقة البوثات - مركز المعارض', merchantName: 'مؤسسة الصناعات الحرفية', merchantPhone: '+966 50 222 3333', startDate: '2026-03-20', endDate: '2026-03-25', totalAmount: 15000, status: 'pending', createdAt: '2026-02-27' },
];

const mockRevenue: InvestorRevenue[] = [
  { id: 'rv1', month: 'سبتمبر 2025', amount: 65000, source: 'قاعة الملتقى + محلات البوليفارد', bookingsCount: 4 },
  { id: 'rv2', month: 'أكتوبر 2025', amount: 78000, source: 'جميع المساحات', bookingsCount: 6 },
  { id: 'rv3', month: 'نوفمبر 2025', amount: 92000, source: 'قاعة الملتقى + منطقة البوثات', bookingsCount: 5 },
  { id: 'rv4', month: 'ديسمبر 2025', amount: 110000, source: 'جميع المساحات', bookingsCount: 8 },
  { id: 'rv5', month: 'يناير 2026', amount: 85000, source: 'قاعة الملتقى + مستودع', bookingsCount: 4 },
  { id: 'rv6', month: 'فبراير 2026', amount: 75000, source: 'قاعة الملتقى + محلات البوليفارد', bookingsCount: 5 },
];

const mockContracts: InvestorContract[] = [
  { id: 'ic1', merchantName: 'شركة أحمد للتجارة', spaceName: 'قاعة الملتقى الكبرى', startDate: '2026-03-01', endDate: '2026-03-15', totalValue: 22500, paidAmount: 22500, remainingAmount: 0, status: 'active', signedDate: '2026-02-20' },
  { id: 'ic2', merchantName: 'مؤسسة الأزياء الحديثة', spaceName: 'محلات البوليفارد التجارية', startDate: '2026-03-01', endDate: '2026-06-01', totalValue: 24000, paidAmount: 8000, remainingAmount: 16000, status: 'active', signedDate: '2026-02-18' },
  { id: 'ic3', merchantName: 'الشركة السعودية للمعارض', spaceName: 'قاعة الملتقى الكبرى', startDate: '2026-01-10', endDate: '2026-01-20', totalValue: 15000, paidAmount: 15000, remainingAmount: 0, status: 'completed', signedDate: '2025-12-20' },
  { id: 'ic4', merchantName: 'شركة الإلكترونيات المتقدمة', spaceName: 'منطقة البوثات', startDate: '2026-04-01', endDate: '2026-04-05', totalValue: 15000, paidAmount: 0, remainingAmount: 15000, status: 'pending' },
];

const mockEvents: MerchantEvent[] = [
  // ── حالية ──
  { id: 'ie1', name: 'فعالية على خطاه', description: 'فعالية كبرى تحتاج مساحات متنوعة. فرصة مثالية لعرض مساحاتك للتجار المشاركين في رحلة من مكة إلى المدينة.', location: 'مكة المكرمة - المدينة المنورة', city: 'مكة المكرمة', startDate: '2026-03-01', endDate: '2026-03-30', availableBooths: 15, totalBooths: 40, type: 'cultural', status: 'active' },
  { id: 'ie2', name: 'موسم الرياض 2025-2026', description: 'أضخم حدث ترفيهي في المنطقة. طلب عالي على المساحات والقاعات والمحلات التجارية في جميع المناطق.', location: 'بوليفارد وورلد، بوليفارد سيتي', city: 'الرياض', startDate: '2025-10-10', endDate: '2026-03-31', availableBooths: 40, totalBooths: 200, type: 'entertainment', status: 'active' },
  { id: 'ie3', name: 'LEAP 2026', description: 'أكبر مؤتمر تقني في العالم. فرصة لتأجير مساحات المعارض والقاعات بأسعار مميزة لشركات التقنية.', location: 'مركز الرياض الدولي للمؤتمرات والمعارض', city: 'الرياض', startDate: '2026-03-13', endDate: '2026-03-16', availableBooths: 25, totalBooths: 80, type: 'technology', status: 'active' },
  { id: 'ie4', name: 'بينالي الدرعية 2026', description: 'فعالية فنية عالمية. احتياج لمساحات عرض ومحلات تجارية في حي جاكس التاريخي.', location: 'حي جاكس، الدرعية', city: 'الرياض', startDate: '2026-01-30', endDate: '2026-05-02', availableBooths: 10, totalBooths: 30, type: 'cultural', status: 'active' },

  // ── قادمة ──
  { id: 'ie5', name: 'معرض الرياض التجاري', description: 'معرض تجاري شامل يجذب أكثر من 200 تاجر. احتياج كبير لمساحات العرض والمستودعات.', location: 'الرياض - مركز المعارض', city: 'الرياض', startDate: '2026-04-10', endDate: '2026-04-20', availableBooths: 30, totalBooths: 60, type: 'exhibition', status: 'upcoming' },
  { id: 'ie6', name: 'مهرجان الطعام السعودي', description: 'مهرجان يجمع أشهر المطاعم والطهاة. فرص تأجير مساحات المطاعم والبوثات على الواجهة البحرية.', location: 'الواجهة البحرية', city: 'جدة', startDate: '2026-05-01', endDate: '2026-05-15', availableBooths: 20, totalBooths: 45, type: 'entertainment', status: 'upcoming' },
  { id: 'ie7', name: 'FSB Sports Show Riyadh 2026', description: 'معرض رياضي دولي. طلب مرتفع على مساحات العرض الكبيرة ومناطق البوثات للموردين الرياضيين.', location: 'مركز الرياض الدولي للمعارض', city: 'الرياض', startDate: '2026-06-15', endDate: '2026-06-17', availableBooths: 18, totalBooths: 50, type: 'sports', status: 'upcoming' },
  { id: 'ie8', name: 'كأس العالم للرياضات الإلكترونية 2026', description: 'بطولة عالمية تجذب جمهوراً ضخماً. فرص استثمارية مميزة في تأجير المساحات والمحلات التجارية.', location: 'بوليفارد سيتي', city: 'الرياض', startDate: '2026-08-01', endDate: '2026-08-30', availableBooths: 22, totalBooths: 70, type: 'sports', status: 'upcoming' },
  { id: 'ie9', name: 'Africa Coffee Expo 2026', description: 'معرض متخصص في صناعة القهوة. فرصة لتأجير مساحات المحامص والمقاهي.', location: 'مركز المعارض', city: 'جدة', startDate: '2026-07-20', endDate: '2026-07-23', availableBooths: 12, totalBooths: 35, type: 'exhibition', status: 'upcoming' },
  { id: 'ie10', name: 'المؤتمر السعودي البحري 2026', description: 'مؤتمر متخصص في القطاع البحري. احتياج لقاعات مؤتمرات ومساحات عرض.', location: 'مركز المؤتمرات', city: 'الدمام', startDate: '2026-09-16', endDate: '2026-09-17', availableBooths: 10, totalBooths: 30, type: 'conference', status: 'upcoming' },
  { id: 'ie11', name: 'معرض الطاقة الشمسية وتخزين الطاقة', description: 'معرض حلول الطاقة المتجددة. فرص تأجير مساحات عرض واسعة لشركات الطاقة.', location: 'مركز الرياض الدولي للمعارض', city: 'الرياض', startDate: '2026-09-22', endDate: '2026-09-24', availableBooths: 15, totalBooths: 40, type: 'exhibition', status: 'upcoming' },
  { id: 'ie12', name: 'سوق السفر السعودي 2026', description: 'معرض السياحة والسفر. فرص تأجير محلات ومساحات عرض لشركات الطيران والفنادق.', location: 'مركز الرياض للمعارض', city: 'الرياض', startDate: '2026-10-05', endDate: '2026-10-08', availableBooths: 14, totalBooths: 45, type: 'exhibition', status: 'upcoming' },
  { id: 'ie13', name: 'معرض المدن الذكية - السعودية', description: 'فعالية حلول المدن الذكية. فرص تأجير مساحات تقنية مجهزة بالكامل.', location: 'مركز الرياض الدولي للمؤتمرات', city: 'الرياض', startDate: '2026-11-10', endDate: '2026-11-13', availableBooths: 16, totalBooths: 50, type: 'technology', status: 'upcoming' },
];

const mockSettings: InvestorSettings = {
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    bookingAlerts: true,
    spaceUpdates: true,
    eventReminders: true,
    revenueReports: false,
  },
  display: { language: 'ar', theme: 'light', compactMode: false },
  security: { twoFactorAuth: false },
};

// ── Service ────────────────────────────────────────────────

export const investorService = {
  getStats: async (): Promise<ApiResponse<InvestorDashboardStats>> => {
    if (USE_MOCK) { await delay(600); return { success: true, data: mockStats }; }
    return api.get<ApiResponse<InvestorDashboardStats>>(API_ENDPOINTS.INVESTOR_STATS);
  },

  getSpaces: async (): Promise<ApiResponse<InvestorSpace[]>> => {
    if (USE_MOCK) { await delay(700); return { success: true, data: mockSpaces }; }
    return api.get<ApiResponse<InvestorSpace[]>>(API_ENDPOINTS.INVESTOR_SPACES);
  },

  getBookings: async (): Promise<ApiResponse<InvestorBooking[]>> => {
    if (USE_MOCK) { await delay(600); return { success: true, data: mockBookings }; }
    return api.get<ApiResponse<InvestorBooking[]>>(API_ENDPOINTS.INVESTOR_BOOKINGS);
  },

  updateBookingStatus: async (id: string, status: string): Promise<ApiResponse<InvestorBooking>> => {
    if (USE_MOCK) {
      await delay(500);
      const booking = mockBookings.find(b => b.id === id);
      return { success: true, data: { ...booking!, status: status as InvestorBooking['status'] } };
    }
    return api.put<ApiResponse<InvestorBooking>>(`${API_ENDPOINTS.INVESTOR_BOOKINGS}/${id}`, { status });
  },

  getRevenue: async (): Promise<ApiResponse<InvestorRevenue[]>> => {
    if (USE_MOCK) { await delay(700); return { success: true, data: mockRevenue }; }
    return api.get<ApiResponse<InvestorRevenue[]>>(API_ENDPOINTS.INVESTOR_REVENUE);
  },

  getContracts: async (): Promise<ApiResponse<InvestorContract[]>> => {
    if (USE_MOCK) { await delay(600); return { success: true, data: mockContracts }; }
    return api.get<ApiResponse<InvestorContract[]>>(API_ENDPOINTS.INVESTOR_CONTRACTS);
  },

  getEvents: async (): Promise<ApiResponse<MerchantEvent[]>> => {
    if (USE_MOCK) { await delay(700); return { success: true, data: mockEvents }; }
    return api.get<ApiResponse<MerchantEvent[]>>(API_ENDPOINTS.INVESTOR_EVENTS);
  },

  getSettings: async (): Promise<ApiResponse<InvestorSettings>> => {
    if (USE_MOCK) { await delay(500); return { success: true, data: mockSettings }; }
    return api.get<ApiResponse<InvestorSettings>>(API_ENDPOINTS.INVESTOR_SETTINGS);
  },

  updateSettings: async (settings: InvestorSettings): Promise<ApiResponse<InvestorSettings>> => {
    if (USE_MOCK) { await delay(800); return { success: true, data: settings }; }
    return api.put<ApiResponse<InvestorSettings>>(API_ENDPOINTS.INVESTOR_SETTINGS, settings);
  },
};
