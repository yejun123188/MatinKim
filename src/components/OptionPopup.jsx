import React from "react";
import "./scss/optionPopup.scss";

export default function OptionPopup({ open, onClose }) {
  return (
    <div className={`option-bg ${open ? "open" : "close"}`} onClick={onClose}>
      <div className="option-pop-wrap" onClick={(e) => e.stopPropagation()}>
        <div className="op-check">
          <p>옵션선택</p>
          <img src="./images/closebtn.svg" alt="" onClick={onClose} />
        </div>
        <p className="op-name">
          PATCHWORK CARGO BERMUDA PANTS FOR MEN IN BEIGE
        </p>
        <div className="op-box op-size">
          <p className="op-title">SIZE</p>
          <div className="size-text">
            <div className="btn-wrap">
              <button className="btn">S</button>
              <button className="btn">M</button>
            </div>
            <p>[필수] 옵션을 선택해 주세요</p>
          </div>
        </div>
        <div className="op-box op-count">
          <p className="op-title">수량</p>
          <div className="btn-wrap">
            <button className="btn">-</button>
            <p>0</p>
            <button className="btn">+</button>
          </div>
        </div>
        <div>
          <div className="op-total">
            <p>총 상품금액 : </p>
            <p>￦198,000</p>
          </div>
        </div>
        <div className="op-buy-button">
          <button className="Bbtn">Buy It Now</button>
          <button className="btn">Add to cart</button>
        </div>
      </div>
    </div>
  );
}
