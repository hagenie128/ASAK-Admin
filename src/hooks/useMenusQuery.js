// 메뉴 목록 조회 Hook (SCR-016)
// 목록·필터·페이지네이션은 백엔드 PageResult(content, totalElements) 기준
import { useEffect, useState } from "react";
import { menusApi } from "../api/menusApi.js";
import { ADMIN_PAGINATION } from "../constants/pagination.js";

function getOptionGroupCatalog(menus) {
  const groupsById = new Map();
  menus.forEach((menu) => {
    (menu.detail?.optionGroups ?? []).forEach((group) => {
      if (!groupsById.has(group.groupId)) groupsById.set(group.groupId, group);
    });
  });
  return [...groupsById.values()];
}

function buildListParams({ page, pageSize, selectedCategoryId, keyword }) {
  const params = {
    page,
    size: pageSize,
    sort: "name,asc",
  };
  const q = keyword.trim();
  if (q) params.keyword = q;
  if (selectedCategoryId != null) params.categoryId = selectedCategoryId;
  return params;
}

export function useMenusQuery({
  initialMenuId = null,
  pageSize = ADMIN_PAGINATION.menus.pageSize,
} = {}) {
  const [menus, setMenus] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [tick, setTick] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMenus() {
      setStatus("loading");
      try {
        const response = await menusApi.listMenus(
          buildListParams({ page, pageSize, selectedCategoryId, keyword }),
        );
        if (cancelled) return;

        const content = response.content ?? [];
        setMenus(content);
        setTotalElements(Number(response.totalElements) || 0);
        setStatus(content.length === 0 ? "empty" : "success");
        setError(null);

        setSelectedMenuId((current) => {
          if (initialMenuId) {
            const matched = content.find((row) => String(row.menuId) === String(initialMenuId));
            if (matched) return matched.menuId;
          }
          if (current && content.some((row) => row.menuId === current)) {
            return current;
          }
          return content[0]?.menuId ?? null;
        });
      } catch (err) {
        if (cancelled) return;
        setMenus([]);
        setTotalElements(0);
        setStatus("error");
        setError(err);
      }
    }

    fetchMenus();
    return () => {
      cancelled = true;
    };
  }, [initialMenuId, page, pageSize, selectedCategoryId, keyword, tick]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await menusApi.listCategories();
        setCategories(response.content ?? []);
      } catch (err) {
        setCategories([]);
        setError(err);
      }
    }

    fetchCategories();
  }, []);

  const optionGroupCatalog = getOptionGroupCatalog(menus);

  useEffect(() => {
    let cancelled = false;

    async function fetchSelectedMenu() {
      if (!selectedMenuId) {
        setSelectedMenu(null);
        return;
      }

      try {
        const response = await menusApi.getMenu(selectedMenuId);
        if (cancelled) return;
        setSelectedMenu(response ?? null);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setSelectedMenu(null);
        setError(err);
      }
    }

    fetchSelectedMenu();
    return () => {
      cancelled = true;
    };
  }, [selectedMenuId]);

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
    setSelectedMenu((prev) =>
      prev && prev.menuId === menuId
        ? {
            ...prev,
            name: payload.name,
            categoryName: payload.categoryName,
            price: payload.price,
            isActive: payload.isActive,
            description: payload.description,
            imageUrl: payload.imageUrl,
            ingredients: payload.ingredients,
            optionGroups: payload.optionGroups,
            nutrition: payload.nutrition,
            allergens: payload.allergens,
            tags: payload.tags,
          }
        : prev,
    );
  }

  return {
    status,
    totalElements,
    page,
    pageSize,
    categories,
    error,
    optionGroupCatalog,
    menus,
    selectedMenuId,
    selectedMenu,
    selectedCategoryId,
    keyword,
    onCategoryIdChange: setSelectedCategoryId,
    onKeywordChange: setKeyword,
    onSelectMenu: setSelectedMenuId,
    updateMenu,
    onPageChange: (nextPage) => setPage(Math.max(0, nextPage)),
    refetch: () => setTick((n) => n + 1),
  };
}
