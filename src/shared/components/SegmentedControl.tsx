import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/shared/constants/theme';

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={({ pressed }) => [
              styles.item,
              selected ? styles.itemSelected : styles.itemUnselected,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text
              style={[styles.text, selected ? styles.textSelected : null]}
              numberOfLines={1}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    overflow: 'hidden',
  },
  item: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemSelected: { backgroundColor: colors.primary },
  itemUnselected: { backgroundColor: colors.background },
  pressed: { opacity: 0.92 },
  text: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  textSelected: { color: '#fff' },
});

