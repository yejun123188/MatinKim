import React, { useState } from "react";
import "./scss/Cart.scss";
import { useProductStore } from "../store/useProductStore";
import { useNavigate } from "react-router-dom";

export default function Cart({ onClose }) {
    const { cartItem, onUpdateQuantity, onRemoveItem, onUpdateOption } = useProductStore();
    const navigate = useNavigate();

    const [checkedItems, setCheckedItems] = useState([]);
    // 옵션변경 중인 아이템 key
    const [editingKey, setEditingKey] = useState(null);
    // 변경 중인 옵션 임시 값
    const [tempOption, setTempOption] = useState({ size: "", color: "" });

    const items = cartItem;
    const formatPrice = (price) => `₩${price.toLocaleString()}`;

    const allChecked = items.length > 0 && checkedItems.length === items.length;

    const handleAllCheck = () => {
        if (allChecked) {
            setCheckedItems([]);
        } else {
            setCheckedItems(items.map((item) => item.key));
        }
    };

    const handleItemCheck = (item) => {
        setCheckedItems((prev) =>
            prev.includes(item.key)
                ? prev.filter((v) => v !== item.key)
                : [...prev, item.key]
        );
    };

    const selectedItems = items.filter((item) => checkedItems.includes(item.key));

    const productTotal = selectedItems.reduce(
        (sum, item) => sum + item.price * item.count,
        0
    );

    const handleSubmit = () => {
        if (selectedItems.length === 0) {
            alert("상품을 선택해주세요");
            return;
        }
        navigate("/payment", {
            state: {
                orderItems: selectedItems.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.count,
                    option: `${item.color} / ${item.size}`,
                    image: item.image,
                })),
            },
        });
        onClose();
    };

    // 옵션변경 열기
    const handleOpenEdit = (item) => {
        setEditingKey(item.key);
        setTempOption({ size: item.size, color: item.color });
    };

    // 옵션변경 저장
    const handleSaveOption = (item) => {
        if (!tempOption.size || !tempOption.color) {
            alert("사이즈와 컬러를 모두 선택해주세요.");
            return;
        }
        // 같은 옵션이면 그냥 닫기
        if (tempOption.size === item.size && tempOption.color === item.color) {
            setEditingKey(null);
            return;
        }
        // 이미 동일 옵션 상품이 있으면 중복 방지
        const newKey = `${item.id}-${tempOption.size}-${tempOption.color}`;
        const isDuplicate = items.some((i) => i.key === newKey && i.key !== item.key);
        if (isDuplicate) {
            alert("이미 동일한 옵션의 상품이 장바구니에 있습니다.");
            return;
        }
        onUpdateOption(item.key, tempOption);
        setEditingKey(null);
    };

    const shippingFee = 0;
    const totalPayment = productTotal + shippingFee;

    return (
        <section className="cart-panel">
            <div className="cart-dim" onClick={onClose}></div>

            <div className="cart-panel-inner">
                <div className="cart-header">
                    <h2>Shopping Bag</h2>
                    <button className="close-btn" type="button" onClick={onClose}>
                        <img src="/images/sub-cart/x-icon.svg" alt="x버튼" />
                    </button>
                </div>

                {items.length === 0 ? (
                    <p className="cart-empty">쇼핑백이 비어있습니다</p>
                ) : (
                    <div>
                        <div className="cart-select-row">
                            <label className="check-wrap">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={handleAllCheck}
                                />
                                <span>전체선택 ({selectedItems.length})</span>
                            </label>
                            <button
                                className="delete-selected-btn"
                                type="button"
                                onClick={() => {
                                    selectedItems.forEach((item) => onRemoveItem(item.id, item.size));
                                    setCheckedItems([]);
                                }}
                            >
                                선택삭제
                            </button>
                        </div>

                        <div className="cart-list">
                            {items.map((item) => {
                                const isChecked = checkedItems.includes(item.key);
                                const isEditing = editingKey === item.key;

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
                                                <img src={item.image} alt={item.name} />
                                            </div>

                                            <div className="item-info">
                                                <h3>{item.name}</h3>

                                                {/* 옵션변경 토글 영역 */}
                                                {isEditing ? (
                                                    <div className="option-edit-box">
                                                        <div className="option-edit-row">
                                                            <label>컬러</label>
                                                            <input
                                                                type="text"
                                                                value={tempOption.color}
                                                                onChange={(e) =>
                                                                    setTempOption((prev) => ({ ...prev, color: e.target.value }))
                                                                }
                                                                placeholder="컬러 입력"
                                                            />
                                                        </div>
                                                        <div className="option-edit-row">
                                                            <label>사이즈</label>
                                                            <input
                                                                type="text"
                                                                value={tempOption.size}
                                                                onChange={(e) =>
                                                                    setTempOption((prev) => ({ ...prev, size: e.target.value }))
                                                                }
                                                                placeholder="사이즈 입력"
                                                            />
                                                        </div>
                                                        <div className="option-edit-btns">
                                                            <button type="button" onClick={() => handleSaveOption(item)}>
                                                                저장
                                                            </button>
                                                            <button type="button" onClick={() => setEditingKey(null)}>
                                                                취소
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <span
                                                            className="option-change-btn"
                                                            onClick={() => handleOpenEdit(item)}
                                                        >
                                                            옵션변경
                                                        </span>
                                                        <p className="item-option">
                                                            색상: {item.color} · 사이즈: {item.size}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="item-qty">
                                                    <button
                                                        type="button"
                                                        onClick={() => onUpdateQuantity(item.key, "minus")}
                                                    >
                                                        −
                                                    </button>
                                                    <span>{item.count}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => onUpdateQuantity(item.key, "plus")}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    className="remove-btn"
                                                    type="button"
                                                    onClick={() => onRemoveItem(item.id, item.size)}
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
        </section>
    );
}