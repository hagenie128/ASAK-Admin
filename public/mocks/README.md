# 관리자 Mock 데이터

정본: `asak-admin-data.json`  
접근: `src/mocks/adminMockRepository.js`만 사용 (Page에서 JSON 직접 import 금지)

공통 Envelope:

```text
{ success, status, code, message, data }
```

---

## 규모 (대량 보강)

| 영역 | 규모 |
|------|------|
| 주문 | **160건+** · RECEIVED/PREPARING/COMPLETED/CANCELLED(legacy mock 표기) · PAID/READY/FAILED/REFUNDED · 매장/포장 · 옵션/제외재료 |
| Live | **수십 건** 카드 (narrow/wide, exclude/plus/drink/side) |
| Dashboard | 최근주문 20 · 상태 4종 카운트 |
| 품절 | 판매중 다수 + 품절 메뉴 30 + 재료/세트 |
| 메뉴 | 키오스크 메뉴 전체 동기화 (+ 비활성 일부) |
| 결제수단 | 4종 (Figma SCR-018: 카드·카카오·네이버·제로) |
| 매출 일별 | **7월 31일** |
| 매출 월별 | **12개월** |
| 매출 기간 | today / week / month / **empty** / **partial** |
| 로그인 | admin / kitchen / viewer + invalid |

---

## Repository → 화면 연결표

> Live·주문·메뉴 목록은 **실API**로 옮겼다. 아래 mock getter는 품절·결제·매출·대시보드·(레거시) 주문 fixture용.

| Getter | JSON 경로 | 쓰는 화면 | `data`에서 꺼내는 것 |
|--------|-----------|-----------|----------------------|
| `getDashboard()` | `dashboard` | DashboardPage | `data` 전체 |
| `getSoldOutCatalog()` | `soldOut` | SoldOutManagePage | `data.available[]` · `data.soldOut[]` |
| `getPaymentMethods()` | `paymentMethods` | PaymentMethodPage | `data[]` |
| `getSalesSummary(period)` | `sales.summary` | SalesSummaryPage | period 병합 `data` |
| `getDailySales()` | `sales.daily` | DailySalesPage | `data.rows[]` · totals |
| `getMonthlySales()` | `sales.monthly` | MonthlySalesPage | `data.rows[]` |
| `getLiveOrders()` / `getAdminOrders()` | live/orders | (레거시 fixture) | 주문 실연동 후 참고용 |

```js
import {
  getSalesSummary,
  getDailySales,
  getMonthlySales,
  getSoldOutCatalog,
  getPaymentMethods,
  getDashboard,
} from "../src/mocks/adminMockRepository.js";

getSalesSummary("empty");
getDailySales();
```

---

## 필드 / props 사전 (바인딩용)

> 화면 연결할 때 **이 표만 보고** props를 맞춘다. JSON 전체를 다시 열어보지 않아도 된다.  
> API/신규 DTO 정본은 `totalAmount`와 `CANCELED`다. **현재 mock JSON은** 각각
> `totalPrice`, `CANCELLED`를 쓰는 legacy 자산이므로, 실제 API 연결 시 repository/adapter에서
> 정규화한다. 이 문서에서 `totalPrice`와 `CANCELLED`가 보이면 현재 mock의 실제 필드값을
> 설명하는 것이며, 새 API 계약으로 복사하지 않는다.

### 1) Live 주문 카드 — `getLiveOrders().data.content[]`

`LiveOrderBoard`가 쓰는 Live 카드 필드 (실API 응답 기준, mock fixture와 유사).

| 필드 | 타입 | 화면에서 | 비고 |
|------|------|----------|------|
| `orderId` | number | `key` | 필수 |
| `orderNo` | string | 카드 헤더 큰 번호 | 예: `"#1400"` |
| `displayNo` | string | (예비) | 숫자만 `"1400"` |
| `orderType` | string | — | `EAT_IN` / `TAKE_OUT` |
| `orderTypeLabel` | string | 매장/포장 뱃지 | `"매장"` / `"포장"` → 포장이면 `--takeout` |
| `totalPrice` | number | 총액 | `toLocaleString()` |
| `orderStatus` | string | (예비) | `RECEIVED` / `PREPARING` / … |
| `createdAt` | string | (예비) | ISO |
| `elapsedSec` | number | 경과 초 표시 | `null`이면 `00:00:00` |
| `wide` | boolean | `figma-order-card--wide` | 메뉴 많으면 true |
| `menus[]` | array | 메뉴 카드들 | 아래 |

