import React, { useState } from "react";
import HelpMenu from "../components/HelpMenu";
import "./scss/QnaWrite.scss";
import { useNavigate } from "react-router-dom";

export default function QnaWrite() {
    const [form, setForm] = useState({
        subject: "",
        writer: "",
        password: "",
        email: "",
        phone1: "010",
        phone2: "",
        phone3: "",
        category: "",
        content: "",
        file: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("1:1 문의 등록", form);
    };



    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // 등록 처리

        navigate("/board");
    };

    return (
        <section className="sub-section">
            <div className="inner qna-page">
                <div className="qna-inner">
                    <HelpMenu />

                    <div className="qna-content">
                        <h2>1:1 문의</h2>

                        <form className="qna-write-form" onSubmit={handleSubmit}>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>제목</th>
                                        <td>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={form.subject}
                                                onChange={handleChange}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>작성자</th>
                                        <td>
                                            <input
                                                type="text"
                                                name="writer"
                                                value={form.writer}
                                                onChange={handleChange}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>비밀번호</th>
                                        <td>
                                            <input
                                                type="password"
                                                name="password"
                                                value={form.password}
                                                onChange={handleChange}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>이메일</th>
                                        <td>
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>휴대전화</th>
                                        <td>
                                            <div className="phone-box">
                                                <select
                                                    name="phone1"
                                                    value={form.phone1}
                                                    onChange={handleChange}
                                                >
                                                    <option value="010">010</option>
                                                    <option value="011">011</option>
                                                    <option value="016">016</option>
                                                    <option value="017">017</option>
                                                    <option value="018">018</option>
                                                    <option value="019">019</option>
                                                </select>
                                                <span>-</span>
                                                <input
                                                    type="text"
                                                    name="phone2"
                                                    value={form.phone2}
                                                    onChange={handleChange}
                                                />
                                                <span>-</span>
                                                <input
                                                    type="text"
                                                    name="phone3"
                                                    value={form.phone3}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>문의유형</th>
                                        <td>
                                            <select
                                                name="category"
                                                value={form.category}
                                                onChange={handleChange}
                                            >
                                                <option value="">선택하세요</option>
                                                <option value="order">주문/결제</option>
                                                <option value="delivery">배송</option>
                                                <option value="return">교환/반품</option>
                                                <option value="product">상품</option>
                                                <option value="etc">기타</option>
                                            </select>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>내용</th>
                                        <td>
                                            <textarea
                                                name="content"
                                                value={form.content}
                                                onChange={handleChange}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>첨부파일</th>
                                        <td>
                                            <input
                                                type="file"
                                                name="file"
                                                onChange={handleChange}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="qna-btn-wrap">
                                <button type="button" className="cancel-btn">
                                    취소
                                </button>

                                <button type="button" className="submit-btn"
                                    onClick={() => navigate("/inquiry/write")}>
                                    등록
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </section >
    );
}