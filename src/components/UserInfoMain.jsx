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

const gradeColor = {
  FRIENDS: "#4A3AFF",
  GOLD: "#F3B94C",
  VIP: "#FF3D3D",
};

const orderStatusList = ["결제완료", "배송준비중", "배송중", "배송완료"];
const DELIVERY_COMPLETE_MS = 30 * 24 * 60 * 60 * 1000;

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
  }, [user]);

  useEffect(() => {
    if (user?.uid) onLoadWishList(user.uid);
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const mainOrders = useMemo(
    () =>
      getAllOrders(now)
        .flatMap((o) =>
          o.orders.map((order) => ({
            ...order,
            createdAt: o.createdAt,
          }))
        )
        .filter((order) => {
          if (!orderStatusList.includes(order.status)) return false;
          if (order.status !== "배송완료") return true;

          return (
            now - new Date(order.createdAt).getTime() <
            DELIVERY_COMPLETE_MS
          );
        }),
    [now]
  );

  const displayName = user?.name || user?.nickname || "고객";
  const localInfo = getLocalPurchaseInfo(user);

  const purchaseAmount = Number(localInfo.purchaseAmount || 0);
  const purchaseCount = Number(localInfo.purchaseCount || 0);

  const grade = getMemberGrade(purchaseAmount);
  const totalPoint = savedMoneySummary.totalPoint || 0;
  const couponCount = couponList.length;

  const sortedWishList = [...wishList].sort(
    (a, b) => (a.isSoldOut ? 1 : 0) - (b.isSoldOut ? 1 : 0)
  );

  const getWishPrice = (wish) =>
    wish.discountRate > 0 ? wish.discountPrice : wish.price;

  const handleAddCart = (wish) => {
    if (wish.isSoldOut) return;

    const item = {
      id: wish.id,
      name: wish.name,
      price: getWishPrice(wish),
      mainImg: wish.mainImg,
      image: wish.mainImg || wish.hoverImg,
      key:
        wish.key ||
        `${wish.id}-${wish.selectedSize}-${wish.selectedColor}`,
      size: wish.selectedSize,
      color: wish.selectedColor,
      count: wish.quantity || 1,
    };

    onAddCart(item);

    // ⭐ branchHY 기능 유지 (팝업)
    setCartItem(wish);
    setShowCartPopup(true);
  };

  const handleRemoveWish = async (wish) => {
    await onRemoveWish(wish.key, user?.uid);
    alert("상품이 삭제되었습니다");
  };

  return (
    <div className="main">
      {/* 계정 */}
      <div className="frist-line">
        <UserInfoMainBox title="Account Informations" className="my-info">
          <div className="my-info-wrap">
            <p>
              반가워요! <strong>{displayName}</strong> 님
            </p>
            <ul className="myinfo-list">
              <li>
                <p>
                  <strong style={{ color: gradeColor[grade] }}>
                    {grade}
                  </strong>{" "}
                  등급입니다
                </p>
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

      {/* 주문 */}
      <div className="second-line">
        <UserInfoMainBox title="My Orders" className="my-order">
          {mainOrders.length > 0 ? (
            <Swiper slidesPerView={2.7} spaceBetween={24} modules={[FreeMode]}>
              {mainOrders.map((order) => (
                <SwiperSlide className="order-product" key={order.id}>
                  <img src={order.img} alt={order.name} />
                  <p>{order.name}</p>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <UserInfoNone title="주문" />
          )}
        </UserInfoMainBox>
      </div>

      {/* 위시리스트 */}
      <div className="third-line">
        <UserInfoMainBox title="My Wishlist" className="my-wish">
          {sortedWishList.length > 0 ? (
            <Swiper slidesPerView={2.7} spaceBetween={24} modules={[FreeMode]}>
              {sortedWishList.map((wish) => (
                <SwiperSlide
                  className={`wish-product${
                    wish.isSoldOut ? " is-soldout" : ""
                  }`}
                  key={wish.key || wish.id}
                >
                  <img src={wish.mainImg} alt={wish.name} />

                  <p>{wish.name}</p>

                  <p>
                    {wish.isSoldOut
                      ? "SOLD OUT"
                      : `${wish.selectedSize} / ${wish.quantity}개`}
                  </p>

                  {!wish.isSoldOut && (
                    <button onClick={() => handleAddCart(wish)}>
                      Add To Cart
                    </button>
                  )}

                  <button onClick={() => handleRemoveWish(wish)}>
                    Remove
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <UserInfoNone title="관심상품" />
          )}
        </UserInfoMainBox>
      </div>

      {/* ⭐ branchHY 핵심 기능 유지 */}
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