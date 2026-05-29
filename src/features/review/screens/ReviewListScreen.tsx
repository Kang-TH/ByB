import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type {
  MyCourseStackParamList,
  RecommendStackParamList,
} from '@/app/navigation/types';
import { ReviewListItem } from '@/features/review/components/ReviewListItem';
import { ReviewRatingSummary } from '@/features/review/components/ReviewRatingSummary';
import { getReviewListData, useReviews } from '@/features/review/hooks/useReviews';
import { computeReviewStats } from '@/features/review/utils/reviewStats';
import { colors, spacing } from '@/shared/constants/theme';
import type { Review } from '@/types/review';

type Props = NativeStackScreenProps<
  RecommendStackParamList | MyCourseStackParamList,
  'ReviewList'
>;

type SortOption = 'latest' | 'rating';

const SORT_LABELS: Record<SortOption, string> = {
  latest: '최신순',
  rating: '별점순',
};

export function ReviewListScreen({ route }: Props) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { courseId, courseName, source = 'recommend' } = route.params;
  const [sort, setSort] = useState<SortOption>('latest');
  const [sortOpen, setSortOpen] = useState(false);

  const { reviews } = useReviews(courseId);
  const reviewList = getReviewListData(reviews, courseId, courseName);
  const headerTitle =
    source === 'myCourse' ? '내 코스 - 후기' : '추천 코스 - 후기';

  const stats = useMemo(
    () => computeReviewStats(reviewList.reviews),
    [reviewList.reviews],
  );

  const sortedReviews = useMemo(() => {
    const list = [...reviewList.reviews];
    if (sort === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [reviewList.reviews, sort]);

  const listHeader = (
    <View style={styles.headerBlock}>
      <ReviewRatingSummary
        averageRating={stats.averageRating}
        reviewCount={stats.reviewCount}
        ratingCounts={stats.ratingCounts}
      />
      <View style={styles.sortRow}>
        <Pressable
          style={styles.sortButton}
          onPress={() => setSortOpen((v) => !v)}
          hitSlop={8}
        >
          <Text style={styles.sortLabel}>{SORT_LABELS[sort]}</Text>
          <Ionicons
            name={sortOpen ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.text}
          />
        </Pressable>
        {sortOpen ? (
          <View style={styles.sortMenu}>
            {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
              <Pressable
                key={key}
                style={styles.sortMenuItem}
                onPress={() => {
                  setSort(key);
                  setSortOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.sortMenuText,
                    sort === key && styles.sortMenuTextActive,
                  ]}
                >
                  {SORT_LABELS[key]}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.navBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </Pressable>
        <View style={styles.titleBlock}>
          <Text style={styles.screenTitle}>{headerTitle}</Text>
          <Text style={styles.courseName}>{courseName}</Text>
        </View>
        <View style={styles.backBtn} />
      </View>

      <FlatList
        data={sortedReviews}
        keyExtractor={(item) => String(item.reviewId)}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + spacing.lg },
        ]}
        ListHeaderComponent={listHeader}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: Review }) => (
          <ReviewListItem review={item} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  courseName: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  headerBlock: {
    paddingTop: spacing.sm,
  },
  sortRow: {
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
    zIndex: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  sortMenu: {
    position: 'absolute',
    top: 32,
    right: 0,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  sortMenuItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  sortMenuText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sortMenuTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  list: {
    paddingHorizontal: spacing.lg,
  },
});
