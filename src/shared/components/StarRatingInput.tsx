import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/shared/constants/theme';

export function StarRatingInput({
  value,
  onChange,
  size = 28,
}: {
  value: number;
  onChange: (next: number) => void;
  size?: number;
}) {
  return (
    <View style={styles.row}>
      {Array.from({ length: 5 }).map((_, i) => {
        const score = i + 1;
        const filled = score <= value;
        return (
          <Pressable
            key={score}
            onPress={() => onChange(score)}
            hitSlop={8}
          >
            <Ionicons
              name={filled ? 'star' : 'star-outline'}
              size={size}
              color={filled ? colors.star : colors.border}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});

