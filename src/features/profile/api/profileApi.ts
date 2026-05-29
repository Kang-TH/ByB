import { apiClient } from '@/shared/api/client';
import type { ProfileResponse, UpdateProfileRequest } from '@/types/profile';

export async function fetchProfile(userId: number): Promise<ProfileResponse> {
  const { data } = await apiClient.get<ProfileResponse>(`/profile/${userId}`);
  return data;
}

export async function updateProfile(
  userId: number,
  body: UpdateProfileRequest,
) {
  const { data } = await apiClient.put<{
    userId: number;
    nickname: string;
    profileImageUrl?: string;
    message: string;
  }>(`/profile/${userId}`, body);
  return data;
}
