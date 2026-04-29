import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ordersData from "../data/ordersData";
import "./scss/orderTracking.scss";

const orderMenu = "주문내역";

const TRACKING_STEPS = [
  {
    dayOffset: 1,
    hours: 18,
    minutes: 43,
    label: "상품인수",
    description: "보내시는 고객님으로부터 상품을 인수받았습니다.",
  },
  {
    dayOffset: 1,
    hours: 21,
    minutes: 22,
    label: "상품이동중",
    description: "물류센터로 상품이 이동중입니다.",
  },
  {
    dayOffset: 2,
    hours: 2,
    minutes: 21,
    label: "상품이동중",
    description: "배송지역으로 상품이 이동중입니다.",
  },
  {
    dayOffset: 2,
    hours: 11,
    minutes: 38,
    label: "배송지도착",
    description: "고객님의 상품이 배송지에 도착하였습니다.",
  },
  {
    dayOffset: 2,
    hours: 13,
    minutes: 39,
    label: "배송출발",
    description: "고객님의 상품을 배송할 예정입니다.",
  },
  {
    dayOffset: 2,
    hours: 17,
    minutes: 12,
    label: "배송완료",
    description: "고객님의 상품 배송이 완료되었습니다.",
  },
];

const TRACKING_STEP_COUNT = {
  배송준비중: 2,
  배송시작: 4,
  배송중: 5,
  배송완료: 6,
};

const formatOrderDate = (date) =>
  `${date.slice(0, 4)}. ${date.slice(4, 6)}. ${date.slice(6, 8)}`;

const formatExpectedDate = (date) =>
  `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate(),
  ).padStart(2, "0")}`;

const formatTrackingDateTime = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours(),
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

const parseOrderDate = (date) =>
  new Date(
    Number(date.slice(0, 4)),
    Number(date.slice(4, 6)) - 1,
    Number(date.slice(6, 8)),
  );

const createTrackingHistory = (date, status) => {
  const baseDate = parseOrderDate(date);
  const stepCount = TRACKING_STEP_COUNT[status] || 5;

  return TRACKING_STEPS.slice(0, stepCount).map((step) => {
    const trackingDate = new Date(baseDate);
    trackingDate.setDate(baseDate.getDate() + step.dayOffset);
    trackingDate.setHours(step.hours, step.minutes, 0, 0);

    return {
      ...step,
      dateTime: formatTrackingDateTime(trackingDate),
    };
  });
};

export default function OrderTracking() {
  const navigate = useNavigate();
  const { id, itemId } = useParams();

  const orderDetail = ordersData.find((item) => String(item.id) === id);
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

  const orderDate = parseOrderDate(orderDetail.date);
  const expectedArrivalDate = new Date(orderDate);
  expectedArrivalDate.setDate(expectedArrivalDate.getDate() + 2);

  const trackingHistory = createTrackingHistory(
    orderDetail.date,
    selectedOrder.status,
  );

  const currentStatus =
    trackingHistory[trackingHistory.length - 1]?.label || "배송준비중";

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
            <p className="tracking-order-date">
              {formatOrderDate(orderDetail.date)} 주문
            </p>
            <div className="tracking-order-number">
              <span>주문번호</span>
              <strong>{orderDetail.orderNumber}</strong>
            </div>
          </div>

          <div className="tracking-status">
            <div className="tracking-status-head">
              <h4>배송 진행 상태</h4>
              <p>예상 도착일 {formatExpectedDate(expectedArrivalDate)}</p>
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
