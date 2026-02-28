import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/shared/constants';
import type {
  DashboardStats,
  Booth,
  Payment,
  PaymentSummary,
  MerchantDocument,
  MerchantEvent,
  MerchantOrder,
  MerchantPermit,
  CreateOrderData,
  ApiResponse,
  MerchantNotification,
  EnhancedDashboardStats,
  MarketplaceService,
  ServiceRequest,
  CreateServiceRequest,
  AnalyticsData,
  MerchantSettings,
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
  upcomingEvents: 9,
  totalOrders: 6,
  activePermits: 3,
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
  // ── الفعاليات الحالية ──
  { id: 'e1', name: 'فعالية على خطاه', description: 'رحلة من مكة المكرمة إلى المدينة المنورة عبر 8 مناطق استراتيجية. احجز بوثك في أكبر فعاليات الرياض الموسمية واستفد من مواقع مميزة للمطاعم والتجزئة.', location: 'مكة المكرمة - المدينة المنورة', city: 'مكة المكرمة', startDate: '2026-03-01', endDate: '2026-03-30', availableBooths: 24, totalBooths: 120, type: 'cultural', status: 'active' },
  { id: 'e2', name: 'موسم الرياض 2025-2026', description: 'أضخم حدث ترفيهي في المنطقة يضم مجموعة متنوعة من الفعاليات الترفيهية والثقافية والرياضية عبر مناطق متعددة تجذب ملايين الزوار.', location: 'بوليفارد وورلد، بوليفارد سيتي، المملكة أرينا', city: 'الرياض', startDate: '2025-10-10', endDate: '2026-03-31', availableBooths: 85, totalBooths: 500, type: 'entertainment', status: 'active' },
  { id: 'e3', name: 'معرض بدايات 2026', description: 'معرض فني وثقافي يسلّط الضوء على بدايات الحركة الفنية السعودية ويستعرض أعمال رواد الفن التشكيلي في المملكة.', location: 'المتحف الوطني السعودي', city: 'الرياض', startDate: '2026-01-27', endDate: '2026-04-11', availableBooths: 12, totalBooths: 40, type: 'cultural', status: 'active' },
  { id: 'e4', name: 'بينالي الدرعية 2026', description: 'فعالية فنية عالمية تجمع أبرز الفنانين من حول العالم في حي جاكس التاريخي بالدرعية. منصة مثالية للعلامات التجارية الفاخرة.', location: 'حي جاكس، الدرعية', city: 'الرياض', startDate: '2026-01-30', endDate: '2026-05-02', availableBooths: 18, totalBooths: 60, type: 'cultural', status: 'active' },
  { id: 'e5', name: 'LEAP 2026', description: 'أحد أكبر المؤتمرات التقنية في العالم. يجمع قادة التقنية والابتكار والشركات الناشئة من أكثر من 170 دولة.', location: 'مركز الرياض الدولي للمؤتمرات والمعارض', city: 'الرياض', startDate: '2026-03-13', endDate: '2026-03-16', availableBooths: 60, totalBooths: 300, type: 'technology', status: 'active' },

  // ── الفعاليات القادمة ──
  { id: 'e6', name: 'معرض الرياض التجاري', description: 'معرض تجاري شامل يضم أفضل العلامات التجارية المحلية والدولية في قلب الرياض.', location: 'الرياض - مركز المعارض', city: 'الرياض', startDate: '2026-04-10', endDate: '2026-04-20', availableBooths: 50, totalBooths: 200, type: 'exhibition', status: 'upcoming' },
  { id: 'e7', name: 'مهرجان الطعام السعودي', description: 'مهرجان يجمع أشهر المطاعم والطهاة لتقديم أفضل الأطباق السعودية والعالمية في أجواء ساحلية مميزة.', location: 'الواجهة البحرية', city: 'جدة', startDate: '2026-05-01', endDate: '2026-05-15', availableBooths: 35, totalBooths: 80, type: 'entertainment', status: 'upcoming' },
  { id: 'e8', name: 'FSB Sports Show Riyadh 2026', description: 'معرض رياضي دولي يجمع أكثر من 200 مورد محلي ودولي متخصص في البنية التحتية الرياضية والملاعب والمرافق.', location: 'مركز الرياض الدولي للمؤتمرات والمعارض', city: 'الرياض', startDate: '2026-06-15', endDate: '2026-06-17', availableBooths: 40, totalBooths: 150, type: 'sports', status: 'upcoming' },
  { id: 'e9', name: 'كأس العالم للرياضات الإلكترونية 2026', description: 'بطولة عالمية كبرى للرياضات الإلكترونية تجذب جمهوراً ضخماً من عشاق الألعاب حول العالم مع فرص تجارية مميزة.', location: 'بوليفارد سيتي', city: 'الرياض', startDate: '2026-08-01', endDate: '2026-08-30', availableBooths: 45, totalBooths: 180, type: 'sports', status: 'upcoming' },
  { id: 'e10', name: 'المؤتمر السعودي البحري 2026', description: 'مؤتمر متخصص في القطاع البحري يستعرض أحدث التقنيات والفرص في الصناعات البحرية والموانئ.', location: 'مركز المؤتمرات', city: 'الدمام', startDate: '2026-09-16', endDate: '2026-09-17', availableBooths: 20, totalBooths: 80, type: 'conference', status: 'upcoming' },
  { id: 'e11', name: 'سوق السفر السعودي 2026', description: 'معرض متخصص في قطاع السياحة والسفر يجمع شركات الطيران والفنادق ووكالات السفر والسياحة.', location: 'مركز الرياض للمعارض', city: 'الرياض', startDate: '2026-10-05', endDate: '2026-10-08', availableBooths: 30, totalBooths: 120, type: 'exhibition', status: 'upcoming' },
  { id: 'e12', name: 'معرض المدن الذكية - السعودية', description: 'فعالية تجمع كبار الموردين والخبراء في حلول المدن الذكية والتقنيات الحضرية المتقدمة ضمن رؤية 2030.', location: 'مركز الرياض الدولي للمؤتمرات', city: 'الرياض', startDate: '2026-11-10', endDate: '2026-11-13', availableBooths: 35, totalBooths: 140, type: 'technology', status: 'upcoming' },
  { id: 'e13', name: 'Africa Coffee Expo 2026', description: 'معرض متخصص في صناعة القهوة يجمع المنتجين والموردين والمحامص من أفريقيا والعالم.', location: 'مركز المعارض', city: 'جدة', startDate: '2026-07-20', endDate: '2026-07-23', availableBooths: 25, totalBooths: 90, type: 'exhibition', status: 'upcoming' },
  { id: 'e14', name: 'معرض الطاقة الشمسية وتخزين الطاقة', description: 'معرض يركز على حلول الطاقة المتجددة والطاقة الشمسية وتقنيات تخزين الطاقة المتقدمة.', location: 'مركز الرياض الدولي للمعارض', city: 'الرياض', startDate: '2026-09-22', endDate: '2026-09-24', availableBooths: 28, totalBooths: 100, type: 'exhibition', status: 'upcoming' },

  // ── الفعاليات المنتهية ──
  { id: 'e15', name: 'IFAT Saudi Arabia 2026', description: 'الحدث الوحيد في المملكة المخصص لتقنيات النفايات والمياه والبيئة. جمع خبراء البيئة من حول العالم.', location: 'مركز الرياض الدولي للمعارض', city: 'الرياض', startDate: '2026-01-26', endDate: '2026-01-28', availableBooths: 0, totalBooths: 90, type: 'exhibition', status: 'ended' },
  { id: 'e16', name: 'معرض مكة بيلدكس 2026', description: 'معرض متخصص في العقار والبناء والصناعة والديكور، يجمع أبرز الشركات والمقاولين في المنطقة الغربية.', location: 'مركز المعارض', city: 'مكة المكرمة', startDate: '2026-01-15', endDate: '2026-01-18', availableBooths: 0, totalBooths: 110, type: 'exhibition', status: 'ended' },
];

