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

/** 권한이 이미 granted일 때 1회 현재 위치 스냅샷 */
export async function getCurrentPositionOnce(): Promise<RoutePoint> {
  const loc = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return {
    lat: loc.coords.latitude,
    lng: loc.coords.longitude,
  };
}
