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

  getMonthly({ year }) {
    return apiClient.get(API_ENDPOINTS.salesMonthly, { params: { year } });
  },

  getDaily({ from, to } = {}) {
    return apiClient.get(API_ENDPOINTS.salesDaily, { params: { from, to } });
  },

  getDailyTimeSlots({ date, intervalMinutes }) {
    return apiClient.get(API_ENDPOINTS.salesDailyTimeSlots, {
      params: { date, intervalMinutes },
    });
  },

  // 모든 매출 메서드는 API_ENDPOINTS를 사용하며, 날짜 query·빈 데이터·서버 오류는 화면 훅에서 처리한다.
};
