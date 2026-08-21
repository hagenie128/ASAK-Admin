import { useMemo, useState } from "react";
import AdminConfirmDialog from "../../components/admin/shared/AdminConfirmDialog.jsx";
import AdminDatePicker from "../../components/admin/shared/AdminDatePicker.jsx";
import AdminFilterDropdown from "../../components/admin/shared/AdminFilterDropdown.jsx";
import AdminPagination from "../../components/admin/shared/AdminPagination.jsx";
import AdminSearchInput from "../../components/admin/shared/AdminSearchInput.jsx";
import AdminTopHeader from "../../components/admin/shared/AdminTopHeader.jsx";
import OrderDetailPanel from "../../components/admin/orders/OrderDetailPanel.jsx";
import OrderTable from "../../components/admin/orders/OrderTable.jsx";
import {
  ORDER_STATUS_LABEL,
  ORDER_TYPE_LABEL,
  PAYMENT_STATUS_LABEL,
} from "../../constants/orderLabels.js";
import { ADMIN_PAGINATION } from "../../constants/pagination.js";
import { useOrdersQuery } from "../../hooks/useOrdersQuery.js";
import { ordersApi } from "../../api/ordersApi.js";
import { toast } from "../../utils/toast.js";

const ORDERS_PAGINATION = ADMIN_PAGINATION.orders;

/** 일/월 매출과 동일 — mock 연간 범위 (좁은 7/1~7/20 해제) */
const CALENDAR_MIN = "2026-01-01";
const CALENDAR_MAX = "2026-12-31";

function toYmd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function defaultOrderDate() {
  const today = toYmd(new Date());
  if (today < CALENDAR_MIN) return CALENDAR_MIN;
  if (today > CALENDAR_MAX) return CALENDAR_MAX;
  return today;
}

const DEFAULT_ORDER_DATE = defaultOrderDate();

const ORDER_STATUS_OPTIONS = [
  { value: "", label: "주문 상태 전체" },
  ...Object.entries(ORDER_STATUS_LABEL).map(([value, label]) => ({ value, label })),
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "", label: "결제 상태 전체" },
  ...Object.entries(PAYMENT_STATUS_LABEL).map(([value, label]) => ({ value, label })),
];

const ORDER_TYPE_OPTIONS = [
  { value: "", label: "주문 유형 전체" },
  ...Object.entries(ORDER_TYPE_LABEL).map(([value, label]) => ({ value, label })),
];

