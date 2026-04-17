import React, { useState } from "react";
import "./scss/GuestOrder.scss";

export default function GuestOrder() {
    const [orderName, setOrderName] = useState("");
    const [orderNumber, setOrderNumber] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        if (!orderName.trim() || !orderNumber.trim()) {
            return;
        }

        // 여기서 주문조회 로직 연결
        console.log("비회원 주문조회", {
            orderName,
            orderNumber,
        });
    };

    return (
        <section className="sub-section">
            <div className="inner guest-order-page">
                <div className="guest-order-inner">
                    <div className="guest-order-header">
                        <h2>Welcome At Matin Kim</h2>
                        <p>마뗑킴에 오신 것을 환영합니다.</p>
                        <h3>비회원 주문조회</h3>
                    </div>

                    <form className="guest-order-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="주문자명"
                                value={orderName}
                                onChange={(e) => setOrderName(e.target.value)}
                                className={isSubmitted && !orderName.trim() ? "error" : ""}
                            />
                            {isSubmitted && !orderName.trim() && (
                                <p className="error-text">
                                    <span className="error-icon">!</span>
                                    주문자명 항목은 필수 입력값입니다.
                                </p>
                            )}
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="주문번호"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                className={isSubmitted && !orderName.trim() ? "error" : ""}
                            />
                            {isSubmitted && !orderName.trim() && (
                                <p className="error-text">
                                    <span className="error-icon">!</span>
                                    주문번호 항목은 필수 입력값입니다.
                                </p>
                            )}
                        </div>


                        <button type="submit" className="guest-order-btn">
                            주문 조회하기
                        </button>
                    </form>

                    <div className="guest-order-notice">
                        <h4>안내사항</h4>
                        <p>
                            비회원 고객께서 구매하신 경우에만 주문/배송 상태를 확인할 수
                            있습니다.
                            <br />
                            주문자명과 주문번호 입력 후 조회하기 버튼을 누르시면 주문내역을
                            확인할 수 있습니다.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}