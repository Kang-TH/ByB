import { useCallback } from 'react';
import type { LoginResponse } from '@/types/auth';
import { getDevMockLogin } from '@/shared/mockDb';

export function useKakaoLogin() {
  const signInWithKakao = useCallback(async (): Promise<LoginResponse> => {
    return getDevMockLogin();
  }, []);

  return { signInWithKakao };
}
