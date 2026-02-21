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

export interface DashboardStats {
  totalBooths: number;
  activeBooths: number;
  totalPaid: number;
  totalRemaining: number;
  pendingDocuments: number;
  upcomingEvents: number;
}
