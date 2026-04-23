import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore'

export default function ProductCard({ cate }) {
    const { onColorCode } = useProductStore();
    const navigate = useNavigate();
    const isSoldOut = Array.isArray(cate.soldout) && cate.soldout.length > 0 && cate.soldout.every(Boolean);
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
                <img className="main-img" src={cate.mainImg} alt={cate.name} />
                <img className="hover-img" src={cate.hoverImg} alt={cate.name} />
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
                <div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <div className="text-box">
                <h3>{cate.name}</h3>
                <div className="price-wrap">
                    {cate.discountRate > 0 ? (
                        <>
                            <strong className="discount-price">{cate.discountPrice.toLocaleString()}원</strong>
                            <span className="price">{cate.price.toLocaleString()}원</span>
                            <span className="discount-rate">{cate.discountRate}%</span>
                        </>
                    ) : (
                        <strong className="discount-price">{cate.price.toLocaleString()}원</strong>
                    )}
                </div>
            </div>
            <div className="color-wrap">
                {cate.colors.map((color, id) => (
                    <span
                        key={`${cate.id}-${color}-${id}`}
                        className="color-chip"
                        style={getColorStyle(color)}
                        aria-label={color}
                        title={color}
                    ></span>
                ))}
            </div>
        </li>
    )
}
