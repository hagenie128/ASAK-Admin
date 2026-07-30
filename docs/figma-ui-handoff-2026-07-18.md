# Admin Figma UI 적용 기록

## 적용 원칙

- 기준 Figma 파일: `yHhvn5RKjBd91U8BJUQz7F` (0718) / `📊 06-C. Screens / Admin` (`134:10606`).
  - **0715 파일 `JSrjOy668zhfkiLplCkreh`를 쓰지 않는다.** 아래 표의 node ID가 두 파일에 모두 존재해서, 파일 키를 틀려도 오류 없이 열리고 옛 시안 값이 나온다. 파일 키를 먼저 확인한다.
- Figma 원본을 수정하지 않고 읽기만 했다.
- 화면은 1920×1080 기준으로 맞추되, 공통 관리 화면은 1280px 이하에서 `240px → 88px` 아이콘 전용 사이드바로 접힌다. 720px 이하는 가로 메뉴로 전환한다.
- 기존 관리자 API, 인증, 주문 상태 변경, 결제수단 저장, 매출 집계는 호출하지 않았다. 새 버튼과 입력은 모두 UI 확인용 비활성 요소다.
- `useAdminSessionStore`는 Zustand 준비 상태만 보유하며 이번 UI와 연결하지 않았다.

## Figma 화면 매핑

| Figma 프레임 | node | 코드 파일 | UI 범위 |
| --- | --- | --- | --- |
| `SCR-009 / Live Order / Default` | `134:10607` | `components/admin/LiveOrderPreview.jsx`, `pages/admin/OrderListPage.jsx` | 기존 정적 주문 보드 유지. API/자동 갱신/TTS/상태 변경 없음. |
| `SCR-010 / Order Detail / Default` | `134:10630` | `pages/admin/OrderDetailPage.jsx`, `StaticDataTable.jsx` | 필터, 주문 테이블, 상세 패널 UI. |
| `SCR-011 / Sold-out Management / Default` | `134:11863` | `pages/admin/SoldOutManagePage.jsx`, `StaticToggle.jsx` | 필터, 품절 테이블, 저장 바 UI. |
| `SCR-015 / Login / Default` | `134:12033` | `pages/admin/LoginPage.jsx` | 로그인 폼 UI. 인증·세션 저장 없음. |
| `SCR-016 / Menu Management / Default` | `134:12137` | `pages/admin/MenuManagePage.jsx` | 메뉴 목록/필터 UI. |
| `SCR-016 / Detail Add/Edit` | `134:12328`, `134:12668` | `pages/admin/MenuEditPage.jsx` | 등록·수정 공용 정적 폼 UI. |
| `SCR-018 / Payment Methods / Default` | `134:11493` | `pages/admin/PaymentMethodPage.jsx` | 결제 수단 행, 순서 버튼, toggle, 저장 바 UI. |
| `SCR-019 / Sales Summary / Default` | `134:10661` | `pages/admin/SalesSummaryPage.jsx` | 기간 필터, KPI, 막대 차트, 요약 테이블 UI. |
| `SCR-020 / Monthly Sales / Default` | `134:10957` | `SalesSummaryPage.jsx` (`view="monthly"`) | 월별 제목을 가진 동일 정적 매출 골격. |
| `SCR-021 / Daily Sales / Default` | `134:11150` | `SalesSummaryPage.jsx` (`view="daily"`) | 일별 제목을 가진 동일 정적 매출 골격. |
| `SCR-022 / Admin Dashboard / Default` | `227:5008` | `pages/admin/DashboardPage.jsx` | KPI와 운영 패널 정적 UI. |

`src/apps/AdminApp.jsx`에는 UI 검사용 경로(`/login`, `/dashboard`, `/orders`, `/sold-out`, `/menus`, `/menus/new`, `/menus/edit`, `/payment-methods`, `/sales`, `/sales/monthly`, `/sales/daily`)만 배치했다. 페이지 전환을 발생시키는 새 업무 로직은 넣지 않았다.

## Figma 내부 Foundation/Library 점검

### 확인된 변수와 스타일

- Semantic: `Semantic/BG/Page/Admin`, `Semantic/BG/Admin`, `Semantic/Text/Admin/Primary`, `Semantic/Border/Default`, `Semantic/Brand/Primary`, status tokens.
- Typography: `ASAK/Heading/2/3/4`, `ASAK/Body/S/M/L`, `ASAK/Label/S/M`.
- Effects: `ASAK/Shadow/Subtle`, `ASAK/Shadow/Floating`, `nav seleted`, `메뉴카드`, `라임 전체 번짐`.
- Foundation 성격의 색상: `Color/Neutral/*`, `Color/CoolGray/*`, `Color/Green/*`, `Green/*`, `Gray/*`, `Color/Surface/*`.

### 정리할 것: 교체 후 제거

