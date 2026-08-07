/*
 * 필터 드롭다운 (주문 상태·결제·유형 등)
 * options: [{ value, label }]
 */
import { useEffect, useRef, useState } from "react";

export default function AdminFilterDropdown({
  label,
  value = "",
  options = [],
  onChange,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected = options.find((opt) => opt.value === value);
  const triggerLabel = selected?.label || label;

  useEffect(() => {
    if (!open) return undefined;
    function handlePointer(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    function handleKey(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className="admin-filter-dropdown" ref={rootRef}>
      <button
        type="button"
        className={`admin-filter-dropdown__trigger${value ? " is-active" : ""}`}
        disabled={disabled}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {triggerLabel}⌄
      </button>
      {open ? (
        <div className="admin-filter-dropdown__menu" role="listbox">
          {options.map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              role="option"
              aria-selected={opt.value === value}
              className={opt.value === value ? "is-selected" : ""}
              onClick={() => {
                onChange?.(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
