# 06. API 연동 기준

## 환경변수

| 변수 | 예시 | 설명 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:8080` | 참고용. 개발 시 Vite는 `/api`를 `8080`으로 프록시한다. |

화면별 mock/실API 구분은 `src/STRUCTURE_GUIDE.md` 데이터 소스 표를 따른다. (`VITE_USE_MOCK` 스위치 없음)

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

`api/apiClient.js`만 envelope를 해제한다. 페이지·컴포넌트가 `response.data.data`를 직접 다루지 않는다.

## 관리자 API (실행 기준)

| API | 화면 | 상태 |
| --- | --- | --- |
| `GET /api/admin/orders/live` | SCR-009 Live | 실연동 |
| `GET /api/admin/orders` | SCR-010 목록 | 실연동 |
| `GET /api/admin/orders/{orderId}` | 상세 패널 | 실연동 |
| `PATCH /api/admin/orders/{orderId}/{status}` | Live·상태 | 실연동 |
| `GET /api/admin/menus` 등 | 메뉴 | 실연동 (저장 stub) |
| `GET/PATCH /api/admin/soldOut` | 품절 | FE mock · BE TODO |
| `GET/PATCH /api/admin/paymentMethods` | 결제수단 | FE mock · BE TODO (camel path) |
| 매출·대시보드 | 매출·대시보드 | FE mock · BE TODO |

## 주문 계약 정본

- 금액: `totalAmount`
- 취소 상태: `CANCELED`
- mock JSON의 `totalPrice` / `CANCELLED`는 legacy — API 연동 화면은 API 필드를 쓴다.
