import { haversineKm } from '@/shared/utils/geo';
import type { CourseListItem, RoutePoint } from '@/types/course';

export function sortCoursesByProximity(
  courses: CourseListItem[],
  userLocation: RoutePoint,
  getCourseStartPoint: (courseId: number) => RoutePoint | undefined,
): CourseListItem[] {
  return [...courses].sort((a, b) => {
    const startA = getCourseStartPoint(a.courseId);
    const startB = getCourseStartPoint(b.courseId);
    const distA = startA ? haversineKm(userLocation, startA) : Number.POSITIVE_INFINITY;
    const distB = startB ? haversineKm(userLocation, startB) : Number.POSITIVE_INFINITY;
    return distA - distB;
  });
}
