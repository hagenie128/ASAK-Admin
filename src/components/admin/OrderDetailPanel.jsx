/* Figma Admin/DetailPanel (150:5418) — 주문 상세 우측 패널 */
import emptyBoxOpen from "../../assets/figma/empty-box-open.svg";
import { formatDateTime } from "../../utils/date.js";
import { formatCurrency } from "../../utils/currency.js";
import {
  PAYMENT_METHOD_LABEL,
  ORDER_STATUS,
  PAYMENT_STATUS,
} from "../../constants/orderLabels.js";

function formatOptionLine(item) {
  const options = (item.optionItems ?? []).map((o) => o.name).join(", ") || "-";
  const excluded = (item.excludedIngredients ?? []).map((e) => e.name).join(", ") || "-";
  return `옵션: ${options} | 제외: ${excluded}`;
}

function formatItemPrice(unitPrice, asNegative) {
  if (unitPrice == null || Number.isNaN(Number(unitPrice))) return "-";
  const signed = asNegative ? -Math.abs(Number(unitPrice)) : Number(unitPrice);
  return formatCurrency(signed);
}

export default function OrderDetailPanel({
  selectedOrder,
  onClose,
  onRefund,
  onPrintReceipt,
}) {
  const hasOrder = Boolean(selectedOrder?.orderId);
  const isCancelledView =
    selectedOrder?.orderStatus === ORDER_STATUS.CANCELED ||
    selectedOrder?.orderStatus === ORDER_STATUS.REFUNDED ||
    selectedOrder?.paymentStatus === PAYMENT_STATUS.REFUNDED ||
    selectedOrder?.paymentStatus === PAYMENT_STATUS.CANCELED;

  const canRefund =
    hasOrder &&
    !isCancelledView &&
    selectedOrder?.paymentStatus === PAYMENT_STATUS.APPROVED;

  const canPrintReceipt =
    hasOrder &&
    (selectedOrder?.paymentStatus === PAYMENT_STATUS.APPROVED || isCancelledView);

  if (!hasOrder) {
    return (
      <aside className="order-management__detail order-detail-panel" aria-label="주문 상세">
        <div className="order-detail-panel__empty">
          <img
            className="order-detail-panel__empty-icon"
            src={emptyBoxOpen}
            alt=""
            width={80}
            height={80}
          />
          <p className="order-detail-panel__empty-title">선택된 주문 내역이 없습니다</p>
          <p className="order-detail-panel__empty-desc">주문 목록에서 선택해주세요</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="order-management__detail order-detail-panel" aria-label="주문 상세">
      <div className="order-detail-panel__content">
        <h2 className="order-detail-panel__title">주문 상세</h2>

        <dl className="order-detail-panel__info">
          <div>
            <dt>주문번호</dt>
            <dd>{selectedOrder.orderNo}</dd>
          </div>
          <div>
            <dt>주문일시</dt>
            <dd>{formatDateTime(selectedOrder.createdAt)}</dd>
          </div>
          <div>
            <dt>결제수단</dt>
            <dd>{PAYMENT_METHOD_LABEL[selectedOrder.paymentMethod] || "-"}</dd>
          </div>
        </dl>

        <div className="order-detail-panel__divider" />

        <div className="order-detail-panel__items">
          {(selectedOrder.items ?? []).map((item) => (
            <div
              key={`${item.menuId}-${item.menuName}`}
              className="order-detail-panel__item"
            >
              <div className="order-detail-panel__item-row">
                <strong>{item.menuName}</strong>
                <span className="order-detail-panel__qty">{item.quantity}개</span>
                <b className="order-detail-panel__price">
                  {formatItemPrice(item.unitPrice, isCancelledView)}
                </b>
              </div>
              <p className="order-detail-panel__meta">{formatOptionLine(item)}</p>
            </div>
          ))}
        </div>

        <div className="order-detail-panel__divider" />

        <section className="order-detail-panel__note">
          <h3>요청사항</h3>
          <p>{selectedOrder.requestNote || "요청사항 없음"}</p>
        </section>

        <div className="order-detail-panel__divider" />

        <div className="order-detail-panel__total">
          <span>{isCancelledView ? "총 취소 금액" : "총 결제 금액"}</span>
          <b>{formatCurrency(selectedOrder.totalAmount)}</b>
        </div>

        <footer
          className={`order-detail-panel__actions${
            isCancelledView ? " order-detail-panel__actions--refunded" : ""
          }`}
        >
          <button
            type="button"
            className="order-detail-panel__btn order-detail-panel__btn--close"
            onClick={onClose}
          >
            닫기
          </button>
          {canRefund ? (
            <button
              type="button"
              className="order-detail-panel__btn order-detail-panel__btn--refund"
              onClick={() => onRefund(selectedOrder.orderId)}
            >
              환불
            </button>
          ) : null}
          {canPrintReceipt ? (
            <button
              type="button"
              className={`order-detail-panel__btn ${
                isCancelledView
                  ? "order-detail-panel__btn--print-outline"
                  : "order-detail-panel__btn--print"
              }`}
              onClick={() => onPrintReceipt(selectedOrder.orderId)}
            >
              영수증 출력
            </button>
          ) : null}
        </footer>
      </div>
    </aside>
  );
}
