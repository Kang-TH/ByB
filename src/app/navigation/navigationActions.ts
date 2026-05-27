import { CommonActions } from '@react-navigation/native';

/** Main 탭 순서 (Tab.Navigator routes 순서와 동일) */
const MAIN_TABS = ['HomeTab', 'RecommendTab', 'MyCourseTab', 'ProfileTab'] as const;

export type MainTabName = (typeof MAIN_TABS)[number];

const TAB_ROOT_SCREEN: Record<MainTabName, string> = {
  HomeTab: 'Home',
  RecommendTab: 'RecommendList',
  MyCourseTab: 'MyCourseList',
  ProfileTab: 'Profile',
};

export type NavStackEntry = {
  name: string;
  params?: object;
};

function nestedStack(routes: NavStackEntry[]) {
  return {
    routes: routes.map((r) =>
      r.params !== undefined ? { name: r.name, params: r.params } : { name: r.name },
    ),
    index: routes.length - 1,
  };
}

function buildMainTabRoutes(activeTab: MainTabName, activeStack?: NavStackEntry[]) {
  return MAIN_TABS.map((tab) => {
    const stack =
      tab === activeTab
        ? activeStack ?? [{ name: TAB_ROOT_SCREEN[tab] }]
        : [{ name: TAB_ROOT_SCREEN[tab] }];
    return {
      name: tab,
      state: nestedStack(stack),
    };
  });
}

/**
 * 루트를 Main만 남기고, 모든 탭 스택을 초기화한 뒤 activeTab만 원하는 화면으로 구성.
 * (비활성 탭에 ReviewWrite 등이 남는 문제 방지)
 */
export function resetRootToMain(options: {
  activeTab: MainTabName;
  stack?: NavStackEntry[];
}) {
  const tabRoutes = buildMainTabRoutes(options.activeTab, options.stack);
  const tabIndex = MAIN_TABS.indexOf(options.activeTab);

  return CommonActions.reset({
    index: 0,
    routes: [
      {
        name: 'Main',
        state: {
          routes: tabRoutes,
          index: tabIndex,
        },
      },
    ],
  });
}

/** Main + Plogging 모달. 플로깅 스택은 항상 Active 한 장만. */
export function resetRootToMainWithPlogging(
  ploggingParams: { courseId?: number } | undefined,
  main: { activeTab: MainTabName; stack?: NavStackEntry[] },
) {
  const tabRoutes = buildMainTabRoutes(main.activeTab, main.stack);
  const tabIndex = MAIN_TABS.indexOf(main.activeTab);

  return CommonActions.reset({
    index: 1,
    routes: [
      {
        name: 'Main',
        state: {
          routes: tabRoutes,
          index: tabIndex,
        },
      },
      {
        name: 'Plogging',
        state: nestedStack([{ name: 'PloggingActive', params: ploggingParams }]),
      },
    ],
  });
}

export function getTabRootScreen(tab: MainTabName): string {
  return TAB_ROOT_SCREEN[tab];
}
