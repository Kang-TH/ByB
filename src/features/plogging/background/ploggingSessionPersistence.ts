import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ActivePloggingSession } from '@/types/plogging';
import { PLOGGING_SESSION_STORAGE_KEY } from '@/features/plogging/background/constants';

export type PersistedPloggingSession = ActivePloggingSession & {
  liveActivityId?: string;
};

export async function persistPloggingSession(
  session: PersistedPloggingSession | null,
): Promise<void> {
  if (session == null) {
    await AsyncStorage.removeItem(PLOGGING_SESSION_STORAGE_KEY);
    return;
  }
  await AsyncStorage.setItem(PLOGGING_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export async function loadPersistedPloggingSession(): Promise<PersistedPloggingSession | null> {
  const raw = await AsyncStorage.getItem(PLOGGING_SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PersistedPloggingSession;
  } catch {
    return null;
  }
}
