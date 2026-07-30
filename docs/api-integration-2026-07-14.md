# 06. API 연동 기준

## 환경변수

| 변수 | 예시 | 설명 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:8080` | 백엔드 API 기본 주소 |
| `VITE_USE_MOCK` | `true` | mock 사용 여부 |

## 응답 규격

```json
{
  "success": true,
  "status": 200,
  "code": "OK",
  "message": "success",
  "data": {}
}
```

`api/client.js`의 `unwrapResponse`만 envelope를 해제합니다. 페이지와 컴포넌트가 `response.data.data`를 직접 다루지 않도록 합니다.

## 관리자 API 우선순위

| API | 화면 | 핵심 필드 |
| --- | --- | --- |
| `GET /api/admin/orders/active` | SCR-009 실시간 주문 현황 | orderId, orderNo, orderStatus, totalAmount, createdAt, items |
| `GET /api/admin/orders` | SCR-010 주문 목록 | orderNo, orderStatus, paymentStatus, totalAmount |
| `PATCH /api/admin/orders/{orderId}/{status}` | 주문 상세 | path: orderId, status (`PREPARING` 또는 `COMPLETED`) |
| `GET/PATCH /api/admin/sold-out-items` | 품절 관리 | targetType, targetId, isSoldOut |
| 메뉴·결제수단·매출 API | 운영 설정 | 별도 계약 확정 후 연결 |

## 주문 계약 정본

- API와 신규 DTO의 금액 필드는 `totalAmount`를 사용한다.
- 주문 취소 상태 enum은 `CANCELED`를 사용한다.
- 현재 `asak-admin-data.json`의 `totalPrice`, `CANCELLED`는 legacy mock 표기다.
  실제 API 연결 시 repository/adapter에서 각각 `totalAmount`, `CANCELED`로 정규화한다.
  Page와 컴포넌트는 API 원본과 legacy mock 필드를 섞어 직접 처리하지 않는다.

## 오류 처리

- 401: 로그인 화면 또는 세션 갱신 흐름으로 이동
- 403: 권한 없음 안내, 재시도 버튼을 제공하지 않음
- 409: 최신 상태 재조회 후 사용자에게 변경 충돌 안내
- 5xx/네트워크: 사용자가 재시도할 수 있는 오류 UI 제공
