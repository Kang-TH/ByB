# iOS / Android 릴리즈 빌드 (로컬)

JS 번들이 **앱 안에 포함**됩니다. Metro·같은 Wi‑Fi·맥을 켜 둘 필요 없이, **API 서버만** 인터넷에서 접속 가능하면 어디서든 실행됩니다.

> Debug (`expo run:ios` 기본) = Mac의 Metro에서 JS를 받음 → 같은 Wi‑Fi 필요  
> **Release** = JS 포함 설치본 → 친구에게 줄 때 이 방식 사용

---

## 공통 준비 (빌드 전)

### 1. `.env` 확인

```bash
cd ~/Desktop/ByB
cp .env.example .env   # 없을 때만
```

필수 항목:

- `EXPO_PUBLIC_API_BASE_URL` — 테스터 폰이 **어디서든** 접속 가능한 주소 (공인 IP 또는 HTTPS 도메인)
- `EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY`
- `EXPO_PUBLIC_NAVER_MAP_CLIENT_ID` / `SECRET`

로컬 IP(`192.168.x.x`)만 넣으면 다른 네트워크에서는 API가 안 됩니다.

### 2. 의존성

```bash
npm install
```

### 3. 네이티브 폴더 (`ios/`, `android/`)

이미 있으면 보통 그대로 사용. 플러그인·권한을 크게 바꾼 뒤에만:

```bash
npx expo prebuild
# 꼬였을 때만: npx expo prebuild --clean
```

---

## iOS 릴리즈 → 실기기 설치

### 요구 사항

- Mac + Xcode
- iPhone USB 연결, **이 컴퓨터 신뢰**
- Apple Developer 계정 (Xcode에 로그인된 팀 — 무료/유료 모두 기기 설치 가능, 유료가 만료·기기 수에 유리)

### HTTP API (ATS)

API가 `http://` 이면 `Info.plist`에 예외가 있어야 합니다.

```bash
npm run ios:sync-ats
```

(또는 `node scripts/sync-ios-ats.mjs` — `.env`의 호스트 반영)

### 빌드 & 설치

```bash
npm run ios:release
```

내부적으로:

```bash
node scripts/sync-ios-ats.mjs
npx expo run:ios --device --configuration Release
```

여러 대 연결 시 기기 목록에서 선택합니다.

### 설치 후 (친구 폰)

1. **설정 → 일반 → VPN 및 기기 관리** → 개발자 앱 **신뢰**
2. 앱 실행 (Metro·같은 Wi‑Fi 불필요)
3. 무료 Apple ID로 서명한 경우 약 **7일** 후 만료 → Mac에 다시 연결해 재설치

### Xcode로 하는 방법 (동일)

1. `open ios/ByB.xcworkspace`
2. 상단 기기 → 친구 iPhone 선택
3. **Product → Scheme → Edit Scheme → Run → Build Configuration → Release**
4. **Product → Run** (▶)

---

## Android 릴리즈

### A. USB로 실기기에 바로 설치

```bash
npm run android:release
```

(`npx expo run:android --variant release --device`)

USB 디버깅 켜진 폰 연결, 기기 선택.

### B. APK 파일만 만들어서 공유 (친구에게 링크/카톡)

```bash
cd ~/Desktop/ByB/android
./gradlew assembleRelease
```

APK 경로:

```
android/app/build/outputs/apk/release/app-release.apk
```

친구: APK 설치 + **출처를 알 수 없는 앱** 허용.

> 현재 프로젝트는 release도 `android/app/debug.keystore`로 서명됩니다.  
> 소수 인원 APK 공유용으로는 충분합니다. Play 스토어 업로드 시에는 별도 업로드 키가 필요합니다.

### 카카오 로그인 (Android)

release APK도 **키 해시**를 카카오 콘솔에 등록해야 합니다.

```bash
npm run android:keyhash
```

(debug keystore 기준이면 release와 동일 해시일 수 있음. 로그인 실패 시 Logcat의 `[ByB] 카카오 Android 키 해시`를 콘솔에 추가.)

---

## Debug vs Release 요약

| | Debug | Release |
|---|--------|---------|
| 명령 예 | `npx expo run:ios` | `npx expo run:ios --configuration Release` |
| JS | Mac Metro | 앱에 포함 |
| 같은 Wi‑Fi | 보통 필요 | **불필요** |
| `expo start` | 필요 | **불필요** |
| 용도 | 본인 개발 | **친구 배포·실사용 테스트** |

---

## 자주 나는 문제

| 증상 | 확인 |
|------|------|
| 앱이 “서버에 연결” 실패 | `.env` API URL이 공인 IP/HTTPS인지, 빌드 **전** `.env` 수정했는지 |
| iOS HTTP 차단 | `npm run ios:sync-ats` 후 **다시** Release 빌드 |
| Android 카카오 keyHash | 카카오 콘솔 패키지 `com.anonymous.ByB` + 키 해시 |
| iOS Live Activity / 백그라운드 | Release 빌드에도 포함됨 (개발 빌드와 동일 네이티브) |
| 빌드만 오래 걸림 | 첫 빌드는 정상 (Gradle/Xcode 캐시 이후 빨라짐) |

---

## npm 스크립트

| 스크립트 | 설명 |
|----------|------|
| `npm run ios:release` | iOS Release + ATS 동기화 + 실기기 설치 |
| `npm run android:release` | Android Release 실기기 설치 |
| `npm run android:keyhash` | 카카오용 Android 키 해시 출력 |
| `npm run ios:sync-ats` | iOS HTTP 허용 (Info.plist) |

---

## 클라우드 빌드 (맥 없이 링크만 줄 때)

로컬 Release 대신 EAS:

```bash
eas build --platform android --profile preview   # APK 링크
eas build --platform ios --profile production    # iOS (Apple 계정 필요)
```

자세한 내용: [beta-release.md](./beta-release.md)
