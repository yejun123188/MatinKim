import React, { useState } from "react";
import { getQuickRangeValues } from "../utils/orderDateUtils";
import "./scss/InquiryList.scss";
import UserInfoNone from "./UserInfoNone";

const inquiryRows = [
  {
    id: 1,
    date: "2026-04-28",
    category: "배송문의",
    subject: "언제 출고되나요?",
    content: "주문한 상품의 출고 일정을 알고 싶습니다.",
    writer: "마뗑킴",
    reply: "답변대기",
  },
  {
    id: 2,
    date: "2026-04-07",
    category: "상품문의",
    subject: "사이즈 추천 부탁드립니다",
    content: "평소 착용 사이즈 기준으로 추천 부탁드립니다.",
    writer: "마뗑킴",
    reply: "답변완료",
  },
];

const periodOptions = [
  { value: "all", label: "전체" },
  { value: "week", label: "일주일" },
  { value: "month", label: "한달" },
  { value: "threeMonths", label: "세달" },
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

  const filteredRows = inquiryRows.filter((row) => {
    const matchesDate = isWithinDateRange(row.date, period);
    const targetText = row[searchType] || "";
    const matchesKeyword = targetText
      .toLowerCase()
      .includes(keyword.trim().toLowerCase());

    return matchesDate && matchesKeyword;
  });

  return (
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
            <th>DATE</th>
            <th>CATEGORY</th>
            <th>SUBJECT</th>
            <th>WRITER</th>
            <th>REPLY</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.length > 0 ? (
            filteredRows.map((row) => (
              <tr key={row.id}>
                <td>{row.date}</td>
                <td>{row.category}</td>
                <td className="subject">{row.subject}</td>
                <td>{row.writer}</td>
                <td>{row.reply}</td>
              </tr>
            ))
          ) : (
            <UserInfoNone title="문의" />
          )}
        </tbody>
      </table>

      <div className="inquiry-bottom">
        <button type="button" className="inquiry-write-btn">
          작성
        </button>
      </div>
    </div>
  );
}
