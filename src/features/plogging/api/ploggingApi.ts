import { apiClient } from '@/shared/api/client';
import { toEndPloggingTrashPayload } from '@/shared/utils/trashAmount';
import type {
  ActivityRecord,
  EndPloggingRequest,
  StartPloggingResponse,
} from '@/types/plogging';
import type { TrashDraft } from '@/features/plogging/store/ploggingSessionStore';

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

export async function startFreePlogging(userId: number): Promise<StartPloggingResponse> {
  const { data } = await apiClient.post<StartPloggingResponse>('/plogging', {
    userId,
    mode: 'FREE',
  });
  return data;
}

export async function startCoursePlogging(
  courseId: number,
  userId: number,
): Promise<StartPloggingResponse> {
  const { data } = await apiClient.post<StartPloggingResponse>(
    `/plogging/${courseId}`,
    { userId },
  );
  return data;
}

export async function endPlogging(
  courseId: number,
  ploggingId: number,
  body: EndPloggingRequest,
) {
  const { data } = await apiClient.post<{
    ploggingId: number;
    courseId?: number;
    courseName?: string;
    distance: number;
    duration: string;
    trashAmount: string;
    endedAt: string;
    message: string;
  }>(`/plogging/${courseId}/${ploggingId}`, body);
  return data;
}

export async function completePlogging(
  input: PersistPloggingResultInput & {
    trashDraft?: TrashDraft | null;
  },
) {
  const courseId = input.courseId ?? 0;
  const trash = toEndPloggingTrashPayload(
    input.trashDraft ??
      (input.trashBagType
        ? {
            bagType: input.trashBagType,
            trashAmountValue: input.trashAmountValue ?? '0',
            trashAmountUnit: input.trashAmountUnit ?? 'L',
          }
        : null),
  );
  const body: EndPloggingRequest = {
    distance: input.distance,
    durationSeconds: input.durationSeconds,
    ...trash,
  };
  return endPlogging(courseId, input.ploggingId, body);
}

export async function fetchPloggingHistory(
  userId: number,
): Promise<{ records: ActivityRecord[] }> {
  const { data } = await apiClient.get<{ records: ActivityRecord[] }>(
    `/plogging/history/${userId}`,
  );
  return data;
}
