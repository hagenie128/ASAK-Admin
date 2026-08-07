# ASAK Admin

> **작업 시작점:** [ASAK 프로젝트 작업 허브](../ASAK/PROJECT_HUB.md) → 기능 한 개 선택 → 이 저장소 코드 수정 → 워크로그 기록.

## Central documentation

- [ASAK docs index](../ASAK/docs/README.md)
- [src/STRUCTURE_GUIDE.md](src/STRUCTURE_GUIDE.md) — **실행 구조·데이터 소스 정본**
- [Product Bible Pack 12 — Frontend Implementation](../ASAK/docs/product_bible/12_Frontend_Implementation/README.md)
- [Current Implementation Map](../ASAK/docs/planning/current-implementation-map-2026-07-16.md)

ASAK 관리자 운영 화면 전용 React/Vite 애플리케이션입니다. 주문 키오스크는 `ASAK-Kiosk` 저장소입니다.

## 빠른 시작

```bash
cd ASAK-Admin
cp .env.example .env
npm install
npm run dev
```

개발 서버: `http://localhost:5174` · `/api` → `localhost:8080` 프록시 (`vite.config.js`)

## 명령어

| 명령어 | 용도 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run lint` | 정적 검사 |
| `npm run build` | `dist/` 생성 |
| `npm run preview` | 빌드 미리보기 |

## 현재 데이터 소스 (2026-08-07)

| 화면 | 소스 |
| --- | --- |
| Live·주문 관리 | **실API** `ordersApi` |
| 메뉴 목록·상세·카테고리 | **실API** `menusApi` (저장/삭제는 stub) |
| 품절·결제수단·매출·대시보드 | **mock** `adminMockRepository` |
| 로그인 | **localStorage** `auth/adminSession` (JWT 미연동) |

화면별 상세는 [STRUCTURE_GUIDE.md](src/STRUCTURE_GUIDE.md) 참고.

## 디렉터리

```text
src/
  apps/           라우트 · CSS 로드
  pages/admin/    URL 화면
  pages/dev/      UI 상태 미리보기
  components/admin/  UI (shared · orders · menus · 단일 파일)
  hooks/ · api/ · mocks/ · types/ · auth/
  styles/         tokens → reset → global → commonStyle
docs/             온보딩·아키텍처 (일부 구명칭 잔존 가능 → STRUCTURE_GUIDE 우선)
public/mocks/     asak-admin-data.json
```

## 라우트

실행 정본은 **kebab-case** (`/sold-out`, `/payment-methods`). Canonical camel과의 정렬은 `TODO-069`.
