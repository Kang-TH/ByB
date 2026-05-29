import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  configureAuthSession,
  renewSessionOnStartup,
} from '@/shared/api/authSession';
import { setAccessToken } from '@/shared/api/client';
import { useLocationStore } from '@/shared/location/locationStore';
import { clearAuthTokens, loadAuthTokens, saveAuthTokens } from '@/shared/utils/storage';
import type { LoginResponse } from '@/types/auth';

interface AuthContextValue {
  userId: number | null;
  nickname: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (response: LoginResponse) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<number | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    configureAuthSession({
      onTokensUpdated: (response) => {
        setAccessToken(response.accessToken);
        setUserId(response.userId);
        setNickname(response.nickname);
      },
      onSessionExpired: () => {
        void (async () => {
          await clearAuthTokens();
          setAccessToken(null);
          setUserId(null);
          setNickname(null);
          useLocationStore.setState({ permissionStatus: null });
        })();
      },
    });
  }, []);

  useEffect(() => {
    (async () => {
      const tokens = await loadAuthTokens();
      if (tokens) {
        setAccessToken(tokens.accessToken);
        setUserId(tokens.userId);
        setNickname(tokens.nickname ?? null);
        await renewSessionOnStartup();
      }
      setIsLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (response: LoginResponse) => {
    try {
      await saveAuthTokens(
        response.userId,
        response.accessToken,
        response.refreshToken,
        response.nickname,
      );
    } catch {
      // SecureStore 미지원 환경(웹 등)에서도 로그인 진행
    }
    setAccessToken(response.accessToken);
    setUserId(response.userId);
    setNickname(response.nickname);
  }, []);

  const signOut = useCallback(async () => {
    await clearAuthTokens();
    setAccessToken(null);
    setUserId(null);
    setNickname(null);
    useLocationStore.setState({ permissionStatus: null });
  }, []);

  const value = useMemo(
    () => ({
      userId,
      nickname,
      isLoading,
      isAuthenticated: userId != null,
      signIn,
      signOut,
    }),
    [userId, nickname, isLoading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
