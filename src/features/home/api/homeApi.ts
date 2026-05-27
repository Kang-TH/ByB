// TODO(api): Replace mockDb aggregation with real API call.
// Spec: GET /api/v1/plogging (Home)
// - Backend should return weeklySummary/recommendedCourses/recentActivities.
// - Front should not need to read/aggregate from local DB once wired.
// import { apiClient } from '@/shared/api/client';
import type { HomeResponse } from '@/types/plogging';
import {
  dbFindCourse,
  dbFindUser,
  dbGetPublicCourses,
  MOCK_DB,
} from '@/shared/mockDb';
import { formatDuration } from '@/shared/utils/format';
import { sumTrashLitersFromSessions } from '@/shared/utils/trashAmount';
import { getCurrentWeekRange, isWithinRange } from '@/shared/utils/week';

export async function fetchHome(userId: number): Promise<HomeResponse> {
  // const { data } = await apiClient.get<HomeResponse>('/plogging');
  // return data;

  const me = dbFindUser(userId) ?? MOCK_DB.users[0];
  const { start: weekStart, end: weekEnd } = getCurrentWeekRange();

  const weeklySessions = MOCK_DB.plogging_sessions
    .filter(
      (s) =>
        s.user_id === me.id &&
        s.status === 'COMPLETED' &&
        isWithinRange(s.started_at ?? s.created_at, weekStart, weekEnd),
    )
    .sort(
      (a, b) =>
        new Date(b.started_at ?? b.created_at).getTime() -
        new Date(a.started_at ?? a.created_at).getTime(),
    );

  const distance = weeklySessions.reduce((acc, s) => acc + (s.distance ?? 0), 0);
  const ploggingCount = weeklySessions.length;
  const trashAmount = sumTrashLitersFromSessions(weeklySessions);

  const recommendedCourses = dbGetPublicCourses(me.id).slice(0, 3);

  const recentActivities = weeklySessions.map((s) => {
    const course = s.course_id ? dbFindCourse(s.course_id) : undefined;
    return {
      ploggingId: s.id,
      courseName: course?.title ?? '코스 미지정',
      date: (s.started_at ?? s.created_at).slice(0, 10),
      distance: s.distance ?? 0,
      duration: formatDuration(s.duration_seconds ?? 0),
      trashAmount: `${s.trash_amount_value ?? ''}${s.trash_amount_unit ?? ''}`,
    };
  });

  return {
    nickname: me.nickname,
    profileImageUrl: me.profile_image_url,
    weeklySummary: { distance, ploggingCount, trashAmount },
    recommendedCourses,
    recentActivities,
  };
}
