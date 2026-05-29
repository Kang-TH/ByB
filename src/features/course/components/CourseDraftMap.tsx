import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  NaverMapMarkerOverlay,
  NaverMapPolylineOverlay,
  NaverMapView,
  type Camera,
} from '@mj-studio/react-native-naver-map';
import type { RoutePoint } from '@/types/course';
import { getCurrentPositionOnce } from '@/shared/location/locationService';
import { colors, spacing } from '@/shared/constants/theme';
import {
  NAVER_MAP_MARKER_CAPTION,
  NAVER_MAP_MARKER_SIZE,
} from '@/shared/map/naverMapMarker';

const DEFAULT_CAMERA: Camera = {
  latitude: 37.5665,
  longitude: 126.978,
  zoom: 14,
};

function toCoords(points: RoutePoint[]) {
  return points.map((p) => ({ latitude: p.lat, longitude: p.lng }));
}

function boundsCamera(points: RoutePoint[]): Camera | null {
  if (points.length === 0) return null;
  if (points.length === 1) {
    return { latitude: points[0].lat, longitude: points[0].lng, zoom: 16 };
  }

  let minLat = points[0].lat;
  let maxLat = points[0].lat;
  let minLng = points[0].lng;
  let maxLng = points[0].lng;

  for (const p of points) {
    minLat = Math.min(minLat, p.lat);
    maxLat = Math.max(maxLat, p.lat);
    minLng = Math.min(minLng, p.lng);
    maxLng = Math.max(maxLng, p.lng);
  }

  const latDelta = Math.max((maxLat - minLat) * 1.4, 0.002);
  const lngDelta = Math.max((maxLng - minLng) * 1.4, 0.002);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    zoom: Math.min(
      16,
      Math.max(12, 14 - Math.log10(Math.max(latDelta, lngDelta) * 100)),
    ),
  };
}

export function CourseDraftMap({
  routePoints,
  interactive = false,
  onAddPoint,
}: {
  routePoints: RoutePoint[];
  interactive?: boolean;
  onAddPoint?: (point: RoutePoint) => void;
}) {
  const [camera, setCamera] = useState<Camera>(DEFAULT_CAMERA);

  const lineCoords = useMemo(() => toCoords(routePoints), [routePoints]);

  useEffect(() => {
    if (routePoints.length > 0) {
      const next = boundsCamera(routePoints);
      if (next) setCamera(next);
      return;
    }

    void getCurrentPositionOnce()
      .then((p) => {
        setCamera({ latitude: p.lat, longitude: p.lng, zoom: 16 });
      })
      .catch(() => {
        setCamera(DEFAULT_CAMERA);
      });
  }, [routePoints.length, routePoints[0]?.lat, routePoints[0]?.lng]);

  return (
    <View style={styles.wrap}>
      <NaverMapView
        style={styles.map}
        initialCamera={DEFAULT_CAMERA}
        camera={camera}
        animationDuration={300}
        isShowLocationButton={interactive}
        isShowCompass={false}
        onTapMap={
          interactive && onAddPoint
            ? ({ latitude, longitude }) => {
                onAddPoint({ lat: latitude, lng: longitude });
              }
            : undefined
        }
      >
        {lineCoords.length >= 2 ? (
          <NaverMapPolylineOverlay
            coords={lineCoords}
            width={5}
            color={colors.primary}
            zIndex={10}
          />
        ) : null}

        {routePoints.map((point, index) => (
          <NaverMapMarkerOverlay
            key={`${point.lat}-${point.lng}-${index}`}
            latitude={point.lat}
            longitude={point.lng}
            width={NAVER_MAP_MARKER_SIZE.width}
            height={NAVER_MAP_MARKER_SIZE.height}
            anchor={{ x: 0.5, y: 1 }}
            caption={{
              text: String(index + 1),
              textSize: NAVER_MAP_MARKER_CAPTION.textSize,
              offset: NAVER_MAP_MARKER_CAPTION.offset,
            }}
            zIndex={20 + index}
          />
        ))}
      </NaverMapView>

      {interactive ? (
        <View style={styles.hint} pointerEvents="none">
          <Text style={styles.hintText}>지도를 탭해 경유지를 추가하세요</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  map: { flex: 1 },
  hint: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  hintText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
});
