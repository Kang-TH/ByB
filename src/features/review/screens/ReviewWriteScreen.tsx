import { useState } from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RecommendStackParamList } from '@/app/navigation/types';
import { useAuth } from '@/app/providers/AuthProvider';
import { useCreateReview } from '@/features/review/hooks/useCreateReview';
import { fetchReviewWriteForm } from '@/features/review/api/reviewApi';
import { Card, PrimaryButton, StarRatingInput, TextField } from '@/shared/components';
import { colors, spacing } from '@/shared/constants/theme';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/queryKeys';

type Props = NativeStackScreenProps<RecommendStackParamList, 'ReviewWrite'>;

export function ReviewWriteScreen({ route }: Props) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { userId, nickname } = useAuth();
  const courseId = route.params.courseId;
  const createReviewMutation = useCreateReview(courseId);
  const { data: writeForm } = useQuery({
    queryKey: queryKeys.review.writeForm(courseId),
    queryFn: () => fetchReviewWriteForm(courseId),
  });
  const courseName = writeForm?.courseName ?? `코스 #${courseId}`;

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  const handleSave = async () => {
    const trimmed = content.trim();
    if (!trimmed) {
      Alert.alert('후기를 입력해주세요', '내용을 1자 이상 입력해 주세요.');
      return;
    }

    if (userId == null) {
      Alert.alert('로그인이 필요합니다');
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        userId,
        nickname: nickname ?? '나',
        rating,
        content: trimmed,
      });

      Alert.alert('저장 완료', '후기가 등록되었습니다.', [
        {
          text: '확인',
          onPress: () => {
            // ReviewWrite를 스택 히스토리에서 제거하고 ReviewList로만 남깁니다.
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'ReviewList',
                    params: { courseId, courseName, source: 'recommend' },
                  },
                ],
              }),
            );
          },
        },
      ]);
    } catch {
      Alert.alert('저장 실패', '후기 저장에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top + 56}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>후기 작성</Text>

        <Card>
          <Text style={styles.label}>별점 매기기</Text>
          <StarRatingInput value={rating} onChange={setRating} />
        </Card>

        <View style={{ height: spacing.lg }} />

        <TextField
          label="후기 작성"
          value={content}
          onChangeText={setContent}
          placeholder="코스에 대한 간단한 후기를 적어주세요..."
          multiline
        />

        <View style={styles.buttonWrap}>
          <PrimaryButton
            label={
              createReviewMutation.isPending ? '저장 중...' : '후기 저장하기'
            }
            onPress={handleSave}
            disabled={createReviewMutation.isPending}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  buttonWrap: { marginTop: spacing.md },
});

