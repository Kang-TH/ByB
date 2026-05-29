import * as Location from 'expo-location';
import type { RoutePoint } from '@/types/course';

export async function requestForegroundLocationPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status;
}

export async function getForegroundLocationPermission() {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status;
}

function locationToRoutePoint(loc: Location.LocationObject): RoutePoint {
  return { lat: loc.coords.latitude, lng: loc.coords.longitude };
}

/** 권한이 이미 granted일 때 1회 현재 위치 스냅샷 */
export async function getCurrentPositionOnce(): Promise<RoutePoint> {
  const loc = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return locationToRoutePoint(loc);
}

/**
 * 지도 초기 카메라용 — 캐시된 위치를 먼저 쓰고, 이어서 GPS로 보정합니다.
 * 권한 거부·실패 시 null.
 */
export async function getQuickCurrentPosition(): Promise<RoutePoint | null> {
  const status = await requestForegroundLocationPermission();
  if (status !== 'granted') return null;

  try {
    const last = await Location.getLastKnownPositionAsync();
    if (last) return locationToRoutePoint(last);
  } catch {
    // ignore
  }

  try {
    return await getCurrentPositionOnce();
  } catch {
    return null;
  }
}
