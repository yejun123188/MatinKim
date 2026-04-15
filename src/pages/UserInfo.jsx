import React, { useState } from "react";
import UserInfoMain from "../components/UserInfoMain";
import UserMenus from "../components/UserMenus";
import { useLocation } from "react-router-dom";
import "./scss/userInfo.scss";

export default function UserInfo() {
  const location = useLocation();

  const [selectMenu, setSelectMenu] = useState(
    location.state?.menu || "마이페이지",
  );

  const handleMenuClick = (menu) => {
    setSelectMenu(menu);
  };

  const handleContent = () => {
    switch (selectMenu) {
      case "주문내역":
        return <p></p>;
      case "위시리스트":
        return <p></p>;
      case "적립금":
        return <p></p>;
      case "쿠폰":
        return <p></p>;
      case "배송지 관리":
        return <p></p>;
      case "1:1 문의":
        return <p></p>;
      case "최근 본 상품":
        return <p></p>;
      case "내 계정":
        return <p></p>;
      case "로그아웃":
        return <p></p>;

      default:
        return <UserInfoMain />;
    }
  };

  return (
    <section className="sub-section">
      <div className="inner user-info-wrap">
        <div className="user-info-left">
          <UserMenus sendSelect={handleMenuClick} />
        </div>
        <div className="user-info-right">
          <h2>{selectMenu}</h2>
          <div>{handleContent()}</div>
        </div>
      </div>
    </section>
  );
}
