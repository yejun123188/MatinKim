import React, { useState } from "react";
import "./scss/FindId.scss";

export default function FindId() {
    const [findType, setFindType] = useState("email");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState(["", "", ""]);


    const handleSubmit = (e) => {
        e.preventDefault();

        // 이름 체크
        if (!name.trim()) {
            alert("이름을 입력하세요.");
            return;
        }

        // 휴대폰번호 체크
        if (
            findType === "phone" &&
            phone.some((item) => item.trim() === "")
        ) {
            alert("휴대폰번호를 입력하세요.");
            return;
        }

        alert("아이디 찾기 완료");
    };

    return (
        <section className="sub-section">
            <div className="inner find-id-page">
                <div className="find-id-page">
                    <div className="find-id-box">
                        <h2>아이디 찾기</h2>

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
                                    <input type="email" />
                                </div>
                            ) : (
                                <div className="input-group phone-group">
                                    <label>휴대폰번호</label>

                                    <div className="phone-input-wrap">
                                        <input type="text" maxLength="3" />

                                        <span>-</span>

                                        <input type="text" maxLength="4" />

                                        <span>-</span>

                                        <input type="text" maxLength="4" />
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