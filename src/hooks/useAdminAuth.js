/*
 * [미연결] JWT 연동 후보 Hook.
 * 앱 실행 정본은 auth/adminSession.js (AdminApp / LoginPage / AdminSidebar).
 * 이 파일과 store/adminSessionStore.js 는 화면·라우트에서 import 하지 말 것.
 *
 * TODO-068: JWT 세션 + 보호 라우트 401 리다이렉트 시 adminSession 과 스키마 단일화.
 */

import { useAdminSessionStore } from "../store/adminSessionStore.js";

export function useAdminAuth() {
  const session = useAdminSessionStore((state) => state.session);
  const isAuthenticated = useAdminSessionStore((state) => state.isAuthenticated);

  return { session, isAuthenticated };
}
