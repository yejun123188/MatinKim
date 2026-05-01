import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserInfoMainBox from "./UserInfoMainBox";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "./scss/userInfoMain.scss";

import { FreeMode } from "swiper/modules";
import UserInfoNone from "./UserInfoNone";
import {
  getLocalPurchaseInfo,
  getMemberGrade,
  useAuthStore,
} from "../store/useAuthStore";
import { getAllOrders } from "../utils/orderStorage";
import { useProductStore } from "../store/useProductStore";
import CartPopup from "../pages/CartPopup";
import Cart from "../pages/Cart";

const statusCode = {
  결제완료: "ORDER",
  배송준비중: "READY",
  배송중: "ING",
  배송완료: "DONE",
};

const userInfo = {
  name: "마뗑킴",
  benefits: "적립 3%, 구매 할인 7%, 생일쿠폰 20%",
  purchaseAmount: 0,
  purchaseCount: 0,
};

const gradeColor = {
  FRIENDS: "#4A3AFF",
  GOLD: "#F3B94C",
  VIP: "#FF3D3D",
};

const orderStatusList = ["결제완료", "배송준비중", "배송중", "배송완료"];
const DELIVERY_COMPLETE_MS = 30 * 24 * 60 * 60 * 1000;
const DELIVERY_COMPLETE_OFFSET_MS = 30 * 1000;

const parseOrderDate = (date) => {
  if (!date || date.length !== 8) return null;

  return new Date(
    Number(date.slice(0, 4)),
    Number(date.slice(4, 6)) - 1,
    Number(date.slice(6, 8)),
  ).getTime();
};

