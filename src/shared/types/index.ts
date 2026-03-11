// Common types used across the application

export type Language = 'ar' | 'en';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Feature Types
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// User Types
export interface UserType {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  color: string;
}

// Step Types
export interface Step {
  step: string;
  title: string;
  description: string;
}

// FAQ Types
export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

// Contact Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
}

// App Statistics
export interface AppStats {
  activeEvents: number;
  availableSpaces: number;
  totalUsers: number;
}

// Auth API User (from centralized auth service)
export interface AuthApiUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string | null;
  status: 'active' | 'suspended' | 'blocked';
  email_verified: boolean;
  phone_verified: boolean;
  roles: string[];
  permissions: string[];
  last_login_at?: string | null;
  created_at: string;
}

// Auth API Responses
export interface AuthApiLoginResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthApiUser;
    token: string;
    token_type: string;
    expires_in: number;
  };
}

export interface AuthApiRegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthApiUser;
    token: string;
  };
}

export interface AuthApiMeResponse {
  success: boolean;
  data: AuthApiUser;
}

export interface AuthApiRefreshResponse {
  success: boolean;
  data: {
    token: string;
    token_type: string;
    expires_in: number;
  };
}

export interface AuthApiGenericResponse {
  success: boolean;
  message: string;
}

// Auth Types
export interface MerchantUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName?: string;
  commercialRegister?: string;
  avatar?: string;
  role: 'merchant';
  roles?: string[];
  permissions?: string[];
  status?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  role: string;
  businessName?: string;
  commercialRegister?: string;
}

export interface AuthResponse {
  user: MerchantUser;
  token: string;
  refreshToken?: string;
}

// Merchant Dashboard Types
export interface Booth {
  id: string;
  name: string;
  zone: string;
  size: string;
  type: 'food' | 'retail' | 'services' | 'other';
  status: 'active' | 'pending' | 'expired';
  eventName: string;
  startDate: string;
  endDate: string;
  price: number;
  image?: string;
}

export interface Payment {
  id: string;
  unitId: string;
  unitName: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  method?: string;
}

export interface PaymentSummary {
  totalAmount: number;
  totalPaid: number;
  totalRemaining: number;
  totalPayments: number;
  paidPayments: number;
  pendingPayments: number;
}

export interface MerchantDocument {
  id: string;
  name: string;
  type: 'commercial_register' | 'id_card' | 'contract' | 'license' | 'other';
  status: 'approved' | 'pending' | 'rejected';
  fileUrl: string;
  uploadedAt: string;
  expiryDate?: string;
}

export type EventType = 'exhibition' | 'conference' | 'entertainment' | 'cultural' | 'sports' | 'technology';

export interface MerchantEvent {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  location: string;
  city: string;
  startDate: string;
  endDate: string;
  availableUnits: number;
  totalUnits: number;
  image?: string;
  images?: string[];
  type: EventType;
  status: 'upcoming' | 'active' | 'ended';
  organizer?: string;
  organizerEn?: string;
  website?: string;
  email?: string;
  phone?: string;
  lat?: number;
  lon?: number;
  startTime?: string;
  endTime?: string;
  priceType?: 'free' | 'paid';
  priceAmount?: number;
  views?: number;
  stats?: {
    expectedVisitors: number;
    exhibitors: number;
    area: number;
  };
}

export interface CreateOrderData {
  type: MerchantOrder['type'];
  eventName: string;
  notes?: string;
}

export interface MerchantOrder {
  id: string;
  orderNumber: string;
  type: 'unit_booking' | 'service_request' | 'space_upgrade' | 'equipment_rental' | 'visit_request';
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  eventName: string;
  submittedAt: string;
  notes?: string;
}

export interface MerchantPermit {
  id: string;
  permitNumber: string;
  type: 'entry_permit' | 'unit_permit' | 'operational_permit' | 'vehicle_permit';
  status: 'active' | 'expired' | 'pending' | 'rejected';
  eventName: string;
  issuedAt: string;
  expiresAt: string;
}

export interface DashboardStats {
  totalUnits: number;
  activeUnits: number;
  totalPaid: number;
  totalRemaining: number;
  pendingDocuments: number;
  upcomingEvents: number;
  totalOrders: number;
  activePermits: number;
}

