import { useEffect } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { fetchAllCoursesForCache } from '@/features/course/api/courseApi';
import { useCourseCacheStore } from '@/features/course/store/courseCacheStore';

/** mockDb 코스를 캐시에 시드 (즐겨찾기 탭 등에서 메타 표시용) */
export function SeedMockCourseCatalog() {
  const { userId } = useAuth();
  const upsertCourses = useCourseCacheStore((s) => s.upsertCourses);

  useEffect(() => {
    if (userId == null) return;
    upsertCourses(fetchAllCoursesForCache(userId));
  }, [userId, upsertCourses]);

  return null;
}
