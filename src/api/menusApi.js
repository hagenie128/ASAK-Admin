import { apiClient } from "./apiClient.js";

export const menusApi = {
  listMenus: (params) => apiClient.get("/admin/menus", { params }),
  getMenu: (menuId) => apiClient.get(`/admin/menus/${menuId}`),
  listCategories: () => apiClient.get("/admin/menus/categories"),
  // BE에 /admin/menus/active 없음 — 필요 시 Controller 추가 후 함수 재도입
  createMenu: (payload) => apiClient.post("/admin/menus", payload),
  updateMenu: (menuId, payload) => apiClient.patch(`/admin/menus/${menuId}`, payload),
  deleteMenu: (menuId) => apiClient.delete(`/admin/menus/${menuId}`),
  getIngredients: () => apiClient.get(`/admin/menus/ingredients`),
};
