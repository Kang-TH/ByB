import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useAuth } from '@/app/providers/AuthProvider';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { PrimaryButton, TextField } from '@/shared/components';
import { colors, spacing } from '@/shared/constants/theme';

export function ProfileSettingsScreen() {
  const { userId } = useAuth();
  const { data: profile } = useProfile(userId);
  const [nickname, setNickname] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');

  useEffect(() => {
    if (!profile) return;
    setNickname(profile.nickname);
    setProfileImageUrl(profile.profileImageUrl ?? '');
  }, [profile]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>프로필 설정</Text>
      <TextField
        label="nickname"
        value={nickname}
        onChangeText={setNickname}
        placeholder="닉네임을 입력해주세요..."
      />
      <TextField
        label="profileImageUrl"
        value={profileImageUrl}
        onChangeText={setProfileImageUrl}
        placeholder="프로필 이미지 URL (선택)"
      />
      <PrimaryButton label="저장하기" onPress={() => {}} disabled={!nickname.trim()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  title: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },
});
