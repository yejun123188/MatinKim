import React, { useState } from "react";
import "./scss/FindPw.scss";

export default function FindPw() {
    const [findType, setFindType] = useState("email");
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState(["", "", ""]);

    const handlePhoneChange = (index, value) => {
        const newPhone = [...phone];
        newPhone[index] = value;
        setPhone(newPhone);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!userId.trim()) {
            alert("아이디를 입력하세요.");
            return;
        }

        if (!name.trim()) {
            alert("이름을 입력하세요.");
            return;
        }

        if (findType === "email" && !email.trim()) {
            alert("이메일을 입력하세요.");
            return;
        }

        if (
            findType === "phone" &&
            phone.some((item) => item.trim() === "")
        ) {
            alert("휴대폰번호를 입력하세요.");
            return;
        }

        alert("비밀번호 찾기 완료");
    };

    return (
        <section className="sub-section">
            <div className="inner find-pw-page">
                <div className="find-pw-page">
                    <div className="find-pw-box">
                        <h2>비밀번호 찾기</h2>

                        <div className="find-type">
                            <label>
                                <input
                                    type="radio"
                                    name="findType"
                                    checked={findType === "email"}
                                    onChange={() => setFindType("email")}
                                />
                                이메일
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="findType"
                                    checked={findType === "phone"}
                                    onChange={() => setFindType("phone")}
                                />
                                휴대폰번호
                            </label>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>아이디</label>
                                <input
                                    type="text"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <label>이름</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            {findType === "email" ? (
                                <div className="input-group">
                                    <label>이메일</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            ) : (
                                <div className="input-group phone-group">
                                    <label>휴대폰번호</label>

                                    <div className="phone-input-wrap">
                                        <input
                                            type="text"
                                            maxLength="3"
                                            value={phone[0]}
                                            onChange={(e) =>
                                                handlePhoneChange(0, e.target.value)
                                            }
                                        />

                                        <span>-</span>

                                        <input
                                            type="text"
                                            maxLength="4"
                                            value={phone[1]}
                                            onChange={(e) =>
                                                handlePhoneChange(1, e.target.value)
                                            }
                                        />

                                        <span>-</span>

                                        <input
                                            type="text"
                                            maxLength="4"
                                            value={phone[2]}
                                            onChange={(e) =>
                                                handlePhoneChange(2, e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="confirm-btn">
                                확인
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}