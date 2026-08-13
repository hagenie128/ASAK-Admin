/*
 * [미연결] JWT 연동 후보 Hook.
 * 앱 실행 정본은 auth/adminSession.js (AdminApp / LoginPage / AdminSidebar).
 * 이 파일과 store/adminSessionStore.js 는 화면·라우트에서 import 하지 말 것.
 *
 * TODO-068: TODO-065 세션 스키마와 TODO-066 401 처리 기준을 확정한 뒤 JWT 보호 라우트를 연결한다.
 * 로그인 전 접근·만료 후 접근·401 중복 리다이렉트·로그아웃 후 뒤로가기를 각각 확인한다.
 */

import { useAdminSessionStore } from "../store/adminSessionStore.js";

export function useAdminAuth() {
  const session = useAdminSessionStore((state) => state.session);
  const isAuthenticated = useAdminSessionStore((state) => state.isAuthenticated);

  return { session, isAuthenticated };
}
