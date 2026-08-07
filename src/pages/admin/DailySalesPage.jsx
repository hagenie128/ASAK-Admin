/* SCR-021 / Daily Sales — Page는 조합만 */
import { useEffect, useState } from "react";
import AdminAsyncState from "../../components/admin/shared/AdminAsyncState.jsx";
import AdminTopHeader from "../../components/admin/shared/AdminTopHeader.jsx";
import AdminDatePicker from "../../components/admin/shared/AdminDatePicker.jsx";
import SalesShareCard from "../../components/admin/SalesShareCard.jsx";
import { useSalesQuery } from "../../hooks/useSalesQuery.js";
import { formatCurrency } from "../../utils/currency.js";
import {
  calcDeltaPercent,
  findMaxIndex,
  formatYmdWeekday,
  shiftYmd,
  toBarHeights,
} from "../../utils/salesDisplay.js";

/** 월별 매출과 동일하게 연간 달력 범위 (mock 기준 2026) */
const CALENDAR_MIN = "2026-01-01";
const CALENDAR_MAX = "2026-12-31";

function formatDelta(delta) {
  if (delta == null) return { text: "—", dir: "" };
  if (delta > 0) return { text: `↑ ${delta}%`, dir: "up" };
  if (delta < 0) return { text: `↓ ${Math.abs(delta)}%`, dir: "down" };
  return { text: "0%", dir: "" };
}

