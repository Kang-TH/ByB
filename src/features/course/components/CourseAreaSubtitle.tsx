import { Text, StyleSheet } from 'react-native';
import { useCourseAreaDisplay } from '@/features/course/hooks/useCourseAreaDisplay';
import type { RoutePoint } from '@/types/course';
import { colors } from '@/shared/constants/theme';

export function CourseAreaSubtitle({
  areaName,
  routePoints,
  variant = 'detail',
  numberOfLines,
}: {
  areaName: string;
  routePoints?: RoutePoint[];
  variant?: 'detail' | 'list';
  numberOfLines?: number;
}) {
  const { data: display, isPending } = useCourseAreaDisplay(areaName, routePoints);
  const textStyle = variant === 'list' ? styles.list : styles.detail;

  if (isPending && !display) {
    return (
      <Text style={textStyle} numberOfLines={numberOfLines}>
        주소 확인 중…
      </Text>
    );
  }

  if (!display) return null;

  return (
    <Text style={textStyle} numberOfLines={numberOfLines}>
      {display}
    </Text>
  );
}

const styles = StyleSheet.create({
  detail: { marginTop: 2, color: colors.textSecondary, lineHeight: 20 },
  list: {
    marginTop: 2,
    marginBottom: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
