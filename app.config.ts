import { config as loadEnv } from 'dotenv';
import type { ConfigContext, ExpoConfig } from 'expo/config';
import path from 'path';
import appJson from './app.json';

// prebuild 시에도 .env 를 읽도록 (Expo Go / run 은 자동 로드되나 config 단계는 별도)
loadEnv({ path: path.resolve(process.cwd(), '.env') });

const kakaoNativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY?.trim() ?? '';
const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ?? '';
const naverMapClientId = process.env.EXPO_PUBLIC_NAVER_MAP_CLIENT_ID?.trim() ?? '';

/** iOS ATS: http API 호스트만 허용 (HTTPS면 설정 불필요) */
function buildHttpTransportSecurity(
  baseUrl: string,
): Record<string, unknown> | undefined {
  if (!baseUrl.startsWith('http://')) {
    return undefined;
  }
  try {
    const { hostname } = new URL(baseUrl);
    if (!hostname) {
      return undefined;
    }
    return {
      NSAppTransportSecurity: {
        NSExceptionDomains: {
          [hostname]: {
            NSExceptionAllowsInsecureHTTPLoads: true,
            NSIncludesSubdomains: true,
          },
        },
      },
    };
  } catch {
    return undefined;
  }
}

const httpTransportSecurity = buildHttpTransportSecurity(apiBaseUrl);
const usesHttpApi = apiBaseUrl.startsWith('http://');

/** expo.ios.infoPlist 에 ATS 예외 병합 (expo-build-properties 는 iOS infoPlist 미지원) */
function mergeIosInfoPlist(
  base: Record<string, unknown>,
  ats?: Record<string, unknown>,
): Record<string, unknown> {
  if (!ats?.NSAppTransportSecurity) {
    return base;
  }
  const incoming = ats.NSAppTransportSecurity as Record<string, unknown>;
  const existing = (base.NSAppTransportSecurity as Record<string, unknown>) ?? {};
  const existingDomains =
    (existing.NSExceptionDomains as Record<string, unknown>) ?? {};
  const incomingDomains =
    (incoming.NSExceptionDomains as Record<string, unknown>) ?? {};
  return {
    ...base,
    NSAppTransportSecurity: {
      ...existing,
      ...incoming,
      NSExceptionDomains: {
        ...existingDomains,
        ...incomingDomains,
      },
    },
  };
}

if (!kakaoNativeAppKey) {
  throw new Error(
    [
      '[ByB] EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY 가 비어 있습니다.',
      '1) cp .env.example .env',
      '2) 카카오 Developers → 앱 키 → 네이티브 앱 키를 .env 에 넣기',
      '3) npx expo prebuild 다시 실행',
    ].join('\n'),
  );
}

if (!naverMapClientId) {
  throw new Error(
    [
      '[ByB] EXPO_PUBLIC_NAVER_MAP_CLIENT_ID 가 비어 있습니다.',
      '1) 네이버 클라우드 콘솔 → Application → Client ID',
      '2) .env 에 EXPO_PUBLIC_NAVER_MAP_CLIENT_ID, EXPO_PUBLIC_NAVER_MAP_CLIENT_SECRET 설정',
      '3) npx expo prebuild 다시 실행',
    ].join('\n'),
  );
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const basePlugins = (appJson.expo.plugins ?? []) as ExpoConfig['plugins'];

  const plugins = (basePlugins ?? [])
    .filter((plugin) => plugin !== '@react-native-kakao/core')
    .map((plugin) => {
      if (
        plugin === '@mj-studio/react-native-naver-map' ||
        (Array.isArray(plugin) && plugin[0] === '@mj-studio/react-native-naver-map')
      ) {
        return [
          '@mj-studio/react-native-naver-map',
          { client_id: naverMapClientId },
        ];
      }
      if (Array.isArray(plugin) && plugin[0] === 'expo-build-properties') {
        const options = (plugin[1] ?? {}) as {
          android?: { extraMavenRepos?: string[] };
        };
        const repos = options.android?.extraMavenRepos ?? [];
        return [
          'expo-build-properties',
          {
            ...options,
            android: {
              ...options.android,
              ...(usesHttpApi ? { usesCleartextTraffic: true } : {}),
              extraMavenRepos: [
                ...repos,
                'https://devrepo.kakao.com/nexus/content/groups/public/',
              ],
            },
          },
        ];
      }
      return plugin;
    }) as ExpoConfig['plugins'];

  plugins?.push([
    '@react-native-kakao/core',
    {
      nativeAppKey: kakaoNativeAppKey,
      android: {
        authCodeHandlerActivity: true,
      },
      ios: {
        handleKakaoOpenUrl: true,
      },
    },
  ]);

  const baseIosInfoPlist = (appJson.expo.ios?.infoPlist ?? {}) as Record<
    string,
    unknown
  >;

  return {
    ...config,
    name: appJson.expo.name,
    slug: appJson.expo.slug,
    version: appJson.expo.version,
    orientation: 'portrait',
    icon: appJson.expo.icon,
    userInterfaceStyle: appJson.expo.userInterfaceStyle as 'light',
    ios: {
      ...appJson.expo.ios,
      infoPlist: mergeIosInfoPlist(baseIosInfoPlist, httpTransportSecurity),
    },
    android: appJson.expo.android,
    web: appJson.expo.web,
    plugins: plugins as ExpoConfig['plugins'],
  };
};
