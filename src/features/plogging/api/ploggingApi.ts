// TODO(api): Replace mockDb reads/writes with real API calls.
// Spec:
// - POST /api/v1/plogging (FREE start)
// - POST /api/v1/plogging/{courseId} (COURSE start)
// - POST /api/v1/plogging/{courseId}/{ploggingId} (end)
// - GET /api/v1/plogging/history/{userId}
// import { apiClient } from '@/shared/api/client';
import type {
  ActivityRecord,
  EndPloggingRequest,
  StartPloggingResponse,
} from '@/types/plogging';
import { MOCK_DB, dbFindCourse } from '@/shared/mockDb';
import { formatDuration } from '@/shared/utils/format';

export type PersistPloggingResultInput = {
  userId: number;
  ploggingId: number;
  mode: 'FREE' | 'COURSE';
  courseId?: number;
  startedAt: string;
  durationSeconds: number;
  distance: number;
  trashBagType?: 'STANDARD' | 'NORMAL';
  trashAmountValue?: string;
  trashAmountUnit?: 'L' | '%';
};

export async function persistPloggingResult(input: PersistPloggingResultInput) {
  const endedAt = new Date().toISOString();
  const existingIdx = MOCK_DB.plogging_sessions.findIndex(
    (s) => s.id === input.ploggingId,
  );
  if (existingIdx >= 0) MOCK_DB.plogging_sessions.splice(existingIdx, 1);

  MOCK_DB.plogging_sessions.push({
    id: input.ploggingId,
    user_id: input.userId,
    course_id: input.courseId,
    mode: input.mode,
    status: 'COMPLETED',
    started_at: input.startedAt,
    ended_at: endedAt,
    distance: input.distance,
    duration_seconds: input.durationSeconds,
    trash_bag_type: input.trashBagType,
    trash_amount_value: input.trashAmountValue,
    trash_amount_unit: input.trashAmountUnit,
    created_at: endedAt,
  });

  const course = input.courseId ? dbFindCourse(input.courseId) : undefined;
  return {
    ploggingId: input.ploggingId,
    date: input.startedAt.slice(0, 10),
    courseName: course?.title ?? (input.courseId ? `코스 #${input.courseId}` : '코스 미지정'),
    distance: input.distance,
    duration: formatDuration(input.durationSeconds),
    trashAmount: `${input.trashAmountValue ?? ''}${input.trashAmountUnit ?? ''}`,
    endedAt,
    message: '플로깅이 저장되었습니다.',
  };
}

export async function startFreePlogging(userId: number): Promise<StartPloggingResponse> {
  // 실제 API 통신 (추후 사용)
  // const { data } = await apiClient.post<StartPloggingResponse>('/plogging', {
  //   userId,
  //   mode: 'FREE',
  // });
  // return data;

  // 임시 데이터용 (DB 테이블 기준)
  const nextId = Math.max(0, ...MOCK_DB.plogging_sessions.map((s) => s.id)) + 1;
  return {
    ploggingId: nextId,
    mode: 'FREE',
    status: 'IN_PROGRESS',
    startedAt: new Date().toISOString(),
  };
}

export async function startCoursePlogging(
  courseId: number,
  userId: number,
): Promise<StartPloggingResponse> {
  // 실제 API 통신 (추후 사용)
  // const { data } = await apiClient.post<StartPloggingResponse>(
  //   `/plogging/${courseId}`,
  //   { userId },
  // );
  // return data;

  // 임시 데이터용 (DB 테이블 기준)
  const nextId = Math.max(0, ...MOCK_DB.plogging_sessions.map((s) => s.id)) + 1;
  const course = dbFindCourse(courseId);
  return {
    ploggingId: nextId,
    courseId,
    courseName: course?.title,
    status: 'IN_PROGRESS',
    startedAt: new Date().toISOString(),
    routePoints: course?.route_points,
  };
}

export async function endPlogging(
  courseId: number,
  ploggingId: number,
  body: EndPloggingRequest,
) {
  // 실제 API 통신 (추후 사용)
  // const { data } = await apiClient.post(
  //   `/plogging/${courseId}/${ploggingId}`,
  //   body,
  // );
  // return data;

  // 임시 데이터용 (DB 테이블 기준) — 응답 모양만 맞춤
  const course = dbFindCourse(courseId);
  return {
    ploggingId,
    courseId,
    courseName: course?.title ?? `코스 #${courseId}`,
    distance: body.distance,
    duration: formatDuration(body.durationSeconds),
    trashAmount: `${body.trashAmountValue}${body.trashAmountUnit}`,
    endedAt: new Date().toISOString(),
    message: '플로깅이 저장되었습니다.',
  };
}

/** 화면/스토어 스냅샷으로 mockDb에 실제 저장 */
export async function completePlogging(input: PersistPloggingResultInput) {
  return persistPloggingResult(input);
}

export async function fetchPloggingHistory(
  userId: number,
): Promise<{ records: ActivityRecord[] }> {
  // 실제 API 통신 (추후 사용)
  // const { data } = await apiClient.get<{ records: ActivityRecord[] }>(
  //   `/plogging/history/${userId}`,
  // );
  // return data;

  // 임시 데이터용 (DB 테이블 기준)
  const records: ActivityRecord[] = MOCK_DB.plogging_sessions
    .filter((s) => s.user_id === userId && s.status === 'COMPLETED')
    .map((s) => {
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

  return { records };
}
