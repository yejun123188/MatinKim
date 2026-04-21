import React, { useState } from "react";
import UserInfoMain from "../components/UserInfoMain";
import UserMenus from "../components/UserMenus";
import { useLocation } from "react-router-dom";
import "./scss/userInfo.scss";
import WishList from "../components/WishList";
import OrderList from "../components/OrderList";
import CouponList from "../components/CouponList";
import SavedMoney from "../components/SavedMoney";

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
        return <OrderList />;
      case "위시리스트":
        return <WishList />;
      case "적립금":
        return <SavedMoney />;
      case "쿠폰":
        return <CouponList />;
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
    <section className="sub-section info-sec">
      <div className="inner user-info-wrap">
        <div className="user-info-left">
          <UserMenus sendSelect={handleMenuClick} selectMenu={selectMenu} />
        </div>
        <div className="user-info-right">
          {selectMenu !== "마이페이지" && <h2>{selectMenu}</h2>}
          <div>{handleContent()}</div>
        </div>
      </div>
    </section>
  );
}
