import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/app/providers/AuthProvider';
import { fetchPublicCourses } from '@/features/course/api/courseApi';
import { queryKeys } from '@/shared/api/queryKeys';

/** 추천 코스 탭: is_public=true 인 공개 코스 */
export function usePublicCourses() {
  const { userId, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.course.publicList,
    queryFn: async () => {
      const res = await fetchPublicCourses();
      return res.courses;
    },
    enabled: isAuthenticated && userId != null,
    staleTime: 60_000,
    retry: false,
  });
}
