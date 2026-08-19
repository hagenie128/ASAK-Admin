# src 폴더 안내 (Admin)

> 기준일: **2026-08-14**
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
| `api/` | `*Api.js` · `apiClient` | 주문 API-007/008/021/022/024 · 메뉴 API-011/012/013/023 실연동 |
| `mocks/adminMockRepository.js` | mock 입구 | 품절 API-009/010 · 결제 API-015/016 · 매출 API-017~019 · 대시보드 API-020 |
| `types/` | JSDoc 응답 형태 | 런타임 import 없음 |
| `auth/adminSession.js` | **로그인 세션 정본** | localStorage |
| `store/` + `useAdminAuth` | JWT 후보 | **미연결** |
| `constants/` | labels · pagination · glyphs · `api.js` | 사용 중 |
| `styles/` | tokens→reset→global→commonStyle | |
| `contracts/` | 화면·API 매핑 초안 | |
| `utils/fullscreen.js` | Fullscreen API + landscape lock | AdminStartGate·LoginPage에서 호출 |
| `components/admin/AdminStartGate.jsx` | PWA 시연용 시작 게이트 | 터치 후 전체화면 |

실연동: 주문(API-007/008/021/022/024), 메뉴(API-011/012/013/023) + 카테고리·재료·삭제 보조 endpoint.
mock: 품절(API-009/010), 결제수단(API-015/016), 매출(API-017/018/019), 대시보드(API-020).
미연결: 환불·영수증(TODO-038~043), 로그인 JWT(TODO-027).

PWA manifest는 `vite.config.js` (`display: fullscreen`, `orientation: landscape`). 설치 절차는 [Android PWA 전체화면](../../ASAK/docs/operations/setup/android-pwa-fullscreen.md).

메뉴 이미지는 `menu.image_asset_id → media_asset.url → API imageUrl` 흐름의 Cloudinary URL을 사용합니다. 목록·상세·편집 패널은 `imageUrl`을 표시하고, `CloudinaryImagePreview.jsx`는 아직 실제 편집 흐름에 연결되지 않은 SDK 예제입니다.

키오스크는 `ASAK-Kiosk`. Admin 정본은 이 저장소.
