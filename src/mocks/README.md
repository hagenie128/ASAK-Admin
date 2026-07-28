# 관리자 mock 안내

백엔드 준비 전에는 이 폴더에 API 계약과 동일한 필드명의 JSON fixture를 둡니다.

- 주문 목록/상세: `orderId`, `orderNo`, `orderStatus`, `paymentStatus`, `totalAmount`
- 품절: `targetType`, `targetId`, `name`, `isSoldOut`, `reasonType`
- 매출: 기간, 일별 매출, 메뉴별 판매량

mock 필드명은 `docs/api-integration-2026-07-14.md`와 백엔드 API 명세를 우선합니다.
