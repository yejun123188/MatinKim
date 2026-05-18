import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./scss/orderList.scss";
import OrderDateFilter from "./OrderDateFilter";
import OrderProduct from "./OrderProduct";
import OptionPopup from "./OptionPopup";
import { getQuickRangeValues } from "../utils/orderDateUtils";
import { getAllOrders } from "../utils/orderStorage";
import UserInfoNone from "./UserInfoNone";

const orderMenu = "주문내역";

const isWithinDateRange = (orderDate, range) => {
  const normalizedOrderDate = `${orderDate.slice(0, 4)}-${orderDate.slice(
    4,
    6,
  )}-${orderDate.slice(6, 8)}`;

  return (
    (!range?.startDate || normalizedOrderDate >= range.startDate) &&
    (!range?.endDate || normalizedOrderDate <= range.endDate)
  );
};

const getOrderSortTime = (order) => {
  const createdAtTime = new Date(order.createdAt || "").getTime();
  if (!Number.isNaN(createdAtTime)) return createdAtTime;

  const dateKey = String(order.date || "");
  if (/^\d{8}$/.test(dateKey)) {
    const year = dateKey.slice(0, 4);
    const month = dateKey.slice(4, 6);
    const day = dateKey.slice(6, 8);
    const dateTime = new Date(`${year}-${month}-${day}`).getTime();
    if (!Number.isNaN(dateTime)) return dateTime;
  }

  return 0;
};

