/*
 * [미연결] JWT용 zustand 후보.
 * 실행 중 세션 정본: auth/adminSession.js
 * TODO-065: adminSession.js와 accessToken·expiresAt·remember 세션 스키마를 통일한 뒤 인증에 연결한다.
 * storage 변경은 이 store와 직접 섞지 않고 auth/adminSession.js를 단일 읽기·쓰기 경계로 유지한다.
 */

import { create } from "zustand";

/** 화면·라우트에서 사용 금지. */
export const useAdminSessionStore = create((set) => ({
  session: null,
  isAuthenticated: false,

  setSession: (session) => set({ session, isAuthenticated: Boolean(session) }),
  clearSession: () => set({ session: null, isAuthenticated: false }),
}));

/** @deprecated 문서 호환용 이름만. 사용 금지. */
export const adminSessionStore = {
  _hint: "useAdminSessionStore / auth/adminSession.js 를 보라. 연결 금지.",
};
