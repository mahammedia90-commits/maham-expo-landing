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
