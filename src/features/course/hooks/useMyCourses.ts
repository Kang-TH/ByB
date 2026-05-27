import { useQuery } from '@tanstack/react-query';
import { fetchMyCourses } from '@/features/course/api/courseApi';
import { queryKeys } from '@/shared/api/queryKeys';
import type { CourseListItem } from '@/types/course';

export function useMyCourses(userId: number | null) {
  return useQuery({
    queryKey: queryKeys.course.myList(userId ?? 0),
    queryFn: async () => {
      const res = await fetchMyCourses(userId!);
      return res.courses;
    },
    enabled: userId != null,
    staleTime: 60_000,
    retry: false,
  });
}

export function getMyCoursesList(
  data: CourseListItem[] | undefined,
): CourseListItem[] {
  return data ?? [];
}
