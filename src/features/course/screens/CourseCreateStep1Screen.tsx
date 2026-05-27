import { Pressable, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MyCourseStackParamList } from '@/app/navigation/types';
import { ScreenPlaceholder } from '@/shared/components/ScreenPlaceholder';
import { colors, spacing } from '@/shared/constants/theme';

export function CourseCreateStep1Screen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MyCourseStackParamList>>();

  return (
    <>
      <ScreenPlaceholder
        title="지도 — 경유지"
        subtitle="routePoints 수집 (지도 SDK 연동 예정)"
      />
      <Pressable
        style={styles.next}
        onPress={() => navigation.navigate('CourseCreateStep2')}
      >
        <Text style={styles.nextText}>다음</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  next: {
    margin: spacing.lg,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextText: { color: '#fff', fontWeight: '600' },
});
