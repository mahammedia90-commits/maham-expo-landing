import { authApi } from '@/services/authApi';
import { AUTH_ENDPOINTS } from '@/shared/constants';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  MerchantUser,
  AuthApiLoginResponse,
  AuthApiRegisterResponse,
  AuthApiMeResponse,
  AuthApiGenericResponse,
} from '@/shared/types';

function mapApiUserToMerchant(apiUser: AuthApiLoginResponse['data']['user']): MerchantUser {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    phone: apiUser.phone || '',
    avatar: apiUser.avatar || undefined,
    role: 'merchant',
    roles: apiUser.roles,
    permissions: apiUser.permissions,
    status: apiUser.status,
    createdAt: apiUser.created_at,
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await authApi.post<AuthApiLoginResponse>(AUTH_ENDPOINTS.LOGIN, {
      identifier: credentials.email,
      password: credentials.password,
    });

    return {
      user: mapApiUserToMerchant(response.data.user),
      token: response.data.token,
    };
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await authApi.post<AuthApiRegisterResponse>(AUTH_ENDPOINTS.REGISTER, {
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
      phone: data.phone,
      roles: [data.role],
    });

    return {
      user: mapApiUserToMerchant(response.data.user),
      token: response.data.token,
    };
  },

  logout: async (): Promise<void> => {
    await authApi.post<AuthApiGenericResponse>(AUTH_ENDPOINTS.LOGOUT);
  },

  getProfile: async (): Promise<{ data: MerchantUser }> => {
    const response = await authApi.get<AuthApiMeResponse>(AUTH_ENDPOINTS.ME);
    return { data: mapApiUserToMerchant(response.data) };
  },

  updateProfile: async (data: Partial<MerchantUser>): Promise<{ data: MerchantUser }> => {
    const response = await authApi.put<{ success: boolean; data: AuthApiMeResponse['data'] }>(
      AUTH_ENDPOINTS.PROFILE,
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
      }
    );
    return { data: mapApiUserToMerchant(response.data) };
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await authApi.post<{ success: boolean; data: { token: string } }>(
      AUTH_ENDPOINTS.REFRESH
    );
    return { token: response.data.token };
  },

  changePassword: async (currentPassword: string, password: string, passwordConfirmation: string): Promise<void> => {
    await authApi.post<AuthApiGenericResponse>(AUTH_ENDPOINTS.CHANGE_PASSWORD, {
      current_password: currentPassword,
      password,
      password_confirmation: passwordConfirmation,
    });
  },

  forgotPassword: async (email: string): Promise<void> => {
    await authApi.post<AuthApiGenericResponse>(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
  },

  resetPassword: async (email: string, token: string, password: string, passwordConfirmation: string): Promise<void> => {
    await authApi.post<AuthApiGenericResponse>(AUTH_ENDPOINTS.RESET_PASSWORD, {
      email,
      token,
      password,
      password_confirmation: passwordConfirmation,
    });
  },

  sendVerificationEmail: async (): Promise<void> => {
    await authApi.post<AuthApiGenericResponse>(AUTH_ENDPOINTS.SEND_VERIFICATION);
  },

  verifyEmail: async (code: string): Promise<void> => {
    await authApi.post<AuthApiGenericResponse>(AUTH_ENDPOINTS.VERIFY_EMAIL, { code });
  },

  verifyToken: async (token: string): Promise<{ valid: boolean }> => {
    const response = await authApi.post<{ success: boolean; data: { valid: boolean } }>(
      AUTH_ENDPOINTS.VERIFY_TOKEN,
      { token }
    );
    return { valid: response.data.valid };
  },
};
