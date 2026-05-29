import * as Location from 'expo-location';
import { PLOGGING_LOCATION_TASK } from '@/features/plogging/background/constants';
import { isPloggingBackgroundNativeAvailable } from '@/features/plogging/background/ploggingNativeModules';
import {
  loadPersistedPloggingSession,
  persistPloggingSession,
} from '@/features/plogging/background/ploggingSessionPersistence';
import { setPloggingLiveActivityId } from '@/features/plogging/background/ploggingLiveActivity';
import { usePloggingSessionStore } from '@/features/plogging/store/ploggingSessionStore';

/** 앱 재실행 시 백그라운드 GPS가 아직 돌고 있으면 세션 복구 */
export async function resumeActivePloggingIfNeeded(): Promise<void> {
  const persisted = await loadPersistedPloggingSession();
  if (!persisted) return;

  const { session } = usePloggingSessionStore.getState();
  if (session?.ploggingId === persisted.ploggingId) return;

  const native = await isPloggingBackgroundNativeAvailable();
  if (!native) return;

  let running = false;
  try {
    running = await Location.hasStartedLocationUpdatesAsync(
      PLOGGING_LOCATION_TASK,
    );
  } catch {
    return;
  }

  if (!running) {
    await persistPloggingSession(null);
    return;
  }

  usePloggingSessionStore.getState().restoreFromPersisted(persisted);
  setPloggingLiveActivityId(persisted.liveActivityId);
}
