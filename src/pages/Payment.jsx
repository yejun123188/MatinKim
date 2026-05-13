import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./scss/Payment.scss";
import { useAuthStore } from "../store/useAuthStore";
import AddressPopup from "./AddressPopup";
import { createOrder, ORDER_MENU } from "../store/orderStorage";
import { useProductStore } from "../store/useProductStore";
import PaymentModal from "./PaymentModal";

const PAYMENT_METHODS = [
    { id: "card", title: "신용카드 / 체크카드", description: "안전한 결제를 위해 Stripe로 처리됩니다", badges: ["VISA", "MC", "AMEX"] },
    { id: "tosspay", title: "토스페이", description: "토스페이로 빠르고 간편하게 결제" },
    { id: "kakaopay", title: "카카오페이(간편결제)", description: "카카오페이 인증으로 간편하게 결제" },
    { id: "mobile", title: "휴대폰 결제", description: "통신사 인증 후 휴대폰 요금으로 결제" },
    { id: "transfer", title: "실시간 계좌이체", description: "은행 계좌 인증 후 바로 이체하여 결제" },
    { id: "bank", title: "가상계좌", description: "주문 후 발급된 계좌로 입금하면 결제가 완료됩니다" }
];

const FAQ_ITEMS = [
    { id: "size", question: "사이즈를 잘 못 골랐어요", answer: "주문 완료 직후에는 변경이 어려울 수 있어 고객센터를 통해 빠르게 문의해 주세요. 재고 상황에 따라 교환 가능 여부가 달라질 수 있습니다." },
    { id: "return", question: "교환/반품은 어떻게 하나요?", answer: "상품 수령 후 7일 이내 접수 가능하며, 사용 흔적이 없는 경우에 한해 처리됩니다. 상세 기준은 브랜드 정책을 따라 적용됩니다." }
];

// 유효한 프로모션 코드 목록 (실제 서비스에서는 서버에서 검증)
const VALID_PROMO_CODES = {
    "WELCOME10": { label: "신규회원 10% 할인", type: "rate", value: 10 },
    "SAVE5000": { label: "5,000원 즉시 할인", type: "fixed", value: 5000 },
    "SUMMER20": { label: "여름 시즌 20% 할인", type: "rate", value: 20 },
};

