# 카카오 Android 키 해시 등록

`android keyHash validation failed` 는 **카카오 Developers에 이 빌드의 서명 키 해시가 없을 때** 발생합니다.

## 1. 카카오 콘솔 설정

1. [Kakao Developers](https://developers.kakao.com/) → **내 애플리케이션** 선택
2. **앱 설정 → 플랫폼 → Android** 추가/수정
3. **패키지명**: `com.anonymous.ByB`
4. **키 해시**에 아래 값 등록 (여러 줄 가능 — debug / release 각각)

### 이 프로젝트 debug 빌드 (`android/app/debug.keystore`)

```
Xo8WBi6jzSxKDVR4drqm84yr9iU=
```

> `npx expo run:android` 로 설치한 개발 빌드는 위 keystore를 씁니다.  
> PC마다 keystore가 다르면 해시도 달라질 수 있습니다.

5. **저장** 후 1~2분 기다렸다가 앱에서 다시 카카오 로그인

## 2. 내 기기용 해시 확인 (콘솔 값과 다를 때)

### 방법 A — 앱 로그 (권장)

개발 빌드로 로그인 화면을 열면 Metro / Logcat에 다음이 출력됩니다.

```
[ByB] 카카오 Android 키 해시 — developers.kakao.com > ...
xxxxxxxxxxxxxxxxxxxxxxxxxxx=
```

이 문자열을 카카오 콘솔에 **그대로** 등록합니다.

### 방법 B — 터미널 (Mac)

```bash
"/Applications/Android Studio.app/Contents/jbr/Contents/Home/bin/keytool" \
  -exportcert -alias androiddebugkey \
  -keystore android/app/debug.keystore \
  -storepass android -keypass android \
  | openssl sha1 -binary | openssl base64
```

또는:

```bash
npm run android:keyhash
```

## 3. 체크리스트

- [ ] `.env`의 `EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY` = 카카오 **네이티브 앱 키**
- [ ] Android 플랫폼 **패키지명** `com.anonymous.ByB`
- [ ] **키 해시** 등록 (debug)
- [ ] 카카오 로그인 **활성화** ON
- [ ] 앱 **재설치 없이** 다시 로그인 시도 (캐시 이슈 시 앱 삭제 후 재설치)

## 4. release / Play Store

Play App Signing을 쓰면 **업로드 키** / **앱 서명 키** 해시를 각각 등록해야 할 수 있습니다.  
release용 keystore를 바꾸면 해시도 다시 등록하세요.
