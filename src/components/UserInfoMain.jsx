import React, { useState } from "react";
import UserInfoMainBox from "./UserInfoMainBox";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "./scss/userInfoMain.scss";
import { FreeMode } from "swiper/modules";
import UserInfoNone from "./UserInfoNone";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
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

const user = {
  name: "마뗑킴",
  grade: "VIP",
  benefits: "적립 3%,구매 할인 7%, 생일쿠폰 20%",
  orderCount: 34,
  orderPrice: 946000,
  pointCount: 5000,
  couponCount: 3,
};

const orders = [
  {
    id: 1,
    name: "MATIN KIM CIRCLE LOGO TOP FOR MEN IN BLACK",
    img: "https://matinkim.com/web/product/medium/202604/d6581a7ba9b5fa28d8890d1ad3aa9b42.jpg",
    price: 68000,
    status: "배송준비중",
    size: "L",
    count: 1,
  },
  {
    id: 2,
    name: "PATCHWORK CARGO BERMUDA PANTS FOR MEN IN BEIGE",
    img: "https://matinkim.com/web/product/medium/202604/af24497fdacbac8b575687c878af7669.jpg",
    price: 198000,
    status: "배송중",
    size: "L",
    count: 1,
  },
  {
    id: 3,
    name: "MATIN LIGHT MESH CAP IN BLACK",
    img: "https://cafe24img.poxo.com/kimdaniyaya/web/product/medium/202603/de8e4df27a4d897c4f265a7c5ac38a09.jpg",
    price: 58000,
    status: "배송완료",
    size: "FREE",
    count: 1,
  },
];

export default function UserInfoMain() {
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [cartItem, setCartItem] = useState(null);
  const [showCart, setShowCart] = useState(false);

  const { wishList } = useProductStore();
  const { user: authUser } = useAuthStore();
  const navigate = useNavigate();

  const sortedWishList = [...wishList].sort((a, b) => {
    const aOut = a.isSoldOut ? 1 : 0;
    const bOut = b.isSoldOut ? 1 : 0;
    return aOut - bOut;
  });

  return (
    <div className="main">
      <div className="frist-line">
        <UserInfoMainBox title="Account Informations" className="my-info">
          <div className="my-info-wrap">
            <p>
              반가워요! <strong>{user.name}</strong> 님!
            </p>
            <ul className="myinfo-list">
              <li>
                <p>
                  {user.name}님은 <br />
                  <strong>{user.grade}등급</strong> 입니다!
                </p>
                <div className="question">
                  <img src="./images/userinfo/question.svg" alt="question" />
                  <p>적립 3%,구매 할인 7%, 생일쿠폰 20%</p>
                </div>
              </li>
              <li>
                <p className="my-total-price">총 구매 금액</p>
                <span>
                  {user.orderPrice.toLocaleString()}원 / ({user.orderCount}회)
                </span>
              </li>
            </ul>
          </div>
        </UserInfoMainBox>
        <UserInfoMainBox title="My Wallet" className="my-wallet">
          <ul className="my-wallet-list">
            <li>
              <span>총 적립금</span>
              <strong>{user.pointCount.toLocaleString()} 원</strong>
            </li>
            <li>
              <span>내 쿠폰</span>
              <strong>{user.couponCount} 개</strong>
            </li>
          </ul>
        </UserInfoMainBox>
      </div>

      <div className="second-line">
        <UserInfoMainBox title="My Orders" className="my-order">
          {orders.length > 0 ? (
            <Swiper
              slidesPerView={2.7}
              spaceBetween={24}
              freeMode={true}
              modules={[FreeMode]}
              className="order-list"
            >
              {orders.map((order) => (
                <SwiperSlide className="order-product" key={order.id}>
                  <div className="img-box">
                    <img src={order.img} alt={order.name} />
                  </div>
                  <div className="text-box">
                    <div className={`status status-${statusCode[order.status]}`}>
                      {order.status === "배송중" && <span className="dot"></span>}
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
                <SwiperSlide
                  className={`wish-product${wish.isSoldOut ? " soldout" : ""}`}
                  key={wish.key}
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