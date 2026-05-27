import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { RootNavigator } from '@/app/navigation/RootNavigator';
import { SeedMockCourseCatalog } from '@/features/course/components/SeedMockCourseCatalog';

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <AuthProvider>
          <SeedMockCourseCatalog />
          <RootNavigator />
          <StatusBar style="auto" />
        </AuthProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
