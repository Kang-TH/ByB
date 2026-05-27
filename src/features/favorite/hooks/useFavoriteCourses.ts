import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/app/providers/AuthProvider';
import { fetchFavoriteCourses } from '@/features/course/api/courseApi';
import { queryKeys } from '@/shared/api/queryKeys';
import type { CourseListItem } from '@/types/course';

export function useFavoriteCourses(): CourseListItem[] {
  const { userId } = useAuth();

  const { data } = useQuery({
    queryKey: queryKeys.course.favorites(userId ?? 0),
    queryFn: async () => {
      const res = await fetchFavoriteCourses(userId!);
      return res.favorites;
    },
    enabled: userId != null,
    staleTime: 0,
  });

  return data ?? [];
}
