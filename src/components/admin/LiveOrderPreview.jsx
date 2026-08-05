/*
 * SCR-009 / Live Order
 * API: GET /api/admin/orders/live
 * 응답: data.content[]의 orderId, orderNo, orderTypeLabel, orderStatus,
 * totalAmount, createdAt, elapsedSec, menus[]를 주문 카드에 표시한다.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ordersApi } from "../../api/ordersApi.js";
import drinkIcon from "../../assets/figma/icon-order-drink.svg";
import excludeIcon from "../../assets/figma/icon-order-exclude.svg";
import plusIcon from "../../assets/figma/icon-order-plus.svg";
import chipBagIcon from "../../assets/figma/icon-order-side.svg";
import { formatCurrency } from "../../utils/currency.js";
import { formatDate, formatTime } from "../../utils/date.js";
import { toast } from "../../utils/toast.js";
import AdminAsyncState from "./AdminAsyncState.jsx";
import AdminConfirmDialog from "./AdminConfirmDialog.jsx";
import AdminSidebar from "./AdminSidebar.jsx";

function readLiveFixture() {
  // TODO-014: 실 API QA 끝나면 fixture·console.log 제거 또는 개발 환경으로 분리
  try {
    const value = sessionStorage.getItem("asak_live_fixture");
    if (value === "empty") return { empty: true };
    if (value === "error") return { error: true };
  } catch {
    /* ignore */
  }
  return {};
}
function optionIcon(tone) {
  if (tone === "exclude") return excludeIcon;
  if (tone === "plus") return plusIcon;
  if (tone === "drink") return drinkIcon;
  return chipBagIcon;
}

function optionClass(tone) {
  if (tone === "exclude") return "figma-order-option figma-order-option--exclude";
  if (tone === "plus") return "figma-order-option figma-order-option--plus";
  if (tone === "drink") return "figma-order-option figma-order-option--drink";
  return "figma-order-option figma-order-option--side";
}

const OPTION_TONE_ORDER = ["exclude", "plus", "side", "drink"];
const MENU_CARD_WIDTH = 340;
const MENU_CARD_GAP = 8;
const ORDER_CARD_HORIZONTAL_PADDING = 40;

const WIDE_LAYOUT_CLASS = "figma-order-card--wide";
// 상단바(72px)와 주문 영역 상·하단 여백(48px)
const CARD_VIEWPORT_MARGIN = 120;
// 임계값 근처에서 가로 확장이 켜졌다 꺼졌다 반복하지 않도록 둔 여유
const WIDE_LAYOUT_HYSTERESIS = 24;

// 카드에 min-height가 걸려 있어 scrollHeight는 내용과 무관하게 항상 그 값 이상이 된다.
// 자식 높이와 gap·padding을 직접 더해 메뉴를 1열로 쌓았을 때의 높이를 구한다.
function measureStackedHeight(card) {
  const style = window.getComputedStyle(card);
  const gap = Number.parseFloat(style.rowGap) || 0;
  const padding =
    (Number.parseFloat(style.paddingTop) || 0) + (Number.parseFloat(style.paddingBottom) || 0);
  const children = Array.from(card.children);
  const content = children.reduce((sum, child) => sum + child.getBoundingClientRect().height, 0);
  return padding + content + gap * Math.max(0, children.length - 1);
}

function sortOptionsByTone(options) {
  return options
    .map((option, index) => ({ option, index }))
    .sort((left, right) => {
      const leftOrder = OPTION_TONE_ORDER.indexOf(left.option.tone);
      const rightOrder = OPTION_TONE_ORDER.indexOf(right.option.tone);
      const leftPriority = leftOrder === -1 ? OPTION_TONE_ORDER.length : leftOrder;
      const rightPriority = rightOrder === -1 ? OPTION_TONE_ORDER.length : rightOrder;

      return leftPriority - rightPriority || left.index - right.index;
    })
    .map(({ option }) => option);
}

function formatElapsedTime(createdAt, now) {
  const elapsedSec = Math.max(0, Math.floor((now - new Date(createdAt).getTime()) / 1000));

  const day = Math.floor(elapsedSec / (60 * 60 * 24));

  const time = new Date((elapsedSec % (60 * 60 * 24)) * 1000).toISOString().slice(11, 19);

  return day > 0 ? `${day}일 ${time}` : time;
}

