export interface LoginRequest {
  kakaoId: string;
  email?: string;
  nickname: string;
  profileImageUrl?: string;
}

export interface LoginResponse {
  userId: number;
  nickname: string;
  profileImageUrl?: string;
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}

export interface AuthTokens {
  userId: number;
  accessToken: string;
  refreshToken: string;
}
