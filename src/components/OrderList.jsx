import React, { useState } from "react";
import "./scss/orderList.scss";
import OrderDateFilter from "./OrderDateFilter";

export default function OrderList() {
  const [tab, setTab] = useState("tab1");

  return (
    <>
      <div className="orderlist-wrap">
        <div className="order-tap-menu">
          <button
            className={tab === "tab1" ? "active" : ""}
            onClick={() => setTab("tab1")}
          >
            주문내역조회
          </button>
          <button
            className={tab === "tab2" ? "active" : ""}
            onClick={() => setTab("tab2")}
          >
            취소/반품/교환 내역(0)
          </button>
          <button
            className={tab === "tab3" ? "active" : ""}
            onClick={() => setTab("tab3")}
          >
            과거주문내역(0)
          </button>
        </div>
        <div className="order-tab-content">
          {tab === "tab1" && (
            <div className="tab-order-wrap">
              <OrderDateFilter showFilter1 />
            </div>
          )}
          {tab === "tab2" && (
            <div className="tab-order-wrap">
              <OrderDateFilter showFilter1 />
            </div>
          )}
          {tab === "tab3" && (
            <div className="tab-order-wrap">
              <OrderDateFilter showFilter2 />
            </div>
          )}
        </div>
      </div>
      <div className="order-tab-text">
        {tab === "tab1" && (
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
        {tab === "tab2" && (
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
    </>
  );
}
