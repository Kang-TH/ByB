import { useMemo } from 'react';
import { usePublicCourses } from '@/features/course/hooks/usePublicCourses';

/** 서버 상세 응답에 isPublic이 없을 때 추천 탭 공개 목록으로 판별 */
export function useIsCoursePublished(
  courseId: number,
  isPublicFromDetail?: boolean,
): boolean {
  const { data: publicCourses } = usePublicCourses();

  return useMemo(() => {
    if (isPublicFromDetail === true) return true;
    return publicCourses?.some((c) => c.courseId === courseId) ?? false;
  }, [courseId, isPublicFromDetail, publicCourses]);
}