const mockOrders: MerchantOrder[] = [
  { id: 'o1', orderNumber: 'ORD-2026-001', type: 'booth_booking', status: 'approved', eventName: 'فعالية على خطاه', submittedAt: '2026-02-20', notes: 'تم الموافقة على حجز بوث A-12' },
  { id: 'o2', orderNumber: 'ORD-2026-002', type: 'service_request', status: 'pending', eventName: 'فعالية على خطاه', submittedAt: '2026-02-22', notes: 'طلب توصيل كهرباء إضافي' },
  { id: 'o3', orderNumber: 'ORD-2026-003', type: 'space_upgrade', status: 'under_review', eventName: 'معرض الرياض التجاري', submittedAt: '2026-02-24' },
  { id: 'o4', orderNumber: 'ORD-2026-004', type: 'equipment_rental', status: 'approved', eventName: 'فعالية على خطاه', submittedAt: '2026-02-18', notes: 'استئجار شاشة عرض 65 بوصة' },
  { id: 'o5', orderNumber: 'ORD-2026-005', type: 'booth_booking', status: 'rejected', eventName: 'مهرجان الطعام السعودي', submittedAt: '2026-02-15', notes: 'المنطقة المطلوبة محجوزة بالكامل' },
  { id: 'o6', orderNumber: 'ORD-2026-006', type: 'service_request', status: 'pending', eventName: 'معرض الرياض التجاري', submittedAt: '2026-02-25' },
];

