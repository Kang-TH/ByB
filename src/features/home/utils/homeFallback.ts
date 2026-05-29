import type { HomeResponse } from '@/types/plogging';

export function createFallbackHome(nickname: string): HomeResponse {
  return {
    nickname,
    weeklySummary: {
      distance: 0,
      ploggingCount: 0,
      trashAmount: '0L',
    },
    recommendedCourses: [],
    recentActivities: [],
  };
}
