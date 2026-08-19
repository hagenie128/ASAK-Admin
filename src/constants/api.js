/**
 * Client-facing Admin API contract: `/api/admin` paths and camelCase JSON.
 * 현재 호출 구현: orders/menus. 선언만 된 경로: TODO-007~037의 백엔드·프런트 순서가 완료된 뒤 사용한다.
 * 특히 paymentMethods는 현재 Controller camelCase와 Product Bible kebab-case 표기가 달라 호출 전에 정본을 확정한다.
 */
export const API_BASE_PATH = "/api/admin";

export const API_ENDPOINTS = Object.freeze({
  // Auth/dashboard: backend TODO-023/027~030 → frontend TODO-024/025/031~035 순서.
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

  // Sold out: TODO-007 → 008 → 009 → 010. Payment methods: TODO-011 → 012 → 013 → 014.
  // Sales: TODO-015~018 → 019~022. 아래 경로 상수는 호출 구현이나 endpoint 존재 증거가 아니다.
  paymentMethods: `${API_BASE_PATH}/paymentMethods`,
  soldOut: `${API_BASE_PATH}/soldOut`,
  salesSummary: `${API_BASE_PATH}/sales/summary`,
  salesMonthly: `${API_BASE_PATH}/sales/monthly`,
  salesDaily: `${API_BASE_PATH}/sales/daily`,
});
