/*
 * 날짜/기간 선택 (매출·주문 필터)
 * mode: "single" | "range"
 * value: "YYYY-MM-DD" | { from, to }
 *
 * Figma: single 162:15939 구조 · range 3218:16401 배열·색
 */
import { useEffect, useRef, useState } from "react";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const RANGE_PRESETS = [
  { id: "today", label: "오늘" },
  { id: "week", label: "이번 주" },
  { id: "month", label: "이번 달" },
  { id: "custom", label: "직접 선택" },
];

function toYmd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseYmd(ymd) {
  if (!ymd) return null;
  const d = new Date(`${ymd}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addMonths(date, delta) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function buildCells(viewMonth) {
  const first = startOfMonth(viewMonth);
  const startPad = first.getDay();
  const start = new Date(first);
  start.setDate(first.getDate() - startPad);
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function isBefore(a, b) {
  return a < b;
}

function isAfter(a, b) {
  return a > b;
}

function formatDot(ymd) {
  if (!ymd) return "—";
  return ymd.replaceAll("-", ".");
}

function startOfWeek(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function endOfWeek(date) {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 6);
  return d;
}

function clampRange(from, to, min, max) {
  let nextFrom = from;
  let nextTo = to;
  if (min && isBefore(nextFrom, toYmd(min))) nextFrom = toYmd(min);
  if (max && isAfter(nextFrom, toYmd(max))) nextFrom = toYmd(max);
  if (min && isBefore(nextTo, toYmd(min))) nextTo = toYmd(min);
  if (max && isAfter(nextTo, toYmd(max))) nextTo = toYmd(max);
  if (isAfter(nextFrom, nextTo)) return { from: nextTo, to: nextFrom };
  return { from: nextFrom, to: nextTo };
}

export default function AdminDatePicker({
  mode = "single",
  value = null,
  onChange,
  onClose,
  minDate,
  maxDate,
  open = false,
  children,
  className = "",
}) {
  const rootRef = useRef(null);
  const initial =
    mode === "range"
      ? parseYmd(value?.from) || parseYmd(value?.to) || new Date()
      : parseYmd(value) || new Date();

  const [viewMonth, setViewMonth] = useState(() => startOfMonth(initial));
  const [draftSingle, setDraftSingle] = useState(mode === "single" ? value : null);
  const [draftFrom, setDraftFrom] = useState(mode === "range" ? value?.from ?? null : null);
  const [draftTo, setDraftTo] = useState(mode === "range" ? value?.to ?? null : null);
  const [activePreset, setActivePreset] = useState("custom");

  useEffect(() => {
    if (!open) return;
    if (mode === "single") {
      setDraftSingle(value || null);
      const d = parseYmd(value) || new Date();
      setViewMonth(startOfMonth(d));
    } else {
      setDraftFrom(value?.from ?? null);
      setDraftTo(value?.to ?? null);
      setActivePreset("custom");
      const d = parseYmd(value?.from) || parseYmd(value?.to) || new Date();
      setViewMonth(startOfMonth(d));
    }
  }, [open, mode, value]);

  useEffect(() => {
    if (!open) return undefined;
    function handlePointer(event) {
      if (!rootRef.current?.contains(event.target)) {
        onClose?.();
      }
    }
    function handleKey(event) {
      if (event.key === "Escape") onClose?.();
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  const min = parseYmd(minDate);
  const max = parseYmd(maxDate);
  const todayYmd = toYmd(new Date());
  const rightMonth = addMonths(viewMonth, 1);
  const months = mode === "range" ? [viewMonth, rightMonth] : [viewMonth];

  function isDisabled(date) {
    const ymd = toYmd(date);
    if (min && isBefore(ymd, toYmd(min))) return true;
    if (max && isAfter(ymd, toYmd(max))) return true;
    return false;
  }

  function handleDayClick(date) {
    if (isDisabled(date)) return;
    const ymd = toYmd(date);
    if (mode === "single") {
      setDraftSingle(ymd);
      return;
    }
    setActivePreset("custom");
    if (!draftFrom || (draftFrom && draftTo)) {
      setDraftFrom(ymd);
      setDraftTo(null);
      return;
    }
    if (isBefore(ymd, draftFrom)) {
      setDraftTo(draftFrom);
      setDraftFrom(ymd);
      return;
    }
    setDraftTo(ymd);
  }

  function handlePreset(presetId) {
    setActivePreset(presetId);
    if (presetId === "custom") return;

    const today = new Date();
    let from;
    let to;
    if (presetId === "today") {
      from = today;
      to = today;
    } else if (presetId === "week") {
      from = startOfWeek(today);
      to = endOfWeek(today);
    } else {
      from = startOfMonth(today);
      to = endOfMonth(today);
    }

    const next = clampRange(toYmd(from), toYmd(to), min, max);
    setDraftFrom(next.from);
    setDraftTo(next.to);
    setViewMonth(startOfMonth(parseYmd(next.from) || today));
  }

  function handleApply() {
    if (mode === "single") {
      if (!draftSingle) return;
      onChange?.(draftSingle);
      onClose?.();
      return;
    }
    if (!draftFrom) return;
    const next = { from: draftFrom, to: draftTo || draftFrom };
    onChange?.(next);
    onClose?.();
  }

  function dayClass(date, monthDate) {
    const ymd = toYmd(date);
    const weekday = date.getDay();
    const classes = [];
    if (date.getMonth() !== monthDate.getMonth()) classes.push("is-outside");
    if (ymd === todayYmd) classes.push("is-today");
    if (weekday === 0) classes.push("is-sun");
    if (weekday === 6) classes.push("is-sat");
    if (mode === "single" && ymd === draftSingle) classes.push("is-selected");
    if (mode === "range" && draftFrom) {
      const rangeEnd = draftTo;
      const isStart = ymd === draftFrom;
      const isEnd = rangeEnd != null && ymd === rangeEnd;
      const isSingleEdge = isStart && (!rangeEnd || rangeEnd === draftFrom);

      if (isStart || isEnd) classes.push("is-range-edge");
      if (isStart) classes.push("is-range-start");
      if (isEnd) classes.push("is-range-end");
      if (isSingleEdge) classes.push("is-range-single");

      if (rangeEnd && !isBefore(ymd, draftFrom) && !isAfter(ymd, rangeEnd)) {
        classes.push("is-in-range");
      }
    }
    return classes.join(" ");
  }

  const hint =
    mode === "single"
      ? formatDot(draftSingle)
      : `${formatDot(draftFrom)} ~ ${formatDot(draftTo || draftFrom)}`;

  function renderMonth(monthDate, key) {
    return (
      <div className="admin-date-picker__month" key={key}>
        <div className="admin-date-picker__nav">
          <button type="button" aria-label="이전 달" onClick={() => setViewMonth((m) => addMonths(m, -1))}>
            ‹
          </button>
          <strong>
            {monthDate.getFullYear()}년 {monthDate.getMonth() + 1}월
          </strong>
          <button type="button" aria-label="다음 달" onClick={() => setViewMonth((m) => addMonths(m, 1))}>
            ›
          </button>
        </div>
        <div className="admin-date-picker__weekdays">
          {WEEKDAYS.map((label, index) => (
            <span
              key={label}
              className={index === 0 ? "is-sun" : index === 6 ? "is-sat" : undefined}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="admin-date-picker__grid">
          {buildCells(monthDate).map((date) => {
            const ymd = toYmd(date);
            return (
              <button
                key={`${key}-${ymd}-${date.getMonth()}`}
                type="button"
                disabled={isDisabled(date)}
                className={dayClass(date, monthDate)}
                onClick={() => handleDayClick(date)}
              >
                <span className="admin-date-picker__day-label">{date.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-date-picker ${className}`.trim()} ref={rootRef}>
      {children}
      {open ? (
        <div
          className={`admin-date-picker__panel${mode === "range" ? " is-range" : " is-single"}`}
          role="dialog"
          aria-label="날짜 선택"
        >
          {mode === "range" ? (
            <div className="admin-date-picker__presets" role="tablist" aria-label="기간 빠른 선택">
              {RANGE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  role="tab"
                  aria-selected={activePreset === preset.id}
                  className={activePreset === preset.id ? "is-active" : undefined}
                  onClick={() => handlePreset(preset.id)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          ) : null}

          <div className={`admin-date-picker__months${mode === "range" ? " is-dual" : ""}`}>
            {months.map((monthDate, index) => renderMonth(monthDate, index === 0 ? "left" : "right"))}
          </div>

          <div className="admin-date-picker__footer">
            <p>{hint}</p>
            <button type="button" className="is-primary" onClick={handleApply}>
              적용
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
