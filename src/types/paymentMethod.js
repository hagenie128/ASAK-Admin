/**
 * Admin 결제수단 화면 데이터 형태.
 * 현재 기준: mock / usePaymentMethodDraft
 * BE는 TODO-044~045 상태다. GET/PATCH DTO가 확정되면 mock 필드와 필수/nullable 규칙을 이 typedef에 맞춘다.
 * 현재 Controller 경로의 camelCase와 Product Bible의 kebab-case 표기가 다르면 연결 전에 정본을 확정한다.
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
 * @property {string} [iconUrl] Cloudinary 공개 URL (결제수단 로고)
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
