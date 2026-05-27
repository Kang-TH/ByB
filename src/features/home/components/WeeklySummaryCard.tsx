import { StyleSheet, Text, View } from 'react-native';
import type { WeeklySummary } from '@/types/plogging';
import { colors, spacing } from '@/shared/constants/theme';

interface WeeklySummaryCardProps {
  summary: WeeklySummary;
}

function StatItem({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.statValue}>{value}</Text>
        {unit ? <Text style={styles.statUnit}>{unit}</Text> : null}
      </View>
    </View>
  );
}

function formatTrashAmount(raw: string): { value: string; unit?: string } {
  const match = raw.match(/^([\d.]+)\s*(.*)$/);
  if (!match) return { value: raw };
  return { value: match[1], unit: match[2] || undefined };
}

export function WeeklySummaryCard({ summary }: WeeklySummaryCardProps) {
  const trash = formatTrashAmount(summary.trashAmount);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>이번 주 활동 요약</Text>
      <View style={styles.row}>
        <StatItem
          label="거리"
          value={summary.distance.toFixed(1)}
          unit="km"
        />
        <View style={styles.divider} />
        <StatItem
          label="플로깅"
          value={String(summary.ploggingCount)}
          unit="회"
        />
        <View style={styles.divider} />
        <StatItem label="수거량" value={trash.value} unit={trash.unit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statUnit: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 44,
    backgroundColor: colors.border,
  },
});
