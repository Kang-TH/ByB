import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { useAuth } from '@/app/providers/AuthProvider';
import { favoriteQueryKey } from '@/features/favorite/hooks/favoriteQueryKey';
import { useCourseCacheStore } from '@/features/course/store/courseCacheStore';
import { toggleFavoriteOnServer } from '@/features/favorite/api/favoriteApi';
import { getApiErrorMessage } from '@/shared/api/errors';
import { queryKeys } from '@/shared/api/queryKeys';
import type { CourseListItem } from '@/types/course';

function patchCourseFavorite(
  courses: CourseListItem[] | undefined,
  courseId: number,
  isFavorite: boolean,
): CourseListItem[] | undefined {
  if (!courses) return courses;
  return courses.map((c) =>
    c.courseId === courseId ? { ...c, isFavorite } : c,
  );
}

export function useToggleFavorite(course: CourseListItem) {
  const { userId } = useAuth();
  const courseId = course.courseId;
  const upsertCourse = useCourseCacheStore((s) => s.upsertCourse);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      upsertCourse(course);
      if (userId == null) throw new Error('로그인이 필요합니다.');
      return toggleFavoriteOnServer(courseId, userId);
    },
    onMutate: async () => {
      if (userId == null) return;

      const key = favoriteQueryKey(userId, courseId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<boolean>(key) ?? course.isFavorite ?? false;
      const next = !previous;
      queryClient.setQueryData(key, next);

      queryClient.setQueryData<CourseListItem[]>(
        queryKeys.course.publicList,
        (old) => patchCourseFavorite(old, courseId, next),
      );

      return { previous };
    },
    onError: (error, _vars, context) => {
      if (userId == null) return;
      const key = favoriteQueryKey(userId, courseId);
      if (context?.previous !== undefined) {
        queryClient.setQueryData(key, context.previous);
        queryClient.setQueryData<CourseListItem[]>(
          queryKeys.course.publicList,
          (old) => patchCourseFavorite(old, courseId, context.previous),
        );
      }
      Alert.alert('즐겨찾기 실패', getApiErrorMessage(error));
    },
    onSuccess: (res) => {
      if (userId == null) return;

      const key = favoriteQueryKey(userId, courseId);
      queryClient.setQueryData(key, res.isFavorite);

      queryClient.setQueryData<CourseListItem[]>(
        queryKeys.course.publicList,
        (old) => patchCourseFavorite(old, courseId, res.isFavorite),
      );

      upsertCourse({ ...course, isFavorite: res.isFavorite });

      void queryClient.invalidateQueries({
        queryKey: queryKeys.course.favorites(userId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.course.detail(courseId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.plogging.home,
      });
    },
  });

  return {
    isLoading: mutation.isPending,
    toggle: () => mutation.mutate(),
  };
}
