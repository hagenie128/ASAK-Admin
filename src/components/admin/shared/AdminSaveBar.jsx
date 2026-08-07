/* 저장 바 (품절·결제수단·메뉴 편집) — Props: isDirty, isSaving, message?, onSave */
export default function AdminSaveBar({
  isDirty,
  isSaving,
  message = "저장하지 않은 변경 사항이 있습니다",
  onSave,
  className = "payment-settings__footer",
  barClassName = "payment-save-bar",
}) {
  if (!isDirty) return null;

  return (
    <div className={className}>
      <div className={barClassName}>
        <p>{message}</p>
        <button type="button" disabled={isSaving} onClick={onSave}>
          {isSaving ? "저장 중…" : "저장하기"}
        </button>
      </div>
    </div>
  );
}
