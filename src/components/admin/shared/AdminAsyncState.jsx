/* Figma Shared/LoadingState · EmptyState · ErrorState (145:2) */
import emptyIcon from "../../../assets/figma/empty-box-open.svg";

const DEFAULT_COPY = {
  loading: {
    title: "불러오는 중입니다",
    description: "잠시만 기다려 주세요.",
  },
  empty: {
    title: "표시할 데이터가 없습니다",
    description: "조건에 맞는 항목이 없습니다.",
  },
  error: {
    title: "화면을 불러오지 못했습니다",
    description: "잠시 후 다시 시도해 주세요.",
  },
};

/**
 * @param {"loading"|"empty"|"error"} status
 * @param {"page"|"section"|"inline"} [layout]
 * @param {"spinner"|"card"|"table"|"button"} [loadingVariant] status=loading 일 때 스켈레톤
 */
export default function AdminAsyncState({
  status = "loading",
  layout = "section",
  loadingVariant = "spinner",
  title,
  description,
  onRetry,
  actionLabel = "새로고침",
  onAction,
}) {
  const tone = status === "empty" || status === "error" ? status : "loading";
  const copy = DEFAULT_COPY[tone] ?? DEFAULT_COPY.loading;

  if (tone === "loading" && loadingVariant !== "spinner") {
    return (
      <div
        className={`admin-async-state admin-async-state--loading admin-async-state--${layout} admin-async-state--skeleton`}
        role="status"
        aria-label={title ?? copy.title}
      >
        <div className={`admin-skeleton admin-skeleton--${loadingVariant}`}>
          {loadingVariant === "card" ? (
            <>
              <span className="admin-skeleton__block admin-skeleton__block--image" />
              <span className="admin-skeleton__block" />
              <span className="admin-skeleton__block" />
              <span className="admin-skeleton__block admin-skeleton__block--short" />
            </>
          ) : null}
          {loadingVariant === "table" ? (
            <>
              {[0, 1, 2, 3].map((row) => (
                <span
                  key={row}
                  className={`admin-skeleton__row${row === 0 ? " is-header" : ""}`}
                >
                  <span />
                  <span />
                  <span />
                  <span />
                </span>
              ))}
            </>
          ) : null}
          {loadingVariant === "button" ? (
            <span className="admin-skeleton__block admin-skeleton__block--button" />
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <section
      className={`admin-async-state admin-async-state--${tone} admin-async-state--${layout}`}
      role="status"
    >
      {tone === "empty" ? (
        <img
          className="admin-async-state__empty-icon"
          src={emptyIcon}
          alt=""
          width={64}
          height={64}
        />
      ) : (
        <span className="admin-async-state__icon" aria-hidden="true" />
      )}
      <h2>{title ?? copy.title}</h2>
      <p>{description ?? copy.description}</p>
      {tone === "error" && typeof onRetry === "function" ? (
        <button type="button" className="admin-async-state__primary" onClick={onRetry}>
          다시 시도
        </button>
      ) : null}
      {tone === "empty" && typeof onAction === "function" ? (
        <button type="button" className="admin-async-state__secondary" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}
