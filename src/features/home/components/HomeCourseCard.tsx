import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { CourseListItem } from '@/types/course';
import { useFavorite } from '@/features/favorite/hooks/useFavorite';
import { useToggleFavorite } from '@/features/favorite/hooks/useToggleFavorite';
import { BookmarkButton } from '@/shared/components';
import { colors, spacing } from '@/shared/constants/theme';

interface HomeCourseCardProps {
  course: CourseListItem;
  onPress?: () => void;
}

export function HomeCourseCard({ course, onPress }: HomeCourseCardProps) {
  const favorite = useFavorite(course.courseId, course.isFavorite);
  const toggleFavorite = useToggleFavorite(course);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {course.thumbnailUrl ? (
        <Image source={{ uri: course.thumbnailUrl }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder]}>
          <Ionicons name="image-outline" size={28} color={colors.textSecondary} />
        </View>
      )}
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {course.title}
          </Text>
          <BookmarkButton
            isFavorite={favorite.isFavorite}
            onPress={toggleFavorite.toggle}
          />
        </View>
        <Text style={styles.area} numberOfLines={1}>
          {course.areaName}
        </Text>
        <View style={styles.metaRow}>
          {course.rating != null && (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={colors.star} />
              <Text style={styles.rating}>{course.rating.toFixed(1)}</Text>
            </View>
          )}
          <Text style={styles.distance}>{course.distance.toFixed(1)}km</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  thumbPlaceholder: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    marginLeft: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  area: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  distance: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
