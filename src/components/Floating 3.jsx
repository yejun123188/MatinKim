import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRecentViewedProducts, setRecentViewedProducts } from "../utils/recentViewedProducts";
import "./scss/Floating.scss";

const formatPrice = (price) =>
    `₩ ${Number(price || 0).toLocaleString("ko-KR")}`;

const trimName = (name = "") =>
    name.length > 28 ? `${name.slice(0, 28)}...` : name;

const RECENT_ICON = "/images/icon/clock-icon-white.svg";
const CLOSE_ICON = "/images/icon/close-icon-white.svg";
const TOP_ICON = "/images/icon/top-icon-white.svg";

export default function Floating() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [showTopButton, setShowTopButton] = useState(false);

    const loadProducts = useCallback(() => {
        setProducts(getRecentViewedProducts());
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key === "recentViewedProducts") {
                loadProducts();
            }
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, [loadProducts]);

    useEffect(() => {
        const handleScroll = () => {
            setShowTopButton(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleToggle = () => {
        setOpen((prev) => !prev);
    };

    const handleRemove = (id) => {
        const nextProducts = products.filter((product) => product.id !== id);
        setProducts(nextProducts);
        setRecentViewedProducts(nextProducts);
    };

    const handleClear = () => {
        setProducts([]);
        setRecentViewedProducts([]);
    };

    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const hasProducts = products.length > 0;
    const visibleProducts = useMemo(() => products.slice(0, 5), [products]);

    return (
        <aside className={`floating-recent-viewed ${open ? "open" : ""}`}>
            <div className={`floating-panel ${open ? "open" : ""}`} aria-hidden={!open}>
                <div className="floating-panel-header">
                    <div>
                        <strong>최근 본 상품</strong>
                        <span>{hasProducts ? `${products.length}개` : "없음"}</span>
                    </div>
                    <strong>최근 본 상품
                        <span>{hasProducts ? products.length : 0}</span>
                    </strong>
                    <button
                        type="button"
                        className="close-panel-btn"
                        onClick={handleToggle}
                        aria-label="최근 본 상품 닫기"
                    >
                        <img src={CLOSE_ICON} alt="닫기" />
                    </button>
                </div>

                <div className="floating-body">
                    {hasProducts ? (
                        <ul className="floating-list">
                            {visibleProducts.map((product) => (
                                <li key={product.id} className="floating-item">
                                    <button
                                        type="button"
                                        className="floating-thumb"
                                        onClick={() => navigate(`/products/${product.id}`)}
                                        aria-label={`${product.name} 상세보기`}
                                    >
                                        <img src={product.img} alt={product.name} />
                                    </button>
                                    <div className="floating-info">
                                        <button
                                            type="button"
                                            className="floating-name"
                                            onClick={() => navigate(`/products/${product.id}`)}
                                        >
                                            {trimName(product.name)}
                                        </button>
                                        <span className="floating-price">{formatPrice(product.price)}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() => handleRemove(product.id)}
                                        aria-label="삭제"
                                    >
                                        ×
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="floating-empty">최근 본 상품이 없습니다.</div>
                    )}
                </div>

                <button type="button" className="clear-all-btn" onClick={handleClear}>
                    전체삭제
                </button>
            </div>

            <div className="floating-button-group">
                <button
                    type="button"
                    className="floating-toggle-btn"
                    onClick={handleToggle}
                    aria-expanded={open}
                >
                    <img src={RECENT_ICON} alt="최근 본 상품" />

                </button>
                {showTopButton && (
                    <button type="button" className="floating-top-btn" onClick={handleScrollTop}>
                        <img src={TOP_ICON} alt="맨위로" />
                    </button>
                )}
            </div>
        </aside>
    );
}
