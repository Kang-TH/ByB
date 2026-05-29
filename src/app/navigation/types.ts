import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  ActivityHistory: undefined;
};

export type ReviewListParams = {
  courseId: number;
  courseName: string;
  source?: 'recommend' | 'myCourse';
};

export type ReviewWriteParams = {
  courseId: number;
  source?: 'recommend' | 'myCourse';
};

export type RecommendStackParamList = {
  RecommendList: undefined;
  CourseDetail: { courseId: number };
  ReviewList: ReviewListParams;
  ReviewWrite: ReviewWriteParams;
};

export type MyCourseStackParamList = {
  MyCourseList: undefined;
  MyCourseDetail: { courseId: number };
  ReviewList: ReviewListParams;
  ReviewWrite: ReviewWriteParams;
  CourseCreateStep1: { courseId?: number } | undefined;
  CourseCreateStep2: { courseId?: number } | undefined;
  CourseCreateStep3: { courseId?: number } | undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  ProfileSettings: undefined;
  ActivityHistory: undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  RecommendTab: NavigatorScreenParams<RecommendStackParamList>;
  MyCourseTab: NavigatorScreenParams<MyCourseStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type PloggingStackParamList = {
  PloggingActive: { courseId?: number };
  TrashBagSelect: undefined;
  TrashAmountStandard: undefined;
  TrashAmountNormal: undefined;
  PloggingComplete: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Plogging: NavigatorScreenParams<PloggingStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
