import { apiClient } from "./apiClient.js";

export const soldOutApi = {
  // TODO-042: 품절 3/4 — soldOut API 함수 추가.
  // 1) backend TODO-040~041 완료 후 listSoldOutCatalog / patchSoldOut 추가
  // 2) body/query 규격은 { targetType, targetId, isSoldOut } + 탭/검색/카테고리 요구사항과 맞춘다
  // 3) useSoldOutDraft가 바로 해석할 수 있는 성공/실패 응답 구조를 유지
};
