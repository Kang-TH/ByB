import { useEffect, useRef } from 'react';
import { Alert, BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { PloggingStackParamList } from '@/app/navigation/types';
import {
  openAppSettings,
  ploggingPermissionDeniedMessage,
  startPloggingBackgroundTracking,
} from '@/features/plogging/background/ploggingTracking';
import { usePloggingSessionStore } from '@/features/plogging/store/ploggingSessionStore';
import { useAuth } from '@/app/providers/AuthProvider';
import {
  startCoursePlogging,
  startFreePlogging,
} from '@/features/plogging/api/ploggingApi';
import { formatDistance, formatDuration } from '@/shared/utils/format';
import { colors, spacing } from '@/shared/constants/theme';
import { PloggingMap } from '@/features/plogging/components/PloggingMap';

export function PloggingActiveScreen() {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<PloggingStackParamList>>();
  const route = useRoute<RouteProp<PloggingStackParamList, 'PloggingActive'>>();
  const session = usePloggingSessionStore((s) => s.session);
  const elapsedSeconds = usePloggingSessionStore((s) => s.elapsedSeconds);
  const liveDistanceKm = usePloggingSessionStore((s) => s.liveDistanceKm);
  const navigationRef = useRef(navigation);
  navigationRef.current = navigation;

  const courseId = route.params?.courseId;
  const { userId } = useAuth();

  useEffect(() => {
    if (userId == null) return;

    let cancelled = false;
    const { clearSession, startSession } = usePloggingSessionStore.getState();
    clearSession();

    void (async () => {
      try {
        const response =
          courseId != null
            ? await startCoursePlogging(courseId, userId)
            : await startFreePlogging(userId);

        if (cancelled) return;

        startSession(
          {
            ploggingId: response.ploggingId,
            courseId: response.courseId ?? courseId,
            courseName: response.courseName,
            mode: courseId != null ? 'COURSE' : 'FREE',
            status: response.status,
            startedAt: response.startedAt,
            routePoints: response.routePoints,
          },
          courseId != null ? 'COURSE' : 'FREE',
        );

        const trackingOk = await startPloggingBackgroundTracking();
        if (cancelled) return;

        if (!trackingOk) {
          usePloggingSessionStore.getState().clearSession();
          Alert.alert('위치 권한 필요', ploggingPermissionDeniedMessage(), [
            { text: '취소', style: 'cancel', onPress: () => navigationRef.current.goBack() },
            { text: '설정 열기', onPress: () => void openAppSettings() },
          ]);
        }
      } catch {
        if (!cancelled) navigationRef.current.goBack();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courseId, userId]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.mapWrap}>
        <PloggingMap
          trackedPoints={session?.trackedPoints ?? []}
          routePoints={session?.routePoints}
        />
      </View>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.md) },
        ]}
      >
        {courseId != null && (
          <Text style={styles.meta} numberOfLines={1}>
            {session?.courseName ?? `코스 #${courseId}`}
          </Text>
        )}
        <View style={styles.statsRow}>
          <Text style={styles.stat}>시간 {formatDuration(elapsedSeconds)}</Text>
          <Text style={styles.stat}>거리 {formatDistance(liveDistanceKm)}</Text>
        </View>
        <Pressable
          style={styles.end}
          onPress={() => navigation.navigate('TrashBagSelect')}
        >
          <Text style={styles.endText}>종료하기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapWrap: {
    flex: 1,
    minHeight: 200,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  meta: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  stat: { fontSize: 16, fontWeight: '600', flex: 1 },
  end: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  endText: { color: '#fff', fontWeight: '700' },
});
