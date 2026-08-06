import { apiClient } from "./apiClient.js";

export const menusApi = {
  listMenus: (params) => apiClient.get("/admin/menus", { params }),
  getMenu: (menuId) => apiClient.get(`/admin/menus/${menuId}`),
  listActiveMenus: () => apiClient.get("/admin/menus/active"),
  listCategories: () => apiClient.get("/admin/menus/categories"),
  // TODO-023: 메뉴 등록 API 추가.
  // 1) MenuEditPanel 저장 payload shape 확정
  // 2) image 업로드 방식(multipart/json) 확정
  // 3) POST /api/admin/menus 호출 함수(createMenu) 추가
  // TODO-024: 메뉴 수정 API 추가.
  // 1) edit payload shape 확정
  // 2) menuId + 기본 필드를 PATCH /api/admin/menus/{menuId} 로 전송
  // 3) MenuManagePage save handler가 바로 호출할 수 있게 함수(updateMenu) 추가
  // TODO-030: 메뉴 삭제 API 추가.
  // 1) 선택된 menuId를 DELETE /api/admin/menus/{menuId} 로 전송
  // 2) 성공 시 refetch에 사용할 함수(deleteMenu) 추가
};
