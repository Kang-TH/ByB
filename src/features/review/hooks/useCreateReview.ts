import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReview } from '@/features/review/api/reviewApi';
import { queryKeys } from '@/shared/api/queryKeys';

export interface CreateReviewInput {
  userId: number;
  nickname: string;
  rating: number;
  content: string;
}

export function useCreateReview(courseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReviewInput) =>
      createReview(courseId, {
        userId: input.userId,
        rating: input.rating,
        content: input.content,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.review.list(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.course.detail(courseId),
      });
    },
  });
}
