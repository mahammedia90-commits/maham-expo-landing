import { authApi } from '@/services/authApi';

// Types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string | null;
  status: 'active' | 'suspended' | 'blocked';
  email_verified: boolean;
  phone_verified: boolean;
  roles: string[];
  permissions: string[];
  last_login_at?: string | null;
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  display_name?: string;
  description?: string;
  permissions?: Permission[];
  created_at?: string;
}

export interface Permission {
  id: string;
  name: string;
  display_name?: string;
  description?: string;
  created_at?: string;
}

export interface Service {
  id: string;
  name: string;
  base_url: string;
  description?: string;
  is_active: boolean;
  token?: string;
  created_at?: string;
}

// Paginated response wrapper
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface SingleResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Users API
export const usersApi = {
  list: (params?: { page?: number; search?: string; status?: string; role?: string }) =>
    authApi.get<PaginatedResponse<AdminUser>>('/users', { params }),

  get: (id: string) =>
    authApi.get<SingleResponse<AdminUser>>(`/users/${id}`),

  create: (data: { name: string; email: string; password: string; password_confirmation: string; phone?: string; status?: string; roles?: string[] }) =>
    authApi.post<SingleResponse<AdminUser>>('/users', data),

  update: (id: string, data: { name?: string; email?: string; phone?: string; status?: string; roles?: string[] }) =>
    authApi.put<SingleResponse<AdminUser>>(`/users/${id}`, data),

  delete: (id: string) =>
    authApi.delete<SingleResponse<null>>(`/users/${id}`),
};

// Roles API
export const rolesApi = {
  list: () =>
    authApi.get<PaginatedResponse<Role>>('/roles'),

  get: (id: string) =>
    authApi.get<SingleResponse<Role>>(`/roles/${id}`),

  create: (data: { name: string; display_name?: string; description?: string }) =>
    authApi.post<SingleResponse<Role>>('/roles', data),

  update: (id: string, data: { name?: string; display_name?: string; description?: string }) =>
    authApi.put<SingleResponse<Role>>(`/roles/${id}`, data),

  delete: (id: string) =>
    authApi.delete<SingleResponse<null>>(`/roles/${id}`),

  syncPermissions: (id: string, permissions: string[]) =>
    authApi.post<SingleResponse<Role>>(`/roles/${id}/permissions`, { permissions }),

  addPermissions: (id: string, permissions: string[]) =>
    authApi.post<SingleResponse<Role>>(`/roles/${id}/permissions/add`, { permissions }),

  removePermissions: (id: string, permissions: string[]) =>
    authApi.post<SingleResponse<Role>>(`/roles/${id}/permissions/remove`, { permissions }),
};

// Permissions API
export const permissionsApi = {
  list: () =>
    authApi.get<PaginatedResponse<Permission>>('/permissions'),

  get: (id: string) =>
    authApi.get<SingleResponse<Permission>>(`/permissions/${id}`),

  create: (data: { name: string; display_name?: string; description?: string }) =>
    authApi.post<SingleResponse<Permission>>('/permissions', data),

  createResource: (data: { resource: string; actions?: string[] }) =>
    authApi.post<SingleResponse<Permission[]>>('/permissions/resource', data),

  update: (id: string, data: { name?: string; display_name?: string; description?: string }) =>
    authApi.put<SingleResponse<Permission>>(`/permissions/${id}`, data),

  delete: (id: string) =>
    authApi.delete<SingleResponse<null>>(`/permissions/${id}`),
};

// Services API
export const servicesApi = {
  list: () =>
    authApi.get<PaginatedResponse<Service>>('/services'),

  get: (id: string) =>
    authApi.get<SingleResponse<Service>>(`/services/${id}`),

  create: (data: { name: string; base_url: string; description?: string; is_active?: boolean }) =>
    authApi.post<SingleResponse<Service>>('/services', data),

  update: (id: string, data: { name?: string; base_url?: string; description?: string; is_active?: boolean }) =>
    authApi.put<SingleResponse<Service>>(`/services/${id}`, data),

  delete: (id: string) =>
    authApi.delete<SingleResponse<null>>(`/services/${id}`),

  regenerateToken: (id: string) =>
    authApi.post<SingleResponse<Service>>(`/services/${id}/regenerate-token`),
};
