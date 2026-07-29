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
  // Live 주문 보드: 메뉴·옵션·경과시간을 포함한 진행 중 주문 전체
  listLiveOrders: () => apiClient.get("/admin/orders/live"),
};
