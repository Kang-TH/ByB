/** 코스 테이블 user_id 와 로그인 사용자 ID 비교 */
export function isCourseCreatedByUser(
  courseUserId: number | undefined,
  currentUserId: number | null,
): boolean {
  if (courseUserId == null || currentUserId == null) return false;
  return courseUserId === currentUserId;
}
