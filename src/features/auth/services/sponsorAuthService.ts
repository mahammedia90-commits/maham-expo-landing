import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/shared/constants';
import type { SponsorAuthResponse, LoginCredentials, SponsorUser } from '@/shared/types';

const USE_MOCK = true;

const mockUser: SponsorUser = {
  id: 'sponsor-001',
  name: 'محمد الراعي',
  email: 'sponsor@maham.com',
  phone: '+966 55 987 6543',
  companyName: 'شركة الرعاية الذهبية',
  commercialRegister: '9876543210',
  role: 'sponsor',
  sponsorLevel: 'gold',
  createdAt: '2025-08-01T00:00:00Z',
};

const mockLogin = async (credentials: LoginCredentials): Promise<SponsorAuthResponse> => {
  await new Promise((r) => setTimeout(r, 800));
  return {
    user: { ...mockUser, email: credentials.email },
    token: 'mock-sponsor-jwt-token-' + Date.now(),
  };
};

export const sponsorAuthService = {
  login: (credentials: LoginCredentials) =>
    USE_MOCK ? mockLogin(credentials) : api.post<SponsorAuthResponse>(API_ENDPOINTS.SPONSOR_LOGIN, credentials),

  logout: () =>
    USE_MOCK ? Promise.resolve() : api.post(API_ENDPOINTS.SPONSOR_LOGOUT),

  getProfile: () =>
    api.get<{ data: SponsorUser }>(API_ENDPOINTS.SPONSOR_PROFILE),

  updateProfile: (data: Partial<SponsorUser>) =>
    USE_MOCK
      ? Promise.resolve({ data: { ...mockUser, ...data } as SponsorUser })
      : api.put<{ data: SponsorUser }>(API_ENDPOINTS.SPONSOR_UPDATE_PROFILE, data),
};
