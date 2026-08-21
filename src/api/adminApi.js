/**
 * 대시보드·로그인 API.
 * apiClient interceptor가 ApiResponse envelope를 해제하므로 각 메서드는 data만 반환한다.
 */
import { apiClient } from "./apiClient.js";
import { API_ENDPOINTS } from "../constants/api.js";

export const adminApi = {
  getDashboard() {
    return apiClient.get(API_ENDPOINTS.dashboard);
  },

  // TODO-031: login — POST /api/admin/login의 token 응답 계약 확정 후 adminSession으로 넘긴다.
  // 401은 화면에서 표시하고, interceptor가 성공 응답의 data만 반환한다는 점을 유지한다.
};
