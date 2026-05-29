import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { RootNavigator } from '@/app/navigation/RootNavigator';
import { PloggingTrackingProvider } from '@/features/plogging/providers/PloggingTrackingProvider';
import { ensureKakaoSdkInitialized } from '@/features/auth/services/kakaoAuth';
import { resumeActivePloggingIfNeeded } from '@/features/plogging/background/ploggingResume';

export default function App() {
  useEffect(() => {
    void ensureKakaoSdkInitialized().catch(() => {
      // 앱 키 미설정 등 — 로그인 시점에 다시 안내
    });
    void resumeActivePloggingIfNeeded();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <AuthProvider>
          <PloggingTrackingProvider>
            <RootNavigator />
          </PloggingTrackingProvider>
          <StatusBar style="auto" />
        </AuthProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