export default function DailySalesPage() {
  const { data, status, error, refetch } = useSalesQuery({ mode: "daily" });
  const rows = data?.rows ?? [];
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (!rows.length) return;
    const preferred = rows.find((row) => row.date === "2026-07-10") ?? rows[rows.length - 1];
    setSelectedDate((prev) => prev ?? preferred.date);
  }, [rows]);

  const selectedIndex = rows.findIndex((row) => row.date === selectedDate);
  const selectedRow =
    selectedIndex >= 0
      ? rows[selectedIndex]
      : selectedDate
        ? { date: selectedDate, orderCount: 0, totalAmount: 0, avgAmount: 0 }
        : null;
  const prevDate = selectedDate ? shiftYmd(selectedDate, -1) : null;
  const prevRow = prevDate ? rows.find((row) => row.date === prevDate) ?? null : null;

  const hourly = (selectedDate && data?.hourly?.[selectedDate]) || [];
  const ranking = ((selectedDate && data?.ranking?.[selectedDate]) || []).slice(0, 5);
  const breakdown = (selectedDate && data?.breakdown?.[selectedDate]) || {
    paymentShare: [],
    orderShare: [],
  };
  const hasDayData = selectedIndex >= 0;

  const hourlyAmounts = hourly.map((h) => h.totalAmount);
  const hourlyBars = toBarHeights(hourlyAmounts, 70);
  const peakIndex = findMaxIndex(hourlyAmounts);
  const peakHour = peakIndex >= 0 ? hourly[peakIndex] : null;

  const tickHours = hourly
    .map((h) => h.hour)
    .filter((hour, index, arr) => index === 0 || index === arr.length - 1 || hour % 2 === 0);

  const salesDelta = formatDelta(
    calcDeltaPercent(selectedRow?.totalAmount, prevRow?.totalAmount)
  );
  const orderDelta = formatDelta(
    calcDeltaPercent(selectedRow?.orderCount, prevRow?.orderCount)
  );
  const avgDelta = formatDelta(
    calcDeltaPercent(selectedRow?.avgAmount, prevRow?.avgAmount)
  );

  /* Figma 134:11150 — `2026.07.10 (금)` */
  const dateLabel = formatYmdWeekday(selectedDate);
  const canGoPrev = Boolean(selectedDate && selectedDate > CALENDAR_MIN);
  const canGoNext = Boolean(selectedDate && selectedDate < CALENDAR_MAX);

  const handlePrev = () => {
    if (!canGoPrev) return;
    setSelectedDate(shiftYmd(selectedDate, -1));
  };

  const handleNext = () => {
    if (!canGoNext) return;
    setSelectedDate(shiftYmd(selectedDate, 1));
  };

  if (status === "loading" || status === "idle") {
    return <AdminAsyncState status="loading" layout="page" />;
  }
  if (status === "error") {
    return (
      <AdminAsyncState
        status="error"
        layout="page"
        title="일별 매출을 불러오지 못했습니다"
        description={error?.message || "잠시 후 다시 시도해 주세요."}
        onRetry={refetch}
      />
    );
  }
  if (!selectedDate || !selectedRow) {
    return (
      <AdminAsyncState
        status="empty"
        layout="page"
        title="표시할 일별 매출이 없습니다"
        description="다른 날짜를 선택하거나 잠시 후 다시 확인해 주세요."
        onRetry={refetch}
      />
    );
  }

  return (
    <section className="sales-daily" data-figma-node="134:11150">
      <AdminTopHeader
        crumb="Admin / 일별 매출"
        title="일별 매출"
        description="일자별 매출 현황 및 시간대 분석"
      >
        <div className="sales-daily__date">
          <button type="button" aria-label="이전 날짜" onClick={handlePrev} disabled={!canGoPrev}>
            ‹
          </button>
          <AdminDatePicker
            mode="single"
            open={calendarOpen}
            value={selectedDate}
            minDate={CALENDAR_MIN}
            maxDate={CALENDAR_MAX}
            onChange={(ymd) => {
              setSelectedDate(ymd);
              setCalendarOpen(false);
            }}
            onClose={() => setCalendarOpen(false)}
          >
            <button
              type="button"
              className="sales-daily__date-label"
              onClick={() => setCalendarOpen((v) => !v)}
            >
              {dateLabel}
            </button>
          </AdminDatePicker>
          <button type="button" aria-label="다음 날짜" onClick={handleNext} disabled={!canGoNext}>
            ›
          </button>
        </div>
      </AdminTopHeader>

      {!hasDayData ? (
        <p className="sales-daily__empty-hint">선택한 날짜의 mock 데이터가 없습니다. (현재 상세는 2026년 7월)</p>
      ) : null}

      <div className="sales-daily__kpis">
        <article>
          <span>총매출</span>
          <strong>{formatCurrency(selectedRow.totalAmount)}</strong>
          <p>
            <b>{salesDelta.text}</b>
            <small>전일 대비</small>
          </p>
        </article>
        <article>
          <span>주문 수</span>
          <strong>{selectedRow.orderCount}건</strong>
          <p>
            <b>{orderDelta.text}</b>
            <small>전일 대비</small>
          </p>
        </article>
        <article>
          <span>평균 객단가</span>
          <strong>{formatCurrency(selectedRow.avgAmount)}</strong>
          <p>
            <b>{avgDelta.text}</b>
            <small>전일 대비</small>
          </p>
        </article>
        <article>
          <span>피크 시간대</span>
          <strong>
            {peakHour
              ? `${String(peakHour.hour).padStart(2, "0")}:00~${String(peakHour.hour + 1).padStart(2, "0")}:00`
              : "-"}
          </strong>
          <p className="is-peak">
            <b>{formatCurrency(peakHour?.totalAmount)}</b>
          </p>
        </article>
      </div>

      <div className="sales-daily__middle">
        <section className="sales-chart">
          <h2>시간대별 매출</h2>
          <div className="sales-chart__body">
            <div className="sales-chart__bars">
              {hourlyBars.map((height, index) => (
                <i
                  key={`h-${hourly[index].hour}`}
                  className={index === peakIndex ? "is-peak" : ""}
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>
            <div className="sales-chart__ticks">
              {tickHours.map((hour) => (
                <span key={hour}>{hour}시</span>
              ))}
            </div>
          </div>
          <p className="sales-chart__peak">
            <b>{formatCurrency(peakHour?.totalAmount)}</b>
            <span>
              피크 시간{" "}
              {peakHour ? `${String(peakHour.hour).padStart(2, "0")}:00` : "-"}
            </span>
          </p>
        </section>

        <div className="sales-daily__right">
          <SalesShareCard
            title="결제수단별 매출"
            rows={(breakdown.paymentShare ?? []).map((item, index) => [
              item.label,
              `${item.percent}%`,
              `${item.percent}%`,
              index === 0,
            ])}
          />
          <SalesShareCard
            title="주문 유형별 매출"
            rows={(breakdown.orderShare ?? []).map((item, index) => [
              item.label,
              `${item.percent}%`,
              `${item.percent}%`,
              index === 0,
            ])}
          />
          <section className="sales-ranking">
            <h2>메뉴별 판매 순위</h2>
            <div className="sales-ranking__rows">
              {ranking.length === 0 ? (
                <div className="sales-ranking__row">
                  <span className="sales-ranking__name">데이터 없음</span>
                </div>
              ) : (
                ranking.map((row) => (
                  <div className="sales-ranking__row" key={row.rank}>
                    <span className="sales-ranking__rank">{row.rank}</span>
                    <span className="sales-ranking__name">{row.name}</span>
                    <span className="sales-ranking__count">{row.count}건</span>
                    <b className="sales-ranking__amount">{formatCurrency(row.amount)}</b>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      <section className="sales-table">
        <h2>시간대별 상세</h2>
        <div className="sales-table__grid sales-table__grid--hourly">
          <div className="sales-table__head">
            <span>시간대</span>
            <span>주문 수</span>
            <span>매출</span>
            <span>객단가</span>
          </div>
          {hourly.length === 0 ? (
            <div className="sales-table__row">
              <span>—</span>
              <span>—</span>
              <span>—</span>
              <span>—</span>
            </div>
          ) : (
            hourly.map((row) => (
              <div className="sales-table__row" key={row.hour}>
                <span>
                  {String(row.hour).padStart(2, "0")}:00~
                  {String(row.hour + 1).padStart(2, "0")}:00
                </span>
                <span>{row.orderCount}건</span>
                <span>{formatCurrency(row.totalAmount)}</span>
                <span>{formatCurrency(row.avgAmount)}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </section>
  );
}
