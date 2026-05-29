import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCourse } from '@/features/course/api/courseApi';
import { queryKeys } from '@/shared/api/queryKeys';

export function useDeleteCourse(userId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: number) => {
      if (userId == null) {
        return Promise.reject(new Error('로그인이 필요합니다.'));
      }
      return deleteCourse(courseId);
    },
    onSuccess: (_data, courseId) => {
      if (userId == null) return;
      void queryClient.invalidateQueries({
        queryKey: queryKeys.course.myList(userId),
      });
      void queryClient.removeQueries({
        queryKey: queryKeys.course.myDetail(courseId, userId),
      });
      void queryClient.removeQueries({
        queryKey: queryKeys.course.detail(courseId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.course.publicList,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.course.favorites(userId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.plogging.home,
      });
    },
  });
}
