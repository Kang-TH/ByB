import { create } from 'zustand';
import type { CourseDetail, RoutePoint } from '@/types/course';

interface CourseDraftState {
  editingCourseId: number | null;
  isPublic: boolean;
  routePoints: RoutePoint[];
  title: string;
  description: string;
  areaName: string;
  addRoutePoint: (point: RoutePoint) => void;
  removeLastRoutePoint: () => void;
  setMeta: (meta: { title: string; description: string; areaName?: string }) => void;
  loadFromCourse: (course: CourseDetail) => void;
  reset: () => void;
}

const initial = {
  editingCourseId: null as number | null,
  isPublic: false,
  routePoints: [] as RoutePoint[],
  title: '',
  description: '',
  areaName: '',
};

export const useCourseDraftStore = create<CourseDraftState>((set) => ({
  ...initial,
  addRoutePoint: (point) =>
    set((s) => ({ routePoints: [...s.routePoints, point] })),
  removeLastRoutePoint: () =>
    set((s) => ({
      routePoints:
        s.routePoints.length > 0 ? s.routePoints.slice(0, -1) : s.routePoints,
    })),
  setMeta: (meta) =>
    set({
      title: meta.title,
      description: meta.description,
      areaName: meta.areaName ?? '',
    }),
  loadFromCourse: (course) =>
    set({
      editingCourseId: course.courseId,
      isPublic: course.isPublic === true,
      routePoints: course.routePoints ?? [],
      title: course.title,
      description: course.description ?? '',
      areaName: course.areaName,
    }),
  reset: () => set(initial),
}));
