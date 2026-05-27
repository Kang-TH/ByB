import type { RoutePoint } from './course';

export type PloggingMode = 'FREE' | 'COURSE';
export type PloggingStatus = 'IN_PROGRESS' | 'COMPLETED';
export type TrashBagType = 'STANDARD' | 'NORMAL';

export interface WeeklySummary {
  distance: number;
  ploggingCount: number;
  trashAmount: string;
}

export interface ActivityRecord {
  ploggingId: number;
  date: string;
  courseName: string;
  distance: number;
  duration: string;
  trashAmount: string;
}

export interface HomeResponse {
  nickname: string;
  profileImageUrl?: string;
  weeklySummary: WeeklySummary;
  recommendedCourses: import('./course').CourseListItem[];
  recentActivities: ActivityRecord[];
}

export interface StartPloggingResponse {
  ploggingId: number;
  mode?: PloggingMode;
  courseId?: number;
  courseName?: string;
  status: PloggingStatus;
  startedAt: string;
  routePoints?: RoutePoint[];
}

export interface EndPloggingRequest {
  distance: number;
  durationSeconds: number;
  trashBagType: TrashBagType;
  trashAmountValue: string;
  trashAmountUnit: 'L' | '%';
}

export interface ActivePloggingSession {
  ploggingId: number;
  courseId?: number;
  courseName?: string;
  mode: PloggingMode;
  status: PloggingStatus;
  startedAt: string;
  routePoints?: RoutePoint[];
  trackedPoints: RoutePoint[];
}
