import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@/app/navigation/types';
import { useAuth } from '@/app/providers/AuthProvider';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { Card } from '@/shared/components';
import { colors, spacing } from '@/shared/constants/theme';

export function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { signOut, userId } = useAuth();
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
      <Text style={styles.nickname}>{profile.nickname}</Text>

      <Card>
        <Text style={styles.sectionTitle}>누적 활동 요약</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>거리</Text>
            <Text style={styles.summaryValue}>
              {profile.totalSummary.totalDistance.toFixed(1)} km
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>플로깅</Text>
            <Text style={styles.summaryValue}>
              {profile.totalSummary.totalPloggingCount} 회
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>수거량</Text>
            <Text style={styles.summaryValue}>
              {profile.totalSummary.totalTrashAmount}
            </Text>
          </View>
        </View>
      </Card>

      <View style={styles.blockHeader}>
        <Text style={styles.sectionTitle}>내 활동 기록</Text>
        <Pressable
          hitSlop={8}
          onPress={() => navigation.navigate('ActivityHistory')}
          style={styles.moreBtn}
        >
          <Text style={styles.moreText}>더보기</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.textSecondary}
          />
        </Pressable>
      </View>

      <Card>
        <View style={styles.tableHeader}>
          <Text style={[styles.th, styles.thDate]}>날짜</Text>
          <Text style={[styles.th, styles.thCourse]}>코스</Text>
          <Text style={[styles.th, styles.thNum]}>거리</Text>
          <Text style={[styles.th, styles.thNum]}>시간</Text>
          <Text style={[styles.th, styles.thNum]}>수거량</Text>
        </View>
        {profile.activityRecords.slice(0, 2).map((r) => (
          <View key={r.ploggingId} style={styles.tableRow}>
            <Text style={[styles.td, styles.thDate]}>{r.date}</Text>
            <Text style={[styles.td, styles.thCourse]} numberOfLines={1}>
              {r.courseName}
            </Text>
            <Text style={[styles.td, styles.thNum]}>
              {r.distance.toFixed(1)}km
            </Text>
            <Text style={[styles.td, styles.thNum]}>{r.duration}</Text>
            <Text style={[styles.td, styles.thNum]}>{r.trashAmount}</Text>
          </View>
        ))}
      </Card>

      <Pressable
        style={styles.linkRow}
        onPress={() => navigation.navigate('ProfileSettings')}
      >
        <Text style={styles.linkText}>프로필 설정</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.border} />
      </Pressable>

      <Pressable style={styles.logout} onPress={signOut}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </Pressable>
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
  nickname: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  summaryRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { color: colors.textSecondary, fontSize: 13, marginBottom: 6 },
  summaryValue: { fontSize: 15, fontWeight: '800', color: colors.text },
  divider: { width: 1, height: 44, backgroundColor: colors.border },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  moreBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  moreText: { color: colors.textSecondary, fontWeight: '700' },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  tableRow: { flexDirection: 'row', paddingVertical: spacing.sm },
  th: { color: colors.textSecondary, fontWeight: '700', fontSize: 12 },
  td: { color: colors.text, fontSize: 12 },
  thDate: { width: 64 },
  thCourse: { flex: 1, paddingRight: spacing.sm },
  thNum: { width: 64, textAlign: 'right' },
  linkRow: {
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkText: { fontWeight: '800', color: colors.text },
  logout: { marginTop: spacing.xl, alignItems: 'center' },
  logoutText: { color: colors.error },
});