// Notification Types
export interface MerchantNotification {
  id: string;
  type: 'payment' | 'unit' | 'document' | 'event' | 'order' | 'permit' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

// Enhanced Dashboard Types
export interface RecentActivity {
  id: string;
  type: 'payment' | 'booking' | 'document' | 'order' | 'permit';
  title: string;
  description: string;
  timestamp: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  href: string;
  color: string;
}

export interface UpcomingEventTimeline {
  id: string;
  name: string;
  date: string;
  daysUntil: number;
  location: string;
}

export interface RevenueSummary {
  monthlyData: { month: string; amount: number }[];
  totalRevenue: number;
  revenueGoal: number;
  goalProgress: number;
}

export interface EnhancedDashboardStats extends DashboardStats {
  recentActivities: RecentActivity[];
  upcomingTimeline: UpcomingEventTimeline[];
  revenueSummary: RevenueSummary;
}

// Service Marketplace Types
export type ServiceCategory = 'furniture' | 'internet' | 'electricity' | 'hospitality' | 'staffing' | 'security' | 'cleaning' | 'decoration';

export interface MarketplaceService {
  id: string;
  name: string;
  category: ServiceCategory;
  provider: string;
  description: string;
  price: number;
  priceUnit: string;
  rating: number;
  image?: string;
}

export interface ServiceRequest {
  id: string;
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  eventName: string;
  unitName: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
}

export interface CreateServiceRequest {
  serviceId: string;
  eventName: string;
  unitName: string;
  quantity: number;
  notes?: string;
}

// Analytics Types
export interface AnalyticsData {
  salesByMonth: { month: string; amount: number }[];
  visitorsByDay: { day: string; count: number }[];
  revenueVsGoal: { month: string; actual: number; goal: number }[];
  topUnits: { name: string; revenue: number; visitors: number }[];
  categoryBreakdown: { category: string; percentage: number; color: string }[];
  summary: {
    totalSales: number;
    totalVisitors: number;
    avgOrderValue: number;
    conversionRate: number;
    salesGrowth: number;
    visitorsGrowth: number;
  };
}

// Settings Types
export interface MerchantSettings {
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    paymentAlerts: boolean;
    unitUpdates: boolean;
    eventReminders: boolean;
    marketingEmails: boolean;
  };
  display: {
    language: 'ar' | 'en';
    theme: 'light' | 'dark';
    compactMode: boolean;
  };
  security: {
    twoFactorAuth: boolean;
  };
}

// Sponsor Types
export interface SponsorUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  commercialRegister?: string;
  avatar?: string;
  role: 'sponsor';
  roles?: string[];
  permissions?: string[];
  status?: string;
  sponsorLevel?: SponsorLevel;
  createdAt: string;
}

export type SponsorLevel = 'platinum' | 'gold' | 'silver' | 'official_partner' | 'media_partner' | 'strategic_alliance';

export interface SponsorPackage {
  id: string;
  name: string;
  level: SponsorLevel;
  price: number;
  duration: string;
  screens: number;
  banners: number;
  mediaAppearances: number;
  vipInvitations: number;
  logoPlacement: string;
  unitArea: string;
  canSponsorSession: boolean;
  canSponsorZone: boolean;
  status: 'active' | 'available' | 'expired';
}

export interface SponsorContract {
  id: string;
  packageId: string;
  packageName: string;
  eventName: string;
  startDate: string;
  endDate: string;
  totalValue: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  signedDate?: string;
}

export interface SponsorExposure {
  id: string;
  channel: string;
  type: 'screen' | 'ticket' | 'app' | 'website' | 'email' | 'push_notification';
  impressions: number;
  clicks: number;
  date: string;
  status: 'active' | 'scheduled' | 'completed';
}

export interface SponsorROIReport {
  id: string;
  eventName: string;
  totalVisitors: number;
  leadsGenerated: number;
  unitScans: number;
  avgVisitorDuration: string;
  conversionRate: number;
  mediaValueEquivalent: number;
  period: string;
}

export interface SponsorPayment {
  id: string;
  contractId: string;
  contractName: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  method?: string;
}

export interface SponsorDashboardStats {
  activeContracts: number;
  totalInvestment: number;
  totalExposure: number;
  leadsGenerated: number;
  roiPercentage: number;
  upcomingEvents: number;
}

export interface SponsorAuthResponse {
  user: SponsorUser;
  token: string;
  refreshToken?: string;
}

// Investor Types
export interface InvestorUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  commercialRegister?: string;
  avatar?: string;
  role: 'investor';
  roles?: string[];
  permissions?: string[];
  status?: string;
  investmentType?: InvestmentType;
  totalSpaces?: number;
  createdAt: string;
}

export type InvestmentType = 'real_estate' | 'commercial' | 'events' | 'mixed';

export interface InvestorSpace {
  id: string;
  name: string;
  location: string;
  city: string;
  area: number;
  type: 'hall' | 'outdoor' | 'shop' | 'unit_area' | 'warehouse';
  photos: string[];
  pricePerMonth: number;
  pricePerDay: number;
  status: 'available' | 'booked' | 'maintenance' | 'inactive';
  amenities: string[];
  capacity: number;
  rating: number;
  totalBookings: number;
}

export interface InvestorBooking {
  id: string;
  spaceId: string;
  spaceName: string;
  merchantName: string;
  merchantPhone: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  notes?: string;
}

export interface InvestorRevenue {
  id: string;
  month: string;
  amount: number;
  source: string;
  bookingsCount: number;
}

export interface InvestorContract {
  id: string;
  merchantName: string;
  spaceName: string;
  startDate: string;
  endDate: string;
  totalValue: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  signedDate?: string;
}

export interface InvestorDashboardStats {
  totalSpaces: number;
  activeBookings: number;
  monthlyRevenue: number;
  totalRevenue: number;
  pendingRequests: number;
  occupancyRate: number;
  activeContracts: number;
  upcomingEvents: number;
}

export interface InvestorSettings {
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    bookingAlerts: boolean;
    spaceUpdates: boolean;
    eventReminders: boolean;
    revenueReports: boolean;
  };
  display: {
    language: 'ar' | 'en';
    theme: 'light' | 'dark';
    compactMode: boolean;
  };
  security: {
    twoFactorAuth: boolean;
  };
}

export interface InvestorAuthResponse {
  user: InvestorUser;
  token: string;
  refreshToken?: string;
}
