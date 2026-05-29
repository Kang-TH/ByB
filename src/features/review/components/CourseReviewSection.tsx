import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useReviews } from '@/features/review/hooks/useReviews';
import { Card } from '@/shared/components';
import { colors, spacing } from '@/shared/constants/theme';

type Props = {
  courseId: number;
  courseName: string;
  onPressMore: () => void;
};

export function CourseReviewSection({ courseId, courseName, onPressMore }: Props) {
  const { reviews, isLoading } = useReviews(courseId);
  const preview = reviews[0];

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>후기</Text>
        <Pressable hitSlop={8} onPress={onPressMore}>
          <Text style={styles.more}>더보기</Text>
        </Pressable>
      </View>

      {preview ? (
        <Card>
          <View style={styles.reviewTop}>
            <Text style={styles.reviewName}>{preview.nickname}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={colors.star} />
              <Text style={styles.ratingText}>{preview.rating}</Text>
            </View>
          </View>
          <Text style={styles.reviewContent}>{preview.content}</Text>
        </Card>
      ) : !isLoading ? (
        <Text style={styles.empty}>
          {courseName}에 대한 후기가 아직 없습니다.
        </Text>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  more: { color: colors.textSecondary, fontWeight: '700' },
  reviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  reviewName: { fontWeight: '800', color: colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontWeight: '800', color: colors.text },
  reviewContent: { color: colors.textSecondary, lineHeight: 20 },
  empty: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
