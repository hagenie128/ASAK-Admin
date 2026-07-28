// 주문 요청 모듈 자리.
import { apiClient } from "./apiClient.js";

/*
  주문 관련 API 함수
*/
export const ordersApi = {
  // 주문 목록
  listOrders: (params) => apiClient.get("/admin/orders", { params }),
  // 주문 상세
  getOrder: (orderId) => apiClient.get(`/admin/orders/${orderId}`),
  // 활성 주문 목록
  listActiveOrders: () => apiClient.get("/admin/orders/active"),
};
