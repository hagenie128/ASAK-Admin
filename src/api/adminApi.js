/**
 * 대시보드·로그인 API — 미구현 셸.
 * 대시보드: useDashboard → mock / 로그인: auth/adminSession.js
 * TODO-024 · TODO-031 순서가 완료되기 전에는 메서드 추가·호출 금지.
 * TODO-024은 GET /api/admin/dashboard 응답 DTO·집계 SQL을 먼저 확정하고,
 * TODO-031는 TODO-027~030의 로그인·JWT·보호 경로가 동작한 뒤 연결한다.
 */
export const adminApi = {
  // TODO-024: getDashboard — apiClient/API_ENDPOINTS.dashboard를 연결하고,
  // mock useDashboard와 같은 loading·empty·error·refetch 계약을 유지한다.
  // TODO-031: login — POST /api/admin/login의 token 응답 계약 확정 후 adminSession으로 넘긴다.
  // 401은 화면에서 표시하고, interceptor가 성공 응답의 data만 반환한다는 점을 유지한다.
};