export default function OrderList() {
  const navigate = useNavigate();

  const tab1Status = ["결제완료", "배송준비중", "배송중", "배송완료"];

  const tab2Status = [
    "취소요청처리중",
    "취소완료",
    "반품요청처리중",
    "반품완료",
    "교환요청처리중",
    "교환완료",
  ];

  const tab3Status = ["조회불가"];

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const orders = useMemo(
    () =>
      getAllOrders(now).flatMap((orderDetail) =>
        orderDetail.orders.map((order) => ({
          ...order,
          orderNumber: orderDetail.orderNumber,
          date: orderDetail.date,
          state: orderDetail.state,
          createdAt: orderDetail.createdAt,
          orderDetailId: orderDetail.id,
        })),
      ).sort((a, b) => getOrderSortTime(b) - getOrderSortTime(a)),
    [now],
  );

  const tab1Orders = orders.filter((order) =>
    tab1Status.includes(order.status),
  );
  const tab2Orders = orders.filter((order) =>
    tab2Status.includes(order.status),
  );
  const tab3Orders = orders.filter((order) =>
    tab3Status.includes(order.status),
  );

  const defaultRange = getQuickRangeValues("threeMonths");

  const availableHistoryYears = [
    ...new Set(tab3Orders.map((order) => Number(order.date.slice(0, 4)))),
  ].sort((a, b) => b - a);

  const defaultHistoryYear =
    availableHistoryYears[0] || new Date().getFullYear();

  const [tab, setTab] = useState("tab1");
  const [optionOpen, setOptionOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tab1Range, setTab1Range] = useState(defaultRange);
  const [tab2Range, setTab2Range] = useState(defaultRange);
  const [tab3Year, setTab3Year] = useState(defaultHistoryYear);

  const tab1Count = tab1Orders.length;
  const tab2Count = tab2Orders.length;
  const tab3Count = tab3Orders.length;

  const filteredTab1Orders = tab1Orders.filter((order) =>
    isWithinDateRange(order.date, tab1Range),
  );

  const filteredTab2Orders = tab2Orders.filter((order) =>
    isWithinDateRange(order.date, tab2Range),
  );

  const filteredTab3Orders = tab3Orders.filter(
    (order) => Number(order.date.slice(0, 4)) === Number(tab3Year),
  );

  const filteredOrders =
    tab === "tab1"
      ? filteredTab1Orders
      : tab === "tab2"
        ? filteredTab2Orders
        : filteredTab3Orders;

  const filterAnimationKey =
    tab === "tab1"
      ? `${tab}-${tab1Range.type}-${tab1Range.startDate}-${tab1Range.endDate}`
      : tab === "tab2"
        ? `${tab}-${tab2Range.type}-${tab2Range.startDate}-${tab2Range.endDate}`
        : `${tab}-${tab3Year}`;

  const handleDetailSelect = (orderDetailId) => {
    if (!orderDetailId) return;

    navigate(`/userInfo/orders/${orderDetailId}`, {
      state: { menu: orderMenu },
    });
  };

  const handleRequestNavigate = (action, order) => {
    if (!order?.orderDetailId || !order?.id) return;

    navigate(`/userInfo/orders/${order.orderDetailId}/${action}/${order.id}`, {
      state: { menu: orderMenu },
    });
  };

  const handleTrackingNavigate = (order) => {
    if (!order?.orderDetailId || !order?.id) return;

    navigate(`/userInfo/orders/${order.orderDetailId}/tracking/${order.id}`, {
      state: { menu: orderMenu },
    });
  };

  return (
    <>
      <div className="order-list-section">
        <div className="order-tap-menu">
          <button
            className={tab === "tab1" ? "active" : ""}
            onClick={() => setTab("tab1")}
          >
            주문내역조회<span className="order-tab-count">({tab1Count})</span>
          </button>

          <button
            className={tab === "tab2" ? "active" : ""}
            onClick={() => setTab("tab2")}
          >
            취소/반품/교환 내역<span className="order-tab-count">({tab2Count})</span>
          </button>

          <button
            className={tab === "tab3" ? "active" : ""}
            onClick={() => setTab("tab3")}
          >
            과거주문내역<span className="order-tab-count">({tab3Count})</span>
          </button>
        </div>

        <div className="order-tab-content">
          {tab === "tab1" && (
            <div className="tab-order-wrap">
              <OrderDateFilter
                showFilter1
                initialRangeType={tab1Range.type}
                initialStartDate={tab1Range.startDate}
                initialEndDate={tab1Range.endDate}
                onRangeChange={setTab1Range}
              />

              {filteredOrders.length > 0 ? (
                <OrderProduct
                  key={filterAnimationKey}
                  orderDate="주문완료"
                  orders={filteredOrders}
                  onDetailClick={handleDetailSelect}
                  onCancelClick={(order) =>
                    handleRequestNavigate("cancel", order)
                  }
                  onExchangeClick={(order) =>
                    handleRequestNavigate("exchange", order)
                  }
                  onReturnClick={(order) =>
                    handleRequestNavigate("return", order)
                  }
                  onTrackingClick={handleTrackingNavigate}
                />
              ) : (
                <UserInfoNone title="주문" />
              )}
            </div>
          )}

          {tab === "tab2" && (
            <div className="tab-order-wrap">
              <OrderDateFilter
                showFilter1
                initialRangeType={tab2Range.type}
                initialStartDate={tab2Range.startDate}
                initialEndDate={tab2Range.endDate}
                onRangeChange={setTab2Range}
              />

              {filteredOrders.length > 0 ? (
                <OrderProduct
                  key={filterAnimationKey}
                  orderDate="취소/반품"
                  orders={filteredOrders}
                  onDetailClick={handleDetailSelect}
                  onCancelClick={(order) =>
                    handleRequestNavigate("cancel", order)
                  }
                  onExchangeClick={(order) =>
                    handleRequestNavigate("exchange", order)
                  }
                  onReturnClick={(order) =>
                    handleRequestNavigate("return", order)
                  }
                  onTrackingClick={handleTrackingNavigate}
                  onOrderClick={(order) => {
                    setSelectedItem(order);
                    setOptionOpen(true);
                  }}
                />
              ) : (
                <UserInfoNone title="주문" />
              )}
            </div>
          )}

          {tab === "tab3" && (
            <div className="tab-order-wrap">
              <OrderDateFilter
                showFilter2
                initialYear={tab3Year}
                yearOptions={availableHistoryYears}
                onYearChange={setTab3Year}
              />

              {filteredOrders.length > 0 ? (
                <OrderProduct key={filterAnimationKey} orders={filteredOrders} />
              ) : (
                <UserInfoNone title="주문" />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="order-tab-text">
        {(tab === "tab1" || tab === "tab2") && (
          <ul>
            <li>
              기본적으로 최근 3개월간의 자료가 조회되며, 기간 검색시 지난
              주문내역을 조회하실 수 있습니다.
            </li>
            <li>
              주문상태가 "배송준비중"이더라도 실제 상품이 출고된 경우 요청사항이
              거부될 수 있습니다.
            </li>
          </ul>
        )}

        {tab === "tab3" && (
          <ul>
            <li>
              주문처리완료 후 36개월 이내의 최근 주문건은 주문내역조회 탭에서
              확인할 수 있습니다.
            </li>
            <li>
              상품구매금액은 주문 당시의 판매가와 옵션추가금액의 합(부가세
              포함)에 수량이 반영된 값입니다.
            </li>
          </ul>
        )}
      </div>

      <OptionPopup
        open={optionOpen}
        data={selectedItem}
        onClose={() => setOptionOpen(false)}
      />
    </>
  );
}
