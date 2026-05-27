import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '@/shared/constants/theme';

export function PrimaryButton({
  label,
  onPress,
  disabled,
  right,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  right?: ReactNode;
  variant?: 'primary' | 'dark';
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.button,
        variant === 'dark' && styles.buttonDark,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      {right ?? null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  buttonDark: { backgroundColor: '#1B5E20' },
  pressed: { opacity: 0.92 },
  disabled: { opacity: 0.5 },
  label: { color: '#fff', fontWeight: '700', fontSize: 17 },
});

