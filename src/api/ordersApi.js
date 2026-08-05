// 주문 API (SCR-009/010) — 실연동됨
import { apiClient } from "./apiClient.js";

export const ordersApi = {
  listOrders: (params) => apiClient.get("/admin/orders", { params }),
  getOrder: (orderId) => apiClient.get(`/admin/orders/${orderId}`),
  listLiveOrders: () => apiClient.get("/admin/orders/live"),
  changeOrderStatus: (orderId, status) => apiClient.patch(`/admin/orders/${orderId}/${status}`),
  cancelOrder: (orderId) => apiClient.patch(`/admin/orders/${orderId}/cancel`),
  // TODO-073: refundOrder: (orderId) => apiClient.patch(`/admin/orders/${orderId}/refund`),
  // TODO-074: printReceipt: (orderId) => apiClient.post(`/admin/orders/${orderId}/receipt`),
};
