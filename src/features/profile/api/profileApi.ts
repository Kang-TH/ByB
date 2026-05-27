// TODO(api): Replace mockDb reads/writes with real API calls.
// Spec:
// - GET /api/v1/profile/{userId}
// - PUT /api/v1/profile/{userId}
// import { apiClient } from '@/shared/api/client';
import {
  dbFindCourse,
  dbFindUser,
  dbUpdateUserProfile,
  MOCK_DB,
} from '@/shared/mockDb';
import { formatDuration } from '@/shared/utils/format';
import { sumTrashLitersFromSessions } from '@/shared/utils/trashAmount';
import type { ProfileResponse, UpdateProfileRequest } from '@/types/profile';

export async function fetchProfile(userId: number): Promise<ProfileResponse> {
  // const { data } = await apiClient.get<ProfileResponse>(`/profile/${userId}`);
  // return data;

  const me = dbFindUser(userId) ?? MOCK_DB.users[0];

  const myCourses = MOCK_DB.courses
    .filter((c) => c.user_id === me.id)
    .map((c) => {
      const reviews = MOCK_DB.reviews.filter((r) => r.course_id === c.id);
      const rating =
        reviews.length === 0
          ? 0
          : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      return {
        courseId: c.id,
        title: c.title,
        distance: c.distance,
        rating,
      };
    });

  const completedSessions = MOCK_DB.plogging_sessions
    .filter((s) => s.user_id === me.id && s.status === 'COMPLETED')
    .sort(
      (a, b) =>
        new Date(b.started_at ?? b.created_at).getTime() -
        new Date(a.started_at ?? a.created_at).getTime(),
    );

  const activityRecords = completedSessions.map((s) => {
      const course = s.course_id ? dbFindCourse(s.course_id) : undefined;
      return {
        ploggingId: s.id,
        date: (s.started_at ?? s.created_at).slice(0, 10),
        courseName: course?.title ?? '코스 미지정',
        distance: s.distance ?? 0,
        duration: formatDuration(s.duration_seconds ?? 0),
        trashAmount: `${s.trash_amount_value ?? ''}${s.trash_amount_unit ?? ''}`,
      };
    });

  const totalDistance = completedSessions.reduce(
    (acc, s) => acc + (s.distance ?? 0),
    0,
  );
  const totalPloggingCount = completedSessions.length;
  const totalTrashAmount = sumTrashLitersFromSessions(completedSessions);

  return {
    userId: me.id,
    nickname: me.nickname,
    profileImageUrl: me.profile_image_url,
    totalSummary: {
      totalDistance,
      totalPloggingCount,
      totalTrashAmount,
    },
    myCourses,
    activityRecords,
  };
}

export async function updateProfile(
  userId: number,
  body: UpdateProfileRequest,
) {
  // const { data } = await apiClient.put(`/profile/${userId}`, body);
  // return data;

  const me = dbUpdateUserProfile(userId, {
    nickname: body.nickname,
    profileImageUrl: body.profileImageUrl,
  }) ?? MOCK_DB.users[0];

  return {
    userId: me.id,
    nickname: me.nickname,
    profileImageUrl: me.profile_image_url,
    message: '프로필이 수정되었습니다.',
  };
}
