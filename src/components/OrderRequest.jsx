import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById, requestOrderAction } from "../utils/orderStorage";
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
    selectList: cancelList,
    detailState: "주문 취소",
    notices: [
      "상품 준비 또는 배송이 시작된 경우 취소가 불가할 수 있습니다.",
      "취소 완료 후 환불까지 일정 기간이 소요될 수 있습니다.",
      "사용한 쿠폰 및 적립금은 취소 완료 시 복구됩니다.",
    ],
  },
  exchange: {
    select: "교환 상품을 선택하세요",
    detailState: "교환 신청",
    notices: [
      "교환 신청은 상품 수령 후 7일 이내에 접수해 주세요.",
      "사용 흔적이나 훼손이 있는 경우 교환이 제한될 수 있습니다.",
    ],
  },
  return: {
    select: "반품 상품을 선택하세요",
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

  const orderDetail = getOrderById(id);
  const actionState = actionMent[action];
  const isCancelAction = action === "cancel";

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

  const optionList = isCancelAction
    ? actionState.selectList.map((item) => ({
        value: item,
        label: item,
      }))
    : productOptions;

  return (
    <OrderRequestForm
      key={`${action}-${itemId || ""}`}
      actionState={actionState}
      action={action}
      isCancelAction={isCancelAction}
      itemId={itemId}
      navigate={navigate}
      optionList={optionList}
      orderDetail={orderDetail}
    />
  );
}

function OrderRequestForm({
  actionState,
  action,
  isCancelAction,
  itemId,
  navigate,
  optionList,
  orderDetail,
}) {
  const [selectedValue, setSelectedValue] = useState(
    isCancelAction ? "" : itemId || "",
  );
  const [selectedList, setSelectedList] = useState(
    !isCancelAction && itemId ? [itemId] : [],
  );
  const [note, setNote] = useState("");
  const [showError, setShowError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const selectedLabel =
    optionList.find((option) => option.value === selectedValue)?.label ||
    "취소 사유를 선택해 주세요.";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = () => {
    if (
      (isCancelAction && !selectedValue) ||
      (!isCancelAction && selectedList.length === 0)
    ) {
      setShowError(true);
      return;
    }

    window.alert(`${actionState.detailState} 접수되었습니다.`);
    requestOrderAction({
      orderDetailId: orderDetail.id,
      itemIds: isCancelAction ? [itemId] : selectedList,
      action,
    });
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
              {isCancelAction ? (
                <div className="request-select-wrap">
                  <div className="request-dropdown" ref={dropdownRef}>
                    <button
                      className={`request-dropdown-btn${
                        !selectedValue ? " is-placeholder" : ""
                      }${isOpen ? " is-open" : ""}`}
                      onClick={() => setIsOpen((prev) => !prev)}
                    >
                      <span>{selectedLabel}</span>
                      <img
                        className="request-dropdown-arrow"
                        src="/images/userinfo/input-under-btn.svg"
                        alt="input-under-btn"
                      />
                    </button>

                    <div
                      className={`request-dropdown-menu${isOpen ? " is-open" : ""}`}
                    >
                      {optionList.map((option) => (
                        <button
                          type="button"
                          key={option.value}
                          className={`request-dropdown-item${
                            selectedValue === option.value ? " is-active" : ""
                          }`}
                          onClick={() => {
                            setSelectedValue(option.value);
                            setIsOpen(false);
                            setShowError(false);
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="request-option-list">
                  {optionList.map((option) => {
                    const isActive = selectedList.includes(option.value);

                    return (
                      <button
                        type="button"
                        key={option.value}
                        className={`request-option-btn${
                          isActive ? " is-active" : ""
                        }`}
                        onClick={() => {
                          setSelectedList((prev) =>
                            prev.includes(option.value)
                              ? prev.filter((v) => v !== option.value)
                              : [...prev, option.value],
                          );
                          setShowError(false);
                        }}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}

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
            <ul>
              {actionState.notices.map((notice) => (
                <li key={notice}>{notice}</li>
              ))}
            </ul>

            <button
              type="button"
              className="request-submit-btn"
              onClick={handleSubmit}
            >
              {actionState.detailState}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
