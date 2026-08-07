# Admin Figma 시각 일치 기록

> 화면 단위로 무엇을 고쳐야 하는지 찾고 있다면 먼저 워크스페이스 루트의 **[ui-index.md](../../ui-index.md)** 를 본다.
> 화면명 → Figma 노드 → 코드 파일 → 에셋 → 스크린샷 → 미구현이 한 표에 정리되어 있다.

## Navbar 재작성 — 2026-07-19

Figma `Admin/Navbar` (`227:5009`, 240×1080)와 코드 사이드바가 구성 자체부터 달랐다. 모든 관리자 화면이
이 instance를 공유하므로 화면별 대조보다 이것을 먼저 맞췄다.

| 항목 | 이전 코드 | Figma 정본 |
| --- | --- | --- |
| 메뉴 | 실시간 주문 / 대시보드 / 주문 관리 / 품절 관리 / 메뉴 관리 / 결제 수단 / 매출 | Home / 주문 관리 / 매출 관리(▾ 일별·월별) / 메뉴 관리 / 항목 품절 관리 / 결제수단 설정 |
| 매출 하위 메뉴 | 없음 | `pl-36` 들여쓰기 2개, 기본 펼침 |
| 프로모 카드 | 없음 | 야채 일러스트 + 안내 문구 + 다크 `주문 현황` 버튼 (168px, `rgba(245,247,235,0.5)`) |
| Logout | 없음 | `#f5f5f5` / radius 16 / SignOut 아이콘 |
| 활성 표시 | `#c6e84a` | `#b5e30f` + inset shadow 4겹 |

경로 매핑은 `Home → /dashboard`, `매출 관리 → /sales`(하위 메뉴는 유지한 채 매출 요약으로 이동),
프로모 카드의 `주문 현황 → /`이다.

새로 로컬화한 에셋: `icon-nav-caret-down.svg`, `icon-nav-signout.svg`, `promo-lettuce.png`, `promo-carrot.png`.

같이 정리한 것:

- `AdminApp.jsx`가 알 수 없는 경로에서 두 번째 사이드바 마크업을 직접 그리고 있었다. `AdminLayout`으로 통일했다.
- 이전 다크 사이드바용 레거시 CSS(`.admin-sidebar nav a`, `.brand`)가 선택자 우선순위(0,1,2 vs 0,1,1)로
  새 규칙을 덮어써서 padding·색·활성 배경이 Figma와 달라지고 있었다. 제거했다.
- 프로모 카드의 내용 높이(183px)가 카드 높이(168px)보다 커서 위로 넘치는 것이 원본 의도다.
  flex 축소를 막지 않으면 일러스트가 안내 문구를 덮으므로 자식들에 `flex: 0 0 <높이>`를 준다.
- `SoldOutManagePage`가 자체 야채 장식(`.sold-out-promo`)을 `position: fixed; left: 38px; bottom: 98px`로
  그리고 있었다. 사이드바에 프로모 카드가 없던 시절의 임시 대체물인데, 이제 정본 카드와 정확히 겹쳐서
  `주문 현황` 버튼과 안내 문구를 가렸다. 페이지 쪽 마크업과 CSS를 제거했다.
  화면 장식이 페이지에서 뷰포트 고정으로 그려지고 있으면 셸과 충돌하는지 먼저 확인한다.

## 로그인·메뉴 수정 화면 시각 검증 — 2026-07-19

- Figma 원본: **ASAK — Design System Product UI 0718**의 `Login / Default` (`134:12033`).
- 기본 경로 캡처 추가: `docs/screenshots/2026-07-19-admin-live-orders-1920x1080.png` (`/`), `docs/screenshots/2026-07-19-admin-order-management-1920x1080.png` (`/orders`).
- 반응형 확인: `/dashboard`를 `1024×768`에서 렌더해 `docs/screenshots/2026-07-19-admin-dashboard-tablet-1024x768.png`에 저장했다. 이 태블릿 폭 기준점에서 사이드바는 아이콘 전용 rail로 전환되고, 대시보드 카드는 4열 개요를 유지한다.
- `LoginPage.jsx`는 텍스트 근사 대신 공통 정본 `src/assets/svg/logo-F.svg`를 사용한다. SVG는 앱과 함께 번들되며, 런타임 Figma URL이나 외부 에셋은 쓰지 않는다.
- `1920×1080` 렌더: `docs/screenshots/2026-07-19-admin-login-1920x1080.png`.
- `MenuEditPage.jsx`는 공통 `AdminLayout`을 통해 `/menus/new`, `/menus/edit`에서 열린다. `1920×1080` 렌더: `docs/screenshots/2026-07-19-admin-menu-edit-1920x1080.png`.
- 두 화면 모두 입력과 CTA를 의도적으로 비활성 상태로 둔다. 인증, 폼 상태, 검증, 업로드, API 호출, JSON 로딩, Zustand 쓰기는 이번 UI 전용 변경 범위 밖이다.

