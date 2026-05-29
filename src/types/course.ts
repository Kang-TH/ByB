export type RecommendCategory = 'common' | 'like' | 'distance';
export type SearchSort = 'POPULAR' | 'RATING' | 'DISTANCE';

export interface RoutePoint {
  lat: number;
  lng: number;
}

export interface CourseListItem {
  courseId: number;
  userId?: number;
  title: string;
  areaName: string;
  distance: number;
  estimatedTime?: number;
  rating?: number;
  reviewCount?: number;
  thumbnailUrl?: string;
  isFavorite?: boolean;
}

export interface CourseDetail extends CourseListItem {
  description?: string;
  routePoints?: RoutePoint[];
  isPublic?: boolean;
  isRecommended?: boolean;
  /** 내 코스 상세 API — 수정/삭제/공개 버튼 표시 여부 */
  canEdit?: boolean;
  isOwner?: boolean;
  /** 상세 화면 미리보기용 — 최신 후기 1건만 */
  previewReviews?: PreviewReview[];
}

export interface UpdateCourseRequest {
  title: string;
  description?: string;
  areaName?: string;
  distance: number;
  estimatedTime: number;
  routePoints: RoutePoint[];
  isPublic: boolean;
}

export interface PreviewReview {
  reviewId: number;
  nickname: string;
  rating: number;
  content: string;
}

export interface CreateCourseRequest {
  userId: number;
  title: string;
  description: string;
  areaName: string;
  distance: number;
  estimatedTime: number;
  routePoints: RoutePoint[];
  isPublic: boolean;
}
