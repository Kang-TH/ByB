// TODO(api): Replace mockDb reads/writes with real API calls.
// Spec:
// - GET /api/v1/course/list/recommend/{courseCategory}
// - GET /api/v1/course/list/{userId}
// - GET /api/v1/course/list/{userId}/recommend
// - GET /api/v1/course/{courseId}
// - GET /api/v1/course/{courseId}/{userId}
// - POST /api/v1/course
// - POST /api/v1/course/search
// Note: Spec list items don't include userId; current UI types require it.
// Align DTOs when switching to server (either make userId optional on client or add field server-side).
// import { apiClient } from '@/shared/api/client';
import {
  dbFindCourse,
  dbGetFavoriteCourses,
  dbGetMyCourses,
  dbGetPublicCourses,
  dbInsertCourse,
  dbToCourseDetail,
  dbToCourseListItem,
  dbToggleFavorite,
  MOCK_DB,
} from '@/shared/mockDb';
import type {
  CourseDetail,
  CourseListItem,
  CreateCourseRequest,
  RecommendCategory,
  RoutePoint,
  SearchSort,
} from '@/types/course';

export async function fetchRecommendCourses(
  category: RecommendCategory,
  viewerUserId: number,
) {
  // const { data } = await apiClient.get<{ category: string; courses: CourseListItem[] }>(
  //   `/course/list/recommend/${category}`,
  // );
  // return data;

  let courses = dbGetPublicCourses(viewerUserId);

  if (category === 'like') {
    courses = courses.filter((c) => c.isFavorite);
  }
  if (category === 'distance') {
    // NOTE: Spec "distance" category likely means server-defined distance-based ranking.
    // Our UI later redefines "distance" as proximity to user location (see RecommendListScreen).
    courses = [...courses].sort((a, b) => a.distance - b.distance);
  }

  return { category, courses };
}

export async function fetchMyCourses(userId: number) {
  // const { data } = await apiClient.get<{ userId: number; courses: CourseListItem[] }>(
  //   `/course/list/${userId}`,
  // );
  // return data;

  return { userId, courses: dbGetMyCourses(userId) };
}

export async function fetchFavoriteCourses(userId: number) {
  // const { data } = await apiClient.get<{
  //   userId: number;
  //   favorites: CourseListItem[];
  // }>(`/course/list/${userId}/recommend`);
  // return data;

  return { userId, favorites: dbGetFavoriteCourses(userId) };
}

export async function fetchCourseDetail(
  courseId: number,
  viewerUserId: number,
): Promise<CourseDetail> {
  // const { data } = await apiClient.get<CourseDetail>(`/course/${courseId}`);
  // return data;

  const course = dbFindCourse(courseId);
  if (!course) {
    return dbToCourseDetail(
      {
        id: courseId,
        user_id: 0,
        title: `코스 #${courseId}`,
        description: '',
        area_name: '서울',
        distance: 0,
        estimated_time: 0,
        route_points: [],
        is_public: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      viewerUserId,
    );
  }
  return dbToCourseDetail(course, viewerUserId);
}

export async function fetchMyCourseDetail(
  courseId: number,
  userId: number,
): Promise<CourseDetail> {
  // const { data } = await apiClient.get<CourseDetail>(
  //   `/course/${courseId}/${userId}`,
  // );
  // return data;

  return fetchCourseDetail(courseId, userId);
}

export async function searchCourses(
  keyword: string,
  sort: SearchSort,
  viewerUserId: number,
) {
  // const { data } = await apiClient.post<{ courses: CourseListItem[] }>(
  //   '/course/search',
  //   { keyword, sort },
  // );
  // return data;

  const q = keyword.trim().toLowerCase();
  let courses = dbGetPublicCourses(viewerUserId).filter((c) =>
    q ? `${c.title} ${c.areaName}`.toLowerCase().includes(q) : true,
  );

  if (sort === 'RATING') {
    courses = [...courses].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  } else if (sort === 'DISTANCE') {
    courses = [...courses].sort((a, b) => a.distance - b.distance);
  }

  return { courses };
}

export async function createCourse(body: CreateCourseRequest) {
  // const { data } = await apiClient.post('/course', body);
  // return data;

  const row = dbInsertCourse(body);
  return {
    courseId: row.id,
    message: '코스가 등록되었습니다.',
  };
}

export async function toggleFavorite(courseId: number, userId: number) {
  // const { data } = await apiClient.post(`/course/recommend/${courseId}`, {
  //   userId,
  // });
  // return data;

  const { isFavorite } = dbToggleFavorite(userId, courseId);
  return {
    courseId,
    isFavorite,
    message: isFavorite ? '즐겨찾기에 추가했습니다.' : '즐겨찾기를 해제했습니다.',
  };
}

/** 코스 캐시 시드용 — mockDb 전체 코스 목록 */
export function fetchAllCoursesForCache(viewerUserId: number): CourseListItem[] {
  return MOCK_DB.courses.map((c) => dbToCourseListItem(c, viewerUserId));
}

/** 거리순(가까운 순) 정렬용 — 코스 시작 좌표 */
export function getCourseStartPoint(courseId: number): RoutePoint | undefined {
  // TODO(api): Spec recommend list doesn't include routePoints/start coords.
  // Options when wiring real API:
  // 1) Add startLat/startLng (or routePoints) to list DTO
  // 2) Call GET /course/{courseId} per item (costly)
  // 3) Provide dedicated "nearby list" API with coords
  const course = dbFindCourse(courseId);
  return course?.route_points[0];
}
