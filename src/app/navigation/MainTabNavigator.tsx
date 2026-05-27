import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator, type BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { type EventArg } from '@react-navigation/native';
import type { MainTabParamList } from '@/app/navigation/types';
import { resetRootToMain, type MainTabName } from '@/app/navigation/navigationActions';
import { HomeStack } from '@/app/navigation/HomeStack';
import { RecommendStack } from '@/app/navigation/RecommendStack';
import { MyCourseStack } from '@/app/navigation/MyCourseStack';
import { ProfileStack } from '@/app/navigation/ProfileStack';
import { colors } from '@/shared/constants/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabIconName = React.ComponentProps<typeof Ionicons>['name'];

/**
 * 하단 탭 버튼 클릭 시마다 네비게이션 레이어를 전부 제거하고,
 * 해당 탭의 기본 화면(루트)만 남깁니다.
 */
function tabResetToRootListener() {
  return ({
    navigation,
    route,
  }: {
    navigation: BottomTabNavigationProp<MainTabParamList>;
    route: { name: MainTabName };
  }) => ({
    tabPress: (e: EventArg<'tabPress', true>) => {
      e.preventDefault();
      navigation.dispatch(resetRootToMain({ activeTab: route.name }));
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
        // 하단 탭 버튼(탭 전환) 애니메이션을 끕니다.
        // NativeStack의 화면 내부 버튼 이동 애니메이션은 유지됩니다.
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
        listeners={tabResetToRootListener()}
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
        listeners={tabResetToRootListener()}
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
        listeners={tabResetToRootListener()}
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
        listeners={tabResetToRootListener()}
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

