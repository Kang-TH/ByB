import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { colors, spacing } from '@/shared/constants/theme';

export function BookmarkButton({
  isFavorite,
  onPress,
}: {
  isFavorite: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [styles.base, pressed ? styles.pressed : null]}
    >
      <Ionicons
        name={isFavorite ? 'bookmark' : 'bookmark-outline'}
        size={20}
        color={colors.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { padding: spacing.xs },
  pressed: { opacity: 0.8 },
});

