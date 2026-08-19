/**
 * 결제수단 API — 미구현 셸.
 * 화면: usePaymentMethodDraft → mocks/adminMockRepository
 * BE 구현 순서: TODO-011 Controller → TODO-012 Service/Mapper → TODO-013 이 파일 → TODO-014 draft 훅.
 * 현재 Controller 기준 경로는 `/api/admin/paymentMethods`(camelCase)다. Product Bible의 kebab-case 표기와
 * 다르면 호출 전에 정본을 확정하고 Admin endpoint 상수·Controller·문서를 같은 값으로 맞춘다.
 */
export const paymentMethodsApi = {
  // TODO-013: GET 목록과 PATCH /{paymentMethodId}를 API_ENDPOINTS.paymentMethods 기반으로 추가한다.
  // PATCH body와 성공 data shape를 TODO-012 DTO에 맞추고, 0건·409·검증 실패를 throw/catch 흐름으로 확인한다.
};
