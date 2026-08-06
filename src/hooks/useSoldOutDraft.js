// 품절 화면(SCR-011) draft Hook — WBS2-038
//
// [드래프트란?]
//   mock(장부)에서 읽어온 목록을 화면에서 연필로 고친 "임시 사본".
//   → / ← 로 옮겨도 저장 버튼 전까지 mock 은 안 바뀜.
//
// [이 훅이 들고 있는 것]
//   available, soldOut  → 드래프트 (왼쪽/오른쪽 패널에 보이는 목록)
//   selectedAvailable   → 왼쪽에서 체크한 "이번에 옮길" 항목
//   selectedSoldOut     → 오른쪽에서 체크한 "이번에 되돌릴" 항목
//   dirtyCount          → 저장 전에 바뀐 건수 (처음 불러온 때와 비교)

import { useCallback, useEffect, useMemo, useState } from "react";
// TODO-039: 품절 draft 훅 실연동.
// 1) 초기 load를 mock getSoldOutCatalog -> soldOutApi.listSoldOutCatalog 로 교체
// 2) save()를 mock saveSoldOutCatalog -> soldOutApi.patchSoldOut 로 교체
// 3) 실패 시 baseline 롤백, 성공 시 baseline 갱신 규칙은 그대로 유지
import { getSoldOutCatalog, saveSoldOutCatalog } from "../mocks/adminMockRepository.js";

/** mock row 고유 키 — targetType + targetId */
export function soldOutRowKey(item) {
  return `${item.targetType}-${item.targetId}`;
}

function cloneRows(rows) {
  return structuredClone(rows ?? []);
}

function countDirty(savedSoldOutKeys, currentSoldOutRows) {
  const current = new Set(currentSoldOutRows.map(soldOutRowKey));
  let count = 0;
  for (const key of current) {
    if (!savedSoldOutKeys.has(key)) count += 1;
  }
  for (const key of savedSoldOutKeys) {
    if (!current.has(key)) count += 1;
  }
  return count;
}

export function useSoldOutDraft() {
  // ① "저장된 장부" 기준 — 키 + 전체 목록 스냅샷(저장 실패 롤백용)
  const [baselineSoldOutKeys, setBaselineSoldOutKeys] = useState([]);
  const [baselineAvailable, setBaselineAvailable] = useState([]);
  const [baselineSoldOut, setBaselineSoldOut] = useState([]);

  // ② 드래프트 = 화면에 보이는 두 목록 (useState)
  const [available, setAvailable] = useState([]);
  const [soldOut, setSoldOut] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready

  // ③ 체크박스 = 드래프트와 별개. "지금 고른 것"만 잠깐 기억
  const [selectedAvailable, setSelectedAvailable] = useState(() => new Set());
  const [selectedSoldOut, setSelectedSoldOut] = useState(() => new Set());

  const [isSaving, setIsSaving] = useState(false);

  // 처음 한 번: mock → 드래프트로 복사
  useEffect(() => {
    const envelope = getSoldOutCatalog();
    const nextAvailable = envelope.data?.available ?? [];
    const nextSoldOut = envelope.data?.soldOut ?? [];
    setAvailable(nextAvailable);
    setSoldOut(nextSoldOut);
    setBaselineAvailable(cloneRows(nextAvailable));
    setBaselineSoldOut(cloneRows(nextSoldOut));
    setBaselineSoldOutKeys(nextSoldOut.map(soldOutRowKey));
    setStatus("ready");
  }, []);

  // 저장 안 한 변경 건수 (현재 품절 목록 vs 마지막 저장 기준)
  const dirtyCount = useMemo(
    () => countDirty(new Set(baselineSoldOutKeys), soldOut),
    [soldOut, baselineSoldOutKeys],
  );

  const toggleAvailableSelect = useCallback((key) => {
    setSelectedAvailable((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const toggleSoldOutSelect = useCallback((key) => {
    setSelectedSoldOut((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  /** 오른쪽 패널 — 현재 페이지 항목 전체 선택 */
  const selectSoldOutPage = useCallback((rows) => {
    setSelectedSoldOut((prev) => {
      const next = new Set(prev);
      for (const row of rows) {
        next.add(soldOutRowKey(row));
      }
      return next;
    });
  }, []);

  /** 오른쪽 패널 — 체크 전부 해제 */
  const clearSoldOutSelection = useCallback(() => {
    setSelectedSoldOut(new Set());
  }, []);

  // → : 왼쪽에서 체크한 것만 품절 목록으로 (드래프트 안에서만 이동)
  const moveToSoldOut = useCallback(() => {
    if (selectedAvailable.size === 0) return;

    const moving = [];
    const staying = [];
    for (const row of available) {
      if (selectedAvailable.has(soldOutRowKey(row))) {
        moving.push({ ...row, isSoldOut: true });
      } else {
        staying.push(row);
      }
    }

    setAvailable(staying);
    setSoldOut((prev) => [...prev, ...moving]);
    setSelectedAvailable(new Set());
  }, [available, selectedAvailable]);

  // ← : 오른쪽에서 체크한 것만 판매 목록으로
  const moveToAvailable = useCallback(() => {
    if (selectedSoldOut.size === 0) return;

    const moving = [];
    const staying = [];
    for (const row of soldOut) {
      if (selectedSoldOut.has(soldOutRowKey(row))) {
        moving.push({ ...row, isSoldOut: false });
      } else {
        staying.push(row);
      }
    }

    setSoldOut(staying);
    setAvailable((prev) => [...prev, ...moving]);
    setSelectedSoldOut(new Set());
  }, [soldOut, selectedSoldOut]);

  // 저장: 드래프트 → mock (실서비스면 PATCH API)
  const save = useCallback(async () => {
    if (dirtyCount === 0) {
      return { success: true, message: "변경사항이 없습니다." };
    }

    setIsSaving(true);
    try {
      const result = saveSoldOutCatalog({ available, soldOut });
      if (result.success) {
        setBaselineAvailable(cloneRows(available));
        setBaselineSoldOut(cloneRows(soldOut));
        setBaselineSoldOutKeys(soldOut.map(soldOutRowKey));
      } else {
        // 저장 실패: 마지막 성공 로드/저장 스냅샷으로 롤백 (asak_mock_fail_save=1)
        setAvailable(cloneRows(baselineAvailable));
        setSoldOut(cloneRows(baselineSoldOut));
        setSelectedAvailable(new Set());
        setSelectedSoldOut(new Set());
      }
      return result;
    } finally {
      setIsSaving(false);
    }
  }, [available, soldOut, dirtyCount, baselineAvailable, baselineSoldOut]);

  return {
    status,
    available,
    soldOut,
    dirtyCount,
    isSaving,
    selectedAvailable,
    selectedSoldOut,
    toggleAvailableSelect,
    toggleSoldOutSelect,
    selectSoldOutPage,
    clearSoldOutSelection,
    moveToSoldOut,
    moveToAvailable,
    save,
    canMoveToSoldOut: selectedAvailable.size > 0,
    canMoveToAvailable: selectedSoldOut.size > 0,
    canSave: dirtyCount > 0 && !isSaving,
  };
}
