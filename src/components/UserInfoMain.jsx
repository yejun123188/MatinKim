import React from "react";
import UserInfoMainBox from "./UserInfoMainBox";

const statusCode = {
  주문확인: "ORDER",
  상품준비중: "READY",
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
    status: "상품준비중",
    size: "L",
    count: "1",
  },
  {
    id: 2,
    name: "PATCHWORK CARGO BERMUDA PANTS FOR MEN IN BEIGE",
    img: "https://matinkim.com/web/product/medium/202604/af24497fdacbac8b575687c878af7669.jpg",
    price: 198000,
    status: "배송중",
    size: "L",
    count: "1",
  },
  {
    id: 3,
    name: "MATIN LIGHT MESH CAP IN BLACK",
    img: "https://cafe24img.poxo.com/kimdaniyaya/web/product/medium/202603/de8e4df27a4d897c4f265a7c5ac38a09.jpg",
    price: 58000,
    status: "배송완료",
    size: "FREE",
    count: "1",
  },
];

const wishs = [
  {
    id: 1,
    name: "CAMOUFLAGE LOGO BALL CAP IN BEIGE",
    img: "https://cafe24img.poxo.com/kimdaniyaya/web/product/medium/202602/377cb8c737dfecc223743aada3501cf5.jpg",
    price: 68000,
    discountRate: 0,
    discountPrice: 68000,
    size: "FREE",
    count: "1",
  },
  {
    id: 2,
    name: "WAIST BUCKLE STITCH POINT TWILL DENIM PANTS IN BROWN",
    img: "https://matinkim.com/web/product/medium/202602/fd89a5a318d1273c27a797ae411a5273.jpg",
    price: 124600,
    discountRate: 30,
    discountPrice: 178000,
    size: "M",
    count: "1",
  },
  {
    id: 3,
    name: "MATIN KIM LOGO WAFFLE TOP FOR MEN IN LIGHT BEIGE",
    img: "https://matinkim.com/web/product/medium/202603/61b2d05e56a5c7a435b49d89e32d4bde.jpg",
    price: 70200,
    discountRate: 10,
    discountPrice: 78000,
    size: "L",
    count: "2",
  },
];

export default function UserInfoMain() {
  return (
    <>
      <div className="frist-line">
        <UserInfoMainBox title="Account informations" className="my-info">
          <p>
            반가워요! <strong>{user.name}</strong> 님!
          </p>
          <ul className="myinfo-list">
            <li>
              {user.name}님은 <br />
              <strong>{user.grade}등급</strong> 입니다!
            </li>
            <li>
              총 구매 금액 <span>{user.orderPrice.toLocaleString()}원</span>
              <span>{user.orderCount}회</span>
            </li>
          </ul>
        </UserInfoMainBox>
        <UserInfoMainBox title="My wallet" className="my-wallet">
          <ul className="my-wallet-list">
            <li>
              <span>쿠폰</span>
              <strong>{user.couponCount}장</strong>
            </li>
            <li>
              <span>적립금</span>
              <strong>{user.pointCount.toLocaleString()}원</strong>
            </li>
          </ul>
        </UserInfoMainBox>
      </div>
      <div className="second-line">
        <UserInfoMainBox title="My Orders" className="my-order">
          <ul className="order-list">
            {orders.map((order) => (
              <li key={order.id}>
                <div className="img-box">
                  <img src={order.img} alt={order.name} />
                </div>
                <div className="text-box">
                  <div className={`status status-${statusCode[order.status]}`}>
                    {order.status === "배송중" && <span className="dot"></span>}
                    {order.status}
                  </div>
                  <p>{order.name}</p>
                  <p>
                    {order.size} / {order.count}개
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </UserInfoMainBox>
      </div>
      <div className="third-line">
        <UserInfoMainBox title="My Wishlist" className="my-wish">
          <ul className="wish-list">
            {wishs.map((wish) => (
              <li key={wish.id}>
                <div className="img-box">
                  <img src={wish.img} alt={wish.name} />
                </div>
                <div className="text-box">
                  <div className="text-wrap">
                    <p>{wish.name}</p>
                    <p>
                      ￦{wish.price.toLocaleString()}
                      {wish.discountRate > 0 && (
                        <span>￦{wish.discountPrice.toLocaleString()}</span>
                      )}
                    </p>
                    <p>
                      {wish.size} / {wish.count}개
                    </p>
                  </div>
                  <div className="button-wrap">
                    <button className="Bbtn">Buy It Now</button>
                    <button className="Wbtn">Add to cart</button>
                    <button className="Wbtn">Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </UserInfoMainBox>
      </div>
    </>
  );
}
