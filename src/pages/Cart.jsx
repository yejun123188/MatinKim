import React, { useState, useMemo } from "react";
import "./scss/Cart.scss";
import { useProductStore } from "../store/useProductStore";

export default function Cart({ onClose }) {
    const { cartItem, onUpdateQuantity, onRemoveItem } = useProductStore();


    const [checkedItems, setCheckedItems] = useState([]);

    const items = cartItem;

    const formatPrice = (price) => `₩${price.toLocaleString()}`;

    // 전체 선택 여부
    const allChecked = items.length > 0 && checkedItems.length === items.length;

    // 전체 선택
    const handleAllCheck = () => {
        if (allChecked) {
            setCheckedItems([]);
        } else {
            setCheckedItems(items.map((item) => `${item.id}-${item.size}`));
        }
    };

    // 개별 선택
    const handleItemCheck = (item) => {
        const key = `${item.id}-${item.size}`;

        setCheckedItems((prev) =>
            prev.includes(key)
                ? prev.filter((v) => v !== key)
                : [...prev, key]
        );
    };

    // 선택된 아이템
    const selectedItems = items.filter((item) =>
        checkedItems.includes(`${item.id}-${item.size}`)
    );

    // 총 금액
    const productTotal = selectedItems.reduce(
        (sum, item) => sum + item.price * item.count,
        0
    );

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
                                    selectedItems.forEach((item) =>
                                        onRemoveItem(item.id, item.size)
                                    );
                                    setCheckedItems([]);
                                }}
                            >
                                선택삭제
                            </button>
                        </div>

                        <div className="cart-list">
                            {items.map((item) => {
                                const key = `${item.id}-${item.size}`;
                                const isChecked = checkedItems.includes(key);

                                return (
                                    <div className="cart-item" key={key}>
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
                                                <p className="item-option">
                                                    색상: {item.color} · 사이즈: {item.size}
                                                </p>

                                                <div className="item-qty">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onUpdateQuantity(item.key, "minus")
                                                        }
                                                    >
                                                        −
                                                    </button>
                                                    <span>{item.count}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onUpdateQuantity(item.key, "plus")
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    className="remove-btn"
                                                    type="button"
                                                    onClick={() =>
                                                        onRemoveItem(item.id, item.size)
                                                    }
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

                        <button className="order-btn" type="button">
                            선택상품 주문
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}