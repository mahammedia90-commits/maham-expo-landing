import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/shared/constants';
import type { InvestorAuthResponse, LoginCredentials, InvestorUser } from '@/shared/types';

const USE_MOCK = true;

const mockUser: InvestorUser = {
  id: 'investor-001',
  name: 'عبدالله المستثمر',
  email: 'investor@maham.com',
  phone: '+966 55 123 4567',
  companyName: 'شركة المساحات الذهبية',
  commercialRegister: '1234567890',
  role: 'investor',
  investmentType: 'mixed',
  totalSpaces: 5,
  createdAt: '2025-06-15T00:00:00Z',
};

const VALID_EMAIL = 'admin';
const VALID_PASSWORD = 'admin';

const mockLogin = async (credentials: LoginCredentials): Promise<InvestorAuthResponse> => {
  await new Promise((r) => setTimeout(r, 800));
  if (credentials.email !== VALID_EMAIL || credentials.password !== VALID_PASSWORD) {
    throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  }
  return {
    user: { ...mockUser, email: credentials.email },
    token: 'mock-investor-jwt-token-' + Date.now(),
  };
};

export const investorAuthService = {
  login: (credentials: LoginCredentials) =>
    USE_MOCK ? mockLogin(credentials) : api.post<InvestorAuthResponse>(API_ENDPOINTS.INVESTOR_LOGIN, credentials),

  logout: () =>
    USE_MOCK ? Promise.resolve() : api.post(API_ENDPOINTS.INVESTOR_LOGOUT),

  getProfile: () =>
    api.get<{ data: InvestorUser }>(API_ENDPOINTS.INVESTOR_PROFILE),

  updateProfile: (data: Partial<InvestorUser>) =>
    USE_MOCK
      ? Promise.resolve({ data: { ...mockUser, ...data } as InvestorUser })
      : api.put<{ data: InvestorUser }>(API_ENDPOINTS.INVESTOR_UPDATE_PROFILE, data),
};
