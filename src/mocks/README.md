# 관리자 mock 안내

JSON fixture 위치: **`public/mocks/asak-admin-data.json`**
코드 입구: **`src/mocks/adminMockRepository.js`만** (Page에서 JSON 직접 import 금지)

필드 사전: [`../../public/mocks/README.md`](../../public/mocks/README.md)
화면별 mock/실API: [`../STRUCTURE_GUIDE.md`](../STRUCTURE_GUIDE.md)

현재 mock을 쓰는 화면: 품절 · 결제수단 · 매출 · 대시보드.
Live·주문·메뉴 목록은 `api/*Api.js` 실연동.
