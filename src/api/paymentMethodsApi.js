import { apiClient } from "./apiClient.js";

export const paymentMethodsApi = {
  // TODO-046: 결제수단 3/4 — paymentMethods API 함수 추가.
  // 1) backend TODO-044~045 완료 후 listPaymentMethods / patchPaymentMethod 추가
  // 2) body는 status/isActive, sortOrder, receiptMessage 저장 규격과 맞춘다
  // 3) save()가 순차 PATCH 또는 일괄 저장 중 어떤 방식을 쓸지 여기서 확정
};