**`menus[]` 한 줄**

| 필드 | 타입 | 화면에서 |
|------|------|----------|
| `menuName` | string | 메뉴명 |
| `quantity` | number | 수량 |
| `base` | string | 베이스 |
| `dressing` | string | 드레싱 |
| `options[]` | array | 옵션 칩 |

**`options[]` 한 줄**

| 필드 | 타입 | 화면에서 |
|------|------|----------|
| `label` | string | 칩 텍스트 |
| `tone` | string | 아이콘·CSS | `exclude` / `plus` / `drink` / `side` |

컴포넌트 props 매핑:

```text
LiveOrderBoard
  orders = getLiveOrders().data.content
  → StaticOrderCard({ order })
       order.orderNo, order.orderTypeLabel, order.wide,
       order.elapsedSec, order.totalPrice, order.menus, order.orderId
       → StaticMenuCard({ menu })
            menu.menuName, menu.quantity, menu.base, menu.dressing, menu.options
            option.label, option.tone
```

---

### 2) 주문 목록·상세 — `getAdminOrders().data.content[]`

| 필드 | 타입 | 화면에서 |
|------|------|----------|
| `orderId` | number | 상세 키 / 라우트 |
| `orderNo` | string | 목록 번호 |
| `orderType` | string | `EAT_IN` / `TAKE_OUT` |
| `totalPrice` | number | 금액 |
| `orderStatus` | string | 주문 상태 뱃지 |
| `paymentStatus` | string | 결제 상태 (`PAID`/`READY`/`FAILED`/…) |
| `paymentMethod` | string | 결제수단명 (비어 있을 수 있음) |
| `createdAt` | string | 시각 |
| `itemCount` | number | 품목 수 |
| `menuSummary` | string | 한 줄 요약 |
| `requestNote` | string | 요청사항 |
| `items[]` | array | 상세 품목 |

**`items[]`**

| 필드 | 타입 |
|------|------|
| `menuId` | number |
| `menuName` | string |
| `quantity` | number |
| `unitPrice` | number |
| `optionItems[]` | `{ optionItemId, name, quantity }` |
| `excludedIngredients[]` | `{ ingredientId, name }` |

Live(`menus`+`tone`)와 목록(`items`+`optionItems`) **모양이 다름** → 같은 adapter로 억지 합치지 말 것.

---

### 3) 대시보드 — `getDashboard().data`

| 필드 | 내용 |
|------|------|
| `dateLabel` | 날짜 라벨 |
| `kpis[]` | `{ label, value, display }` |
| `recentOrders[]` | `{ orderNo, orderType, menuSummary, totalPrice, orderStatus, createdAtLabel }` |
| `statusSummary[]` | `{ label, count, tone }` · tone: waiting/preparing/complete/cancelled |
| `orderTypeSummary` | `{ eatIn, takeOut }` |
| `inventoryAlerts[]` | `{ label, badge, tone }` |
| `weeklySales[]` | `{ label, amount, barHeight, isCurrent? }` |

---

### 4) 품절 — `getSoldOutCatalog().data`

| 필드 | 내용 |
|------|------|
| `available[]` / `soldOut[]` | 같은 row 스키마 |

**row**

| 필드 | 타입 |
|------|------|
| `targetType` | `MENU` / 재료·세트 등 |
| `targetId` | number |
| `name` | string |
| `category` | string |
| `isSoldOut` | boolean |
| `imageKey` | string |
| `price` | number |

---

### 5) 메뉴 — `getAdminMenus().data.content[]`

| 필드 | 타입 |
|------|------|
| `menuId` | number |
| `categoryId` | number |
| `categoryName` | string |
| `name` | string |
| `price` | number |
| `isSoldOut` | boolean |
| `isActive` | boolean |
| `detail` | object | 우측 패널용 · DB `menu`/`menu_ingredient`/`option_*`/`menu_nutrition`/`allergen`/`tag` |

**`detail`**

