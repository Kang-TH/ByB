import type { QueryClient } from '@tanstack/react-query';
import { useCourseCacheStore } from '@/features/course/store/courseCacheStore';
import { queryKeys } from '@/shared/api/queryKeys';
import type { CourseDetail, CourseListItem } from '@/types/course';
import type { HomeResponse } from '@/types/plogging';

export function patchCourseRatingCaches(
  queryClient: QueryClient,
  courseId: number,
  rating: number,
  reviewCount: number,
  userId: number | null,
) {
  const displayRating = reviewCount > 0 ? rating : undefined;

  queryClient.setQueryData<CourseListItem[]>(
    queryKeys.course.publicList,
    (old) =>
      old?.map((c) =>
        c.courseId === courseId
          ? { ...c, rating: displayRating, reviewCount }
          : c,
      ),
  );

  if (userId != null) {
    queryClient.setQueryData<CourseListItem[]>(
      queryKeys.course.favorites(userId),
      (old) =>
        old?.map((c) =>
          c.courseId === courseId
            ? { ...c, rating: displayRating, reviewCount }
            : c,
        ),
    );

    queryClient.setQueryData<CourseListItem[]>(
      queryKeys.course.myList(userId),
      (old) =>
        old?.map((c) =>
          c.courseId === courseId
            ? { ...c, rating: displayRating, reviewCount }
            : c,
        ),
    );

    queryClient.setQueryData<CourseDetail>(
      queryKeys.course.myDetail(courseId, userId),
      (old) =>
        old
          ? { ...old, rating: displayRating, reviewCount }
          : old,
    );
  }

  queryClient.setQueryData<CourseDetail>(
    queryKeys.course.detail(courseId),
    (old) =>
      old ? { ...old, rating: displayRating, reviewCount } : old,
  );

  queryClient.setQueryData<HomeResponse>(queryKeys.plogging.home, (old) =>
    old
      ? {
          ...old,
          recommendedCourses: old.recommendedCourses.map((c) =>
            c.courseId === courseId
              ? { ...c, rating: displayRating, reviewCount }
              : c,
          ),
        }
      : old,
  );

  const cached = useCourseCacheStore.getState().getCourse(courseId);
  if (cached) {
    useCourseCacheStore.getState().upsertCourse({
      ...cached,
      rating: displayRating,
      reviewCount,
    });
  }
}
