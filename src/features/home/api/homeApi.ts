import { apiClient } from '@/shared/api/client';
import { toCourseListItem } from '@/shared/api/mappers';
import type { HomeResponse } from '@/types/plogging';

export async function fetchHome(): Promise<HomeResponse> {
  const { data } = await apiClient.get<HomeResponse>('/plogging');
  const summary = data.weeklySummary;
  return {
    ...data,
    nickname: data.nickname ?? '',
    weeklySummary: {
      distance: summary?.distance ?? 0,
      ploggingCount: summary?.ploggingCount ?? 0,
      trashAmount: summary?.trashAmount ?? '0L',
    },
    recommendedCourses: (data.recommendedCourses ?? []).map((c) =>
      toCourseListItem(c),
    ),
    recentActivities: data.recentActivities ?? [],
  };
}
