import React, { useState } from "react";
import "./scss/FindId.scss";
import { useNavigate } from "react-router-dom";

export default function FindId() {
    const [findType, setFindType] = useState("email");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState(["", "", ""]);

    const navigate = useNavigate();

    const handlePhoneChange = (index, value) => {
        const newPhone = [...phone];
        newPhone[index] = value;
        setPhone(newPhone);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("이름을 입력하세요.");
            return;
        }

        if (
            findType === "phone" &&
            phone.some((item) => item.trim() === "")
        ) {
            alert("휴대폰번호를 입력하세요.");
            return;
        }

        navigate("/findid/result", {
            state: {
                findType,
                name,
                phone: phone.join("-"),
            },
        });
    };

    return (
        <section className="sub-section">
            <div className="inner find-id-page">
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

                        <button
                            type="submit"
                            className="confirm-btn"
                        >
                            확인
                        </button>

                    </form>

                </div>
            </div>
        </section>
    );
}