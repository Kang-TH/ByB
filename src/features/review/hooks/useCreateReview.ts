import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/app/providers/AuthProvider';
import { patchCourseRatingCaches } from '@/features/course/utils/patchCourseRating';
import { createReview, fetchReviews } from '@/features/review/api/reviewApi';
import { computeReviewStats } from '@/features/review/utils/reviewStats';
import { queryKeys } from '@/shared/api/queryKeys';

export interface CreateReviewInput {
  userId: number;
  nickname: string;
  rating: number;
  content: string;
}

export function useCreateReview(courseId: number) {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: (input: CreateReviewInput) =>
      createReview(courseId, {
        userId: input.userId,
        rating: input.rating,
        content: input.content,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.review.list(courseId),
      });

      try {
        const reviewData = await queryClient.fetchQuery({
          queryKey: queryKeys.review.list(courseId),
          queryFn: () => fetchReviews(courseId),
        });
        const { averageRating, reviewCount } = computeReviewStats(
          reviewData.reviews,
        );
        patchCourseRatingCaches(
          queryClient,
          courseId,
          averageRating,
          reviewCount,
          userId,
        );
      } catch {
        // 목록 패치 실패 시 invalidate만으로 서버 재조회
      }

      void queryClient.invalidateQueries({
        queryKey: queryKeys.course.detail(courseId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.course.publicList,
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.plogging.home });
      if (userId != null) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.course.favorites(userId),
        });
        void queryClient.invalidateQueries({
          queryKey: queryKeys.course.myList(userId),
        });
        void queryClient.invalidateQueries({
          queryKey: queryKeys.course.myDetail(courseId, userId),
        });
      }
    },
  });
}
