import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { PloggingStackParamList } from '@/app/navigation/types';
import { PloggingActiveScreen } from '@/features/plogging/screens/PloggingActiveScreen';
import { TrashBagSelectScreen } from '@/features/plogging/screens/TrashBagSelectScreen';
import { TrashAmountStandardScreen } from '@/features/plogging/screens/TrashAmountStandardScreen';
import { TrashAmountNormalScreen } from '@/features/plogging/screens/TrashAmountNormalScreen';
import { PloggingCompleteScreen } from '@/features/plogging/screens/PloggingCompleteScreen';

const Stack = createNativeStackNavigator<PloggingStackParamList>();

export function PloggingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="PloggingActive"
        component={PloggingActiveScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="TrashBagSelect" component={TrashBagSelectScreen} />
      <Stack.Screen
        name="TrashAmountStandard"
        component={TrashAmountStandardScreen}
      />
      <Stack.Screen name="TrashAmountNormal" component={TrashAmountNormalScreen} />
      <Stack.Screen name="PloggingComplete" component={PloggingCompleteScreen} />
    </Stack.Navigator>
  );
}
