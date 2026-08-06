// 메뉴 목록 조회 Hook (SCR-016)
// TODO-024: getAdminMenus mock → menusApi.listMenus / getMenu 실연동
import { useEffect, useMemo, useState } from "react";
import { getAdminMenus } from "../mocks/adminMockRepository.js";

function getOptionGroupCatalog(menus) {
  const groupsById = new Map();
  menus.forEach((menu) => {
    (menu.detail?.optionGroups ?? []).forEach((group) => {
      if (!groupsById.has(group.groupId)) groupsById.set(group.groupId, group);
    });
  });
  return [...groupsById.values()];
}

export function useMenusQuery({ initialMenuId = null } = {}) {
  const [menus, setMenus] = useState([]);
  const [status, setStatus] = useState("loading");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [keyword, setKeyword] = useState("");
  const [selectedMenuId, setSelectedMenuId] = useState(null);

  useEffect(() => {
    const envelope = getAdminMenus();
    const rows = envelope.data?.content ?? [];
    setMenus(rows);
    const matched = rows.find((row) => String(row.menuId) === String(initialMenuId));
    setSelectedMenuId(matched?.menuId ?? rows[0]?.menuId ?? null);
    setStatus("ready");
  }, [initialMenuId]);

  const categories = useMemo(() => {
    const names = [...new Set(menus.map((row) => row.categoryName).filter(Boolean))];
    return ["전체", ...names];
  }, [menus]);

  const filteredMenus = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return menus.filter((row) => {
      if (selectedCategory !== "전체" && row.categoryName !== selectedCategory) return false;
      if (q && !String(row.name ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [menus, selectedCategory, keyword]);

  // 옵션 그룹은 mock 목록에서 파생한 값이라 별도 Hook 상태가 필요 없다.
  const optionGroupCatalog = getOptionGroupCatalog(menus);

  useEffect(() => {
    if (filteredMenus.length === 0) {
      setSelectedMenuId(null);
      return;
    }
    const stillVisible = filteredMenus.some((row) => row.menuId === selectedMenuId);
    if (!stillVisible) {
      setSelectedMenuId(filteredMenus[0].menuId);
    }
  }, [filteredMenus, selectedMenuId]);

  const selectedMenu =
    filteredMenus.find((row) => row.menuId === selectedMenuId) ?? filteredMenus[0] ?? null;

  function updateMenu(menuId, payload) {
    setMenus((prev) =>
      prev.map((menu) => {
        if (menu.menuId !== menuId) return menu;

        return {
          ...menu,
          name: payload.name,
          categoryName: payload.categoryName,
          price: payload.price,
          isActive: payload.isActive,
          detail: {
            ...menu.detail,
            description: payload.description,
            imageUrl: payload.imageUrl,
            ingredients: payload.ingredients,
            optionGroups: payload.optionGroups,
            nutrition: payload.nutrition,
            allergens: payload.allergens,
            tags: payload.tags,
          },
        };
      }),
    );
  }

  return {
    status,
    categories,
    optionGroupCatalog,
    filteredMenus,
    selectedMenu,
    selectedCategory,
    keyword,
    setSelectedCategory,
    setKeyword,
    selectMenu: setSelectedMenuId,
    updateMenu,
  };
}
