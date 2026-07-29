/*
 * SCR-009 / Live Order
 * API: GET /api/admin/orders/live
 * 응답: data.content[]의 orderId, orderNo, orderTypeLabel, orderStatus,
 * totalAmount, createdAt, elapsedSec, menus[]를 주문 카드에 표시한다.
 */
import { useCallback, useEffect, useState } from "react";
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
  // TODO 3(정리): 실제 API 확인이 끝나면 QA fixture와 console.log를 제거하거나 개발 환경으로 분리한다.
  try {
    const value = sessionStorage.getItem("asak_live_fixture");
    if (value === "empty") return { empty: true };
    if (value === "error") return { error: true };
  } catch {
    /* ignore */
  }
  return {};
}

export default function LiveOrderPreview() {
  const [status, setStatus] = useState("loading");
  const [orders, setOrders] = useState([]);
  const [actionPending, setActionPending] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);

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

  const runOrderAction = async (orderId, action) => {
    if (actionPending) return;

    setActionPending(true);
    try {
      // TODO 2(완료·취소): ordersApi.js에 아래 두 요청 메서드를 추가하고 백엔드 URL/HTTP 메서드를 확정한다.
      // - completeOrder(orderId): 조리 완료 처리
      // - cancelOrder(orderId): 주문 취소 처리
      const result = action === "complete" ? await ordersApi.completeOrder(orderId) : await ordersApi.cancelOrder(orderId);
      if (result?.success === false) {
        toast.error(result.message || "처리에 실패했습니다.");
        return;
      }
      toast.success(
        action === "complete" ? "호출이 완료되었습니다." : "주문이 취소되었습니다.",
      );
      refresh({ showLoading: false });
    } finally {
      setActionPending(false);
    }
  };

  const handleOrder = (orderId, action) => {
    if (actionPending) return;
    if (action === "cancel") {
      setCancelOrderId(orderId);
      return;
    }
    runOrderAction(orderId, action);
  };

  function handleCancelConfirm() {
    const orderId = cancelOrderId;
    setCancelOrderId(null);
    if (orderId == null) return;
    runOrderAction(orderId, "cancel");
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
            {formatDate(new Date())}
            {"  |  "}
            {formatTime(new Date())}
          </time>
        </div>
      </header>
      <main className="live-order-preview__content">
        {/* TODO 1(가로 스크롤): livePage를 제거한다.
            보드에 useRef를 연결하고, 왼쪽/오른쪽 버튼에서 scrollBy({ left: ±카드너비 })를 호출한다.
            카드 목록은 orders.map(...)으로 전부 렌더링한다. orders[0]은 가장 오래된 주문이다. */}
        <button
          type="button"
          className="live-order-preview__arrow"
          disabled={status !== "ready" || orders.length <= 0}
          aria-label="이전 주문"
          onClick={() => scrollBy({ left: 0 })}
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
          <div className="live-order-preview__board">
            {orders.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
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
          aria-label="다음 주문"
          onClick={() => scrollBy(`left:+${document.querySelector(".live-order-preview__board").scrollWidth}`)}
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

function MenuCard({ menu }) {
  const options = menu?.options ?? [];

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
              <li key={`${option.tone}-${option.label}-${index}`} className={optionClass(option.tone)}>
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

function OrderCard({ order, onAction, actionPending = false }) {
  const menus = order.menus ?? [];

  return (
    <article
      className={`figma-order-card${order.wide ? " figma-order-card--wide" : ""}`}
      aria-label={`${order.orderNo} 주문 미리보기`}
    >
      <header className="figma-order-card__header">
        <strong>{order.orderNo}</strong>
        <time>{order.elapsedSec != null ? `${order.elapsedSec}초` : "00:00:00"}</time>
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
            onClick={() => onAction(order.orderId, "cancel")}
          >
            취소
          </button>
          <button
            type="button"
            disabled={actionPending}
            onClick={() => onAction(order.orderId, "complete")}
          >
            {actionPending ? "처리 중…" : "완료 처리"}
          </button>
        </div>
      </footer>
    </article>
  );
}
