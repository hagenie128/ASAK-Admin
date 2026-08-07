/*
 * 페이지네이션 UI (공통)
 *
 * Props:
 *   page          — 현재 페이지 (0-based)
 *   pageSize      — 한 페이지 크기 (화면별 constants/pagination.js)
 *   totalElements — 전체 건수
 *   onPageChange  — (nextPage: number) => void
 *   windowSize    — 한 번에 보일 페이지 번호 개수 (화면별로 다를 수 있음)
 *
 * mock/실 API 모두 totalElements + page만 있으면 동작한다.
 * pageSize / windowSize는 호출 화면에서 넘긴다 (전역 고정 금지).
 */

const DEFAULT_WINDOW = 5;

export default function AdminPagination({
  className = "",
  page,
  pageSize,
  totalElements,
  onPageChange,
  windowSize = DEFAULT_WINDOW,
}) {
  const totalPages = Math.max(1, Math.ceil((totalElements || 0) / (pageSize || 1)));
  const win = Math.max(1, windowSize || DEFAULT_WINDOW);

  if (totalElements <= pageSize) {
    return null;
  }

  // 현재 page 기준으로 [start, end) 번호 구간
  let start = Math.max(0, page - Math.floor(win / 2));
  let end = start + win;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(0, end - win);
  }

  const pages = [];
  for (let i = start; i < end; i += 1) pages.push(i);

  return (
    <div
      className={`order-management__pagination${className ? ` ${className}` : ""}`}
      aria-label="페이지네이션"
    >
      <button
        type="button"
        className="order-management__page-nav"
        disabled={page <= 0}
        aria-label="이전 페이지"
        onClick={() => onPageChange(page - 1)}
      >
        ‹
      </button>
      {pages.map((p) =>
        p === page ? (
          <b key={p} aria-current="page">
            {p + 1}
          </b>
        ) : (
          <button
            key={p}
            type="button"
            className="order-management__page-btn"
            onClick={() => onPageChange(p)}
          >
            {p + 1}
          </button>
        ),
      )}

      <button
        type="button"
        className="order-management__page-nav"
        disabled={page >= totalPages - 1}
        aria-label="다음 페이지"
        onClick={() => onPageChange(page + 1)}
      >
        ›
      </button>
    </div>
  );
}
