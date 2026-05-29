import { toggleFavorite } from '@/features/course/api/courseApi';

export interface ToggleFavoriteResponse {
  courseId: number;
  isFavorite: boolean;
  message?: string;
}

export async function toggleFavoriteOnServer(courseId: number, userId: number) {
  return toggleFavorite(courseId, userId);
}
