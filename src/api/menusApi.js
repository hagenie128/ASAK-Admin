import { apiClient } from "./apiClient.js";

export const menusApi = {
  listMenus: () => apiClient.get("/admin/menus"),
  getMenu: (menuId) => apiClient.get(`/admin/menus/${menuId}`),
  listActiveMenus: () => apiClient.get("/admin/menus/active"),
  // TODO-043: createMenu: (body) => apiClient.post("/admin/menus", body),
  // TODO-044: updateMenu: (menuId, body) => apiClient.patch(`/admin/menus/${menuId}`, body),
  // TODO-045: deleteMenu: (menuId) => apiClient.delete(`/admin/menus/${menuId}`),
};
