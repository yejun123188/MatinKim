import React from "react";
import UserInfo from "../pages/UserInfo";
import UserInfoMain from "./UserInfoMain";

const userMenu = [
  "주문내역",
  "위시리스트",
  "적립금",
  "쿠폰",
  "배송지 관리",
  "1:1 문의",
  "최근 본 상품",
  "내 계정",
  "로그아웃",
];

export default function UserMenus({ sendSelect }) {
  return (
    <div className="info-list">
      <h2 onClick={() => sendSelect("마이페이지")}>마이페이지</h2>
      <ul>
        {userMenu.map((menu, id) => (
          <li key={id}>
            <button onClick={() => sendSelect(menu)}>{menu}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
