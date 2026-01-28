import { useMutation } from '@tanstack/react-query';
import { contactService } from '../services/contactService';
import type { ContactFormData } from '@/shared/types';

/**
 * Hook to submit contact form
 */
export function useContactForm() {
  return useMutation({
    mutationFn: (data: ContactFormData) => contactService.submitContactForm(data),
  });
}
