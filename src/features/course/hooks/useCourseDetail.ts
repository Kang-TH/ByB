import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/app/providers/AuthProvider';
import { fetchCourseDetail } from '@/features/course/api/courseApi';
import { queryKeys } from '@/shared/api/queryKeys';
import type { CourseDetail } from '@/types/course';

export function useCourseDetail(courseId: number) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: queryKeys.course.detail(courseId),
    queryFn: () => fetchCourseDetail(courseId),
    enabled: userId != null,
    staleTime: 60_000,
    retry: false,
  });
}

export function getCourseDetailOrPlaceholder(
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
