import { useEffect, useState } from "react";
import { salesApi } from "../api/salesApi.js";

export function useDailySalesTimeSlots({ date, intervalMinutes }) {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!date) {
      setStatus("idle");
      setData([]);
      return undefined;
    }

    let cancelled = false;
    setStatus("loading");
    setError(null);

    salesApi
      .getDailyTimeSlots({ date, intervalMinutes })
      .then((response) => {
        if (cancelled) return;
        setData(response ?? []);
        setStatus("success");
      })
      .catch((requestError) => {
        if (cancelled) return;
        setData([]);
        setError(requestError);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [date, intervalMinutes, requestVersion]);

  return {
    status,
    data,
    error,
    refetch: () => setRequestVersion((version) => version + 1),
  };
}
