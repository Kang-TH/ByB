import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/shared/constants/theme';

export function TrashInputLayout({
  subtitle,
  children,
  footer,
}: {
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <Text style={styles.header}>수거량 입력하기</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.body}>{children}</View>
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        {footer}
      </View>
    </View>
  );
}

export function TrashInputFooterRow({ children }: { children: ReactNode }) {
  return <View style={footerRowStyles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  header: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  body: { flex: 1 },
  footer: { gap: spacing.sm },
});

const footerRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  item: { flex: 1 },
});

export const trashInputFooterItemStyle = footerRowStyles.item;
