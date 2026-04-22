import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import "./scss/Payment.scss";

const PAYMENT_METHODS = [
    {
        id: "card",
        title: "신용카드 / 체크카드",
        description: "안전한 결제를 위해 Stripe로 처리됩니다",
        badges: ["VISA", "MC", "AMEX"]
    },
    {
        id: "tosspay",
        title: "토스페이",
        description: "토스페이로 빠르고 간편하게 결제"
    },
    {
        id: "kakaopay",
        title: "카카오페이(간편결제)",
        description: "카카오페이 인증으로 간편하게 결제"
    },
    {
        id: "mobile",
        title: "휴대폰 결제",
        description: "통신사 인증 후 휴대폰 요금으로 결제"
    },
    {
        id: "transfer",
        title: "실시간 계좌이체",
        description: "은행 계좌 인증 후 바로 이체하여 결제"
    },
    {
        id: "bank",
        title: "가상계좌",
        description: "주문 후 발급된 계좌로 입금하면 결제가 완료됩니다"
    }
];

const FAQ_ITEMS = [
    {
        id: "size",
        question: "사이즈를 잘 못 골랐어요",
        answer: "주문 완료 직후에는 변경이 어려울 수 있어 고객센터를 통해 빠르게 문의해 주세요. 재고 상황에 따라 교환 가능 여부가 달라질 수 있습니다."
    },
    {
        id: "return",
        question: "교환/반품은 어떻게 하나요?",
        answer: "상품 수령 후 7일 이내 접수 가능하며, 사용 흔적이 없는 경우에 한해 처리됩니다. 상세 기준은 브랜드 정책을 따라 적용됩니다."
    }
];

