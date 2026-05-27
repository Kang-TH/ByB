import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/app/providers/AuthProvider';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { Card } from '@/shared/components';
import { colors, spacing } from '@/shared/constants/theme';

export function ActivityHistoryScreen() {
  const { userId } = useAuth();
  const { data: profile, isLoading } = useProfile(userId);

  if (isLoading || !profile) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>활동 기록</Text>
      <Card>
        {profile.activityRecords.map((r) => (
          <View key={r.ploggingId} style={styles.row}>
            <Text style={styles.date}>{r.date}</Text>
            <Text style={styles.course} numberOfLines={1}>
              {r.courseName}
            </Text>
            <Text style={styles.meta}>
              {r.distance.toFixed(1)}km · {r.duration} · {r.trashAmount}
            </Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  title: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },
  row: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  date: { fontSize: 12, color: colors.textSecondary },
  course: { fontSize: 15, fontWeight: '800', color: colors.text, marginTop: 4 },
  meta: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});
