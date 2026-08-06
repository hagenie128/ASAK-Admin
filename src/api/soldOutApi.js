import { apiClient } from "./apiClient.js";

export const soldOutApi = {
  // TODO-037: 품절 카탈로그 조회 API 추가.
  // 1) GET /api/admin/soldOut 호출 함수(listSoldOutCatalog) 추가
  // 2) useSoldOutDraft 초기 load가 mock 대신 이 함수를 쓰게 연결
  // TODO-038: 품절 저장 API 추가.
  // 1) PATCH /api/admin/soldOut 호출 함수(patchSoldOut) 추가
  // 2) body는 { targetType, targetId, isSoldOut } 기준으로 맞춘다
  // 3) 저장 성공/실패 응답을 useSoldOutDraft.save가 바로 해석할 수 있게 유지
};
