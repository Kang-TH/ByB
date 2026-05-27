import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '@/features/profile/api/profileApi';
import { queryKeys } from '@/shared/api/queryKeys';
import type { ProfileResponse } from '@/types/profile';

export function useProfile(userId: number | null) {
  return useQuery({
    queryKey: queryKeys.profile.detail(userId ?? 0),
    queryFn: () => fetchProfile(userId!),
    enabled: userId != null,
    staleTime: 60_000,
    retry: false,
  });
}

export function getProfileData(
  data: ProfileResponse | undefined,
): ProfileResponse | undefined {
  return data;
}
