import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import KimMatinSupportNav from "../components/KimMatinSupportNav";
import { useAuthStore } from "../store/useAuthStore";
import "./scss/QnaWrite.scss";
import "./scss/KimMatinSupport.scss";

const inquiryCategories = [
  "주문/결제문의",
  "배송문의",
  "교환/반품문의",
  "상품문의",
  "기타문의",
];

export default function KimMatinQna() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const writerName = user?.displayName || user?.name || user?.email || "회원";

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
    files: [],
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "files") {
      const selectedFiles = Array.from(files || []);

      setForm((prev) => ({
        ...prev,
        files: (() => {
          const nextFiles = [...prev.files, ...selectedFiles];

          if (nextFiles.length > 3) {
            alert("첨부파일은 최대 3개까지 등록할 수 있습니다.");
          }

          return nextFiles.slice(0, 3);
        })(),
      }));

      e.target.value = "";
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const handleRemoveFile = (targetIndex) => {
    setForm((prev) => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== targetIndex),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {
      subject: !form.subject.trim(),
      writer: !writerName.trim(),
      email: !form.email.trim(),
      category: !form.category.trim(),
      content: !form.content.trim(),
    };

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      alert("제목, 이메일, 문의유형, 내용을 모두 작성해주세요.");
      return;
    }

    const ok = window.confirm("문의를 등록하시겠습니까?");
    if (!ok) return;

    const newInquiry = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      category: form.category,
      subject: form.subject,
      content: form.content,
      writer: writerName,
      email: form.email,
      brand: "KIMMATIN",
      files: form.files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      })),
      reply: "답변대기",
    };

    const saved = JSON.parse(localStorage.getItem("inquiries")) || [];
    localStorage.setItem("inquiries", JSON.stringify([newInquiry, ...saved]));

    alert("문의가 등록되었습니다.");
    navigate("/userInfo", {
      state: { menu: "1:1 문의" },
    });
  };

  return (
    <section className="sub-section km-support-page">
      <div className="inner qna-page">
        <div className="qna-inner">
          <KimMatinSupportNav />

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
                        className={errors.subject ? "error" : ""}
                      />
                    </td>
                  </tr>

                  <tr>
                    <th>작성자</th>
                    <td>
                      <input
                        type="text"
                        value={writerName}
                        readOnly
                        className={errors.writer ? "error" : ""}
                      />
                    </td>
                  </tr>

                  <tr>
                    <th>답변 받을 이메일</th>
                    <td>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={errors.email ? "error" : ""}
                        placeholder="example@email.com"
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
                        className={errors.category ? "error" : ""}
                      >
                        <option value="">선택하세요</option>
                        {inquiryCategories.map((category) => (
                          <option value={category} key={category}>
                            {category}
                          </option>
                        ))}
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
                        className={errors.content ? "error" : ""}
                      />
                    </td>
                  </tr>

                  <tr>
                    <th>첨부파일</th>
                    <td>
                      <div className="file-input-row">
                        <label className="file-select-btn">
                          파일 선택
                          <input
                            type="file"
                            name="files"
                            multiple
                            onChange={handleChange}
                          />
                        </label>

                        <span className="file-status">
                          {form.files.length > 0
                            ? form.files.map((file) => file.name).join(", ")
                            : "선택된 파일 없음"}
                        </span>
                      </div>

                      {form.files.length > 0 && (
                        <ul className="file-list">
                          {form.files.map((file, index) => (
                            <li key={`${file.name}-${file.lastModified}`}>
                              <span>{file.name}</span>

                              <button type="button" onClick={() => handleRemoveFile(index)}>
                                삭제
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="qna-btn-wrap">
                <button type="submit" className="submit-btn">
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