export default function UserInfoMain() {
  const navigate = useNavigate();
  const [now, setNow] = useState(Date.now());
  const [cartItem, setCartItem] = useState(null);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const {
    user,
    couponList,
    savedMoneySummary,
    onFetchCoupons,
    onFetchSavedMoney,
  } = useAuthStore();
  const { wishList, onLoadWishList, onRemoveWish, onAddCart } =
    useProductStore();

  useEffect(() => {
    onFetchCoupons();
    onFetchSavedMoney();
  }, [user, onFetchCoupons, onFetchSavedMoney]);

  useEffect(() => {
    if (user?.uid) {
      onLoadWishList(user.uid);
    }
  }, [user, onLoadWishList]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const mainOrders = useMemo(
    () =>
      getAllOrders(now)
        .flatMap((orderDetail) =>
          orderDetail.orders.map((order) => ({
            ...order,
            createdAt: orderDetail.createdAt,
            date: orderDetail.date,
            orderDetailId: orderDetail.id,
          })),
        )
        .filter((order) => {
          if (!orderStatusList.includes(order.status)) return false;
          if (order.status !== "배송완료") return true;

          const createdAt = new Date(order.createdAt).getTime();
          if (Number.isNaN(createdAt)) {
            const orderDate = parseOrderDate(order.date);
            if (!orderDate) return false;

            return now - orderDate < DELIVERY_COMPLETE_MS;
          }

          return (
            now - (createdAt + DELIVERY_COMPLETE_OFFSET_MS) <
            DELIVERY_COMPLETE_MS
          );
        }),
    [now],
  );

  const displayName = user?.name || user?.nickname || userInfo.name;
  const localPurchaseInfo = getLocalPurchaseInfo(user);
  const purchaseAmount = Number(
    localPurchaseInfo.purchaseAmount ??
      user?.purchaseAmount ??
      user?.orderPrice ??
      userInfo.purchaseAmount,
  );
  const purchaseCount = Number(
    localPurchaseInfo.purchaseCount ??
      user?.purchaseCount ??
      user?.orderCount ??
      userInfo.purchaseCount,
  );
  const grade = getMemberGrade(purchaseAmount);
  const totalPoint = savedMoneySummary.totalPoint || 0;
  const couponCount = user ? couponList.length : 0;
  const sortedWishList = [...wishList].sort(
    (a, b) => (a.isSoldOut ? 1 : 0) - (b.isSoldOut ? 1 : 0),
  );

  const getWishPrice = (wish) =>
    wish.discountRate > 0 ? wish.discountPrice : wish.price;

  const handleBuyNow = (wish) => {
    if (wish.isSoldOut) return;

    navigate("/payment", {
      state: {
        orderItems: [
          {
            id: wish.id,
            brand: "MATIN KIM",
            name: wish.name,
            option: `${wish.selectedColor || "-"} / ${
              wish.selectedSize || "-"
            }`,
            quantity: wish.quantity || 1,
            price: getWishPrice(wish),
            image: wish.mainImg || wish.hoverImg || "",
          },
        ],
      },
    });
  };

  const handleAddCart = (wish) => {
    if (wish.isSoldOut) return;

    const item = {
      id: wish.id,
      name: wish.name,
      price: getWishPrice(wish),
      discountPrice: wish.discountPrice,
      discountRate: wish.discountRate,
      mainImg: wish.mainImg,
      hoverImg: wish.hoverImg,
      image: wish.mainImg || wish.hoverImg,
      key:
        wish.key ||
        `${wish.id}-${wish.selectedSize || ""}-${wish.selectedColor || ""}`,
      size: wish.selectedSize,
      color: wish.selectedColor,
      count: wish.quantity || 1,
    };

    onAddCart(item);
    setCartItem(wish);
    setShowCartPopup(true);
  };

  const handleRemoveWish = async (wish) => {
    await onRemoveWish(wish.key, user?.uid);
    alert("상품이 삭제되었습니다");
  };

  return (
    <div className="main">
      <div className="frist-line">
        <UserInfoMainBox title="Account Informations" className="my-info">
          <div className="my-info-wrap">
            <p>
              반가워요! <strong>{displayName}</strong> 님
            </p>
            <ul className="myinfo-list">
              <li>
                <div>
                  <p>{displayName}님은</p>
                  <p>
                    <strong style={{ color: gradeColor[grade] }}>
                      {grade} 등급
                    </strong>
                    입니다
                  </p>
                </div>
                <div className="question">
                  <img src="./images/userinfo/question.svg" alt="question" />
                  <p>{userInfo.benefits}</p>
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
              slidesPerView={2.7}
              spaceBetween={24}
              freeMode={true}
              modules={[FreeMode]}
              className="order-list"
            >
              {mainOrders.map((order) => (
                <SwiperSlide className="order-product" key={order.id}>
                  <div className="img-box">
                    <img src={order.img} alt={order.name} />
                  </div>
                  <div className="text-box">
                    <div
                      className={`status status-${statusCode[order.status]}`}
                    >
                      {order.status === "배송중" && (
                        <span className="dot"></span>
                      )}
                      {order.status}
                    </div>
                    <div className="product-text">
                      <p className="order-name">{order.name}</p>
                      <p className="order-count">
                        {order.size} / {order.count}개
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
                <SwiperSlide className="wish-product" key={wish.key || wish.id}>
                  <div className="img-box">
                    <img src={wish.mainImg || wish.hoverImg} alt={wish.name} />
                  </div>
                  <div className="text-box">
                    <div className="text-wrap">
                      <p className="wish-name">{wish.name}</p>
                      <p className="wish-price">
                        ￦{getWishPrice(wish)?.toLocaleString()}
                        {wish.discountRate > 0 && (
                          <span>￦{wish.price?.toLocaleString()}</span>
                        )}
                      </p>
                      <p className="wish-count">
                        {wish.selectedSize || "-"} / {wish.quantity || 1}개
                      </p>
                    </div>
                    <div className="button-wrap">
                      {!wish.isSoldOut && (
                        <>
                          <button
                            className="Bbtn"
                            onClick={() => handleBuyNow(wish)}
                          >
                            Buy It Now
                          </button>
                          <button
                            className="Wbtn"
                            onClick={() => handleAddCart(wish)}
                          >
                            Add To Cart
                          </button>
                        </>
                      )}
                      <button
                        className="Wbtn"
                        onClick={() => handleRemoveWish(wish)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
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
          mode="best"
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
