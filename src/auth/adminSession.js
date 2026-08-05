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
    // TODO-065: token 존재·만료 여부로 판정
    return Boolean(parsed?.loggedIn);
  } catch {
    return false;
  }
}

export function loginAdmin({ remember = true } = {}) {
  // TODO-065: adminApi.login 응답 token 저장 (remember에 따라 storage 선택)
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
