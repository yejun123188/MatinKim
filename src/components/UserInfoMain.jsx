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
  getGradeBenefit,
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

const userInfo = {
  name: "MATIN KIM",
  purchaseAmount: 0,
  purchaseCount: 0,
};

const getMembershipGuide = (grade) => {
  const benefit = getGradeBenefit(grade);

  return `마뗑킴의 회원이 되시면 다양한 혜택을 받아 보실 수 있습니다.

현재 ${grade} 등급 혜택: ${benefit.summary}

1. 회원가입 시 바로 사용할 수 있는 5,000원 신규 적립금 지급
2. 1만원 이상 구매 시 구매금액의 ${benefit.pointRate}% 적립금 지급
3. 배송 완료 시점으로부터 7일 후 적립금 사용 가능

VIP - 적립 3%, 구매 할인 7%, 생일쿠폰 20%
GOLD - 적립 2%, 구매 할인 5%, 생일쿠폰 15%
FRIENDS - 적립 1%, WELCOME 쿠폰 5%

SALE 상품 제외 상시 적용, 전 고객 무료배송
회원등급은 6개월마다 구매금액 기준으로 조정됩니다.
생일쿠폰은 발급일로부터 30일 이내 사용 가능합니다.

적립금은 최소 결제금액 및 1회 사용 한도 없이 사용 가능합니다.
적립금을 사용한 결제 건은 구매 적립금이 지급되지 않습니다.`;
};

const orderStatusList = [
  "결제완료",
  "배송준비중",
  "배송중",
  "배송완료",
];

const DELIVERY_COMPLETE_MS =
  30 * 24 * 60 * 60 * 1000;

const formatPrice = (price) =>
  `₩ ${Number(price || 0).toLocaleString()}`;

const formatCount = (count) =>
  `${Number(count || 1).toLocaleString()}개`;

const parseOrderDate = (dateString) => {
  if (!dateString) return null;

  if (/^\d{8}$/.test(String(dateString))) {
    const str = String(dateString);

    const year = str.slice(0, 4);
    const month = str.slice(4, 6);
    const day = str.slice(6, 8);

    const time = new Date(
      `${year}-${month}-${day}`
    ).getTime();

    return Number.isNaN(time) ? null : time;
  }

  const time = new Date(dateString).getTime();

  return Number.isNaN(time) ? null : time;
};

