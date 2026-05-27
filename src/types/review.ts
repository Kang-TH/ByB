export interface Review {
  reviewId: number;
  userId: number;
  nickname: string;
  rating: number;
  content: string;
  createdAt: string;
}

/** 인덱스 0~4 = 별 5점~1점 후기 개수 */
export type RatingCounts = [number, number, number, number, number];

export interface ReviewListResponse {
  courseId: number;
  courseName: string;
  /** API 응답용 (UI는 reviews 배열에서 직접 계산) */
  averageRating?: number;
  reviewCount?: number;
  ratingCounts?: RatingCounts;
  reviews: Review[];
}

export interface CreateReviewRequest {
  userId: number;
  rating: number;
  content: string;
}
