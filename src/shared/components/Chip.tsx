import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '@/shared/constants/theme';

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        selected ? styles.selected : styles.unselected,
        pressed && onPress ? styles.pressed : null,
      ]}
    >
      <Text style={[styles.text, selected ? styles.textSelected : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
  },
  selected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  unselected: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.9 },
  text: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  textSelected: { color: colors.primary },
});

