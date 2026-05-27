import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/app/providers/AuthProvider';
import { fetchHome } from '@/features/home/api/homeApi';
import { queryKeys } from '@/shared/api/queryKeys';
import type { HomeResponse } from '@/types/plogging';

export function useHome() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: queryKeys.plogging.home,
    queryFn: () => fetchHome(userId!),
    enabled: userId != null,
    staleTime: 60_000,
    retry: false,
  });
}

export function getHomeData(data: HomeResponse | undefined): HomeResponse | undefined {
  return data;
}
