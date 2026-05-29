import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/shared/constants/theme';

export function CourseCreateLayout({
  subtitle,
  children,
  footer,
  mapPreview,
}: {
  subtitle?: string;
  children?: ReactNode;
  footer: ReactNode;
  mapPreview?: ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: spacing.md }]}>
      {mapPreview ? <View style={styles.mapPreview}>{mapPreview}</View> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children ? <View style={styles.body}>{children}</View> : null}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        {footer}
      </View>
    </View>
  );
}

const footerRowStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  item: { flex: 1 },
});

export function CourseCreateFooterRow({ children }: { children: ReactNode }) {
  return <View style={footerRowStyles.row}>{children}</View>;
}

export const courseCreateFooterItemStyle = footerRowStyles.item;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  mapPreview: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  body: { flex: 1 },
  footer: { gap: spacing.sm, marginTop: spacing.md },
});
