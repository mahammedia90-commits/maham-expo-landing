import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/shared/constants';
import type { AuthResponse, LoginCredentials, RegisterData, MerchantUser } from '@/shared/types';

// Set to true to use mock data (no backend needed)
const USE_MOCK = true;

const mockUser: MerchantUser = {
  id: 'merchant-001',
  name: 'أحمد التاجر',
  email: 'merchant@maham.com',
  phone: '+966 55 123 4567',
  businessName: 'مؤسسة أحمد التجارية',
  commercialRegister: '1234567890',
  role: 'merchant',
  createdAt: '2025-06-15T00:00:00Z',
};

const mockLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  await new Promise((r) => setTimeout(r, 800));
  return {
    user: { ...mockUser, email: credentials.email },
    token: 'mock-jwt-token-' + Date.now(),
  };
};

const mockRegister = async (data: RegisterData): Promise<AuthResponse> => {
  await new Promise((r) => setTimeout(r, 1000));
  return {
    user: {
      ...mockUser,
      name: data.name,
      email: data.email,
      phone: data.phone,
      businessName: data.businessName,
      commercialRegister: data.commercialRegister,
    },
    token: 'mock-jwt-token-' + Date.now(),
  };
};

export const authService = {
  login: (credentials: LoginCredentials) =>
    USE_MOCK ? mockLogin(credentials) : api.post<AuthResponse>(API_ENDPOINTS.MERCHANT_LOGIN, credentials),

  register: (data: RegisterData) =>
    USE_MOCK ? mockRegister(data) : api.post<AuthResponse>(API_ENDPOINTS.MERCHANT_REGISTER, data),

  logout: () =>
    USE_MOCK ? Promise.resolve() : api.post(API_ENDPOINTS.MERCHANT_LOGOUT),

  getProfile: () =>
    api.get<{ data: MerchantUser }>(API_ENDPOINTS.MERCHANT_PROFILE),

  updateProfile: (data: Partial<MerchantUser>) =>
    USE_MOCK
      ? Promise.resolve({ data: { ...mockUser, ...data } as MerchantUser })
      : api.put<{ data: MerchantUser }>(API_ENDPOINTS.MERCHANT_UPDATE_PROFILE, data),
};
