import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/app/providers/AuthProvider';
import { favoriteQueryKey } from '@/features/favorite/hooks/favoriteQueryKey';
import { fetchFavoriteCourses } from '@/features/course/api/courseApi';
import { queryKeys } from '@/shared/api/queryKeys';
import type { CourseListItem } from '@/types/course';
import { EMPTY_COURSE_LIST } from '@/shared/constants/empty';

export function useFavoriteCourses(): CourseListItem[] {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: queryKeys.course.favorites(userId ?? 0),
    queryFn: async () => {
      const res = await fetchFavoriteCourses(userId!);
      return res.favorites;
    },
    enabled: userId != null,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (userId == null || !data) return;
    for (const course of data) {
      queryClient.setQueryData(favoriteQueryKey(userId, course.courseId), true);
    }
  }, [data, userId, queryClient]);

  return data ?? EMPTY_COURSE_LIST;
}
