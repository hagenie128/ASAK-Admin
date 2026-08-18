/*
 * 주문/결제 상태 배지
 */
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL } from "../../../constants/orderLabels.js";

const ORDER_TONE = {
  READY: "received",
  RECEIVED: "received",
  PREPARING: "preparing",
  COMPLETED: "complete",
  CANCELED: "cancelled",
  REFUNDED: "cancelled",
};

const PAYMENT_TONE = {
  APPROVED: "received",
  READY: "preparing",
  FAILED: "cancelled",
  UNPAID: "cancelled",
  PARTIAL_PAID: "preparing",
  CANCELED: "cancelled",
  REFUNDED: "cancelled",
};

export default function OrderStatusBadge({ orderStatus, paymentStatus }) {
  if (paymentStatus) {
    return (
      <span className={`order-status order-status--${PAYMENT_TONE[paymentStatus] || "complete"}`}>
        {PAYMENT_STATUS_LABEL[paymentStatus] ?? paymentStatus}
      </span>
    );
  }
  return (
    <span className={`order-status order-status--${ORDER_TONE[orderStatus] || "complete"}`}>
      {ORDER_STATUS_LABEL[orderStatus] ?? orderStatus}
    </span>
  );
}
