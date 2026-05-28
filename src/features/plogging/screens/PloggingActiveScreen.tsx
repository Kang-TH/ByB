import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { PloggingStackParamList } from '@/app/navigation/types';
import { usePloggingTracker } from '@/features/plogging/hooks/usePloggingTracker';
import { usePloggingSessionStore } from '@/features/plogging/store/ploggingSessionStore';
import { useAuth } from '@/app/providers/AuthProvider';
import { fetchCourseDetail } from '@/features/course/api/courseApi';
import { formatDistance, formatDuration } from '@/shared/utils/format';
import { colors, spacing } from '@/shared/constants/theme';
import { PloggingMap } from '@/features/plogging/components/PloggingMap';

export function PloggingActiveScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<PloggingStackParamList>>();
  const route = useRoute<RouteProp<PloggingStackParamList, 'PloggingActive'>>();
  const session = usePloggingSessionStore((s) => s.session);
  const startSession = usePloggingSessionStore((s) => s.startSession);
  const clearSession = usePloggingSessionStore((s) => s.clearSession);
  const elapsedSeconds = usePloggingSessionStore((s) => s.elapsedSeconds);
  const liveDistanceKm = usePloggingSessionStore((s) => s.liveDistanceKm);

  const courseId = route.params?.courseId;
  const isFocused = useIsFocused();
  const { userId } = useAuth();

  useEffect(() => {
    clearSession();

    void (async () => {
      let courseName: string | undefined;
      if (courseId != null && userId != null) {
        const detail = await fetchCourseDetail(courseId, userId);
        courseName = detail.title;
      }
      startSession(
        {
          ploggingId: Date.now(),
          courseId,
          courseName,
          mode: courseId != null ? 'COURSE' : 'FREE',
          status: 'IN_PROGRESS',
          startedAt: new Date().toISOString(),
          routePoints: undefined,
        },
        courseId != null ? 'COURSE' : 'FREE',
      );
    })();
  }, [courseId, userId, startSession, clearSession]);

  usePloggingTracker(isFocused);

  return (
    <View style={styles.container}>
      <View style={styles.mapWrap}>
        <PloggingMap
          trackedPoints={session?.trackedPoints ?? []}
          routePoints={session?.routePoints}
        />
      </View>
      {courseId != null && (
        <Text style={styles.meta}>
          {session?.courseName ?? `코스 #${courseId}`}
        </Text>
      )}
      <Text style={styles.stat}>시간 {formatDuration(elapsedSeconds)}</Text>
      <Text style={styles.stat}>거리 {formatDistance(liveDistanceKm)}</Text>
      <Pressable
        style={styles.end}
        onPress={() => navigation.navigate('TrashBagSelect')}
      >
        <Text style={styles.endText}>종료하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  mapWrap: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  meta: { marginTop: spacing.md, color: colors.textSecondary, fontWeight: '600' },
  stat: { fontSize: 24, fontWeight: '700', marginTop: spacing.md },
  end: {
    marginTop: spacing.lg,
    backgroundColor: colors.error,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  endText: { color: '#fff', fontWeight: '700' },
});
