'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { merchantService } from '../services/merchantService';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['merchant', 'stats'],
    queryFn: () => merchantService.getStats(),
  });
}

export function useBooths() {
  return useQuery({
    queryKey: ['merchant', 'booths'],
    queryFn: () => merchantService.getBooths(),
  });
}

export function usePayments() {
  return useQuery({
    queryKey: ['merchant', 'payments'],
    queryFn: () => merchantService.getPayments(),
  });
}

export function usePaymentSummary() {
  return useQuery({
    queryKey: ['merchant', 'paymentSummary'],
    queryFn: () => merchantService.getPaymentSummary(),
  });
}

export function useDocuments() {
  return useQuery({
    queryKey: ['merchant', 'documents'],
    queryFn: () => merchantService.getDocuments(),
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => merchantService.uploadDocument(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant', 'documents'] });
    },
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ['merchant', 'events'],
    queryFn: () => merchantService.getEvents(),
  });
}
