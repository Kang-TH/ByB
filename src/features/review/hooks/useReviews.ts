import { useQuery } from '@tanstack/react-query';
import { fetchReviews } from '@/features/review/api/reviewApi';
import { queryKeys } from '@/shared/api/queryKeys';
import type { Review, ReviewListResponse } from '@/types/review';

export function useReviews(courseId: number) {
  const query = useQuery({
    queryKey: queryKeys.review.list(courseId),
    queryFn: () => fetchReviews(courseId),
    staleTime: 60_000,
    retry: false,
  });

  return {
    ...query,
    reviews: query.data?.reviews ?? [],
  };
}

export function getReviewListData(
  reviews: Review[],
  courseId: number,
  courseName: string,
): ReviewListResponse {
  return {
    courseId,
    courseName,
    reviews,
  };
}
