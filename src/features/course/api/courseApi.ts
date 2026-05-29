import { apiClient } from '@/shared/api/client';
import { toCourseDetail, toCourseListItem } from '@/shared/api/mappers';
import type {
  CourseDetail,
  CourseListItem,
  CreateCourseRequest,
  RecommendCategory,
  RoutePoint,
  SearchSort,
  UpdateCourseRequest,
} from '@/types/course';

export async function fetchRecommendCourses(category: RecommendCategory) {
  const { data } = await apiClient.get<{
    category: string;
    courses: Omit<CourseListItem, 'userId'>[];
  }>(`/course/list/recommend/${category}`);
  return {
    category: data.category as RecommendCategory,
    courses: data.courses.map((c) => toCourseListItem(c)),
  };
}

export async function fetchMyCourses(userId: number) {
  const { data } = await apiClient.get<{
    userId: number;
    courses: Omit<CourseListItem, 'userId'>[];
  }>(`/course/list/${userId}`);
  return {
    userId: data.userId,
    courses: data.courses.map((c) => toCourseListItem(c, userId)),
  };
}

export async function fetchFavoriteCourses(userId: number) {
  const { data } = await apiClient.get<{
    userId: number;
    favorites: Omit<CourseListItem, 'userId'>[];
  }>(`/course/list/${userId}/recommend`);
  return {
    userId: data.userId,
    favorites: data.favorites.map((c) => toCourseListItem(c)),
  };
}

export async function fetchCourseDetail(courseId: number): Promise<CourseDetail> {
  const { data } = await apiClient.get<CourseDetail>(`/course/${courseId}`);
  return toCourseDetail(data);
}

export async function fetchMyCourseDetail(
  courseId: number,
  userId: number,
): Promise<CourseDetail> {
  const { data } = await apiClient.get<CourseDetail>(
    `/course/${courseId}/${userId}`,
  );
  return toCourseDetail(data);
}

export async function searchCourses(keyword: string, sort: SearchSort) {
  const { data } = await apiClient.post<{ courses: CourseListItem[] }>(
    '/course/search',
    { keyword, sort },
  );
  return {
    courses: data.courses.map((c) => toCourseListItem(c)),
  };
}

/** 추천 코스 탭 = is_public=true 인 공개 코스 (search API) */
export async function fetchPublicCourses() {
  return searchCourses('', 'POPULAR');
}

export async function createCourse(body: CreateCourseRequest) {
  const { data } = await apiClient.post<{ courseId: number; message: string }>(
    '/course',
    body,
  );
  return data;
}

export async function updateCourse(
  courseId: number,
  body: UpdateCourseRequest,
) {
  const { data } = await apiClient.put<{ courseId: number; message: string }>(
    `/course/${courseId}`,
    body,
  );
  return data;
}

export async function deleteCourse(courseId: number) {
  const { data } = await apiClient.delete<{ courseId: number; message: string }>(
    `/course/${courseId}`,
  );
  return data;
}

function buildUpdateBodyFromCourse(
  course: CourseDetail,
  isPublic: boolean,
): UpdateCourseRequest {
  return {
    title: course.title,
    description: course.description ?? '',
    areaName: course.areaName,
    distance: course.distance,
    estimatedTime: course.estimatedTime ?? 0,
    routePoints: course.routePoints ?? [],
    isPublic,
  };
}

/** 추천 코스 탭 공개 여부 변경 */
export async function setCoursePublic(course: CourseDetail, isPublic: boolean) {
  return updateCourse(course.courseId, buildUpdateBodyFromCourse(course, isPublic));
}

export async function publishCourse(course: CourseDetail) {
  return setCoursePublic(course, true);
}

export async function unpublishCourse(course: CourseDetail) {
  return setCoursePublic(course, false);
}

export async function toggleFavorite(courseId: number, userId: number) {
  const { data } = await apiClient.post<{
    courseId: number;
    isFavorite: boolean;
    message?: string;
  }>(`/course/recommend/${courseId}`, { userId });
  return data;
}

/** 거리순(가까운 순) 정렬용 — 코스 시작 좌표 */
export async function fetchCourseStartPoint(
  courseId: number,
): Promise<RoutePoint | undefined> {
  const detail = await fetchCourseDetail(courseId);
  return detail.routePoints?.[0];
}

export async function fetchCourseStartPoints(
  courseIds: number[],
): Promise<Map<number, RoutePoint>> {
  const map = new Map<number, RoutePoint>();
  await Promise.all(
    courseIds.map(async (courseId) => {
      try {
        const start = await fetchCourseStartPoint(courseId);
        if (start) map.set(courseId, start);
      } catch {
        // skip courses that fail to load
      }
    }),
  );
  return map;
}
