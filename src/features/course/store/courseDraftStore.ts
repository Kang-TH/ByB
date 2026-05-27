import { create } from 'zustand';
import type { RoutePoint } from '@/types/course';

interface CourseDraftState {
  routePoints: RoutePoint[];
  title: string;
  description: string;
  areaName: string;
  setRoutePoints: (points: RoutePoint[]) => void;
  setMeta: (meta: { title: string; description: string; areaName: string }) => void;
  reset: () => void;
}

const initial = {
  routePoints: [] as RoutePoint[],
  title: '',
  description: '',
  areaName: '',
};

export const useCourseDraftStore = create<CourseDraftState>((set) => ({
  ...initial,
  setRoutePoints: (routePoints) => set({ routePoints }),
  setMeta: (meta) => set(meta),
  reset: () => set(initial),
}));
