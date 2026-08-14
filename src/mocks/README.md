# 관리자 mock 안내

> Status: **CURRENT**

| 경로 | 역할 |
|---|---|
| `src/mocks/asak-admin-data.json` | **런타임 mock DB** (Vite import) |
| `src/mocks/adminMockRepository.js` | 코드 입구 — Page에서 JSON 직접 import 금지 |
| `public/mocks/README.md` | 필드·props 사전 |

현재 mock을 쓰는 화면과 대응 API 번호:

| 화면 | API | 상태 |
| --- | --- | --- |
| 품절 | API-009 / 010 | 🟡 mock |
| 결제수단 | API-015 / 016 | 🟡 mock |
| 매출 요약·일별·월별 | API-017 / 018 / 019 | 🟡 mock |
| 대시보드 | API-020 | 🟡 mock |

Live·주문·메뉴는 `api/*Api.js` 실연동 (API-007/008/011~013/021~024).

`public/mocks/`의 대용량 JSON 복제본은 제거했습니다. 과거 Kiosk 전체 mock은 `ASAK/asak-data/archive/frontend-mocks/`에 있습니다.
