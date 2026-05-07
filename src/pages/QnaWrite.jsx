import React, { useState } from "react";
import HelpMenu from "../components/HelpMenu";
import "./scss/QnaWrite.scss";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

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



    const { user } = useAuthStore();
    const navigate = useNavigate();



    const handleSubmit = (e) => {
        e.preventDefault();

        const newInquiry = {
            id: Date.now(),
            date: new Date().toISOString().slice(0, 10),
            category: form.category,
            subject: form.subject,
            content: form.content,
            writer: user?.displayName || user?.name || user?.email || "회원",
            reply: "답변대기",
        };

        const saved = JSON.parse(localStorage.getItem("inquiries")) || [];
        localStorage.setItem("inquiries", JSON.stringify([newInquiry, ...saved]));

        navigate("/inquiry/write");
    };




    return (
        <section className="sub-section">
            <div className="inner qna-page">
                <div className="qna-inner">
                    <HelpMenu />

                    <div className="qna-content">
                        <h2 className="qna">1:1 문의</h2>

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
                                                value={user?.displayName || user?.name || user?.email || "회원"}
                                                readOnly
                                            />
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
                                                <option value="주문/결제문의">주문/결제문의</option>
                                                <option value="배송문의">배송문의</option>
                                                <option value="교환/반품문의">교환/반품문의</option>
                                                <option value="상품문의">상품문의</option>
                                                <option value="기타문의">기타문의</option>
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

                                <button type="submit" className="submit-btn"
                                >
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