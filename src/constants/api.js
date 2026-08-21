/**
 * Client-facing Admin API contract: `/api/admin` paths and camelCase JSON.
 * 현재 호출 구현: orders/menus/dashboard/soldOut/sales. 결제수단·인증·환불 경로는 아직 정본 계약 확정 또는 호출 구현이 필요하다.
 * 특히 paymentMethods는 현재 Controller camelCase와 Product Bible kebab-case 표기가 달라 호출 전에 정본을 확정한다.
 */
export const API_BASE_PATH = "/api/admin";

export const API_ENDPOINTS = Object.freeze({
  // TODO-023~025 구현 완료: dashboard는 백엔드 집계 → adminApi → useDashboard 순서로 연결된다.
  login: `${API_BASE_PATH}/login`,
  dashboard: `${API_BASE_PATH}/dashboard`,

  orders: `${API_BASE_PATH}/orders`,
  order: (orderId) => `${API_BASE_PATH}/orders/${orderId}`,
  liveOrders: `${API_BASE_PATH}/orders/live`,
  orderStatus: (orderId, status) => `${API_BASE_PATH}/orders/${orderId}/${status}`,
  orderCancel: (orderId) => `${API_BASE_PATH}/orders/${orderId}/cancel`,

  menus: `${API_BASE_PATH}/menus`,
  menu: (menuId) => `${API_BASE_PATH}/menus/${menuId}`,
  menuCategories: `${API_BASE_PATH}/menus/categories`,
  menuIngredients: `${API_BASE_PATH}/menus/ingredients`,

  // TODO-007~010 구현 완료: soldOut은 GET 카탈로그와 PATCH changes[]를 사용한다. 옵션 항목도 API에는 포함되지만 현 화면 탭은 숨긴다.
  // TODO-015~022 구현 완료: summary/monthly/daily/time-slots는 각 응답 shape에 맞는 별도 호출이다.
  // TODO-011~014: paymentMethods는 Controller camelCase와 Product Bible kebab-case 표기 정본을 확정한 뒤 연결한다.
  paymentMethods: `${API_BASE_PATH}/paymentMethods`,
  soldOut: `${API_BASE_PATH}/soldOut`,
  salesSummary: `${API_BASE_PATH}/sales/summary`,
  salesMonthly: `${API_BASE_PATH}/sales/monthly`,
  salesDaily: `${API_BASE_PATH}/sales/daily`,
  salesDailyTimeSlots: `${API_BASE_PATH}/sales/daily/time-slots`,

  printReceipt: (orderId) => `${API_BASE_PATH}/orders/${orderId}/receipt-print-text`,
  deviceEvents: `${API_BASE_PATH}/device-events`,
});