/* SCR-010 / 주문 관리 — 목록 + 상세 패널 (/orders) */
export default function OrderManagePage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [draftFilters, setDraftFilters] = useState({
    orderStatus: "",
    paymentStatus: "",
    orderType: "",
    dateFrom: DEFAULT_ORDER_DATE,
    dateTo: DEFAULT_ORDER_DATE,
    keyword: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(() => ({
    orderStatus: "",
    paymentStatus: "",
    orderType: "",
    dateFrom: DEFAULT_ORDER_DATE,
    dateTo: DEFAULT_ORDER_DATE,
    keyword: "",
  }));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const { status, orders, totalElements, page, pageSize, onPageChange, refetch } = useOrdersQuery({
    pageSize: ORDERS_PAGINATION.pageSize,
    filters: appliedFilters,
  });

  const dateButtonLabel = useMemo(() => {
    const from = draftFilters.dateFrom || appliedFilters.dateFrom || DEFAULT_ORDER_DATE;
    const to = draftFilters.dateTo || appliedFilters.dateTo || from;
    if (from === to) return from.replaceAll("-", ".");
    return `${from.replaceAll("-", ".")} ~ ${to.replaceAll("-", ".")}`;
  }, [appliedFilters, draftFilters]);

  const handleOrderDetail = async (orderId) => {
    const result = await ordersApi.orderDetail(orderId);
    console.log("handleOrderDetail result:", result);
    if (result?.success === false) {
      toast.error(result.message);
      return;
    }
    setSelectedOrder(result);
  };

  function handlePageChange(nextPage) {
    onPageChange(nextPage);
    setSelectedOrder(null);
  }

  function handleSearch() {
    setAppliedFilters({ ...draftFilters });
    setSelectedOrder(null);
    onPageChange(0);
  }

  function handleDateChange(range) {
    setDraftFilters((prev) => ({
      ...prev,
      dateFrom: range.from,
      dateTo: range.to,
    }));
  }
  // TODO-042: backend TODO-038/039 및 frontend TODO-040 완료 후 ordersApi.refundOrder + ConfirmDialog를 연결한다.
  // 승인 결제만 환불 가능한지와 409/이미 환불됨 응답을 구분하고, 성공 뒤에는 이 훅의 refetch()로 목록을 갱신한다.
  // function handleRefund(orderId) {
  //   setConfirmDialog({
  //     title: "환불하시겠습니까?",
  //     description: "환불 처리 후 결제 상태가 변경됩니다.",
  //     confirmLabel: "환불",
  //     tone: "danger",
  //     onConfirm: () => {
  //       const result = refundAdminOrder(orderId);
  //       if (!result.success) {
  //         toast.error(result.message);
  //         return;
  //       }
  //       toast.success("환불 처리가 완료되었습니다.");
  //       setSelectedOrder(result.data);
  //       refetch();
  //     },
  //   });
  // }

  // TODO-043: backend 출력 계약과 frontend TODO-041 완료 후 ordersApi.printReceipt + ConfirmDialog를 연결한다.
  // 출력 취소·실패·재시도 시 주문 상태를 바꾸지 않고, 브라우저 인쇄라면 API 호출 없이 별도 흐름으로 분리한다.
  // function handlePrintReceipt(orderId) {
  //   setConfirmDialog({
  //     title: "영수증을 출력하시겠습니까?",
  //     description: "선택한 주문의 영수증을 출력합니다.",
  //     confirmLabel: "출력",
  //     tone: "warning",
  //     onConfirm: () => {
  //       const result = printAdminOrderReceipt(orderId);
  //       if (!result.success) {
  //         toast.error(result.message);
  //         return;
  //       }
  //       toast.success("영수증 출력이 완료되었습니다.");
  //       setSelectedOrder(result.data);
  //     },
  //   });
  // }

  function handleConfirm() {
    const action = confirmDialog?.onConfirm;
    setConfirmDialog(null);
    action?.();
  }

  return (
    <section className="order-management">
      <AdminTopHeader
        crumb="Admin / 주문 관리"
        title="주문 관리"
        description="주문 원본 데이터 조회와 결제 상태 확인을 관리하세요."
      />
      <div className="order-management__filters">
        <AdminFilterDropdown
          label="주문 상태"
          value={draftFilters.orderStatus}
          options={ORDER_STATUS_OPTIONS}
          onChange={(orderStatus) => setDraftFilters((prev) => ({ ...prev, orderStatus }))}
        />
        <AdminFilterDropdown
          label="결제 상태"
          value={draftFilters.paymentStatus}
          options={PAYMENT_STATUS_OPTIONS}
          onChange={(paymentStatus) => setDraftFilters((prev) => ({ ...prev, paymentStatus }))}
        />
        <AdminFilterDropdown
          label="주문 유형"
          value={draftFilters.orderType}
          options={ORDER_TYPE_OPTIONS}
          onChange={(orderType) => setDraftFilters((prev) => ({ ...prev, orderType }))}
        />
        <AdminDatePicker
          mode="range"
          monthsVisible={1}
          open={calendarOpen}
          value={{ from: draftFilters.dateFrom, to: draftFilters.dateTo }}
          minDate={CALENDAR_MIN}
          maxDate={CALENDAR_MAX}
          onChange={handleDateChange}
          onClose={() => setCalendarOpen(false)}
        >
          <button
            type="button"
            className={`order-management__date-trigger${calendarOpen || draftFilters.dateFrom ? " is-active" : ""}`}
            aria-expanded={calendarOpen}
            onClick={() => setCalendarOpen((v) => !v)}
          >
            <span>{dateButtonLabel}</span>
            <span className="admin-filter-dropdown__chevron" aria-hidden="true" />
          </button>
        </AdminDatePicker>
        <AdminSearchInput
          className="order-management__keyword"
          aria-label="주문 검색"
          placeholder="주문번호 / 메뉴명 검색"
          value={draftFilters.keyword}
          onChange={(keyword) => setDraftFilters((prev) => ({ ...prev, keyword }))}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSearch();
          }}
        />
        <button className="order-management__search" type="button" onClick={handleSearch}>
          조회
        </button>
      </div>
      <div className="order-management__body">
        <div className="order-management__table-wrap">
          <OrderTable
            status={status}
            orders={orders}
            selectedOrderId={selectedOrder?.orderId ?? null}
            onOrderDetail={handleOrderDetail}
            onRetry={refetch}
          />
          <AdminPagination
            page={page}
            pageSize={pageSize}
            totalElements={totalElements}
            windowSize={ORDERS_PAGINATION.windowSize}
            onPageChange={handlePageChange}
          />
        </div>
        <OrderDetailPanel
          selectedOrder={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          // onRefund={handleRefund}
          // onPrintReceipt={handlePrintReceipt}
        />
      </div>
      <AdminConfirmDialog
        open={Boolean(confirmDialog)}
        title={confirmDialog?.title}
        description={confirmDialog?.description}
        confirmLabel={confirmDialog?.confirmLabel}
        tone={confirmDialog?.tone ?? "danger"}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmDialog(null)}
      />
    </section>
  );
}
