// Page → mode / period 로 getter 고르기
// return { status, data, error, refetch } — data 는 envelope.data
// TODO-022: TODO-019~021 완료 후 mock getter를 salesApi.getSummary/getMonthly/getDaily로 교체한다.
// mode별 startDate/endDate·year·date query를 그대로 전달하고, 빠른 기간 변경 시 이전 응답이 화면을 덮지 않게 처리한다.

import { useEffect, useState } from "react";
import { getDailySales, getMonthlySales, getSalesSummary } from "../mocks/adminMockRepository";

/**
 * @param {object} [options]
 * @param {"summary"|"monthly"|"daily"} [options.mode]
 * @param {"today"|"week"|"month"|"empty"|"partial"} [options.period] summary 전용
 */
export function useSalesQuery({ mode = "summary", period = "month" } = {}) {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const refetch = () => {
    setError(null);
    // 기간 전환 때 화면을 통째로 비우지 않도록, 첫 로딩만 loading으로 둔다.
    setStatus((current) => (current === "success" ? "success" : "loading"));
    try {
      let envelope;
      switch (mode) {
        case "summary":
          envelope = getSalesSummary(period);
          break;
        case "monthly":
          envelope = getMonthlySales();
          break;
        case "daily":
          envelope = getDailySales();
          break;
        default:
          throw new Error("Invalid mode");
      }
      setData(envelope.data);
      setStatus("success");
    } catch (err) {
      setError(err);
      setData(null);
      setStatus("error");
    }
  };

  useEffect(() => {
    refetch();
  }, [mode, period]);

  return {
    status,
    data,
    error,
    refetch,
  };
}