| 필드 | DB 근거 |
|------|---------|
| `description`, `imageUrl` | `menu.description`, `menu.image_url` |
| `ingredients[]` | `menu_ingredient` + `ingredient` (`ingredientId`, `name`, `quantity`, `unit`, `role`, `isDefault`, `canRemove`) |
| `optionGroups[]` | `option_group` / `option_item` / `option_policy*` |
| `nutrition` | `menu_nutrition` (`kcal`, `proteinG`, `carbG`, `fatG`, `sodiumMg`) |
| `allergens[]` | `allergen` (+ 재료 연결) |
| `tags[]` | `tag` + `menu_tag` (`code`, `name`, `colorHex`) |

필터: `getAdminMenus({ keyword, onlyActive })`

---

### 6) 결제수단 — `getPaymentMethods().data[]`

Figma SCR-018 Default(134:11493) 기준 **4종**: `card` → `kakao` → `naver` → `zero`

| 필드 | 타입 |
|------|------|
| `methodId` | string |
| `name` | string |
| `description` | string |
| `isActive` | boolean |
| `isMaintenance` | boolean |
| `sortOrder` | number |

---

### 7) 매출

**`getSalesSummary(period)`** — period: `today` \| `week` \| `month` \| `empty` \| `partial`  
반환 `data`: `{ period, label, dateRange, kpis, chartBars, paymentShare, orderShare, ranking, availablePeriods }`

- 화면 기간 탭: `availablePeriods` = `["today", "week", "month"]` 만 (한글 라벨은 Page에서 매핑)
- `empty` / `partial`: JSON에는 있지만 **탭에 안 나옴**. QA할 때만 `getSalesSummary("empty")` 처럼 직접 호출

JSON 예시 (`getSalesSummary("month").data` — 일부 생략):

```json
{
  "period": "month",
  "label": "이번 달",
  "dateRange": "2026.07.01 ~ 2026.07.20",
  "availablePeriods": ["today", "week", "month"],
  "kpis": [
    {
      "label": "이번 달 총매출",
      "value": 392500,
      "display": "392,500원",
      "delta": -18.5,
      "deltaLabel": "전월 대비"
    }
  ],
  "chartBars": [40, 30, 45, 60, 50, 35, 25, 20, 15, 10, 5, 5],
  "paymentShare": [
    { "label": "카드", "percent": 67, "fill": 288 },
    { "label": "카카오페이", "percent": 33, "fill": 60 }
  ],
  "orderShare": [
    { "label": "매장", "percent": 39, "fill": 156 },
    { "label": "포장", "percent": 61, "fill": 244 }
  ],
  "ranking": [
    { "rank": 1, "name": "탄단지 샐러디", "count": 11, "amount": 97900 }
  ]
}
```

> `chartBars`는 막대 높이(12칸)만 있다. **시간 라벨(`10시`~`21시`)은 JSON에 없고** Page UI 상수(`CHART_TICKS` / `CHART_HOURS`)로 그린다.

**`getDailySales().data`**

| 필드 | 내용 |
|------|------|
| `from` / `to` | 기간 |
| `rows[]` | `{ date, orderCount, totalAmount, avgAmount }` |
| `totals` | 합계 객체 |
| `hourly[date][]` | 시간대별 · `{ hour, orderCount, totalAmount, avgAmount, … }` · DB `vw_sales_hourly` |
| `ranking[date][]` | 일별 메뉴 순위 · `{ rank, menuId, name, count, amount, … }` · DB `vw_top_menu_daily` |
| `breakdown[date]` | `{ paymentShare[], orderShare[] }` · DB `payment.method_id` + `orders.order_type_id` |

JSON 예시 (`getDailySales().data` — 일부):

```json
{
  "from": "2026-07-01",
  "to": "2026-07-31",
  "rows": [
    {
      "date": "2026-07-01",
      "orderCount": 23,
      "totalAmount": 232760,
      "avgAmount": 10120
    }
  ],
  "totals": { "orderCount": 0, "totalAmount": 0, "avgAmount": 0 },
  "hourly": {
    "2026-07-01": [
      { "hour": 10, "orderCount": 2, "totalAmount": 22000, "avgAmount": 11000 }
    ]
  },
  "ranking": {
    "2026-07-01": [
      { "rank": 1, "menuId": 1, "name": "탄단지 샐러디", "count": 5, "amount": 44500 }
    ]
  },
  "breakdown": {
    "2026-07-01": {
      "paymentShare": [{ "label": "카드", "percent": 70, "fill": 280 }],
      "orderShare": [{ "label": "매장", "percent": 40, "fill": 160 }]
    }
  }
}
```

