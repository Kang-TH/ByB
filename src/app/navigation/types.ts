import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  ActivityHistory: undefined;
};

export type RecommendStackParamList = {
  RecommendList: undefined;
  CourseDetail: { courseId: number };
  ReviewList: {
    courseId: number;
    courseName: string;
    source?: 'recommend' | 'myCourse';
  };
  ReviewWrite: { courseId: number };
};

export type MyCourseStackParamList = {
  MyCourseList: undefined;
  MyCourseDetail: { courseId: number };
  CourseCreateStep1: undefined;
  CourseCreateStep2: undefined;
  CourseCreateStep3: undefined;
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
