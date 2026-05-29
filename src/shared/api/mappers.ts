import type { CourseDetail, CourseListItem, RoutePoint } from '@/types/course';

type ApiCourseListItem = {
  courseId: number;
  userId?: number;
  user_id?: number;
  title: string;
  areaName?: string | null;
  distance?: number | null;
  estimatedTime?: number;
  rating?: number;
  reviewCount?: number;
  thumbnailUrl?: string;
  isFavorite?: boolean;
};

export function toCourseListItem(
  item: ApiCourseListItem,
  /** 내가 만든 코스 목록처럼 API에 작성자 id가 없을 때만 사용 */
  ownerUserId?: number,
): CourseListItem {
  return {
    courseId: item.courseId,
    userId: item.userId ?? item.user_id ?? ownerUserId,
    title: item.title,
    areaName: item.areaName ?? '',
    distance: item.distance ?? 0,
    estimatedTime: item.estimatedTime,
    rating: item.rating,
    reviewCount: item.reviewCount,
    thumbnailUrl: item.thumbnailUrl,
    isFavorite: item.isFavorite,
  };
}

type CourseDetailApi = ApiCourseListItem & {
  description?: string;
  routePoints?: RoutePoint[];
  isPublic?: boolean;
  is_public?: boolean;
  isRecommended?: boolean;
  is_recommended?: boolean;
  canEdit?: boolean;
  can_edit?: boolean;
  isOwner?: boolean;
  is_owner?: boolean;
  previewReviews?: CourseDetail['previewReviews'];
};

export function toCourseDetail(
  data: CourseDetailApi,
  ownerUserId?: number,
): CourseDetail {
  return {
    ...toCourseListItem(data, ownerUserId),
    description: data.description,
    routePoints: data.routePoints,
    isPublic: data.isPublic ?? data.is_public,
    isRecommended: data.isRecommended ?? data.is_recommended,
    canEdit: data.canEdit ?? data.can_edit,
    isOwner: data.isOwner ?? data.is_owner,
    previewReviews: data.previewReviews,
  };
}
