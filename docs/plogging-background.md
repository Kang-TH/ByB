# 플로깅 백그라운드 기록

## 동작

- 플로깅 시작 시 **백그라운드 위치 추적** (`expo-location` + `expo-task-manager`)
- **Android**: 백그라운드 위치 + **포그라운드 서비스 알림** (경로·거리 표시, 홈/다른 앱으로 나가도 GPS 기록)
- **iOS 16.2+**: Live Activity / Dynamic Island (`expo-live-activity`, 경과 타이머 + 거리)
- 플로깅 완료 화면에서 저장·나가기 시 추적·알림·Live Activity 종료

## 개발 빌드 필수 (백그라운드·다이나믹 아일랜드)

Expo Go에서는 `ExpoTaskManager` 네이티브 모듈이 없어 **앱은 실행**되지만, 플로깅은 **앱을 켜 둔 동안만** GPS가 기록됩니다.  
백그라운드 기록·Android 알림·iOS Live Activity를 쓰려면 아래처럼 **개발 빌드**가 필요합니다.

```bash
npx expo prebuild --clean
npx expo run:ios
# 또는
npx expo run:android
```

## 권한

- iOS: 사용 중 + **항상** 위치 (백그라운드)
- Android: 정확한 위치 + **백그라운드 위치** (설정에서 **항상 허용**) + 알림 권한(Android 13+)
- 플로깅 시작 시 「항상 허용」을 선택하지 않으면 설정 안내가 뜹니다.

## UI

- 플로깅 중에는 기록 화면만 유지 (모달 스와이프·Android 뒤로가기 차단)
- 홈 탭으로 나가는 UX는 제공하지 않음
