import { authApi } from '@/services/authApi';
import { AUTH_ENDPOINTS } from '@/shared/constants';
import type {
  SponsorAuthResponse,
  LoginCredentials,
  SponsorUser,
  AuthApiLoginResponse,
  AuthApiMeResponse,
  AuthApiGenericResponse,
} from '@/shared/types';

function mapApiUserToSponsor(apiUser: AuthApiLoginResponse['data']['user']): SponsorUser {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    phone: apiUser.phone || '',
    avatar: apiUser.avatar || undefined,
    role: 'sponsor',
    roles: apiUser.roles,
    permissions: apiUser.permissions,
    status: apiUser.status,
    createdAt: apiUser.created_at,
  };
}

export const sponsorAuthService = {
  login: async (credentials: LoginCredentials): Promise<SponsorAuthResponse> => {
    const response = await authApi.post<AuthApiLoginResponse>(AUTH_ENDPOINTS.LOGIN, {
      identifier: credentials.email,
      password: credentials.password,
    });

    return {
      user: mapApiUserToSponsor(response.data.user),
      token: response.data.token,
    };
  },

  logout: async (): Promise<void> => {
    await authApi.post<AuthApiGenericResponse>(AUTH_ENDPOINTS.LOGOUT);
  },

  getProfile: async (): Promise<{ data: SponsorUser }> => {
    const response = await authApi.get<AuthApiMeResponse>(AUTH_ENDPOINTS.ME);
    return { data: mapApiUserToSponsor(response.data) };
  },

  updateProfile: async (data: Partial<SponsorUser>): Promise<{ data: SponsorUser }> => {
    const response = await authApi.put<{ success: boolean; data: AuthApiMeResponse['data'] }>(
      AUTH_ENDPOINTS.PROFILE,
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
      }
    );
    return { data: mapApiUserToSponsor(response.data) };
  },
};
