import { apiClient } from "./apiClient.js";

export const menusApi = {
  listMenus: (params) => apiClient.get("/admin/menus", { params }),
  getMenu: (menuId) => apiClient.get(`/admin/menus/${menuId}`),
  listCategories: () => apiClient.get("/admin/menus/categories"),
  getIngredients: () => apiClient.get(`/admin/menus/ingredients`),
  // BE에 /admin/menus/active 없음 — 필요 시 Controller 추가 후 함수 재도입
  // TODO-020: 메뉴 등록 FE 1/3 — createMenu API 함수 추가.
  // 1) backend TODO-017~019 완료 후 payload/request type(JSON vs multipart) 확정
  // 2) POST /api/admin/menus 호출 함수(createMenu) 추가
  // 3) 성공 응답에서 menuId/name/imageUrl를 화면이 바로 쓸 수 있게 유지
  createMenu: (payload) => apiClient.post("/admin/menus", payload),
  // TODO-026: 메뉴 수정 FE 1/3 — updateMenu API 함수 추가.
  // 1) backend TODO-023~025 완료 후 수정 payload 확정
  // 2) PATCH /api/admin/menus/{menuId} 호출 함수(updateMenu) 추가
  // 3) 수정 성공 응답을 상세/목록 동기화에 바로 쓸 수 있게 맞춘다
  updateMenu: (menuId, payload) => apiClient.patch(`/admin/menus/${menuId}`, payload),
  // TODO-032: 메뉴 삭제 FE 1/3 — deleteMenu API 함수 추가.
  // 1) backend TODO-029~031 완료 후 삭제 응답 규격 확정
  // 2) DELETE /api/admin/menus/{menuId} 호출 함수(deleteMenu) 추가
  // 3) 삭제 성공 여부를 refetch/선택 이동 로직이 해석하기 쉽게 유지
  deleteMenu: (menuId) => apiClient.delete(`/admin/menus/${menuId}`),
  // TODO-037: 재료 검색 FE 1/3 — listIngredients API 함수 추가.
  // 1) backend TODO-035~036 완료 후 query param(keyword/page/size) 규격 확정
  // 2) GET /api/admin/ingredients 또는 확정 endpoint 호출 함수 추가
  // 3) 자동완성/검색 모달이 그대로 재사용할 수 있는 응답 shape로 둔다
};
