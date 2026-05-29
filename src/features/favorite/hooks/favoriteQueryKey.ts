export function favoriteQueryKey(userId: number, courseId: number) {
  return ['favorite', userId, courseId] as const;
}
