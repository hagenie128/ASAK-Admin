# ASAK Admin 구조 지도 (짧은 안내)

> 기준일: **2026-08-07**
> Mock 필드 사전: [`../public/mocks/README.md`](../public/mocks/README.md)
> 온보딩·아키텍처 등: [`../docs/README.md`](../docs/README.md)

이 파일은 **어디를 열면 되는지**와 **데이터가 어디서 오는지**만 짧게 적는다.

---

## 데이터 소스 (정본)

| 화면 / Hook | 소스 | 비고 |
| --- | --- | --- |
| Live (`LiveOrderBoard`) | `api/ordersApi.js` | 실서버 |
| 주문 관리 (`useOrdersQuery`) | `api/ordersApi.js` | 실서버 |
| 메뉴 목록·상세 (`useMenusQuery`) | `api/menusApi.js` | 실서버 · **저장/삭제는 stub** |
| 품절 (`useSoldOutDraft`) | `mocks/adminMockRepository` | `soldOutApi` 미구현 |
| 결제수단 (`usePaymentMethodDraft`) | mock | `paymentMethodsApi` 미구현 |
| 매출 (`useSalesQuery`) | mock | `salesApi` 미구현 |
| 대시보드 (`useDashboard`) | mock | `adminApi.getDashboard` 미구현 |
| 로그인 | `auth/adminSession.js` | localStorage mock |

`VITE_USE_MOCK` 스위치는 **없다**. 화면마다 위 표를 따른다.
Page에서 JSON 직접 import 금지.

```text
Page → Hook → api/*Api.js 또는 mocks/adminMockRepository.js
```

## 인증

| 정본 (사용 중) | 미연결 (JWT TODO) |
| --- | --- |
| `auth/adminSession.js` ← `AdminApp` / `LoginPage` / `AdminSidebar` | `hooks/useAdminAuth.js` + `store/adminSessionStore.js` |

`apiClient`는 아직 Authorization·401 처리 없음 (`TODO-033`).

## Page = 조합

| 예 | 조합 |
| --- | --- |
| `LiveOrderPage` | `components/admin/LiveOrderBoard` |
| `OrderManagePage` | `OrderTable` + `OrderDetailPanel` |
| `MenuManagePage` | `MenuListPanel` + `MenuDetailPanel` / `MenuEditPanel` |
| `DashboardPage` | `DashboardPanels` 섹션들 |

## 라우트 한눈에

| 경로 | 페이지 | 데이터 |
| --- | --- | --- |
| `/` (비로그인) · `/login` | LoginPage | `auth/adminSession` |
| `/` (로그인 후) | LiveOrderPage | `ordersApi.listLiveOrders` |
| `/dashboard` | DashboardPage | mock `useDashboard` |
| `/orders` | OrderManagePage | `useOrdersQuery` |
| `/sold-out` | SoldOutManagePage | mock draft |
| `/menus` · `/menus/new` · `/menus/edit` | MenuManagePage | `useMenusQuery` |
| `/payment-methods` | PaymentMethodPage | mock draft |
| `/sales` · `/sales/monthly` · `/sales/daily` | 매출 3화면 | mock `useSalesQuery` |
| `/ui-preview/...` | `pages/dev/UiStatePreviewPage` | 정적 |

실행 경로 = **kebab-case**. 정본 camel(`/soldOut` 등)과의 정렬은 `TODO-036`.

## 폴더

| 폴더 | 역할 |
| --- | --- |
| `apps/AdminApp.jsx` | 라우트 · CSS 로드 |
| `pages/admin` | URL 화면 · 조합만 |
| `pages/dev` | 개발용 미리보기 |
| `components/admin` | **단일 파일은 폴더 없이 플랫** (예: `DashboardPanels.jsx`) |
| `components/admin/{shared,orders,menus}` | 파일이 여럿인 도메인만 하위 폴더 |
| `styles/admin` · `{shared,menus,sales}` | CSS도 동일 규칙 — **단일 CSS는 플랫** (예: `dashboard.css`) |
| `hooks` / `api` / `types` / `mocks` | 조회·계약·mock 입구 |
| `auth` | **세션 정본** |
| `store` | JWT용 zustand — **앱 미연결** |
| `layouts` | 1920×1080 셸 (Live는 보드가 사이드바 포함) |

## CSS · 셸

- 로드: `tokens` → `reset` → `global` → `commonStyle` (`AdminApp.jsx`)
- 셸: Figma 1920×1080 캔버스 + `scale` (`AdminLayout`)
