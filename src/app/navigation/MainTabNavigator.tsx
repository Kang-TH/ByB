import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator, type BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackActions, type EventArg } from '@react-navigation/native';
import type { MainTabParamList } from '@/app/navigation/types';
import type { MainTabName } from '@/app/navigation/navigationActions';
import { HomeStack } from '@/app/navigation/HomeStack';
import { RecommendStack } from '@/app/navigation/RecommendStack';
import { MyCourseStack } from '@/app/navigation/MyCourseStack';
import { ProfileStack } from '@/app/navigation/ProfileStack';
import { colors } from '@/shared/constants/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabIconName = React.ComponentProps<typeof Ionicons>['name'];

function getTabStackState(
  navigation: BottomTabNavigationProp<MainTabParamList>,
  tabName: MainTabName,
) {
  const tabRoute = navigation.getState().routes.find((r) => r.name === tabName);
  return tabRoute?.state;
}

function popTabStackToRoot(
  navigation: BottomTabNavigationProp<MainTabParamList>,
  tabName: MainTabName,
) {
  const stackState = getTabStackState(navigation, tabName);
  if (
    stackState &&
    typeof stackState.index === 'number' &&
    stackState.index > 0 &&
    stackState.key
  ) {
    navigation.dispatch({
      ...StackActions.popToTop(),
      target: stackState.key,
    });
  }
}

/** 탭 전환은 기본 동작(애니 없음). 같은 탭 재탭·다른 탭으로 나갈 때만 스택 루트로 */
function tabStackRootListeners() {
  return ({
    navigation,
    route,
  }: {
    navigation: BottomTabNavigationProp<MainTabParamList>;
    route: { name: MainTabName };
  }) => ({
    tabPress: (e: EventArg<'tabPress', true>) => {
      const state = navigation.getState();
      const focusedRoute = state.routes[state.index];

      if (focusedRoute.name !== route.name) {
        return;
      }

      const stackState = getTabStackState(navigation, route.name);
      if (
        stackState &&
        typeof stackState.index === 'number' &&
        stackState.index > 0
      ) {
        e.preventDefault();
        popTabStackToRoot(navigation, route.name);
      }
    },
    blur: () => {
      popTabStackToRoot(navigation, route.name);
    },
  });
}

function TabIcon({
  name,
  focusedName,
  focused,
  color,
  size,
}: {
  name: TabIconName;
  focusedName: TabIconName;
  focused: boolean;
  color: string;
  size: number;
}) {
  return (
    <Ionicons name={focused ? focusedName : name} size={size} color={color} />
  );
}

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        // 탭 전환 시 슬라이드 없음. 스택 내부 push 애니메이션은 각 Stack에서 유지.
        animation: 'none',
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.background,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        listeners={tabStackRootListeners()}
        options={{
          title: '홈',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="home-outline"
              focusedName="home"
              focused={focused}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="RecommendTab"
        component={RecommendStack}
        listeners={tabStackRootListeners()}
        options={{
          title: '추천 코스',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="map-outline"
              focusedName="map"
              focused={focused}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyCourseTab"
        component={MyCourseStack}
        listeners={tabStackRootListeners()}
        options={{
          title: '내 코스',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="bookmark-outline"
              focusedName="bookmark"
              focused={focused}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        listeners={tabStackRootListeners()}
        options={{
          title: '마이',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="person-outline"
              focusedName="person"
              focused={focused}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

