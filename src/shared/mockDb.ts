/**
 * 임시 데이터용 (DB 테이블과 1:1로 맞춘 in-memory DB)
 * - 앱의 모든 시드/임시 데이터는 이 파일에만 둡니다.
 * - API 모듈은 이 DB를 읽고·갱신합니다 (실제 HTTP는 각 api 파일에서 주석 처리).
 */

import type { LoginResponse } from '@/types/auth';
import type { CourseDetail, CourseListItem, CreateCourseRequest } from '@/types/course';

export type DbUserRow = {
  id: number;
  kakao_id: string;
  nickname: string;
  email?: string;
  profile_image_url?: string;
  total_distance: number;
  total_plogging_count: number;
  total_trash_amount: number;
  created_at: string;
};

export type DbCourseRow = {
  id: number;
  user_id: number;
  title: string;
  description: string;
  area_name: string;
  distance: number;
  estimated_time: number;
  route_points: { lat: number; lng: number }[];
  thumbnail_url?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type DbFavoriteRow = {
  id: number;
  user_id: number;
  course_id: number;
};

export type DbReviewRow = {
  id: number;
  course_id: number;
  user_id: number;
  rating: number;
  content: string;
  created_at: string;
};

export type DbPloggingSessionRow = {
  id: number;
  user_id: number;
  course_id?: number;
  mode: 'FREE' | 'COURSE';
  status: 'IN_PROGRESS' | 'COMPLETED';
  started_at: string;
  ended_at?: string;
  distance?: number;
  duration_seconds?: number;
  trash_bag_type?: 'STANDARD' | 'NORMAL';
  trash_amount_value?: string;
  trash_amount_unit?: 'L' | '%';
  created_at: string;
};

export type MockDb = {
  users: DbUserRow[];
  courses: DbCourseRow[];
  favorites: DbFavoriteRow[];
  reviews: DbReviewRow[];
  plogging_sessions: DbPloggingSessionRow[];
};

function iso(d: Date) {
  return d.toISOString();
}

function day(yyyy: number, mm: number, dd: number) {
  return iso(new Date(Date.UTC(yyyy, mm - 1, dd, 0, 0, 0)));
}

function buildInitialMockDb(): MockDb {
  return {
    users: [
      {
        id: 1,
        kakao_id: '123456789',
        nickname: '초록러너',
        email: 'user@email.com',
        profile_image_url: 'https://example.com/profile.png',
        total_distance: 12.5,
        total_plogging_count: 5,
        total_trash_amount: 20,
        created_at: iso(new Date()),
      },
      {
        id: 2,
        kakao_id: '200000002',
        nickname: '한강러',
        total_distance: 0,
        total_plogging_count: 0,
        total_trash_amount: 0,
        created_at: iso(new Date()),
      },
      {
        id: 3,
        kakao_id: '300000003',
        nickname: '공원러',
        total_distance: 0,
        total_plogging_count: 0,
        total_trash_amount: 0,
        created_at: iso(new Date()),
      },
      {
        id: 7,
        kakao_id: '700000007',
        nickname: '지구사랑',
        total_distance: 0,
        total_plogging_count: 0,
        total_trash_amount: 0,
        created_at: iso(new Date()),
      },
      {
        id: 8,
        kakao_id: '800000008',
        nickname: '초록발걸음',
        total_distance: 0,
        total_plogging_count: 0,
        total_trash_amount: 0,
        created_at: iso(new Date()),
      },
      {
        id: 9,
        kakao_id: '900000009',
        nickname: '플로거',
        total_distance: 0,
        total_plogging_count: 0,
        total_trash_amount: 0,
        created_at: iso(new Date()),
      },
      {
        id: 10,
        kakao_id: '100000010',
        nickname: '산책러',
        total_distance: 0,
        total_plogging_count: 0,
        total_trash_amount: 0,
        created_at: iso(new Date()),
      },
      {
        id: 11,
        kakao_id: '110000011',
        nickname: '맑은하늘',
        total_distance: 0,
        total_plogging_count: 0,
        total_trash_amount: 0,
        created_at: iso(new Date()),
      },
      {
        id: 12,
        kakao_id: '120000012',
        nickname: '러너K',
        total_distance: 0,
        total_plogging_count: 0,
        total_trash_amount: 0,
        created_at: iso(new Date()),
      },
      {
        id: 4,
        kakao_id: '400000004',
        nickname: '트레일러',
        total_distance: 0,
        total_plogging_count: 0,
        total_trash_amount: 0,
        created_at: iso(new Date()),
      },
    ],
    courses: [
      {
        id: 1,
        user_id: 2,
        title: '잠실 석촌호수 둘레길',
        description: '호수 주변을 도는 코스입니다.\n넓은 길과 휴식 포인트가 많습니다.',
        area_name: '서울 송파구',
        distance: 3.2,
        estimated_time: 40,
        route_points: [
          { lat: 37.511, lng: 127.098 },
          { lat: 37.512, lng: 127.099 },
        ],
        thumbnail_url: 'https://example.com/course-1.png',
        is_public: true,
        created_at: day(2026, 5, 1),
        updated_at: day(2026, 5, 1),
      },
      {
        id: 2,
        user_id: 2,
        title: '한강 산책 코스',
        description:
          '강변을 따라 걷기 좋은 코스입니다.\n평탄한 구간이 많아 초보자도 추천해요.',
        area_name: '서울 영등포구',
        distance: 4.1,
        estimated_time: 50,
        route_points: [
          { lat: 37.526, lng: 126.932 },
          { lat: 37.527, lng: 126.934 },
        ],
        thumbnail_url: 'https://example.com/course-2.png',
        is_public: true,
        created_at: day(2026, 5, 1),
        updated_at: day(2026, 5, 1),
      },
      {
        id: 3,
        user_id: 3,
        title: '올림픽공원 플로깅 코스',
        description: '올림픽공원 전역을 도는 플로깅 코스입니다.\n넓은 길과 휴식 포인트가 많습니다.',
        area_name: '서울 송파구',
        distance: 5.0,
        estimated_time: 60,
        route_points: [{ lat: 37.52, lng: 127.12 }],
        thumbnail_url: 'https://example.com/course-3.png',
        is_public: true,
        created_at: day(2026, 5, 2),
        updated_at: day(2026, 5, 2),
      },
      {
        id: 4,
        user_id: 4,
        title: '북한산 입구 트레킹',
        description: '숲길과 계곡이 어우러진 장거리 코스입니다.\n체력이 필요합니다.',
        area_name: '경기 고양시',
        distance: 7.5,
        estimated_time: 120,
        route_points: [{ lat: 37.66, lng: 126.99 }],
        thumbnail_url: 'https://example.com/course-4.png',
        is_public: true,
        created_at: day(2026, 5, 10),
        updated_at: day(2026, 5, 10),
      },
      {
        id: 5,
        user_id: 2,
        title: '잠원 한강공원 산책',
        description: '짧고 평탄한 한강 코스입니다.\n가벼운 플로깅에 적합합니다.',
        area_name: '서울 서초구',
        distance: 1.8,
        estimated_time: 25,
        route_points: [{ lat: 37.52, lng: 127.01 }],
        thumbnail_url: 'https://example.com/course-5.png',
        is_public: true,
        created_at: day(2026, 5, 9),
        updated_at: day(2026, 5, 9),
      },
      {
        id: 6,
        user_id: 3,
        title: '여의도 한바퀴',
        description: '여의도 전역을 도는 인기 러닝·플로깅 코스입니다.',
        area_name: '서울 영등포구',
        distance: 6.2,
        estimated_time: 75,
        route_points: [{ lat: 37.53, lng: 126.92 }],
        thumbnail_url: 'https://example.com/course-6.png',
        is_public: true,
        created_at: day(2026, 5, 8),
        updated_at: day(2026, 5, 8),
      },
      {
        id: 7,
        user_id: 2,
        title: '망원 한강공원 코스',
        description: '망원 한강공원에서 시작하는 짧은 코스입니다.',
        area_name: '서울 마포구',
        distance: 2.1,
        estimated_time: 28,
        route_points: [{ lat: 37.55, lng: 126.89 }],
        thumbnail_url: 'https://example.com/course-7.png',
        is_public: true,
        created_at: day(2026, 5, 7),
        updated_at: day(2026, 5, 7),
      },
      {
        id: 8,
        user_id: 3,
        title: '성수동 카페거리 플로깅',
        description: '성수동 일대를 도는 도심 플로깅 코스입니다.',
        area_name: '서울 성동구',
        distance: 3.8,
        estimated_time: 45,
        route_points: [{ lat: 37.54, lng: 127.05 }],
        thumbnail_url: 'https://example.com/course-8.png',
        is_public: true,
        created_at: day(2026, 5, 6),
        updated_at: day(2026, 5, 6),
      },
      {
        id: 9,
        user_id: 4,
        title: '월드컵공원 둘레길',
        description: '넓은 잔디밭과 산책로가 있는 공원 코스입니다.',
        area_name: '서울 마포구',
        distance: 4.5,
        estimated_time: 55,
        route_points: [{ lat: 37.57, lng: 126.89 }],
        thumbnail_url: 'https://example.com/course-9.png',
        is_public: true,
        created_at: day(2026, 5, 5),
        updated_at: day(2026, 5, 5),
      },
      {
        id: 10,
        user_id: 2,
        title: '탄천 산책로',
        description: '탄천을 따라 걷는 무난한 코스입니다.',
        area_name: '경기 성남시',
        distance: 2.9,
        estimated_time: 35,
        route_points: [{ lat: 37.4, lng: 127.12 }],
        thumbnail_url: 'https://example.com/course-10.png',
        is_public: true,
        created_at: day(2026, 5, 4),
        updated_at: day(2026, 5, 4),
      },
      {
        id: 101,
        user_id: 1,
        title: '우리 동네 공원 코스',
        description: '동네 공원을 한 바퀴 도는 짧은 코스입니다.',
        area_name: '서울 강동구',
        distance: 2.5,
        estimated_time: 30,
        route_points: [{ lat: 37.55, lng: 127.13 }],
        is_public: true,
        created_at: day(2026, 5, 3),
        updated_at: day(2026, 5, 3),
      },
      {
        id: 102,
        user_id: 1,
        title: '근처 천변 산책로',
        description: '어쩌구 저쩌구한 플로깅 코스\n\n어쩌구하고 저쩌구 구간이 특징입니다',
        area_name: '서울 송파구',
        distance: 2.8,
        estimated_time: 35,
        route_points: [{ lat: 37.51, lng: 127.1 }],
        is_public: true,
        created_at: day(2026, 5, 4),
        updated_at: day(2026, 5, 4),
      },
    ],
    favorites: [
      { id: 1, user_id: 1, course_id: 2 },
      { id: 2, user_id: 1, course_id: 5 },
      { id: 3, user_id: 1, course_id: 7 },
      { id: 4, user_id: 1, course_id: 1 },
    ],
    reviews: [
      {
        id: 1,
        course_id: 1,
        user_id: 7,
        rating: 5,
        content: '길이 평평해서 걷기 좋았고, 쓰레기도 많이 주웠어요!',
        created_at: day(2026, 5, 25),
      },
      {
        id: 2,
        course_id: 1,
        user_id: 8,
        rating: 5,
        content: '아이와 함께 걷기 좋은 코스예요.',
        created_at: day(2026, 5, 24),
      },
      {
        id: 3,
        course_id: 1,
        user_id: 9,
        rating: 4,
        content: '경치가 좋고 쓰레기 수거 포인트가 많아요.',
        created_at: day(2026, 5, 23),
      },
      {
        id: 4,
        course_id: 2,
        user_id: 7,
        rating: 5,
        content: '한강 바람이 시원해요.',
        created_at: day(2026, 5, 26),
      },
      {
        id: 5,
        course_id: 2,
        user_id: 8,
        rating: 4,
        content: '저녁에 걷기 좋습니다.',
        created_at: day(2026, 5, 25),
      },
      {
        id: 6,
        course_id: 3,
        user_id: 7,
        rating: 4,
        content: '넓은 공원이라 플로깅하기 좋아요.',
        created_at: day(2026, 5, 20),
      },
      { id: 7, course_id: 4, user_id: 10, rating: 3, content: '거리가 길어요.', created_at: day(2026, 5, 18) },
      { id: 8, course_id: 4, user_id: 11, rating: 3, content: '경사가 있습니다.', created_at: day(2026, 5, 17) },
      { id: 9, course_id: 5, user_id: 7, rating: 5, content: '짧아서 부담 없어요!', created_at: day(2026, 5, 27) },
      { id: 10, course_id: 5, user_id: 8, rating: 5, content: '한강 뷰 최고.', created_at: day(2026, 5, 26) },
      { id: 11, course_id: 5, user_id: 9, rating: 5, content: '초보자 추천.', created_at: day(2026, 5, 25) },
      { id: 12, course_id: 6, user_id: 10, rating: 4, content: '길이 길지만 볼거리 많음.', created_at: day(2026, 5, 24) },
      { id: 13, course_id: 6, user_id: 11, rating: 4, content: '자전거 많음.', created_at: day(2026, 5, 23) },
      { id: 14, course_id: 7, user_id: 7, rating: 5, content: '망원역에서 가깝습니다.', created_at: day(2026, 5, 27) },
      { id: 15, course_id: 7, user_id: 12, rating: 5, content: '일몰 때 예뻐요.', created_at: day(2026, 5, 26) },
      { id: 16, course_id: 8, user_id: 10, rating: 3, content: '사람이 많아요.', created_at: day(2026, 5, 22) },
      { id: 17, course_id: 8, user_id: 11, rating: 4, content: '카페 구경 겸 좋음.', created_at: day(2026, 5, 21) },
      { id: 18, course_id: 9, user_id: 8, rating: 4, content: '공원이 넓어요.', created_at: day(2026, 5, 20) },
      { id: 19, course_id: 10, user_id: 9, rating: 5, content: '탄천 물소리 좋아요.', created_at: day(2026, 5, 19) },
      { id: 20, course_id: 10, user_id: 12, rating: 4, content: '평탄한 편.', created_at: day(2026, 5, 18) },
      { id: 21, course_id: 1, user_id: 10, rating: 4, content: '주말에 붐벼요.', created_at: day(2026, 5, 22) },
      { id: 22, course_id: 2, user_id: 11, rating: 5, content: '야경도 좋습니다.', created_at: day(2026, 5, 21) },
      { id: 23, course_id: 3, user_id: 12, rating: 3, content: '더운 날는 힘듦.', created_at: day(2026, 5, 19) },
    ],
    plogging_sessions: [
      {
        id: 10,
        user_id: 1,
        course_id: 1,
        mode: 'COURSE',
        status: 'COMPLETED',
        started_at: day(2026, 5, 25),
        ended_at: day(2026, 5, 25),
        distance: 3.5,
        duration_seconds: 5025,
        trash_bag_type: 'STANDARD',
        trash_amount_value: '4-6',
        trash_amount_unit: 'L',
        created_at: day(2026, 5, 25),
      },
      {
        id: 11,
        user_id: 1,
        course_id: 2,
        mode: 'COURSE',
        status: 'COMPLETED',
        started_at: day(2026, 5, 4),
        ended_at: day(2026, 5, 4),
        distance: 3.5,
        duration_seconds: 5025,
        trash_bag_type: 'STANDARD',
        trash_amount_value: '4-6',
        trash_amount_unit: 'L',
        created_at: day(2026, 5, 4),
      },
      {
        id: 12,
        user_id: 1,
        course_id: 5,
        mode: 'COURSE',
        status: 'COMPLETED',
        started_at: day(2026, 5, 20),
        ended_at: day(2026, 5, 20),
        distance: 1.8,
        duration_seconds: 1800,
        trash_bag_type: 'NORMAL',
        trash_amount_value: '50',
        trash_amount_unit: '%',
        created_at: day(2026, 5, 20),
      },
      {
        id: 13,
        user_id: 1,
        course_id: 7,
        mode: 'COURSE',
        status: 'COMPLETED',
        started_at: day(2026, 5, 15),
        ended_at: day(2026, 5, 15),
        distance: 2.1,
        duration_seconds: 2100,
        trash_bag_type: 'STANDARD',
        trash_amount_value: '2-3',
        trash_amount_unit: 'L',
        created_at: day(2026, 5, 15),
      },
      {
        id: 14,
        user_id: 1,
        mode: 'FREE',
        status: 'COMPLETED',
        started_at: day(2026, 5, 10),
        ended_at: day(2026, 5, 10),
        distance: 2.0,
        duration_seconds: 2400,
        trash_bag_type: 'NORMAL',
        trash_amount_value: '30',
        trash_amount_unit: '%',
        created_at: day(2026, 5, 10),
      },
    ],
  };
}

/** 런타임에서 갱신 가능한 in-memory DB */
export let MOCK_DB: MockDb = buildInitialMockDb();

export function dbFindCourse(courseId: number): DbCourseRow | undefined {
  return MOCK_DB.courses.find((c) => c.id === courseId);
}

export function dbFindUser(userId: number): DbUserRow | undefined {
  return MOCK_DB.users.find((u) => u.id === userId);
}

export function dbIsFavorite(userId: number, courseId: number): boolean {
  return MOCK_DB.favorites.some(
    (f) => f.user_id === userId && f.course_id === courseId,
  );
}

export function dbToggleFavorite(
  userId: number,
  courseId: number,
): { isFavorite: boolean } {
  const idx = MOCK_DB.favorites.findIndex(
    (f) => f.user_id === userId && f.course_id === courseId,
  );
  if (idx >= 0) {
    MOCK_DB.favorites.splice(idx, 1);
    return { isFavorite: false };
  }
  const nextId =
    Math.max(0, ...MOCK_DB.favorites.map((f) => f.id)) + 1;
  MOCK_DB.favorites.push({ id: nextId, user_id: userId, course_id: courseId });
  return { isFavorite: true };
}

export function dbCourseReviewStats(courseId: number) {
  const reviews = MOCK_DB.reviews.filter((r) => r.course_id === courseId);
  const reviewCount = reviews.length;
  const rating =
    reviewCount === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;
  return { rating, reviewCount };
}

export function dbToCourseListItem(
  course: DbCourseRow,
  viewerUserId: number,
): CourseListItem {
  const { rating, reviewCount } = dbCourseReviewStats(course.id);
  return {
    courseId: course.id,
    userId: course.user_id,
    title: course.title,
    areaName: course.area_name,
    distance: course.distance,
    estimatedTime: course.estimated_time,
    rating: reviewCount > 0 ? Math.round(rating * 10) / 10 : undefined,
    reviewCount,
    thumbnailUrl: course.thumbnail_url,
    isFavorite: dbIsFavorite(viewerUserId, course.id),
  };
}

export function dbToCourseDetail(
  course: DbCourseRow,
  viewerUserId: number,
): CourseDetail {
  const base = dbToCourseListItem(course, viewerUserId);
  const previewReviews = MOCK_DB.reviews
    .filter((r) => r.course_id === course.id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 1)
    .map((r) => ({
      reviewId: r.id,
      nickname: dbFindUser(r.user_id)?.nickname ?? `user#${r.user_id}`,
      rating: r.rating,
      content: r.content,
    }));

  return {
    ...base,
    description: course.description,
    routePoints: course.route_points,
    previewReviews,
  };
}

export function dbInsertReview(row: Omit<DbReviewRow, 'id'>): DbReviewRow {
  const nextId = Math.max(0, ...MOCK_DB.reviews.map((r) => r.id)) + 1;
  const inserted = { ...row, id: nextId };
  MOCK_DB.reviews.unshift(inserted);
  return inserted;
}

export function dbInsertCourse(
  body: CreateCourseRequest,
): DbCourseRow {
  const nextId = Math.max(0, ...MOCK_DB.courses.map((c) => c.id)) + 1;
  const now = iso(new Date());
  const inserted: DbCourseRow = {
    id: nextId,
    user_id: body.userId,
    title: body.title,
    description: body.description,
    area_name: body.areaName,
    distance: body.distance,
    estimated_time: body.estimatedTime,
    route_points: body.routePoints,
    is_public: body.isPublic,
    created_at: now,
    updated_at: now,
  };
  MOCK_DB.courses.push(inserted);
  return inserted;
}

export function dbUpdateUserProfile(
  userId: number,
  patch: { nickname?: string; profileImageUrl?: string },
): DbUserRow | undefined {
  const user = dbFindUser(userId);
  if (!user) return undefined;
  if (patch.nickname != null) user.nickname = patch.nickname;
  if (patch.profileImageUrl != null) user.profile_image_url = patch.profileImageUrl;
  return user;
}

export function dbGetPublicCourses(viewerUserId: number): CourseListItem[] {
  return MOCK_DB.courses
    .filter((c) => c.is_public && c.id < 100)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((c) => dbToCourseListItem(c, viewerUserId));
}

export function dbGetMyCourses(userId: number): CourseListItem[] {
  return MOCK_DB.courses
    .filter((c) => c.user_id === userId)
    .map((c) => dbToCourseListItem(c, userId));
}

export function dbGetFavoriteCourses(userId: number): CourseListItem[] {
  const ids = new Set(
    MOCK_DB.favorites.filter((f) => f.user_id === userId).map((f) => f.course_id),
  );
  return MOCK_DB.courses
    .filter((c) => ids.has(c.id))
    .map((c) => dbToCourseListItem(c, userId));
}

export function dbGetAllCoursesAsListItems(viewerUserId: number): CourseListItem[] {
  return MOCK_DB.courses.map((c) => dbToCourseListItem(c, viewerUserId));
}

/** 개발용 카카오 로그인 응답 (mock DB 사용자 1) */
export function getDevMockLogin(): LoginResponse {
  const user = dbFindUser(1)!;
  return {
    userId: user.id,
    nickname: user.nickname,
    profileImageUrl: user.profile_image_url,
    accessToken: 'dev-mock-access-token',
    refreshToken: 'dev-mock-refresh-token',
    isNewUser: false,
  };
}
