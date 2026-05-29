import { apiClient } from '@/shared/api/client';
import type { LoginRequest, LoginResponse } from '@/types/auth';

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/login', request);
  return data;
}
