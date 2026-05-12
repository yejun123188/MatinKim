import React, { useEffect, useState } from "react";
import { getQuickRangeValues } from "../utils/orderDateUtils";
import "./scss/InquiryList.scss";
import UserInfoNone from "./UserInfoNone";
import { useNavigate } from "react-router-dom";

const periodOptions = [
  { value: "all", label: "전체" },
  { value: "week", label: "1주일" },
  { value: "month", label: "1개월" },
  { value: "threeMonths", label: "3개월" },
];

const isWithinDateRange = (date, period) => {
  if (period === "all") return true;

  const range = getQuickRangeValues(period);

  return (
    (!range.startDate || date >= range.startDate) &&
    (!range.endDate || date <= range.endDate)
  );
};

export default function InquiryList() {
  const [period, setPeriod] = useState("all");
  const [searchType, setSearchType] = useState("subject");
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const [rows, setRows] = useState(() => {
    return JSON.parse(localStorage.getItem("inquiries")) || [];
  });

  const filteredRows = rows.filter((row) => {
    const matchesDate = isWithinDateRange(row.date, period);
    const targetText = row[searchType] || "";
    const matchesKeyword = targetText
      .toLowerCase()
      .includes(keyword.trim().toLowerCase());

    return matchesDate && matchesKeyword;
  });

  const handleDeleteInquiry = (id) => {
    const ok = window.confirm("문의 내역을 삭제하시겠습니까?");
    if (!ok) return;

    setRows((prev) => {
      const updated = prev.filter((row) => String(row.id) !== String(id));
      localStorage.setItem("inquiries", JSON.stringify(updated));
      return updated;
    });

    alert("문의 내역이 삭제되었습니다.");
  };

  useEffect(() => {
    const waitingRows = rows.filter((row) => row.reply === "답변대기");

    const timers = waitingRows.map((row, index) =>
      setTimeout(
        () => {
          setRows((prev) => {
            const updated = prev.map((item) =>
              item.id === row.id ? { ...item, reply: "답변완료" } : item,
            );

            localStorage.setItem("inquiries", JSON.stringify(updated));

            return updated;
          });
        },
        (index + 1) * 3000,
      ),
    );

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  return (
    <>
      <div className="inquiry-list-wrap">
        <div className="inquiry-search">
          <select
            value={period}
            aria-label="조회 기간"
            onChange={(e) => setPeriod(e.target.value)}
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={searchType}
            aria-label="검색 조건"
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="subject">제목</option>
            <option value="content">내용</option>
          </select>

          <div>
            <input
              type="text"
              aria-label="검색어"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="button">검색</button>
          </div>
        </div>

        <table className="inquiry-table">
          <thead>
            <tr>
              <th>날짜</th>
              <th>분류</th>
              <th>제목</th>
              <th>작성자</th>
              <th>답변상태</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.date}</td>
                  <td>{row.category}</td>

                  <td className="subject">
                    <button
                      type="button"
                      className="subject-btn"
                      onClick={() => navigate(`/inquiry/${row.id}`)}
                    >
                      {row.subject}
                    </button>
                  </td>

                  <td>{row.writer}</td>

                  <td>
                    <span>{row.reply}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="delete-inquiry-btn"
                      onClick={() => handleDeleteInquiry(row.id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="empty-inquiry">
                  <UserInfoNone title="문의" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="inquiry-bottom">
        <button
          type="button"
          className="inquiry-write-btn"
          onClick={() => navigate("/board")}
        >
          작성
        </button>
      </div>
    </>
  );
}
