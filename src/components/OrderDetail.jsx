import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ordersData from "../data/ordersData.json";
import "./scss/orderDetail.scss";
import OrderProduct from "./OrderProduct";

const ORDER_MENU = "주문내역";

const formatDate = (date) =>
  `${date.slice(0, 4)}. ${date.slice(4, 6)}. ${date.slice(6, 8)}`;

const formatPrice = (price) => `${price.toLocaleString()}`;

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const detail = ordersData.find((item) => String(item.id) === id);

  const handleBack = () => {
    navigate("/userInfo", {
      state: { menu: ORDER_MENU },
    });
  };

  if (!detail) {
    return (
      <div className="order-detail-page">
        <div>
          <h2>주문 상세보기</h2>
          <button className="order-detail-back" onClick={handleBack}>
            목록으로
          </button>
        </div>
        <section className="order-detail-section">
          <div className="section-head">
            <h3>주문 정보를 찾을 수 없습니다.</h3>
          </div>
          <p>잘못된 주문 경로이거나 더 이상 조회할 수 없는 주문입니다.</p>
        </section>
      </div>
    );
  }

  const {
    state,
    date,
    orders,
    orderNumber,
    name,
    phone,
    address,
    payment,
    deliveryCost = 0,
  } = detail;

  const totalProductPrice = orders.reduce(
    (sum, order) => sum + order.price * order.count,
    0,
  );
  const totalCount = orders.reduce((sum, order) => sum + order.count, 0);
  const totalPrice = totalProductPrice + deliveryCost;

  return (
    <>
      <div className="order-detail-top">
        <h2>주문 상세보기</h2>
        <button className="order-detail-back" onClick={handleBack}>
          목록으로
        </button>
      </div>

      <div className="order-detail-page">
        <div className="order-detail-header">
          <div className="order-detail-section">
            <h2>{formatDate(date)} 주문</h2>
            <span>{state}</span>
          </div>
        </div>
        <section className="order-detail-section">
          <div className="section-head">
            <h3>주문 상품</h3>
            <p>{orders.length}개 상품</p>
          </div>
          <ul className="order-detail-list">
            {orders.map((order) => (
              <li className="order-product" key={order.id}>
                <div className="img-box">
                  <img src={order.img} alt={order.name} />
                  <div className="product-text">
                    <p className="order-status">{order.status}</p>
                    <p className="order-name">{order.name}</p>
                    <p className="order-price">
                      {order.price.toLocaleString()}원
                    </p>
                    <p className="order-count">
                      {order.size} / {order.count}개
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <div className="order-detail-grid">
          <section className="order-detail-section simple">
            <div className="section-head">
              <h3>배송 정보</h3>
            </div>
            <div className="detail-info-list">
              <div>
                <p>받는 분</p>
                <span>{name}</span>
              </div>
              <div>
                <p>연락처</p>
                <span>{phone}</span>
              </div>
              <div>
                <p>주소</p>
                <span>{address}</span>
              </div>
            </div>
          </section>
          <section className="order-detail-section simple">
            <div className="section-head">
              <h3>결제 정보</h3>
            </div>
            <div className="detail-info-list">
              <div>
                <p>상품 금액</p>
                <span>{formatPrice(totalProductPrice)}</span>
              </div>
              <div>
                <p>배송비</p>
                <span>
                  {deliveryCost === 0 ? "무료" : formatPrice(deliveryCost)}
                </span>
              </div>
              <div>
                <p>결제 수단</p>
                <span>{payment}</span>
              </div>
              <div className="is-total">
                <p>최종 결제금액</p>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
