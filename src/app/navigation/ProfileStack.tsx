import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@/app/navigation/types';
import { ProfileScreen } from '@/features/profile/screens/ProfileScreen';
import { ProfileSettingsScreen } from '@/features/profile/screens/ProfileSettingsScreen';
import { ActivityHistoryScreen } from '@/features/profile/screens/ActivityHistoryScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: '마이' }} />
      <Stack.Screen
        name="ProfileSettings"
        component={ProfileSettingsScreen}
        options={{ title: '프로필 설정' }}
      />
      <Stack.Screen
        name="ActivityHistory"
        component={ActivityHistoryScreen}
        options={{ title: '내 활동 기록' }}
      />
    </Stack.Navigator>
  );
}
