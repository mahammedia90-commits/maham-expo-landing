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

// Auth Types
export interface MerchantUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  commercialRegister?: string;
  avatar?: string;
  role: 'merchant';
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
  businessName: string;
  commercialRegister: string;
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
  boothId: string;
  boothName: string;
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

export interface MerchantEvent {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  availableBooths: number;
  totalBooths: number;
  image?: string;
  status: 'upcoming' | 'active' | 'ended';
}

export interface CreateOrderData {
  type: MerchantOrder['type'];
  eventName: string;
  notes?: string;
}

export interface MerchantOrder {
  id: string;
  orderNumber: string;
  type: 'booth_booking' | 'service_request' | 'space_upgrade' | 'equipment_rental' | 'visit_request';
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  eventName: string;
  submittedAt: string;
  notes?: string;
}

export interface MerchantPermit {
  id: string;
  permitNumber: string;
  type: 'entry_permit' | 'booth_permit' | 'operational_permit' | 'vehicle_permit';
  status: 'active' | 'expired' | 'pending' | 'rejected';
  eventName: string;
  issuedAt: string;
  expiresAt: string;
}

export interface DashboardStats {
  totalBooths: number;
  activeBooths: number;
  totalPaid: number;
  totalRemaining: number;
  pendingDocuments: number;
  upcomingEvents: number;
  totalOrders: number;
  activePermits: number;
}

// Sponsor Types
export interface SponsorUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  commercialRegister?: string;
  avatar?: string;
  role: 'sponsor';
  sponsorLevel: SponsorLevel;
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
  boothArea: string;
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
  boothScans: number;
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
