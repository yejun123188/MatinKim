import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ordersData from "../data/ordersData";
import "./scss/orderRequest.scss";

const orderMenu = "주문내역";

const cancelList = [
  "단순 변심",
  "사이즈/색상 선택 오류",
  "다른 상품으로 재주문 예정",
  "배송이 늦어져서",
  "상품 정보/이미지가 기대와 다름",
  "결제 오류 또는 중복 결제",
  "기타 (직접 입력)",
];

const actionMent = {
  cancel: {
    select: "취소 사유를 선택하세요",
    selectTitle: "취소 사유",
    selectList: cancelList,
    detailState: "취소 신청",
    notices: [
      "상품 준비 또는 배송이 시작된 경우 취소가 불가할 수 있습니다.",
      "취소 완료 후 환불까지 일정 기간이 소요될 수 있습니다.",
      "사용한 쿠폰 및 적립금은 취소 완료 시 복구됩니다.",
    ],
  },
  exchange: {
    select: "교환 상품을 선택하세요",
    selectTitle: "교환 상품",
    detailState: "교환 신청",
    notices: [
      "교환 신청은 상품 수령 후 7일 이내에 접수해 주세요.",
      "사용 흔적이나 훼손이 있는 경우 교환이 제한될 수 있습니다.",
    ],
  },
  return: {
    select: "반품 상품을 선택하세요",
    selectTitle: "반품 상품",
    detailState: "반품 신청",
    notices: [
      "반품 신청은 상품 수령 후 7일 이내에 접수해 주세요.",
      "검수 완료 후 환불까지 영업일 기준 3~5일 정도 소요될 수 있습니다.",
    ],
  },
};

const formatDate = (date) =>
  `${date.slice(0, 4)}. ${date.slice(4, 6)}. ${date.slice(6, 8)}`;

const formatProductOption = (order) =>
  `${order.name} / ${order.size} / ${order.count}개`;

export default function OrderRequest() {
  const navigate = useNavigate();
  const { id, action, itemId } = useParams();

  const orderDetail = ordersData.find((item) => String(item.id) === id);
  const actionState = actionMent[action];

  const [selectedValue, setSelectedValue] = useState("");
  const [selectedList, setSelectedList] = useState([]);
  const [note, setNote] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setSelectedValue(action === "cancel" ? "" : itemId || "");
    setSelectedList([]);
    setNote("");
    setShowError(false);
  }, [action, itemId]);

  if (!orderDetail || !actionState) {
    return (
      <div className="order-request-page is-empty">
        <p>신청할 주문 정보를 찾을 수 없습니다.</p>
        <button
          type="button"
          className="request-submit-btn"
          onClick={() => navigate("/userInfo", { state: { menu: orderMenu } })}
        >
          주문내역으로 돌아가기
        </button>
      </div>
    );
  }

  const productOptions = orderDetail.orders.map((order) => ({
    value: String(order.id),
    label: formatProductOption(order),
  }));

  const optionList =
    action === "cancel"
      ? actionState.selectList.map((item) => ({
          value: item,
          label: item,
        }))
      : productOptions;

  const handleSubmit = () => {
    if (
      (action === "cancel" && !selectedValue) ||
      (action !== "cancel" && selectedList.length === 0)
    ) {
      setShowError(true);
      return;
    }

    window.alert(`${actionState.detailState}이 접수되었습니다.`);
    navigate("/userInfo", { state: { menu: orderMenu } });
  };

  return (
    <>
      <div className="order-request-top">
        <h2>{actionState.detailState}</h2>
        <button
          type="button"
          className="request-back-btn"
          onClick={() => navigate(-1)}
        >
          목록으로
        </button>
      </div>

      <div className="order-request-page">
        <div className="request-section">
          <div className="request-order-info">
            <h2>주문정보</h2>

            <div>
              <p>주문일자</p>
              <span>{formatDate(orderDetail.date)}</span>
            </div>

            <div>
              <p>주문번호</p>
              <span>{orderDetail.orderNumber}</span>
            </div>
          </div>
        </div>

        <div className="request-section">
          <div className="request-form-top">
            <h3>{actionState.select}</h3>

            <div className="request-field">
              <p className="request-field-title">{actionState.selectTitle}</p>

              <div className="request-option-list">
                {optionList.map((option) => {
                  const isActive =
                    action === "cancel"
                      ? selectedValue === option.value
                      : selectedList.includes(option.value);

                  return (
                    <button
                      type="button"
                      key={option.value}
                      className={`request-option-btn${
                        isActive ? " is-active" : ""
                      }`}
                      onClick={() => {
                        if (action === "cancel") {
                          setSelectedValue(option.value);
                        } else {
                          setSelectedList((prev) =>
                            prev.includes(option.value)
                              ? prev.filter((v) => v !== option.value)
                              : [...prev, option.value],
                          );
                        }

                        setShowError(false);
                      }}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {showError && (
                <p className="field-error">항목을 먼저 선택해 주세요.</p>
              )}
            </div>

            <div className="request-field">
              <p className="request-field-title">상세 내용</p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="추가로 전달할 내용이 있다면 입력해주세요."
              />
            </div>
          </div>

          <div className="request-notice-box">
            <h4>유의사항</h4>
            <ul>
              {actionState.notices.map((notice) => (
                <li key={notice}>{notice}</li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            className="request-submit-btn"
            onClick={handleSubmit}
          >
            {actionState.detailState}
          </button>
        </div>
      </div>
    </>
  );
}