const mockPermits: MerchantPermit[] = [
  { id: 'pm1', permitNumber: 'PRM-2026-001', type: 'entry_permit', status: 'active', eventName: 'فعالية على خطاه', issuedAt: '2026-02-20', expiresAt: '2026-03-30' },
  { id: 'pm2', permitNumber: 'PRM-2026-002', type: 'booth_permit', status: 'active', eventName: 'فعالية على خطاه', issuedAt: '2026-02-20', expiresAt: '2026-03-30' },
  { id: 'pm3', permitNumber: 'PRM-2026-003', type: 'operational_permit', status: 'active', eventName: 'معرض الرياض التجاري', issuedAt: '2026-02-15', expiresAt: '2026-04-20' },
  { id: 'pm4', permitNumber: 'PRM-2026-004', type: 'vehicle_permit', status: 'expired', eventName: 'موسم الرياض 2025', issuedAt: '2025-10-01', expiresAt: '2025-12-31' },
  { id: 'pm5', permitNumber: 'PRM-2026-005', type: 'entry_permit', status: 'pending', eventName: 'مهرجان الطعام السعودي', issuedAt: '2026-02-25', expiresAt: '2026-05-15' },
  { id: 'pm6', permitNumber: 'PRM-2026-006', type: 'booth_permit', status: 'rejected', eventName: 'مهرجان الطعام السعودي', issuedAt: '2026-02-15', expiresAt: '2026-05-15' },
];

// ── New Mock Data ─────────────────────────────────────────

const mockNotifications: MerchantNotification[] = [
  { id: 'n1', type: 'payment', title: 'دفعة مستحقة', message: 'دفعة بوث C-05 مستحقة في 1 مارس 2026', isRead: false, createdAt: '2026-02-26T10:00:00', actionUrl: '/dashboard/payments' },
  { id: 'n2', type: 'booth', title: 'تحديث حالة البوث', message: 'تم تفعيل بوث B-03 بنجاح', isRead: false, createdAt: '2026-02-25T14:30:00', actionUrl: '/dashboard/booths' },
  { id: 'n3', type: 'document', title: 'مستند قيد المراجعة', message: 'عقد إيجار بوث A-12 قيد المراجعة', isRead: false, createdAt: '2026-02-24T09:15:00', actionUrl: '/dashboard/documents' },
  { id: 'n4', type: 'event', title: 'فعالية قادمة', message: 'فعالية على خطاه تبدأ بعد 3 أيام', isRead: true, createdAt: '2026-02-23T16:00:00', actionUrl: '/dashboard/events' },
  { id: 'n5', type: 'order', title: 'طلب معتمد', message: 'تم الموافقة على طلب استئجار المعدات', isRead: true, createdAt: '2026-02-22T11:00:00', actionUrl: '/dashboard/orders' },
  { id: 'n6', type: 'permit', title: 'تصريح جديد', message: 'تم إصدار تصريح دخول لفعالية على خطاه', isRead: true, createdAt: '2026-02-21T08:45:00', actionUrl: '/dashboard/permits' },
  { id: 'n7', type: 'system', title: 'تحديث النظام', message: 'تم إضافة خدمات جديدة في سوق الخدمات', isRead: true, createdAt: '2026-02-20T12:00:00', actionUrl: '/dashboard/services' },
];

