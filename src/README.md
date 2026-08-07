# src 폴더 안내 (Admin)

> 기준일: **2026-08-07**
> 짧은 지도·데이터 소스: [STRUCTURE_GUIDE.md](STRUCTURE_GUIDE.md)
> Mock 필드: [`../public/mocks/README.md`](../public/mocks/README.md)

| 폴더 | 역할 | 현재 |
| --- | --- | --- |
| `apps/AdminApp.jsx` | URL ↔ 페이지 · CSS 로드 | kebab 라우트 |
| `pages/admin/` | SCR별 화면 · 조합만 | Hook + components |
| `pages/dev/` | UI 상태 미리보기 | 개발용 |
| `components/admin/` | UI (`shared` · `orders` · `menus` · 단일 파일) | 사용 중 |
| `layouts/` | AdminLayout 셸 | Live 제외 |
| `hooks/` | 조회·draft | 일부 mock / 일부 실API |
| `api/` | `*Api.js` · `apiClient` | orders/menus 실연동 · 나머지 미구현 셸 |
| `mocks/adminMockRepository.js` | mock 입구 | 품절·결제·매출·대시보드 |
| `types/` | JSDoc 응답 형태 | 런타임 import 없음 |
| `auth/adminSession.js` | **로그인 세션 정본** | localStorage |
| `store/` + `useAdminAuth` | JWT 후보 | **미연결** |
| `constants/` | labels · pagination · glyphs | 사용 중 |
| `styles/` | tokens→reset→global→commonStyle | |
| `contracts/` | 화면·API 매핑 초안 | |

키오스크는 `ASAK-Kiosk`. Admin 정본은 이 저장소.