**`getMonthlySales().data`**

| 필드 | 내용 |
|------|------|
| `year` | number |
| `rows[]` | `{ month, orderCount, totalAmount, avgAmount }` |
| `ranking[month][]` | 월별 메뉴 순위 · `{ rank, menuId, name, count, amount, … }` · DB `vw_top_menu_daily` 월 합산 |

JSON 예시 (`getMonthlySales().data` — 일부):

```json
{
  "year": 2026,
  "rows": [
    { "month": 1, "orderCount": 800, "totalAmount": 8200000, "avgAmount": 10250 },
    { "month": 7, "orderCount": 900, "totalAmount": 9500000, "avgAmount": 10555 }
  ],
  "ranking": {
    "7": [
      { "rank": 1, "menuId": 1, "name": "탄단지 샐러디", "count": 120, "amount": 1068000 }
    ]
  }
}
```

---

## 자주 헷갈리는 점

| 이슈 | 어떻게 |
|------|--------|
| Live vs 주문목록 필드가 다름 | Live는 UI 카드용(`menus`/`tone`), 목록은 API형(`items`/`optionItems`) |
| `totalPrice` vs `totalAmount` | legacy mock=`totalPrice`, API 정본=`totalAmount` → adapter에서 정규화 |
| `CANCELLED` vs `CANCELED` | legacy mock=`CANCELLED`, API 정본=`CANCELED` → adapter에서 정규화 |
| `paymentStatus`에 `PAID` | 정본은 READY/APPROVED/FAILED — adapter에서 정규화 |
| Envelope unwrap | `api/client.js`만 (repository는 envelope 통째 반환) |

규모 숫자는 JSON `scenarios` / `meta` 키 참고.

---

## 페이지별 JSON 바인딩 현황 — 하드코딩 vs mock 연결

> 각 페이지에서 **현재 하드코딩**으로 박혀 있는 데이터를 **JSON의 어떤 필드로 교체해야 하는지** 대조표.
> ✅ = 이미 hook/repository로 연결됨, ❌ = 하드코딩 → 연결 필요

### 1) `LiveOrderBoard.jsx` → Live API / (레거시 `getLiveOrders()`)

| 화면 요소 | 현재 | JSON 바인딩 |
|-----------|------|-------------|
| 주문 카드 목록 | ✅ `getLiveOrders().data.content` | — |
| 완료/취소 액션 | ✅ `completeOrder()` / `cancelOrder()` | — |
| 상단 날짜/시간 | ✅ `new Date()` 실시간 | — |
| 좌우 화살표 페이징 | ❌ disabled 고정 | 추후 페이징 구현 시 |

### 2) `OrderManagementPreview.jsx` → `getAdminOrders()`

| 화면 요소 | 현재 | JSON 필드 |
|-----------|------|-----------|
| 주문 테이블 행 | ✅ hook 연결 | `data.content[]` |
| 페이지네이션 | ✅ `usePagination` | `data.content.length` |
| 빈 목록 시나리오 | ✅ `{ empty: true }` | `data.content = []` |
| 필터 (상태/유형·날짜 등) | ✅ `useOrdersQuery` filters · DatePicker | `orderStatus`, `orderType`, `createdAt` 등 · **고도화 잔여** |
| 목록 상태 변경 UI | ❌ **의도적 없음** (표시·필터만) | Live 완료/취소와 분리 · WBS2-037 |
| 환불 / 영수증 | ✅ ConfirmDialog | `refundAdminOrder` / `printAdminOrderReceipt` |

### 3) `OrderDetailPage.jsx` → `getAdminOrderById(id)`

| 화면 요소 | 현재 | JSON 필드 |
|-----------|------|-----------|
| 주문 기본정보 | ✅ hook 연결 | `data.orderNo`, `orderType`, `createdAt`, `totalPrice` |
| 품목 목록 | ✅ | `data.items[]` → `menuName`, `quantity`, `unitPrice`, `optionItems[]`, `excludedIngredients[]` |
| 환불 버튼 | ✅ `refundAdminOrder()` | `paymentStatus === "PAID"` 일 때만 활성 |
| 영수증 출력 | ✅ `printAdminOrderReceipt()` | `paymentStatus === "PAID"` 일 때만 활성 |
| 404 처리 | ✅ | `success: false, status: 404` envelope |

