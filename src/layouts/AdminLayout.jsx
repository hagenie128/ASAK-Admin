/*
 * Figma Component 연결 후보: AdminLayout
 * 현재 코드 역할: Sidebar + Header + 본문(children) 셸.
 *
 * 정본: docs/Figma 1920×1080 Desktop. 캔버스는 항상 Desktop Navbar(240).
 * 창이 좁아도 contain scale만 하고, 뷰포트 너비로 Tablet rail로 바꾸지 않는다.
 * (뷰포트 media query는 scale된 1920 레이아웃을 깨뜨림)
 *
 * 데이터 흐름:
 *   main.jsx → AdminApp → AdminLayout → children Page
 */

import { useEffect, useState } from "react";
import AdminSidebar from "../components/admin/shared/AdminSidebar.jsx";

const CANVAS_W = 1920;
const CANVAS_H = 1080;

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
    <div className="admin-viewport">
      <div
        className="admin-scale-slot"
        style={{ width: CANVAS_W * scale, height: CANVAS_H * scale }}
      >
        <div className="admin-app" style={{ transform: `scale(${scale})` }}>
          <AdminSidebar model="Desktop" />
          <main className="admin-main">{children}</main>
        </div>
      </div>
    </div>
  );
}
