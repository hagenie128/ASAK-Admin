/**
 * 매출 API. 공통 응답 envelope는 apiClient interceptor가 data만 해제한다.
 * Summary·Monthly·Daily 목록 화면은 기존 mock 훅을 유지한다.
 */
import { apiClient } from "./apiClient.js";
import { API_ENDPOINTS } from "../constants/api.js";

export const salesApi = {
  getSummary({ period, startDate, endDate } = {}) {
    return apiClient.get(API_ENDPOINTS.salesSummary, {
      params: { period, startDate, endDate },
    });
  },

  getDailyTimeSlots({ date, intervalMinutes }) {
    return apiClient.get(API_ENDPOINTS.salesDailyTimeSlots, {
      params: { date, intervalMinutes },
    });
  },

  // TODO-020: getMonthly({ year }) → GET /api/admin/sales/monthly
  // TODO-021: getDaily({ date }) → GET /api/admin/sales/daily
  // 각 메서드는 API_ENDPOINTS를 사용하고, 날짜 query·빈 데이터·서버 오류를 mock과 같은 반환 계약으로 검증한다.
};
