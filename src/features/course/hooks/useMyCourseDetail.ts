import { useQuery } from '@tanstack/react-query';
import { fetchMyCourseDetail } from '@/features/course/api/courseApi';
import { queryKeys } from '@/shared/api/queryKeys';
import type { CourseDetail } from '@/types/course';

export function useMyCourseDetail(courseId: number, userId: number | null) {
  return useQuery({
    queryKey: queryKeys.course.myDetail(courseId, userId ?? 0),
    queryFn: () => fetchMyCourseDetail(courseId, userId!),
    enabled: userId != null,
    staleTime: 60_000,
    retry: false,
  });
}

export function getMyCourseDetail(
  data: CourseDetail | undefined,
  courseId: number,
): CourseDetail {
  return (
    data ?? {
      courseId,
      userId: 0,
      title: `코스 #${courseId}`,
      areaName: '서울',
      distance: 0,
      isFavorite: false,
    }
  );
}
