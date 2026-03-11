export * from './translations';

// Centralized Auth Service Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  PROFILE: '/auth/profile',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',
  SEND_VERIFICATION: '/auth/email/send-verification',
  VERIFY_EMAIL: '/auth/email/verify',
  VERIFY_TOKEN: '/verify-token',
  CHECK_PERMISSION: '/check-permission',
  CHECK_PERMISSIONS: '/check-permissions',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  // Auth (legacy - use AUTH_ENDPOINTS for centralized auth service)
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
  MERCHANT_BOOTHS: '/merchant/units',
  MERCHANT_BOOTH_DETAIL: (id: string) => `/merchant/units/${id}`,
  MERCHANT_PAYMENTS: '/merchant/payments',
  MERCHANT_PAYMENT_SUMMARY: '/merchant/payments/summary',
  MERCHANT_DOCUMENTS: '/merchant/documents',
  MERCHANT_UPLOAD_DOCUMENT: '/merchant/documents/upload',
  MERCHANT_EVENTS: '/merchant/events',
  MERCHANT_ORDERS: '/merchant/orders',
  MERCHANT_PERMITS: '/merchant/permits',
  MERCHANT_NOTIFICATIONS: '/merchant/notifications',
  MERCHANT_ENHANCED_STATS: '/merchant/dashboard/enhanced-stats',
  MERCHANT_SERVICES: '/merchant/services',
  MERCHANT_SERVICE_REQUESTS: '/merchant/service-requests',
  MERCHANT_ANALYTICS: '/merchant/analytics',
  MERCHANT_SETTINGS: '/merchant/settings',

  // Sponsor Auth
  SPONSOR_LOGIN: '/sponsor/auth/login',
  SPONSOR_REGISTER: '/sponsor/auth/register',
  SPONSOR_LOGOUT: '/sponsor/auth/logout',
  SPONSOR_REFRESH: '/sponsor/auth/refresh',

  // Sponsor Dashboard
  SPONSOR_PROFILE: '/sponsor/profile',
  SPONSOR_UPDATE_PROFILE: '/sponsor/profile',
  SPONSOR_STATS: '/sponsor/dashboard/stats',
  SPONSOR_PACKAGES: '/sponsor/packages',
  SPONSOR_CONTRACTS: '/sponsor/contracts',
  SPONSOR_PAYMENTS: '/sponsor/payments',
  SPONSOR_PAYMENT_SUMMARY: '/sponsor/payments/summary',
  SPONSOR_EXPOSURE: '/sponsor/exposure',
  SPONSOR_ROI: '/sponsor/roi',
  SPONSOR_DOCUMENTS: '/sponsor/documents',
  SPONSOR_UPLOAD_DOCUMENT: '/sponsor/documents/upload',
  SPONSOR_EVENTS: '/sponsor/events',

  // Investor Auth
  INVESTOR_LOGIN: '/investor/auth/login',
  INVESTOR_REGISTER: '/investor/auth/register',
  INVESTOR_LOGOUT: '/investor/auth/logout',
  INVESTOR_REFRESH: '/investor/auth/refresh',

  // Investor Dashboard
  INVESTOR_PROFILE: '/investor/profile',
  INVESTOR_UPDATE_PROFILE: '/investor/profile',
  INVESTOR_STATS: '/investor/dashboard/stats',
  INVESTOR_SPACES: '/investor/spaces',
  INVESTOR_BOOKINGS: '/investor/bookings',
  INVESTOR_REVENUE: '/investor/revenue',
  INVESTOR_CONTRACTS: '/investor/contracts',
  INVESTOR_EVENTS: '/investor/events',
  INVESTOR_SETTINGS: '/investor/settings',
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
  SPONSOR_AUTH_STORE: 'sponsor-auth-storage',
  INVESTOR_AUTH_STORE: 'investor-auth-storage',
} as const;

// Route constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  MERCHANT_LOGIN: '/login/merchant',
  MERCHANT_REGISTER: '/register/merchant',
  DASHBOARD: '/dashboard',
  DASHBOARD_BOOTHS: '/dashboard/units',
  DASHBOARD_PAYMENTS: '/dashboard/payments',
  DASHBOARD_DOCUMENTS: '/dashboard/documents',
  DASHBOARD_ORDERS: '/dashboard/orders',
  DASHBOARD_EVENTS: '/dashboard/events',
  DASHBOARD_PERMITS: '/dashboard/permits',
  DASHBOARD_SERVICES: '/dashboard/services',
  DASHBOARD_OCCUPANCY: '/dashboard/occupancy',
  DASHBOARD_ANALYTICS: '/dashboard/analytics',
  DASHBOARD_SETTINGS: '/dashboard/settings',
  DASHBOARD_PROFILE: '/dashboard/profile',
  // Sponsor
  SPONSOR_LOGIN_PAGE: '/login/sponsor',
  SPONSOR_DASHBOARD: '/sponsor-dashboard',
  SPONSOR_DASHBOARD_PACKAGES: '/sponsor-dashboard/packages',
  SPONSOR_DASHBOARD_CONTRACTS: '/sponsor-dashboard/contracts',
  SPONSOR_DASHBOARD_PAYMENTS: '/sponsor-dashboard/payments',
  SPONSOR_DASHBOARD_EXPOSURE: '/sponsor-dashboard/exposure',
  SPONSOR_DASHBOARD_ROI: '/sponsor-dashboard/roi',
  SPONSOR_DASHBOARD_EVENTS: '/sponsor-dashboard/events',
  SPONSOR_DASHBOARD_PROFILE: '/sponsor-dashboard/profile',
  // Investor
  INVESTOR_LOGIN_PAGE: '/login/investor',
  INVESTOR_DASHBOARD: '/investor-dashboard',
  INVESTOR_DASHBOARD_SPACES: '/investor-dashboard/spaces',
  INVESTOR_DASHBOARD_BOOKINGS: '/investor-dashboard/bookings',
  INVESTOR_DASHBOARD_REVENUE: '/investor-dashboard/revenue',
  INVESTOR_DASHBOARD_CONTRACTS: '/investor-dashboard/contracts',
  INVESTOR_DASHBOARD_EVENTS: '/investor-dashboard/events',
  INVESTOR_DASHBOARD_SETTINGS: '/investor-dashboard/settings',
  INVESTOR_DASHBOARD_PROFILE: '/investor-dashboard/profile',
  // Auth pages
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
} as const;