## 기준 파일

- Figma: `ASAK — Design System Product UI 0718`
- File key: `yHhvn5RKjBd91U8BJUQz7F`
- Admin canvas: `134:10606` — `📊 06-C. Screens / Admin (Implementation Final)`
- 기준 해상도: Desktop `1920 × 1080`; 공통 관리 화면은 Figma의 240px navbar를 기준으로 한다.

이 파일은 기존 `figma-ui-handoff-2026-07-18.md`의 이전 파일 키 기록보다 우선한다. Figma 화면을 수정하지 않고 코드 구현과 대조만 기록한다.

## 검증 방식

각 화면은 다음 순서로 완료한다.

1. Figma 노드 스크린샷을 저장하고 노드·variant·Auto Layout을 기록한다.
2. 로컬 화면을 같은 뷰포트에서 캡처한다.
3. 로고, 이미지, 텍스트, 간격, radius, border, shadow, 상태 화면을 대조한다.
4. 차이가 있으면 코드만 수정하고, 적용한 에셋과 예외를 이 문서에 남긴다.

`레이아웃이 표시된다`는 완료 기준이 아니다. 원본과의 시각 대조가 끝난 화면만 완료 처리한다.

## 에셋 연결 기록

| Figma 노드 | Figma 에셋 | 프로젝트 파일 | 사용 위치 | 상태 |
| --- | --- | --- | --- | --- |
| `134:10624` / `Admin/Navbar`, model=`logo` | `ASAK s logo` | `src/assets/svg/logo-S.svg` | `AdminSidebar.jsx`, `LiveOrderBoard.jsx` | 공통 정본 SVG를 프로젝트 내부 에셋으로 사용 |
| `134:10612` / `Admin/OrderCard` | `akar-icons:plus` | `src/assets/figma/icon-order-plus.svg` | `LiveOrderBoard.jsx` | 텍스트 `+` 대체 |
| `134:10612` / `Admin/OrderCard` | `pinhead:chip-bag-with-chip` | `src/assets/figma/icon-order-side.svg` | `LiveOrderBoard.jsx` | 임시 사각형 기호 대체 |
| `134:10612` / `Admin/OrderCard` | `mdi:drink-outline` | `src/assets/figma/icon-order-drink.svg` | `LiveOrderBoard.jsx` | 임시 사각형 기호 대체 |

Figma MCP가 내려주는 에셋 URL은 단기 URL이므로, 코드에는 URL을 남기지 않고 위의 내부 파일만 참조한다. 외부 CDN이나 Figma 런타임 의존성은 만들지 않는다.

## 효과(Effects) 대조 기록

| Figma 효과/노드 | Figma 값 또는 역할 | 웹 적용 | 대체 여부·사유 |
| --- | --- | --- | --- |
| `Admin/OrderCard` (`134:10612`) | 16px radius, floating card shadow | CSS `border-radius: 16px`, 다중 `box-shadow` | CSS box-shadow로 구현 가능. 브라우저별 블러가 Figma와 1:1 렌더링되지 않으므로 캡처 대조 후 수치만 조정한다. |
| `Admin/OrderCard` 옵션 버튼 | Figma는 48px 원형 컨트롤 | 40px 원형 + 원본 9px SVG | 화면 밀도와 가독성 기준으로 축소. 데이터 선택 기능이 붙기 전의 정적 표시이며, 터치 인터랙션을 추가할 때는 별도 48px 터치 영역을 유지한다. |
| `nav seleted` | 활성 메뉴 라임 표면/내부 하이라이트 | CSS inset shadow | CSS로 구현 가능. Figma의 오타 이름은 수정하지 않고 문서상 `Effect/Nav/Selected`로 추적한다. |
| `메뉴카드` | 카드 경계와 얕은 그림자 | CSS border + shadow | CSS로 구현 가능. 카드별 동일 토큰을 사용한다. |
| `라임 전체 번짐` | 큰 범위의 lime glow | 필요 화면에만 `box-shadow` 또는 pseudo element | backdrop/filter가 필요한 경우 성능·접근성 영향 때문에 동일한 색상/투명도의 정적 shadow로 대체하고, 해당 화면 행에 수치를 기록한다. |

