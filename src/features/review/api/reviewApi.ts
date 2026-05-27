// TODO(api): Replace mockDb reads/writes with real API calls.
// Spec:
// - GET /api/v1/course/list/review/{courseId}
// - GET /api/v1/course/review/{courseId}
// - POST /api/v1/course/review/{courseId}
// - PUT /api/v1/course/review/{reviewId}
// - DELETE /api/v1/course/review/{reviewId}
// import { apiClient } from '@/shared/api/client';
import {
  dbFindCourse,
  dbFindUser,
  dbInsertReview,
  MOCK_DB,
} from '@/shared/mockDb';
import type { CreateReviewRequest, ReviewListResponse } from '@/types/review';

export async function fetchReviews(courseId: number): Promise<ReviewListResponse> {
  // const { data } = await apiClient.get<ReviewListResponse>(
  //   `/course/list/review/${courseId}`,
  // );
  // return data;

  const course = dbFindCourse(courseId);
  const reviews = MOCK_DB.reviews
    .filter((r) => r.course_id === courseId)
    .map((r) => {
      const user = dbFindUser(r.user_id);
      return {
        reviewId: r.id,
        userId: r.user_id,
        nickname: user?.nickname ?? `user#${r.user_id}`,
        rating: r.rating,
        content: r.content,
        createdAt: r.created_at.slice(0, 10),
      };
    });

  const avg =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return {
    courseId,
    courseName: course?.title ?? `코스 #${courseId}`,
    averageRating: avg,
    reviewCount: reviews.length,
    reviews,
  };
}

export async function fetchReviewWriteForm(courseId: number) {
  // const { data } = await apiClient.get(`/course/review/${courseId}`);
  // return data;

  const course = dbFindCourse(courseId);
  return {
    courseId,
    courseName: course?.title ?? `코스 #${courseId}`,
    thumbnailUrl: course?.thumbnail_url,
  };
}

export async function createReview(courseId: number, body: CreateReviewRequest) {
  // const { data } = await apiClient.post(`/course/review/${courseId}`, body);
  // return data;

  const inserted = dbInsertReview({
    course_id: courseId,
    user_id: body.userId,
    rating: body.rating,
    content: body.content,
    created_at: new Date().toISOString(),
  });

  return {
    reviewId: inserted.id,
    courseId,
    message: '후기가 저장되었습니다.',
  };
}
