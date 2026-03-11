import { authApi } from '@/services/authApi';
import { AUTH_ENDPOINTS } from '@/shared/constants';
import type {
  InvestorAuthResponse,
  LoginCredentials,
  InvestorUser,
  AuthApiLoginResponse,
  AuthApiMeResponse,
  AuthApiGenericResponse,
} from '@/shared/types';

function mapApiUserToInvestor(apiUser: AuthApiLoginResponse['data']['user']): InvestorUser {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    phone: apiUser.phone || '',
    avatar: apiUser.avatar || undefined,
    role: 'investor',
    roles: apiUser.roles,
    permissions: apiUser.permissions,
    status: apiUser.status,
    createdAt: apiUser.created_at,
  };
}

export const investorAuthService = {
  login: async (credentials: LoginCredentials): Promise<InvestorAuthResponse> => {
    const response = await authApi.post<AuthApiLoginResponse>(AUTH_ENDPOINTS.LOGIN, {
      identifier: credentials.email,
      password: credentials.password,
    });

    return {
      user: mapApiUserToInvestor(response.data.user),
      token: response.data.token,
    };
  },

  logout: async (): Promise<void> => {
    await authApi.post<AuthApiGenericResponse>(AUTH_ENDPOINTS.LOGOUT);
  },

  getProfile: async (): Promise<{ data: InvestorUser }> => {
    const response = await authApi.get<AuthApiMeResponse>(AUTH_ENDPOINTS.ME);
    return { data: mapApiUserToInvestor(response.data) };
  },

  updateProfile: async (data: Partial<InvestorUser>): Promise<{ data: InvestorUser }> => {
    const response = await authApi.put<{ success: boolean; data: AuthApiMeResponse['data'] }>(
      AUTH_ENDPOINTS.PROFILE,
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
      }
    );
    return { data: mapApiUserToInvestor(response.data) };
  },
};
