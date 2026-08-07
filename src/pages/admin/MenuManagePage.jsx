/* SCR-016 / Menu Management — Page는 조합만 */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminAsyncState from "../../components/admin/shared/AdminAsyncState.jsx";
import AdminConfirmDialog from "../../components/admin/shared/AdminConfirmDialog.jsx";
import AdminTopHeader from "../../components/admin/shared/AdminTopHeader.jsx";
import AdminPagination from "../../components/admin/shared/AdminPagination.jsx";
import MenuListPanel from "../../components/admin/menus/MenuListPanel.jsx";
import MenuDetailPanel from "../../components/admin/menus/MenuDetailPanel.jsx";
import MenuEditPanel from "../../components/admin/menus/MenuEditPanel.jsx";
import { useMenusQuery } from "../../hooks/useMenusQuery.js";
import { ADMIN_PAGINATION } from "../../constants/pagination.js";
import { toast } from "../../utils/toast.js";

// const MENUS_PAGINATION = ADMIN_PAGINATION.menus;

/**
 * panelMode: view | edit | create
 * URL: /menus · /menus/edit?menuId= · /menus/new → 이 Page에서 조립
 */
export default function MenuManagePage({ initialMode = "view" } = {}) {
  const [searchParams] = useSearchParams();
  const urlMenuId = searchParams.get("menuId");
  const [panelMode, setPanelMode] = useState(() => {
    if (initialMode === "create" || initialMode === "edit") return initialMode;
    if (urlMenuId) return "edit";
    return "view";
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const {
    status,
    categories,
    optionGroupCatalog,
    menus,
    page,
    onPageChange,
    pageSize,
    totalElements,
    selectedMenuId,
    selectedMenu,
    selectedCategoryId,
    keyword,
    onCategoryIdChange,
    onKeywordChange,
    onSelectMenu,
    updateMenu,
  } = useMenusQuery({ initialMenuId: urlMenuId });
  const [draftKeyword, setDraftKeyword] = useState("");

  useEffect(() => {
    setDraftKeyword(keyword);
  }, [keyword]);

  function handleSelectMenu(menuId) {
    onSelectMenu(menuId);
    setPanelMode("view");
  }

  function handleCategoryIdChange(categoryId) {
    onCategoryIdChange(categoryId);
    onPageChange(0);
  }

  function handleKeywordChange(value) {
    setDraftKeyword(value);
    if (value.trim() === "" && keyword !== "") {
      onKeywordChange("");
      onPageChange(0);
    }
  }

  function handleKeywordSubmit() {
    if (draftKeyword === keyword) return;
    onKeywordChange(draftKeyword);
    onPageChange(0);
  }

  function handleEdit() {
    if (!selectedMenu) return;
    setPanelMode("edit");
  }

  function handleCreate() {
    onPageChange(0);
    if (panelMode !== "view") onPageChange(0);
    setPanelMode("create");
  }

  function handleCancelEdit() {
    setPanelMode("view");
  }

  function handleSaveEdit(payload) {
    if (panelMode === "edit" && selectedMenu) {
      updateMenu(selectedMenu.menuId, payload);
    }

    // TODO-021: 메뉴 등록 FE 2/3 — create 저장 연결.
    // 1) create 모드에서 menusApi.createMenu(payload) 호출
    // 2) 성공 시 새 menuId 선택, 목록 refetch, 상세 패널 진입 규칙 확정
    // 3) 실패 시 toast.error + panelMode 유지
    // TODO-022: 메뉴 등록 검증 3/3 — 등록 직후 목록/상세/이미지/검색 반영 확인.
    // TODO-027: 메뉴 수정 FE 2/3 — edit 저장 연결.
    // 1) edit 모드에서 menusApi.updateMenu(selectedMenu.menuId, payload) 호출
    // 2) 성공 시 refetch 또는 optimistic update로 목록/상세/선택 상태 동기화
    // 3) 실패 시 toast.error + panelMode 유지
    // TODO-028: 메뉴 수정 검증 3/3 — 수정 직후 카드/상세/검색 결과 반영 확인.
    toast.success(
      panelMode === "create"
        ? `메뉴 등록 stub: ${payload.name || "(이름 없음)"}`
        : `메뉴 수정 반영: ${payload.name || selectedMenu?.name}`,
    );
    setPanelMode("view");
  }

  function handleDeleteRequest() {
    if (!selectedMenu) return;
    setDeleteConfirmOpen(true);
  }

  function handleDeleteConfirm() {
    setDeleteConfirmOpen(false);
    // TODO-033: 메뉴 삭제 FE 2/3 — delete 연결.
    // 1) menusApi.deleteMenu(selectedMenu.menuId) 호출
    // 2) 성공 시 refetch + 선택 메뉴 이동(다음 메뉴 또는 null) + view 모드 복귀
    // 3) 실패 시 다이얼로그/토스트 처리 기준 정리
    // TODO-034: 메뉴 삭제 검증 3/3 — 삭제 후 pagination, 검색 결과, 선택 상태 일관성 확인.
    toast.success(`mock에서는 삭제 stub만: ${selectedMenu?.name ?? ""}`);
    setPanelMode("view");
  }

  if (status === "loading") {
    return (
      <section className="menu-management">
        <AdminTopHeader
          crumb="Admin / 메뉴 관리"
          title="메뉴 관리"
          description="상품 기본정보 / 가격 / 카테고리 / 옵션그룹 / 노출여부를 관리하세요."
        />
        <AdminAsyncState status="loading" layout="page" loadingVariant="card" />
      </section>
    );
  }

  return (
    <section className="menu-management">
      <AdminTopHeader
        crumb="Admin / 메뉴 관리"
        title="메뉴 관리"
        description="상품 기본정보 / 가격 / 카테고리 / 옵션그룹 / 노출여부를 관리하세요."
      />
      <div className="menu-management__workspace">
        <MenuListPanel
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategoryIdChange={handleCategoryIdChange}
          keyword={draftKeyword}
          onKeywordChange={handleKeywordChange}
          onKeywordSubmit={handleKeywordSubmit}
          menus={menus}
          selectedMenuId={selectedMenuId}
          onSelectMenu={handleSelectMenu}
          onCreate={handleCreate}
          pagination={
            <AdminPagination
              className="menu-management__pagination"
              page={page}
              pageSize={pageSize}
              totalElements={totalElements}
              windowSize={ADMIN_PAGINATION.menus.windowSize}
              onPageChange={onPageChange}
            />
          }
        />

        {panelMode === "view" ? (
          <MenuDetailPanel menu={selectedMenu} onEdit={handleEdit} onDelete={handleDeleteRequest} />
        ) : (
          <MenuEditPanel
            mode={panelMode}
            menu={panelMode === "edit" ? selectedMenu : null}
            categoryOptions={categories.filter((category) => category.categoryId !== null)}
            optionGroupCatalog={optionGroupCatalog}
            onCancel={handleCancelEdit}
            onSave={handleSaveEdit}
            onDelete={handleDeleteRequest}
          />
        )}
      </div>
      <AdminConfirmDialog
        open={deleteConfirmOpen}
        title="메뉴를 삭제할까요?"
        description={
          selectedMenu
            ? `"${selectedMenu.name}" 메뉴를 삭제합니다. 이 작업은 취소할 수 없습니다.`
            : "선택한 메뉴를 삭제합니다."
        }
        confirmLabel="삭제"
        tone="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </section>
  );
}
