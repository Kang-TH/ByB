import type { CourseDetail } from '@/types/course';

/** 코스 테이블 user_id 와 로그인 사용자 ID 비교 */
export function isCourseCreatedByUser(
  courseUserId: number | undefined,
  currentUserId: number | null,
): boolean {
  if (courseUserId == null || currentUserId == null) return false;
  return courseUserId === currentUserId;
}

/** 수정·삭제·공개 등 소유자 전용 UI */
export function canManageCourse(
  course: Pick<CourseDetail, 'userId' | 'canEdit' | 'isOwner'>,
  currentUserId: number | null,
): boolean {
  if (course.canEdit != null) return course.canEdit;
  if (course.isOwner != null) return course.isOwner;
  return isCourseCreatedByUser(course.userId, currentUserId);
}
