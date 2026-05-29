import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MyCourseStackParamList } from '@/app/navigation/types';
import { CourseCreateLayout } from '@/features/course/components/CourseCreateLayout';
import { CourseDraftMap } from '@/features/course/components/CourseDraftMap';
import { useCourseDraftStore } from '@/features/course/store/courseDraftStore';
import { PrimaryButton } from '@/shared/components';
import { colors, spacing } from '@/shared/constants/theme';

const MIN_WAYPOINTS = 2;

export function CourseCreateStep1Screen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MyCourseStackParamList>>();
  const route = useRoute<RouteProp<MyCourseStackParamList, 'CourseCreateStep1'>>();
  const editingCourseId = route.params?.courseId;
  const routePoints = useCourseDraftStore((s) => s.routePoints);
  const addRoutePoint = useCourseDraftStore((s) => s.addRoutePoint);
  const removeLastRoutePoint = useCourseDraftStore((s) => s.removeLastRoutePoint);

  const canProceed = routePoints.length >= MIN_WAYPOINTS;

  return (
    <CourseCreateLayout
      subtitle="지도에 주요 경유지를 표시해주세요"
      footer={
        <>
          {routePoints.length > 0 ? (
            <Pressable onPress={removeLastRoutePoint} style={styles.undo}>
              <Text style={styles.undoText}>
                마지막 경유지 삭제 ({routePoints.length}개)
              </Text>
            </Pressable>
          ) : null}
          <PrimaryButton
            label="다음"
            disabled={!canProceed}
            onPress={() =>
              navigation.navigate(
                'CourseCreateStep2',
                editingCourseId != null ? { courseId: editingCourseId } : undefined,
              )
            }
          />
        </>
      }
    >
      <View style={styles.mapArea}>
        <CourseDraftMap
          routePoints={routePoints}
          interactive
          onAddPoint={addRoutePoint}
        />
      </View>
    </CourseCreateLayout>
  );
}

const styles = StyleSheet.create({
  mapArea: {
    flex: 1,
    minHeight: 360,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  undo: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  undoText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
