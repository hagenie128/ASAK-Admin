// Page → mode / period 로 getter 고르기
// return { status, data, error, refetch } — data 는 envelope.data
// Summary는 실 API를 사용한다. Monthly·Daily는 TODO-020~022 완료 전까지 mock getter를 유지한다.
// mode별 startDate/endDate·year·date query를 그대로 전달하고, 빠른 기간 변경 시 이전 응답이 화면을 덮지 않게 처리한다.

import { useCallback, useEffect, useState } from "react";
import { toSalesSummaryViewModel } from "../adapters/salesAdapter.js";
import { salesApi } from "../api/salesApi.js";
import { getDailySales, getMonthlySales } from "../mocks/adminMockRepository";

/**
 * @param {object} [options]
 * @param {"summary"|"monthly"|"daily"} [options.mode]
 * @param {"today"|"week"|"month"|null} [options.period] summary 전용
 * @param {string} [options.startDate] summary 직접 조회 시작일(ISO)
 * @param {string} [options.endDate] summary 직접 조회 종료일(ISO)
 */
export function useSalesQuery({ mode = "summary", period = "month", startDate, endDate } = {}) {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [requestVersion, setRequestVersion] = useState(0);

  const refetch = useCallback(() => {
    setRequestVersion((version) => version + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    setError(null);
    // 기간 전환 때 화면을 통째로 비우지 않도록, 첫 로딩만 loading으로 둔다.
    setStatus((current) => (current === "success" ? "success" : "loading"));
    if (mode === "summary") {
      salesApi
        .getSummary({ period: period ?? undefined, startDate, endDate })
        .then((response) => {
          if (cancelled) return;
          setData(toSalesSummaryViewModel(response));
          setStatus("success");
        })
        .catch((requestError) => {
          if (cancelled) return;
          setError(requestError);
          setData(null);
          setStatus("error");
        });
      return () => {
        cancelled = true;
      };
    }

    try {
      let envelope;
      switch (mode) {
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

    return () => {
      cancelled = true;
    };
  }, [mode, period, startDate, endDate, requestVersion]);

  return {
    status,
    data,
    error,
    refetch,
  };
}
