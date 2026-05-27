import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/app/navigation/types';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
