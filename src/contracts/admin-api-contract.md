# 관리자 API 연결 계약 초안

> 상태: 주문·메뉴 일부 실연동. 품절·결제·매출·대시보드는 mock.
> 화면별 소스: [STRUCTURE_GUIDE.md](../STRUCTURE_GUIDE.md)

## 화면별 연결

| 화면 | API / types | 상태 |
| --- | --- | --- |
| Live·주문 관리 | `ordersApi.js`, `types/adminOrder.js` | 실연동 |
| 메뉴 | `menusApi.js`, `types/menu.js` | 목록 실연동 · 저장 stub |
| 품절 | `soldOutApi.js`(셸), `types/soldOut.js` | mock |
| 결제수단 | `paymentMethodsApi.js`(셸), `types/paymentMethod.js` | mock · BE `/paymentMethods` |
| 매출 | `salesApi.js`(셸), `types/sales.js` | mock |

## 공통 규칙

- Mock과 실API는 같은 envelope·필드명을 목표로 한다.
- Page에서 axios 직접 호출 금지 → `api/*Api.js` 또는 mock repository.
- 미구현 `*Api` 셸에 메서드를 임의로 넣지 않는다.
- 서버 미구현 URL을 추측해 고정하지 않는다.
