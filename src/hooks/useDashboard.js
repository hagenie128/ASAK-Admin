import { useCallback, useEffect, useState } from "react";
import { toDashboardViewModel } from "../adapters/dashboardAdapter.js";
import { adminApi } from "../api/adminApi.js";

export function useDashboard() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [requestVersion, setRequestVersion] = useState(0);

  const refetch = useCallback(() => {
    setRequestVersion((version) => version + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    setError(null);
    setStatus((current) => (current === "success" || current === "refreshing" ? "refreshing" : "loading"));

    adminApi
      .getDashboard()
      .then((response) => {
        if (cancelled) return;
        setData(toDashboardViewModel(response));
        setStatus("success");
      })
      .catch((requestError) => {
        if (cancelled) return;
        setError(requestError);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [requestVersion]);

  return { data, status, error, refetch };
}
