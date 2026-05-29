import * as Location from 'expo-location';
import { applyPloggingLocationUpdate } from '@/features/plogging/background/ploggingGpsUpdate';

let watchSubscription: Location.LocationSubscription | null = null;

/** Expo Go 등 — 백그라운드 TaskManager 없을 때 앱 사용 중에만 GPS 기록 */
export async function startPloggingForegroundTracking(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return false;

  if (watchSubscription) return true;

  try {
    const last = await Location.getLastKnownPositionAsync();
    if (last) {
      await applyPloggingLocationUpdate([last]);
    }
  } catch {
    // ignore
  }

  try {
    const initial = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    await applyPloggingLocationUpdate([initial]);
  } catch {
    // ignore
  }

  watchSubscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      distanceInterval: 5,
    },
    (loc) => {
      void applyPloggingLocationUpdate([loc]);
    },
  );

  return true;
}

export function stopPloggingForegroundTracking(): void {
  watchSubscription?.remove();
  watchSubscription = null;
}
