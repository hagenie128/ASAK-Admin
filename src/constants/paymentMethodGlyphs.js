/**
 * 결제수단 아이콘 — UI는 public 로컬 SVG 사용.
 * (Cloudinary SVG는 Content-Disposition: attachment 라 <img>에 안 그려질 수 있음)
 * DB 정본 URL은 media_asset.url (asak/payment/*)
 */
export const PAYMENT_METHOD_ICON_URLS = {
  card: "/samsung-pay.svg",
  kakao: "/kakaopay.svg",
  naver: "/badge_npay.svg",
  toss: "/toss-logo.svg",
};

/** @deprecated emoji 글리프 → iconUrl 사용. 폴백만 유지 */
export const PAYMENT_METHOD_GLYPHS = {
  card: "💳",
  kakao: "🟡",
  naver: "🟢",
  toss: "🔵",
  zero: "🔵",
};

export function getPaymentMethodIconUrl(methodId, iconUrl) {
  // methodId 매핑을 우선 — Cloudinary attachment URL 폴백 방지
  const mapped = PAYMENT_METHOD_ICON_URLS[methodId];
  if (mapped) return mapped;
  if (iconUrl && !iconUrl.includes("res.cloudinary.com")) return iconUrl;
  return iconUrl ?? null;
}

export function getPaymentMethodGlyph(methodId) {
  return PAYMENT_METHOD_GLYPHS[methodId] ?? methodId?.[0]?.toUpperCase() ?? "?";
}
