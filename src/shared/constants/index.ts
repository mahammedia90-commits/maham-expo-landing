export * from './translations';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',

  // User
  USER_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',

  // Stats
  APP_STATS: '/stats',

  // Contact
  CONTACT: '/contact',

  // Newsletter
  NEWSLETTER_SUBSCRIBE: '/newsletter/subscribe',

  // Events
  EVENTS: '/events',
  EVENT_DETAIL: (id: string) => `/events/${id}`,

  // Spaces
  SPACES: '/spaces',
  SPACE_DETAIL: (id: string) => `/spaces/${id}`,

  // Bookings
  BOOKINGS: '/bookings',
  BOOKING_DETAIL: (id: string) => `/bookings/${id}`,

  // Merchant Auth
  MERCHANT_LOGIN: '/merchant/auth/login',
  MERCHANT_REGISTER: '/merchant/auth/register',
  MERCHANT_LOGOUT: '/merchant/auth/logout',
  MERCHANT_REFRESH: '/merchant/auth/refresh',

  // Merchant Dashboard
  MERCHANT_PROFILE: '/merchant/profile',
  MERCHANT_UPDATE_PROFILE: '/merchant/profile',
  MERCHANT_STATS: '/merchant/dashboard/stats',
  MERCHANT_BOOTHS: '/merchant/booths',
  MERCHANT_BOOTH_DETAIL: (id: string) => `/merchant/booths/${id}`,
  MERCHANT_PAYMENTS: '/merchant/payments',
  MERCHANT_PAYMENT_SUMMARY: '/merchant/payments/summary',
  MERCHANT_DOCUMENTS: '/merchant/documents',
  MERCHANT_UPLOAD_DOCUMENT: '/merchant/documents/upload',
  MERCHANT_EVENTS: '/merchant/events',
} as const;

// App constants
export const APP_CONFIG = {
  APP_NAME: 'Maham Expo',
  APP_NAME_AR: 'مهام إكسبو',
  DEFAULT_LANGUAGE: 'ar' as const,
  SUPPORTED_LANGUAGES: ['ar', 'en'] as const,
  CONTACT_EMAIL: 'info@maham.com.sa',
  CONTACT_PHONE: '+966 53 555 5900',
  WEBSITE_URL: 'https://maham.com.sa',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  LANGUAGE: 'language-storage',
  USER: 'user',
  AUTH_STORE: 'merchant-auth-storage',
} as const;

// Route constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  MERCHANT_LOGIN: '/login/merchant',
  MERCHANT_REGISTER: '/register/merchant',
  DASHBOARD: '/dashboard',
  DASHBOARD_BOOTHS: '/dashboard/booths',
  DASHBOARD_PAYMENTS: '/dashboard/payments',
  DASHBOARD_DOCUMENTS: '/dashboard/documents',
  DASHBOARD_EVENTS: '/dashboard/events',
  DASHBOARD_PROFILE: '/dashboard/profile',
} as const;
