import axios from 'axios';
import { API_BASE_URL } from '@/shared/constants/config';
import type { LoginResponse } from '@/types/auth';

const tokenClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

/** 백엔드 refresh API — 실패 시 재로그인 필요 */
export async function renewWithRefreshToken(
  refreshToken: string,
): Promise<LoginResponse | null> {
  try {
    const { data } = await tokenClient.post<LoginResponse>('/token/refresh', {
      refreshToken,
    });
    return data;
  } catch {
    return null;
  }
}

export async function renewSession(
  refreshToken: string,
): Promise<LoginResponse | null> {
  return renewWithRefreshToken(refreshToken);
}
