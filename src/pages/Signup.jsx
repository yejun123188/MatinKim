import React, { useMemo, useRef, useState } from "react";
import "./scss/Signup.scss";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function Signup() {
    const [form, setForm] = useState({
        userId: "",
        password: "",
        passwordConfirm: "",
        name: "",
        phone1: "010",
        phone2: "",
        phone3: "",
        emailId: "",
        emailDomain: "",
        emailSelect: "",
        gender: "",
        birthYear: "",
        birthMonth: "",
        birthDay: "",
        agreeAge: false,
        agreeTerms: false,
        agreePrivacy: false,
        agreeMarketing: false,
    });
    const navigate = useNavigate();
    const { onMember } = useAuthStore();

    const termsRefs = useRef({});

    const [agreements, setAgreements] = useState({
        all: false,
        service: false,
        privacy: false,
        sms: false,
    });

    const [openSection, setOpenSection] = useState("service");

    const termsData = useMemo(
        () => ({
            service: {
                title: "[필수] 이용약관 동의",
                required: true,
                content: `
제1조(목적)
이 약관은 (주)마뗑킴 (전자상거래 사업자)이 운영하는 MATINKIM.COM 사이버 몰(이하 “몰”이라 한다)에서 제공하는 인터넷 관련 서비스(이하 “서비스”라 한다)를 이용함에 있어 사이버 몰과 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
※ 「PC통신, 무선 등을 이용하는 전자상거래」에 대해서도 그 성질에 반하지 않는 한 이 약관을 준용합니다.

제2조(정의)
① “몰”이란 (주)마뗑킴 회사가 재화 또는 용역(이하 “재화 등”이라 함)을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말하며, 아울러 사이버몰을 운영하는 사업자의 의미로도 사용합니다.
② “이용자”란 “몰”에 접속하여 이 약관에 따라 “몰”이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
③ “회원”이라 함은 “몰”에 개인정보를 제공하여 회원등록을 한 자로서, “몰”의 정보를 지속적으로 제공받으며 “몰”이 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
④ “비회원”이라 함은 회원에 가입하지 않고 “몰”이 제공하는 서비스를 이용하는 자를 말합니다.

제3조(약관 등의 명시와 설명 및 개정)
① “몰”은 이 약관의 내용과 상호, 영업소 소재지 주소, 대표자의 성명, 사업자등록번호, 연락처 등을 이용자가 쉽게 알 수 있도록 초기 서비스 화면에 게시합니다.
② “몰”은 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제에 관한 법률 등 관련 법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
③ “몰”이 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 몰의 초기화면에 그 적용일자 7일 이전부터 공지합니다.

제4조(서비스의 제공 및 변경)
① “몰”은 다음과 같은 업무를 수행합니다.
1. 재화 또는 용역에 대한 정보 제공 및 구매계약의 체결
2. 구매계약이 체결된 재화 또는 용역의 배송
3. 기타 “몰”이 정하는 업무
      `,
            },
            privacy: {
                title: "[필수] 개인정보 수집 및 이용 동의",
                required: true,
                content: `
1. 수집하는 개인정보 항목
회사는 회원가입, 서비스 제공을 위해 다음과 같은 개인정보를 수집할 수 있습니다.
- 이름
- 아이디
- 비밀번호
- 휴대전화번호
- 이메일 주소

2. 개인정보 수집 및 이용 목적
수집한 개인정보는 다음의 목적을 위해 활용됩니다.
- 회원 식별 및 본인 확인
- 상품 주문, 배송, 결제 처리
- 고객 문의 대응 및 공지사항 전달
- 서비스 개선 및 맞춤형 서비스 제공

3. 개인정보 보유 및 이용기간
회사는 회원 탈퇴 시까지 개인정보를 보유 및 이용합니다.
단, 관계 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관합니다.

4. 동의를 거부할 권리
이용자는 개인정보 수집 및 이용 동의를 거부할 수 있으나, 필수항목 동의 거부 시 회원가입이 제한될 수 있습니다.
      `,
            },
            sms: {
                title: "[선택] SMS 수신을 동의하십니까?",
                required: false,
                content: `
회사는 이벤트, 혜택, 할인 정보, 신상품 소식 등을 SMS로 발송할 수 있습니다.

- 수신 동의 여부와 관계없이 서비스 이용은 가능합니다.
- 수신 동의 후에도 언제든지 마이페이지 또는 고객센터를 통해 철회할 수 있습니다.
      `,
            },
        }),
        []
    );

    const handleAllChange = () => {
        const nextValue = !agreements.all;

        setAgreements({
            all: nextValue,
            service: nextValue,
            privacy: nextValue,
            sms: nextValue,
        });
    };

    const handleSingleChange = (key) => {
        setAgreements((prev) => {
            const next = {
                ...prev,
                [key]: !prev[key],
            };

            return {
                ...next,
                all: next.service && next.privacy && next.sms,
            };
        });
    };

    const handleToggleSection = (key) => {
        setOpenSection((prev) => {
            const nextValue = prev === key ? null : key;

            setTimeout(() => {
                if (nextValue && termsRefs.current[key]) {
                    termsRefs.current[key].scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                    });
                }
            }, 30);

            return nextValue;
        });
    };

    const canSubmit = agreements.service && agreements.privacy;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleEmailSelect = (e) => {
        const value = e.target.value;

        if (value === "direct") {
            setForm((prev) => ({
                ...prev,
                emailSelect: value,
                emailDomain: "",
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                emailSelect: value,
                emailDomain: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!canSubmit) {
            alert("필수 약관에 동의해주세요.");
            return;
        }

        if (!form.userId || !form.password || !form.passwordConfirm || !form.name) {
            alert("필수 입력값을 모두 입력해주세요.");
            return;
        }

        if (form.password !== form.passwordConfirm) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!form.emailId || !form.emailDomain) {
            alert("이메일을 입력해주세요.");
            return;
        }

        const email = `${form.emailId}@${form.emailDomain}`;
        const phone = `${form.phone1}-${form.phone2}-${form.phone3}`;
        const birth = `${form.birthYear}-${form.birthMonth}-${form.birthDay}`;

        try {
            await onMember({
                userId: form.userId,
                uName: form.name,
                email,
                password: form.password,
                phone,
                gender: form.gender,
                birth,
                agreements,
                nickname: "",
                profile: "",
            });


            navigate("/");
        } catch (err) {
            console.error("회원가입 실패:", err);
            alert(err.message || "회원가입 실패");
        }
    };

    return (
        <section className="sub-section">
            <div className="signup-page">
                <div className="inner signup">
                    <div className="signup-inner">
                        <h2 className="signup-title">회원가입</h2>

                        <form className="signup-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>
                                    아이디 <span>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="userId"
                                    placeholder="영문소문자/숫자, 4~16자"
                                    value={form.userId}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    비밀번호 <span>*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="영문대소문자/숫자/특수문자 중 2가지 이상 조합, 10자~16자"
                                    value={form.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    비밀번호 확인 <span>*</span>
                                </label>
                                <input
                                    type="password"
                                    name="passwordConfirm"
                                    value={form.passwordConfirm}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    이름 <span>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    휴대전화 <span>*</span>
                                </label>

                                <div className="phone-row">
                                    <div className="select-box">
                                        <select name="phone1" value={form.phone1} onChange={handleChange}>
                                            <option value="010">010</option>
                                            <option value="011">011</option>
                                            <option value="016">016</option>
                                            <option value="017">017</option>
                                            <option value="018">018</option>
                                            <option value="019">019</option>
                                        </select>
                                        <img src="/images/sub-signup/arrow-icon.svg" alt="화살표" className="select-arrow" />

                                    </div>

                                    -

                                    <input
                                        type="text"
                                        name="phone2"
                                        value={form.phone2}
                                        onChange={handleChange}
                                        maxLength={4}
                                    />

                                    -

                                    <input
                                        type="text"
                                        name="phone3"
                                        value={form.phone3}
                                        onChange={handleChange}
                                        maxLength={4}
                                    />


                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    이메일 <span>*</span>
                                </label>

                                <div className="email-row">
                                    <input
                                        type="text"
                                        name="emailId"
                                        value={form.emailId}
                                        onChange={handleChange}
                                    />
                                    <span className="email-at">@</span>
                                    <input
                                        type="text"
                                        name="emailDomain"
                                        value={form.emailDomain}
                                        onChange={handleChange}
                                        disabled={form.emailSelect !== "direct" && form.emailSelect !== ""}
                                    />
                                    <div className="select-box">
                                        <select
                                            name="emailSelect"
                                            value={form.emailSelect}
                                            onChange={handleEmailSelect}
                                        >
                                            <option value="">이메일 선택</option>
                                            <option value="naver.com">naver.com</option>
                                            <option value="gmail.com">gmail.com</option>
                                            <option value="daum.net">daum.net</option>
                                            <option value="hanmail.net">hanmail.net</option>
                                            <option value="nate.com">nate.com</option>
                                            <option value="direct">직접 입력</option>
                                        </select>
                                        <img src="/images/sub-signup/arrow-icon.svg" alt="화살표" className="select-arrow" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    성별 <span></span>
                                </label>

                                <div className="radio-row">
                                    <label className="radio-item">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="female"
                                            checked={form.gender === "female"}
                                            onChange={handleChange}
                                        />
                                        <span className="gender">여성</span>
                                    </label>

                                    <label className="radio-item">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="male"
                                            checked={form.gender === "male"}
                                            onChange={handleChange}
                                        />
                                        <span className="gender">남성</span>
                                    </label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    생년월일 <span></span>
                                </label>

                                <div className="birth-row">
                                    <input
                                        type="text"
                                        name="birthYear"
                                        value={form.birthYear}
                                        onChange={handleChange}
                                    />
                                    <span>년</span>

                                    <input
                                        type="text"
                                        name="birthMonth"
                                        value={form.birthMonth}
                                        onChange={handleChange}
                                    />
                                    <span>월</span>

                                    <input
                                        type="text"
                                        name="birthDay"
                                        value={form.birthDay}
                                        onChange={handleChange}
                                    />
                                    <span>일</span>
                                </div>
                            </div>

                            <div className="terms-box">
                                <h3 className="terms-title">약관동의</h3>

                                <label className="agree-row agree-all">
                                    <input
                                        type="checkbox"
                                        checked={agreements.all}
                                        onChange={handleAllChange}
                                    />
                                    <span className="custom-check"></span>
                                    <span className="agree-text">
                                        이용약관 및 개인정보수집 및 이용, 쇼핑정보 수신(선택)에 모두 동의합니다.
                                    </span>
                                </label>

                                <div className="agree-list">
                                    <div className="agree-item" ref={(el) => (termsRefs.current.service = el)}>
                                        <div className="agree-header">
                                            <label className="agree-row">
                                                <input
                                                    type="checkbox"
                                                    checked={agreements.service}
                                                    onChange={() => handleSingleChange("service")}
                                                />
                                                <span className="custom-check"></span>
                                                <span className="agree-label">{termsData.service.title}</span>
                                            </label>

                                            <button
                                                type="button"
                                                className={`toggle-btn ${openSection === "service" ? "open" : ""}`}
                                                onClick={() => handleToggleSection("service")}
                                                aria-label="이용약관 열기"
                                            >
                                                <span></span>
                                            </button>
                                        </div>

                                        {openSection === "service" && (
                                            <div className="terms-content scroll-box">
                                                <div className="terms-inner">
                                                    {termsData.service.content}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="agree-item" ref={(el) => (termsRefs.current.privacy = el)}>
                                        <div className="agree-header">
                                            <label className="agree-row">
                                                <input
                                                    type="checkbox"
                                                    checked={agreements.privacy}
                                                    onChange={() => handleSingleChange("privacy")}
                                                />
                                                <span className="custom-check"></span>
                                                <span className="agree-label">{termsData.privacy.title}</span>
                                            </label>

                                            <button
                                                type="button"
                                                className={`toggle-btn ${openSection === "privacy" ? "open" : ""}`}
                                                onClick={() => handleToggleSection("privacy")}
                                                aria-label="개인정보 수집 및 이용 동의 열기"
                                            >
                                                <span></span>
                                            </button>
                                        </div>

                                        {openSection === "privacy" && (
                                            <div className="terms-content scroll-box">
                                                <div className="terms-inner">
                                                    {termsData.privacy.content}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="agree-item" ref={(el) => (termsRefs.current.sms = el)}>
                                        <div className="agree-header">
                                            <label className="agree-row">
                                                <input
                                                    type="checkbox"
                                                    checked={agreements.sms}
                                                    onChange={() => handleSingleChange("sms")}
                                                />
                                                <span className="custom-check"></span>
                                                <span className="agree-label">{termsData.sms.title}</span>
                                            </label>

                                            <button
                                                type="button"
                                                className={`toggle-btn ${openSection === "sms" ? "open" : ""}`}
                                                onClick={() => handleToggleSection("sms")}
                                                aria-label="SMS 수신 동의 열기"
                                            >
                                                <span></span>
                                            </button>
                                        </div>

                                        {openSection === "sms" && (
                                            <div className="terms-content scroll-box">
                                                <div className="terms-inner">
                                                    {termsData.sms.content}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className={`submit-btn ${canSubmit ? "active" : ""}`}
                                    disabled={!canSubmit}
                                >
                                    가입하기
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}