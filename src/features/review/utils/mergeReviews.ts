import type { Review } from '@/types/review';

/** 로컬 작성 후기를 앞에 두고, reviewId 기준 중복 제거 후 최신순 정렬 */
export function mergeReviewLists(base: Review[], local: Review[]): Review[] {
  const seen = new Set<number>();
  const merged: Review[] = [];

  for (const review of [...local, ...base]) {
    if (seen.has(review.reviewId)) continue;
    seen.add(review.reviewId);
    merged.push(review);
  }

  return merged.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
