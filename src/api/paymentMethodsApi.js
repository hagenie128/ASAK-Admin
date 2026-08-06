import { apiClient } from "./apiClient.js";

export const paymentMethodsApi = {
  // TODO-045: 결제수단 목록 API 추가.
  // 1) GET /api/admin/paymentMethods 호출 함수(listPaymentMethods) 추가
  // 2) usePaymentMethodDraft 초기 load가 mock 대신 이 함수를 쓰게 연결
  // TODO-046: 결제수단 저장 API 추가.
  // 1) PATCH /api/admin/paymentMethods/{id} 호출 함수(patchPaymentMethod) 추가
  // 2) body는 status/isActive, sortOrder, receiptMessage 저장 규격과 맞춘다
  // 3) save()가 순차 PATCH 또는 일괄 저장 중 어떤 방식을 쓸지 여기서 확정
};
