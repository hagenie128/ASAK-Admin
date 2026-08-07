# 02. 프론트 구조와 책임 경계

## 원칙

- 관리자 UI, 관리자 권한, 관리자 API만 이 저장소에 둔다.
- 페이지는 데이터를 직접 요청하지 않고 `api/` 모듈을 통해 요청한다.
- 공통 상태는 Zustand store로, 서버 데이터는 요청 단위로 관리한다.
- API 응답 형식은 `{ success, status, code, message, data }`로 통일한다.

## 권장 확장 구조

```text
src/
  apps/
    AdminApp.jsx             # 최상위 레이아웃과 라우트 조합
    pages/                   # 화면 단위: orders, sold-out, menus, sales
    components/              # 재사용 가능한 관리자 UI
  api/
    apiClient.js             # base URL, envelope
    ordersApi.js             # GET/PATCH 주문 API
    menusApi.js              # 메뉴 목록·상세
    # salesApi / soldOutApi / paymentMethodsApi / adminApi — 미구현 셸
    soldOut.js               # 품절 API
  store/                     # 로그인 세션, 화면 공통 상태
  styles/                    # 토큰, 레이아웃, 공통 스타일
```

## 책임 분리

| 영역 | 책임 | 금지 |
| --- | --- | --- |
| Page | URL 상태, 화면 조합, 사용자 흐름 | axios 직접 호출, 전역 스타일 남용 |
| Component | 표시와 사용자 입력 | 서버 URL/권한 정책 결정 |
| API module | 요청·응답 변환 | JSX 또는 DOM 접근 |
| Store | 세션·필터 등 공유 클라이언트 상태 | 서버 응답을 임의로 영구 캐시 |

관리자 로그인이 구현되면 보호 라우트를 추가하고, 인증 전에는 주문/매출 화면을 렌더링하지 않습니다.
