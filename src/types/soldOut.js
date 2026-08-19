/**
 * Admin 품절 화면 데이터 형태.
 * 현재 기준: mock `asak-admin-data.json` / useSoldOutDraft
 * BE는 TODO-007~008 상태다. PATCH changes의 targetType/targetId/isSoldOut 및 부분 실패 응답을 확정한 뒤 맞춘다.
 * UI의 draft 상태와 서버 저장 결과를 구분해, 실패 시 이 타입의 baseline 데이터로 롤백할 수 있어야 한다.
 *
 * 사용 예:
 *   /** @typedef {import('../types/soldOut.js').SoldOutRow} SoldOutRow *\/
 */

/**
 * @typedef {"MENU"|"INGREDIENT"|"OPTION_ITEM"} SoldOutTargetType
 */

/**
 * 품절 카탈로그 한 줄
 * @typedef {Object} SoldOutRow
 * @property {SoldOutTargetType} targetType
 * @property {number} targetId
 * @property {string} name
 * @property {string} category
 * @property {boolean} isSoldOut
 * @property {string} [imageKey]
 * @property {number} [price] MENU일 때
 */

/**
 * GET 품절 카탈로그 data
 * @typedef {Object} SoldOutCatalog
 * @property {SoldOutRow[]} available 판매 가능(왼쪽)
 * @property {SoldOutRow[]} soldOut 품절(오른쪽)
 */

/**
 * PATCH /api/admin/soldOut 변경 한 건
 * @typedef {Object} SoldOutChange
 * @property {SoldOutTargetType} targetType
 * @property {number} targetId
 * @property {boolean} isSoldOut
 */

/**
 * PATCH body — BE SoldOutPatchRequest 와 동일
 * @typedef {Object} SoldOutPatchBody
 * @property {SoldOutChange[]} changes
 */

export {};
