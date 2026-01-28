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
} as const;

// App constants
export const APP_CONFIG = {
  APP_NAME: 'Maham Expo',
  APP_NAME_AR: 'مهام إكسبو',
  DEFAULT_LANGUAGE: 'ar' as const,
  SUPPORTED_LANGUAGES: ['ar', 'en'] as const,
  CONTACT_EMAIL: 'info@maham.com.sa',
  CONTACT_PHONE: '+966 XX XXX XXXX',
  WEBSITE_URL: 'https://maham.com.sa',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  LANGUAGE: 'language-storage',
  USER: 'user',
} as const;
