import { apiClient } from '@/shared/api/client';
import type { CreateReviewRequest, ReviewListResponse } from '@/types/review';

export async function fetchReviews(courseId: number): Promise<ReviewListResponse> {
  const { data } = await apiClient.get<ReviewListResponse>(
    `/course/list/review/${courseId}`,
  );
  return data;
}

export async function fetchReviewWriteForm(courseId: number) {
  const { data } = await apiClient.get<{
    courseId: number;
    courseName: string;
    thumbnailUrl?: string;
  }>(`/course/review/${courseId}`);
  return data;
}

export async function createReview(courseId: number, body: CreateReviewRequest) {
  const { data } = await apiClient.post<{
    reviewId: number;
    courseId: number;
    message: string;
  }>(`/course/review/${courseId}`, body);
  return data;
}
