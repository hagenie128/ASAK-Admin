# 요구사항·화면 매핑

| 기능 | 화면 파일 힌트 | API 힌트 | 완료 기준 |
| --- | --- | --- | --- |
| 로그인 | `pages/admin/LoginPage.jsx` | `auth/adminSession` (JWT TODO) | 비인증 접근 차단 |
| Live 주문 현황 | `LiveOrderPage`, `LiveOrderBoard` | API-021 `orders/live` | 카드·경과·상태 |
| 주문 관리(목록+상세) | `OrderManagePage`, `OrderTable`, `OrderDetailPanel` | API-007/008 | 필터·loading·empty·error · 패널 |
| 품절 관리 | `SoldOutManagePage` | API-009/010 (현재 mock) | 대상별 품절 반영 |
| 메뉴 관리 | `MenuManagePage`, `MenuEditPage` | API-011/012 | 목록 실연동 · 저장 stub |
| 결제수단 | `PaymentMethodPage` | API-015/016 (현재 mock) | 활성화·정렬 |
| 매출 | `SalesSummaryPage`, `SalesShareCard` | API-017~019 (현재 mock) | 기간별 요약 |

## 라우트

- **실행 정본 (AdminApp):** kebab — `/`, `/orders`, `/sold-out`, `/payment-methods`, `/sales`, …
- 정본 camel (`/soldOut`, `/paymentMethods`)과의 정렬: `TODO-069`
- 데이터 소스 표: [STRUCTURE_GUIDE.md](../STRUCTURE_GUIDE.md)

## 정본 계약과의 관계

- 상태: 검토 필요 — 현재 Admin 프론트에서 기대하는 형태.
- 정본 라우트·API 결정: [ASAK docs](../../../ASAK/docs/README.md).
- BE DTO 확인: `types/*.js`. adapter는 화면 전용 가공이 필요할 때 추가.
