import { useQuery } from '@tanstack/react-query';
import {
  getAreaDisplayFromName,
  parseAreaNameToParts,
  resolveAreaFromRoutePoints,
  formatAreaParts,
} from '@/features/course/utils/courseArea';
import type { RoutePoint } from '@/types/course';

export function useCourseAreaDisplay(
  areaName: string,
  routePoints?: RoutePoint[],
) {
  return useQuery({
    queryKey: [
      'course',
      'areaDisplay',
      'v3-naver',
      areaName,
      routePoints?.[0]?.lat,
      routePoints?.[0]?.lng,
      routePoints?.length,
    ],
    queryFn: async () => {
      const fromName = parseAreaNameToParts(areaName);
      if (fromName) return formatAreaParts(fromName);

      if (routePoints && routePoints.length > 0) {
        const fromCoords = await resolveAreaFromRoutePoints(routePoints);
        if (fromCoords) return formatAreaParts(fromCoords);
      }

      return getAreaDisplayFromName(areaName);
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
}
