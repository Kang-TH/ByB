import { Pressable, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MyCourseStackParamList } from '@/app/navigation/types';
import { ScreenPlaceholder } from '@/shared/components/ScreenPlaceholder';
import { colors, spacing } from '@/shared/constants/theme';

export function CourseCreateStep2Screen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MyCourseStackParamList>>();

  return (
    <>
      <ScreenPlaceholder title="코스 이름·설명" subtitle="title, description 입력" />
      <Pressable
        style={styles.next}
        onPress={() => navigation.navigate('CourseCreateStep3')}
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
