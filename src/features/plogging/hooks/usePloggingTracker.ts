import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { usePloggingSessionStore } from '@/features/plogging/store/ploggingSessionStore';

/**
 * 플로깅 중 GPS 추적 및 경과 시간 타이머
 */
export function usePloggingTracker(enabled: boolean) {
  const appendGpsPoint = usePloggingSessionStore((s) => s.appendGpsPoint);
  const tick = usePloggingSessionStore((s) => s.tick);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
        },
        (loc) => {
          appendGpsPoint({
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
          });
        },
      );
    })();

    timerRef.current = setInterval(tick, 1000);

    return () => {
      subscription?.remove();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled, appendGpsPoint, tick]);
}
