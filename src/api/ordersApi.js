// 주문 API (SCR-009/010) — 실연동됨
import { apiClient } from "./apiClient.js";
import { API_ENDPOINTS } from "../constants/api.js";

export const ordersApi = {
  listOrders: (params) => apiClient.get(API_ENDPOINTS.orders, { params }),
  getOrder: (orderId) => apiClient.get(API_ENDPOINTS.order(orderId)),
  listLiveOrders: () => apiClient.get(API_ENDPOINTS.liveOrders),
  changeOrderStatus: (orderId, status) => apiClient.patch(API_ENDPOINTS.orderStatus(orderId, status)),
  cancelOrder: (orderId) => apiClient.patch(API_ENDPOINTS.orderCancel(orderId)),
  // TODO-040: backend TODO-038/039에서 refund 경로·요청 body·결제 상태 전이·ErrorCode를 확정한 뒤
  // API_ENDPOINTS.refundOrder와 refundOrder를 추가한다. cancel API를 환불에 재사용하지 않는다.
  // TODO-041: 영수증 출력은 backend의 출력 책임(브라우저 인쇄/서버 발급)과 응답 형식이 확정된 뒤
  // API_ENDPOINTS.printReceipt와 printReceipt를 추가하고, 재시도 시 중복 출력 규칙을 검증한다.
};
