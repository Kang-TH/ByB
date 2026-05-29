import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setCoursePublic } from '@/features/course/api/courseApi';
import { queryKeys } from '@/shared/api/queryKeys';
import type { CourseDetail } from '@/types/course';

export function useSetCoursePublic(userId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      course,
      isPublic,
    }: {
      course: CourseDetail;
      isPublic: boolean;
    }) => {
      if (userId == null) {
        return Promise.reject(new Error('로그인이 필요합니다.'));
      }
      return setCoursePublic(course, isPublic);
    },
    onSuccess: (_data, { course, isPublic }) => {
      if (userId == null) return;

      queryClient.setQueryData<CourseDetail>(
        queryKeys.course.myDetail(course.courseId, userId),
        (old) => (old ? { ...old, isPublic } : old),
      );

      void queryClient.invalidateQueries({
        queryKey: queryKeys.course.publicList,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.course.myList(userId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.plogging.home,
      });
    },
  });
}
