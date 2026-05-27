import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MyCourseStackParamList } from '@/app/navigation/types';
import { useMyCourses, getMyCoursesList } from '@/features/course/hooks/useMyCourses';
import { useAuth } from '@/app/providers/AuthProvider';
import { useFavorite } from '@/features/favorite/hooks/useFavorite';
import { useFavoriteCourses } from '@/features/favorite/hooks/useFavoriteCourses';
import { useToggleFavorite } from '@/features/favorite/hooks/useToggleFavorite';
import { BookmarkButton, Card, PrimaryButton, SegmentedControl } from '@/shared/components';
import { colors, spacing } from '@/shared/constants/theme';
import type { CourseListItem } from '@/types/course';

type Segment = 'my' | 'favorite';

function MyCourseRow({
  course,
  onPress,
}: {
  course: CourseListItem;
  onPress: () => void;
}) {
  const favorite = useFavorite(course.courseId, course.isFavorite);
  const toggleFavorite = useToggleFavorite(course);

  return (
    <Pressable onPress={onPress} style={styles.rowPressable}>
      <Card>
        <View style={styles.rowTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.courseTitle} numberOfLines={1}>
              {course.title}
            </Text>
            <Text style={styles.courseArea} numberOfLines={1}>
              {course.areaName}
            </Text>
          </View>
          <BookmarkButton
            isFavorite={favorite.isFavorite}
            onPress={toggleFavorite.toggle}
          />
        </View>
        <View style={styles.rowMeta}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={colors.star} />
            <Text style={styles.ratingText}>
              {course.rating != null ? course.rating.toFixed(1) : '-'}
            </Text>
          </View>
          <Text style={styles.metaText}>{course.distance.toFixed(1)}km</Text>
        </View>
      </Card>
    </Pressable>
  );
}

export function MyCourseListScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MyCourseStackParamList>>();
  const { userId } = useAuth();
  const [segment, setSegment] = useState<Segment>('my');
  const favoriteCourses = useFavoriteCourses();
  const { data: myCoursesData } = useMyCourses(userId);

  const list = useMemo(() => {
    if (segment === 'my') return getMyCoursesList(myCoursesData);
    return favoriteCourses;
  }, [segment, favoriteCourses, myCoursesData]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>내 코스</Text>

      <View style={styles.segmentWrap}>
        <SegmentedControl<Segment>
          value={segment}
          onChange={setSegment}
          options={[
            { value: 'my', label: '내가 만든 코스' },
            { value: 'favorite', label: '즐겨찾기' },
          ]}
        />
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => String(item.courseId)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          segment === 'favorite' ? (
            <Text style={styles.empty}>즐겨찾기한 코스가 없습니다.</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <MyCourseRow
            course={item}
            onPress={() =>
              navigation.navigate('MyCourseDetail', { courseId: item.courseId })
            }
          />
        )}
      />

      <View style={styles.fabWrap}>
        <PrimaryButton
          label="새로운 코스 만들기"
          onPress={() => navigation.navigate('CourseCreateStep1')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  segmentWrap: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
    gap: spacing.sm,
  },
  rowPressable: { marginBottom: spacing.sm },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  courseTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  courseArea: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, fontWeight: '700', color: colors.text },
  metaText: { fontSize: 14, color: colors.textSecondary },
  fabWrap: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
  },
  empty: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.xl,
  },
});
