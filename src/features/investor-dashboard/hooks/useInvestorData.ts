'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investorService } from '../services/investorService';

export function useInvestorStats() {
  return useQuery({
    queryKey: ['investor', 'stats'],
    queryFn: () => investorService.getStats(),
  });
}

export function useInvestorSpaces() {
  return useQuery({
    queryKey: ['investor', 'spaces'],
    queryFn: () => investorService.getSpaces(),
  });
}

export function useInvestorBookings() {
  return useQuery({
    queryKey: ['investor', 'bookings'],
    queryFn: () => investorService.getBookings(),
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      investorService.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investor', 'bookings'] });
      queryClient.invalidateQueries({ queryKey: ['investor', 'stats'] });
    },
  });
}

export function useInvestorRevenue() {
  return useQuery({
    queryKey: ['investor', 'revenue'],
    queryFn: () => investorService.getRevenue(),
  });
}

export function useInvestorContracts() {
  return useQuery({
    queryKey: ['investor', 'contracts'],
    queryFn: () => investorService.getContracts(),
  });
}

export function useInvestorEvents() {
  return useQuery({
    queryKey: ['investor', 'events'],
    queryFn: () => investorService.getEvents(),
  });
}

export function useInvestorSettings() {
  return useQuery({
    queryKey: ['investor', 'settings'],
    queryFn: () => investorService.getSettings(),
  });
}

export function useUpdateInvestorSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: any) => investorService.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investor', 'settings'] });
    },
  });
}
