import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MyCourseStackParamList } from '@/app/navigation/types';
import { useAuth } from '@/app/providers/AuthProvider';
import { CourseCreateLayout } from '@/features/course/components/CourseCreateLayout';
import { CourseDraftMap } from '@/features/course/components/CourseDraftMap';
import { useCreateCourse } from '@/features/course/hooks/useCreateCourse';
import { useUpdateCourse } from '@/features/course/hooks/useUpdateCourse';
import { useCourseDraftStore } from '@/features/course/store/courseDraftStore';
import { resolveAreaNameFromRoutePoints } from '@/features/course/utils/courseArea';
import {
  estimateWalkingMinutes,
  formatDistanceKmCompact,
  getCourseDraftDistanceKm,
} from '@/features/course/utils/courseCreateUtils';
import { getApiErrorMessage } from '@/shared/api/errors';
import { OutlineButton, PrimaryButton } from '@/shared/components';
import { colors, spacing } from '@/shared/constants/theme';

export function CourseCreateStep3Screen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MyCourseStackParamList>>();
  const { userId } = useAuth();
  const routePoints = useCourseDraftStore((s) => s.routePoints);
  const title = useCourseDraftStore((s) => s.title);
  const description = useCourseDraftStore((s) => s.description);
  const isPublic = useCourseDraftStore((s) => s.isPublic);
  const editingCourseId = useCourseDraftStore((s) => s.editingCourseId);
  const reset = useCourseDraftStore((s) => s.reset);

  const isEditing = editingCourseId != null;
  const createCourseMutation = useCreateCourse(userId);
  const updateCourseMutation = useUpdateCourse(userId);
  const [saving, setSaving] = useState(false);

  const distanceKm = getCourseDraftDistanceKm(routePoints);

  const handleSave = async () => {
    if (routePoints.length < 2 || !title.trim()) {
      Alert.alert('입력 확인', '경유지와 코스 이름을 확인해 주세요.');
      return;
    }

    setSaving(true);
    try {
      const areaName = await resolveAreaNameFromRoutePoints(routePoints);
      const payload = {
        title: title.trim(),
        description: description.trim(),
        areaName,
        distance: distanceKm,
        estimatedTime: estimateWalkingMinutes(distanceKm),
        routePoints,
      };

      if (isEditing) {
        await updateCourseMutation.mutateAsync({
          courseId: editingCourseId,
          body: { ...payload, isPublic },
        });
        reset();
        navigation.popToTop();
        navigation.navigate('MyCourseDetail', { courseId: editingCourseId });
      } else {
        const result = await createCourseMutation.mutateAsync({
          ...payload,
          isPublic: false,
        });
        reset();
        navigation.popToTop();
        navigation.navigate('MyCourseDetail', { courseId: result.courseId });
      }
    } catch (error) {
      Alert.alert(isEditing ? '수정 실패' : '저장 실패', getApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <CourseCreateLayout
      mapPreview={<CourseDraftMap routePoints={routePoints} />}
      footer={
        <>
          <OutlineButton
            label="이전"
            onPress={() => navigation.goBack()}
            disabled={saving}
          />
          <PrimaryButton
            label={isEditing ? '수정 완료' : '저장하기'}
            onPress={handleSave}
            disabled={saving}
          />
        </>
      }
    >
      <View style={styles.summaryCard}>
        <SummaryRow label="코스 이름" value={title} />
        <SummaryRow label="거리" value={formatDistanceKmCompact(distanceKm)} />
        <SummaryRow
          label="코스 설명"
          value={description.trim() || '-'}
          multiline
        />
      </View>
    </CourseCreateLayout>
  );
}

function SummaryRow({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text
        style={[styles.summaryValue, multiline && styles.summaryValueMulti]}
        numberOfLines={multiline ? 4 : 1}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  summaryRow: {
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  summaryValueMulti: {
    fontWeight: '500',
    lineHeight: 22,
  },
});
