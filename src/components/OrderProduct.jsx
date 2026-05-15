import React from "react";

const statusCode = {
  결제완료: "ORDER",
  배송준비중: "READY",
  배송중: "ING",
  배송완료: "DONE",
  취소요청처리중: "CANCEL_REQ",
  취소완료: "CANCEL_DONE",
  반품요청처리중: "RETURN_REQ",
  반품완료: "RETURN_DONE",
  교환요청처리중: "EXCHANGE_REQ",
  교환완료: "EXCHANGE_DONE",
  조회불가: "NONE",
};

// 배송완료 → 짧게 표시
const statusLabel = {
  배송완료: "배송완료",
};

const formatPrice = (price) => `₩ ${Number(price || 0).toLocaleString()}`;
const formatCount = (count) => `${Number(count || 1).toLocaleString()}개`;

const getOrderDateLabel = (orderDate, order) => {
  if (orderDate !== "취소/반품") return orderDate;
  if (order.status.startsWith("취소")) return "취소요청완료";
  if (order.status.startsWith("반품")) return "반품요청완료";
  if (order.status.startsWith("교환")) return "교환요청완료";
  return orderDate;
};

const renderButtons = (
  status,
  order,
  { onOrderClick, onCancelClick, onExchangeClick, onReturnClick, onTrackingClick },
) => {
  if (status === "결제완료" || status === "배송준비중") {
    return (
      <button type="button" className="btn btn--ghost" onClick={() => onCancelClick?.(order)}>
        주문취소
      </button>
    );
  }

  if (status === "배송시작" || status === "배송중") {
    return (
      <button type="button" className="btn btn--ghost" onClick={() => onTrackingClick?.(order)}>
        배송조회
      </button>
    );
  }

  if (status === "배송완료") {
    return (
      <div className="order-btn">
        <button type="button" className="btn btn--filled" onClick={() => onExchangeClick?.(order)}>
          교환신청
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => onReturnClick?.(order)}>
          반품신청
        </button>
      </div>
    );
  }

  return (
    <button type="button" className="btn btn--filled" onClick={() => onOrderClick?.(order)}>
      상품주문
    </button>
  );
};

export default function OrderProduct({
  orderDate,
  orders = [],
  onOrderClick,
  onDetailClick,
  onCancelClick,
  onExchangeClick,
  onReturnClick,
  onTrackingClick,
  showHeader = true,
  showOrderNumber = true,
  showActionButtons = true,
}) {
  const orderNumbers = [...new Set(orders.map((order) => order.orderNumber))];

  return (
    <>
      {orderNumbers.map((orderNumber) => {
        const groupedOrders = orders.filter((order) => order.orderNumber === orderNumber);
        const representativeOrder = groupedOrders[0];
        const showTitle = groupedOrders.some((order) => order.status !== "조회불가");

        return (
          <div className="order-list-wrap" key={orderNumber}>
            {showHeader && showTitle && (
              <div className="order-list-title">
                <div className="order-list-box">
                  <span className="order-title__status">
                    {getOrderDateLabel(orderDate, representativeOrder)}
                  </span>
                  <span className="order-title__date">
                    {representativeOrder.date.slice(0, 4)}.
                    {representativeOrder.date.slice(4, 6)}.
                    {representativeOrder.date.slice(6, 8)}
                  </span>
                </div>
                {onDetailClick && (
                  <button
                    type="button"
                    className="order-detail-btn"
                    onClick={() => onDetailClick(representativeOrder.orderDetailId)}
                  >
                    주문 상세보기 {">"}
                  </button>
                )}
              </div>
            )}

            <ul className="order-list">
              {groupedOrders.map((order) => (
                <li className="order-product" key={order.id}>
                  <div className="img-box">
                    <img src={order.img} alt={order.name} />
                    <div className="product-text">
                      <p className="order-name">{order.name}</p>
                      <p className="order-price">{formatPrice(order.price)}</p>
                      <p className="order-count">
                        {order.size || "-"} / {formatCount(order.count)}
                      </p>
                    </div>
                  </div>

                  <div className="text-box">
                    {order.status !== "조회불가" && (
                      <>
                        <div className={`status status-${statusCode[order.status]}`}>
                          <img src="/images/icon/check.svg" alt="" />
                          {statusLabel[order.status] ?? order.status}
                        </div>

                        {showOrderNumber && (
                          <div className="order-no">
                            <p>주문번호</p>
                            <span>{order.orderNumber}</span>
                          </div>
                        )}
                        {showActionButtons && (
                          <div className="order-btn-wrap">
                            {renderButtons(order.status, order, {
                              onOrderClick,
                              onCancelClick,
                              onExchangeClick,
                              onReturnClick,
                              onTrackingClick,
                            })}
                          </div>
                        )}
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
