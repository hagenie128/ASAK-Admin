/*
 * Admin/StatusBadge — Figma 150:5064
 * 메뉴·재료·옵션 역할/상태 뱃지 (주문·결제 배지는 OrderStatusBadge 사용)
 */
const ROLE_META = {
  core: { label: "핵심 재료", tone: "danger" },
  base: { label: "베이스 재료", tone: "success" },
  plain: { label: "일반 기본", tone: "muted" },
  soldOut: { label: "품절", tone: "danger" },
  selling: { label: "판매중", tone: "success" },
  inactive: { label: "비활성", tone: "muted" },
  default: { label: "기본", tone: "success" },
  recommend: { label: "추천", tone: "warning" },
  required: { label: "필수", tone: "success" },
  optional: { label: "선택", tone: "muted" },
  topping: { label: "토핑 추가", tone: "warning" },
  dressing: { label: "드레싱 선택", tone: "dressing" },
  auto: { label: "자동", tone: "success" },
};

export default function AdminStatusBadge({ role = "plain", label, className = "" }) {
  const meta = ROLE_META[role] ?? ROLE_META.plain;
  const text = label ?? meta.label;
  return (
    <span
      className={`admin-status-badge admin-status-badge--${meta.tone}${className ? ` ${className}` : ""}`}
      data-figma-node="150:5064"
      data-role={role}
    >
      {text}
    </span>
  );
}

export { ROLE_META };
