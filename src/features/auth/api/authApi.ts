import { apiClient } from '@/shared/api/client';
import type { LoginRequest, LoginResponse } from '@/types/auth';
import { MOCK_DB } from '@/shared/mockDb';

export async function login(request: LoginRequest): Promise<LoginResponse> {
  // TODO(api): Replace mock login with real API call.
  // Spec: POST /api/v1/login
  // 실제 API 통신 (추후 사용)
  // const { data } = await apiClient.post<LoginResponse>('/login', request);
  // return data;

  // 임시 데이터용 (DB 테이블 기준)
  const user =
    MOCK_DB.users.find((u) => u.kakao_id === request.kakaoId) ?? MOCK_DB.users[0];

  return {
    userId: user.id,
    nickname: user.nickname,
    profileImageUrl: user.profile_image_url,
    accessToken: 'dev-mock-access-token',
    refreshToken: 'dev-mock-refresh-token',
    isNewUser: false,
  };
}
