import { useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import LiveOrderPage from "../pages/admin/LiveOrderPage.jsx";
import LoginPage from "../pages/admin/LoginPage.jsx";
import OrderManagePage from "../pages/admin/OrderManagePage.jsx";
import SoldOutManagePage from "../pages/admin/SoldOutManagePage.jsx";
import MenuManagePage from "../pages/admin/MenuManagePage.jsx";
import MenuEditPage from "../pages/admin/MenuEditPage.jsx";
import PaymentMethodPage from "../pages/admin/PaymentMethodPage.jsx";
import SalesSummaryPage from "../pages/admin/SalesSummaryPage.jsx";
import DailySalesPage from "../pages/admin/DailySalesPage.jsx";
import MonthlySalesPage from "../pages/admin/MonthlySalesPage.jsx";
import DashboardPage from "../pages/admin/DashboardPage.jsx";
import UiStatePreviewPage from "../pages/dev/UiStatePreviewPage.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import { isAdminLoggedIn } from "../auth/adminSession.js";
import "../styles/tokens.css";
import "../styles/reset.css";
import "../styles/global.css";
import "../styles/commonStyle.css";

/*
 * 라우트 정책 (2026-07-21):
 * - 비로그인: 진입점(`/`)·보호 경로 → 로그인 화면
 * - 로그인 후 `/` = SCR-009 주문 현황(Live Order) = 운영 홈
 * - Canonical `/orders/live` → `/` soft alias (문서·북마크 정렬용, 실서버 아님)
 * - `/dashboard` = SCR-022 대시보드 (사이드바 Home)
 * - `/login` = SCR-015 (이미 로그인된 경우 `/`로 보냄)
 * - `/orders` = SCR-010 주문 관리(목록 + 상세 패널)
 *
 * 실행 정본은 이 파일의 코드 경로다.
 */

function AdminScreen({ title, screenId }) {
  return (
    <section className="admin-screen">
      <p className="screen-id">{screenId}</p>
      <h1>{title}</h1>
      <p>ASAK 운영을 위한 관리자 전용 화면입니다.</p>
      <div className="empty-state">화면 기능은 일정에 따라 이 앱 안에서 독립적으로 구현합니다.</div>
    </section>
  );
}

function useAuthTick() {
  // 로그인/로그아웃 후 같은 트리에서 즉시 다시 그리기 위한 트리거
  const [tick, setTick] = useState(0);
  return {
    tick,
    refreshAuth: () => setTick((n) => n + 1),
  };
}

export default function AdminApp() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { tick, refreshAuth } = useAuthTick();
  const loggedIn = useMemo(() => isAdminLoggedIn(), [tick, pathname]);

  if (pathname.startsWith("/ui-preview/")) {
    return (
      <Routes>
        <Route path="/ui-preview/:screen/:state" element={<UiStatePreviewPage />} />
      </Routes>
    );
  }

  if (!loggedIn) {
    if (pathname === "/login" || pathname === "/") {
      return (
        <LoginPage
          onLoggedIn={() => {
            refreshAuth();
            navigate("/", { replace: true });
          }}
        />
      );
    }
    return <Navigate to="/login" replace state={{ from: pathname }} />;
  }

  if (pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  // 로그인 후 `/` = 주문 현황 (운영 홈). Canonical `/orders/live`는 `/`로 정렬.
  if (pathname === "/") return <LiveOrderPage />;
  if (pathname === "/orders/live") return <Navigate to="/" replace />;

  // TODO-069: 화면 URL의 canonical camelCase(/soldOut, /paymentMethods)와 실행 kebab-case/soft alias를 정렬한다.
  // Figma·Screen Bible의 Route와 React Router 정본을 하나로 정한 뒤, 기존 즐겨찾기용 alias는 Navigate로만 유지한다.
  const staticPages = {
    "/dashboard": <DashboardPage />,
    "/orders": <OrderManagePage />,
    "/sold-out": <SoldOutManagePage />,
    "/menus": <MenuManagePage />,
    "/menus/new": <MenuEditPage />,
    "/menus/edit": <MenuEditPage />,
    "/payment-methods": <PaymentMethodPage />,
    "/sales": <SalesSummaryPage />,
    "/sales/monthly": <MonthlySalesPage />,
    "/sales/daily": <DailySalesPage />,
  };

  if (staticPages[pathname]) {
    return <AdminLayout>{staticPages[pathname]}</AdminLayout>;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="*" element={<AdminScreen title="페이지를 찾을 수 없습니다" screenId="404" />} />
      </Routes>
    </AdminLayout>
  );
}
