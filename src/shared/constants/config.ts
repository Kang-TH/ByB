export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api/v1';

export const NAVER_MAP_CLIENT_ID =
  process.env.EXPO_PUBLIC_NAVER_MAP_CLIENT_ID?.trim() ?? '';

export const NAVER_MAP_CLIENT_SECRET =
  process.env.EXPO_PUBLIC_NAVER_MAP_CLIENT_SECRET?.trim() ?? '';
