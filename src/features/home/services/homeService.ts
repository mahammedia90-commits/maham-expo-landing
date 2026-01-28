import { api } from '@/services/api';
import type { ApiResponse, AppStats } from '@/shared/types';

// Home page API service

export const homeService = {
  /**
   * Get app statistics (active events, available spaces, total users)
   */
  getStats: async (): Promise<AppStats> => {
    const response = await api.get<ApiResponse<AppStats>>('/stats');
    return response.data;
  },

  /**
   * Subscribe to newsletter
   */
  subscribeNewsletter: async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<ApiResponse<{ message: string }>>('/newsletter/subscribe', {
      email,
    });
    return { success: response.success, message: response.data.message };
  },
};
