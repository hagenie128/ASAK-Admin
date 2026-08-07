/*
 * [미연결] JWT용 zustand 후보.
 * 실행 중 세션 정본: auth/adminSession.js
 * TODO-065: adminSession.js 와 스키마 단일화 후 앱에 연결.
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
