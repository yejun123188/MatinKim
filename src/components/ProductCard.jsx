import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore'
import { useAuthStore } from '../store/useAuthStore';

const getProductBaseName = (item) => {
    if (!item?.name) return '';

    const primaryColor = item.colors?.[0];
    const colorSuffix = primaryColor ? ` IN ${primaryColor}` : '';

    return colorSuffix && item.name.endsWith(colorSuffix)
        ? item.name.slice(0, -colorSuffix.length)
        : item.name;
};

export default function ProductCard({ cate, as: CardTag = 'li', className = '' }) {
    const {
        items,
        onColorCode,
        onAddCart,
        openCart,
        wishList,
        onAddWishList,
        onRemoveWish,
        onLoadWishList
    } = useProductStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [previewProduct, setPreviewProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(cate.colors?.[0] || '');
    const [selectedSize, setSelectedSize] = useState(() => {
        const availableSizeIndex = Array.isArray(cate.sizes)
            ? cate.sizes.findIndex((size, index) => size && !cate.soldout?.[index])
            : -1;
        return availableSizeIndex >= 0 ? cate.sizes[availableSizeIndex] : cate.sizes?.[0] || '';
    });
    const displayProduct = previewProduct || cate;
    const isSoldOut = Array.isArray(cate.soldout) && cate.soldout.length > 0 && cate.soldout.every(Boolean);
    const colorVariants = useMemo(() => {
        const baseName = getProductBaseName(cate);
        const variants = items.filter((item) => getProductBaseName(item) === baseName && item.colors?.[0]);

        // Sort variants based on the order of cate.colors
        const sortedVariants = cate.colors?.map(color => variants.find(v => v.colors?.[0] === color)).filter(Boolean) || [];

        return sortedVariants.length > 0 ? sortedVariants : [cate];
    }, [items, cate]);
    const selectedVariant = colorVariants.find(v => v.colors?.[0] === selectedColor) || cate;
    const wishKey = `${selectedVariant.id}-${selectedSize}-${selectedColor}`;
    const isLiked = wishList.some((wish) => wish.key === wishKey);
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

    useEffect(() => {
        if (user?.uid) {
            onLoadWishList(user.uid);
        }
    }, [user?.uid, onLoadWishList]);

    const handleActionClick = (event) => {
        event.stopPropagation();
    };

    const handleToggleLike = async (event) => {
        handleActionClick(event);

        if (!user?.uid) {
            alert("로그인 후 이용 가능합니다.");
            navigate("/login");
            return;
        }

        if (isLiked) {
            const ok = window.confirm("위시리스트에서 상품을 취소하겠습니까?");
            if (!ok) return;

            await onRemoveWish(wishKey, user.uid);
            return;
        }

        await onAddWishList({
            id: selectedVariant.id,
            name: selectedVariant.name,
            price: selectedVariant.price,
            discountPrice: selectedVariant.discountPrice,
            discountRate: selectedVariant.discountRate,
            mainImg: selectedVariant.mainImg,
            hoverImg: selectedVariant.hoverImg,
            selectedSize,
            selectedColor,
            quantity: 1,
            key: wishKey,
            category1: selectedVariant.category1,
            category2: selectedVariant.category2,
            isSoldOut,
        }, user.uid);

        alert("위시리스트에 상품이 담겼습니다");
    };

    const handleAddCart = (event) => {
        handleActionClick(event);
        if (isSoldOut) return;

        const cartPrice = selectedVariant.discountRate > 0 ? selectedVariant.discountPrice : selectedVariant.price;

        onAddCart({
            id: selectedVariant.id,
            name: selectedVariant.name,
            price: cartPrice,
            size: selectedSize,
            color: selectedColor,
            count: 1,
            image: selectedVariant.mainImg || selectedVariant.hoverImg,
            key: `${selectedVariant.id}-${selectedSize}-${selectedColor}`
        });
        openCart();
    };

    const handleBuyNow = (event) => {
        handleActionClick(event);
        const salePrice = selectedVariant.discountRate > 0 ? selectedVariant.discountPrice : selectedVariant.price;
        navigate('/payment', {
            state: {
                orderItems: [{
                    id: selectedVariant.id,
                    name: selectedVariant.name,
                    price: salePrice,
                    size: selectedSize,
                    color: selectedColor,
                    quantity: 1,
                    image: selectedVariant.mainImg || selectedVariant.hoverImg
                }]
            }
        });
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleMoveDetail();
        }
    };

    return (
        <CardTag
            className={`product-card${className ? ` ${className}` : ''}`}
            onKeyDown={handleKeyDown}
            role="link"
            tabIndex={0}
            aria-label={`${cate.name} 상세페이지 이동`}
        >
            <div className="img-box" onClick={handleMoveDetail}>
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
                            className={`color-chip ${selectedColor === color ? 'selected' : ''}`}
                            style={getColorStyle(color)}
                            aria-label={color}
                            title={color}
                            onMouseEnter={() => setPreviewProduct(variant)}
                            onClick={(event) => {
                                event.stopPropagation();
                                setSelectedColor(color);
                            }}
                        ></span>
                    );
                })}
            </div>
            {Array.isArray(cate.sizes) && cate.sizes.length > 0 && (
                <div className="card-size-list" aria-label={`${cate.name} 사이즈 목록`}>
                    {cate.sizes.filter(Boolean).map((size, index) => (
                        <span
                            key={`${cate.id}-${size}-${index}`}
                            className={`${cate.soldout?.[index] ? 'is-soldout' : ''} ${selectedSize === size ? 'selected' : ''}`}
                            onClick={(event) => {
                                event.stopPropagation();
                                if (!cate.soldout?.[index]) setSelectedSize(size);
                            }}
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
        </CardTag>
    )
}
