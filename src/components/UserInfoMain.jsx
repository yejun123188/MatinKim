import React, { useState, useEffect, useMemo } from "react";
import UserInfoMainBox from "./UserInfoMainBox";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "./scss/userInfoMain.scss";
import { FreeMode } from "swiper/modules";
import UserInfoNone from "./UserInfoNone";
import {
  getGradeBenefit,
  getLocalPurchaseInfo,
  getMemberGrade,
  useAuthStore,
} from "../store/useAuthStore";
import { getAllOrders } from "../utils/orderStorage";
import { useProductStore } from "../store/useProductStore";
import { useNavigate } from "react-router-dom";
import WishItem from "./WishItem";
import CartPopup from "../pages/CartPopup";
import Cart from "../pages/Cart";

const statusCode = {
  주문확인중: "ORDER",
  배송준비중: "READY",
  배송시작: "START",
  배송중: "ING",
  배송완료: "DONE",
};

const gradeColor = {
  BASIC: "#888",
  SILVER: "#A0A0A0",
  GOLD: "#D4AF37",
  VIP: "#C0392B",
  VVIP: "#8E44AD",
};

const userInfo = {
  name: "MATIN KIM",
  purchaseAmount: 0,
  purchaseCount: 0,
};

const getMembershipGuide = (grade) => {
  const benefit = getGradeBenefit(grade);
  return benefit.summary;
};

const orderStatusList = ["결제완료", "배송준비중", "배송중", "배송완료"];

const DELIVERY_COMPLETE_MS = 30 * 24 * 60 * 60 * 1000;

const formatCount = (count) => `${Number(count || 1).toLocaleString()}개`;

const parseOrderDate = (dateString) => {
  if (!dateString) return null;

  if (/^\d{8}$/.test(String(dateString))) {
    const str = String(dateString);
    const year = str.slice(0, 4);
    const month = str.slice(4, 6);
    const day = str.slice(6, 8);
    const time = new Date(`${year}-${month}-${day}`).getTime();

    return Number.isNaN(time) ? null : time;
  }

  const time = new Date(dateString).getTime();
  return Number.isNaN(time) ? null : time;
};

