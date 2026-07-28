import { apiClient } from "./client.js";

/*
  메뉴 관련 API 함수
*/
export const adminApi = {
  // 전체 메뉴 목록
  listMenus: () => apiClient.get("/admin/menus"),
  // 메뉴 상세
  getMenu: (menuId) => apiClient.get(`/admin/menus/${menuId}`),
  // 활성 메뉴 목록
  listActiveMenus: () => apiClient.get("/admin/menus/active"),
};
