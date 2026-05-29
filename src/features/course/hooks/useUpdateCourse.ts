import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCourse } from '@/features/course/api/courseApi';
import { queryKeys } from '@/shared/api/queryKeys';
import type { CourseDetail, UpdateCourseRequest } from '@/types/course';

export function useUpdateCourse(userId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      body,
    }: {
      courseId: number;
      body: UpdateCourseRequest;
    }) => {
      if (userId == null) {
        return Promise.reject(new Error('로그인이 필요합니다.'));
      }
      return updateCourse(courseId, body);
    },
    onSuccess: (_data, { courseId, body }) => {
      if (userId == null) return;

      queryClient.setQueryData<CourseDetail>(
        queryKeys.course.myDetail(courseId, userId),
        (old) =>
          old
            ? {
                ...old,
                title: body.title,
                description: body.description,
                areaName: body.areaName ?? old.areaName,
                distance: body.distance,
                estimatedTime: body.estimatedTime,
                routePoints: body.routePoints,
                isPublic: body.isPublic,
              }
            : old,
      );

      void queryClient.invalidateQueries({
        queryKey: queryKeys.course.myList(userId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.course.myDetail(courseId, userId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.course.detail(courseId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.course.publicList,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.plogging.home,
      });
    },
  });
}
