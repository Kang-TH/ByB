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
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { resetRootToMainWithPlogging } from '@/app/navigation/navigationActions';
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
    upsertCourse(course);
  }, [course, upsertCourse]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.heroText}>지도/썸네일 영역</Text>
      </View>

      <View style={styles.titleRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.area}>{course.areaName}</Text>
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

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>후기</Text>
        <Pressable
          hitSlop={8}
          onPress={() =>
            navigation.navigate('ReviewList', {
              courseId: course.courseId,
              courseName: course.title,
              source: 'recommend',
            })
          }
        >
          <Text style={styles.more}>더보기</Text>
        </Pressable>
      </View>

      {course.previewReviews?.slice(0, 1).map((r) => (
        <Card key={r.reviewId}>
          <View style={styles.reviewTop}>
            <Text style={styles.reviewName}>{r.nickname}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={colors.star} />
              <Text style={styles.ratingText}>{r.rating}</Text>
            </View>
          </View>
          <Text style={styles.reviewContent}>{r.content}</Text>
        </Card>
      ))}

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
    height: 180,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  heroText: { color: colors.textSecondary, fontWeight: '700' },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  area: { marginTop: 2, color: colors.textSecondary },
  bookmark: { padding: spacing.sm },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  divider: { width: 1, height: 44, backgroundColor: colors.border },
  stat: { flex: 1, alignItems: 'center' },
  statLabel: { color: colors.textSecondary, fontSize: 13, marginBottom: 6 },
  statValue: { fontSize: 16, fontWeight: '800', color: colors.text },
  section: { marginTop: spacing.lg },
  sectionHeader: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  description: { marginTop: spacing.sm, color: colors.textSecondary, lineHeight: 20 },
  more: { color: colors.textSecondary, fontWeight: '700' },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  reviewName: { fontWeight: '800', color: colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontWeight: '800', color: colors.text },
  reviewContent: { color: colors.textSecondary, lineHeight: 20 },
  footer: { marginTop: spacing.xl },
});
