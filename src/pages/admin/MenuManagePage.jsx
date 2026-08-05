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
import { ADMIN_PAGINATION } from "../../constants/pagination.js";
import { useMenusQuery } from "../../hooks/useMenusQuery.js";
import { usePagination } from "../../hooks/usePagination.js";
import { toast } from "../../utils/toast.js";

const MENUS_PAGINATION = ADMIN_PAGINATION.menus;

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
    filteredMenus,
    selectedMenu,
    selectedCategory,
    keyword,
    setSelectedCategory,
    setKeyword,
    selectMenu,
    updateMenu,
  } = useMenusQuery({ initialMenuId: urlMenuId });

  const menusPage = usePagination(filteredMenus, { pageSize: MENUS_PAGINATION.pageSize });

  function handleSelectMenu(menuId) {
    selectMenu(menuId);
    if (panelMode !== "view") setPanelMode("view");
  }

  function handleCategoryChange(name) {
    setSelectedCategory(name);
    menusPage.resetPage();
  }

  function handleKeywordChange(value) {
    setKeyword(value);
    menusPage.resetPage();
  }

  function handleEdit() {
    if (!selectedMenu) return;
    setPanelMode("edit");
  }

  function handleCreate() {
    setPanelMode("create");
  }

  function handleCancelEdit() {
    setPanelMode("view");
  }

  function handleSaveEdit(payload) {
    if (panelMode === "edit" && selectedMenu) {
      updateMenu(selectedMenu.menuId, payload);
    }

    // TODO-047: create → menusApi.createMenu / edit → menusApi.updateMenu 후 refetch
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
    // TODO-048: menusApi.deleteMenu(selectedMenu.menuId) 후 목록 갱신
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
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          keyword={keyword}
          onKeywordChange={handleKeywordChange}
          menus={menusPage.pageItems}
          selectedMenuId={selectedMenu?.menuId ?? null}
          onSelectMenu={handleSelectMenu}
          onCreate={handleCreate}
          pagination={
            <AdminPagination
              className="menu-management__pagination"
              page={menusPage.page}
              pageSize={menusPage.pageSize}
              totalElements={menusPage.totalElements}
              windowSize={MENUS_PAGINATION.windowSize}
              onPageChange={menusPage.goToPage}
            />
          }
        />

        {panelMode === "view" ? (
          <MenuDetailPanel
            menu={selectedMenu}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />
        ) : (
          <MenuEditPanel
            mode={panelMode}
            menu={panelMode === "edit" ? selectedMenu : null}
            categoryOptions={categories.filter((name) => name !== "전체")}
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
