import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/app/providers/AuthProvider';
import { fetchRecommendCourses } from '@/features/course/api/courseApi';
import { queryKeys } from '@/shared/api/queryKeys';
import type { RecommendCategory } from '@/types/course';

export function useRecommendCourses(category: RecommendCategory = 'common') {
  const { userId, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.course.recommend(category),
    queryFn: async () => {
      const res = await fetchRecommendCourses(category);
      return res.courses;
    },
    enabled: isAuthenticated && userId != null,
    staleTime: 60_000,
    retry: false,
  });
}
