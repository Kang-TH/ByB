# 코스 공개 · 추천 탭 설계

## 제품 정의 (단일 개념)

| 사용자 행동 | 의미 | DB |
|------------|------|-----|
| 코스 생성 | 나만 보는 비공개 코스 | `is_public = false` |
| **추천 코스에 공개** | 다른 사람이 **추천 코스 탭**에서 발견 | `is_public = true` |

**「다른 사람에게 공개」= 「추천 코스 탭에 노출」** — 앱·문서·API 호출 모두 이 한 가지로 통일한다.

`is_recommended`는 **운영자가 선정한 스폿라이트**용으로 두고, 회원이 공개한 코스 노출 조건에는 쓰지 않는다.

---

## 현재 백엔드와의 불일치

| API | 실제 조건 | 문제 |
|-----|-----------|------|
| `GET /course/list/recommend/*` | `is_recommended AND is_public` | 회원이 `PUT`으로 `isPublic: true`만 해도 **탭에 안 뜸** |
| `POST /course/search` | `is_public = true` (+ 키워드) | **공개 코스 목록**과 제품 정의 일치 |
| `PUT /course/{id}` | `isPublic` 반영 | **공개 API** — 앱 공개 버튼은 이것만 사용 |
| `POST /course/{id}/share` | 미배포 (500) | 사용 안 함 |

---

## 앱 구현 (기존 API만, 배포 대기 없음)

1. **공개하기** → `PUT /course/{courseId}` — 기존 필드 + `isPublic: true`
2. **추천 코스 탭 · 홈 미리보기** → `POST /course/search` (빈 키워드 = 공개 코스 전체, 정렬은 클라이언트)
3. 생성 시 `isPublic: false` 유지 → 상세에서만 공개

`GET /course/list/recommend/*`는 앱에서 **목록 소스로 사용하지 않음**.

---

## 백엔드 정렬 권장 (plogging-be)

제품 정의와 서버를 맞추려면 아래 중 하나를 적용한다.

### A안 (권장): 추천 목록 = 공개 코스

`CourseRepository` 추천 조회를 `is_public = true`만 사용하도록 변경.

```java
List<Course> findByIsPublicTrueOrderByCreatedAtDesc();
```

`like` / `distance` 변형도 `isRecommended` 조건 제거.

### B안: 공개 API 하나로 통일

`POST /course/{courseId}/publish` 또는 `PUT`에 `isPublic`만 두고, 문서상 「추천」= `is_public`.

### (선택) `MyCourseDetailResponse`

`isPublic` 필드 추가 → 앱에서 「공개됨」 배지를 서버 상태와 동기화.

---

## 검증 (서버 기동 후)

```bash
# 공개
curl -X PUT "$BASE/course/2" -H "Content-Type: application/json" -d '{"title":"...","isPublic":true,...}'

# 추천 탭 소스(앱과 동일)
curl -X POST "$BASE/course/search" -H "Content-Type: application/json" -d '{"keyword":"","sort":"POPULAR"}'
# → courseId 2 포함되어야 함
```
