import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  resetRootToMain,
} from '@/app/navigation/navigationActions';
import type { RootStackParamList } from '@/app/navigation/types';
import { useAuth } from '@/app/providers/AuthProvider';
import { completePlogging } from '@/features/plogging/api/ploggingApi';
import { usePloggingSessionStore } from '@/features/plogging/store/ploggingSessionStore';
import { queryKeys } from '@/shared/api/queryKeys';
import { PrimaryButton } from '@/shared/components';
import { formatDistance, formatDuration } from '@/shared/utils/format';
import { colors, spacing } from '@/shared/constants/theme';
import { useQueryClient } from '@tanstack/react-query';

export function PloggingCompleteScreen() {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const session = usePloggingSessionStore((s) => s.session);
  const trashDraft = usePloggingSessionStore((s) => s.trashDraft);
  const elapsedSeconds = usePloggingSessionStore((s) => s.elapsedSeconds);
  const liveDistanceKm = usePloggingSessionStore((s) => s.liveDistanceKm);
  const clearSession = usePloggingSessionStore((s) => s.clearSession);

  const hasCourse = session?.courseId != null;
  const courseName = session?.courseName ?? '미지정';
  const trashAmount = trashDraft?.displayAmount ?? '-';

  const persistOnce = async () => {
    if (!session || userId == null) return;
    await completePlogging({
      userId,
      ploggingId: session.ploggingId,
      mode: session.mode,
      courseId: session.courseId,
      startedAt: session.startedAt,
      distance: liveDistanceKm,
      durationSeconds: elapsedSeconds,
      trashBagType: trashDraft?.bagType,
      trashAmountValue: trashDraft?.trashAmountValue,
      trashAmountUnit: trashDraft?.trashAmountUnit,
    });

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.plogging.home }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.profile.detail(userId),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.plogging.history(userId),
      }),
    ]);
  };

  const goHome = async () => {
    await persistOnce();
    clearSession();
    navigation.dispatch(resetRootToMain({ activeTab: 'HomeTab' }));
  };

  const goWriteReview = async () => {
    if (!session?.courseId) return;
    await persistOnce();
    const courseId = session.courseId;
    clearSession();
    navigation.dispatch(
      resetRootToMain({
        activeTab: 'RecommendTab',
        stack: [
          { name: 'RecommendList' },
          { name: 'ReviewWrite', params: { courseId } },
        ],
      }),
    );
  };

  const goCreateCourse = async () => {
    await persistOnce();
    clearSession();
    navigation.dispatch(
      resetRootToMain({
        activeTab: 'MyCourseTab',
        stack: [
          { name: 'MyCourseList' },
          { name: 'CourseCreateStep1' },
        ],
      }),
    );
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + spacing.xl,
          paddingBottom: insets.bottom + spacing.lg,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>플로깅 완료!</Text>
      <Text style={styles.subtitle}>
        오늘도 지구를 깨끗하게{'\n'}만들어주셔서 감사합니다
      </Text>

      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={48} color={colors.border} />
      </View>

      <View style={styles.summaryCard}>
        <SummaryRow
          icon="map-outline"
          label="코스"
          value={courseName}
        />
        <SummaryRow
          icon="navigate-outline"
          label="거리"
          value={formatDistance(liveDistanceKm).replace(' ', '')}
        />
        <SummaryRow
          icon="time-outline"
          label="시간"
          value={formatDuration(elapsedSeconds)}
        />
        <SummaryRow
          icon="trash-outline"
          label="수거량"
          value={trashAmount}
        />
      </View>

      <View style={styles.actions}>
        {hasCourse ? (
          <>
            <PrimaryButton
              label="코스 후기 작성하기"
              onPress={goWriteReview}
            />
            <PrimaryButton label="홈으로" onPress={goHome} variant="dark" />
          </>
        ) : (
          <>
            <PrimaryButton
              label="이 경로로 새로운 코스 만들기"
              onPress={goCreateCourse}
            />
            <PrimaryButton label="홈으로" onPress={goHome} variant="dark" />
          </>
        )}
      </View>
    </ScrollView>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryLeft}>
        <Ionicons name={icon} size={18} color={colors.textSecondary} />
        <Text style={styles.summaryLabel}>{label}</Text>
      </View>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  mapPlaceholder: {
    height: 160,
    backgroundColor: colors.surface,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryLabel: { fontSize: 14, color: colors.textSecondary },
  summaryValue: { fontSize: 15, fontWeight: '700', color: colors.text },
  actions: { gap: spacing.sm },
});
