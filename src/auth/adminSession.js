/**
 * 관리자 세션 (임시 mock).
 * 실인증 API가 붙기 전까지 localStorage만 사용한다.
 * 키/값 형식은 나중에 token 스키마로 교체할 수 있게 얇게 유지한다.
 */
const STORAGE_KEY = "asak-admin-session";

export function isAdminLoggedIn() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    // TODO-065: TODO-064의 access token 존재·만료·파싱 실패를 기준으로 세션을 판정한다.
    // 단순 loggedIn 플래그는 JWT 인증 전 임시 mock 호환용이며, 만료 토큰을 로그인 상태로 취급하지 않는다.
    return Boolean(parsed?.loggedIn);
  } catch {
    return false;
  }
}

export function loginAdmin({ remember = true } = {}) {
  // TODO-065: adminApi.login 응답의 token/expiry를 저장한다. remember=true는 localStorage,
  // false는 sessionStorage를 사용하고, 원문 password·민감 응답은 저장하지 않는다.
  const payload = {
    loggedIn: true,
    loggedInAt: new Date().toISOString(),
    remember: Boolean(remember),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export function logoutAdmin() {
  localStorage.removeItem(STORAGE_KEY);
}
