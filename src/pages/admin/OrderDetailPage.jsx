/*
 * SCR-010 / 주문 상세·상태 변경 — 라우트 미연결
 *
 * mock: getAdminOrderById(orderId).data
 *   order: orderId, orderNo, orderType, totalAmount, orderStatus, paymentStatus,
 *          paymentMethod, createdAt, itemCount, menuSummary, requestNote, items[]
 *   item:  menuId, menuName, quantity, unitPrice,
 *          optionItems[{ optionItemId, name, quantity }],
 *          excludedIngredients[{ ingredientId, name }]
 * 표: public/mocks/README.md §2
 *
 * Props 후보: order, nextStatusActions, isUpdating, onChangeStatus
 * Badge에서 PATCH 직접 호출 금지 · 실패 시 롤백
 *
 * 이번 mock 범위: 주문 상세 정본은 `/orders`의 OrderDetailPanel.
 * 이 페이지 별도 라우트는 팀 합의 후.
 */
// 이번 mock 범위 제외: OrderDetailPage 단독 라우트 (패널이 정본)

import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";

export default function OrderDetailPage() {
  // 이번 mock 범위 제외: 정본은 /orders OrderDetailPanel (TODO(28))
  // 아래는 미리보기 정적 UI — 라우트 합의 전 하드코딩 유지
  return (
    <section className="admin-page">
      <AdminPageHeader title="주문 관리" description="주문 상세와 상태 변경 UI 미리보기" />
      <div className="admin-filter-bar">
        <button type="button" disabled>오늘</button><button type="button" disabled>전체 상태</button>
        <input value="주문번호 또는 메뉴명 검색" disabled readOnly />
      </div>
      <table className="admin-static-table"><thead><tr><th>주문번호</th><th>주문일시</th><th>주문방식</th><th>메뉴</th><th>수량</th><th>결제</th><th>상태</th></tr></thead><tbody><tr><td>#----------</td><td>----.--.-- --:--</td><td>포장</td><td>주문 메뉴</td><td>-</td><td>결제완료</td><td>접수</td></tr></tbody></table>
      <aside className="admin-detail-panel">
        <div><span>주문 상세</span><strong>#----------</strong></div>
        <p>주문 데이터 연결 후 메뉴와 옵션이 표시됩니다.</p>
        <button type="button" disabled>상태 변경</button>
      </aside>
    </section>
  );
}