const formatPrice = (value) => `₩${value.toLocaleString()}`;
const formatDeliveryDate = (date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

const getItemThumbnail = (item) => item.image || item.mainImg || item.hoverImg || "/images/sub-cart/clothes-mini.jpg";

export default function Payment() {
    const location = useLocation();
    const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);
    const [openFaq, setOpenFaq] = useState(FAQ_ITEMS[0].id);

    const orderItems = location.state?.orderItems?.length ? location.state.orderItems : [];
    const productTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const shippingFee = 0;
    const localShippingFee = 0;
    const finalTotal = productTotal + shippingFee + localShippingFee;
    const expectedDeliveryDate = useMemo(() => {
        const orderDate = new Date();
        const deliveryDate = new Date(orderDate);
        deliveryDate.setDate(orderDate.getDate() + 2);
        return formatDeliveryDate(deliveryDate);
    }, []);

    const activeMethod = useMemo(
        () => PAYMENT_METHODS.find((method) => method.id === selectedMethod) || PAYMENT_METHODS[0],
        [selectedMethod]
    );

    if (!orderItems.length) {
        return (
            <main className="payment-page">
                <div className="inner payment-empty">
                    <img src="/images/pages-icon/warning-icon.svg" alt="" />
                    <p>결제할 상품 정보가 없습니다.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="payment-page">
            <div className="inner payment-layout">
                <div className="payment-form-column">
                    <div className="payment-step-section">
                        <div className="payment-step-header">
                            <div className="step-title-row">
                                <h2>주문자 정보</h2>
                                <span>STEP 1 of 5</span>
                            </div>
                            <p>주문자 정보를 입력해 주세요</p>
                        </div>

                        <div className="payment-form-grid">
                            <label className="field full">
                                <span>이름 <em>*</em></span>
                                <input type="text" placeholder="주문자 이름" />
                            </label>

                            <div className="field full">
                                <span>휴대폰 번호 <em>*</em></span>
                                <div className="inline-fields phone-fields">
                                    <select defaultValue="010">
                                        <option value="010">010</option>
                                        <option value="011">011</option>
                                        <option value="016">016</option>
                                    </select>
                                    <i>-</i>
                                    <input type="text" />
                                    <i>-</i>
                                    <input type="text" />
                                </div>
                            </div>

                            <div className="field full">
                                <span>이메일 <em>*</em></span>
                                <div className="inline-fields email-fields">
                                    <input type="text" placeholder="사용자 이메일" />
                                    <i>@</i>
                                    <input type="text" />
                                    <select defaultValue="custom">
                                        <option value="custom">이메일 선택</option>
                                        <option value="gmail.com">gmail.com</option>
                                        <option value="naver.com">naver.com</option>
                                        <option value="daum.net">daum.net</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="payment-step-section">
                        <div className="payment-step-header">
                            <div className="step-title-row">
                                <h2>배송 정보</h2>
                                <span>STEP 2 of 5</span>
                            </div>
                            <p>배송지 정보를 입력해주세요</p>
                        </div>

                        <div className="shipping-actions">
                            <label className="check-field">
                                <input type="checkbox" />
                                <span>주문자 정보와 동일</span>
                            </label>
                            <label className="check-field">
                                <input type="checkbox" />
                                <span>새로운 배송지</span>
                            </label>
                            <button type="button" className="outline-btn">배송주소록</button>
                        </div>

                        <div className="payment-form-grid">
                            <label className="field full">
                                <span>받는사람 <em>*</em></span>
                                <input type="text" placeholder="받는사람 이름" />
                            </label>

                            <div className="field full">
                                <span>휴대폰 번호 <em>*</em></span>
                                <div className="inline-fields phone-fields">
                                    <select defaultValue="010">
                                        <option value="010">010</option>
                                        <option value="011">011</option>
                                        <option value="016">016</option>
                                    </select>
                                    <i>-</i>
                                    <input type="text" />
                                    <i>-</i>
                                    <input type="text" />
                                </div>
                            </div>

                            <div className="field postal-field">
                                <span>우편번호 <em>*</em></span>
                                <div className="inline-fields">
                                    <input type="text" placeholder="우편번호" />
                                    <button type="button" className="outline-btn small">주소검색</button>
                                </div>
                            </div>

                            <div className="field half">
                                <span>기본주소 <em>*</em></span>
                                <input type="text" placeholder="기본주소" />
                            </div>

                            <label className="field half">
                                <span>상세주소 <em>*</em></span>
                                <input type="text" placeholder="상세주소" />
                            </label>

                            <label className="field full">
                                <span>배송 메세지</span>
                                <textarea placeholder="배송 시 요청사항을 입력해주세요 (예: 문 앞에 놓아주세요)" />
                            </label>
                        </div>

                        <label className="check-field bottom-check">
                            <input type="checkbox" />
                            <span>기본 배송지로 저장</span>
                        </label>
                    </div>

                    <div className="payment-step-section">
                        <div className="payment-step-header">
                            <div className="step-title-row">
                                <h2>할인 정보</h2>
                                <span>STEP 3 of 5</span>
                            </div>
                            <p>프로모션 코드를 입력해 주세요</p>
                        </div>

                        <div className="discount-block">
                            <div className="discount-row">
                                <label className="discount-label">프로모션 코드 적용</label>
                                <div className="inline-fields apply-fields">
                                    <input type="text" placeholder="프로모션 코드 입력" />
                                    <button type="button" className="dark-btn small">적용</button>
                                </div>
                            </div>

                            <div className="discount-split">
                                <div className="discount-box">
                                    <div className="discount-box-head">
                                        <span>포인트 사용</span>
                                        <strong>사용가능 포인트: 5,000원</strong>
                                    </div>
                                    <div className="inline-fields apply-fields">
                                        <input type="text" />
                                        <button type="button" className="dark-btn small">적용</button>
                                    </div>
                                </div>

                                <div className="discount-box">
                                    <div className="discount-box-head">
                                        <span>쿠폰 적용</span>
                                        <strong>사용가능 쿠폰: 3장</strong>
                                    </div>
                                    <div className="inline-fields apply-fields">
                                        <input type="text" />
                                        <button type="button" className="dark-btn small">적용</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="payment-step-section">
                        <div className="payment-step-header">
                            <div className="step-title-row">
                                <h2>결제 수단</h2>
                                <span>STEP 4 of 5</span>
                            </div>
                            <p>결제 수단을 선택해 주세요</p>
                        </div>

                        <div className="payment-method-list">
                            {PAYMENT_METHODS.map((method) => (
                                <button
                                    type="button"
                                    key={method.id}
                                    className={`method-card ${selectedMethod === method.id ? "is-active" : ""}`}
                                    onClick={() => setSelectedMethod(method.id)}
                                >
                                    <div className="method-card-copy">
                                        <strong>{method.title}</strong>
                                        <p>{method.description}</p>
                                    </div>

                                    {method.badges && (
                                        <div className="method-badges">
                                            {method.badges.map((badge) => (
                                                <span key={badge}>{badge}</span>
                                            ))}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="payment-faq-section">
                        {FAQ_ITEMS.map((item) => {
                            const isOpen = openFaq === item.id;

                            return (
                                <div className={`faq-item ${isOpen ? "is-open" : ""}`} key={item.id}>
                                    <button
                                        type="button"
                                        className="faq-question"
                                        onClick={() => setOpenFaq(isOpen ? "" : item.id)}
                                    >
                                        <span>{item.question}</span>
                                        <i>{isOpen ? "−" : "+"}</i>
                                    </button>
                                    {isOpen && <p className="faq-answer">{item.answer}</p>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <aside className="payment-summary-column">
                    <div className="summary-panel">
                        <div className="payment-step-header summary-header">
                            <div className="step-title-row">
                                <h2>주문 요약</h2>
                                <span>STEP 5 of 5</span>
                            </div>
                            <p>주문 정보를 확인해 주세요</p>
                        </div>

                        <div className="summary-order-head">
                            <strong>주문 상품</strong>
                            <span>({itemCount}개 상품)</span>
                        </div>

                        <div className="summary-order-list">
                            {orderItems.map((item) => (
                                <article className="summary-order-item" key={item.id}>
                                    <div className="summary-thumb">
                                        <img src={getItemThumbnail(item)} alt={item.name} />
                                    </div>
                                    <div className="summary-item-copy">
                                        <h3>{item.name}</h3>
                                        <p>색상: {item.option.split(" / ")[0] || "-"} · 사이즈: {item.option.split(" / ")[1] || "-"}</p>
                                        <span>수량: {item.quantity}</span>
                                    </div>
                                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                                </article>
                            ))}
                        </div>

                        <div className="summary-price-list">
                            <div className="summary-line">
                                <span>소계 ({itemCount}개 상품)</span>
                                <strong>{formatPrice(productTotal)}</strong>
                            </div>
                            <div className="summary-line">
                                <span>회원금액</span>
                                <strong>{formatPrice(productTotal)}</strong>
                            </div>
                            <div className="summary-line">
                                <span>배송비</span>
                                <strong>{shippingFee === 0 ? "무료" : formatPrice(shippingFee)}</strong>
                            </div>
                            <div className="summary-line">
                                <span>지역 배송비</span>
                                <strong>{localShippingFee === 0 ? "무료" : formatPrice(localShippingFee)}</strong>
                            </div>
                        </div>

                        <div className="summary-total-row">
                            <span>총 결제금액</span>
                            <strong>{finalTotal.toLocaleString()}</strong>
                        </div>

                        <div className="delivery-note">
                            <strong>예상 배송일 : {expectedDeliveryDate}</strong>
                            <p>배송 완료 후 7일 이내 교환/반품 가능</p>
                        </div>

                        <button type="button" className="order-submit-btn">
                            주문하기
                        </button>

                        <p className="summary-terms">
                            주문하기를 클릭하면 <strong>이용약관</strong> 및 <strong>개인정보처리방침</strong>에 동의하는 것으로 간주됩니다
                        </p>

                        <p className="selected-method-copy">선택한 결제 수단: {activeMethod.title}</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
