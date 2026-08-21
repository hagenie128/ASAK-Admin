/* SCR-019 / Sales Summary — Page는 조합만 */
import { useMemo, useState } from "react";
import calendarIcon from "../../assets/figma/icon-calendar.svg";
import AdminAsyncState from "../../components/admin/shared/AdminAsyncState.jsx";
import AdminTopHeader from "../../components/admin/shared/AdminTopHeader.jsx";
import AdminDatePicker from "../../components/admin/shared/AdminDatePicker.jsx";
import SalesShareCard from "../../components/admin/SalesShareCard.jsx";
import { useSalesQuery } from "../../hooks/useSalesQuery.js";
import { PERIODS } from "../../constants/orderLabels.js";
import { formatCurrency } from "../../utils/currency.js";
import { formatMd, findMaxIndex } from "../../utils/salesDisplay.js";

function formatRangeLabel(from, to) {
  if (!from) return "-";
  const a = from.replaceAll("-", ".");
  const b = (to || from).replaceAll("-", ".");
  return a === b ? a : `${a} ~ ${b}`;
}

function parseSummaryDateRange(label) {
  if (!label) return null;
  const parts = String(label)
    .split("~")
    .map((part) => part.trim().replaceAll(".", "-"));
  if (!parts[0]) return null;
  return { from: parts[0], to: parts[1] || parts[0] };
}

export default function SalesSummaryPage() {
  const [activePeriod, setActivePeriod] = useState("month");
  const [customRange, setCustomRange] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const { data, status, error, refetch } = useSalesQuery({
    mode: "summary",
    period: customRange ? null : activePeriod,
    startDate: customRange?.from,
    endDate: customRange?.to,
  });

  const summaryRange = useMemo(() => parseSummaryDateRange(data?.dateRange), [data?.dateRange]);

  const handleActivePeriod = (period) => {
    if (period === activePeriod && !customRange) return;
    setActivePeriod(period);
    setCustomRange(null);
  };

  const chartPoints = data?.chartPoints ?? [];
  const peakIndex = findMaxIndex(chartPoints.map((point) => point.value));
  const peakPoint = peakIndex >= 0 ? chartPoints[peakIndex] : null;
  const dailyRows = [...(data?.dailySales ?? [])].reverse();

  const rangeLabel = customRange
    ? formatRangeLabel(customRange.from, customRange.to)
    : data?.dateRange || data?.label || "-";

  const dailyMin = summaryRange?.from;
  const dailyMax = summaryRange?.to;

  if ((status === "loading" || status === "idle") && !data) {
    return <AdminAsyncState status="loading" layout="page" />;
  }
  if (status === "error") {
    return (
      <AdminAsyncState
        status="error"
        layout="page"
        title="매출 데이터를 불러오지 못했습니다"
        description={error?.message || "잠시 후 다시 시도해 주세요."}
        onRetry={refetch}
      />
    );
  }

  return (
    <section className="sales-summary">
      <AdminTopHeader
        crumb="Admin / 매출 관리"
        title="매출 요약"
        description="전체 매출 현황 및 핵심 지표"
      >
        <div className="sales-summary__filters">
          {(data?.availablePeriods ?? []).map((periodKey) => (
            <button
              key={periodKey}
              type="button"
              className={periodKey === activePeriod && !customRange ? "is-selected" : ""}
              onClick={() => handleActivePeriod(periodKey)}
            >
              {PERIODS[periodKey] || periodKey}
            </button>
          ))}
          <AdminDatePicker
            mode="range"
            open={calendarOpen}
            value={customRange || summaryRange}
            minDate={dailyMin}
            maxDate={dailyMax}
            availableDates={(data?.dailySales ?? []).map((row) => row.date)}
            onChange={(range) => {
              setCustomRange(range);
              setCalendarOpen(false);
            }}
            onClose={() => setCalendarOpen(false)}
          >
            <button
              type="button"
              className={`sales-summary__range${calendarOpen || customRange ? " is-open" : ""}`}
              onClick={() => setCalendarOpen((v) => !v)}
              aria-label="기간 달력 열기"
            >
              <span>{rangeLabel}</span>
              <img alt="" aria-hidden="true" src={calendarIcon} />
            </button>
          </AdminDatePicker>
        </div>
      </AdminTopHeader>

      <div className="sales-summary__kpis">
        {(data?.kpis ?? []).map((kpi) => (
          <article key={kpi.label}>
            <span>{kpi.label}</span>
            <strong>{kpi.display ?? formatCurrency(kpi.value)}</strong>
            <p>
              <b>
                {kpi.delta > 0 ? "↑" : kpi.delta < 0 ? "↓" : ""}
                {Math.abs(kpi.delta)}%
              </b>
              <small>{kpi.deltaLabel}</small>
            </p>
          </article>
        ))}
      </div>

      <div className="sales-summary__middle">
        <section className="sales-chart">
          <h2>{data?.chartTitle ?? "매출 추이"}</h2>
          <div className="sales-chart__body">
            <div className="sales-chart__bars">
              {chartPoints.map((point, index) => (
                <i
                  key={`bar-${point.label}-${index}`}
                  className={index === peakIndex ? "is-peak" : ""}
                  style={{ height: `${point.barHeight}px` }}
                />
              ))}
            </div>
            <div className="sales-chart__ticks">
              {chartPoints.map((point, index) => (
                <span key={`${point.label}-${index}`}>{point.label}</span>
              ))}
            </div>
          </div>
          <p className="sales-chart__peak">
            <b>{peakPoint ? formatCurrency(peakPoint.value) : "-"}</b>
            <span>피크 {peakPoint?.label ?? "-"}</span>
          </p>
        </section>

        <div className="sales-summary__right">
          <SalesShareCard
            title="결제수단 비중"
            rows={(data?.paymentShare ?? []).map((payment, index) => [
              payment.label,
              `${payment.percent}%`,
              `${payment.percent}%`,
              index === 0,
            ])}
          />
          <SalesShareCard
            title="주문 유형"
            rows={(data?.orderShare ?? []).map((order, index) => [
              order.label,
              `${order.percent}%`,
              `${order.percent}%`,
              index === 0,
            ])}
          />
        </div>
      </div>

      <div className="sales-summary__bottom">
        <section className="sales-table">
          <h2>일자별 매출{customRange ? " (선택 기간)" : ""}</h2>
          <div className="sales-table__grid">
            <div className="sales-table__head">
              <span>날짜</span>
              <span>주문 수</span>
              <span>순매출</span>
              <span>객단가</span>
            </div>
            {dailyRows.length === 0 ? (
              <div className="sales-table__row">
                <span>해당 기간 데이터 없음</span>
              </div>
            ) : (
              dailyRows.map((row) => (
                <div className="sales-table__row" key={row.date}>
                  <span>{formatMd(row.date)}</span>
                  <span>{row.orderCount}</span>
                  <span>{formatCurrency(row.totalAmount)}</span>
                  <span>{formatCurrency(row.avgAmount)}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="sales-ranking">
          <h2>인기 메뉴 TOP 4</h2>
          <div className="sales-ranking__rows">
            {(data?.ranking ?? []).map((row) => (
              <div className="sales-ranking__row" key={row.rank}>
                <span className="sales-ranking__rank">{row.rank}</span>
                <span className="sales-ranking__name">{row.menuName}</span>
                <span className="sales-ranking__count">{row.orderCount}건</span>
                <b className="sales-ranking__amount">{formatCurrency(row.salesAmount)}</b>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
