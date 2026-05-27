import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CourseListItem } from '@/types/course';
import { colors, spacing } from '@/shared/constants/theme';

interface CourseCardProps {
  course: CourseListItem;
  onPress?: () => void;
}

export function CourseCard({ course, onPress }: CourseCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.meta}>{course.areaName}</Text>
      <View style={styles.row}>
        {course.rating != null && (
          <Text style={styles.meta}>{course.rating.toFixed(1)}</Text>
        )}
        <Text style={styles.meta}>{course.distance.toFixed(1)} km</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  meta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