function MenuCard({ menu }) {
  const options = sortOptionsByTone(menu?.options ?? []);

  return (
    <section className="figma-order-menu">
      <div className="figma-order-menu__header">
        <div className="figma-order-menu__title">
          <strong>{menu?.menuName || "menu name"}</strong>
          <span>{menu?.quantity ?? 0}</span>
        </div>
        {menu?.base ? (
          <p className="figma-order-menu__base">
            <span>베이스:</span>
            <b>{menu.base}</b>
          </p>
        ) : null}
        <p className="figma-order-menu__dressing">
          <span>드레싱:</span>
          <b>{menu?.dressing || "발사믹"}</b>
        </p>
      </div>
      {options.length > 0 ? (
        <div className="figma-order-menu__options">
          <ul>
            {options.map((option, index) => (
              <li
                key={`${option.tone}-${option.label}-${index}`}
                className={optionClass(option.tone)}
              >
                <i aria-hidden="true">
                  <img alt="" src={optionIcon(option.tone)} />
                </i>
                <span>{option.label}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function OrderCard({ order, now, onAction, actionPending = false }) {
  const menus = order.menus ?? [];
  const cardRef = useRef(null);
  const [requiresWideLayout, setRequiresWideLayout] = useState(false);
  const orderCardWidth =
    MENU_CARD_WIDTH * menus.length +
    MENU_CARD_GAP * (menus.length - 1) +
    ORDER_CARD_HORIZONTAL_PADDING;
  const liveOrderNo = String(order.orderNo ?? "").slice(-4);
  const actionByStatus = {
    RECEIVED: { label: "준비 시작", nextStatus: "PREPARING" },
    PREPARING: { label: "완료 처리", nextStatus: "COMPLETED" },
  };

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;

    // 메뉴를 1열로 쌓았을 때 화면 높이를 넘는 경우에만 가로로 확장한다.
    // 확장 중에는 옵션이 2열이라 카드가 짧아지므로, 판정은 항상 --wide를 뗀 상태에서 잰다.
    // 그래야 확장 여부가 현재 모드에 의존하지 않아 켜짐/꺼짐이 반복되지 않는다.
    const syncWideLayout = () => {
      const hadWide = card.classList.contains(WIDE_LAYOUT_CLASS);
      if (hadWide) card.classList.remove(WIDE_LAYOUT_CLASS);
      const stackedHeight = measureStackedHeight(card);
      if (hadWide) card.classList.add(WIDE_LAYOUT_CLASS);

      const availableCardHeight = window.innerHeight - CARD_VIEWPORT_MARGIN;
      setRequiresWideLayout((current) =>
        current
          ? stackedHeight > availableCardHeight - WIDE_LAYOUT_HYSTERESIS
          : stackedHeight > availableCardHeight,
      );
    };

    syncWideLayout();
    window.addEventListener("resize", syncWideLayout);
    return () => window.removeEventListener("resize", syncWideLayout);
  }, [menus]);

  return (
    <article
      ref={cardRef}
      className={`figma-order-card${requiresWideLayout ? " figma-order-card--wide" : ""}`}
      style={
        requiresWideLayout
          ? {
              "--order-card-width": `${orderCardWidth}px`,
              "--order-menu-count": menus.length,
            }
          : undefined
      }
      aria-label={`${order.orderNo} 주문 미리보기`}
    >
      <header className="figma-order-card__header">
        <strong>{liveOrderNo}</strong>
        <time>경과 {formatElapsedTime(order.createdAt, now)}</time>
      </header>
      <span
        className={`figma-order-card__type${order.orderTypeLabel === "포장" ? " figma-order-card__type--takeout" : ""}`}
      >
        {order.orderTypeLabel}
      </span>
      <div className="figma-order-card__menus">
        {menus.map((menu, index) => (
          <MenuCard key={`${order.orderId}-${index}`} menu={menu} />
        ))}
      </div>
      <footer className="figma-order-card__footer">
        <div className="figma-order-card__total">
          <span>총액</span>
          <strong>{formatCurrency(order.totalAmount ?? 0)}</strong>
        </div>
        <div className="figma-order-card__actions">
          <button
            type="button"
            disabled={actionPending}
            onClick={() => onAction(order.orderId, "CANCELED")}
          >
            취소
          </button>
          <button
            className={order.orderStatus === "RECEIVED" ? "RECEIVED" : ""}
            type="button"
            disabled={actionPending}
            onClick={() => onAction(order.orderId, actionByStatus[order.orderStatus].nextStatus)}
          >
            {actionByStatus[order.orderStatus].label}
          </button>
        </div>
      </footer>
    </article>
  );
}

export default function LiveOrderPreview() {
  const [status, setStatus] = useState("loading");
  const [orders, setOrders] = useState([]);
  const [actionPending, setActionPending] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const boardRef = useRef(null);

  function moveToEdge(position) {
    const board = boardRef.current;
    if (!board) return;

    board.scrollTo({
      left: position === "start" ? 0 : board.scrollWidth,
      behavior: "smooth",
    });
  }

  const refresh = useCallback(async (options = {}) => {
    const showLoading = options.showLoading !== false;
    if (showLoading) setStatus("loading");

    try {
      const liveBoard = await ordersApi.listLiveOrders();
      const content = liveBoard?.content ?? [];

      setOrders(content);
      setStatus(content.length === 0 ? "empty" : "ready");
    } catch {
      setOrders([]);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  const runOrderAction = async (orderId, status) => {
    // TODO-014 연동: console.log 제거
    console.log(status);
    console.log(orderId);
    if (actionPending) return;
    const SUCCESS_MESSAGE = {
      PREPARING: "준비중으로 상태가 변경되었습니다.",
      COMPLETED: "호출이 완료되었습니다.",
      CANCELED: "삭제가 완료되었습니다.",
    };
    setActionPending(true);
    try {
      if (status == "CANCELED") {
        await ordersApi.cancelOrder(orderId);
      } else {
        await ordersApi.changeOrderStatus(orderId, status);
      }
      toast.success(SUCCESS_MESSAGE[status]);
      // TODO-013: COMPLETED 등 성공 후 TTS 호출. TTS 실패 시 toast만, 주문 상태는 유지
      refresh({ showLoading: false });
    } catch (err) {
      // TODO-011: 409 전이 충돌·envelope code별 메시지 분기, 목록 재조회
      toast.error(err.message || "처리에 실패했습니다.");
      return;
    } finally {
      setActionPending(false);
    }
  };

  const handleOrder = (orderId, status) => {
    if (actionPending) return;
    if (status === "CANCELED") {
      setCancelOrderId(orderId);
      return;
    }
    runOrderAction(orderId, status);
  };

  function handleCancelConfirm() {
    const orderId = cancelOrderId;
    setCancelOrderId(null);
    if (orderId == null) return;
    runOrderAction(orderId, "CANCELED");
  }

  return (
    <section className="live-order-preview" aria-label="주문 현황" data-figma-node="235:6361">
      <header className="live-order-preview__topbar" data-figma-node="235:6372">
        <AdminSidebar model="logo" />
        <div className="live-order-preview__heading">
          <div className="live-order-preview__title-group">
            <h1>주문 현황</h1>
            <p>조리 완료 처리 및 TTS 알림을 관리합니다.</p>
          </div>
          <time>
            {formatDate(new Date(now))}
            {" | "}
            {formatTime(new Date(now))}
          </time>
        </div>
      </header>
      <main className="live-order-preview__content">
        {/* TODO-023: livePage 제거 → useRef 보드 + scrollBy 가로 스크롤, orders.map 전부 렌더 */}
        <button
          type="button"
          className="live-order-preview__arrow"
          disabled={status !== "ready" || orders.length <= 0}
          aria-label="가장 오래된 주문"
          onClick={() => moveToEdge("start")}
        >
          ‹
        </button>
        {status === "loading" || status === "empty" || status === "error" ? (
          <div className="live-order-preview__board">
            <AdminAsyncState
              status={status}
              title={
                status === "empty"
                  ? "진행 중 주문이 없습니다"
                  : status === "error"
                    ? "주문 현황을 불러오지 못했습니다"
                    : undefined
              }
              description={
                status === "empty"
                  ? "새 주문이 들어오면 여기에 표시됩니다."
                  : status === "error"
                    ? "sessionStorage asak_live_fixture=error 등 QA fixture를 확인하세요."
                    : undefined
              }
              onRetry={status === "error" ? refresh : undefined}
            />
          </div>
        ) : (
          <div className="live-order-preview__board" ref={boardRef}>
            {orders.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
                now={now}
                onAction={handleOrder}
                actionPending={actionPending}
              />
            ))}
          </div>
        )}
        <button
          type="button"
          className="live-order-preview__arrow"
          disabled={status !== "ready" || orders.page >= orders.totalPages - 1}
          aria-label="가장 최근 주문"
          onClick={() => moveToEdge("end")}
        >
          ›
        </button>
      </main>
      <AdminConfirmDialog
        open={cancelOrderId != null}
        title="주문을 취소하시겠습니까?"
        description="취소된 주문은 조리 목록에서 사라집니다."
        confirmLabel="취소 처리"
        tone="danger"
        isBusy={actionPending}
        onConfirm={handleCancelConfirm}
        onCancel={() => setCancelOrderId(null)}
      />
    </section>
  );
}