const mockEnhancedStats: EnhancedDashboardStats = {
  ...mockStats,
  recentActivities: [
    { id: 'ra1', type: 'payment', title: 'دفعة مستلمة', description: 'تم استلام دفعة 15,000 ر.س لبوث A-12', timestamp: '2026-02-26T10:00:00' },
    { id: 'ra2', type: 'booking', title: 'حجز بوث جديد', description: 'تم حجز بوث B-03 في معرض الرياض التجاري', timestamp: '2026-02-25T14:30:00' },
    { id: 'ra3', type: 'document', title: 'مستند مرفوع', description: 'تم رفع رخصة البلدية للمراجعة', timestamp: '2026-02-24T09:15:00' },
    { id: 'ra4', type: 'order', title: 'طلب مقدم', description: 'تم تقديم طلب ترقية مساحة', timestamp: '2026-02-23T16:00:00' },
    { id: 'ra5', type: 'permit', title: 'تصريح صادر', description: 'تم إصدار تصريح تشغيلي جديد', timestamp: '2026-02-22T11:00:00' },
  ],
  upcomingTimeline: [
    { id: 'ut1', name: 'LEAP 2026', date: '2026-03-13', daysUntil: 12, location: 'مركز الرياض الدولي للمؤتمرات' },
    { id: 'ut2', name: 'معرض الرياض التجاري', date: '2026-04-10', daysUntil: 40, location: 'الرياض - مركز المعارض' },
    { id: 'ut3', name: 'مهرجان الطعام السعودي', date: '2026-05-01', daysUntil: 61, location: 'جدة - الواجهة البحرية' },
    { id: 'ut4', name: 'FSB Sports Show', date: '2026-06-15', daysUntil: 106, location: 'مركز الرياض الدولي للمعارض' },
    { id: 'ut5', name: 'كأس العالم للرياضات الإلكترونية', date: '2026-08-01', daysUntil: 153, location: 'بوليفارد سيتي، الرياض' },
  ],
  revenueSummary: {
    monthlyData: [
      { month: 'سبتمبر', amount: 8000 },
      { month: 'أكتوبر', amount: 12000 },
      { month: 'نوفمبر', amount: 9500 },
      { month: 'ديسمبر', amount: 15000 },
      { month: 'يناير', amount: 18000 },
      { month: 'فبراير', amount: 22000 },
    ],
    totalRevenue: 84500,
    revenueGoal: 120000,
    goalProgress: 70,
  },
};

const mockServices: MarketplaceService[] = [
  { id: 's1', name: 'أثاث معارض فاخر', category: 'furniture', provider: 'شركة الأثاث الذهبي', description: 'تأثيث كامل للبوث يشمل طاولات وكراسي ورفوف عرض', price: 2500, priceUnit: 'لكل بوث', rating: 4.8 },
  { id: 's2', name: 'إنترنت فائق السرعة', category: 'internet', provider: 'شبكات سريعة', description: 'اتصال إنترنت مخصص بسرعة 100 ميجا مع واي فاي', price: 500, priceUnit: 'لكل يوم', rating: 4.5 },
  { id: 's3', name: 'توصيلات كهربائية', category: 'electricity', provider: 'الطاقة المتكاملة', description: 'توصيل كهرباء مع نقاط إضافية وإضاءة مخصصة', price: 800, priceUnit: 'لكل بوث', rating: 4.7 },
  { id: 's4', name: 'خدمات ضيافة VIP', category: 'hospitality', provider: 'ضيافة الأصيل', description: 'قهوة عربية وتمور ومشروبات وضيافة متكاملة', price: 1500, priceUnit: 'لكل يوم', rating: 4.9 },
  { id: 's5', name: 'طاقم عمل مساعد', category: 'staffing', provider: 'فريق المحترفين', description: 'موظفين مدربين للمساعدة في البوث والاستقبال', price: 300, priceUnit: 'لكل شخص/يوم', rating: 4.6 },
  { id: 's6', name: 'خدمات أمن خاصة', category: 'security', provider: 'الحماية الشاملة', description: 'أفراد أمن مدربين لحماية البوث والبضائع', price: 400, priceUnit: 'لكل شخص/يوم', rating: 4.4 },
  { id: 's7', name: 'تنظيف يومي', category: 'cleaning', provider: 'نظافة بلس', description: 'خدمات تنظيف يومية للبوث مع مواد التنظيف', price: 200, priceUnit: 'لكل يوم', rating: 4.3 },
  { id: 's8', name: 'ديكور وتصميم بوث', category: 'decoration', provider: 'إبداع الديكور', description: 'تصميم وتنفيذ ديكور مخصص للبوث حسب الهوية البصرية', price: 5000, priceUnit: 'لكل بوث', rating: 4.8 },
];

