import * as SecureStore from 'expo-secure-store';

const KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  userId: 'userId',
} as const;

export async function saveAuthTokens(
  userId: number,
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(KEYS.userId, String(userId)),
    SecureStore.setItemAsync(KEYS.accessToken, accessToken),
    SecureStore.setItemAsync(KEYS.refreshToken, refreshToken),
  ]);
}

export async function loadAuthTokens(): Promise<{
  userId: number;
  accessToken: string;
  refreshToken: string;
} | null> {
  const [userId, accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(KEYS.userId),
    SecureStore.getItemAsync(KEYS.accessToken),
    SecureStore.getItemAsync(KEYS.refreshToken),
  ]);

  if (!userId || !accessToken || !refreshToken) return null;

  return {
    userId: Number(userId),
    accessToken,
    refreshToken,
  };
}

export async function clearAuthTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(KEYS.userId),
    SecureStore.deleteItemAsync(KEYS.accessToken),
    SecureStore.deleteItemAsync(KEYS.refreshToken),
  ]);
}
