import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { PLOGGING_LOCATION_TASK } from '@/features/plogging/background/constants';
import {
  startPloggingForegroundTracking,
  stopPloggingForegroundTracking,
} from '@/features/plogging/background/ploggingForegroundTracking';
import {
  persistPloggingSession,
  type PersistedPloggingSession,
} from '@/features/plogging/background/ploggingSessionPersistence';
import {
  ensurePloggingLocationTaskRegistered,
  isPloggingBackgroundNativeAvailable,
} from '@/features/plogging/background/ploggingNativeModules';
import {
  requestPloggingLocationPermissions,
} from '@/features/plogging/background/ploggingPermissions';
import {
  getPloggingLiveActivityId,
  setPloggingLiveActivityId,
  startPloggingLiveActivity,
  stopPloggingLiveActivity,
} from '@/features/plogging/background/ploggingLiveActivity';
import { usePloggingSessionStore } from '@/features/plogging/store/ploggingSessionStore';
import { formatDistanceKm } from '@/shared/utils/format';

export { requestPloggingLocationPermissions } from '@/features/plogging/background/ploggingPermissions';
export {
  openAppSettings,
  ploggingPermissionDeniedMessage,
} from '@/features/plogging/background/ploggingPermissions';

async function syncPersistedSession(session: PersistedPloggingSession): Promise<void> {
  await persistPloggingSession({
    ...session,
    liveActivityId: getPloggingLiveActivityId(),
  });
}

function buildLocationTaskOptions(): Location.LocationTaskOptions {
  const { liveDistanceKm } = usePloggingSessionStore.getState();
  const distanceLabel = formatDistanceKm(liveDistanceKm);

  return {
    accuracy: Location.Accuracy.High,
    distanceInterval: 5,
    timeInterval: 5000,
    pausesUpdatesAutomatically: false,
    showsBackgroundLocationIndicator: Platform.OS === 'ios',
    foregroundService: {
      notificationTitle: 'ByB 플로깅',
      notificationBody: `경로 기록 중 · ${distanceLabel}`,
      notificationColor: '#2E7D32',
      killServiceOnDestroy: false,
    },
  };
}

export async function startPloggingBackgroundTracking(): Promise<boolean> {
  const session = usePloggingSessionStore.getState().session;
  if (!session) return false;

  const granted = await requestPloggingLocationPermissions();
  if (!granted) return false;

  if (!getPloggingLiveActivityId()) {
    const id = startPloggingLiveActivity(session.courseName, session.startedAt);
    setPloggingLiveActivityId(id);
  }

  const backgroundNative = await isPloggingBackgroundNativeAvailable();
  const taskRegistered = ensurePloggingLocationTaskRegistered();

  if (!backgroundNative || !taskRegistered) {
    if (Platform.OS === 'android') {
      console.warn(
        '[plogging] Android 백그라운드 추적 불가 — 개발 빌드(expo run:android) 필요',
      );
      return false;
    }
    return startPloggingForegroundTracking();
  }

  stopPloggingForegroundTracking();

  try {
    const alreadyRunning = await Location.hasStartedLocationUpdatesAsync(
      PLOGGING_LOCATION_TASK,
    );
    if (alreadyRunning) {
      await Location.stopLocationUpdatesAsync(PLOGGING_LOCATION_TASK);
    }

    await Location.startLocationUpdatesAsync(
      PLOGGING_LOCATION_TASK,
      buildLocationTaskOptions(),
    );
  } catch (error) {
    console.warn('[plogging] startLocationUpdatesAsync failed', error);
    if (Platform.OS === 'android') return false;
    return startPloggingForegroundTracking();
  }

  await syncPersistedSession(session);
  return true;
}

/** 거리 갱신 시 Android 알림 문구 반영 (다음 GPS 주기에 맞춰 재시작) */
export async function refreshPloggingBackgroundNotification(): Promise<void> {
  if (Platform.OS !== 'android') return;

  const session = usePloggingSessionStore.getState().session;
  if (!session) return;

  const native = await isPloggingBackgroundNativeAvailable();
  if (!native || !ensurePloggingLocationTaskRegistered()) return;

  try {
    const running = await Location.hasStartedLocationUpdatesAsync(
      PLOGGING_LOCATION_TASK,
    );
    if (!running) return;

    await Location.stopLocationUpdatesAsync(PLOGGING_LOCATION_TASK);
    await Location.startLocationUpdatesAsync(
      PLOGGING_LOCATION_TASK,
      buildLocationTaskOptions(),
    );
  } catch {
    // ignore
  }
}

export async function stopPloggingBackgroundTracking(): Promise<void> {
  stopPloggingForegroundTracking();
  stopPloggingLiveActivity();
  setPloggingLiveActivityId(undefined);

  try {
    const backgroundNative = await isPloggingBackgroundNativeAvailable();
    if (backgroundNative) {
      const started = await Location.hasStartedLocationUpdatesAsync(
        PLOGGING_LOCATION_TASK,
      );
      if (started) {
        await Location.stopLocationUpdatesAsync(PLOGGING_LOCATION_TASK);
      }
    }
  } catch {
    // Expo Go
  }

  await persistPloggingSession(null);
}
