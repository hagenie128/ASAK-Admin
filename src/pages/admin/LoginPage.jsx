/*
 * SCR-015 / Login / Default (Figma node 134:12033)
 * 인증 API 없음 → adminSession(localStorage) mock만.
 *
 * mock 시나리오(JSON meta/scenarios.login 참고): admin | kitchen | viewer | invalid
 * 세션: loginAdmin() / logoutAdmin() — src/auth/adminSession.js
 * 성공 시 navigate "/" (주문 현황)
 * Props: onLoggedIn? (선택 콜백)
 */
import { useState } from "react";
import loginLogo from "../../assets/svg/logo-F.svg";
import loginBg from "../../assets/figma/login-bg.png";
import { loginAdmin } from "../../auth/adminSession.js";
import { requestAppFullscreen } from "../../utils/fullscreen.js";

export default function LoginPage({ onLoggedIn } = {}) {
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      // 태블릿 Chrome: 로그인 터치 = 사용자 제스처 → 주소창 숨김 전체화면
      await requestAppFullscreen();
      // TODO-034: TODO-031 login API 완료 후 adminApi.login → token 전달(loginAdmin 교체) 순서로 연결한다.
      // submitting 중 중복 요청을 막고, 401은 비밀번호 오류 안내로 표시하며 네트워크 오류와 구분한다.
      loginAdmin({ remember });
      onLoggedIn?.();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page">
      <img className="admin-login-page__photo" alt="" aria-hidden="true" src={loginBg} />
      <div className="admin-login-page__veil" aria-hidden="true" />
      <div className="admin-login-page__tint" aria-hidden="true" />

      <section className="admin-login-card">
        <div className="admin-login-card__head">
          <img className="admin-login-card__brand" src={loginLogo} alt="ASAK" />
          <h1>관리자 로그인</h1>
        </div>

        <form className="admin-login-card__form" onSubmit={handleSubmit}>
          <label className="admin-login-field">
            <span>아이디</span>
            <input name="username" defaultValue="admin_asak" autoComplete="username" />
          </label>
          <label className="admin-login-field">
            <span>비밀번호</span>
            <input
              name="password"
              type="password"
              defaultValue="password"
              autoComplete="current-password"
            />
          </label>

          <label className="admin-login-card__check">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>로그인 상태 유지</span>
          </label>

          <button type="submit" className="admin-login-card__submit" disabled={submitting}>
            {submitting ? "로그인 중…" : "로그인"}
          </button>
        </form>

        <small>© 2025 ASAK. All Rights Reserved.</small>
      </section>
    </main>
  );
}
