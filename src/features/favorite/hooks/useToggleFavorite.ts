import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/app/providers/AuthProvider';
import { useCourseCacheStore } from '@/features/course/store/courseCacheStore';
import { toggleFavoriteOnServer } from '@/features/favorite/api/favoriteApi';
import { queryKeys } from '@/shared/api/queryKeys';
import type { CourseListItem } from '@/types/course';

export function useToggleFavorite(course: CourseListItem) {
  const { userId } = useAuth();
  const courseId = course.courseId;
  const upsertCourse = useCourseCacheStore((s) => s.upsertCourse);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      upsertCourse(course);
      if (userId == null) throw new Error('Missing userId');
      return toggleFavoriteOnServer(courseId, userId);
    },
    onSuccess: (res) => {
      queryClient.setQueryData(['favorite', userId, courseId], res.isFavorite);
      for (const cat of ['common', 'like', 'distance'] as const) {
        queryClient.invalidateQueries({ queryKey: queryKeys.course.recommend(cat) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.course.detail(courseId) });
      if (userId != null) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.course.favorites(userId),
        });
        queryClient.invalidateQueries({ queryKey: queryKeys.plogging.home });
      }
    },
  });

  return {
    isLoading: mutation.isPending,
    toggle: () => mutation.mutate(),
  };
}
