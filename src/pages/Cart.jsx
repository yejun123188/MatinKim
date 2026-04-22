import React, { useState } from "react";
import "./scss/Cart.scss";

export default function Cart({ onClose }) {
    const [items, setItems] = useState([
        {
            id: 1,
            name: "BACK LOGO HOODY WINDBREAKER FOR WOMEN IN DARK BROWN",
            color: "블랙",
            size: "M",
            price: 142200,
            quantity: 1,
            checked: true,
            image: "/images/sub-cart/clothes-mini.jpg",
        },
        {
            id: 2,
            name: "MATIN STITCH DENIM ECOBAG IN SKY",
            color: "SKY",
            size: "FREE",
            price: 52200,
            quantity: 1,
            checked: true,
            image: "/images/sub-cart/clothes-mini2.jpg",
        },

    ]);

    const [allChecked, setAllChecked] = useState(true);

    const formatPrice = (price) => `₩${price.toLocaleString()}`;

    const handleAllCheck = () => {
        const next = !allChecked;
        setAllChecked(next);
        setItems((prev) => prev.map((item) => ({ ...item, checked: next })));
    };

    const handleItemCheck = (id) => {
        const updated = items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
        );
        setItems(updated);
        setAllChecked(updated.length > 0 && updated.every((item) => item.checked));
    };

    const handleQuantity = (id, type) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item;

                if (type === "minus" && item.quantity > 1) {
                    return { ...item, quantity: item.quantity - 1 };
                }

                if (type === "plus") {
                    return { ...item, quantity: item.quantity + 1 };
                }

                return item;
            })
        );
    };

    const handleRemove = (id) => {
        const updated = items.filter((item) => item.id !== id);
        setItems(updated);
        setAllChecked(updated.length > 0 && updated.every((item) => item.checked));
    };

    const handleSelectedRemove = () => {
        const updated = items.filter((item) => !item.checked);
        setItems(updated);
        setAllChecked(false);

    };

    const selectedItems = items.filter((item) => item.checked);

    const productTotal = selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
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

                {items.length === 0 ? (<p className="cart-empty">쇼핑백이 비어있습니다</p>) : (
                    <div>
                        <div className="cart-select-row">
                            <label className="check-wrap">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={handleAllCheck}
                                />
                                <img src={allChecked ? "/images/sub-cart/check-icon-active.svg" : "/images/sub-cart/check-icon.svg"} alt="" />
                                <span>전체선택 ({selectedItems.length})</span>
                            </label>

                            <button
                                className="delete-selected-btn"
                                type="button"
                                onClick={handleSelectedRemove}
                            >
                                선택삭제
                            </button>
                        </div>

                        <div className="cart-list">
                            {items.map((item) => (
                                <div className="cart-item" key={item.id}>
                                    <div className="item-left">
                                        <label className="check-wrap item-check">
                                            <input
                                                type="checkbox"
                                                checked={item.checked}
                                                onChange={() => handleItemCheck(item.id)}
                                            />
                                            <img src={item.checked ? "/images/sub-cart/check-icon-active.svg" : "/images/sub-cart/check-icon.svg"} alt="" />

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
                                                    onClick={() => handleQuantity(item.id, "minus")}
                                                >
                                                    −
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuantity(item.id, "plus")}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                className="remove-btn"
                                                type="button"
                                                onClick={() => handleRemove(item.id)}
                                            >
                                                REMOVE
                                            </button>
                                        </div>
                                    </div>

                                    <div className="item-price">
                                        {formatPrice(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
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