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
  const [status, setStatus] = useState("loading");
  // TODO-012: Empty(0건) vs Error UI 구분·필터 쿼리 정합 확인
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

        setOrderRows(orderList);
        setEmpty(orderList.length === 0);
        setTotalElements(Number(result?.totalElements) || 0);
        setStatus(orderList.length === 0 ? "empty" : "success");
        setError(null);
      } catch (err) {
        if (cancelled) return;

        setOrderRows([]);
        setEmpty(true);
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
    setEmpty,
    setError,
  };
}
