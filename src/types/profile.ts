import type { ActivityRecord } from './plogging';
import type { CourseListItem } from './course';

export interface TotalSummary {
  totalDistance: number;
  totalPloggingCount: number;
  totalTrashAmount: string;
}

export interface ProfileResponse {
  userId: number;
  nickname: string;
  profileImageUrl?: string;
  totalSummary: TotalSummary;
  myCourses: Pick<CourseListItem, 'courseId' | 'title' | 'distance' | 'rating'>[];
  activityRecords: ActivityRecord[];
}

export interface UpdateProfileRequest {
  nickname: string;
  profileImageUrl?: string;
}
