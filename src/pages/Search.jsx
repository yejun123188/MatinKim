import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import ProductCard from "../components/ProductCard";
import { expandSearchQuery } from "../utils/searchKeywords";
import "./scss/productList.scss";
import "./scss/Search.scss";

const ITEMS_PER_PAGE = 20;

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .trim();

const getSearchText = (item) => {
  const chunks = [
    item.name,
    item.productCode,
    item.category1,
    item.category2,
    ...(item.bullet_points || []),
    ...(item.colors || []),
    ...(item.tag || []),
  ];

  return normalizeText(chunks.join(" "));
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const trimmedQuery = query.trim();

  const { items, onFetchItem } = useProductStore();

  const [inputValue, setInputValue] = useState(query);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (items.length === 0) {
      onFetchItem();
    }
  }, [items.length, onFetchItem]);

  useEffect(() => {
    setInputValue(query);
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const searchResults = useMemo(() => {
    if (!trimmedQuery) return [];

    const expandedWordGroups = expandSearchQuery(trimmedQuery);

    return items.filter((item) => {
      const searchText = getSearchText(item);
      const category2 = normalizeText(item.category2);

      return expandedWordGroups.every((group) => {
        const textMatch = group.words.some((word) =>
          searchText.includes(normalizeText(word))
        );

        const category2Match = group.category2?.some(
          (value) => category2 === normalizeText(value)
        );

        if (group.requireCategoryMatch && group.requireTextMatch) {
          return category2Match && textMatch;
        };

        if (group.requireCategoryMatch) {
          return category2Match;
        };

        return textMatch || category2Match;
      });
    });
  }, [items, trimmedQuery]);

  const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);

  const pagedItems = searchResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextQuery = inputValue.trim();
    if (!nextQuery) return;

    setSearchParams({ q: nextQuery });
  };

  return (
    <main className="product-list-wrap search-page">
      <div className="inner filter-hidden">
        <div className="product-list-wrap filter-hidden is-visible">
          <section className="search-head">
            <p className="search-eyebrow">SEARCH</p>
            <h2>상품 검색</h2>

            <form className="search-form" onSubmit={handleSubmit}>
              <input
                type="search"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="검색어를 입력하세요"
                aria-label="상품 검색어"
              />
              <button type="submit">검색</button>
            </form>

            {trimmedQuery && (
              <p className="search-summary">
                <strong>{trimmedQuery}</strong> 검색 결과 {searchResults.length}개
              </p>
            )}
          </section>

          {trimmedQuery && searchResults.length > 0 && (
            <div className="product-list">
              <ul>
                {pagedItems.map((item) => (
                  <ProductCard cate={item} key={item.id} />
                ))}
              </ul>
            </div>
          )}

          {trimmedQuery && searchResults.length === 0 && (
            <div className="search-empty">
              <h3>검색 결과가 없습니다.</h3>
              <p>상품명, 컬러, 카테고리명으로 다시 검색해보세요.</p>
              <Link to="/all">전체 상품 보기</Link>
            </div>
          )}

          {!trimmedQuery && (
            <div className="search-empty">
              <h3>찾고 싶은 상품을 검색해주세요.</h3>
              <p>예: bag, denim, black, outerwears</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="page-btn page-arrow"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <img src="/images/pages-icon/prev-icon.svg" alt="" />
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((pageNumber) => (
                <button
                  type="button"
                  key={pageNumber}
                  className={`page-btn ${currentPage === pageNumber ? "is-active" : ""
                    }`}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                className="page-btn page-arrow"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <img src="/images/pages-icon/next-icon.svg" alt="" />
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}