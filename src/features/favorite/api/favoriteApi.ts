import { toggleFavorite } from '@/features/course/api/courseApi';

export interface ToggleFavoriteResponse {
  courseId: number;
  isFavorite: boolean;
  message?: string;
}

export async function toggleFavoriteOnServer(courseId: number, userId: number) {
  // const { data } = await apiClient.post<ToggleFavoriteResponse>(
  //   `/course/recommend/${courseId}`,
  //   { userId },
  // );
  // return data;

  return toggleFavorite(courseId, userId);
}
