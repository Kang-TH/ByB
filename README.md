# ByB — 플로깅 앱 (React Native)

Expo + TypeScript 기반 플로깅 앱 프론트엔드입니다.

## 시작하기

```bash
cp .env.example .env
npm install
npm start
```

`.env`에 백엔드 주소를 설정하세요.

```
EXPO_PUBLIC_API_BASE_URL=http://YOUR_HOST:8080/api/v1
```

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

- [ ] 카카오 로그인 SDK 연동 (`useKakaoLogin` mock 제거)
- [ ] 지도 SDK 연동 (코스 경로, 플로깅 중 지도)
- [ ] React Query hooks로 화면 데이터 연결
- [ ] 자유 플로깅 종료 API path 백엔드와 확정

## 경로 별칭

`@/` → `src/` (tsconfig paths)
