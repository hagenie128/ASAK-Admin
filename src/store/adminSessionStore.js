/*
 * Figma Component 연결 후보: (해당 없음)
 * 현재 코드 역할: 관리자 mock 세션·인증 여부만 보관
 * 최종 명칭 확인 필요: adminSessionStore
 * Figma 승인 후 연결할 Props: 해당 없음
 * 이 파일이 직접 처리하면 안 되는 상태: 로그인 폼 입력·오류 문구, 주문/품절 Draft
 *
 * 주의: 비밀번호·원문 토큰을 persistent storage에 두지 말 것 (기존 안내 유지)
 * 이번 mock 범위: mock 세션 최소 동작만. BACKEND 연동 후: 실인증·토큰 갱신.
 * TODO-065 연동: adminSession.js 와 세션 스키마 단일화
 */

import { create } from "zustand";

/**
 * 관리자 앱의 공유 세션 상태입니다. 지금은 어떤 화면에도 연결하지 않으므로
 * 로그인·API 호출·라우팅을 실행하지 않습니다.
 */
export const useAdminSessionStore = create((set) => ({
  session: null,
  isAuthenticated: false,

  setSession: (session) => set({ session, isAuthenticated: Boolean(session) }),
  clearSession: () => set({ session: null, isAuthenticated: false }),
}));

// 이전 명칭은 기존 문서와의 연결을 위해 남기며, 화면에서는 사용하지 않습니다.
export const adminSessionStore = {
  // 최소 Stub — 완성 로직 없음. Zustand create는 학습자가 기존 패턴 보고 작성.
  _hint: "zustand create 로 교체 예정. 현재는 연결 금지.",
};
