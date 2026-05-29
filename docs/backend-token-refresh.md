# 토큰 갱신 API (plogging-be)

앱은 로그아웃 전까지 로그인을 유지하기 위해 **access 토큰 만료(기본 1시간) 시 자동 갱신**을 시도합니다.

앱은 **`POST /api/v1/token/refresh`만** 사용합니다. (카카오는 로그인 화면에서만 사용)

refresh가 실패하면 사용자는 **로그아웃 후 카카오로 다시 로그인**해야 합니다.  
백엔드 refresh API 배포 시 **최대 30일**(현재 `jwt.refresh-token-expiration`) 동안 access 토큰을 갱신할 수 있습니다.

## 제안 스펙

### `POST /api/v1/token/refresh`

**Request**

```json
{
  "refreshToken": "eyJ..."
}
```

**Response** — `LoginResponse` 와 동일

```json
{
  "userId": 1,
  "nickname": "닉네임",
  "profileImageUrl": null,
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "isNewUser": false
}
```

**Errors**

- `401` — refresh 만료/무효 → 앱이 로그아웃 처리

## 구현 참고

- `JwtUtil`에서 refresh 토큰 검증 후 새 access + (선택) refresh rotation
- Security: `/api/v1/token/refresh`, `/api/v1/login` 은 인증 없이 허용

배포 후 앱은 별도 수정 없이 1번 경로를 먼저 사용합니다.
