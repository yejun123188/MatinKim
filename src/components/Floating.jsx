import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getRecentViewedProducts, setRecentViewedProducts } from "../utils/recentViewedProducts";
import { useProductStore } from "../store/useProductStore";
import "./scss/Floating.scss";

const formatPrice = (price) =>
    `₩ ${Number(price || 0).toLocaleString("ko-KR")}`;

const trimName = (name = "") =>
    name.length > 28 ? `${name.slice(0, 28)}...` : name;

const RECENT_ICON = "/images/icon/clock-icon-black.svg";
const CLOSE_ICON = "/images/icon/close-icon-white.svg";
const TOP_ICON = "/images/icon/top-icon-black.svg";

export default function Floating() {
    const navigate = useNavigate();
    const { onColorCode } = useProductStore();
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
    const visibleProducts = useMemo(() => products, [products]);

    return (
        <aside className={`floating-recent-viewed ${open ? "open" : ""}`}>
            <div className={`floating-panel ${open ? "open" : ""}`} aria-hidden={!open}>
                <div className="floating-panel-header">
                    <div>
                        <strong>최근 본 상품</strong>
                        <span>{hasProducts ? `${products.length}개` : "없음"}</span>
                    </div>
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
                                    <Link to={`/products/${product.id}`}>
                                        <div className="img-box">
                                            <img src={product.img} alt={product.name} />
                                        </div>
                                        <ul className="text-box">
                                            <li className="brand-name">MATIN KIM</li>
                                            <li className="product-name">{trimName(product.name)}</li>
                                            <li className="price-wrap">
                                                {product.discountRate > 0 ? (
                                                    <>
                                                        <p className="discount-rate">{product.discountRate}%</p>
                                                        <p className="discount-price">{product.discountPrice.toLocaleString()}</p>
                                                        <p className="original-price">{product.price.toLocaleString()}</p>
                                                    </>
                                                ) : (
                                                    <p className="price">{product.price.toLocaleString()}</p>
                                                )}
                                            </li>
                                            {/* <li className="color-list color-wrap">
                                                {(product.colors || []).map((c, cIdx) => (
                                                    <span
                                                        key={cIdx}
                                                        className="color-item"
                                                        style={{ backgroundColor: onColorCode(c) }}
                                                    ></span>
                                                ))}
                                            </li> */}
                                        </ul>
                                    </Link>
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
