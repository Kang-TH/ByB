import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type {
  MainTabParamList,
  MyCourseStackParamList,
  RootStackParamList,
} from '@/app/navigation/types';
import { useAuth } from '@/app/providers/AuthProvider';
import { CourseAreaSubtitle } from '@/features/course/components/CourseAreaSubtitle';
import { CourseDraftMap } from '@/features/course/components/CourseDraftMap';
import { useMyCourseDetail, getMyCourseDetail } from '@/features/course/hooks/useMyCourseDetail';
import { useDeleteCourse } from '@/features/course/hooks/useDeleteCourse';
import { useIsCoursePublished } from '@/features/course/hooks/useIsCoursePublished';
import { useSetCoursePublic } from '@/features/course/hooks/useSetCoursePublic';
import { useCourseDraftStore } from '@/features/course/store/courseDraftStore';
import { canManageCourse } from '@/features/course/utils/coursePermissions';
import { CourseReviewSection } from '@/features/review/components/CourseReviewSection';
import { getApiErrorMessage } from '@/shared/api/errors';
import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, PrimaryButton } from '@/shared/components';
import { colors, spacing } from '@/shared/constants/theme';

type Props = NativeStackScreenProps<MyCourseStackParamList, 'MyCourseDetail'>;

type MyCourseDetailNav = CompositeNavigationProp<
  NativeStackNavigationProp<MyCourseStackParamList, 'MyCourseDetail'>,
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList>,
    NativeStackNavigationProp<RootStackParamList>
  >
>;

export function MyCourseDetailScreen({ route }: Props) {
  const navigation = useNavigation<MyCourseDetailNav>();
  const { userId } = useAuth();
  const { courseId } = route.params;
  const { data } = useMyCourseDetail(courseId, userId);
  const setPublicMutation = useSetCoursePublic(userId);
  const deleteMutation = useDeleteCourse(userId);
  const loadCourseDraft = useCourseDraftStore((s) => s.loadFromCourse);
  const course = getMyCourseDetail(data, courseId);
  const showManageActions = canManageCourse(course, userId);
  const isPublished = useIsCoursePublished(courseId, course.isPublic);

  const startPlogging = () => {
    navigation.navigate('Plogging', {
      screen: 'PloggingActive',
      params: { courseId },
    });
  };

  const onTogglePublic = () => {
    if (isPublished) {
      Alert.alert(
        '공개 취소',
        '추천 코스 탭에서 이 코스를 내릴까요? 다른 사용자에게는 더 이상 보이지 않습니다.',
        [
          { text: '닫기', style: 'cancel' },
          {
            text: '공개 취소',
            style: 'destructive',
            onPress: () => {
              void setPublicMutation
                .mutateAsync({ course, isPublic: false })
                .then((res) => {
                  Alert.alert('완료', res.message ?? '추천 코스 공개가 취소되었습니다.');
                })
                .catch((error) => {
                  Alert.alert('취소 실패', getApiErrorMessage(error));
                });
            },
          },
        ],
      );
      return;
    }

    Alert.alert(
      '추천 코스에 공개',
      '이 코스를 추천 코스 탭에 공개할까요? 다른 사용자도 볼 수 있습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '공개하기',
          onPress: () => {
            void setPublicMutation
              .mutateAsync({ course, isPublic: true })
              .then((res) => {
                Alert.alert('완료', res.message ?? '추천 코스에 공개되었습니다.');
              })
              .catch((error) => {
                Alert.alert('공개 실패', getApiErrorMessage(error));
              });
          },
        },
      ],
    );
  };

  const onEdit = () => {
    if (!showManageActions) return;
    loadCourseDraft({ ...course, isPublic: isPublished });
    navigation.navigate('CourseCreateStep1', { courseId });
  };

  const onDelete = () => {
    if (!showManageActions) return;

    Alert.alert(
      '코스 삭제',
      '이 코스를 삭제할까요? 삭제하면 복구할 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            void deleteMutation
              .mutateAsync(courseId)
              .then((res) => {
                Alert.alert('완료', res.message ?? '코스가 삭제되었습니다.', [
                  {
                    text: '확인',
                    onPress: () => navigation.popToTop(),
                  },
                ]);
              })
              .catch((error) => {
                Alert.alert('삭제 실패', getApiErrorMessage(error));
              });
          },
        },
      ],
    );
  };

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

      <Text style={styles.title}>{course.title}</Text>
      <CourseAreaSubtitle
        areaName={course.areaName}
        routePoints={course.routePoints}
      />
      {isPublished ? (
        <Text style={styles.sharedBadge}>추천 코스에 공개됨</Text>
      ) : null}

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
        <Text style={styles.description}>
          {course.description?.trim() || '설명이 없습니다.'}
        </Text>
      </View>

      <CourseReviewSection
        courseId={course.courseId}
        courseName={course.title}
        onPressMore={() =>
          navigation.navigate('ReviewList', {
            courseId: course.courseId,
            courseName: course.title,
            source: 'myCourse',
          })
        }
      />

      {showManageActions ? (
        <View style={styles.actions}>
          <Pressable
            style={[
              styles.secondaryBtn,
              isPublished && styles.secondaryBtnPublished,
            ]}
            onPress={onTogglePublic}
            disabled={setPublicMutation.isPending}
          >
            <Ionicons
              name={isPublished ? 'eye-off-outline' : 'earth-outline'}
              size={18}
              color={isPublished ? colors.error : colors.primary}
            />
            <Text
              style={[
                styles.secondaryText,
                isPublished && styles.secondaryTextUnpublish,
              ]}
            >
              {setPublicMutation.isPending
                ? '처리 중…'
                : isPublished
                  ? '공개 취소'
                  : '추천 코스에 공개'}
            </Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={onEdit}>
            <Ionicons name="pencil-outline" size={18} color={colors.primary} />
            <Text style={styles.secondaryText}>수정하기</Text>
          </Pressable>
          <Pressable
            style={styles.dangerBtn}
            onPress={onDelete}
            disabled={deleteMutation.isPending}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
            <Text style={styles.dangerText}>
              {deleteMutation.isPending ? '삭제 중…' : '삭제하기'}
            </Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.footer}>
        <PrimaryButton label="이 코스로 플로깅 시작하기" onPress={startPlogging} />
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
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  area: { marginTop: 2, color: colors.textSecondary, marginBottom: spacing.xs },
  sharedBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  divider: { width: 1, height: 44, backgroundColor: colors.border },
  stat: { flex: 1, alignItems: 'center' },
  statLabel: { color: colors.textSecondary, fontSize: 13, marginBottom: 6 },
  statValue: { fontSize: 16, fontWeight: '800', color: colors.text },
  section: { marginTop: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  description: { marginTop: spacing.sm, color: colors.textSecondary, lineHeight: 20 },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  secondaryBtn: {
    flexGrow: 1,
    flexBasis: '30%',
    minWidth: 100,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  secondaryBtnPublished: {
    borderColor: colors.error,
  },
  secondaryText: { color: colors.primary, fontWeight: '800', fontSize: 13 },
  secondaryTextUnpublish: { color: colors.error },
  dangerBtn: {
    flexGrow: 1,
    flexBasis: '30%',
    minWidth: 100,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dangerText: { color: colors.error, fontWeight: '800', fontSize: 13 },
  footer: { marginTop: spacing.xl },
});
