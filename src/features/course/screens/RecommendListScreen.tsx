import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RecommendStackParamList } from '@/app/navigation/types';
import { fetchCourseStartPoints } from '@/features/course/api/courseApi';
import { CourseAreaSubtitle } from '@/features/course/components/CourseAreaSubtitle';
import { usePublicCourses } from '@/features/course/hooks/usePublicCourses';
import { EMPTY_COURSE_LIST } from '@/shared/constants/empty';
import { useFavoriteCourses } from '@/features/favorite/hooks/useFavoriteCourses';
import { sortCoursesByProximity } from '@/features/course/utils/sortCourses';
import { useCourseCacheStore } from '@/features/course/store/courseCacheStore';
import { useFavorite } from '@/features/favorite/hooks/useFavorite';
import { useToggleFavorite } from '@/features/favorite/hooks/useToggleFavorite';
import {
  getCurrentPositionOnce,
  getForegroundLocationPermission,
} from '@/shared/location/locationService';
import { useLocationStore } from '@/shared/location/locationStore';
import { BookmarkButton, Chip, Card } from '@/shared/components';
import { colors, spacing } from '@/shared/constants/theme';
import { formatDistanceKm } from '@/shared/utils/format';
import type { CourseListItem, RoutePoint } from '@/types/course';

type SortKey = 'all' | 'distance' | 'rating';

function CourseRow({
  item,
  startPoint,
  onPress,
}: {
  item: CourseListItem;
  startPoint?: RoutePoint;
  onPress: () => void;
}) {
  const favorite = useFavorite(item.courseId, item.isFavorite);
  const toggleFavorite = useToggleFavorite(item);

  return (
    <Pressable onPress={onPress} style={styles.rowPressable}>
      <Card>
        <View style={styles.rowTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.courseTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <CourseAreaSubtitle
              areaName={item.areaName}
              routePoints={startPoint ? [startPoint] : undefined}
              variant="list"
              numberOfLines={2}
            />
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
              {item.rating != null ? item.rating.toFixed(1) : '-'}
            </Text>
          </View>
          <Text style={styles.metaText}>{formatDistanceKm(item.distance)}</Text>
        </View>
      </Card>
    </Pressable>
  );
}

export function RecommendListScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RecommendStackParamList>>();
  const upsertCourses = useCourseCacheStore((s) => s.upsertCourses);
  const setPermissionStatus = useLocationStore((s) => s.setPermissionStatus);
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState<SortKey>('all');
  const [userLocation, setUserLocation] = useState<RoutePoint | null>(null);
  const [startPoints, setStartPoints] = useState<Map<number, RoutePoint>>(
    () => new Map(),
  );
  const [locationLoading, setLocationLoading] = useState(false);
  const { data: coursesData } = usePublicCourses();
  const courses = coursesData ?? EMPTY_COURSE_LIST;
  const favoriteCourses = useFavoriteCourses();

  const coursesWithFavorites = useMemo(() => {
    const favoriteIds = new Set(favoriteCourses.map((c) => c.courseId));
    return courses.map((c) => ({
      ...c,
      isFavorite: favoriteIds.has(c.courseId) || c.isFavorite === true,
    })) as CourseListItem[];
  }, [courses, favoriteCourses]);

  const startPointCourseIds = useMemo(
    () => coursesWithFavorites.map((c) => c.courseId).join(','),
    [coursesWithFavorites],
  );

  useEffect(() => {
    if (!startPointCourseIds) {
      setStartPoints(new Map());
      return;
    }
    const ids = startPointCourseIds.split(',').map(Number);
    void fetchCourseStartPoints(ids).then(setStartPoints);
  }, [startPointCourseIds]);

  const selectSort = useCallback(
    async (next: SortKey) => {
      if (next !== 'distance') {
        setSort(next);
        setUserLocation(null);
        setStartPoints(new Map());
        return;
      }

      const status =
        useLocationStore.getState().permissionStatus ??
        (await getForegroundLocationPermission());
      setPermissionStatus(status);

      if (status !== 'granted') {
        Alert.alert(
          '위치 권한이 필요합니다',
          '가까운 코스 순으로 보기 위해 위치 권한을 허용해 주세요. 로그아웃 후 다시 로그인하면 권한을 요청합니다.',
        );
        return;
      }

      setSort('distance');
      setLocationLoading(true);
      try {
        const coords = await getCurrentPositionOnce();
        setUserLocation(coords);
        const ids = coursesWithFavorites.map((c) => c.courseId);
        const points = await fetchCourseStartPoints(ids);
        setStartPoints(points);
      } catch {
        Alert.alert(
          '위치를 가져올 수 없습니다',
          '잠시 후 다시 시도해 주세요.',
        );
        setSort('all');
        setUserLocation(null);
        setStartPoints(new Map());
      } finally {
        setLocationLoading(false);
      }
    },
    [setPermissionStatus, coursesWithFavorites],
  );

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    let list = coursesWithFavorites.filter((c) =>
      q ? `${c.title} ${c.areaName}`.toLowerCase().includes(q) : true,
    );

    if (sort === 'distance' && userLocation) {
      list = sortCoursesByProximity(
        list,
        userLocation,
        (courseId) => startPoints.get(courseId),
      );
    } else if (sort === 'rating') {
      list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    return list;
  }, [coursesWithFavorites, keyword, sort, userLocation, startPoints]);

  const filteredCacheKey = useMemo(
    () =>
      filtered
        .map((c) => `${c.courseId}:${c.isFavorite ? 1 : 0}:${c.rating ?? ''}`)
        .join('|'),
    [filtered],
  );

  useEffect(() => {
    if (filtered.length === 0) return;
    upsertCourses(filtered);
  }, [filteredCacheKey, upsertCourses]);

  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={colors.textSecondary} />
        <TextInput
          value={keyword}
          onChangeText={setKeyword}
          placeholder="코스 검색"
          placeholderTextColor={colors.textSecondary}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.sortRow}>
        <Chip
          label="전체"
          selected={sort === 'all'}
          onPress={() => void selectSort('all')}
        />
        <Chip
          label="거리 순"
          selected={sort === 'distance'}
          onPress={() => void selectSort('distance')}
        />
        <Chip
          label="별점 높은 순"
          selected={sort === 'rating'}
          onPress={() => void selectSort('rating')}
        />
      </View>

      {locationLoading ? (
        <View style={styles.locationLoading}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.locationLoadingText}>현재 위치 확인 중…</Text>
        </View>
      ) : null}

      <FlatList
        data={filtered}
        extraData={`${sort}-${userLocation?.lat}-${userLocation?.lng}`}
        keyExtractor={(item) => String(item.courseId)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CourseRow
            item={item}
            startPoint={startPoints.get(item.courseId)}
            onPress={() =>
              navigation.navigate('CourseDetail', { courseId: item.courseId })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchWrap: {
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.text },
  sortRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  locationLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  locationLoadingText: { fontSize: 13, color: colors.textSecondary },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  rowPressable: { marginBottom: spacing.sm },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  courseTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, fontWeight: '700', color: colors.text },
  metaText: { fontSize: 14, color: colors.textSecondary },
});
