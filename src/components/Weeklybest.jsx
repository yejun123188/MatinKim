import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import SectionTitle from "./SectionTitle";
import { useProductStore } from "../store/useProductStore";
import "./scss/weeklybest.scss";
import ProductCard from "./ProductCard";
import products2 from "../data/products2.json";
import { BRAND, useBrandStore } from "../store/useBrandStore";

export default function Weeklybest() {
  const { BestItems, onBestMenus, items, onFetchItem } = useProductStore();
  const { brand } = useBrandStore();

  const isKimMatin = brand === BRAND.KIMMATIN;

  const [showAll, setShowAll] = useState(false);
  const [listHeight, setListHeight] = useState(0);

  const listRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  /* =========================
  인터섹션 애니메이션
  ========================= */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  /* =========================
  데이터 로드
  ========================= */
  useEffect(() => {
    if (isKimMatin) return;

    if (items.length === 0) {
      onFetchItem();
    }

    onBestMenus();
  }, [isKimMatin, items.length, onFetchItem, onBestMenus]);

  /* =========================
  베스트 상품
  ========================= */
  const kimBestItems = products2.filter(
    (item) =>
      Array.isArray(item.tag) &&
      item.tag.includes("MUST HAVE")
  );

  const weeklyItems = isKimMatin ? kimBestItems : BestItems;
  const MAX_WEEKLY_ITEMS = 10;

  const visibleItems = weeklyItems.slice(0, MAX_WEEKLY_ITEMS);

  /* =========================
  높이 계산
  ========================= */
  useLayoutEffect(() => {
    const list = listRef.current;

    if (!list) return;

    const updateListHeight = () => {
      if (showAll) {
        setListHeight(list.scrollHeight);
        return;
      }

      const firstCard = list.querySelector(".product-card");

      if (!firstCard) return;

      setListHeight(firstCard.offsetHeight);
    };

    updateListHeight();

    window.addEventListener("resize", updateListHeight);

    return () => {
      window.removeEventListener("resize", updateListHeight);
    };
  }, [weeklyItems.length, showAll]);

  return (
    <section
      ref={sectionRef}
      className={`weeklybest ${isVisible ? "is-visible" : ""}`}
    >
      <div className="inner">
        <SectionTitle
          title="WEEKLY BEST ITEM"
          subtitle="이번 시즌의 인기 아이템"
        />

        <div
          className={`best-item-list-wrap ${showAll ? "is-open is-animate" : ""
            }`}
          style={{
            maxHeight: listHeight
              ? `${listHeight}px`
              : undefined,
          }}
        >
          <ul className="best-item-list" ref={listRef}>
            {visibleItems.map((item, id) => (
              <ProductCard
                cate={item}
                key={item.id || id}
                rank={id + 1}
              />
            ))}
          </ul>
        </div>

        <button
          type="button"
          className="see-more"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "CLOSE" : "SEE MORE"}

          <img
            src={`/images/pages-icon/${showAll
              ? "top-icon.svg"
              : "bottom-icon.svg"
              }`}
            alt=""
            aria-hidden="true"
          />
        </button>
      </div>
    </section>
  );
}