/*
 * Figma Component 연결 후보: (해당 약함) — 인증 가드는 Figma Component보다 흐름 책임
 * 현재 코드 역할: 로그인 여부 확인, 보호 라우트 진입 허용/차단
 * 최종 명칭 확인 필요: useAdminAuth
 * Figma 승인 후 연결할 Props: 해당 없음 (Hook)
 * 이 파일이 직접 처리하면 안 되는 상태: 비밀번호 저장, 로그인 폼 입력값, 주문 데이터
 *
 * 데이터 흐름: LoginPage → (예정) auth API → adminSessionStore ← useAdminAuth ← 보호 Route
 * 이번 mock 범위: mock 세션 읽기만. BACKEND 연동 후: 실 401 처리·실인증.
 * TODO-068: JWT 세션 + 보호 라우트 401 리다이렉트
 */

import { useAdminSessionStore } from "../store/adminSessionStore.js";

export function useAdminAuth() {
  const session = useAdminSessionStore((state) => state.session);
  const isAuthenticated = useAdminSessionStore((state) => state.isAuthenticated);

  return { session, isAuthenticated };
}
