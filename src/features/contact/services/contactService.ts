import { api } from '@/services/api';
import type { ApiResponse, ContactFormData, ContactFormResponse } from '@/shared/types';

export const contactService = {
  /**
   * Submit contact form
   */
  submitContactForm: async (data: ContactFormData): Promise<ContactFormResponse> => {
    const response = await api.post<ApiResponse<ContactFormResponse>>('/contact', data);
    return response.data;
  },
};