export default function UserInfoMain() {
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [cartItem, setCartItem] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [now, setNow] = useState(Date.now());

  const navigate = useNavigate();

  const {
    user,
    couponList,
    savedMoneySummary,
    onFetchCoupons,
    onFetchSavedMoney,
  } = useAuthStore();

  const { wishList, onLoadWishList } = useProductStore();

  useEffect(() => {
    onFetchCoupons();
    onFetchSavedMoney();
  }, [user, onFetchCoupons, onFetchSavedMoney]);

  useEffect(() => {
    if (user?.uid) {
      onLoadWishList(user.uid);
    }
  }, [user?.uid, onLoadWishList]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const mainOrders = useMemo(() => {
    return getAllOrders(now)
      .flatMap((o) =>
        o.orders.map((order) => ({
          ...order,
          createdAt: o.createdAt,
          date: o.date,
        }))
      )
      .filter((order) => {
        if (!orderStatusList.includes(order.status)) return false;
        if (order.status !== "배송완료") return true;

        const createdAtTime = new Date(order.createdAt).getTime();

        if (!Number.isNaN(createdAtTime)) {
          return now - createdAtTime < DELIVERY_COMPLETE_MS;
        }

        const orderDateTime = parseOrderDate(order.date);
        if (!orderDateTime) return false;

        return now - orderDateTime < DELIVERY_COMPLETE_MS;
      });
  }, [now]);

  const displayName = user?.name || user?.nickname || userInfo.name;

  const localPurchaseInfo = getLocalPurchaseInfo(user);

  const purchaseAmount = Number(
    localPurchaseInfo?.purchaseAmount ??
      user?.purchaseAmount ??
      user?.orderPrice ??
      userInfo.purchaseAmount
  );

  const purchaseCount = Number(
    localPurchaseInfo?.purchaseCount ??
      user?.purchaseCount ??
      user?.orderCount ??
      userInfo.purchaseCount
  );

  const grade = getMemberGrade(purchaseAmount);
  const membershipGuide = getMembershipGuide(grade);
  const membershipGuideParts = membershipGuide.split(/,\s*/);

  const totalPoint = savedMoneySummary?.totalPoint || 0;
  const couponCount = user ? couponList.length : 0;

  const sortedWishList = [...wishList].sort(
    (a, b) => (a.isSoldOut ? 1 : 0) - (b.isSoldOut ? 1 : 0)
  );

  return (
    <div className="main">
      <div className="frist-line">
        <UserInfoMainBox title="Account Informations" className="my-info">
          <div className="my-info-wrap">
            <ul className="myinfo-list">
              <li>
                <div>
                  <p>{displayName}님은</p>

                  <p className="grade-line">
                    <strong
                      style={{
                        color: gradeColor[grade],
                      }}
                    >
                      {grade} 등급
                    </strong>
                    입니다.

                    <span className="question">
                      <img src="./images/userinfo/question.svg" alt="question" />

                      <span>
                        {membershipGuideParts.map((part, index) => (
                          <React.Fragment key={`${part}-${index}`}>
                            {index > 0 && (
                              <span className="guide-comma">, </span>
                            )}
                            <span className="guide-part">{part}</span>
                          </React.Fragment>
                        ))}
                      </span>
                    </span>
                  </p>
                </div>
              </li>

              <li>
                <p className="my-total-price">총 구매 금액</p>
                <span>
                  {purchaseAmount.toLocaleString()}원 / ({purchaseCount}회)
                </span>
              </li>
            </ul>
          </div>
        </UserInfoMainBox>

        <UserInfoMainBox title="My Wallet" className="my-wallet">
          <ul className="my-wallet-list">
            <li>
              <span>총 적립금</span>
              <strong>{totalPoint.toLocaleString()} 원</strong>
            </li>
            <li>
              <span>내 쿠폰</span>
              <strong>{couponCount} 개</strong>
            </li>
          </ul>
        </UserInfoMainBox>
      </div>

      <div className="second-line">
        <UserInfoMainBox title="My Orders" className="my-order">
          {mainOrders.length > 0 ? (
            <Swiper
              className="order-list"
              slidesPerView={2.7}
              spaceBetween={24}
              modules={[FreeMode]}
            >
              {mainOrders.map((order) => (
                <SwiperSlide className="order-product" key={order.id}>
                  <div className="img-box">
                    <img src={order.img} alt={order.name} />
                  </div>

                  <div className="text-box">
                    <div className={`status status-${statusCode[order.status]}`}>
                      {order.status === "배송중" && (
                        <span className="dot"></span>
                      )}
                      {order.status}
                    </div>

                    <div className="product-text">
                      <p className="order-name">{order.name}</p>
                      <p className="order-count">
                        {order.size || "-"} / {formatCount(order.count)}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <UserInfoNone title="주문" />
          )}
        </UserInfoMainBox>
      </div>

      <div className="third-line">
        <UserInfoMainBox title="My Wishlist" className="my-wish">
          {sortedWishList.length > 0 ? (
            <Swiper
              slidesPerView={2.7}
              spaceBetween={24}
              freeMode={true}
              modules={[FreeMode]}
              className="wish-list"
            >
              {sortedWishList.map((wish) => (
                <SwiperSlide
                  className={`wish-product${wish.isSoldOut ? " soldout" : ""}`}
                  key={wish.key || wish.id}
                >
                  <WishItem
                    wish={wish}
                    variant="card"
                    onCartPopup={(item) => {
                      setCartItem(item);
                      setShowCartPopup(true);
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <UserInfoNone title="관심상품" />
          )}
        </UserInfoMainBox>
      </div>

      {showCartPopup && (
        <CartPopup
          mode="wish"
          product={cartItem}
          selectedColor={cartItem?.selectedColor}
          selectedSize={cartItem?.selectedSize}
          quantity={cartItem?.quantity}
          onClose={() => setShowCartPopup(false)}
          onGoCart={() => {
            setShowCartPopup(false);
            setShowCart(true);
          }}
        />
      )}

      {showCart && <Cart onClose={() => setShowCart(false)} />}
    </div>
  );
}