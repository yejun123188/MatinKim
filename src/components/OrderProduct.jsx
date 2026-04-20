import React from "react";
import { Link } from "react-router-dom";

const statusCode = {
  주문확인중: "ORDER",
  배송준비중: "READY",
  배송시작: "START",
  배송중: "ING",
  배송완료: "DONE",
  취소요청처리중: "CANCEL_REQ",
  취소완료: "CANCEL_DONE",
  반품요청처리중: "RETURN_REQ",
  반품완료: "RETURN_DONE",
  조회불가: "NONE",
};

const renderButtons = (status, order, onOrderClick) => {
  if (status === "주문확인중" || status === "배송준비중") {
    return <button className="btn">주문취소</button>;
  }

  if (status === "배송시작" || status === "배송중") {
    return <button className="btn">배송조회</button>;
  }

  if (status === "배송완료") {
    return (
      <div className="order-btn">
        <button className="btn">교환신청</button>
        <button className="btn">반품신청</button>
      </div>
    );
  }

  return (
    <button className="btn" onClick={() => onOrderClick(order)}>
      상품주문
    </button>
  );
};

export default function OrderProduct({ orderDate, orders, onOrderClick }) {
  const dates = [...new Set(orders.map((o) => o.date))];

  return (
    <>
      {dates.map((date) => {
        const dateOrders = orders.filter((order) => order.date === date);
        const showTitle = dateOrders.some(
          (order) => order.status !== "조회불가",
        );

        return (
          <div className="order-list-wrap" key={date}>
            {showTitle && (
              <div className="order-list-title">
                <div className="order-date">
                  <p>{orderDate}</p>
                  <p>
                    {date.slice(0, 4)}. {date.slice(4, 6)}. {date.slice(6, 8)}
                  </p>
                </div>
                <p className="order-detail">
                  <Link to="/">주문 상세보기 {">"}</Link>
                </p>
              </div>
            )}

            <ul className="order-list">
              {dateOrders.map((order) => (
                <li className="order-product" key={order.id}>
                  <div className="img-box">
                    <img src={order.img} alt={order.name} />
                    <div className="product-text">
                      <p className="order-name">{order.name}</p>
                      <p className="order-price">{order.price}</p>
                      <p className="order-count">
                        {order.size} / {order.count}개
                      </p>
                    </div>
                  </div>

                  <div className="text-box">
                    {order.status !== "조회불가" && (
                      <>
                        <div
                          className={`status status-${statusCode[order.status]}`}
                        >
                          {order.status}
                        </div>

                        <div className="order-no">
                          <p>주문번호</p>
                          <span>
                            {order.date}-{order.id}
                          </span>
                        </div>
                        <div className="order-btn-wrap">
                          {renderButtons(order.status, order, onOrderClick)}
                        </div>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
}