const formatPrice = (value) => `₩${value.toLocaleString()}`;
const formatDeliveryDate = (date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
const getItemThumbnail = (item) => item.image || item.mainImg || item.hoverImg || "/images/sub-cart/clothes-mini.jpg";


export default function Payment() {
    console.log("✅ Payment 컴포넌트 진입");

    const { user, userAddress, onFetchAddress, onAddAddress, onRecordPurchase, couponList, savedMoneySummary, onFetchCoupons, onFetchSavedMoney } = useAuthStore();
    const navigate = useNavigate();
    // 상단 구조분해에 onRemoveItems 추가
    const { onClearCart, onReduceItems } = useProductStore();

    const [orderForm, setOrderForm] = useState({
        name: "",
        mobile1: "010",
        mobile2: "",
        mobile3: "",
        email: "",
        emailDomain: "custom",
        emailInput: ""
    });

    const [form, setForm] = useState({
        receiver: "",
        mobile1: "010",
        mobile2: "",
        mobile3: "",
        zipcode: "",
        address: "",
        detail: "",
        isDefault: false
    });

    const [sameAddress, setSameAddress] = useState({ zipcode: "", address: "", detail: "" });
    const [errors, setErrors] = useState({});
    const [useSame, setUseSame] = useState(!!user);
    const [useNew, setUseNew] = useState(!user);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);
    const [openFaq, setOpenFaq] = useState(FAQ_ITEMS[0].id);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);

    // ── 할인 관련 상태 ──────────────────────────────────────────
    // 프로모션 코드
    const [promoInput, setPromoInput] = useState("");
    const [appliedPromo, setAppliedPromo] = useState(null); // { label, type, value }
    const [promoError, setPromoError] = useState("");

    // 포인트
    const [pointInput, setPointInput] = useState("");
    const [appliedPoint, setAppliedPoint] = useState(0);
    const [pointError, setPointError] = useState("");

    // 쿠폰
    const [selectedCouponId, setSelectedCouponId] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null); // coupon object
    const [couponError, setCouponError] = useState("");
    // ────────────────────────────────────────────────────────────

    useEffect(() => { setIsLoaded(true); }, []);

    useEffect(() => {
        if (user) {
            onFetchAddress();
            onFetchCoupons();
            onFetchSavedMoney();
        }
    }, [user, onFetchAddress, onFetchCoupons, onFetchSavedMoney]);

    useEffect(() => {
        if (!user) return;
        const emailParts = user.email?.split("@") || [];
        const emailLocal = emailParts[0] || "";
        const emailDomainRaw = emailParts[1] || "";
        const knownDomains = ["gmail.com", "naver.com", "daum.net"];
        const emailDomain = knownDomains.includes(emailDomainRaw) ? emailDomainRaw : "custom";
        const emailInput = emailDomain === "custom" ? emailDomainRaw : "";
        const phoneParts = user.phone?.split("-") || [];
        setOrderForm({
            name: user.name || "",
            mobile1: phoneParts[0] || "010",
            mobile2: phoneParts[1] || "",
            mobile3: phoneParts[2] || "",
            email: emailLocal,
            emailDomain,
            emailInput,
        });
    }, [user]);

    const location = useLocation();
    console.log("location.state:", location.state);
    const orderItems = location.state?.orderItems?.length ? location.state.orderItems : [];
    console.log("orderItems in Payment:", orderItems);
    const productTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const shippingFee = 0;
    const localShippingFee = 0;

    // ── 할인 금액 계산 ───────────────────────────────────────────
    const promoDiscount = useMemo(() => {
        if (!appliedPromo) return 0;
        if (appliedPromo.type === "rate") return Math.floor(productTotal * appliedPromo.value / 100);
        if (appliedPromo.type === "fixed") return Math.min(appliedPromo.value, productTotal);
        return 0;
    }, [appliedPromo, productTotal]);

    const couponDiscount = useMemo(() => {
        if (!appliedCoupon) return 0;
        const benefitStr = appliedCoupon.benefit || "";
        const rateMatch = benefitStr.match(/(\d+)%/);
        if (rateMatch) return Math.floor(productTotal * parseInt(rateMatch[1]) / 100);
        const fixedMatch = benefitStr.match(/([\d,]+)원/);
        if (fixedMatch) return Math.min(parseInt(fixedMatch[1].replace(/,/g, "")), productTotal);
        return 0;
    }, [appliedCoupon, productTotal]);

    const totalDiscount = promoDiscount + appliedPoint + couponDiscount;
    const finalTotal = Math.max(productTotal + shippingFee + localShippingFee - totalDiscount, 0);

    const availablePoint = savedMoneySummary?.availablePoint || 0;
    const usableCouponList = (couponList || []).filter(c => !c.used);
    // ────────────────────────────────────────────────────────────

    const expectedDeliveryDate = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + 2);
        return formatDeliveryDate(d);
    }, []);

    const activeMethod = useMemo(
        () => PAYMENT_METHODS.find((m) => m.id === selectedMethod) || PAYMENT_METHODS[0],
        [selectedMethod]
    );

    // ── 할인 핸들러 ──────────────────────────────────────────────
    const handleApplyPromo = () => {
        const code = promoInput.trim().toUpperCase();
        if (!code) { setPromoError("프로모션 코드를 입력해주세요."); return; }
        const promo = VALID_PROMO_CODES[code];
        if (!promo) { setPromoError("유효하지 않은 코드입니다."); setAppliedPromo(null); return; }
        setAppliedPromo(promo);
        setPromoError("");
    };

    const handleCancelPromo = () => {
        setAppliedPromo(null);
        setPromoInput("");
        setPromoError("");
    };

    const handleApplyPoint = () => {
        const val = parseInt(pointInput.replace(/,/g, ""), 10);
        if (!val || val <= 0) { setPointError("사용할 포인트를 입력해주세요."); return; }
        if (val > availablePoint) { setPointError(`사용 가능한 포인트(${availablePoint.toLocaleString()}원)를 초과했습니다.`); return; }
        if (val > productTotal) { setPointError("상품 금액보다 많은 포인트는 사용할 수 없습니다."); return; }
        setAppliedPoint(val);
        setPointError("");
    };

    const handleCancelPoint = () => {
        setAppliedPoint(0);
        setPointInput("");
        setPointError("");
    };

    const handleApplyCoupon = () => {
        if (!selectedCouponId) { setCouponError("쿠폰을 선택해주세요."); return; }
        const coupon = usableCouponList.find(c => c.id === selectedCouponId);
        if (!coupon) { setCouponError("선택한 쿠폰을 찾을 수 없습니다."); return; }
        setAppliedCoupon(coupon);
        setCouponError("");
    };

    const handleCancelCoupon = () => {
        setAppliedCoupon(null);
        setSelectedCouponId("");
        setCouponError("");
    };
    // ────────────────────────────────────────────────────────────

    const handleOrderChange = (e) => {
        const { name, value } = e.target;
        setOrderForm(prev => ({ ...prev, [name]: value }));
        if (name === "mobile2" || name === "mobile3") setErrors(prev => ({ ...prev, orderMobile: "" }));
        else if (name === "name") setErrors(prev => ({ ...prev, orderName: "" }));
        else if (name === "email" || name === "emailInput") setErrors(prev => ({ ...prev, orderEmail: "" }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        if (name === "mobile2" || name === "mobile3") setErrors(prev => ({ ...prev, mobile: "" }));
        else if (name === "receiver") setErrors(prev => ({ ...prev, receiver: "" }));
        else if (name === "detail") setErrors(prev => ({ ...prev, detail: "" }));
    };

    const openPostcode = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                const address = data.roadAddress || data.jibunAddress;
                const newAddr = { zipcode: data.zonecode, address, detail: "" };
                if (useSame) {
                    setSameAddress(newAddr);
                    if (user) onAddAddress(newAddr);
                } else {
                    setForm(prev => ({ ...prev, ...newAddr }));
                }
                setErrors(prev => ({ ...prev, zipcode: "", address: "" }));
                setTimeout(() => { document.querySelector(".detail-input")?.focus(); }, 100);
            }
        }).open();
    };

    const validate = () => {
        let newErrors = {};
        if (!orderForm.name.trim()) newErrors.orderName = "주문자 이름을 입력해주세요";
        if (!orderForm.mobile2 || !orderForm.mobile3) newErrors.orderMobile = "주문자 휴대폰 번호를 입력해주세요";
        if (!orderForm.email.trim()) newErrors.orderEmail = "이메일을 입력해주세요";
        if (useNew) {
            if (!form.receiver.trim()) newErrors.receiver = "받는 사람을 입력해주세요";
            if (!form.mobile2 || !form.mobile3) newErrors.mobile = "휴대폰 번호를 입력해주세요";
            if (!form.zipcode) newErrors.zipcode = "우편번호를 입력해주세요";
            if (!form.address) newErrors.address = "기본주소를 입력해주세요";
            if (!form.detail.trim()) newErrors.detail = "상세주소를 입력해주세요";
        }
        if (useSame) {
            const zip = sameAddress.zipcode || userAddress?.zipcode || "";
            const addr = sameAddress.address || userAddress?.address || "";
            const detail = sameAddress.detail || userAddress?.detail || "";
            if (!zip) newErrors.zipcode = "우편번호를 입력해주세요";
            if (!addr) newErrors.address = "기본주소를 입력해주세요";
            if (!detail.trim()) newErrors.detail = "상세주소를 입력해주세요";
        }
        setErrors(newErrors);
        setTimeout(() => { document.querySelector(".error")?.focus(); }, 0);
        return Object.keys(newErrors).length === 0;
    };


    // 주문하기 버튼 클릭 → 유효성 검사만 하고 모달 오픈
    const handleSubmit = () => {
        if (!validate()) return;
        setShowPayModal(true);
    };



    const handleAddressSelect = (addr) => {
        const [m1, m2, m3] = (addr.phone || "010--").split("-");
        setForm({ receiver: addr.receiver || "", mobile1: m1, mobile2: m2, mobile3: m3, zipcode: addr.zipcode || "", address: addr.address || "", detail: addr.detail || "", isDefault: addr.isDefault || false });
        setUseSame(false);
        setUseNew(true);
    };

    if (!orderItems.length) {
        return (
            <main className={`payment-page ${isLoaded ? 'is-loaded' : ''}`}>
                <div className="inner payment-empty">
                    <img src="/images/pages-icon/warning-icon.svg" alt="" />
                    <p>결제할 상품 정보가 없습니다.</p>
                </div>
            </main>
        );
    }
    // 모달에서 결제 완료 후 실제 주문 처리
    const handlePaySuccess = async () => {
        setShowPayModal(false);
        setIsSubmitting(true);

        if (user) {
            const isSaved = await onRecordPurchase(finalTotal, 1);
            setIsSubmitting(false);
            if (!isSaved) return;
        } else {
            setIsSubmitting(false);
        }

        const shippingInfo = useSame
            ? {
                receiver: orderForm.name,
                mobile1: orderForm.mobile1,
                mobile2: orderForm.mobile2,
                mobile3: orderForm.mobile3,
                address: sameAddress.address || userAddress?.address || "",
                detail: sameAddress.detail || userAddress?.detail || "",
                zipcode: sameAddress.zipcode || userAddress?.zipcode || "",
            }
            : form;

        const orderNumber = createOrder({
            orderItems,
            orderForm,
            shippingInfo,
            payment: activeMethod.title,
            deliveryCost: shippingFee + localShippingFee,
            discounts: { promoDiscount, pointDiscount: appliedPoint, couponDiscount },
            finalTotal,
        });
        const orderedKeys = orderItems.map((item) => item.key).filter(Boolean);
        console.log("orderedKeys:", orderedKeys);  // ← 이거 추가
        console.log("cartItem:", useProductStore.getState().cartItem);
        if (orderedKeys.length > 0) {
            onReduceItems(orderedKeys);
        } else {
            onClearCart();
        }

        if (user) {
            navigate("/userInfo", { state: { menu: ORDER_MENU } });
        } else {
            navigate("/order-complete", {
                state: { orderNumber, orderItems, finalTotal, shippingInfo, payment: activeMethod.title, isGuest: true },
            });
        }
    };

    return (
        <main className={`payment-page ${isLoaded ? 'is-loaded' : ''}`}>
            <div className="inner payment-layout">
                <div className="payment-form-column">

                    {/* STEP 1 주문자 정보 */}
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
                                <input type="text" name="name" placeholder="주문자 이름" value={orderForm.name} onChange={handleOrderChange} className={errors.orderName ? "error" : ""} />
                                {errors.orderName && <p className="error-text">{errors.orderName}</p>}
                            </label>
                            <div className="field full">
                                <span>휴대폰 번호 <em>*</em></span>
                                <div className="inline-fields phone-fields">
                                    <select name="mobile1" value={orderForm.mobile1} onChange={(e) => { handleOrderChange(e); setErrors(prev => ({ ...prev, orderMobile: "" })); }}>
                                        <option value="010">010</option>
                                        <option value="011">011</option>
                                        <option value="016">016</option>
                                    </select>
                                    <i>-</i>
                                    <input type="text" name="mobile2" value={orderForm.mobile2} onChange={handleOrderChange} className={errors.orderMobile ? "error" : ""} />
                                    <i>-</i>
                                    <input type="text" name="mobile3" value={orderForm.mobile3} onChange={handleOrderChange} className={errors.orderMobile ? "error" : ""} />
                                </div>
                                {errors.orderMobile && <p className="error-text">{errors.orderMobile}</p>}
                            </div>
                            <div className="field full">
                                <span>이메일 <em>*</em></span>
                                <div className="inline-fields email-fields">
                                    <input type="text" name="email" placeholder="사용자 이메일" value={orderForm.email} onChange={handleOrderChange} className={errors.orderEmail ? "error" : ""} />
                                    <i>@</i>
                                    <input type="text" name="emailInput" value={orderForm.emailDomain === "custom" ? orderForm.emailInput : orderForm.emailDomain} onChange={handleOrderChange} readOnly={orderForm.emailDomain !== "custom"} />
                                    <select name="emailDomain" value={orderForm.emailDomain} onChange={(e) => { setOrderForm(prev => ({ ...prev, emailDomain: e.target.value, emailInput: "" })); setErrors(prev => ({ ...prev, orderEmail: "" })); }}>
                                        <option value="custom">직접입력</option>
                                        <option value="gmail.com">gmail.com</option>
                                        <option value="naver.com">naver.com</option>
                                        <option value="daum.net">daum.net</option>
                                    </select>
                                </div>
                                {errors.orderEmail && <p className="error-text">{errors.orderEmail}</p>}
                            </div>
                        </div>
                    </div>

                    {/* STEP 2 배송 정보 */}
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
                                <input type="radio" name="orderUser" checked={useSame} onChange={() => { setUseNew(false); setUseSame(true); }} />
                                <span>주문자 정보와 동일</span>
                            </label>
                            <label className="check-field">
                                <input type="radio" name="orderUser" checked={useNew} onChange={() => { setUseNew(true); setUseSame(false); }} />
                                <span>새로운 배송지</span>
                            </label>
                            {user && <button type="button" className="outline-btn" onClick={() => setShowAddressModal(true)}>배송주소록</button>}
                        </div>
                        <div className="payment-form-grid">
                            <label className="field full">
                                <span>받는사람 <em>*</em></span>
                                <input type="text" name="receiver" placeholder="받는사람 이름" value={useSame ? orderForm.name : form.receiver} onChange={handleChange} readOnly={useSame} className={errors.receiver ? "error" : ""} />
                                {errors.receiver && <p className="error-text">{errors.receiver}</p>}
                            </label>
                            <div className="field full">
                                <span>휴대폰 번호 <em>*</em></span>
                                <div className="inline-fields phone-fields">
                                    <select name="mobile1" value={useSame ? orderForm.mobile1 : form.mobile1} onChange={(e) => { handleChange(e); setErrors(prev => ({ ...prev, mobile: "" })); }} disabled={useSame}>
                                        <option value="010">010</option>
                                        <option value="011">011</option>
                                        <option value="016">016</option>
                                    </select>
                                    <i>-</i>
                                    <input type="text" name="mobile2" value={useSame ? orderForm.mobile2 : form.mobile2} onChange={handleChange} readOnly={useSame} className={errors.mobile ? "error" : ""} />
                                    <i>-</i>
                                    <input type="text" name="mobile3" value={useSame ? orderForm.mobile3 : form.mobile3} onChange={handleChange} readOnly={useSame} className={errors.mobile ? "error" : ""} />
                                </div>
                                {errors.mobile && <p className="error-text">{errors.mobile}</p>}
                            </div>
                            <div className="field postal-field">
                                <span>우편번호 <em>*</em></span>
                                <div className="inline-fields">
                                    <input type="text" placeholder="우편번호" value={useSame ? (sameAddress.zipcode || userAddress?.zipcode || "") : form.zipcode} readOnly className={errors.zipcode ? "error" : ""} />
                                    <button type="button" className="outline-btn small" onClick={openPostcode}>주소검색</button>
                                </div>
                                {errors.zipcode && <p className="error-text">{errors.zipcode}</p>}
                            </div>
                            <div className="field half">
                                <span>기본주소 <em>*</em></span>
                                <input type="text" placeholder="기본주소" value={useSame ? (sameAddress.address || userAddress?.address || "") : form.address} readOnly />
                                {errors.address && <p className="error-text">{errors.address}</p>}
                            </div>
                            <label className="field half">
                                <span>상세주소 <em>*</em></span>
                                <input type="text" name="detail" placeholder="상세주소" className={`detail-input ${errors.detail ? "error" : ""}`} value={useSame ? (sameAddress.detail || userAddress?.detail || "") : form.detail} onChange={(e) => { if (useSame) { setSameAddress(prev => ({ ...prev, detail: e.target.value })); setErrors(prev => ({ ...prev, detail: "" })); } else { handleChange(e); } }} />
                                {errors.detail && <p className="error-text">{errors.detail}</p>}
                            </label>
                            <label className="field full">
                                <span>배송 메세지</span>
                                <textarea name="message" placeholder="배송 시 요청사항을 입력해주세요 (예: 문 앞에 놓아주세요)" />
                            </label>
                        </div>
                        {user && (
                            <label className="check-field bottom-check">
                                <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} />
                                <span>기본 배송지로 저장</span>
                            </label>
                        )}
                    </div>

                    {/* STEP 3 할인 정보 */}
                    {user && (
                        <div className="payment-step-section">
                            <div className="payment-step-header">
                                <div className="step-title-row">
                                    <h2>할인 정보</h2>
                                    <span>STEP 3 of 5</span>
                                </div>
                                <p>프로모션 코드, 포인트, 쿠폰을 적용해 주세요</p>
                            </div>

                            <div className="discount-block">

                                {/* 프로모션 코드 */}
                                <div className="discount-row">
                                    <label className="discount-label">프로모션 코드</label>
                                    {appliedPromo ? (
                                        <div className="discount-applied-row">
                                            <span className="discount-applied-tag">
                                                {appliedPromo.label} &nbsp;
                                                <strong>
                                                    {appliedPromo.type === "rate"
                                                        ? `${appliedPromo.value}% 할인`
                                                        : formatPrice(appliedPromo.value)}
                                                </strong>
                                                &nbsp;→ -{formatPrice(promoDiscount)} 적용됨
                                            </span>
                                            <button type="button" className="discount-cancel-btn" onClick={handleCancelPromo}>취소</button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="inline-fields apply-fields">
                                                <input
                                                    type="text"
                                                    placeholder="프로모션 코드 입력 (예: WELCOME10)"
                                                    value={promoInput}
                                                    onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
                                                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                                                />
                                                <button type="button" className="dark-btn small" onClick={handleApplyPromo}>적용</button>
                                            </div>
                                            {promoError && <p className="error-text">{promoError}</p>}
                                        </>
                                    )}
                                </div>

                                <div className="discount-split">

                                    {/* 포인트 */}
                                    <div className="discount-box">
                                        <div className="discount-box-head">
                                            <span>포인트 사용</span>
                                            <strong>사용가능: {availablePoint.toLocaleString()}원</strong>
                                        </div>
                                        {appliedPoint > 0 ? (
                                            <div className="discount-applied-row">
                                                <span className="discount-applied-tag">
                                                    -{appliedPoint.toLocaleString()}원 적용됨
                                                </span>
                                                <button type="button" className="discount-cancel-btn" onClick={handleCancelPoint}>취소</button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="inline-fields apply-fields">
                                                    <input
                                                        type="text"
                                                        placeholder="사용할 포인트 입력"
                                                        value={pointInput}
                                                        onChange={(e) => { setPointInput(e.target.value.replace(/[^0-9]/g, "")); setPointError(""); }}
                                                        onKeyDown={(e) => e.key === "Enter" && handleApplyPoint()}
                                                    />
                                                    <button type="button" className="dark-btn small" onClick={handleApplyPoint}>적용</button>
                                                </div>
                                                {/* <div className="point-quick-btns">
                                                    {[1000, 3000, 5000].map(v => (
                                                        <button
                                                            key={v}
                                                            type="button"
                                                            className="point-quick-btn"
                                                            onClick={() => setPointInput(String(Math.min(v, availablePoint)))}
                                                        >
                                                            +{v.toLocaleString()}
                                                        </button>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        className="point-quick-btn"
                                                        onClick={() => setPointInput(String(availablePoint))}
                                                    >
                                                        전액
                                                    </button>
                                                </div> */}
                                                {pointError && <p className="error-text">{pointError}</p>}
                                            </>
                                        )}
                                    </div>

                                    {/* 쿠폰 */}
                                    <div className="discount-box">
                                        <div className="discount-box-head">
                                            <span>쿠폰 적용</span>
                                            <strong>사용가능: {usableCouponList.length}장</strong>
                                        </div>
                                        {appliedCoupon ? (
                                            <div className="discount-applied-row">
                                                <span className="discount-applied-tag">
                                                    {appliedCoupon.couponName} &nbsp;
                                                    <strong>-{formatPrice(couponDiscount)}</strong> 적용됨
                                                </span>
                                                <button type="button" className="discount-cancel-btn" onClick={handleCancelCoupon}>취소</button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="inline-fields apply-fields">
                                                    <select
                                                        value={selectedCouponId}
                                                        onChange={(e) => {
                                                            const id = e.target.value;
                                                            setSelectedCouponId(id);
                                                            setCouponError("");
                                                            if (id) {
                                                                const coupon = usableCouponList.find(c => c.id === id);
                                                                if (coupon) setAppliedCoupon(coupon);
                                                            } else {
                                                                setAppliedCoupon(null);
                                                            }
                                                        }}
                                                        className="coupon-select"
                                                        style={{ flex: 1 }}
                                                    >
                                                        <option value="">쿠폰을 선택해주세요</option>
                                                        {usableCouponList.map(c => (
                                                            <option key={c.id} value={c.id}>
                                                                {c.couponName} ({c.benefit}) · ~{c.period?.split(" ~ ")[1] || "기한없음"}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {usableCouponList.length === 0 && (
                                                    <p className="discount-empty-text">사용 가능한 쿠폰이 없습니다.</p>
                                                )}
                                                {couponError && <p className="error-text">{couponError}</p>}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* 총 할인 요약 */}
                                {totalDiscount > 0 && (
                                    <div className="discount-summary">
                                        <span>총 할인 금액</span>
                                        <strong className="discount-total">-{formatPrice(totalDiscount)}</strong>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 4 결제 수단 */}
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
                                <button type="button" key={method.id} className={`method-card ${selectedMethod === method.id ? "is-active" : ""}`} onClick={() => setSelectedMethod(method.id)}>
                                    <div className="method-card-copy">
                                        <strong>{method.title}</strong>
                                        <p>{method.description}</p>
                                    </div>
                                    {method.badges && (
                                        <div className="method-badges">
                                            {method.badges.map((badge) => <span key={badge}>{badge}</span>)}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="payment-faq-section">
                        {FAQ_ITEMS.map((item) => {
                            const isOpen = openFaq === item.id;
                            return (
                                <div className={`faq-item ${isOpen ? "is-open" : ""}`} key={item.id}>
                                    <button type="button" className="faq-question" onClick={() => setOpenFaq(isOpen ? "" : item.id)}>
                                        <span>{item.question}</span>
                                        <i>{isOpen ? "−" : "+"}</i>
                                    </button>
                                    {isOpen && <p className="faq-answer">{item.answer}</p>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* STEP 5 주문 요약 */}
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
                                        <p>{item.option}</p>
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
                                <span>배송비</span>
                                <strong>{shippingFee === 0 ? "무료" : formatPrice(shippingFee)}</strong>
                            </div>
                            <div className="summary-line">
                                <span>지역 배송비</span>
                                <strong>{localShippingFee === 0 ? "무료" : formatPrice(localShippingFee)}</strong>
                            </div>
                            {promoDiscount > 0 && (
                                <div className="summary-line summary-line--discount">
                                    <span>프로모션 할인</span>
                                    <strong>-{formatPrice(promoDiscount)}</strong>
                                </div>
                            )}
                            {appliedPoint > 0 && (
                                <div className="summary-line summary-line--discount">
                                    <span>포인트 사용</span>
                                    <strong>-{formatPrice(appliedPoint)}</strong>
                                </div>
                            )}
                            {couponDiscount > 0 && (
                                <div className="summary-line summary-line--discount">
                                    <span>쿠폰 할인</span>
                                    <strong>-{formatPrice(couponDiscount)}</strong>
                                </div>
                            )}
                        </div>

                        <div className="summary-total-row">
                            <span>총 결제금액</span>
                            <strong>{finalTotal.toLocaleString()}</strong>
                        </div>

                        <div className="delivery-note">
                            <strong>예상 배송일 : {expectedDeliveryDate}</strong>
                            <p>배송 완료 후 7일 이내 교환/반품 가능</p>
                        </div>

                        <button type="button" className="order-submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "주문 처리중" : "주문하기"}
                        </button>

                        <p className="summary-terms">
                            주문하기를 클릭하면 <strong>이용약관</strong> 및 <strong>개인정보처리방침</strong>에 동의하는 것으로 간주됩니다
                        </p>

                        <p className="selected-method-copy">선택한 결제 수단: {activeMethod.title}</p>
                    </div>
                </aside>
            </div>

            {showAddressModal && (
                <AddressPopup onClose={() => setShowAddressModal(false)} onSelect={handleAddressSelect} />
            )}
            {showPayModal && (
                <PaymentModal
                    method={activeMethod}
                    finalTotal={finalTotal}
                    onSuccess={handlePaySuccess}
                    onClose={() => setShowPayModal(false)}
                />
            )}
        </main>
    );
}
