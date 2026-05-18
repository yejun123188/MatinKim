import React, { useState } from "react";
import { createPortal } from "react-dom";
import "./scss/PaymentModal.scss";

export default function PaymentModal({ method, finalTotal, onSuccess, onClose }) {
    const [step, setStep] = useState("input");
    const [form, setForm] = useState({
        cardNumber1: "", cardNumber2: "", cardNumber3: "", cardNumber4: "",
        expiry: "", cvc: "", installment: "일시불",
        phone: "", carrier: "SKT",
        bank: "국민은행",
        verifyCode: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePay = () => {
        setStep("processing");
        setTimeout(() => { setStep("done"); }, 2000);
    };

    const formatPrice = (v) => `₩${v.toLocaleString()}`;

    //createPortal로 body에 직접 렌더링
    return createPortal(
        <div className="pay-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="pay-modal-box">

                <div className="pay-modal-header">
                    <span>{method.title}</span>
                    <button onClick={onClose}>✕</button>
                </div>

                <div className="pay-modal-amount">
                    <span>결제 금액</span>
                    <strong>{formatPrice(finalTotal)}</strong>
                </div>

                {step === "input" && (
                    <div className="pay-modal-body">
                        {method.id === "card" && (
                            <>
                                <div className="pay-field">
                                    <label>카드 번호</label>
                                    <div className="card-row">
                                        <input name="cardNumber1" maxLength={4} placeholder="0000" value={form.cardNumber1} onChange={handleChange} />
                                        <span>-</span>
                                        <input name="cardNumber2" maxLength={4} placeholder="****" type="password" value={form.cardNumber2} onChange={handleChange} />
                                        <span>-</span>
                                        <input name="cardNumber3" maxLength={4} placeholder="****" type="password" value={form.cardNumber3} onChange={handleChange} />
                                        <span>-</span>
                                        <input name="cardNumber4" maxLength={4} placeholder="0000" value={form.cardNumber4} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="pay-field-row">
                                    <div className="pay-field">
                                        <label>유효기간</label>
                                        <input name="expiry" placeholder="MM / YY" maxLength={7} value={form.expiry} onChange={handleChange} />
                                    </div>
                                    <div className="pay-field">
                                        <label>CVC</label>
                                        <input name="cvc" type="password" placeholder="•••" maxLength={3} value={form.cvc} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="pay-field">
                                    <label>할부</label>
                                    <select name="installment" value={form.installment} onChange={handleChange}>
                                        <option>일시불</option>
                                        <option>2개월</option>
                                        <option>3개월</option>
                                        <option>6개월</option>
                                        <option>12개월</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {(method.id === "tosspay" || method.id === "kakaopay") && (
                            <div className="pay-qr-block">
                                <div className={`pay-qr-box ${method.id}`}>
                                    <div className="qr-mock">
                                        {"■■■■■\n■   ■\n■ ■ ■\n■   ■\n■■■■■".split("\n").map((r, i) => (
                                            <div key={i}>{r}</div>
                                        ))}
                                    </div>
                                </div>
                                <p>{method.id === "tosspay" ? "토스" : "카카오"} 앱으로 QR을 스캔하거나<br />아래 버튼을 눌러 인증하세요</p>
                            </div>
                        )}

                        {method.id === "mobile" && (
                            <>
                                <div className="pay-field">
                                    <label>통신사</label>
                                    <select name="carrier" value={form.carrier} onChange={handleChange}>
                                        {["SKT", "KT", "LG U+", "알뜰폰 SKT", "알뜰폰 KT", "알뜰폰 LG U+"].map(c => (
                                            <option key={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="pay-field">
                                    <label>휴대폰 번호</label>
                                    <div className="pay-inline">
                                        <input name="phone" placeholder="'-' 없이 입력" maxLength={11} value={form.phone} onChange={handleChange} />
                                        <button type="button" className="verify-btn" onClick={() => alert("인증번호가 발송되었습니다. (테스트)")}>인증번호 받기</button>
                                    </div>
                                </div>
                                <div className="pay-field">
                                    <label>인증번호</label>
                                    <input name="verifyCode" placeholder="6자리 입력" maxLength={6} value={form.verifyCode} onChange={handleChange} />
                                </div>
                            </>
                        )}

                        {method.id === "transfer" && (
                            <>
                                <div className="pay-field">
                                    <label>은행 선택</label>
                                    <select name="bank" value={form.bank} onChange={handleChange}>
                                        {["국민은행", "신한은행", "우리은행", "하나은행", "카카오뱅크", "토스뱅크"].map(b => (
                                            <option key={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="pay-field">
                                    <label>계좌번호</label>
                                    <div className="pay-inline">
                                        <input placeholder="계좌번호 입력" />
                                        <button type="button" className="verify-btn" onClick={() => alert("계좌 인증이 완료되었습니다. (테스트)")}>인증하기</button>
                                    </div>
                                </div>
                            </>
                        )}

                        {method.id === "bank" && (
                            <>
                                <div className="pay-field">
                                    <label>입금 은행 선택</label>
                                    <select name="bank" value={form.bank} onChange={handleChange}>
                                        {["국민은행", "신한은행", "우리은행", "하나은행"].map(b => (
                                            <option key={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="pay-notice-box">
                                    <p>· 주문 완료 후 가상계좌 번호가 발급됩니다</p>
                                    <p>· 입금 기한(24시간) 내 미입금 시 자동 취소됩니다</p>
                                </div>
                            </>
                        )}

                        <p className="pay-test-notice">※ 테스트 환경입니다. 실제 결제가 이루어지지 않습니다.</p>
                        <button className="pay-submit-btn" onClick={handlePay}>
                            {formatPrice(finalTotal)} 결제하기
                        </button>
                    </div>
                )}

                {step === "processing" && (
                    <div className="pay-modal-processing">
                        <div className="pay-spinner" />
                        <p>결제를 처리하고 있습니다...</p>
                        <span>잠시만 기다려 주세요</span>
                    </div>
                )}

                {step === "done" && (
                    <div className="pay-modal-done">
                        <div className="pay-done-icon">✓</div>
                        <strong>결제가 완료되었습니다</strong>
                        <p>{formatPrice(finalTotal)}</p>
                        <button type="button" className="pay-submit-btn" onClick={onSuccess}>
                            주문 확인하기
                        </button>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
