import { create } from 'zustand';
import type { CourseDetail, CourseListItem } from '@/types/course';

type AnyCourse = CourseListItem | CourseDetail;

interface CourseCacheState {
  entities: Record<number, CourseListItem>;
  upsertCourses: (courses: AnyCourse[]) => void;
  upsertCourse: (course: AnyCourse) => void;
  getCourse: (courseId: number) => CourseListItem | undefined;
}

function toListItem(course: AnyCourse): CourseListItem {
  return {
    courseId: course.courseId,
    userId: course.userId,
    title: course.title,
    areaName: course.areaName,
    distance: course.distance,
    estimatedTime: course.estimatedTime,
    rating: course.rating,
    reviewCount: course.reviewCount,
    thumbnailUrl: course.thumbnailUrl,
    isFavorite: course.isFavorite,
  };
}

export const useCourseCacheStore = create<CourseCacheState>((set, get) => ({
  entities: {},

  upsertCourses: (courses) =>
    set((s) => {
      const next = { ...s.entities };
      for (const c of courses) {
        next[c.courseId] = toListItem(c);
      }
      return { entities: next };
    }),

  upsertCourse: (course) =>
    set((s) => ({
      entities: { ...s.entities, [course.courseId]: toListItem(course) },
    })),

  getCourse: (courseId) => get().entities[courseId],
}));

