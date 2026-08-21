import { formatMd, toBarHeights } from "../utils/salesDisplay.js";

function toChartPoints(data = {}) {
  const hourlySales = data.hourlySales ?? [];
  if (hourlySales.length) {
    const values = hourlySales.map((row) => Number(row.salesAmount) || 0);
    const heights = toBarHeights(values, 120);
    return {
      title: "시간대별 매출",
      points: hourlySales.map((row, index) => ({
        label: `${row.hour}시`,
        value: values[index],
        barHeight: heights[index],
      })),
    };
  }

  const dailySales = data.dailySales ?? [];
  const values = dailySales.map((row) => Number(row.totalAmount) || 0);
  const heights = toBarHeights(values, 120);
  return {
    title: "일자별 매출",
    points: dailySales.map((row, index) => ({
      label: formatMd(row.date),
      value: values[index],
      barHeight: heights[index],
    })),
  };
}

/** GET /api/admin/sales/summary DTO를 SCR-019 표시 모델로 변환한다. */
export function toSalesSummaryViewModel(data = {}) {
  const chart = toChartPoints(data);
  return {
    label: data.label ?? "-",
    dateRange: data.dateRange ?? "",
    availablePeriods: data.availablePeriods ?? [],
    kpis: data.kpis ?? [],
    dailySales: data.dailySales ?? [],
    paymentShare: data.paymentShare ?? [],
    orderShare: data.orderShare ?? [],
    ranking: data.ranking ?? [],
    chartTitle: chart.title,
    chartPoints: chart.points,
  };
}
