import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/app/providers/AuthProvider';
import { dbIsFavorite } from '@/shared/mockDb';

export function useFavorite(courseId: number, initial?: boolean) {
  const { userId } = useAuth();

  const query = useQuery({
    queryKey: ['favorite', userId, courseId] as const,
    // TODO(api): There is no dedicated "isFavorite" endpoint in spec.
    // When wiring real API, prefer deriving isFavorite from:
    // - recommend list item.isFavorite
    // - course detail isFavorite
    // and avoid a separate per-course query.
    queryFn: () => dbIsFavorite(userId!, courseId),
    enabled: userId != null,
    initialData: initial,
    staleTime: 0,
  });

  return { isFavorite: query.data ?? initial ?? false };
}
