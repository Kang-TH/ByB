import { useCallback } from 'react';
import type { LoginResponse } from '@/types/auth';
import { signInWithKakaoAndServer } from '@/features/auth/services/kakaoAuth';

export function useKakaoLogin() {
  const signInWithKakao = useCallback(async (): Promise<LoginResponse> => {
    return signInWithKakaoAndServer();
  }, []);

  return { signInWithKakao };
}
