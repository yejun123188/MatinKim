import React, { useState } from "react";
import "./scss/orderList.scss";
import OrderDateFilter from "./OrderDateFilter";
import OrderProduct from "./OrderProduct";
import OptionPopup from "./OptionPopup";

export default function OrderList() {
  const [tab, setTab] = useState("tab1");
  const [optionOpen, setOptionOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const orders = [
    {
      id: 1,
      name: "MATIN KIM CIRCLE LOGO TOP FOR MEN IN BLACK",
      img: "https://matinkim.com/web/product/medium/202604/d6581a7ba9b5fa28d8890d1ad3aa9b42.jpg",
      price: 68000,
      status: "배송준비중",
      size: "L",
      count: 1,
      date: "20260420",
    },
    {
      id: 2,
      name: "PATCHWORK CARGO BERMUDA PANTS FOR MEN IN BEIGE",
      img: "https://matinkim.com/web/product/medium/202604/af24497fdacbac8b575687c878af7669.jpg",
      price: 198000,
      status: "배송중",
      size: "L",
      count: 1,
      date: "20260419",
    },
    {
      id: 3,
      name: "MATIN LIGHT MESH CAP IN BLACK",
      img: "https://cafe24img.poxo.com/kimdaniyaya/web/product/medium/202603/de8e4df27a4d897c4f265a7c5ac38a09.jpg",
      price: 58000,
      status: "배송완료",
      size: "FREE",
      count: 1,
      date: "20260419",
    },
    {
      id: 4,
      name: "CAMOUFLAGE LOGO BALL CAP IN BEIGE",
      img: "https://cafe24img.poxo.com/kimdaniyaya/web/product/medium/202602/377cb8c737dfecc223743aada3501cf5.jpg",
      price: 68000,
      status: "취소요청처리중",
      size: "FREE",
      count: 1,
      date: "20260418",
    },
    {
      id: 5,
      name: "WAIST BUCKLE STITCH POINT TWILL DENIM PANTS IN BROWN",
      img: "https://matinkim.com/web/product/medium/202602/fd89a5a318d1273c27a797ae411a5273.jpg",
      price: 124600,
      status: "반품완료",
      size: "M",
      count: 1,
      date: "20260417",
    },
    {
      id: 6,
      name: "WAIST BUCKLE STITCH POINT TWILL DENIM PANTS IN BROWN",
      img: "https://matinkim.com/web/product/medium/202602/fd89a5a318d1273c27a797ae411a5273.jpg",
      price: 124600,
      status: "조회불가",
      size: "M",
      count: 1,
      date: "20220420",
    },
  ];

  const tab1Status = [
    "주문확인중",
    "배송준비중",
    "배송시작",
    "배송중",
    "배송완료",
  ];

  const tab2Status = [
    "취소요청처리중",
    "취소완료",
    "반품요청처리중",
    "반품완료",
  ];

  const tab3Status = ["조회불가"];

  const tab1Count = orders.filter((o) => tab1Status.includes(o.status)).length;
  const tab2Count = orders.filter((o) => tab2Status.includes(o.status)).length;
  const tab3Count = orders.filter((o) => tab3Status.includes(o.status)).length;

  const filteredOrders =
    tab === "tab1"
      ? orders.filter((o) => tab1Status.includes(o.status))
      : tab === "tab2"
        ? orders.filter((o) => tab2Status.includes(o.status))
        : tab === "tab3"
          ? orders.filter((o) => tab3Status.includes(o.status))
          : [];

  return (
    <>
      <div className="order-list-section">
        <div className="order-tap-menu">
          <button
            className={tab === "tab1" ? "active" : ""}
            onClick={() => setTab("tab1")}
          >
            주문내역조회({tab1Count})
          </button>

          <button
            className={tab === "tab2" ? "active" : ""}
            onClick={() => setTab("tab2")}
          >
            취소/반품/교환 내역({tab2Count})
          </button>

          <button
            className={tab === "tab3" ? "active" : ""}
            onClick={() => setTab("tab3")}
          >
            과거주문내역({tab3Count})
          </button>
        </div>

        <div className="order-tab-content">
          {tab === "tab1" && (
            <div className="tab-order-wrap">
              <OrderDateFilter showFilter1 />
              <OrderProduct orderDate="주문완료" orders={filteredOrders} />
            </div>
          )}

          {tab === "tab2" && (
            <div className="tab-order-wrap">
              <OrderDateFilter showFilter1 />
              <OrderProduct
                orderDate="취소요청"
                orders={filteredOrders}
                onOrderClick={(order) => {
                  setSelectedItem(order);
                  setOptionOpen(true);
                }}
              />
            </div>
          )}

          {tab === "tab3" && (
            <div className="tab-order-wrap">
              <OrderDateFilter showFilter2 />
              <OrderProduct orders={filteredOrders} />
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