| 발견 | Figma에서 할 일 |
| --- | --- |
| `Green/*`와 `Color/Green/*` 혼재 | `Foundation/Color/Green/*` 하나로 alias를 모은 뒤 이전 변수 사용처가 0개가 되면 제거. |
| `Gray/*`, `Color/Neutral/*`, `Color/CoolGray/*`가 같은 텍스트/테두리에 섞임 | neutral과 coolgray의 역할을 정한다. semantic은 하나의 foundation scale만 참조하게 바인딩. |
| `nav seleted` 오타와 한글 effect 이름 | `Effect/Nav/Selected`, `Effect/Card/Menu`, `Effect/Glow/Lime`처럼 namespace로 rename. 기존 effect는 alias/사용처 확인 후 제거. |
| `Green/500=#D1FF33`, `Green/700=#B7FF00`, `Color/Green/300=#B5E30F`, `Semantic/Brand/Primary=#B5E30F` | 라임색의 primary·selected·hover·strong 의미를 분리한다. 같은 값은 foundation 하나로 합치고 semantic alias로만 노출. |
| `Number/Spacing/4/8/12`, `Number/Radius/8`만 일부 화면에 사용 | Foundation spacing/radius scale을 완성하고 padding/gap/radius 직접 값을 순차 바인딩. |

### 외부 Figma 라이브러리 연결 확인 방법

현재 읽기 API는 이 화면에서 쓰는 local variable/style과 component instance는 보여주지만, enabled library의 source file key를 반환하지 않았다. Figma에서 **Assets → Libraries**를 열어 아래 표를 채운 뒤 관리한다.

| Library 이름 | source Figma file | 사용 component/variable | 결정 |
| --- | --- | --- | --- |
| 확인 필요 | 확인 필요 | Navbar, Bottom CTA, chart 등 | 유지 / 로컬 복제 / 연결 해제 |

연결을 끊어야 한다면 `Detach instance`를 먼저 하지 말고, 이 파일 안의 공통 component/variable로 교체한 뒤 source library 사용처가 0개인지 확인한다. 그래야 화면별 variant와 prototype이 깨지지 않는다.

## 개발 쪽 연결·구현 메모

- CSS의 외부 Pretendard CDN import는 제거했다. 정식 폰트가 필요하면 라이선스 확인 후 프로젝트 소유 font 파일로 대체한다.
- `src/api/*`와 `axios`는 기존 개발 경계이므로 삭제하지 않았다. 이번 UI는 새 호출을 만들지 않는다.
- `AdminLayout`은 side bar와 본문만 조립한다. URL별 페이지 선택은 `AdminApp`에, 화면 안의 정적 표/토글은 작은 presentational component에 둬서 나중의 API hook이 UI에 섞이지 않게 했다.
- `StaticDataTable`, `StaticToggle`, `AdminPageHeader`는 Figma 화면의 반복 UI를 묶은 것이다. 실제 데이터/API 작업을 시작할 때 이 컴포넌트에 fetch나 store를 넣지 말고, page/hook에서 props로 넘긴다.

## 상태별 Figma 화면 확인 방식

상태별 화면은 운영 route를 별도로 계속 만들지 않는다. 실제 구현에서는 각 Page가 hook/API 결과로 `viewState`를 받고 본문·overlay·toast를 교체한다. 현재는 기능 없이 Figma 상태 화면을 확인하기 위해 아래 UI 전용 route만 제공한다.

```text
/ui-preview/:screen/:state
예) /ui-preview/live/loading
예) /ui-preview/soldout/confirm
예) /ui-preview/payment/error
```

| Figma 상태 묶음 | preview screen | state 예 |
| --- | --- | --- |
| Live Order loading, empty, error, detail, status confirm, saving, toast, TTS failure | `live` | `loading`, `empty`, `error`, `detail`, `confirm`, `progress`, `success` |
| Order Management filter, loading, empty, error | `orders` | `selection`, `loading`, `empty`, `error` |
| Sold-out loading, empty, error, changed, disable confirm, saving, toast | `soldout` | `loading`, `empty`, `error`, `selection`, `confirm`, `progress`, `success` |
| Login validation, authentication error, submitting | `login` | `selection`, `error`, `progress` |
| Menu validation, delete confirm, save loading/success/error, empty/loading | `menu` | `selection`, `confirm`, `progress`, `success`, `error`, `empty` |
| Payment toggle changed, save confirm/loading/success/error, all disabled, load error | `payment` | `selection`, `confirm`, `progress`, `success`, `error` |
| Sales summary/monthly/daily loading, empty, error, filter/date changed, partial | `sales` | `loading`, `empty`, `error`, `selection` |
| Dashboard loading, error, empty, partial | `dashboard` | `loading`, `error`, `empty`, `selection` |

이 route는 실제 상태를 발생시키지 않으며 버튼도 비활성이다. 기능 개발 시에는 해당 페이지 안에서 동일한 view state를 렌더링하도록 옮기고 preview route는 제거한다.
