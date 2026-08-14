/*
 * Figma Component 연결 후보: AdminLayout
 * 현재 코드 역할: Sidebar + Header + 본문(children) 셸.
 *
 * 정본: docs/Figma 1920×1080 Desktop.
 * 본문은 contain scale로 비율을 유지하고,
 * 사이드바만 뷰포트 높이(100dvh)를 채운다.
 *
 * 데이터 흐름:
 *   main.jsx → AdminApp → AdminLayout → children Page
 */

import { useEffect, useState } from "react";
import AdminSidebar from "../components/admin/shared/AdminSidebar.jsx";

const CANVAS_W = 1920;
const CANVAS_H = 1080;
const SIDEBAR_W = 240;
const MAIN_W = CANVAS_W - SIDEBAR_W;

function useAdminCanvasScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const next = Math.min(vw / CANVAS_W, vh / CANVAS_H);
      setScale(Number.isFinite(next) && next > 0 ? next : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return scale;
}

export default function AdminLayout({ children }) {
  const scale = useAdminCanvasScale();

  return (
    <div className="admin-viewport" style={{ "--admin-scale": scale }}>
      <div className="admin-shell" style={{ width: CANVAS_W * scale }}>
        <div className="admin-sidebar-slot" style={{ width: SIDEBAR_W * scale }}>
          <AdminSidebar model="Desktop" />
        </div>
        <div className="admin-main-slot" style={{ width: MAIN_W * scale }}>
          <main className="admin-main">{children}</main>
        </div>
      </div>
    </div>
  );
}
