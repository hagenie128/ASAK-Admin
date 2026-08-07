/* SCR-016 메뉴 목록 (탭·검색·그리드) */
import ricottaImage from "../../../assets/figma/soldout-ricotta.png";
import { formatCurrency } from "../../../utils/currency.js";
import AdminAsyncState from "../shared/AdminAsyncState.jsx";
import AdminSearchInput from "../shared/AdminSearchInput.jsx";

export default function MenuListPanel({
  categories,
  selectedCategoryId,
  onCategoryIdChange,
  keyword,
  onKeywordChange,
  onKeywordSubmit,
  menus,
  selectedMenuId,
  onSelectMenu,
  onCreate,
  pagination = null,
}) {
  return (
    <div className="menu-management__list">
      <div className="menu-management__toolbar">
        <div className="menu-management__tabs">
          <button
            type="button"
            className={selectedCategoryId === null ? "is-selected" : ""}
            onClick={() => onCategoryIdChange(null)}
          >
            전체
          </button>
          {categories.map((category) => (
            <button
              key={category.categoryId}
              type="button"
              className={category.categoryId === selectedCategoryId ? "is-selected" : ""}
              onClick={() => onCategoryIdChange(category.categoryId)}
            >
              {category.categoryName}
            </button>
          ))}
        </div>
        <div className="menu-management__toolbar-right">
          <label className="menu-management__search">
            <span className="sr-only">메뉴명 검색</span>
            <i aria-hidden="true" />
            <AdminSearchInput
              className="admin-search-input--embedded"
              value={keyword}
              placeholder="메뉴명 검색"
              onChange={(next) => onKeywordChange(next)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onKeywordSubmit?.();
                }
              }}
            />
          </label>
          {onCreate ? (
            <button type="button" className="menu-management__create" onClick={onCreate}>
              메뉴 추가
            </button>
          ) : null}
        </div>
      </div>
      <div className="menu-management__grid">
        {menus === null ? (
          <AdminAsyncState
            status="empty"
            layout="inline"
            title="조건에 맞는 메뉴가 없습니다"
            description="카테고리·검색어를 바꿔 보세요."
          />
        ) : (
          menus?.map((menu) => (
            <article
              key={menu.menuId}
              className={`admin-menu-card${menu.menuId === selectedMenuId ? " is-selected" : ""}`}
              role="button"
              tabIndex={0}
              aria-pressed={menu.menuId === selectedMenuId}
              onClick={() => onSelectMenu(menu.menuId)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectMenu(menu.menuId);
                }
              }}
            >
              <img src={menu.imageUrl || ricottaImage} alt="" />
              <div>
                <strong title={menu.name}>{menu.name}</strong>
                <b>{formatCurrency(menu.price)}</b>
              </div>
            </article>
          ))
        )}
      </div>
      {pagination}
    </div>
  );
}
