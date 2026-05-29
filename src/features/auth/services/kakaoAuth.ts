import { getKeyHashAndroid, initializeKakaoSDK } from '@react-native-kakao/core';
import { login as kakaoLogin, me as kakaoMe } from '@react-native-kakao/user';
import { Platform } from 'react-native';
import { login as loginToServer } from '@/features/auth/api/authApi';
import type { LoginResponse } from '@/types/auth';

const KAKAO_NATIVE_APP_KEY = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY ?? '';

let sdkInitialized = false;

export async function ensureKakaoSdkInitialized(): Promise<void> {
  if (!KAKAO_NATIVE_APP_KEY) {
    throw new Error(
      'EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY가 설정되지 않았습니다. .env 파일을 확인해 주세요.',
    );
  }
  if (!sdkInitialized) {
    await initializeKakaoSDK(KAKAO_NATIVE_APP_KEY);
    sdkInitialized = true;
  }
}

/** 개발 빌드: Logcat/Metro에 키 해시 출력 → 카카오 콘솔 Android 플랫폼에 등록 */
export async function logAndroidKakaoKeyHashIfDev(): Promise<void> {
  if (!__DEV__ || Platform.OS !== 'android') return;
  try {
    await ensureKakaoSdkInitialized();
    const hash = await getKeyHashAndroid();
    if (hash) {
      console.warn(
        `[ByB] 카카오 Android 키 해시 — developers.kakao.com > 내 앱 > 플랫폼 > Android > 키 해시에 등록:\n${hash}`,
      );
    }
  } catch {
    // ignore
  }
}

/** 카카오 SDK 로그인 → 프로필 조회 → 서버 JWT 발급 */
export async function signInWithKakaoAndServer(): Promise<LoginResponse> {
  await ensureKakaoSdkInitialized();
  await kakaoLogin();
  const profile = await kakaoMe();

  const kakaoId = String(profile.id);
  const nickname =
    profile.nickname?.trim() ||
    profile.name?.trim() ||
    `user_${kakaoId}`;

  return loginToServer({
    kakaoId,
    nickname,
    email: profile.email?.trim() || undefined,
    profileImageUrl:
      profile.profileImageUrl || profile.thumbnailImageUrl || undefined,
  });
}
