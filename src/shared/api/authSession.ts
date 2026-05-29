import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { renewSession } from '@/features/auth/services/sessionRenewal';
import { apiClient, setAccessToken } from '@/shared/api/client';
import { isJwtExpired } from '@/shared/utils/jwt';
import { loadAuthTokens, saveAuthTokens } from '@/shared/utils/storage';
import type { LoginResponse } from '@/types/auth';

type SessionHandlers = {
  onTokensUpdated: (response: LoginResponse) => void;
  onSessionExpired: () => void;
};

let handlers: SessionHandlers | null = null;
let refreshPromise: Promise<boolean> | null = null;
let configured = false;

function isAuthRetrySkipped(config: InternalAxiosRequestConfig | undefined): boolean {
  if (!config?.url) return false;
  const path = config.url.replace(/^\//, '');
  return (
    path === 'login' ||
    path.startsWith('token/refresh') ||
    config.headers?.['X-Skip-Auth-Retry'] === '1'
  );
}

async function persistAndApplyTokens(response: LoginResponse): Promise<void> {
  await saveAuthTokens(
    response.userId,
    response.accessToken,
    response.refreshToken,
    response.nickname,
  );
  setAccessToken(response.accessToken);
  handlers?.onTokensUpdated(response);
}

export async function tryRenewSession(): Promise<boolean> {
  const stored = await loadAuthTokens();
  if (!stored) return false;

  const renewed = await renewSession(stored.refreshToken);
  if (!renewed) return false;

  await persistAndApplyTokens(renewed);
  return true;
}

async function runRefreshOnce(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = tryRenewSession().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export function configureAuthSession(next: SessionHandlers): void {
  handlers = next;

  if (configured) return;
  configured = true;

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as InternalAxiosRequestConfig & {
        _authRetried?: boolean;
      };

      if (
        error.response?.status !== 401 ||
        !config ||
        config._authRetried ||
        isAuthRetrySkipped(config)
      ) {
        return Promise.reject(error);
      }

      const renewed = await runRefreshOnce();
      if (!renewed) {
        handlers?.onSessionExpired();
        return Promise.reject(error);
      }

      config._authRetried = true;
      if (config.headers) {
        const token = (await loadAuthTokens())?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return apiClient.request(config);
    },
  );
}

/** 앱 시작 시 access 만료 임박·만료 시에만 갱신 */
export async function renewSessionOnStartup(): Promise<boolean> {
  const stored = await loadAuthTokens();
  if (!stored) return false;
  setAccessToken(stored.accessToken);
  if (!isJwtExpired(stored.accessToken)) return true;
  return tryRenewSession();
}
