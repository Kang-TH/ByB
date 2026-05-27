import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/shared/constants/theme';

interface HomeHeaderProps {
  nickname: string;
}

export function HomeHeader({ nickname }: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>안녕하세요, {nickname}님! 👋</Text>
      <Text style={styles.subtitle}>오늘도 함께 지구를 깨끗하게!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
