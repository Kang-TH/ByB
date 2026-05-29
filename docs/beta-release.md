# iOS / Android 베타 배포 가이드

ByB는 Expo Go가 아니라 **네이티브 빌드**가 필요합니다. 베타 테스터 배포는 **EAS Build + 스토어(TestFlight / Play 내부 테스트)** 를 권장합니다.

## 배포 전 체크리스트

| 항목 | 현재 | 베타 전 권장 |
|------|------|----------------|
| 번들 ID | `com.anonymous.ByB` | 팀 도메인으로 변경 (예: `com.yourteam.byB`) — iOS/Android·카카오·네이버 콘솔 모두 동일하게 |
| API | HTTP 가능 (`180.229...`) | 운영은 **HTTPS** 권장 (iOS ATS·보안) |
| Android 서명 | release도 `debug.keystore` | **업로드 키** 별도 생성 (Play 필수) |
| 카카오 Android | debug 키 해시만 | **release 키 해시** 추가 등록 |
| `.env` | 로컬 | EAS **Secrets** 또는 빌드 시 env 주입 |
| Apple | — | [Apple Developer Program](https://developer.apple.com/programs/) (연 $99) |
| Google | — | [Google Play Console](https://play.google.com/console) ($25 1회) |

---

## 1. EAS 초기 설정 (한 번)

```bash
npm install -g eas-cli
eas login
cd ~/Desktop/ByB
eas init
```

`eas.json` 이 생성됩니다. 프로젝트 루트에 아래 예시를 참고해 `production` 프로필을 추가하세요.

### 환경 변수 (EAS Secrets)

`app.config.ts` 가 빌드 시 `.env` 를 읽습니다. 클라우드 빌드에서는 **Secrets** 로 넣는 것이 안전합니다.

```bash
eas secret:create --scope project --name EXPO_PUBLIC_API_BASE_URL --value "https://your-api.example.com/api/v1"
eas secret:create --scope project --name EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY --value "your-kakao-native-key"
eas secret:create --scope project --name EXPO_PUBLIC_NAVER_MAP_CLIENT_ID --value "your-naver-client-id"
eas secret:create --scope project --name EXPO_PUBLIC_NAVER_MAP_CLIENT_SECRET --value "your-naver-secret"
```

HTTP API 를 쓰면 iOS `app.config.ts` 의 ATS 예외가 prebuild 에 반영되도록, 빌드 전 `.env` 와 동일한 URL 을 Secret 에 넣으세요.

### `eas.json` 예시

```json
{
  "cli": { "version": ">= 16.0.0", "appVersionSource": "remote" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "autoIncrement": true,
      "android": { "buildType": "app-bundle" },
      "ios": { "resourceClass": "m-medium" }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "1234567890",
        "appleTeamId": "Q3468B6942"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

- **preview**: APK 로 빠르게 내부 공유 (Play 없이 링크만 줄 때)
- **production**: TestFlight / Play **내부 테스트**용 (AAB + IPA)

`app.json` 에 추가 권장:

```json
"extra": { "eas": { "projectId": "eas-init-후-생성된-uuid" } }
```

(`eas init` 이 `app.config` 에 projectId 를 넣어 줄 수 있음)

---

## 2. iOS → TestFlight (베타 테스터)

### 2-1. App Store Connect

1. [App Store Connect](https://appstoreconnect.apple.com/) → **앱** → **+** 새 앱
2. 번들 ID = Xcode/EAS 와 동일 (`com.anonymous.ByB` 또는 변경한 ID)
3. **TestFlight** 탭 활성화

### 2-2. 빌드

```bash
eas build --platform ios --profile production
```

첫 빌드 시 Apple 인증서·프로비저닝은 EAS 가 안내에 따라 생성합니다.

### 2-3. 업로드 (제출)

```bash
eas submit --platform ios --latest
```

또는 빌드와 한 번에:

```bash
eas build --platform ios --profile production --auto-submit
```

### 2-4. 테스터 초대

1. App Store Connect → TestFlight → 빌드 처리 완료(Processing 끝) 대기
2. **내부 테스트**: 팀원 Apple ID (최대 100명, 심사 없음)
3. **외부 테스트**: 이메일 초대, 첫 빌드는 **Beta App Review** 1회 필요

테스터는 iPhone 에 **TestFlight** 앱 설치 후 초대 수락.

### iOS 참고 (ByB)

- Live Activity / 백그라운드 위치 → production 프로비저닝에 포함되는지 EAS 빌드 로그 확인
- HTTP API → `app.config.ts` ATS 예외가 production 빌드에 포함되는지 확인

---

## 3. Android → Play 내부 테스트

### 3-1. Play Console

1. [Google Play Console](https://play.google.com/console/) → **앱 만들기**
2. 패키지명 = `com.anonymous.ByB` (또는 변경한 package)
3. **내부 테스트** 트랙 생성

### 3-2. 업로드 키 (필수)

현재 `android/app/build.gradle` 의 release 가 **debug.keystore** 를 쓰고 있으면 스토어 배포에 부적합합니다.

**EAS 사용 시** (권장): EAS 가 release keystore 를 관리합니다.

```bash
eas credentials
```

Android → production → Keystore 생성/업로드.

**로컬 Gradle** 을 쓸 경우: [React Native 서명 문서](https://reactnative.dev/docs/signed-apk-android) 대로 `release` signingConfig 설정.

### 3-3. 카카오 release 키 해시

Play/EAS **release** 서명으로 빌드한 APK 의 키 해시를 카카오 콘솔에 **추가** 등록해야 로그인됩니다.

- EAS credentials 에서 SHA-1 확인 후 [카카오 키 해시 생성](https://developers.kakao.com/docs/latest/ko/android/getting-started#register-key-hash) 참고
- 또는 release 빌드 APK 설치 후 Logcat 의 `[ByB] 카카오 Android 키 해시` 확인 (개발 빌드와 다름)

### 3-4. 빌드 & 제출

```bash
eas build --platform android --profile production
eas submit --platform android --latest
```

`submit` 은 Play Console **서비스 계정 JSON** 이 필요합니다.  
[Expo: Google Play 제출](https://docs.expo.dev/submit/android/)

### 3-5. 테스터 초대

Play Console → **내부 테스트** → 테스터 이메일 목록 추가 → **링크 공유**  
(최대 100명, 스토어 심사 없이 설치 가능)

### Android 대안: APK만 빠르게

Play 없이 링크만 줄 때:

```bash
eas build --platform android --profile preview
```

빌드 완료 후 EAS 페이지에서 **APK 다운로드 링크** 공유 (테스터는 “출처를 알 수 없는 앱” 허용 필요).

---

## 4. 한 번에 iOS + Android

```bash
# 버전 올리기 (선택)
# app.json 의 version / ios.buildNumber / android.versionCode

eas build --platform all --profile production
```

완료 후:

```bash
eas submit --platform ios --latest
eas submit --platform android --latest
```

---

## 5. 베타 전 최종 점검

- [ ] `version` / `versionCode` / `buildNumber` 증가
- [ ] API·카카오·네이버 키가 **프로덕션** 값인지
- [ ] 카카오: iOS 번들 ID, Android 패키지명 + **debug·release 키 해시**
- [ ] 네이버 Maps: 앱 패키지/번들 ID 허용 목록
- [ ] 플로깅: 백그라운드 위치·알림·(iOS) Live Activity 실기기 확인
- [ ] 로그인 → 홈 → 플로깅 → 종료 플로우

---

## 6. 자주 쓰는 명령 요약

| 목적 | 명령 |
|------|------|
| iOS 베타 빌드 | `eas build -p ios --profile production` |
| Android 베타 빌드 | `eas build -p android --profile production` |
| TestFlight 업로드 | `eas submit -p ios --latest` |
| Play 내부 테스트 업로드 | `eas submit -p android --latest` |
| 빌드 상태 | `eas build:list` |
| 로컬 개발 (베타 X) | `npx expo run:ios` / `run:android` |

---

## 7. 로컬만 쓸 때 (EAS 없이)

| 플랫폼 | 방법 |
|--------|------|
| iOS | Xcode → Product → Archive → Distribute App → TestFlight |
| Android | `cd android && ./gradlew bundleRelease` → Play Console에 AAB 수동 업로드 |

네이티브 설정·서명을 직접 관리해야 해서 **EAS 권장**입니다.

---

## 관련 문서

- [플로깅 백그라운드](./plogging-background.md)
- [카카오 Android 키 해시](./kakao-android-keyhash.md)
- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [Expo EAS Submit](https://docs.expo.dev/submit/introduction/)
