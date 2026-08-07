/**
 * Admin 결제수단 화면 데이터 형태.
 * 현재 기준: mock / usePaymentMethodDraft
 * BE(AdminPaymentMethodController)는 TODO — API 붙이면 여기와 맞출 것.
 *
 * 사용 예:
 *   /** @typedef {import('../types/paymentMethod.js').PaymentMethod} PaymentMethod *\/
 */

/**
 * 결제수단 목록 row
 * @typedef {Object} PaymentMethod
 * @property {string|number} methodId mock은 "card" 문자열, BE는 숫자 id일 수 있음
 * @property {string} name
 * @property {string} [description]
 * @property {boolean} isActive
 * @property {boolean} [isMaintenance]
 * @property {number} sortOrder
 * @property {string} [receiptMessage]
 */

/**
 * PATCH 결제수단 body (PatchPaymentMethodRequest · Bruno와 동일)
 * @typedef {Object} PaymentMethodPatch
 * @property {boolean} [isActive]
 * @property {number} [sortOrder]
 * @property {string|null} [receiptMessage]
 */

export {};