export default function UserInfoMain() {
  const navigate = useNavigate();

  const [now, setNow] = useState(Date.now());

  const [cartItem, setCartItem] =
    useState(null);

  const [showCartPopup, setShowCartPopup] =
    useState(false);

  const [showCart, setShowCart] =
    useState(false);

  const {
    user,
    couponList,
    savedMoneySummary,
    onFetchCoupons,
    onFetchSavedMoney,
  } = useAuthStore();

  const {
    wishList,
    onLoadWishList,
    onRemoveWish,
    onAddCart,
  } = useProductStore();

  useEffect(() => {
    onFetchCoupons();
    onFetchSavedMoney();
  }, [
    user,
    onFetchCoupons,
    onFetchSavedMoney,
  ]);

  useEffect(() => {
    if (user?.uid) {
      onLoadWishList(user.uid);
    }
  }, [user, onLoadWishList]);

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
        if (
          !orderStatusList.includes(order.status)
        ) {
          return false;
        }

        if (order.status !== "배송완료") {
          return true;
        }

        const createdAtTime = new Date(
          order.createdAt
        ).getTime();

        if (!Number.isNaN(createdAtTime)) {
          return (
            now - createdAtTime <
            DELIVERY_COMPLETE_MS
          );
        }

        const orderDateTime =
          parseOrderDate(order.date);

        if (!orderDateTime) return false;

        return (
          now - orderDateTime <
          DELIVERY_COMPLETE_MS
        );
      });
  }, [now]);

  const displayName =
    user?.name ||
    user?.nickname ||
    userInfo.name;

  const localPurchaseInfo =
    getLocalPurchaseInfo(user);

  const purchaseAmount = Number(
    localPurchaseInfo.purchaseAmount ??
      user?.purchaseAmount ??
      user?.orderPrice ??
      userInfo.purchaseAmount
  );

  const purchaseCount = Number(
    localPurchaseInfo.purchaseCount ??
      user?.purchaseCount ??
      user?.orderCount ??
      userInfo.purchaseCount
  );

  const grade =
    getMemberGrade(purchaseAmount);
  const membershipGuide = getMembershipGuide(grade);

  const totalPoint =
    savedMoneySummary?.totalPoint || 0;

  const couponCount = user
    ? couponList.length
    : 0;

  const sortedWishList = [...wishList].sort(
    (a, b) =>
      (a.isSoldOut ? 1 : 0) -
      (b.isSoldOut ? 1 : 0)
  );

  const getWishPrice = (wish) =>
    wish.discountRate > 0
      ? wish.discountPrice
      : wish.price;

  const handleBuyNow = (wish) => {
    if (wish.isSoldOut) return;

    navigate("/payment", {
      state: {
        orderItems: [
          {
            id: wish.id,
            brand: "MATIN KIM",
            name: wish.name,
            option: `${
              wish.selectedColor || "-"
            } / ${
              wish.selectedSize || "-"
            }`,
            quantity: wish.quantity || 1,
            price: getWishPrice(wish),
            image:
              wish.mainImg ||
              wish.hoverImg ||
              "",
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
      mainImg: wish.mainImg,
      image:
        wish.mainImg || wish.hoverImg,
      key:
        wish.key ||
        `${wish.id}-${wish.selectedSize}-${wish.selectedColor}`,
      size: wish.selectedSize,
      color: wish.selectedColor,
      count: wish.quantity || 1,
    };

    onAddCart(item);

    setCartItem(wish);
    setShowCartPopup(true);
  };

  const handleRemoveWish = async (
    wish
  ) => {
    await onRemoveWish(
      wish.key,
      user?.uid
    );

    alert("상품이 삭제되었습니다");
  };

  return (
    <div className="main">

      <div className="frist-line">

        <UserInfoMainBox
          title="Account Informations"
          className="my-info"
        >
          <div className="my-info-wrap">

            <p>
              반가워요!{" "}
              <strong>{displayName}</strong> 님
            </p>

            <ul className="myinfo-list">

              <li>
                <div>
                  <p>{displayName}님은</p>

                  <p>
                    <strong
                      style={{
                        color:
                          gradeColor[grade],
                      }}
                    >
                      {grade} 등급
                    </strong>
                    입니다.
                  </p>
                </div>

                <div className="question">
                  <img
                    src="./images/userinfo/question.svg"
                    alt="question"
                  />

                  <p>
                    {membershipGuide}
                  </p>
                </div>
              </li>

              <li>
                <p className="my-total-price">
                  총 구매 금액
                </p>

                <span>
                  {purchaseAmount.toLocaleString()}
                  원 / ({purchaseCount}회)
                </span>
              </li>

            </ul>
          </div>
        </UserInfoMainBox>

        <UserInfoMainBox
          title="My Wallet"
          className="my-wallet"
        >
          <ul className="my-wallet-list">

            <li>
              <span>총 적립금</span>

              <strong>
                {totalPoint.toLocaleString()} 원
              </strong>
            </li>

            <li>
              <span>내 쿠폰</span>

              <strong>
                {couponCount} 개
              </strong>
            </li>

          </ul>
        </UserInfoMainBox>

      </div>

      <div className="second-line">

        <UserInfoMainBox
          title="My Orders"
          className="my-order"
        >
          {mainOrders.length > 0 ? (

            <Swiper
              className="order-list"
              slidesPerView={2.7}
              spaceBetween={24}
              modules={[FreeMode]}
            >

              {mainOrders.map((order) => (

                <SwiperSlide
                  className="order-product"
                  key={order.id}
                >

                  <div className="img-box">
                    <img
                      src={order.img}
                      alt={order.name}
                    />
                  </div>

                  <div className="text-box">

                    <div
                      className={`status status-${statusCode[order.status]}`}
                    >
                      {order.status ===
                        "배송중" && (
                        <span className="dot"></span>
                      )}

                      {order.status}
                    </div>

                    <div className="product-text">

                      <p className="order-name">
                        {order.name}
                      </p>

                      <p className="order-count">
                        {order.size || "-"} /{" "}
                        {formatCount(
                          order.count
                        )}
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

        <UserInfoMainBox
          title="My Wishlist"
          className="my-wish"
        >
          {sortedWishList.length > 0 ? (

            <Swiper
              className="wish-list"
              slidesPerView={2.7}
              spaceBetween={24}
              modules={[FreeMode]}
            >

              {sortedWishList.map((wish) => (

                <SwiperSlide
                  className="wish-product"
                  key={
                    wish.key || wish.id
                  }
                >

                  <div className="img-box">
                    <img
                      src={
                        wish.mainImg ||
                        wish.hoverImg
                      }
                      alt={wish.name}
                    />
                  </div>

                  <div className="text-box">

                    <div className="text-wrap">

                      <p className="wish-name">
                        {wish.name}
                      </p>

                      <p className="wish-price">

                        {formatPrice(
                          getWishPrice(wish)
                        )}

                        {wish.discountRate >
                          0 && (
                          <span>
                            {formatPrice(
                              wish.price
                            )}
                          </span>
                        )}

                      </p>

                      <p className="wish-count">
                        {wish.selectedSize ||
                          "-"}{" "}
                        /{" "}
                        {formatCount(
                          wish.quantity
                        )}
                      </p>

                    </div>

                    <div className="button-wrap">

                      {!wish.isSoldOut && (
                        <>

                          <button
                            className="Bbtn"
                            onClick={() =>
                              handleBuyNow(
                                wish
                              )
                            }
                          >
                            바로구매
                          </button>

                          <button
                            className="Wbtn"
                            onClick={() =>
                              handleAddCart(
                                wish
                              )
                            }
                          >
                            장바구니
                          </button>

                        </>
                      )}

                      <button
                        className="Wbtn"
                        onClick={() =>
                          handleRemoveWish(
                            wish
                          )
                        }
                      >
                        삭제
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
          mode="wish"
          product={cartItem}
          selectedColor={
            cartItem?.selectedColor
          }
          selectedSize={
            cartItem?.selectedSize
          }
          quantity={cartItem?.quantity}
          onClose={() =>
            setShowCartPopup(false)
          }
          onGoCart={() => {
            setShowCartPopup(false);
            setShowCart(true);
          }}
        />
      )}

      {showCart && (
        <Cart
          onClose={() =>
            setShowCart(false)
          }
        />
      )}

    </div>
  );
}
