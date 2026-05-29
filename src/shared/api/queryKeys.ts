export const queryKeys = {
  plogging: {
    home: ['plogging', 'home'] as const,
    history: (userId: number) => ['plogging', 'history', userId] as const,
  },
  course: {
    recommend: (category: string) => ['course', 'recommend', category] as const,
    /** is_public=true 공개 코스 목록 (추천 탭) */
    publicList: ['course', 'public'] as const,
    myList: (userId: number) => ['course', 'my', userId] as const,
    favorites: (userId: number) => ['course', 'favorites', userId] as const,
    detail: (courseId: number) => ['course', 'detail', courseId] as const,
    myDetail: (courseId: number, userId: number) =>
      ['course', 'myDetail', courseId, userId] as const,
    search: (keyword: string, sort: string) =>
      ['course', 'search', keyword, sort] as const,
  },
  review: {
    list: (courseId: number) => ['review', 'list', courseId] as const,
    writeForm: (courseId: number) => ['review', 'writeForm', courseId] as const,
  },
  profile: {
    detail: (userId: number) => ['profile', userId] as const,
  },
} as const;
