// 결제수단 편집 Hook — WBS2-040
// 1차: 토글·정렬·저장 연결됨.
// 저장 실패(asak_mock_fail_save=1) 시 baselineRows 스냅샷으로 롤백.

import { useCallback, useEffect, useMemo, useState } from "react";
// TODO-047: 결제수단 4/4 — draft 훅/화면 저장 연결과 검증.
// 1) 초기 load를 mock getPaymentMethods -> paymentMethodsApi.listPaymentMethods 로 교체
// 2) save()를 mock savePaymentMethods -> paymentMethodsApi.patchPaymentMethod 로 교체
// 3) 실패 시 baselineRows 롤백, 성공 시 baseline 갱신 규칙은 그대로 유지
// 4) 검증: 토글/정렬/저장/롤백/미리보기(activePreviewRows) 일관성 확인
import { getPaymentMethods, savePaymentMethods } from "../mocks/adminMockRepository.js";

function cloneRows(rows) {
  return structuredClone(rows ?? []);
}

function snapshot(rows) {
  return rows.map((row) => `${row.methodId}:${row.isActive}:${row.sortOrder}`).join("|");
}

function reorder(rows, methodId, direction) {
  const index = rows.findIndex((row) => row.methodId === methodId);
  if (index < 0) return rows;

  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= rows.length) return rows;

  const next = [...rows];
  [next[index], next[target]] = [next[target], next[index]];
  return next.map((row, sortIndex) => ({ ...row, sortOrder: sortIndex + 1 }));
}

export function usePaymentMethodDraft() {
  const [rows, setRows] = useState([]);
  const [baseline, setBaseline] = useState("");
  const [baselineRows, setBaselineRows] = useState([]);
  const [status, setStatus] = useState("loading");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const envelope = getPaymentMethods();
    const nextRows = [...(envelope.data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
    setRows(nextRows);
    setBaselineRows(cloneRows(nextRows));
    setBaseline(snapshot(nextRows));
    setStatus("ready");
  }, []);

  const isDirty = useMemo(() => snapshot(rows) !== baseline, [rows, baseline]);

  const activePreviewRows = useMemo(
    () => rows.filter((row) => row.isActive),
    [rows],
  );

  const toggleMethod = useCallback((methodId) => {
    setRows((prev) =>
      prev.map((row) =>
        row.methodId === methodId ? { ...row, isActive: !row.isActive } : row,
      ),
    );
  }, []);

  const moveMethod = useCallback((methodId, direction) => {
    setRows((prev) => reorder(prev, methodId, direction));
  }, []);

  const save = useCallback(async () => {
    if (!isDirty || isSaving) {
      return { success: true, message: "변경사항이 없습니다." };
    }

    const attempt = rows;
    setIsSaving(true);
    try {
      const result = savePaymentMethods(attempt);
      if (result.success) {
        setBaselineRows(cloneRows(attempt));
        setBaseline(snapshot(attempt));
      } else {
        // before(=attempt)는 현재 dirty 상태와 같음 → 마지막 성공 baseline으로 복원
        setRows(cloneRows(baselineRows));
      }
      return result;
    } catch {
      setRows(cloneRows(baselineRows));
      return { success: false, message: "저장에 실패했습니다." };
    } finally {
      setIsSaving(false);
    }
  }, [rows, isDirty, isSaving, baselineRows]);

  return {
    status,
    rows,
    activePreviewRows,
    isDirty,
    isSaving,
    canSave: isDirty && !isSaving,
    toggleMethod,
    moveMethod,
    save,
  };
}
