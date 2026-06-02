# ByB — 플로깅 앱 (React Native)

Expo + TypeScript 기반 플로깅 앱 프론트엔드입니다.

## 시작하기

```bash
cp .env.example .env
npm install
npm start
```

`.env`에 백엔드([plogging-be](https://github.com/HyeonSeongIM/plogging-be)) 주소를 설정하세요.

```
EXPO_PUBLIC_API_BASE_URL=http://YOUR_HOST:8080/api/v1
EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY=your-kakao-native-app-key
EXPO_PUBLIC_NAVER_MAP_CLIENT_ID=your-naver-map-client-id
EXPO_PUBLIC_NAVER_MAP_CLIENT_SECRET=your-naver-map-client-secret
```

지도·주소는 **네이버 Maps**(SDK + Reverse Geocoding). 카카오는 **로그인**에만 사용합니다.  
콘솔에서 Maps **Reverse Geocoding** API를 켜고, Client ID·Secret을 `.env`에 넣어 주세요.

### 카카오 로그인 설정

1. [Kakao Developers](https://developers.kakao.com/)에서 앱 생성
2. **플랫폼** 등록  
   - Android: 패키지 `com.anonymous.ByB`  
   - iOS: 번들 ID `com.anonymous.ByB`
3. **카카오 로그인** 활성화 → Redirect URI는 네이티브 SDK 사용 시 필수 아님
4. **네이티브 앱 키**를 `.env`의 `EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY`에 입력
5. Android는 **키 해시** 등록 필요 — [`docs/kakao-android-keyhash.md`](docs/kakao-android-keyhash.md), `npm run android:keyhash`
6. 네이티브 변경 후: `npx expo prebuild` → `npx expo run:android` (Expo Go 불가)

### 릴리즈 빌드

- [docs/release-build-local.md](docs/release-build-local.md)
- iOS: `npm run ios:release` (USB 실기기)
- Android: `npm run android:release` 또는 `cd android && ./gradlew assembleRelease` → APK 공유

## 프로젝트 구조

```
src/
├── app/
│   ├── navigation/     # Root, Tab, Stack navigators
│   └── providers/      # Auth, React Query
├── features/           # 도메인별 화면·API·스토어
│   ├── auth/
│   ├── home/
│   ├── plogging/
│   ├── course/
│   ├── review/
│   └── profile/
├── shared/
│   ├── api/            # axios client, query keys
│   ├── components/
│   ├── constants/
│   └── utils/
└── types/              # API DTO 타입
```

## 주요 스크립트

| 명령 | 설명 |
|------|------|
| `npm start` | Expo 개발 서버 |
| `npm run ios` | iOS 시뮬레이터 |
| `npm run android` | Android 에뮬레이터 |

## 다음 작업

- [x] 카카오 로그인 SDK 연동 (`@react-native-kakao` + 서버 `POST /login`)
- [ ] 프로필 설정 저장 UI → `PUT /profile/{userId}` 연결
- [ ] 코스 검색/등록 화면 API 연결

## 경로 별칭

`@/` → `src/` (tsconfig paths)
