// TODO-025: backend TODO-023과 adminApi TODO-024이 완료된 뒤 mock getDashboard를 adminApi.getDashboard로 교체한다.
// 기존 return { status, data, error, refetch }와 loading·empty·error 화면 상태를 보존하고 날짜/집계 기준을 응답으로 검증한다.
import { useEffect, useState } from "react";
import { getDashboard } from "../mocks/adminMockRepository.js";

export function useDashboard() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    try {
      const envelope = getDashboard();
      setData(envelope.data ?? null);
      setStatus("success");
    } catch {
      setData(null);
      setStatus("error");
    }
  }, []);

  return { data, status };
}
