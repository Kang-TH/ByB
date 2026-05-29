import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  resetRootToMain,
  resetRootToMainWithPlogging,
} from '@/app/navigation/navigationActions';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type {
  HomeStackParamList,
  MainTabParamList,
  RootStackParamList,
} from '@/app/navigation/types';
import { useAuth } from '@/app/providers/AuthProvider';
import { HomeHeader } from '@/features/home/components/HomeHeader';
import { WeeklySummaryCard } from '@/features/home/components/WeeklySummaryCard';
import { RecommendedCoursesSection } from '@/features/home/components/RecommendedCoursesSection';
import { usePublicCourses } from '@/features/course/hooks/usePublicCourses';
import { useHome } from '@/features/home/hooks/useHome';
import { createFallbackHome } from '@/features/home/utils/homeFallback';
import { useCourseCacheStore } from '@/features/course/store/courseCacheStore';
import { getApiErrorMessage } from '@/shared/api/errors';
import { EMPTY_COURSE_LIST } from '@/shared/constants/empty';
import { colors, spacing } from '@/shared/constants/theme';

type HomeNav = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'Home'>,
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList>,
    NativeStackNavigationProp<RootStackParamList>
  >
>;

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HomeNav>();
  const { userId, nickname } = useAuth();
  const upsertCourses = useCourseCacheStore((s) => s.upsertCourses);
  const { data, isPending, isRefetching, refetch, isError, error } = useHome();
  const { data: publicCoursesData } = usePublicCourses();
  const publicCourses = publicCoursesData ?? EMPTY_COURSE_LIST;

  const home = useMemo(() => {
    if (data) return data;
    if (isError) return createFallbackHome(nickname ?? '사용자');
    return undefined;
  }, [data, isError, nickname]);

  const publicCourseIds = useMemo(
    () => publicCourses.map((c) => c.courseId).join(','),
    [publicCourses],
  );

  useEffect(() => {
    if (publicCourses.length === 0) return;
    upsertCourses(publicCourses);
  }, [publicCourseIds, upsertCourses]);

  const startPlogging = () => {
    navigation.dispatch(
      resetRootToMainWithPlogging(undefined, { activeTab: 'HomeTab' }),
    );
  };

  const goRecommendTab = () => {
    navigation.dispatch(
      resetRootToMain({ activeTab: 'RecommendTab' }),
    );
  };

  const goCourseDetail = (courseId: number) => {
    navigation.dispatch(
      resetRootToMain({
        activeTab: 'RecommendTab',
        stack: [
          { name: 'RecommendList' },
          { name: 'CourseDetail', params: { courseId } },
        ],
      }),
    );
  };

  if (isPending && !home) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!home) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.offlineHint}>홈 정보를 불러오지 못했습니다.</Text>
      </View>
    );
  }

  const displayName = home.nickname || 'Nick';

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + spacing.lg,
          paddingBottom: insets.bottom + spacing.xl,
        },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={colors.primary}
        />
      }
    >
      <HomeHeader nickname={displayName} />

      <WeeklySummaryCard summary={home.weeklySummary} />

      <Pressable
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        onPress={startPlogging}
      >
        <Text style={styles.ctaText}>플로깅 시작하기</Text>
      </Pressable>

      {isError && userId != null ? (
        <Text style={styles.offlineHint}>
          이번 주 활동 요약을 불러오지 못했습니다. ({getApiErrorMessage(error)})
        </Text>
      ) : null}

      <RecommendedCoursesSection
        courses={publicCourses}
        onPressMore={goRecommendTab}
        onPressCourse={goCourseDetail}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  cta: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 4,
    borderRadius: 999,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  ctaPressed: {
    opacity: 0.92,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  offlineHint: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
    marginTop: -spacing.md,
  },
});
