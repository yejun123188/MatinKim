import React, { useMemo, useState } from "react";
import "./scss/Cart.scss";
import { useProductStore } from "../store/useProductStore";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useLoginStore } from "../store/useLoginStore";
import Login from "./Login";

// ProductDetail과 동일한 베이스명 추출 로직
const getProductBaseName = (item) => {
    if (!item?.name) return "";
    const primaryColor = item.colors?.[0];
    const colorSuffix = primaryColor ? ` IN ${primaryColor}` : "";
    return colorSuffix && item.name.endsWith(colorSuffix)
        ? item.name.slice(0, -colorSuffix.length)
        : item.name;
};

// 해당 상품의 모든 사이즈가 품절인지 확인
const isAllSoldOut = (product) => {
    if (!product?.soldout?.length) return false;
    return product.soldout.every(Boolean);
};

export default function Cart({ onClose }) {
    const { cartItem, items, onUpdateQuantity, onRemoveItem, onUpdateOption } = useProductStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const { openLogin } = useLoginStore();

    const [checkedItems, setCheckedItems] = useState([]);
    const [editingKey, setEditingKey] = useState(null);
    const [tempOption, setTempOption] = useState({ size: "", color: "" });
    // 편집 중 미리보기: 이름·이미지
    const [previewName, setPreviewName] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [pendingOrderItems, setPendingOrderItems] = useState([]);

    const cartItems = cartItem;
    const formatPrice = (price) => `₩${price.toLocaleString()}`;

    const allChecked = cartItems.length > 0 && checkedItems.length === cartItems.length;

    const handleAllCheck = () => {
        setCheckedItems(allChecked ? [] : cartItems.map((item) => item.key));
    };

    const handleItemCheck = (item) => {
        setCheckedItems((prev) =>
            prev.includes(item.key) ? prev.filter((v) => v !== item.key) : [...prev, item.key]
        );
    };

    const selectedItems = cartItems.filter((item) => checkedItems.includes(item.key));
    const productTotal = selectedItems.reduce((sum, item) => sum + item.price * item.count, 0);
    const shippingFee = 0;
    const totalPayment = productTotal + shippingFee;

    const handleSubmit = () => {
        if (selectedItems.length === 0) {
            alert("상품을 선택해주세요");
            return;
        }


        const orderItems = selectedItems.map((item) => ({
            id: item.id,
            key: item.key,  // ← 이 줄 추가
            name: item.name,
            price: item.price,
            quantity: item.count,
            option: `${item.color} / ${item.size}`,
            image: item.image,
        }));
        if (!user) {
            openLogin(orderItems);
            onClose();
            return;
        }
        navigate("/payment", { state: { orderItems } });
        onClose();
    };

    // 각 장바구니 상품 ID별 colorProductMap (ProductDetail과 동일)
    const colorProductMapByCartItem = useMemo(() => {
        const result = {};
        cartItems.forEach((cartItem) => {
            if (result[cartItem.id]) return;
            const productData = items.find((p) => p.id === cartItem.id);
            if (!productData) return;
            const baseName = getProductBaseName(productData);
            result[cartItem.id] = items.reduce((acc, item) => {
                if (getProductBaseName(item) !== baseName) return acc;
                const primary = item.colors?.[0];
                if (primary) acc[primary] = item;
                return acc;
            }, {});
        });
        return result;
    }, [cartItems, items]);

    // 옵션변경 열기
    const handleOpenEdit = (item) => {
        setEditingKey(item.key);
        setTempOption({ size: item.size, color: item.color });
        setPreviewImage(item.image);
        setPreviewName(item.name);
    };

    // 색상 변경 → 이름·이미지 미리보기 동시 업데이트
    const handleColorChange = (cartItemData, color) => {
        const colorMap = colorProductMapByCartItem[cartItemData.id] || {};
        const targetProduct = colorMap[color];

        setTempOption((prev) => ({ ...prev, color }));
        if (targetProduct?.mainImg) setPreviewImage(targetProduct.mainImg);
        if (targetProduct?.name) setPreviewName(targetProduct.name);

        // 색상 변경 시 사이즈도 첫 번째 가능한 사이즈로 리셋
        const allSizes = targetProduct?.sizes || [];
        const soldout = targetProduct?.soldout || [];
        const firstAvailable = allSizes.find((_, idx) => !soldout[idx]);
        if (firstAvailable) setTempOption({ color, size: firstAvailable });
    };

    // 옵션 저장
    const handleSaveOption = (item) => {
        if (!tempOption.size || !tempOption.color) {
            alert("사이즈와 컬러를 모두 선택해주세요.");
            return;
        }
        if (tempOption.size === item.size && tempOption.color === item.color) {
            setEditingKey(null);
            setPreviewImage(null);
            setPreviewName(null);
            return;
        }
        const colorMap = colorProductMapByCartItem[item.id] || {};
        const targetProduct = colorMap[tempOption.color];
        const newId = targetProduct?.id || item.id;
        const newKey = `${newId}-${tempOption.size}-${tempOption.color}`;
        if (cartItems.some((i) => i.key === newKey && i.key !== item.key)) {
            alert("이미 동일한 옵션의 상품이 장바구니에 있습니다.");
            return;
        }
        onUpdateOption(item.key, tempOption);
        setEditingKey(null);
        setPreviewImage(null);
        setPreviewName(null);
    };

    const handleCancelEdit = () => {
        setEditingKey(null);
        setPreviewImage(null);
        setPreviewName(null);
    };

    return (
        <section className="cart-panel">
            <div className="cart-dim" onClick={onClose}></div>

            <div className="cart-panel-inner">
                <div className="cart-header">
                    <h2>SHOPPING BAG</h2>
                    <button className="close-btn" type="button" onClick={onClose}>
                        <img src="/images/sub-cart/x-icon.svg" alt="x버튼" />
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <p className="cart-empty">쇼핑백이 비어있습니다</p>
                ) : (
                    <div>
                        <div className="cart-select-row">
                            <label className="check-wrap">
                                <input type="checkbox" checked={allChecked} onChange={handleAllCheck} />
                                <span>전체선택 ({selectedItems.length})</span>
                            </label>
                            <button
                                className="delete-selected-btn"
                                type="button"
                                onClick={() => {
                                    selectedItems.forEach((item) => onRemoveItem(item.key));
                                    setCheckedItems([]);
                                }}
                            >
                                선택삭제
                            </button>
                        </div>

                        <div className="cart-list">
                            {cartItems.map((item) => {
                                const isChecked = checkedItems.includes(item.key);
                                const isEditing = editingKey === item.key;
                                const colorMap = colorProductMapByCartItem[item.id] || {};
                                const productData = items.find((p) => p.id === item.id);

                                // 색상 목록: colorMap 키 기준, 모든 사이즈 품절인 색상은 disabled
                                const availableColors = (productData?.colors || [item.color]).filter(
                                    (c) => colorMap[c] // colorMap에 없는 색상은 아예 제외
                                );

                                // 현재 선택된 색상의 상품 기준으로 사이즈 목록 결정
                                const targetProductForSize = colorMap[tempOption.color] || productData;
                                const allSizes = targetProductForSize?.sizes || [item.size];
                                const soldoutFlags = targetProductForSize?.soldout || [];

                                // 썸네일·이름: 편집 중이면 미리보기, 아니면 저장값
                                const displayImage = isEditing && previewImage ? previewImage : item.image;
                                const displayName = isEditing && previewName ? previewName : item.name;

                                return (
                                    <div className="cart-item" key={item.key}>
                                        <div className="item-left">
                                            <label className="check-wrap item-check">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => handleItemCheck(item)}
                                                />
                                            </label>

                                            <div className="item-thumb">
                                                <img src={displayImage} alt={displayName} />
                                            </div>

                                            <div className="item-info">
                                                {/* 이름: 색상 변경 시 실시간 미리보기 */}
                                                <h3>{displayName}</h3>

                                                {isEditing ? (
                                                    <div className="option-edit-box">
                                                        <div className="option-edit-row">
                                                            <label>컬러</label>
                                                            <select
                                                                value={tempOption.color}
                                                                onChange={(e) => handleColorChange(item, e.target.value)}
                                                            >
                                                                {availableColors.map((color) => {
                                                                    const colorProduct = colorMap[color];
                                                                    // 해당 색상 상품의 모든 사이즈가 품절이면 disabled
                                                                    const soldOut = isAllSoldOut(colorProduct);
                                                                    return (
                                                                        <option key={color} value={color} disabled={soldOut}>
                                                                            {color}{soldOut ? " (품절)" : ""}
                                                                        </option>
                                                                    );
                                                                })}
                                                            </select>
                                                        </div>
                                                        <div className="option-edit-row">
                                                            <label>사이즈</label>
                                                            <select
                                                                value={tempOption.size}
                                                                onChange={(e) =>
                                                                    setTempOption((prev) => ({ ...prev, size: e.target.value }))
                                                                }
                                                            >
                                                                {allSizes.map((size, idx) => {
                                                                    const soldOut = Boolean(soldoutFlags[idx]);
                                                                    return (
                                                                        <option key={size} value={size} disabled={soldOut}>
                                                                            {size}{soldOut ? " (품절)" : ""}
                                                                        </option>
                                                                    );
                                                                })}
                                                            </select>
                                                        </div>
                                                        <div className="option-edit-btns">
                                                            <button type="button" onClick={() => handleSaveOption(item)}>저장</button>
                                                            <button type="button" onClick={handleCancelEdit}>취소</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="change">
                                                        <span className="option-change-btn" onClick={() => handleOpenEdit(item)}>
                                                            옵션변경
                                                        </span>
                                                        <p className="item-option">
                                                            색상: {item.color} · 사이즈: {item.size}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="item-qty">
                                                    <button type="button" onClick={() => onUpdateQuantity(item.key, "minus")}>−</button>
                                                    <span>{item.count}</span>
                                                    <button type="button" onClick={() => onUpdateQuantity(item.key, "plus")}>+</button>
                                                </div>

                                                <button
                                                    className="remove-btn"
                                                    type="button"
                                                    onClick={() => onRemoveItem(item.key)}
                                                >
                                                    REMOVE
                                                </button>
                                            </div>
                                        </div>

                                        <div className="item-price">
                                            {formatPrice(item.price * item.count)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="cart-summary">
                            <div className="summary-row">
                                <span>상품금액</span>
                                <span>{productTotal.toLocaleString()}</span>
                            </div>
                            <div className="summary-row">
                                <span>배송비</span>
                                <span>{shippingFee.toLocaleString()}</span>
                            </div>
                            <div className="summary-row total">
                                <span>총 결제금액</span>
                                <strong>{totalPayment.toLocaleString()}</strong>
                            </div>
                        </div>

                        <button className="order-btn" type="button" onClick={handleSubmit}>
                            선택상품 주문
                        </button>
                    </div>
                )}
            </div>

            {showLogin && (
                <Login
                    onClose={() => {
                        setShowLogin(false);
                        setPendingOrderItems([]);
                    }}
                    guestMode={true}
                    guestOrderItems={pendingOrderItems}
                />
            )}
        </section>
    );
}
