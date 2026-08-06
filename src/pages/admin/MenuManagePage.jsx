/* SCR-016 / Menu Management — Page는 조합만 */
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminAsyncState from "../../components/admin/AdminAsyncState.jsx";
import AdminConfirmDialog from "../../components/admin/AdminConfirmDialog.jsx";
import AdminTopHeader from "../../components/admin/AdminTopHeader.jsx";
import AdminPagination from "../../components/admin/AdminPagination.jsx";
import MenuListPanel from "../../components/admin/MenuListPanel.jsx";
import MenuDetailPanel from "../../components/admin/MenuDetailPanel.jsx";
import MenuEditPanel from "../../components/admin/MenuEditPanel.jsx";
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

  function handleSelectMenu(menuId) {
    onSelectMenu(menuId);
    setPanelMode("view");
  }

  function handleCategoryIdChange(categoryId) {
    onCategoryIdChange(categoryId);
    onPageChange(0);
  }

  function handleKeywordChange(value) {
    onKeywordChange(value);
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

    // TODO-025: 저장 버튼 실연동.
    // 1) create 모드면 menusApi.createMenu(payload), edit 모드면 menusApi.updateMenu(selectedMenu.menuId, payload) 호출
    // 2) 성공 시 refetch 또는 optimistic update로 목록/상세/선택 상태를 함께 갱신
    // 3) 실패 시 toast.error + panelMode 유지 기준 정리
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
    // TODO-031: 삭제 확인 후 menusApi.deleteMenu(selectedMenu.menuId) 호출.
    // 1) 삭제 API 호출
    // 2) 성공 시 refetch
    // 3) 선택 메뉴 이동(다음 메뉴 또는 null) + view 모드 복귀 처리
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
          keyword={keyword}
          onKeywordChange={handleKeywordChange}
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
