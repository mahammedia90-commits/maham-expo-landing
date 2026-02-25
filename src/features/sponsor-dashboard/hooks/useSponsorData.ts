'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sponsorService } from '../services/sponsorService';

export function useSponsorStats() {
  return useQuery({
    queryKey: ['sponsor', 'stats'],
    queryFn: () => sponsorService.getStats(),
  });
}

export function useSponsorPackages() {
  return useQuery({
    queryKey: ['sponsor', 'packages'],
    queryFn: () => sponsorService.getPackages(),
  });
}

export function useSponsorContracts() {
  return useQuery({
    queryKey: ['sponsor', 'contracts'],
    queryFn: () => sponsorService.getContracts(),
  });
}

export function useSponsorPayments() {
  return useQuery({
    queryKey: ['sponsor', 'payments'],
    queryFn: () => sponsorService.getPayments(),
  });
}

export function useSponsorPaymentSummary() {
  return useQuery({
    queryKey: ['sponsor', 'paymentSummary'],
    queryFn: () => sponsorService.getPaymentSummary(),
  });
}

export function useSponsorExposure() {
  return useQuery({
    queryKey: ['sponsor', 'exposure'],
    queryFn: () => sponsorService.getExposure(),
  });
}

export function useSponsorROI() {
  return useQuery({
    queryKey: ['sponsor', 'roi'],
    queryFn: () => sponsorService.getROIReports(),
  });
}

export function useSponsorEvents() {
  return useQuery({
    queryKey: ['sponsor', 'events'],
    queryFn: () => sponsorService.getEvents(),
  });
}

export function useSponsorDocuments() {
  return useQuery({
    queryKey: ['sponsor', 'documents'],
    queryFn: () => sponsorService.getDocuments(),
  });
}

export function useSponsorUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => sponsorService.uploadDocument(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor', 'documents'] });
    },
  });
}
