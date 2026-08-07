/*
 * SCR-009 / Live 주문 현황 — path "/" (로그인 후 홈)
 * 이 Page는 래퍼만 담당. 실제 UI·상태·액션은 LiveOrderBoard.
 */
import LiveOrderBoard from "../../components/admin/LiveOrderBoard.jsx";

export default function LiveOrderPage() {
  return <LiveOrderBoard />;
}
