import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./scss/OrderComplete.scss";
import { ORDER_MENU } from "../utils/orderStorage";

const formatPrice = (value) => `₩${value.toLocaleString()}`;

export default function OrderComplete() {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state?.orderNumber) {
        return (
            <main className="order-complete-empty">
                <p>잘못된 접근입니다.</p>
                <button onClick={() => navigate("/")}>홈으로</button>
            </main>
        );
    }

    const { orderNumber, orderItems, finalTotal, shippingInfo, payment, isGuest } = state;

    return (
        <main className="order-complete-page">

            {/* 완료 헤더 */}
            <div className="complete-header">
                <h1>주문이 완료되었습니다</h1>
                <p>주문해 주셔서 감사합니다</p>
            </div>

            {/* 주문번호 */}
            <div className="complete-order-number">
                <p className="label">주문번호</p>
                <strong>{orderNumber}</strong>
                {isGuest && (
                    <div className="guest-notice">
                        ⚠️ 비회원 주문입니다. 위 주문번호를 꼭 저장해 주세요.<br />
                        주문번호와 주문자 이름으로 <strong>비회원 주문조회</strong>가 가능합니다.
                    </div>
                )}
            </div>

            {/* 배송지 정보 */}
            <div className="complete-section">
                <h2>배송지 정보</h2>
                <div className="complete-info-list">
                    <p><strong>받는 분:</strong> {shippingInfo.receiver}</p>
                    <p><strong>연락처:</strong> {shippingInfo.mobile1}-{shippingInfo.mobile2}-{shippingInfo.mobile3}</p>
                    <p><strong>주소:</strong> {shippingInfo.address} {shippingInfo.detail}</p>
                </div>
            </div>

            {/* 주문 상품 */}
            <div className="complete-section">
                <h2>주문 상품</h2>
                <ul className="complete-item-list">
                    {orderItems.map((item) => (
                        <li key={item.id} className="complete-item">
                            <div className="complete-item-image">
                                <img src={item.image || item.mainImg || item.hoverImg} alt="" />
                            </div>
                            <div className="complete-item-info">
                                <p className="complete-item-name">{item.name}</p>
                                <p className="complete-item-option">{item.option} / 수량 {item.quantity}</p>
                            </div>
                            <strong>{formatPrice(item.price * item.quantity)}</strong>
                        </li>
                    ))}
                </ul>
                <div className="complete-total">
                    <span>총 결제금액</span>
                    <strong>{formatPrice(finalTotal)}</strong>
                </div>
                <p className="complete-payment">결제수단: {payment}</p>
            </div>

            {/* 버튼 */}
            <div className="complete-btn-group">
                {isGuest ? (
                    <button className="btn-dark-go" onClick={() => navigate("/order-lookup")}>
                        비회원 주문조회
                    </button>
                ) : (
                    <button className="btn-dark-go" onClick={() => navigate("/userInfo?menu=orders", { state: { menu: ORDER_MENU } })}>
                        주문내역 보기
                    </button>
                )}
                <button className="btn-outline-go" onClick={() => navigate("/")}>
                    계속 쇼핑하기
                </button>
            </div>
        </main>
    );
}