## 문서 기준 위계·토큰 정책

코드 반영은 다음 우선순위를 따른다: 현재 0718 Figma 파일 → `figma-precise-fix-checklist-2026-07-18.md` → `figma-0718-color-canon-2026-07-18.md` → Product Bible의 component/token 규칙 → 이전 Figma 파일과 스크린샷.

| 영역 | 코드 적용 기준 | Figma에서 발견해도 그대로 복제하지 않는 값 |
| --- | --- | --- |
| Typography | Pretendard Variable, 역할별 Heading/Body/Label, 명시 line-height | Auto line-height, 본문 16px 미만, 문서 역할과 맞지 않는 heading weight |
| 큰 제목 | 34px 이상은 -1%~-2% letter-spacing, line-height 매핑표 적용 | 큰 제목의 0% tracking 또는 본문과 동일한 400 weight |
| Color | `#B5E30F` Brand Primary, `#111827` primary text, `#6B7280` secondary text, semantic status token | `#3B82F6`, `#0088FF`, `#08F` 선택색; 임의 Tailwind green/lime |
| Layout | 8px base spacing, Screen → Section → Composite → Primitive 계층, 내용에 따라 Hug/Fill 사용 | 절대 좌표만으로 만든 재사용 컴포넌트, 화면마다 다른 동일 의미 spacing |
| Interactive target | 실기능을 붙일 컨트롤은 48px 터치 영역을 확보 | 표시용 아이콘 크기와 터치 영역을 동일하게 강제하는 방식 |

`Live Order`의 옵션 원형은 원본 48px에서 시각 크기를 40px으로 축소했지만, 실제 선택 기능 구현 시에는 48px 이상의 투명한/여백 포함 클릭 영역을 별도로 둔다. 또한 문서의 Blue 제거 원칙에 따라 음료 아이콘 wrapper의 blue border는 Brand Primary로 교체했다.

0718 넘김의 `00. START HERE`는 전체 텍스트를 `Noto Sans KR`로 마이그레이션했다고 기록하지만, 일부 이전 화면 노드는 Pretendard/Inter를 포함한다. 공통 CSS는 `Noto Sans KR`을 첫 폴백으로 두고 Pretendard를 보조 폴백으로 둔다. 개별 화면에서 실제 캡처와 글자 폭이 달라질 경우 해당 화면의 source node를 우선해 font/weight를 따로 기록한다.

## 이전 초안 참고 기록

참고 파일 `o9mxSeovLQPdWNwM4mNySk`의 `1:2`는 화면 구현 기준이 아니라 초기 디자인 시스템 캔버스다. 다음만 채택 후보로 둔다.

- 제목·본문·보조문구를 4단계 label color로 구분하는 위계
- 44px 아이콘 버튼과 44px 옵션 행의 최소 조작 크기
- button / option / toast / sticky CTA를 primitive에서 재사용하는 구조
- 얕은 1~4단계 elevation을 상황별로 제한하는 규칙

다음은 채택하지 않는다: 초기 회색 중심 팔레트, 현재 브랜드와 다른 `K/ON_*` 타입 명명, 초안 화면을 현재 Figma보다 우선하는 판단. 현재 브랜드 색·화면 구성·새 로고는 최신 Figma 및 사용자 제공 에셋을 기준으로 한다.

## 화면별 진행 상태

| 화면 | Figma 노드 | 코드 화면 | 에셋/효과 대조 | 상태 |
| --- | --- | --- | --- | --- |
| Live Order / Default | `134:10607` | `components/admin/LiveOrderBoard.jsx` | navbar 원본 logo 확보, 주문 카드 대조 진행 중 | 진행 중 |
| Order Detail / Default | `134:10630` | `pages/admin/OrderManagementPreview.jsx` | 1920×1080 대조 완료. 필터·10행 테이블·상세 패널을 정적 목업으로 반영, 로고 교체 대기 | 진행 중 |
| Sold-out / Default | `134:11863` | `pages/admin/SoldOutManagePage.jsx` | 현재 노드 썸네일을 로컬로 내려받음. 정적 2보드 레이아웃, 선택·이동·저장 affordance는 비활성 렌더. `1920×1080` 브라우저 캡처 확인. | UI 완료 / 데이터 adapter 보류 |

