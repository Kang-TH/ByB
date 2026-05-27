import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@/app/navigation/types';
import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { ActivityHistoryScreen } from '@/features/profile/screens/ActivityHistoryScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ActivityHistory"
        component={ActivityHistoryScreen}
        options={{ title: '내 활동 기록' }}
      />
    </Stack.Navigator>
  );
}