const mockServiceRequests: ServiceRequest[] = [
  { id: 'sr1', serviceId: 's1', serviceName: 'أثاث معارض فاخر', category: 'furniture', eventName: 'فعالية على خطاه', boothName: 'بوث A-12', quantity: 1, totalPrice: 2500, status: 'approved', createdAt: '2026-02-20' },
  { id: 'sr2', serviceId: 's2', serviceName: 'إنترنت فائق السرعة', category: 'internet', eventName: 'فعالية على خطاه', boothName: 'بوث A-12', quantity: 30, totalPrice: 15000, status: 'pending', createdAt: '2026-02-22' },
  { id: 'sr3', serviceId: 's4', serviceName: 'خدمات ضيافة VIP', category: 'hospitality', eventName: 'معرض الرياض التجاري', boothName: 'بوث B-03', quantity: 10, totalPrice: 15000, status: 'pending', createdAt: '2026-02-25' },
];

const mockAnalytics: AnalyticsData = {
  salesByMonth: [
    { month: 'سبتمبر', amount: 8000 },
    { month: 'أكتوبر', amount: 12000 },
    { month: 'نوفمبر', amount: 9500 },
    { month: 'ديسمبر', amount: 15000 },
    { month: 'يناير', amount: 18000 },
    { month: 'فبراير', amount: 22000 },
  ],
  visitorsByDay: [
    { day: 'سبت', count: 120 },
    { day: 'أحد', count: 180 },
    { day: 'اثنين', count: 150 },
    { day: 'ثلاثاء', count: 200 },
    { day: 'أربعاء', count: 175 },
    { day: 'خميس', count: 250 },
    { day: 'جمعة', count: 300 },
  ],
  revenueVsGoal: [
    { month: 'سبتمبر', actual: 8000, goal: 10000 },
    { month: 'أكتوبر', actual: 12000, goal: 12000 },
    { month: 'نوفمبر', actual: 9500, goal: 14000 },
    { month: 'ديسمبر', actual: 15000, goal: 15000 },
    { month: 'يناير', actual: 18000, goal: 16000 },
    { month: 'فبراير', actual: 22000, goal: 20000 },
  ],
  topBooths: [
    { name: 'بوث A-12', revenue: 15000, visitors: 450 },
    { name: 'بوث C-05', revenue: 12000, visitors: 380 },
    { name: 'بوث B-03', revenue: 12000, visitors: 320 },
    { name: 'بوث D-08', revenue: 8000, visitors: 250 },
    { name: 'بوث A-01', revenue: 6000, visitors: 180 },
  ],
  categoryBreakdown: [
    { category: 'طعام', percentage: 40, color: '#987012' },
    { category: 'تجزئة', percentage: 30, color: '#D4B85A' },
    { category: 'خدمات', percentage: 20, color: '#6B7280' },
    { category: 'أخرى', percentage: 10, color: '#9CA3AF' },
  ],
  summary: {
    totalSales: 84500,
    totalVisitors: 1375,
    avgOrderValue: 16900,
    conversionRate: 3.8,
    salesGrowth: 22.2,
    visitorsGrowth: 15.5,
  },
};

