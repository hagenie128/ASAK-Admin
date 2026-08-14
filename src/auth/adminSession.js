/**
 * 관리자 세션 (임시 mock).
 * 실인증 API가 붙기 전까지 web storage만 사용한다.
 * remember=true → localStorage / false → sessionStorage (탭 종료 시 로그아웃)
 */
const STORAGE_KEY = "asak-admin-session-v2";

function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAdminLoggedIn() {
  // TODO-065: TODO-064의 access token 존재·만료·파싱 실패를 기준으로 세션을 판정한다.
  // 단순 loggedIn 플래그는 JWT 인증 전 임시 mock 호환용이며, 만료 토큰을 로그인 상태로 취급하지 않는다.
  return Boolean(readSession()?.loggedIn);
}

export function loginAdmin({ remember = false } = {}) {
  // TODO-065: adminApi.login 응답의 token/expiry를 저장한다. remember=true는 localStorage,
  // false는 sessionStorage를 사용하고, 원문 password·민감 응답은 저장하지 않는다.
  logoutAdmin();
  const payload = {
    loggedIn: true,
    loggedInAt: new Date().toISOString(),
    remember: Boolean(remember),
  };
  const store = remember ? localStorage : sessionStorage;
  store.setItem(STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export function logoutAdmin() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
  // 이전 키(v1) 잔여 세션 제거
  localStorage.removeItem("asak-admin-session");
  sessionStorage.removeItem("asak-admin-session");
}
