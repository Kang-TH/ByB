import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import {
  NaverMapMarkerOverlay,
  NaverMapPolylineOverlay,
  NaverMapView,
  type Camera,
} from '@mj-studio/react-native-naver-map';
import type { RoutePoint } from '@/types/course';
import { getQuickCurrentPosition } from '@/shared/location/locationService';
import { colors } from '@/shared/constants/theme';
import {
  NAVER_MAP_MARKER_CAPTION,
  NAVER_MAP_MARKER_SIZE,
} from '@/shared/map/naverMapMarker';
import { haversineKm } from '@/shared/utils/geo';

const FALLBACK_CAMERA: Camera = {
  latitude: 37.5665,
  longitude: 126.978,
  zoom: 14,
};

const CAMERA_FOLLOW_MIN_KM = 0.02;

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

function toCamera(point: RoutePoint, zoom = 16): Camera {
  return { latitude: point.lat, longitude: point.lng, zoom };
}

export function PloggingMap({
  trackedPoints,
  routePoints,
}: {
  trackedPoints: RoutePoint[];
  routePoints?: RoutePoint[];
}) {
  const current = trackedPoints.length > 0 ? trackedPoints[trackedPoints.length - 1] : null;
  const [camera, setCamera] = useState<Camera | null>(null);
  const lastFollowedRef = useRef<RoutePoint | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const position = await getQuickCurrentPosition();
      if (cancelled) return;
      setCamera(position ? toCamera(position) : FALLBACK_CAMERA);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const passedCoords = useMemo(() => toNaverCoords(trackedPoints), [trackedPoints]);

  const remainingCoords = useMemo(() => {
    if (!routePoints?.length || !current) return [];
    const idx = findClosestRouteIndex(routePoints, current);
    return toNaverCoords(routePoints.slice(idx));
  }, [routePoints, current]);

  useEffect(() => {
    if (!current) return;

    const lastFollowed = lastFollowedRef.current;
    if (
      lastFollowed &&
      haversineKm(lastFollowed, current) < CAMERA_FOLLOW_MIN_KM
    ) {
      return;
    }

    lastFollowedRef.current = current;
    setCamera(toCamera(current));
  }, [current?.lat, current?.lng]);

  if (camera == null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NaverMapView
      style={{ flex: 1 }}
      initialCamera={camera}
      camera={camera}
      animationDuration={300}
      isShowLocationButton={false}
      isShowCompass
    >
      {passedCoords.length >= 2 ? (
        <NaverMapPolylineOverlay
          coords={passedCoords}
          width={6}
          color="#16A34A"
          zIndex={20}
        />
      ) : null}

      {remainingCoords.length >= 2 ? (
        <NaverMapPolylineOverlay
          coords={remainingCoords}
          width={6}
          color="#FACC15"
          zIndex={10}
        />
      ) : null}

      {current ? (
        <NaverMapMarkerOverlay
          latitude={current.lat}
          longitude={current.lng}
          width={NAVER_MAP_MARKER_SIZE.width}
          height={NAVER_MAP_MARKER_SIZE.height}
          image={{ symbol: 'green' }}
          anchor={{ x: 0.5, y: 1 }}
          caption={{
            text: '나',
            textSize: NAVER_MAP_MARKER_CAPTION.textSize,
            offset: NAVER_MAP_MARKER_CAPTION.offset,
          }}
          zIndex={30}
        />
      ) : null}
    </NaverMapView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
});
