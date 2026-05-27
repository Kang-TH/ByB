import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CourseListItem } from '@/types/course';
import { HomeCourseCard } from '@/features/home/components/HomeCourseCard';
import { colors, spacing } from '@/shared/constants/theme';

interface RecommendedCoursesSectionProps {
  courses: CourseListItem[];
  onPressMore: () => void;
  onPressCourse: (courseId: number) => void;
}

export function RecommendedCoursesSection({
  courses,
  onPressMore,
  onPressCourse,
}: RecommendedCoursesSectionProps) {
  const featured = courses[0];
  if (!featured) return null;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>추천 코스</Text>
        <Pressable style={styles.moreButton} onPress={onPressMore} hitSlop={8}>
          <Text style={styles.more}>더보기</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
        </Pressable>
      </View>
      <HomeCourseCard
        course={featured}
        onPress={() => onPressCourse(featured.courseId)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  more: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
