import { useQuery, useMutation } from '@tanstack/react-query';
import { homeService } from '../services/homeService';

// Query keys for home feature
export const homeKeys = {
  all: ['home'] as const,
  stats: () => [...homeKeys.all, 'stats'] as const,
};

/**
 * Hook to fetch app statistics
 */
export function useAppStats() {
  return useQuery({
    queryKey: homeKeys.stats(),
    queryFn: homeService.getStats,
    // Keep data fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Placeholder data while loading
    placeholderData: {
      activeEvents: 500,
      availableSpaces: 2000,
      totalUsers: 10000,
    },
  });
}

/**
 * Hook to subscribe to newsletter
 */
export function useNewsletterSubscription() {
  return useMutation({
    mutationFn: (email: string) => homeService.subscribeNewsletter(email),
  });
}
