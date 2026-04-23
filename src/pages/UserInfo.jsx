import React, { useEffect, useState } from "react";
import UserInfoMain from "../components/UserInfoMain";
import UserMenus from "../components/UserMenus";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./scss/userInfo.scss";
import WishList from "../components/WishList";
import OrderList from "../components/OrderList";
import CouponList from "../components/CouponList";
import SavedMoney from "../components/SavedMoney";
import { useAuthStore } from "../store/useAuthStore";
import OrderDetail from "../components/OrderDetail";
import OrderRequest from "../components/OrderRequest";

const myMenu = "마이페이지";
const orderMenu = "주문내역";

export default function UserInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: orderId, action } = useParams();
  const { onLogout } = useAuthStore();

  const [selectMenu, setSelectMenu] = useState(location.state?.menu || myMenu);

  useEffect(() => {
    if (orderId) {
      setSelectMenu(orderMenu);
      return;
    }

    if (location.state?.menu) {
      setSelectMenu(location.state.menu);
    }
  }, [location.state?.menu, orderId]);

  const handleMenuClick = async (menu) => {
    if (menu === "로그아웃") {
      try {
        await onLogout();
        navigate("/");
      } catch (err) {
        console.error("로그아웃 실패:", err);
        alert("로그아웃에 실패했습니다.");
      }
      return;
    }

    setSelectMenu(menu);
  };

  const handleContent = () => {
    if (action) return <OrderRequest />;
    if (orderId) return <OrderDetail />;

    switch (selectMenu) {
      case orderMenu:
        return <OrderList />;
      case "위시리스트":
        return <WishList />;
      case "적립금":
        return <SavedMoney />;
      case "쿠폰":
        return <CouponList />;
      case "배송지 관리":
        return <Adress />;
      case "1:1 문의":
        return <p></p>;
      case "최근 본 상품":
        return <p></p>;
      case "내 계정":
        return <p></p>;
      default:
        return <UserInfoMain />;
    }
  };

  const isDetailMode = Boolean(orderId);

  return (
    <section className="sub-section info-sec">
      <div
        className={`inner user-info-wrap ${isDetailMode ? "detail-mode" : ""}`}
      >
        {!isDetailMode && (
          <div className="user-info-left">
            <UserMenus sendSelect={handleMenuClick} selectMenu={selectMenu} />
          </div>
        )}

        <div className="user-info-right">
          {!isDetailMode && selectMenu !== myMenu && <h2>{selectMenu}</h2>}
          <div className="user-info-content">{handleContent()}</div>
        </div>
      </div>
    </section>
  );
}
