import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

// In development, use Next.js rewrite proxy to avoid CORS (server sends duplicate headers)
// In production, set NEXT_PUBLIC_AUTH_API_URL to the direct URL if CORS is fixed
const AUTH_API_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_API_URL || '/auth-api';

const authApiClient: AxiosInstance = axios.create({
  baseURL: AUTH_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Endpoints that should not trigger a token refresh on 401
const AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

// Token refresh queue state
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((pending) => {
    if (error) {
      pending.reject(error);
    } else {
      pending.resolve(token!);
    }
  });
  failedQueue = [];
}

// Request interceptor
authApiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const languageStorage = localStorage.getItem('language-storage');
      if (languageStorage) {
        try {
          const { state } = JSON.parse(languageStorage);
          config.headers['Accept-Language'] = state.language || 'ar';
        } catch {
          config.headers['Accept-Language'] = 'ar';
        }
      } else {
        config.headers['Accept-Language'] = 'ar';
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with automatic token refresh
authApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const url = originalRequest.url || '';

      // Don't attempt refresh for auth endpoints
      if (AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint))) {
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return authApiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        axios
          .post(`${AUTH_API_BASE_URL}/auth/refresh`, null, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
              'Content-Type': 'application/json',
            },
          })
          .then((response) => {
            const newToken: string = response.data?.data?.token;
            if (!newToken) {
              throw new Error('No token in refresh response');
            }

            localStorage.setItem('auth_token', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            processQueue(null, newToken);
            resolve(authApiClient(originalRequest));
          })
          .catch((refreshError) => {
            processQueue(refreshError, null);

            if (typeof window !== 'undefined') {
              localStorage.removeItem('auth_token');
            }

            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    authApiClient.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    authApiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    authApiClient.put<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    authApiClient.delete<T>(url, config).then((res) => res.data),
};

export default authApiClient;
