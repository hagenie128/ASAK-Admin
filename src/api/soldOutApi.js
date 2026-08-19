/**
 * 품절 API — 미구현 셸.
 * 화면: useSoldOutDraft → mocks/adminMockRepository
 * BE 구현 순서: TODO-007 Controller → TODO-008 Service/Mapper → TODO-009 이 파일 → TODO-010 draft 훅.
 * BE: /api/admin/soldOut · TODO-009 전까지 메서드 추가·호출 금지.
 */
export const soldOutApi = {
  // TODO-009: GET 카탈로그와 PATCH { changes: [{ targetType, targetId, isSoldOut }] }를 연결한다.
  // API_ENDPOINTS.soldOut을 사용하고, 부분 실패·0건 변경·409 응답이 TODO-010의 draft 롤백과 맞는지 확인한다.
};
