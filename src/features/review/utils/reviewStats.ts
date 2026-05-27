import type { RatingCounts, Review } from '@/types/review';

function normalizeStar(rating: number): number {
  // 별점은 1~5 범위를 벗어나면 보정합니다.
  return Math.min(5, Math.max(1, Math.round(rating)));
}

export function computeRatingCounts(reviews: Review[]): RatingCounts {
  const counts: RatingCounts = [0, 0, 0, 0, 0];

  // index 0~4 = 별 5점~1점
  for (const review of reviews) {
    const star = normalizeStar(review.rating);
    counts[5 - star] += 1;
  }

  return counts;
}

export function computeAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.length;
}

export function computeReviewStats(reviews: Review[]) {
  return {
    averageRating: computeAverageRating(reviews),
    reviewCount: reviews.length,
    ratingCounts: computeRatingCounts(reviews),
  };
}

