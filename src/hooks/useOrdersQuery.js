// 주문 목록 조회 Hook (SCR-010 / WBS2-036)
import { useEffect, useState } from "react";
import { ADMIN_PAGINATION } from "../constants/pagination.js";
import { ordersApi } from "../api/ordersApi.js";

/**
 * @param {object} [options]
 * @param {number} [options.pageSize] — 기본: ADMIN_PAGINATION.orders.pageSize
 * @param {object} [options.filters]
 */
export function useOrdersQuery({ pageSize = ADMIN_PAGINATION.orders.pageSize, filters = {} } = {}) {
  // TODO-012: 목록 Empty/Error와 필터 쿼리 정합 최종 검증.
  // 1) 0건 성공 응답이면 status="empty", 실패면 status="error" 유지 확인
  // 2) orderStatus/paymentStatus/orderType/dateFrom/dateTo/keyword 가 API 쿼리와 정확히 매핑되는지 확인
  // 3) OrderManagementPreview / OrderTable 화면 문구와 재시도 흐름까지 수동 검증
  // status: loading | success | empty | error
  // Empty = API 성공 + 0건 / Error = 요청 실패(throw). 둘을 섞지 않는다.
  const [status, setStatus] = useState("loading");
  const [empty, setEmpty] = useState(false);
  const [error, setError] = useState(null);
  const [orderRows, setOrderRows] = useState([]);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [tick, setTick] = useState(0);

  const {
    orderStatus = "",
    paymentStatus = "",
    orderType = "",
    dateFrom = "",
    dateTo = "",
    keyword = "",
  } = filters;

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      setStatus("loading");
      setEmpty(false);
      setError(null);

      try {
        // apiClient가 envelope을 풀어 PageResult({ content, totalElements, ... })만 반환
        const result = await ordersApi.listOrders({
          page,
          size: pageSize,
          orderStatus,
          paymentStatus,
          orderType,
          dateFrom,
          dateTo,
          keyword,
        });

        if (cancelled) return;

        const orderList = Array.isArray(result?.content) ? result.content : [];
        const isEmpty = orderList.length === 0;

        setOrderRows(orderList);
        setEmpty(isEmpty);
        setTotalElements(Number(result?.totalElements) || 0);
        setStatus(isEmpty ? "empty" : "success");
        setError(null);
      } catch (err) {
        if (cancelled) return;

        // 실패는 empty가 아님 — OrderTable이 status==="error"로 별도 UI 표시
        setOrderRows([]);
        setEmpty(false);
        setTotalElements(0);
        setStatus("error");
        setError(err);
      }
    };

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, [page, pageSize, orderStatus, paymentStatus, orderType, dateFrom, dateTo, keyword, tick]);

  return {
    status,
    empty,
    error,
    orders: orderRows,
    totalElements,
    page,
    pageSize,
    onPageChange: (nextPage) => setPage(Math.max(0, nextPage)),
    refetch: () => setTick((n) => n + 1),
  };
}
