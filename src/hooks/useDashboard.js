// TODO-058: getDashboard mock → adminApi.getDashboard
import { useEffect, useState } from "react";
import { getDashboard } from "../mocks/adminMockRepository.js";

export function useDashboard() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    try {
      const envelope = getDashboard();
      setData(envelope.data ?? null);
      setStatus("ready");
    } catch {
      setData(null);
      setStatus("error");
    }
  }, []);

  return { data, status };
}
