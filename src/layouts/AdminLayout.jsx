/*
 * Figma Component 연결 후보: AdminLayout
 * 현재 코드 역할: Sidebar + Header + 본문(children) 셸.
 * Figma Navbar Model: Desktop(>1280) / Tablet(≤1280)
 *
 * 캔버스: Figma 1920×1080 고정 → 브라우저 창에 맞게 통째로 scale
 * (창이 작아도 시안 비율·글자 크기가 “작아진 1080”처럼 보임)
 *
 * 데이터 흐름:
 *   main.jsx → AdminApp → AdminLayout → children Page
 */

import { useEffect, useState } from "react";
import AdminSidebar from "../components/admin/shared/AdminSidebar.jsx";

const TABLET_MQ = "(max-width: 1280px)";
const CANVAS_W = 1920;
const CANVAS_H = 1080;

function useAdminCanvasScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const next = Math.min(window.innerWidth / CANVAS_W, window.innerHeight / CANVAS_H);
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
  const [sidebarModel, setSidebarModel] = useState(() =>
    typeof window !== "undefined" && window.matchMedia(TABLET_MQ).matches ? "Tablet" : "Desktop",
  );

  useEffect(() => {
    const mq = window.matchMedia(TABLET_MQ);
    const sync = () => setSidebarModel(mq.matches ? "Tablet" : "Desktop");
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className="admin-viewport">
      <div
        className="admin-scale-slot"
        style={{ width: CANVAS_W * scale, height: CANVAS_H * scale }}
      >
        <div
          className={`admin-app${sidebarModel === "Tablet" ? " admin-app--tablet" : ""}`}
          style={{ transform: `scale(${scale})` }}
        >
          <AdminSidebar model={sidebarModel} />
          <main className="admin-main">{children}</main>
        </div>
      </div>
    </div>
  );
}
