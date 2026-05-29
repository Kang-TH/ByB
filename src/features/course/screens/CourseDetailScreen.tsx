import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type {
  MainTabParamList,
  RecommendStackParamList,
  RootStackParamList,
} from '@/app/navigation/types';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CourseReviewSection } from '@/features/review/components/CourseReviewSection';
import { resetRootToMainWithPlogging } from '@/app/navigation/navigationActions';
import { CourseAreaSubtitle } from '@/features/course/components/CourseAreaSubtitle';
import { CourseDraftMap } from '@/features/course/components/CourseDraftMap';
import {
  getCourseDetailOrPlaceholder,
  useCourseDetail,
} from '@/features/course/hooks/useCourseDetail';
import { useCourseCacheStore } from '@/features/course/store/courseCacheStore';
import { useFavorite } from '@/features/favorite/hooks/useFavorite';
import { useToggleFavorite } from '@/features/favorite/hooks/useToggleFavorite';
import { BookmarkButton, Card, PrimaryButton } from '@/shared/components';
import { colors, spacing } from '@/shared/constants/theme';

type Props = NativeStackScreenProps<RecommendStackParamList, 'CourseDetail'>;

type CourseDetailNav = CompositeNavigationProp<
  NativeStackNavigationProp<RecommendStackParamList, 'CourseDetail'>,
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList>,
    NativeStackNavigationProp<RootStackParamList>
  >
>;

export function CourseDetailScreen({ route }: Props) {
  const navigation = useNavigation<CourseDetailNav>();
  const courseId = route.params.courseId;
  const { data } = useCourseDetail(courseId);
  const course = getCourseDetailOrPlaceholder(data, courseId);
  const upsertCourse = useCourseCacheStore((s) => s.upsertCourse);
  const favorite = useFavorite(courseId, course.isFavorite);
  const toggleFavorite = useToggleFavorite(course);

  useEffect(() => {
    if (data) upsertCourse(data);
  }, [data, upsertCourse]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        {course.routePoints && course.routePoints.length > 0 ? (
          <CourseDraftMap routePoints={course.routePoints} />
        ) : (
          <Text style={styles.heroText}>경로 정보 없음</Text>
        )}
      </View>

      <View style={styles.titleRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{course.title}</Text>
          <CourseAreaSubtitle
            areaName={course.areaName}
            routePoints={course.routePoints}
          />
        </View>
        <View style={styles.bookmark}>
          <BookmarkButton
            isFavorite={favorite.isFavorite}
            onPress={toggleFavorite.toggle}
          />
        </View>
      </View>

      <Card>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>거리</Text>
            <Text style={styles.statValue}>{course.distance.toFixed(1)} km</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statLabel}>소요시간</Text>
            <Text style={styles.statValue}>{course.estimatedTime ?? 0} 분</Text>
          </View>
        </View>
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>코스 소개</Text>
        <Text style={styles.description}>{course.description}</Text>
      </View>

      <CourseReviewSection
        courseId={course.courseId}
        courseName={course.title}
        onPressMore={() =>
          navigation.navigate('ReviewList', {
            courseId: course.courseId,
            courseName: course.title,
            source: 'recommend',
          })
        }
      />

      <View style={styles.footer}>
        <PrimaryButton
          label="이 코스로 플로깅 시작하기"
          onPress={() =>
            navigation.dispatch(
              resetRootToMainWithPlogging(
                { courseId },
                {
                  activeTab: 'RecommendTab',
                  stack: [
                    { name: 'RecommendList' },
                    { name: 'CourseDetail', params: { courseId } },
                  ],
                },
              ),
            )
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  hero: {
    height: 220,
    borderRadius: 16,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  heroText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.textSecondary,
    fontWeight: '700',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  bookmark: { padding: spacing.sm },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  divider: { width: 1, height: 44, backgroundColor: colors.border },
  stat: { flex: 1, alignItems: 'center' },
  statLabel: { color: colors.textSecondary, fontSize: 13, marginBottom: 6 },
  statValue: { fontSize: 16, fontWeight: '800', color: colors.text },
  section: { marginTop: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  description: { marginTop: spacing.sm, color: colors.textSecondary, lineHeight: 20 },
  footer: { marginTop: spacing.xl },
});
