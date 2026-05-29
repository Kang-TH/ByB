import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/app/providers/AuthProvider';
import { favoriteQueryKey } from '@/features/favorite/hooks/favoriteQueryKey';

/** 목록/상세의 isFavorite + 토글 후 캐시를 반영 */
export function useFavorite(courseId: number, initial?: boolean) {
  const { userId } = useAuth();

  const { data: isFavorite = initial ?? false } = useQuery({
    queryKey: favoriteQueryKey(userId ?? 0, courseId),
    queryFn: () => initial ?? false,
    initialData: initial,
    enabled: userId != null,
    staleTime: Number.POSITIVE_INFINITY,
  });

  return { isFavorite };
}
