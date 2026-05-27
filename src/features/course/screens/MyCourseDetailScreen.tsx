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
import { useMyCourseDetail, getMyCourseDetail } from '@/features/course/hooks/useMyCourseDetail';
import { isCourseCreatedByUser } from '@/features/course/utils/coursePermissions';
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
  const course = getMyCourseDetail(data, courseId);
  const showManageActions = isCourseCreatedByUser(course.userId, userId);

  const startPlogging = () => {
    navigation.navigate('Plogging', {
      screen: 'PloggingActive',
      params: { courseId },
    });
  };

  const onEdit = () => {
    Alert.alert('준비 중', '코스 수정 기능은 곧 연결됩니다.');
  };

  const onDelete = () => {
    Alert.alert('삭제하기', '이 코스를 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => Alert.alert('준비 중', '코스 삭제 API 연동 예정입니다.'),
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.heroText}>지도 영역</Text>
      </View>

      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.area}>{course.areaName}</Text>

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

      {showManageActions ? (
        <View style={styles.actions}>
          <Pressable style={styles.secondaryBtn} onPress={onEdit}>
            <Ionicons name="pencil-outline" size={18} color={colors.primary} />
            <Text style={styles.secondaryText}>수정하기</Text>
          </Pressable>
          <Pressable style={styles.dangerBtn} onPress={onDelete}>
            <Ionicons name="trash-outline" size={18} color={colors.error} />
            <Text style={styles.dangerText}>삭제하기</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  heroText: { color: colors.textSecondary, fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  area: { marginTop: 2, color: colors.textSecondary, marginBottom: spacing.md },
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
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryText: { color: colors.primary, fontWeight: '800' },
  dangerBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dangerText: { color: colors.error, fontWeight: '800' },
  footer: { marginTop: spacing.xl },
});
