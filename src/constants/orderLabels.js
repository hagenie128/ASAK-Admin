// mock/API 코드값 + 화면 라벨 (한 파일에서 관리)

export const ORDER_TYPE = {
  EAT_IN: "EAT_IN",
  TAKE_OUT: "TAKE_OUT",
};

export const ORDER_STATUS = {
  RECEIVED: "RECEIVED",
  PREPARING: "PREPARING",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
  REFUNDED: "REFUNDED",
};

export const PAYMENT_STATUS = {
  APPROVED: "APPROVED",
  READY: "READY",
  FAILED: "FAILED",
  UNPAID: "UNPAID",
  PARTIAL_PAID: "PARTIAL_PAID",
  CANCELED: "CANCELED",
  REFUNDED: "REFUNDED",
};

export const ORDER_TYPE_LABEL = {
  [ORDER_TYPE.EAT_IN]: "매장",
  [ORDER_TYPE.TAKE_OUT]: "포장",
};

export const ORDER_STATUS_LABEL = {
  [ORDER_STATUS.RECEIVED]: "접수",
  [ORDER_STATUS.PREPARING]: "조리중",
  [ORDER_STATUS.COMPLETED]: "완료",
  [ORDER_STATUS.CANCELED]: "취소",
  [ORDER_STATUS.REFUNDED]: "환불",
};

export const PAYMENT_STATUS_LABEL = {
  [PAYMENT_STATUS.APPROVED]: "결제완료",
  [PAYMENT_STATUS.READY]: "결제대기",
  [PAYMENT_STATUS.FAILED]: "결제실패",
  [PAYMENT_STATUS.UNPAID]: "미결제",
  [PAYMENT_STATUS.PARTIAL_PAID]: "부분결제",
  [PAYMENT_STATUS.CANCELED]: "취소",
  [PAYMENT_STATUS.REFUNDED]: "환불",
};

// mock에 paymentMethod가 null이거나 영문 코드일 수 있음
export const PAYMENT_METHOD_LABEL = {
  CARD: "카드",
  CASH: "현금",
  KAKAO_PAY: "카카오페이",
  NAVER_PAY: "네이버페이",
};

export const PERIODS = {
  today: "오늘",
  week: "이번 주",
  month: "이번 달",
};
// empty / partial 은 mock QA용 키라 라벨에 넣지 않음 (getSalesSummary("empty") 직접 호출)

