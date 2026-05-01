import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById, getTrackingHistory } from "../utils/orderStorage";
import "./scss/orderTracking.scss";

const orderMenu = "주문내역";

export default function OrderTracking() {
  const navigate = useNavigate();
  const { id, itemId } = useParams();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const orderDetail = getOrderById(id, now);
  const selectedOrder =
    orderDetail?.orders.find((order) => String(order.id) === itemId) ||
    orderDetail?.orders[0];

  if (!orderDetail || !selectedOrder) {
    return (
      <div className="order-tracking-page is-empty">
        <p>배송 조회할 주문 정보를 찾을 수 없습니다.</p>
        <button
          type="button"
          className="tracking-carrier-btn"
          onClick={() => navigate("/userInfo", { state: { menu: orderMenu } })}
        >
          주문내역으로 돌아가기
        </button>
      </div>
    );
  }

  const trackingHistory = getTrackingHistory(orderDetail, now);
  const currentStatus =
    trackingHistory[trackingHistory.length - 1]?.label || selectedOrder.status;

  const handleCarrierClick = () => {
    window.alert("택배사 배송조회 연결은 아직 준비 중입니다.");
  };

  return (
    <>
      <div className="order-tracking-top">
        <h2>배송 조회</h2>
        <button
          type="button"
          className="tracking-back-btn"
          onClick={() => navigate("/userInfo", { state: { menu: orderMenu } })}
        >
          목록으로
        </button>
      </div>

      <div className="order-tracking-page">
        <section className="order-tracking-section">
          <div className="tracking-summary">
            <h3>{currentStatus}</h3>
          </div>

          <div className="tracking-status">
            <div className="tracking-status-head">
              <h4>배송 진행 상태</h4>
            </div>

            <ul className="tracking-history">
              {trackingHistory.map((item) => (
                <li key={`${item.dateTime}-${item.label}`}>
                  <span>{item.dateTime}</span>
                  <strong>{item.label}</strong>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="tracking-footer">
          <p>자세한 배송 정보는 택배사 조회 페이지에서 확인하실 수 있습니다.</p>
          <button
            type="button"
            className="tracking-carrier-btn"
            onClick={handleCarrierClick}
          >
            배송 조회
          </button>
        </div>
      </div>
    </>
  );
}
