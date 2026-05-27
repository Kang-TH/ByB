import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RecommendStackParamList } from '@/app/navigation/types';
import { RecommendListScreen } from '@/features/course/screens/RecommendListScreen';
import { CourseDetailScreen } from '@/features/course/screens/CourseDetailScreen';
import { ReviewListScreen } from '@/features/review/screens/ReviewListScreen';
import { ReviewWriteScreen } from '@/features/review/screens/ReviewWriteScreen';

const Stack = createNativeStackNavigator<RecommendStackParamList>();

export function RecommendStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RecommendList"
        component={RecommendListScreen}
        options={{ title: '추천 코스' }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={{ title: '코스 상세' }}
      />
      <Stack.Screen
        name="ReviewList"
        component={ReviewListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewWrite"
        component={ReviewWriteScreen}
        options={{ title: '후기 작성' }}
      />
    </Stack.Navigator>
  );
}
