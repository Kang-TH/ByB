import type * as Location from 'expo-location';
import {
  persistPloggingSession,
} from '@/features/plogging/background/ploggingSessionPersistence';
import {
  getPloggingLiveActivityId,
  updatePloggingLiveActivity,
} from '@/features/plogging/background/ploggingLiveActivity';
import { usePloggingSessionStore } from '@/features/plogging/store/ploggingSessionStore';
import type { RoutePoint } from '@/types/course';

function toRoutePoint(loc: Location.LocationObject): RoutePoint {
  return { lat: loc.coords.latitude, lng: loc.coords.longitude };
}

export async function applyPloggingLocationUpdate(
  locations: Location.LocationObject[],
): Promise<void> {
  const store = usePloggingSessionStore.getState();
  if (!store.session) return;

  for (const loc of locations) {
    store.appendGpsPoint(toRoutePoint(loc));
  }

  const { session, liveDistanceKm } = usePloggingSessionStore.getState();
  if (!session) return;

  updatePloggingLiveActivity(liveDistanceKm, session.courseName, session.startedAt);
  // AsyncStorage 쓰기는 과도하면 렌더 부담 — 세션 메타만 가끔 저장
  if (session.trackedPoints.length % 5 === 0) {
    await persistPloggingSession({
      ...session,
      liveActivityId: getPloggingLiveActivityId(),
    });
  }
}
