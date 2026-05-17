import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import data from "../data/archive.json";
import "./scss/KimMatinArchive.scss";


export default function KimMatinArchive() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [filterYear, setFilterYear] = useState("all");
  const [filterSeason, setFilterSeason] = useState("all");
  const years = [...new Set(data.map((c) => c.year))].sort((a, b) => b - a);

  const filtered = data.filter((c) => {
    const yearMatch = filterYear === "all" || c.year === Number(filterYear);
    const seasonMatch = filterSeason === "all" || c.season === filterSeason;
    return yearMatch && seasonMatch;
  });

  const groupedByYear = years.reduce((acc, year) => {
    const items = filtered.filter((c) => c.year === year);
    if (items.length > 0) acc[year] = items;
    return acc;
  }, {});

  const selected = data.find((c) => c.collectionId === selectedId);

  const totalImages = (collection) =>
    collection.sections.reduce((sum, s) => sum + s.images.length, 0);

  const coverImage = (collection) => collection.sections?.[0]?.images?.[0] || "";

  const closeDetail = () => {
    setSelectedId(null);
    if (new URLSearchParams(location.search).has("collection")) {
      navigate("/kimmatin/archive", { replace: true });
    }
  };

  useEffect(() => {
    const collectionId = Number(new URLSearchParams(location.search).get("collection"));

    if (data.some((collection) => collection.collectionId === collectionId)) {
      setSelectedId(collectionId);
    }
  }, [location.search]);

  useEffect(() => {
    if (selectedId) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
    };
  }, [selectedId]);
  return (
    <div className="background">
      <section className="km-archive">
        {/* 헤더 */}
        <div className="km-archive__header">
          {/* <span className="km-archive__brand">Matin Kim</span> */}
          {/* <h1 className="km-archive__title">ARCHIVE</h1> */}
        </div>

        {/* 필터 */}
        <div className="km-archive__filters">
          <div className="km-archive__filter-group">
            <button
              className={`km-archive__chip ${filterYear === "all" ? "is-active" : ""}`}
              onClick={() => setFilterYear("all")}
            >
              All
            </button>
            {years.map((y) => (
              <button
                key={y}
                className={`km-archive__chip ${filterYear === String(y) ? "is-active" : ""}`}
                onClick={() => setFilterYear(String(y))}
              >
                {y}
              </button>
            ))}
          </div>
          <div className="km-archive__filter-group">
            <button
              className={`km-archive__chip ${filterSeason === "all" ? "is-active" : ""}`}
              onClick={() => setFilterSeason("all")}
            >
              All Season
            </button>
            {["spring", "summer", "fall", "winter"].map((s) => (
              <button
                key={s}
                className={`km-archive__chip ${filterSeason === s ? "is-active" : ""}`}
                onClick={() => setFilterSeason(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* 컬렉션 목록 */}
        <div className="km-archive__body" key={`${filterYear}-${filterSeason}`}>
          {years
            .filter((year) => groupedByYear[year])
            .map((year) => ({ year, collections: groupedByYear[year] }))
            .map(({ year, collections }) => (
              <div key={year} className="km-archive__year-group">
                <div className="km-archive__year-divider">
                  <span className="km-archive__year-label">{year}</span>
                  <span className="km-archive__year-line" />
                </div>

                <div className="km-archive__grid" style={{ "--grid-cols": (years.filter(y => groupedByYear[y]).indexOf(year) % 2 === 0) ? 2 : 3 }}>
                  {
                    collections.map((collection) => (
                      <div
                        key={collection.collectionId}
                        className="km-archive__card"
                        onClick={() => setSelectedId(collection.collectionId)}
                      >
                        <div className="km-archive__card-thumb">
                          <img
                            src={coverImage(collection)}
                            alt={collection.title}
                            className="km-archive__card-img"
                            loading="lazy"
                          />
                          <div className="km-archive__card-overlay">
                            <span className="km-archive__card-view">View Collection</span>
                          </div>
                        </div>
                        <div className="km-archive__card-info">
                          <span className="km-archive__card-season">{collection.title}</span>
                          {collection.subtitle && (
                            <p className="km-archive__card-subtitle">{collection.subtitle}</p>
                          )}
                          <span className="km-archive__card-count">
                            {totalImages(collection)} images
                          </span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))}
        </div>

        {/* 상세 모달 */}
        {selected &&
          createPortal(
            (
            <div className="km-detail" onClick={closeDetail}>
              <div className="km-detail__panel" onClick={(e) => e.stopPropagation()}>
                <div className="km-detail__header">
                  <div>
                    <span className="km-detail__label">{selected.title}</span>
                    {selected.subtitle && (
                      <h2 className="km-detail__title">{selected.subtitle}</h2>
                    )}
                  </div>
                  <button
                    className="km-detail__close"
                    onClick={closeDetail}
                    aria-label="닫기"
                  >
                    ✕
                  </button>
                </div>

                {selected.text && (
                  <p className="km-detail__desc">
                    {selected.text.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </p>
                )}

                <div className="km-detail__sections">
                  {selected.sections.map((section) => (
                    <div
                      key={section.id}
                      className="km-detail__section"
                      style={{ "--cols": section.columns }}
                    >
                      {section.images.map((img, i) => (
                        <div key={i} className="km-detail__img-wrap">
                          <img
                            src={img}
                            alt={`${selected.title} ${section.id}-${i + 1}`}
                            className="km-detail__img"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            ),
            document.body,
          )}
      </section >
    </div>
  );
}
