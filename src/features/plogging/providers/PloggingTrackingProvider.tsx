import { useEffect, useRef, type ReactNode } from 'react';
import { AppState, Platform } from 'react-native';
import { refreshPloggingBackgroundNotification } from '@/features/plogging/background/ploggingTracking';
import { updatePloggingLiveActivity } from '@/features/plogging/background/ploggingLiveActivity';
import { usePloggingSessionStore } from '@/features/plogging/store/ploggingSessionStore';

/** 플로깅 중 경과 시간·Live Activity(다이나믹 아일랜드) UI 동기화 */
export function PloggingTrackingProvider({ children }: { children: ReactNode }) {
  const ploggingId = usePloggingSessionStore((s) => s.session?.ploggingId);
  const lastNotifiedKmRef = useRef(0);

  useEffect(() => {
    if (ploggingId == null) {
      lastNotifiedKmRef.current = 0;
      return;
    }

    const syncElapsedFromClock =
      usePloggingSessionStore.getState().syncElapsedFromClock;
    syncElapsedFromClock();

    const timer = setInterval(() => {
      const state = usePloggingSessionStore.getState();
      if (!state.session) return;
      state.syncElapsedFromClock();
      updatePloggingLiveActivity(
        state.liveDistanceKm,
        state.session.courseName,
        state.session.startedAt,
      );

      if (
        Platform.OS === 'android' &&
        Math.abs(state.liveDistanceKm - lastNotifiedKmRef.current) >= 0.1
      ) {
        lastNotifiedKmRef.current = state.liveDistanceKm;
        void refreshPloggingBackgroundNotification();
      }
    }, 1000);

    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        usePloggingSessionStore.getState().syncElapsedFromClock();
      }
    });

    return () => {
      clearInterval(timer);
      sub.remove();
    };
  }, [ploggingId]);

  return children;
}
