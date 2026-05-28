import { useMemo, useRef } from 'react';
import {
  NaverMapMarkerOverlay,
  NaverMapPolylineOverlay,
  NaverMapView,
  type NaverMapViewRef,
} from '@mj-studio/react-native-naver-map';
import type { RoutePoint } from '@/types/course';
import { haversineKm } from '@/shared/utils/geo';

function toNaverCoords(points: RoutePoint[]) {
  return points.map((p) => ({ latitude: p.lat, longitude: p.lng }));
}

function findClosestRouteIndex(route: RoutePoint[], current: RoutePoint): number {
  let minIdx = 0;
  let minDist = Number.POSITIVE_INFINITY;
  for (let i = 0; i < route.length; i += 1) {
    const d = haversineKm(route[i], current);
    if (d < minDist) {
      minDist = d;
      minIdx = i;
    }
  }
  return minIdx;
}

export function PloggingMap({
  trackedPoints,
  routePoints,
}: {
  trackedPoints: RoutePoint[];
  routePoints?: RoutePoint[];
}) {
  const mapRef = useRef<NaverMapViewRef>(null);
  const current = trackedPoints.length > 0 ? trackedPoints[trackedPoints.length - 1] : null;

  const passedCoords = useMemo(() => toNaverCoords(trackedPoints), [trackedPoints]);

  const remainingCoords = useMemo(() => {
    if (!routePoints?.length || !current) return [];
    const idx = findClosestRouteIndex(routePoints, current);
    return toNaverCoords(routePoints.slice(idx));
  }, [routePoints, current]);

  const initialCamera = useMemo(() => {
    const fallback = { latitude: 37.5665, longitude: 126.9780, zoom: 14 };
    if (!current) return fallback;
    return { latitude: current.lat, longitude: current.lng, zoom: 16 };
  }, [current]);

  return (
    <NaverMapView
      ref={mapRef}
      style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}
      initialCamera={initialCamera}
      isShowLocationButton={false}
      isShowCompass
    >
      {/* 지나온 길: 항상 초록색 */}
      {passedCoords.length >= 2 ? (
        <NaverMapPolylineOverlay
          coords={passedCoords}
          width={6}
          color="#16A34A"
          zIndex={20}
        />
      ) : null}

      {/* 코스 남은 길: 코스 모드에서만 노란색 */}
      {remainingCoords.length >= 2 ? (
        <NaverMapPolylineOverlay
          coords={remainingCoords}
          width={6}
          color="#FACC15"
          zIndex={10}
        />
      ) : null}

      {/* 현재 위치 마커 */}
      {current ? (
        <NaverMapMarkerOverlay
          latitude={current.lat}
          longitude={current.lng}
          image={{ symbol: 'green' }}
          anchor={{ x: 0.5, y: 1 }}
          caption={{ text: '나' }}
          zIndex={30}
        />
      ) : null}
    </NaverMapView>
  );
}

