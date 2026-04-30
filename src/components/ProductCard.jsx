import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore'

const getProductBaseName = (item) => {
    if (!item?.name) return '';

    const primaryColor = item.colors?.[0];
    const colorSuffix = primaryColor ? ` IN ${primaryColor}` : '';

    return colorSuffix && item.name.endsWith(colorSuffix)
        ? item.name.slice(0, -colorSuffix.length)
        : item.name;
};

export default function ProductCard({ cate }) {
    const { items, onColorCode, onAddCart, openCart } = useProductStore();
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
    const [previewProduct, setPreviewProduct] = useState(null);
    const displayProduct = previewProduct || cate;
    const isSoldOut = Array.isArray(cate.soldout) && cate.soldout.length > 0 && cate.soldout.every(Boolean);
    const availableSizeIndex = Array.isArray(cate.sizes)
        ? cate.sizes.findIndex((size, index) => size && !cate.soldout?.[index])
        : -1;
    const defaultSize = availableSizeIndex >= 0 ? cate.sizes[availableSizeIndex] : cate.sizes?.[0] || '';
    const defaultColor = cate.colors?.[0] || '';
    const salePrice = cate.discountRate > 0 ? cate.discountPrice : cate.price;
    const colorVariants = useMemo(() => {
        const baseName = getProductBaseName(cate);
        const variants = items.filter((item) => getProductBaseName(item) === baseName && item.colors?.[0]);

        return variants.length > 0 ? variants : [cate];
    }, [items, cate]);
    const badgeItems = isSoldOut
        ? [{
            key: 'sold-out',
            label: 'SOLD OUT',
            type: 'soldout'
        }]
        : [
            ...(cate.tag || []).map((tag) => ({
                key: tag,
                label: tag,
                type: 'default'
            })),
            ...(cate.discountRate > 0
                ? [{
                    key: `discount-${cate.discountRate}`,
                    label: 'SALE',
                    type: 'discount'
                }]
                : [])
        ];

    const getColorStyle = (colorName) => {
        const colorValue = onColorCode(colorName);
        return colorValue.includes('gradient')
            ? { background: colorValue }
            : { backgroundColor: colorValue };
    };

    const handleMoveDetail = () => {
        navigate(`/products/${cate.id}`);
    };

    const handleActionClick = (event) => {
        event.stopPropagation();
    };

    const handleToggleLike = (event) => {
        handleActionClick(event);
        setIsLiked((prev) => !prev);
    };

    const handleAddCart = (event) => {
        handleActionClick(event);
        if (isSoldOut) return;

        onAddCart({
            id: cate.id,
            name: cate.name,
            price: salePrice,
            size: defaultSize,
            color: defaultColor,
            count: 1,
            image: cate.mainImg || cate.hoverImg,
            key: `${cate.id}-${defaultSize}-${defaultColor}`
        });
        openCart();
    };

    const handleBuyNow = (event) => {
        handleActionClick(event);
        handleMoveDetail();
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleMoveDetail();
        }
    };

    return (
        <li
            className="product-card"
            onClick={handleMoveDetail}
            onKeyDown={handleKeyDown}
            role="link"
            tabIndex={0}
            aria-label={`${cate.name} 상세페이지 이동`}
        >
            <div className="img-box">
                <img className="main-img" src={displayProduct.mainImg} alt={displayProduct.name} />
                <img className="hover-img" src={previewProduct ? displayProduct.mainImg : cate.hoverImg} alt={displayProduct.name} />
                {badgeItems.length > 0 && (
                    <div className="badge-wrap">
                        {badgeItems.map((badge) => (
                            <span
                                key={badge.key}
                                className={`badge ${badge.type === 'discount' ? 'discount-badge' : ''} ${badge.type === 'soldout' ? 'soldout-badge' : ''}`}
                            >
                                {badge.label}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <div className="text-box">
                <p className="brand-name">MATIN KIM</p>
                <h3>{cate.name}</h3>
                <div className="price-wrap">
                    {cate.discountRate > 0 ? (
                        <>
                            <span className="discount-rate">{cate.discountRate}%</span>
                            <strong className="discount-price">{cate.discountPrice.toLocaleString()}</strong>
                            <span className="price">{cate.price.toLocaleString()}</span>
                        </>
                    ) : (
                        <strong className="discount-price">{cate.price.toLocaleString()}</strong>
                    )}
                </div>
            </div>
            <div className="color-wrap" onMouseLeave={() => setPreviewProduct(null)}>
                {colorVariants.map((variant, id) => {
                    const color = variant.colors?.[0];
                    if (!color) return null;

                    return (
                    <span
                        key={`${variant.id}-${color}-${id}`}
                        className="color-chip"
                        style={getColorStyle(color)}
                        aria-label={color}
                        title={color}
                        onMouseEnter={() => setPreviewProduct(variant)}
                    ></span>
                    );
                })}
            </div>
            {Array.isArray(cate.sizes) && cate.sizes.length > 0 && (
                <div className="card-size-list" aria-label={`${cate.name} 사이즈 목록`}>
                    {cate.sizes.filter(Boolean).map((size, index) => (
                        <span
                            key={`${cate.id}-${size}-${index}`}
                            className={cate.soldout?.[index] ? 'is-soldout' : ''}
                        >
                            {size}
                        </span>
                    ))}
                </div>
            )}
            <div
                className="card-action-bar"
                aria-label={`${cate.name} 빠른 메뉴`}
                onClick={handleActionClick}
                onKeyDown={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    className={`card-like-btn ${isLiked ? 'is-active' : ''}`}
                    onClick={handleToggleLike}
                    aria-label="찜하기"
                >
                    <img
                        src={isLiked ? "/images/pages-icon/like-hover-icon.svg" : "/images/pages-icon/like-icon.svg"}
                        alt=""
                        aria-hidden="true"
                    />
                </button>
                <button
                    type="button"
                    className="card-action-btn"
                    onClick={handleAddCart}
                    disabled={isSoldOut}
                >
                    장바구니
                </button>
                <button
                    type="button"
                    className="card-action-btn"
                    onClick={handleBuyNow}
                >
                    구매하기
                </button>
            </div>
        </li>
    )
}
