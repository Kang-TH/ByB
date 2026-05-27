import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/shared/constants/theme';
import type { Review } from '@/types/review';

export function ReviewListItem({ review }: { review: Review }) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={22} color={colors.textSecondary} />
          </View>
          <Text style={styles.nickname}>{review.nickname}</Text>
        </View>
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={14} color={colors.star} />
          <Text style={styles.ratingText}>{review.rating}</Text>
        </View>
      </View>
      <Text style={styles.content}>{review.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nickname: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  content: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
