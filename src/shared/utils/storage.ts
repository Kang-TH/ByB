import * as SecureStore from 'expo-secure-store';

const KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  userId: 'userId',
  nickname: 'nickname',
} as const;

export async function saveAuthTokens(
  userId: number,
  accessToken: string,
  refreshToken: string,
  nickname?: string,
): Promise<void> {
  const tasks = [
    SecureStore.setItemAsync(KEYS.userId, String(userId)),
    SecureStore.setItemAsync(KEYS.accessToken, accessToken),
    SecureStore.setItemAsync(KEYS.refreshToken, refreshToken),
  ];
  if (nickname != null) {
    tasks.push(SecureStore.setItemAsync(KEYS.nickname, nickname));
  }
  await Promise.all(tasks);
}

export async function loadAuthTokens(): Promise<{
  userId: number;
  accessToken: string;
  refreshToken: string;
  nickname?: string;
} | null> {
  const [userId, accessToken, refreshToken, nickname] = await Promise.all([
    SecureStore.getItemAsync(KEYS.userId),
    SecureStore.getItemAsync(KEYS.accessToken),
    SecureStore.getItemAsync(KEYS.refreshToken),
    SecureStore.getItemAsync(KEYS.nickname),
  ]);

  if (!userId || !accessToken || !refreshToken) return null;

  return {
    userId: Number(userId),
    accessToken,
    refreshToken,
    nickname: nickname ?? undefined,
  };
}

export async function clearAuthTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(KEYS.userId),
    SecureStore.deleteItemAsync(KEYS.accessToken),
    SecureStore.deleteItemAsync(KEYS.refreshToken),
    SecureStore.deleteItemAsync(KEYS.nickname),
  ]);
}
