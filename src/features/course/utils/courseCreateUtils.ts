import type { RoutePoint } from '@/types/course';
import { totalDistanceKm } from '@/shared/utils/geo';

/** 도보 기준 예상 소요 시간(분) — 시속 약 5km */
export function estimateWalkingMinutes(distanceKm: number): number {
  if (distanceKm <= 0) return 0;
  return Math.max(1, Math.round((distanceKm / 5) * 60));
}

export function getCourseDraftDistanceKm(routePoints: RoutePoint[]): number {
  return Math.round(totalDistanceKm(routePoints) * 10) / 10;
}

export function formatDistanceKmCompact(km: number): string {
  return `${km.toFixed(1)}km`;
}
