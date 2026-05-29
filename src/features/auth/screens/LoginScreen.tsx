import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useKakaoLogin } from '@/features/auth/hooks/useKakaoLogin';
import { logAndroidKakaoKeyHashIfDev } from '@/features/auth/services/kakaoAuth';
import { useLocationStore } from '@/shared/location/locationStore';
import { getApiErrorMessage } from '@/shared/api/errors';
import { colors, spacing } from '@/shared/constants/theme';

export function LoginScreen() {
  const { signIn } = useAuth();
  const { signInWithKakao } = useKakaoLogin();
  const requestPermissionOnLogin = useLocationStore((s) => s.requestPermissionOnLogin);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void logAndroidKakaoKeyHashIfDev();
  }, []);

  const completeLogin = async () => {
    await requestPermissionOnLogin();
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await signInWithKakao();
      await signIn(response);
      await completeLogin();
    } catch (error) {
      Alert.alert('로그인 실패', getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>지구를 위한 작은 습관{'\n'}함께해요!</Text>
      <Text style={styles.subtitle}>플로깅</Text>
      <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>카카오계정으로 로그인</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: '#FEE500',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    minWidth: 240,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    color: '#3C1E1E',
  },
});
