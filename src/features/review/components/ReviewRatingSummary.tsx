import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/shared/constants/theme';
import type { RatingCounts } from '@/types/review';

const STAR_LEVELS = [5, 4, 3, 2, 1] as const;

export function ReviewRatingSummary({
  averageRating,
  reviewCount,
  ratingCounts,
}: {
  averageRating: number;
  reviewCount: number;
  ratingCounts: RatingCounts;
}) {
  const counts = ratingCounts;
  const maxCount = Math.max(...counts, 1);
  const displayAvg = reviewCount > 0 ? averageRating : 0;

  return (
    <View style={styles.wrap}>
      <Text style={styles.avg}>{displayAvg.toFixed(1)}</Text>
      <View style={styles.bars}>
        {STAR_LEVELS.map((star, index) => {
          const count = counts[index];
          const widthPercent = (count / maxCount) * 100;
          return (
            <View key={star} style={styles.barRow}>
              <Ionicons name="star" size={12} color={colors.text} />
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${widthPercent}%` }]} />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  avg: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.text,
    minWidth: 72,
  },
  bars: {
    flex: 1,
    gap: 6,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.text,
    borderRadius: 4,
    minWidth: 0,
  },
});