const mockSettings: MerchantSettings = {
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    paymentAlerts: true,
    boothUpdates: true,
    eventReminders: true,
    marketingEmails: false,
  },
  display: {
    language: 'ar',
    theme: 'light',
    compactMode: false,
  },
  security: {
    twoFactorAuth: false,
  },
};

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

  getOrders: async (): Promise<ApiResponse<MerchantOrder[]>> => {
    if (USE_MOCK) { await delay(600); return { success: true, data: mockOrders }; }
    return api.get<ApiResponse<MerchantOrder[]>>(API_ENDPOINTS.MERCHANT_ORDERS);
  },

  createOrder: async (data: CreateOrderData): Promise<ApiResponse<MerchantOrder>> => {
    if (USE_MOCK) {
      await delay(1200);
      const newOrder: MerchantOrder = {
        id: 'o' + Date.now(),
        orderNumber: `ORD-2026-${String(mockOrders.length + 1).padStart(3, '0')}`,
        type: data.type,
        status: 'pending',
        eventName: data.eventName,
        submittedAt: new Date().toISOString().split('T')[0],
        notes: data.notes || undefined,
      };
      mockOrders.unshift(newOrder);
      mockStats.totalOrders = mockOrders.length;
      return { success: true, data: newOrder };
    }
    return api.post<ApiResponse<MerchantOrder>>(API_ENDPOINTS.MERCHANT_ORDERS, data);
  },

  getPermits: async (): Promise<ApiResponse<MerchantPermit[]>> => {
    if (USE_MOCK) { await delay(600); return { success: true, data: mockPermits }; }
    return api.get<ApiResponse<MerchantPermit[]>>(API_ENDPOINTS.MERCHANT_PERMITS);
  },

  // ── Notifications ──
  getNotifications: async (): Promise<ApiResponse<MerchantNotification[]>> => {
    if (USE_MOCK) { await delay(400); return { success: true, data: mockNotifications }; }
    return api.get<ApiResponse<MerchantNotification[]>>(API_ENDPOINTS.MERCHANT_NOTIFICATIONS);
  },

  markNotificationRead: async (id: string): Promise<ApiResponse<MerchantNotification>> => {
    if (USE_MOCK) {
      await delay(200);
      const notif = mockNotifications.find((n) => n.id === id);
      if (notif) notif.isRead = true;
      return { success: true, data: notif! };
    }
    return api.put<ApiResponse<MerchantNotification>>(`${API_ENDPOINTS.MERCHANT_NOTIFICATIONS}/${id}/read`, {});
  },

  markAllNotificationsRead: async (): Promise<ApiResponse<{ count: number }>> => {
    if (USE_MOCK) {
      await delay(300);
      mockNotifications.forEach((n) => { n.isRead = true; });
      return { success: true, data: { count: mockNotifications.length } };
    }
    return api.put<ApiResponse<{ count: number }>>(`${API_ENDPOINTS.MERCHANT_NOTIFICATIONS}/read-all`, {});
  },

  // ── Enhanced Stats ──
  getEnhancedStats: async (): Promise<ApiResponse<EnhancedDashboardStats>> => {
    if (USE_MOCK) { await delay(700); return { success: true, data: mockEnhancedStats }; }
    return api.get<ApiResponse<EnhancedDashboardStats>>(API_ENDPOINTS.MERCHANT_ENHANCED_STATS);
  },

  // ── Services Marketplace ──
  getServices: async (): Promise<ApiResponse<MarketplaceService[]>> => {
    if (USE_MOCK) { await delay(500); return { success: true, data: mockServices }; }
    return api.get<ApiResponse<MarketplaceService[]>>(API_ENDPOINTS.MERCHANT_SERVICES);
  },

  getServiceRequests: async (): Promise<ApiResponse<ServiceRequest[]>> => {
    if (USE_MOCK) { await delay(500); return { success: true, data: mockServiceRequests }; }
    return api.get<ApiResponse<ServiceRequest[]>>(API_ENDPOINTS.MERCHANT_SERVICE_REQUESTS);
  },

  createServiceRequest: async (data: CreateServiceRequest): Promise<ApiResponse<ServiceRequest>> => {
    if (USE_MOCK) {
      await delay(1000);
      const svc = mockServices.find((s) => s.id === data.serviceId);
      const newReq: ServiceRequest = {
        id: 'sr' + Date.now(),
        serviceId: data.serviceId,
        serviceName: svc?.name || '',
        category: svc?.category || 'furniture',
        eventName: data.eventName,
        boothName: data.boothName,
        quantity: data.quantity,
        totalPrice: (svc?.price || 0) * data.quantity,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
      };
      mockServiceRequests.unshift(newReq);
      return { success: true, data: newReq };
    }
    return api.post<ApiResponse<ServiceRequest>>(API_ENDPOINTS.MERCHANT_SERVICE_REQUESTS, data);
  },

  // ── Analytics ──
  getAnalytics: async (): Promise<ApiResponse<AnalyticsData>> => {
    if (USE_MOCK) { await delay(600); return { success: true, data: mockAnalytics }; }
    return api.get<ApiResponse<AnalyticsData>>(API_ENDPOINTS.MERCHANT_ANALYTICS);
  },

  // ── Settings ──
  getSettings: async (): Promise<ApiResponse<MerchantSettings>> => {
    if (USE_MOCK) { await delay(400); return { success: true, data: mockSettings }; }
    return api.get<ApiResponse<MerchantSettings>>(API_ENDPOINTS.MERCHANT_SETTINGS);
  },

  updateSettings: async (data: Partial<MerchantSettings>): Promise<ApiResponse<MerchantSettings>> => {
    if (USE_MOCK) {
      await delay(800);
      if (data.notifications) Object.assign(mockSettings.notifications, data.notifications);
      if (data.display) Object.assign(mockSettings.display, data.display);
      if (data.security) Object.assign(mockSettings.security, data.security);
      return { success: true, data: { ...mockSettings } };
    }
    return api.put<ApiResponse<MerchantSettings>>(API_ENDPOINTS.MERCHANT_SETTINGS, data);
  },
};
