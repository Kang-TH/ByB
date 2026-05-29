import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCourse } from '@/features/course/api/courseApi';
import { queryKeys } from '@/shared/api/queryKeys';
import type { CreateCourseRequest } from '@/types/course';

export function useCreateCourse(userId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Omit<CreateCourseRequest, 'userId'>) => {
      if (userId == null) {
        return Promise.reject(new Error('로그인이 필요합니다.'));
      }
      return createCourse({ ...body, userId });
    },
    onSuccess: () => {
      if (userId != null) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.course.myList(userId),
        });
      }
    },
  });
}
