import * as Location from 'expo-location';
import { Linking, PermissionsAndroid, Platform } from 'react-native';
import { isPloggingBackgroundNativeAvailable } from '@/features/plogging/background/ploggingNativeModules';

/** Android 13+ 포그라운드 서비스 알림 표시 */
async function requestAndroidNotificationPermission(): Promise<void> {
  if (Platform.OS !== 'android' || Platform.Version < 33) return;

  try {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted) return;

    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  } catch {
    // ignore
  }
}

export async function requestPloggingLocationPermissions(): Promise<boolean> {
  const { status: foreground } =
    await Location.requestForegroundPermissionsAsync();
  if (foreground !== 'granted') return false;

  const backgroundNative = await isPloggingBackgroundNativeAvailable();
  if (!backgroundNative) {
    return true;
  }

  if (Platform.OS === 'android') {
    await requestAndroidNotificationPermission();
  }

  const { status: background } =
    await Location.requestBackgroundPermissionsAsync();
  return background === 'granted';
}

export function ploggingPermissionDeniedMessage(): string {
  if (Platform.OS === 'android') {
    return (
      '플로깅 중에도 경로를 기록하려면 위치 권한을 「항상 허용」으로 설정해 주세요.\n' +
      '설정 → 앱 → ByB → 권한 → 위치'
    );
  }
  return '플로깅 기록을 위해 백그라운드 위치 권한을 허용해 주세요.';
}

export async function openAppSettings(): Promise<void> {
  await Linking.openSettings();
}