### 4) `DashboardPage.jsx` → `getDashboard()`

| 화면 요소 | 현재 | JSON 필드 |
|-----------|------|-----------|
| KPI 카드 | ✅ `useDashboard` | `data.kpis[]` → `label`, `value`, `display` |
| 날짜 라벨 | ✅ | `data.dateLabel` |
| 최근 주문 | ✅ | `data.recentOrders[]` ← repository가 **`getAdminOrders` 최신 N건** 매핑 · `orderNo`, `orderType`, `menuSummary`, `totalPrice`, `orderStatus`, `createdAtLabel` |
| 상태 요약 바 | ✅ | `data.statusSummary[]` → `label`, `count`, `tone` |
| 매장/포장 카운트 | ✅ | `data.orderTypeSummary` → `eatIn`, `takeOut` |
| 품절 알림 | ✅ | `data.inventoryAlerts[]` → `label`, `badge`, `tone` |
| 주간 매출 차트 | ✅ | `data.weeklySales[]` → `label`, `amount`, `barHeight`, `isCurrent` |
| 전주 대비 증감 | ❌ `"—"` 하드코딩 | JSON에 전주 데이터 없음 → `buildWeeklyTrendStats()`에서 계산 로직 추가 필요 |

### 5) `SoldOutManagePage.jsx` → `getSoldOutCatalog()`

| 화면 요소 | 현재 | JSON 필드 |
|-----------|------|-----------|
| 판매 항목 그리드 | ✅ `useSoldOutDraft` | `data.available[]` |
| 품절 목록 그리드 | ✅ | `data.soldOut[]` |
| 카드 UI | ✅ 메뉴명 **2줄 clamp** · 카테고리 배지 | `name`, `category` (menus sync로 배지 다양화) |
| 카테고리 필터칩 | ✅ | `available[].category` 에서 동적 생성 |
| 이동(→/←) 버튼 | ✅ | draft 선택 상태 기반 |
| 저장 | ✅ stub `saveSoldOutCatalog()` · Confirm | **주의:** `menus.isSoldOut`은 아직 갱신 안 함 |
| 탭 (메뉴/재료/옵션) | ❌ disabled, 첫 번째만 선택 | `targetType` 기반 탭 필터링 구현 필요 |
| 검색 | ❌ disabled | `name` 기반 검색 구현 필요 |

### 6) `PaymentMethodPage.jsx` → `getPaymentMethods()`

| 화면 요소 | 현재 | JSON 필드 |
|-----------|------|-----------|
| 결제수단 행 | ✅ `usePaymentMethodDraft` | `data[]` → `methodId`, `name`, `description`, `isActive`, `sortOrder` |
| 토글 ON/OFF | ✅ | `isActive` 드래프트 토글 |
| 순서 변경 (↑↓) | ✅ | `sortOrder` 재계산 |
| 미리보기 | ✅ | `activePreviewRows` (isActive 필터) |
| 저장 | ✅ `savePaymentMethods()` | — |
| 결제 정책 카드 | ❌ 하드코딩 상수 | JSON에 해당 데이터 없음 → 정적 유지 or mock 추가 |
| `isMaintenance` 표시 | ❌ 미구현 | `data[].isMaintenance` → 점검중 뱃지/비활성 처리 필요 |

### 7) `MenuManagePage.jsx` → `getAdminMenus()` · **✅ 2026-07-23 연결**

| 화면 요소 | 현재 | JSON 필드 |
|-----------|------|-----------|
| 메뉴 카드 그리드 | ✅ `useMenusQuery` · `MenuListPanel` | `data.content[]` → `menuId`, `name`, `price`, `categoryName`, `isSoldOut`, `isActive` |
| Page 구조 | ✅ 조립만 | List + Detail/Edit 패널 · `/menus/new\|edit`는 모드 wrapper |
| 재료 모달 | ✅ `IngredientSelectModal` | Edit 패널에서 연결 |
| 카테고리 탭 / 검색 | ⚠️ 일부 잔여 | `categoryName` · `getAdminMenus({ keyword })` 고도화 가능 |
| 상세·편집 패널 | ✅ | `content[].detail` |
| 저장/삭제 | ✅ stub toast | 실 API BLOCKED |

