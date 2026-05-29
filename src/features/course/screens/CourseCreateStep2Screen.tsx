import { useState } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MyCourseStackParamList } from '@/app/navigation/types';
import { CourseCreateLayout } from '@/features/course/components/CourseCreateLayout';
import { CourseDraftMap } from '@/features/course/components/CourseDraftMap';
import { useCourseDraftStore } from '@/features/course/store/courseDraftStore';
import { OutlineButton, PrimaryButton, TextField } from '@/shared/components';

export function CourseCreateStep2Screen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MyCourseStackParamList>>();
  const route = useRoute<RouteProp<MyCourseStackParamList, 'CourseCreateStep2'>>();
  const editingCourseId = route.params?.courseId;
  const routePoints = useCourseDraftStore((s) => s.routePoints);
  const storedTitle = useCourseDraftStore((s) => s.title);
  const storedDescription = useCourseDraftStore((s) => s.description);
  const setMeta = useCourseDraftStore((s) => s.setMeta);

  const [title, setTitle] = useState(storedTitle);
  const [description, setDescription] = useState(storedDescription);

  const canProceed = title.trim().length > 0;

  const goNext = () => {
    setMeta({ title: title.trim(), description: description.trim() });
    navigation.navigate(
      'CourseCreateStep3',
      editingCourseId != null ? { courseId: editingCourseId } : undefined,
    );
  };

  return (
    <CourseCreateLayout
      mapPreview={<CourseDraftMap routePoints={routePoints} />}
      footer={
        <>
          <OutlineButton label="이전" onPress={() => navigation.goBack()} />
          <PrimaryButton
            label="다음"
            disabled={!canProceed}
            onPress={goNext}
          />
        </>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <TextField
          label="코스 이름"
          value={title}
          onChangeText={setTitle}
          placeholder="코스 이름을 입력해주세요..."
        />
        <TextField
          label="코스 설명"
          value={description}
          onChangeText={setDescription}
          placeholder="코스에 대한 간단한 설명을 적어주세요..."
          multiline
        />
      </ScrollView>
    </CourseCreateLayout>
  );
}
