// Page → mode / period 로 getter 고르기
// return { status, data, error, refetch } — data 는 envelope.data
// TODO-056: getSalesSummary/getMonthly/getDaily mock → salesApi.getSummary/getMonthly/getDaily

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
    setStatus("loading");
    setError(null);
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
