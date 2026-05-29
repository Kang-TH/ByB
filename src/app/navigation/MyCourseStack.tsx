import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MyCourseStackParamList } from '@/app/navigation/types';
import { MyCourseListScreen } from '@/features/course/screens/MyCourseListScreen';
import { MyCourseDetailScreen } from '@/features/course/screens/MyCourseDetailScreen';
import { CourseCreateStep1Screen } from '@/features/course/screens/CourseCreateStep1Screen';
import { CourseCreateStep2Screen } from '@/features/course/screens/CourseCreateStep2Screen';
import { CourseCreateStep3Screen } from '@/features/course/screens/CourseCreateStep3Screen';
import { ReviewListScreen } from '@/features/review/screens/ReviewListScreen';
import { ReviewWriteScreen } from '@/features/review/screens/ReviewWriteScreen';

const Stack = createNativeStackNavigator<MyCourseStackParamList>();

export function MyCourseStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyCourseList"
        component={MyCourseListScreen}
        options={{ title: '내 코스' }}
      />
      <Stack.Screen
        name="MyCourseDetail"
        component={MyCourseDetailScreen}
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
      <Stack.Screen
        name="CourseCreateStep1"
        component={CourseCreateStep1Screen}
        options={({ route }) => ({
          title:
            route.params?.courseId != null ? '코스 수정' : '새로운 코스 만들기',
        })}
      />
      <Stack.Screen
        name="CourseCreateStep2"
        component={CourseCreateStep2Screen}
        options={({ route }) => ({
          title:
            route.params?.courseId != null ? '코스 수정' : '새로운 코스 만들기',
        })}
      />
      <Stack.Screen
        name="CourseCreateStep3"
        component={CourseCreateStep3Screen}
        options={({ route }) => ({
          title:
            route.params?.courseId != null ? '코스 수정' : '새로운 코스 만들기',
        })}
      />
    </Stack.Navigator>
  );
}
