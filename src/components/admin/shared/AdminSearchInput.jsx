/*
 * Admin/SearchInput — Figma 150:5006
 */
export default function AdminSearchInput({
  value = "",
  onChange,
  onKeyDown,
  placeholder = "검색",
  disabled = false,
  className = "",
  id,
  "aria-label": ariaLabel,
}) {
  return (
    <input
      id={id}
      type="search"
      className={`admin-search-input${className ? ` ${className}` : ""}`}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      aria-label={ariaLabel || placeholder}
      data-figma-node="150:5006"
      onChange={(event) => onChange?.(event.target.value, event)}
      onKeyDown={onKeyDown}
    />
  );
}
