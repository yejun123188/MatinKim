import React, { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import "./scss/SavedMoney.scss";
import UserInfoNone from "./UserInfoNone";

const tabs = [
  { key: "history", label: "적립내역 보기" },
  { key: "pending", label: "미가용적립내용보기" },
  { key: "grade", label: "회원등급적립내역" },
];

const formatPoint = (point) => `${Number(point || 0).toLocaleString()}원`;

export default function SavedMoney() {
  const [tab, setTab] = useState("history");
  const { user, savedMoneyList, savedMoneySummary, onFetchSavedMoney } =
    useAuthStore();

  useEffect(() => {
    onFetchSavedMoney();
  }, [user, onFetchSavedMoney]);

  const currentList = useMemo(
    () => savedMoneyList.filter((item) => item.type === tab),
    [savedMoneyList, tab],
  );

  return (
    <div className="savedmoney-wrap">
      <div className="saved-top">
        <div className="my-saved">
          <p>내 적립금</p>
        </div>
        <div className="my-saved-middle">
          <div className="list-wrap">
            <ul className="left-list">
              <li>
                <div className="text">• 총 적립금</div>
                <p className="price">
                  {formatPoint(savedMoneySummary.totalPoint)}
                </p>
              </li>
              <li>
                <div className="text">• 사용가능 적립금</div>
                <p className="price">
                  {formatPoint(savedMoneySummary.availablePoint)}
                </p>
              </li>
              <li>
                <div className="text">• 사용된 적립금</div>
                <p className="price">
                  {formatPoint(savedMoneySummary.usedPoint)}
                </p>
              </li>
            </ul>
            <ul className="right-list">
              <li>
                <div className="text">• 미가용 적립금</div>
                <p className="price">
                  {formatPoint(savedMoneySummary.unavailablePoint)}
                </p>
              </li>
              <li>
                <div className="text">• 환불예정 적립금</div>
                <p className="price">
                  {formatPoint(savedMoneySummary.refundPoint)}
                </p>
              </li>
            </ul>
          </div>
          <ul className="explain-list">
            <li>
              • 주문으로 발생한 적립금은 배송완료 후 7일 부터 실제 사용 가능한
              적립금으로 전환됩니다. 배송완료 시점으로부터 7일 동안은 미가용
              적립금으로 분류됩니다.
            </li>
            <li>
              • 미가용 적립금은 반품, 구매취소 등을 대비한 임시 적립금으로
              사용가능 적립금으로 전환되기까지 상품구매에 사용하실 수 없습니다.
            </li>
            <li>
              • 사용가능 적립금(총적립금 - 사용된적립금 - 미가용적립금)은
              상품구매 시 바로 사용가능합니다.
            </li>
          </ul>
        </div>
      </div>
      <div className="saved-bottom">
        <div className="top-menu">
          {tabs.map((item) => (
            <p
              key={item.key}
              className={tab === item.key ? "active" : ""}
              onClick={() => setTab(item.key)}
            >
              {item.label}
            </p>
          ))}
        </div>

        <table>
          <thead>
            <tr>
              <th>주문날짜</th>
              <th>적립금</th>
              <th>관련주문</th>
              <th>내용</th>
            </tr>
          </thead>

          <tbody>
            {currentList.length > 0 ? (
              currentList.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{formatPoint(item.point)}</td>
                  <td>{item.order}</td>
                  <td>{item.desc}</td>
                </tr>
              ))
            ) : (
              <UserInfoNone title="적립금" />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