### 8) `SalesSummaryPage.jsx` → `getSalesSummary(period)` · **✅ 2026-07-23 연결**

| 화면 요소 | 현재 | JSON 필드 |
|-----------|------|-----------|
| 기간 탭 (오늘/이번주/이번달) | ✅ | `getSalesSummary(period)` · `availablePeriods` |
| 날짜 범위 + 달력 | ✅ `AdminDatePicker` range | `data.dateRange` · 커스텀 시 하단 표만 `daily.rows` 필터 |
| KPI 카드 | ✅ | `data.kpis[]` → `label`, `display`, `delta`, `deltaLabel` |
| 시간대별 차트 | ✅ | `data.chartBars[]` (**막대 높이 px**, 금액 아님) |
| 결제수단 / 주문 유형 비중 | ✅ | `paymentShare[]` / `orderShare[]` |
| 인기 메뉴 랭킹 | ✅ | `data.ranking[]` |
| 일자별 매출 테이블 | ✅ | `getDailySales().data.rows[]` (기간·달력 필터) |

### 9) `DailySalesPage.jsx` → `getDailySales()` · **✅ 2026-07-23 연결**

| 화면 요소 | 현재 | JSON 필드 |
|-----------|------|-----------|
| 날짜 이동 (‹ ›) + 달력 | ✅ `AdminDatePicker` single | `data.rows[].date` |
| KPI · 전일 대비 | ✅ | `rows[i]` + 이전 행 delta |
| 시간대별 차트 · 상세 표 | ✅ | `data.hourly[date][]` |
| 결제/주문유형 비중 | ✅ | `data.breakdown[date]` |
| 메뉴 판매 순위 | ✅ | `data.ranking[date][]` |

### 10) `MonthlySalesPage.jsx` → `getMonthlySales()` · **✅ 2026-07-23 연결**

| 화면 요소 | 현재 | JSON 필드 |
|-----------|------|-----------|
| 월 이동 (‹ ›) + 달력 | ✅ | `data.year` · `rows[].month` (`2026-07`) |
| 월 누적 KPI | ✅ | 선택 월 `rows[i]` |
| 일별 매출·주문 차트 · 평일/주말 · 상세 표 | ✅ | `getDailySales().data.rows[]` 월 필터 |
| 인기 메뉴 랭킹 | ✅ | `data.ranking[month][]` |

---

## mock 데이터 부족 목록 — 추가 필요한 JSON 필드

> 갱신: **2026-07-23** · 매출·주문·메뉴 등 화면 mock 바인딩 완료. DB 근거 없는 `prevWeekTotal`만 정적(`—`) 유지.

| 필요 데이터 | 쓰는 화면 | JSON 경로 | 상태 | DB 근거 |
|-------------|-----------|-----------|------|---------|
| 메뉴 상세 | `MenuManagePage` | `menus.data.content[].detail` | ✅ 추가됨 | `menu`, `menu_ingredient`, `option_*`, `menu_nutrition`, `allergen`, `tag` |
| 일별 시간대 매출 | `DailySalesPage` | `sales.daily.data.hourly[date][]` | ✅ 추가됨 | `vw_sales_hourly` |
| 일별 결제/주문유형 | `DailySalesPage` | `sales.daily.data.breakdown[date]` | ✅ 추가됨 | `payment.method_id`, `orders.order_type_id` (전용 View 없음) |
| 일별 메뉴 랭킹 | `DailySalesPage` | `sales.daily.data.ranking[date][]` | ✅ 추가됨 | `vw_top_menu_daily` |
| 월별 메뉴 랭킹 | `MonthlySalesPage` | `sales.monthly.data.ranking[month][]` | ✅ 추가됨 | `vw_top_menu_daily` 월 합산 (전용 monthly view 없음) |
| 대시보드 전주 합계 | `DashboardPage` | `dashboard.data.prevWeekTotal` | ❌ 미추가 | 전용 View/컬럼 없음 → 정적 유지 또는 `weeklySales`로 화면 계산 |

> **판단 기준**: DB View/테이블 근거가 없으면 mock을 창작하지 않고 정적 유지한다.
