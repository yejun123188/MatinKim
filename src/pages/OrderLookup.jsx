import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { lookupGuestOrder } from "../store/orderStorage";
import "./scss/OrderLookup.scss";

const formatPrice = (value) => `₩${value.toLocaleString()}`;

export default function OrderLookup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ orderNumber: "", name: "" });
    const [errors, setErrors] = useState({});
    const [result, setResult] = useState(null);
    const [notFound, setNotFound] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
        setNotFound(false);
    };

    const handleLookup = () => {
        const newErrors = {};
        if (!form.orderNumber.trim()) newErrors.orderNumber = "주문번호를 입력해주세요";
        if (!form.name.trim()) newErrors.name = "주문자 이름을 입력해주세요";

        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return;
        }

        const order = lookupGuestOrder(form.orderNumber.trim(), form.name.trim());
        if (order) {
            setResult(order);
            setNotFound(false);
        } else {
            setResult(null);
            setNotFound(true);
        }
    };

    return (
        <main className="order-lookup-page">
            <div className="guest-order-header">
                <h2>Welcome At Matin Kim</h2>
            </div>
            <h1>비회원 주문조회</h1>
            <p className="lookup-desc">주문번호와 주문자 이름을 입력하면 주문 내역을 확인할 수 있습니다</p>


            {/* 조회 실패 */}
            {notFound && (
                <div className="lookup-not-found">
                    일치하는 주문 정보를 찾을 수 없습니다.<br />
                    주문번호와 이름을 다시 확인해주세요.
                </div>
            )}

            {/* 조회 결과 */}
            {result && (
                <div className="lookup-result">
                    {/* 주문번호 + 상태 */}
                    <div className="result-header">
                        <div className="result-number">
                            <p>주문번호:</p>
                            <strong>{result.orderNumber}</strong>
                        </div>
                        <span className="result-state">{result.state}</span>
                    </div>
                    <p className="result-date">
                        주문일시: {new Date(result.createdAt).toLocaleString("ko-KR")}
                    </p>

                    {/* 배송지 */}
                    <div className="result-section">
                        <h3>배송지 정보</h3>
                        <div className="result-info">
                            <p><strong>받는 분:</strong> {result.name}</p>
                            <p><strong>연락처:</strong> {result.phone}</p>
                            <p><strong>주소:</strong> {result.address}</p>
                        </div>
                    </div>

                    {/* 주문 상품 */}
                    <div className="result-section">
                        <h3>주문 상품</h3>
                        <ul className="result-item-list">
                            {result.orders.map((item) => (
                                <li key={item.id} className="result-item">
                                    <div className="complete-item-image">
                                        <img src={item.img || item.mainImg || item.hoverImg} alt="" />
                                    </div>
                                    <div>
                                        <p className="result-item-name">{item.name}</p>
                                        <p className="result-item-option">{item.size} / 수량 {item.count}</p>
                                    </div>
                                    <strong>{formatPrice(item.price * item.count)}</strong>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 결제 정보 */}
                    <div className="result-payment">
                        <div className="result-total">
                            <h3>총 결제금액</h3>
                            <strong>{formatPrice(result.orders.reduce((s, i) => s + i.price * i.count, 0) + result.deliveryCost)}</strong>
                        </div>
                        <p className="result-method">결제수단: {result.payment}</p>
                    </div>
                </div>
            )}


            {/* 입력 폼 */}
            <div className="lookup-form">
                <div className="lookup-field">
                    <label>주문번호 <em>*</em></label>
                    <input
                        name="orderNumber"
                        value={form.orderNumber}
                        onChange={handleChange}
                        placeholder="예) 20260507-1234-5678"
                        className={errors.orderNumber ? "is-error" : ""}
                    />
                    {errors.orderNumber && <p className="error-text">{errors.orderNumber}</p>}
                </div>

                <div className="lookup-field">
                    <label>주문자 이름 <em>*</em></label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="주문 시 입력한 이름"
                        className={errors.name ? "is-error" : ""}
                    />
                    {errors.name && <p className="error-text">{errors.name}</p>}
                </div>
            </div>

            <button className="btn-dark-go" onClick={handleLookup}>주문 조회하기</button>


            <button className="btn-outline-go" onClick={() => navigate("/")}>홈으로 돌아가기</button>
            {/* <div className="guest-order-notice">
                <h4>안내사항</h4>
                <p>
                    비회원 고객께서 구매하신 경우에만 주문/배송 상태를 확인할 수
                    있습니다.
                    <br />
                    주문자명과 주문번호 입력 후 조회하기 버튼을 누르시면 주문내역을
                    확인할 수 있습니다.
                </p>
            </div> */}
        </main>
    );
}