시각 캡처: `docs/screenshots/2026-07-19-admin-sold-out-1920x1080.png`.
| Login / Default | `134:12033` | `pages/admin/LoginPage.jsx` | 미대조 | 대기 |
| Menu Management / Default | `134:12137` | `pages/admin/MenuManagePage.jsx` | 현재 Admin 원본의 로컬 음식 썸네일 재사용. 카테고리 탭·검색 필드·카드 편집 affordance는 정적·비활성 렌더. 시각 캡처: `docs/screenshots/2026-07-19-admin-menu-management-1920x1080.png`. | UI 완료 / 데이터 adapter 보류 |
| Payment / Default | `134:11493` | `pages/admin/PaymentMethodPage.jsx` | Figma의 4개 결제수단 행, 재정렬 affordance, 미리보기 목록, 정책 2카드, 저장 바를 정적 UI로 반영. 결제 브랜드는 외부 이미지/이모지 대신 색상·문자 마크로 대체해 자산 연결을 만들지 않음. 시각 캡처: `docs/screenshots/2026-07-19-admin-payment-1920x1080.png`. | UI 완료 / 데이터 adapter 보류 |
| Sales / Default | `134:10661` | `pages/admin/SalesSummaryPage.jsx` | 정적 KPI·시간대 차트·주문/결제 비율 UI 반영. 시각 캡처: `docs/screenshots/2026-07-19-admin-sales-1920x1080.png`. | UI 완료 / 데이터 adapter 보류 |
| Dashboard / Default | `227:5008` | `pages/admin/DashboardPage.jsx` | Figma의 4 KPI, 최근 주문, 상태 진행바, 품절/재고 알림, 주간 매출 요약을 정적 목업으로 반영. 네비게이션 7종 SVG와 177×60 로고를 현재 노드에서 로컬화. 시각 캡처: `docs/screenshots/2026-07-19-admin-dashboard-1920x1080.png`. | UI 완료 / 데이터 adapter 보류 |

## 구현 경계

이미지·아이콘·로고·CSS 효과는 피그마 원본에 맞춰 포함한다. 다만 API 호출, JSON 불러오기, 주문 상태 전이, 인증, 저장, 결제, TTS는 구현하지 않으며 버튼은 UI 확인용 비활성 상태로 둔다.

## 과거 Figma 원본 맵과 디자인 검토 — 2026-07-18

아래 파일은 현재 구현 파일 이후에 제공된 참고 자료입니다. 서로 바꿔 쓸 수 있는 에셋 원본이 아닙니다. 옛 로고·이미지·컴포넌트 variant가 현재 화면에 조용히 섞이는 일을 막기 위함입니다.

| 우선순위 | Figma 파일 | File key | 용도 | 코드 쪽 결정 |
| --- | --- | --- | --- | --- |
| 1 | ASAK — Design System Product UI 0718 | `yHhvn5RKjBd91U8BJUQz7F` | 현재 Admin 화면과 시각 목표. Admin canvas: `134:10606`. | 구현 중인 화면은 항상 이 원본과 먼저 대조한다. |
| 2 | ASAK 1 | `k67gDKvnB29ILSzIpFYSaT` | 이전 공통/Kiosk/Admin 컴포넌트·상태 용어. | 현재 화면을 확인한 뒤 빠진 상태를 해석할 때만 참고. 브랜딩·이미지는 기본으로 가져오지 않는다. |
| 3 | ASAK 2 | `UkpdbylxruMqzf6bSzZ4Rb` | 이전 결제·매출 컴포넌트 대안. | 결제/매출 컴포넌트 구조 참고용이며, 시각 우선 원본으로 쓰지 않는다. |
| 4 | Design System Product UI — 2026-07-14 | `VXKyzoNdsgM4oN57mrECxb` | ASAK 1과 2 사이 병합·이전 목록. | 노드 단위 현재 화면 대조가 끝날 때까지 추적용으로만 둔다. |
| 5 | Design System Product UI 0715 | `JSrjOy668zhfkiLplCkreh` | 분리된 넘김 사본. `0:1`에는 실제 화면 에셋이 로컬로 옮겨졌고 외부 라이브러리 참조가 제거됐다고 적혀 있다. | 격리 벤치마크로 유용. 더 새 화면·로고의 대체 원본으로 쓰지 않는다. |
| 참고만 | kiosk_design (initial) | `iqaoVwFjFE6Zq1WpOVgjeG` | 가장 이른 Kiosk 원본. 제공 노드 `551:2992`는 light/dark material·색상 견본이 있는 component/foundation 캔버스. | 원래 흐름·의도를 볼 때만 확인. platform material 효과, 라벨 없는 색, 레거시 시각 언어는 현재 웹 UI로 그대로 옮기지 않는다. |

