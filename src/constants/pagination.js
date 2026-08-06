/**
 * Admin 화면별 페이지네이션 설정
 *
 * 공통 훅(usePagination) / UI(AdminPagination)는 재사용하되,
 * pageSize·번호창 크기 등은 이 파일의 화면 키로만 맞춘다.
 * 전역 기본값 하나에 묶지 않는다.
 */

/** @typedef {{ pageSize: number, windowSize?: number }} PaginationConfig */

/** @type {Record<string, PaginationConfig>} */
export const ADMIN_PAGINATION = {
  /** SCR-010 주문 관리 — 테이블 행 */
  orders: {
    pageSize: 15,
    windowSize: 5,
  },
  /** SCR-009 Live 주문 현황 — 카드(좌우 화살표) */
  liveOrders: {
    pageSize: 3,
  },
  /** SCR-011 품절 관리 — 카드 그리드 (좌/우 패널 동일) */
  soldOut: {
    pageSize: 12,
    windowSize: 5,
  },
  /** SCR-016 메뉴 관리 — 4열 × 3행 카드 그리드 (스크롤 없이 1페이지) */
  menus: {
    pageSize: 12,
    windowSize: 5,
  },
};
