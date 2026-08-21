/**
 * 대시보드·로그인 API.
 * apiClient interceptor가 ApiResponse envelope를 해제하므로 각 메서드는 data만 반환한다.
 */
import { apiClient } from "./apiClient.js";
import { API_ENDPOINTS } from "../constants/api.js";

// dashboard는 이 모듈의 단일 GET 호출로 제한하고 실패 표시는 hook이 처리한다.
// QA: 응답 DTO와 widget 값, 4xx/5xx 오류 전달을 실제 서버에서 확인한다.
export const adminApi = {
  getDashboard() {
    return apiClient.get(API_ENDPOINTS.dashboard);
  },

  // TODO-031: login — POST /api/admin/login의 token 응답 계약 확정 후 adminSession으로 넘긴다.
  // 401은 화면에서 표시하고, interceptor가 성공 응답의 data만 반환한다는 점을 유지한다.
};