### 이전 넘김 파일에서 유지할 좋은 패턴

- 0715 넘김는 재사용 primitive 계층을 문서화한다: 공통 `Button`, `Modal`, `EmptyState`, `ErrorState`, `LoadingState`, `ConfirmDialog`, 그다음 Kiosk/Admin composite. 구현도 **공통 primitive → 기능 컴포넌트 → 페이지** 방향을 유지하고, 페이지 전용 CSS를 중복하지 않는다.
- 원본 목록은 이후 정적 UI 작업의 올바른 분해를 알려 준다: `Admin/DataTableHeader`, `DataTableRow`, `OrderDetailInfo`, `OrderDetailMenuItem`, `SoldOutCard`, `PaymentMethodSettingRow`, `SalesPeriodFilter`. 이름은 구현 힌트이며, 옛 스타일을 그대로 복사하라는 뜻은 아니다.
- 현재 0718 대시보드는 *부분 데이터*를 명시적으로 모델링한다: 하나의 위젯만 사용 불가일 때 inline `ErrorState`를 쓰고, 영향 없는 위젯은 그대로 보인다. 전체 대시보드를 하나의 오류 페이지로 바꾸는 것보 낫다. 이후 mock 화면도 이 구분을 유지해 실제 API 상태와 매핑하기 쉽게 한다.
- 초기 `kiosk_design` component 캔버스는 역사적 UX 단서로는 가치가 있지만, `Regular`, `Thick`, `Chrome`, light/dark 같은 platform-style material mode를 쓴다. 웹 Kiosk에서는 현재 Figma 화면이 같은 시각 의도를 확인해 줄 때만, 기존 surface·border·shadow 토큰으로 번역한다.

### 디자인 보정과 구현 안전장치

| 발견 | 코드 쪽 결정 | 이유 / 후속 |
| --- | --- | --- |
| 일부 0718 화면 프레임에 loading/empty/error 후보가 `Instance Swap pending`으로 남아 있다. | 최종 노드가 확정될 때까지 이 상태들은 로컬 React 컴포넌트로 둔다. | pending Figma swap을 하드 의존성이나 원격 컴포넌트 복사로 만들면 안 된다. |
| 0715 사본은 외부 Figma 참조 0건을 기록하지만, 매칭되지 않은 옛 instance를 frame으로 detach한 경우도 있다. | 시각은 참고만 하고, 반응형 HTML/CSS primitive를 다시 만든다. | Detached Figma 구조는 픽셀은 맞을 수 있어도 안정적인 구현 모델이 아니다. |
| 현재 데스크톱 테이블 여러 곳에 부모 프레임을 넘는 고정 폭이 있다(예: partial-dashboard 테이블 라벨). | CSS grid, named column, `minmax()` 제약, 데스크톱 임계값 아래 가로 스크롤을 쓴다. | Figma 파일을 바꾸지 않고 레이아웃 결함을 고치며 1920px 외형은 유지한다. |
| 현재 Admin 화면은 240px 데스크톱 사이드바를 쓰지만, 태블릿 동작은 화면마다 일관되게 적혀 있지 않다. | 240px 데스크톱 사이드바를 유지하고, 태블릿 폭에서는 아이콘 rail로 접는다. 접근 가능한 이름으로 라벨 내비게이션을 제공한다. | 데스크톱 레이아웃을 태블릿에 억지로 늘리지 않고 제품 요구를 만족한다. |
| 역사 파일의 로컬 컴포넌트는 유용하지만 이미지/로고가 낡았을 수 있다. | 노드 단위 확인이나 약속된 새 로고 없이는 레거시 브랜딩/에셋을 내려받거나 대체하지 않는다. | 겉보기 그럴듯하지만 잘못된 화면을 막는다. |

이번 검토에서 Figma 파일은 수정하지 않았다. 다음 페이지 단위 구현에서는 이 로그에 정확한 source node, 내려받은 로컬 에셋, 반응형 예외, 시각 대조 결과를 추가한다.
