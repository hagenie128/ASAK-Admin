/* SCR-009 / Live Order — getLiveOrders() */
import { useCallback, useEffect, useMemo, useState } from "react";
import plusIcon from "../../assets/figma/icon-order-plus.svg";
import excludeIcon from "../../assets/figma/icon-order-exclude.svg";
import chipBagIcon from "../../assets/figma/icon-order-side.svg";
import drinkIcon from "../../assets/figma/icon-order-drink.svg";
import { getLiveOrders, completeOrder, cancelOrder } from "../../mocks/adminMockRepository.js";
import { ADMIN_PAGINATION } from "../../constants/pagination.js";
import { usePagination } from "../../hooks/usePagination.js";
import AdminAsyncState from "./AdminAsyncState.jsx";
import AdminConfirmDialog from "./AdminConfirmDialog.jsx";
import AdminSidebar from "./AdminSidebar.jsx";
import { formatCurrency } from "../../utils/currency.js";
import { formatDate, formatTime } from "../../utils/date.js";
import { toast } from "../../utils/toast.js";

const LIVE_PAGINATION = ADMIN_PAGINATION.liveOrders;

function readLiveFixture() {
  try {
    const value = sessionStorage.getItem("asak_live_fixture");
    if (value === "empty") return { empty: true };
    if (value === "error") return { error: true };
  } catch {
    /* ignore */
  }
  return {};
}

function isActiveLiveOrder(order) {
  return order.orderStatus !== "COMPLETED" && order.orderStatus !== "CANCELED";
}

export default function LiveOrderPreview() {
  const [status, setStatus] = useState("loading");
  const [orders, setOrders] = useState([]);
  const [actionPending, setActionPending] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);

  const refresh = useCallback((options = {}) => {
    const showLoading = options.showLoading !== false;
    if (showLoading) setStatus("loading");

    const envelope = getLiveOrders(readLiveFixture());
    if (!envelope.success) {
      setOrders([]);
      setStatus("error");
      return;
    }
    const content = envelope.data?.content ?? [];
    setOrders(content);
    const visible = content.filter(isActiveLiveOrder);
    setStatus(visible.length === 0 ? "empty" : "ready");
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const activeOrders = useMemo(() => orders.filter(isActiveLiveOrder), [orders]);
  const livePage = usePagination(activeOrders, { pageSize: LIVE_PAGINATION.pageSize });

  const runOrderAction = async (orderId, action) => {
    if (actionPending) return;

    setActionPending(true);
    try {
      const result = action === "complete" ? completeOrder(orderId) : cancelOrder(orderId);
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
        <button
          type="button"
          className="live-order-preview__arrow"
          disabled={status !== "ready" || livePage.page <= 0}
          aria-label="이전 주문"
          onClick={() => livePage.goToPage(livePage.page - 1)}
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
            {livePage.pageItems.map((order) => (
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
          disabled={status !== "ready" || livePage.page >= livePage.totalPages - 1}
          aria-label="다음 주문"
          onClick={() => livePage.goToPage(livePage.page + 1)}
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
        <p className="figma-order-menu__base">
          <span>베이스:</span>
          <b>{menu?.base || "추천"}</b>
        </p>
        <p className="figma-order-menu__dressing">
          <span>드레싱:</span>
          <b>{menu?.dressing || "발사믹"}</b>
        </p>
      </div>
      {options.length > 0 ? (
        <div className="figma-order-menu__options">
          <ul>
            {options.map((option) => (
              <li key={`${option.tone}-${option.label}`} className={optionClass(option.tone)}>
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
